"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";

type JobStatus =
  | "assigned"
  | "in_progress"
  | "ready_for_inspection"
  | "inspected";

interface MyJob {
  id: string;
  status: JobStatus;
  priority: number;
  is_departure: boolean;
  estimated_minutes: number | null;
  started_at: string | null;
  completed_at: string | null;
  rooms: {
    room_number: string;
    floor: number;
    room_type: string;
  };
}

export default function HousekeeperView() {
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMyJobs = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const date = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("cleaning_jobs")
      .select(
        `
        id, status, priority, is_departure,
        estimated_minutes, started_at, completed_at,
        rooms ( room_number, floor, room_type )
      `
      )
      .eq("assigned_to", user.id)
      .eq("job_date", date)
      .order("rooms(floor)", { ascending: true });

    setJobs((data ?? []) as unknown as MyJob[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMyJobs();
    const supabase = createClient();
    const channel = supabase
      .channel("my-jobs")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cleaning_jobs",
        },
        fetchMyJobs
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMyJobs]);

  async function updateStatus(jobId: string, newStatus: JobStatus) {
    setUpdating(jobId);
    const supabase = createClient();
    const updates: Record<string, unknown> = { status: newStatus };

    if (newStatus === "in_progress") {
      updates.started_at = new Date().toISOString();
    } else if (newStatus === "ready_for_inspection") {
      updates.completed_at = new Date().toISOString();
    }

    await supabase.from("cleaning_jobs").update(updates).eq("id", jobId);
    await fetchMyJobs();
    setUpdating(null);
  }

  const done = jobs.filter(
    (j) =>
      j.status === "ready_for_inspection" || j.status === "inspected"
  ).length;
  const total = jobs.length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Loading your rooms...
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-base font-semibold text-neutral-900 dark:text-white">
          No rooms assigned yet
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Your supervisor will generate assignments shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 shadow-black/5 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {done} / {total}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              rooms completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {total - done}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              remaining
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <motion.div
            animate={{
              width: total > 0 ? `${(done / total) * 100}%` : "0%",
            }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-neutral-800 dark:bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <HousekeeperRoomCard
            key={job.id}
            job={job}
            updating={updating === job.id}
            onUpdate={updateStatus}
          />
        ))}
      </div>
    </div>
  );
}

function HousekeeperRoomCard({
  job,
  updating,
  onUpdate,
}: {
  job: MyJob;
  updating: boolean;
  onUpdate: (id: string, status: JobStatus) => void;
}) {
  const isAssigned = job.status === "assigned";
  const isInProgress = job.status === "in_progress";
  const isReady = job.status === "ready_for_inspection";
  const isInspected = job.status === "inspected";

  return (
    <motion.div
      layout
      className={`rounded-xl p-4 shadow-sm ring-1 ${
        isInspected
          ? "bg-neutral-50 shadow-black/5 ring-black/5 dark:bg-neutral-900/50 dark:shadow-white/5 dark:ring-white/5"
          : "bg-white shadow-black/5 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Room {job.rooms?.room_number}
            </span>
            {job.priority > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                Priority
              </span>
            )}
            {job.is_departure && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                Departure
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Floor {job.rooms?.floor} · {job.rooms?.room_type}
            {job.estimated_minutes ? ` · ~${job.estimated_minutes} min` : ""}
          </p>
        </div>

        <div
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isInspected
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : isReady
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
                : isInProgress
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          }`}
        >
          {isInspected
            ? "Inspected"
            : isReady
              ? "Ready"
              : isInProgress
                ? "Cleaning"
                : "Assigned"}
        </div>
      </div>

      {!isInspected && (
        <div className="mt-4">
          {isAssigned && (
            <button
              onClick={() => onUpdate(job.id, "in_progress")}
              disabled={updating}
              className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {updating ? "..." : "Start cleaning"}
            </button>
          )}
          {isInProgress && (
            <button
              onClick={() => onUpdate(job.id, "ready_for_inspection")}
              disabled={updating}
              className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {updating ? "..." : "Room ready"}
            </button>
          )}
          {isReady && (
            <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
              Waiting for inspection
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
