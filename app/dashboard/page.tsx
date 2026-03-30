"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

type JobStatus =
  | "assigned"
  | "in_progress"
  | "ready_for_inspection"
  | "inspected"
  | "no_service"
  | "skipped";

interface CleaningJob {
  id: string;
  status: JobStatus;
  priority: number;
  is_departure: boolean;
  estimated_minutes: number | null;
  assigned_to: string | null;
  started_at: string | null;
  completed_at: string | null;
  rooms: {
    room_number: string;
    floor: number;
    room_type: string;
  };
  users: {
    first_name: string | null;
  } | null;
}

interface StaffMember {
  id: string;
  first_name: string | null;
  speed_factor: number;
}

interface AssignmentResult {
  staff_id: string;
  staff_name: string | null;
  room_ids: string[];
  room_numbers: string[];
  estimated_minutes: number;
  floor_cluster: number[];
}

interface GenerateStats {
  total_rooms: number;
  total_staff: number;
  max_deviation_minutes: number;
  balance_score: number;
  generated_at: string;
}

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  assigned: {
    label: "Assigned",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-500 dark:text-neutral-400",
    dot: "bg-neutral-400",
  },
  in_progress: {
    label: "Cleaning",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-400",
  },
  ready_for_inspection: {
    label: "Ready",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-500",
    dot: "bg-green-500",
  },
  inspected: {
    label: "Inspected",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  no_service: {
    label: "No service",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-400 dark:text-neutral-500",
    dot: "bg-neutral-300",
  },
  skipped: {
    label: "Skipped",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-400 dark:text-neutral-500",
    dot: "bg-neutral-300",
  },
};

export default function SupervisorDashboard() {
  const [jobs, setJobs] = useState<CleaningJob[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [assignments, setAssignments] = useState<AssignmentResult[]>([]);
  const [stats, setStats] = useState<GenerateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [noJobsYet, setNoJobsYet] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userData } = await supabase
      .from("users")
      .select("hotel_id")
      .eq("id", user.id)
      .single();

    if (!userData?.hotel_id) {
      setNoJobsYet(true);
      setLoading(false);
      return;
    }

    const date = new Date().toISOString().split("T")[0];

    const { data: jobsData } = await supabase
      .from("cleaning_jobs")
      .select(
        `
        id, status, priority, is_departure, estimated_minutes,
        assigned_to, started_at, completed_at,
        rooms ( room_number, floor, room_type ),
        users ( first_name )
      `
      )
      .eq("hotel_id", userData.hotel_id)
      .eq("job_date", date)
      .order("rooms(floor)", { ascending: true });

    if (jobsData && jobsData.length > 0) {
      setJobs(jobsData as unknown as CleaningJob[]);
    } else {
      await createTodayJobs(userData.hotel_id, date);
    }

    const { data: staffData } = await supabase
      .from("users")
      .select("id, first_name, speed_factor")
      .eq("hotel_id", userData.hotel_id)
      .eq("role", "housekeeper")
      .eq("is_active", true);

    setStaff(staffData ?? []);
    setLoading(false);
  }, []);

  async function createTodayJobs(hotelId: string, date: string) {
    const supabase = createClient();
    const { data: rooms } = await supabase
      .from("rooms")
      .select("id")
      .eq("hotel_id", hotelId)
      .eq("is_active", true);

    if (!rooms || rooms.length === 0) {
      setNoJobsYet(true);
      setLoading(false);
      return;
    }

    const inserts = rooms.map((r) => ({
      hotel_id: hotelId,
      room_id: r.id,
      job_date: date,
      status: "assigned",
      is_departure: true,
    }));

    await supabase.from("cleaning_jobs").insert(inserts);

    const { data: jobsData } = await supabase
      .from("cleaning_jobs")
      .select(
        `
        id, status, priority, is_departure, estimated_minutes,
        assigned_to, started_at, completed_at,
        rooms ( room_number, floor, room_type ),
        users ( first_name )
      `
      )
      .eq("hotel_id", hotelId)
      .eq("job_date", date);

    setJobs((jobsData ?? []) as unknown as CleaningJob[]);
  }

  useEffect(() => {
    fetchData();
    const supabase = createClient();
    const channel = supabase
      .channel("cleaning-jobs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cleaning_jobs" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError("");

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const res = await fetch("/api/assignments/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        date: new Date().toISOString().split("T")[0],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setGenerateError(data.error ?? "Failed to generate assignments");
      setGenerating(false);
      return;
    }

    setAssignments(data.assignments);
    setStats(data.stats);
    setGenerating(false);
    fetchData();
  }

  const totalRooms = jobs.length;
  const readyRooms = jobs.filter(
    (j) =>
      j.status === "ready_for_inspection" || j.status === "inspected"
  ).length;
  const earlyRate =
    totalRooms > 0 ? Math.round((readyRooms / totalRooms) * 100) : 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Loading...
        </p>
      </div>
    );
  }

  if (noJobsYet) {
    return (
      <EmptyState
        title="No rooms configured yet"
        body="Add rooms to your hotel to start generating assignments."
        action={{ label: "Go to settings", href: "/dashboard/settings" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Housekeeping
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating || staff.length === 0}
            className="relative inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] from-brand-secondary to-brand-primary bg-linear-to-b text-white hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_3px_5px_rgba(30,144,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating
              ? "Generating..."
              : assignments.length > 0
                ? "Regenerate"
                : "Generate assignments"}
          </button>
        </div>
      </div>

      {generateError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/30">
          {generateError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPICard
          label="Early room rate"
          value={`${earlyRate}%`}
          sub="rooms ready"
        />
        <KPICard
          label="Ready"
          value={`${readyRooms} / ${totalRooms}`}
          sub="checkout rooms"
        />
        <KPICard
          label="Staff on shift"
          value={`${staff.length}`}
          sub="housekeepers"
        />
        <KPICard
          label="Balance score"
          value={stats ? `${stats.balance_score}/100` : "—"}
          sub={
            stats
              ? `±${stats.max_deviation_minutes} min variance`
              : "not generated"
          }
        />
      </div>

      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-4 rounded-xl bg-neutral-50 px-4 py-3 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
          >
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Assignments generated
            </span>
            <SummaryCheck
              label={`Workload balanced (±${stats.max_deviation_minutes} min)`}
            />
            <SummaryCheck label="Walking distance minimized" />
            <SummaryCheck label="Priority rooms scheduled first" />
            <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
              Score: {stats.balance_score}/100
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {assignments.length > 0 && (
          <div className="lg:col-span-4">
            <WorkloadPanel assignments={assignments} />
          </div>
        )}
        <div
          className={
            assignments.length > 0 ? "lg:col-span-8" : "lg:col-span-12"
          }
        >
          <RoomGrid jobs={jobs} />
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 shadow-black/5 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
      <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        {sub}
      </p>
    </div>
  );
}

function SummaryCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex size-4 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 10"
          fill="none"
          className="text-neutral-600 dark:text-neutral-300"
        >
          <path
            d="M2 5l2.5 2.5L8 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
    </div>
  );
}

function WorkloadPanel({
  assignments,
}: {
  assignments: AssignmentResult[];
}) {
  const max = Math.max(...assignments.map((a) => a.estimated_minutes), 1);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 shadow-black/5 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Workload balance
      </p>
      <div className="flex flex-col gap-4">
        {assignments.map((a) => (
          <motion.div
            key={a.staff_id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {a.staff_name ?? "Housekeeper"}
              </span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {a.estimated_minutes} min · {a.room_numbers.length} rooms
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(a.estimated_minutes / max) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-neutral-800 dark:bg-neutral-200"
              />
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Floors: {a.floor_cluster.join(", ")}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RoomGrid({ jobs }: { jobs: CleaningJob[] }) {
  const byFloor = new Map<number, CleaningJob[]>();
  for (const job of jobs) {
    const floor = job.rooms?.floor ?? 1;
    if (!byFloor.has(floor)) byFloor.set(floor, []);
    byFloor.get(floor)!.push(job);
  }
  const floors = [...byFloor.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 shadow-black/5 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Room status
        </p>
        <div className="flex items-center gap-3">
          {(
            [
              "assigned",
              "in_progress",
              "ready_for_inspection",
              "inspected",
            ] as JobStatus[]
          ).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`size-2 rounded-full ${STATUS_CONFIG[s].dot}`}
              />
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                {STATUS_CONFIG[s].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {floors.map(([floor, floorJobs]) => (
          <div key={floor}>
            <p className="mb-2 text-xs font-medium text-neutral-400 dark:text-neutral-500">
              Floor {floor}
            </p>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8">
              {floorJobs.map((job) => (
                <RoomCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomCard({ job }: { job: CleaningJob }) {
  const config = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.assigned;

  return (
    <motion.div
      layout
      className={`rounded-lg px-2 py-2 text-center ring-1 ring-inset ${config.bg} ring-transparent`}
    >
      <p className={`text-sm font-bold ${config.text}`}>
        {job.rooms?.room_number ?? "—"}
      </p>
      {job.users?.first_name && (
        <p className="mt-0.5 truncate text-xs text-neutral-400 dark:text-neutral-500">
          {job.users.first_name}
        </p>
      )}
      {job.priority > 0 && (
        <div className="mt-0.5 flex justify-center">
          <div className="size-1.5 rounded-full bg-orange-400" />
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-base font-semibold text-neutral-900 dark:text-white">
        {title}
      </p>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        {body}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-2 text-sm font-medium text-neutral-700 underline transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
