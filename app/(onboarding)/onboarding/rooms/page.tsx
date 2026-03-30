"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RoomRow = { number: string; floor: string; type: string };

const ROOM_TYPES = [
  { value: "standard", label: "Standard", minutes: 25 },
  { value: "queen", label: "Queen", minutes: 30 },
  { value: "king", label: "King", minutes: 35 },
  { value: "double", label: "Double", minutes: 35 },
  { value: "suite", label: "Suite", minutes: 45 },
  { value: "studio", label: "Studio", minutes: 30 },
  { value: "accessible", label: "Accessible", minutes: 35 },
];

const CLEAN_TIMES: Record<string, number> = Object.fromEntries(
  ROOM_TYPES.map((r) => [r.value, r.minutes])
);

export default function OnboardingRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomRow[]>([
    { number: "", floor: "1", type: "queen" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addRoom() {
    setRooms((prev) => [
      ...prev,
      { number: "", floor: "1", type: "queen" },
    ]);
  }

  function updateRoom(index: number, field: keyof RoomRow, value: string) {
    setRooms((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function removeRoom(index: number) {
    if (rooms.length === 1) return;
    setRooms((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (rooms.some((r) => !r.number.trim())) {
      setError("Please fill in all room numbers.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("hotel_id")
      .eq("id", user.id)
      .single();

    if (!userData?.hotel_id) {
      router.push("/onboarding/hotel");
      return;
    }

    const inserts = rooms.map((r) => ({
      hotel_id: userData.hotel_id,
      room_number: r.number.trim(),
      floor: parseInt(r.floor) || 1,
      room_type: r.type,
      base_clean_time: CLEAN_TIMES[r.type] ?? 30,
    }));

    const { error: insertError } = await supabase
      .from("rooms")
      .insert(inserts);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding/team");
  }

  return (
    <OnboardingShell step={2} total={3} title="Add your rooms">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {rooms.map((room, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-end gap-2"
            >
              <div className="col-span-4 flex flex-col gap-1">
                {i === 0 && (
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Room no.
                  </label>
                )}
                <input
                  type="text"
                  placeholder="101"
                  value={room.number}
                  onChange={(e) => updateRoom(i, "number", e.target.value)}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                {i === 0 && (
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Floor
                  </label>
                )}
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={room.floor}
                  onChange={(e) => updateRoom(i, "floor", e.target.value)}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                />
              </div>
              <div className="col-span-5 flex flex-col gap-1">
                {i === 0 && (
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Type
                  </label>
                )}
                <select
                  value={room.type}
                  onChange={(e) => updateRoom(i, "type", e.target.value)}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                >
                  {ROOM_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>
                      {rt.label} ({rt.minutes}m)
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1 flex items-end pb-0.5">
                <button
                  type="button"
                  onClick={() => removeRoom(i)}
                  disabled={rooms.length === 1}
                  className="flex size-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add another room
        </button>

        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          You can add more rooms later from your dashboard. Add at least one to
          continue.
        </p>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-linear-to-b from-neutral-700 to-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-neutral-600 hover:to-neutral-900 active:scale-[0.98] disabled:opacity-60 dark:from-neutral-600 dark:to-neutral-900"
          style={{
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </OnboardingShell>
  );
}

function OnboardingShell({
  children,
  step,
  total,
  title,
}: {
  children: React.ReactNode;
  step: number;
  total: number;
  title: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/early_room.png"
              alt="earlyroom"
              width={28}
              height={28}
            />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              earlyroom
            </span>
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step
                  ? "bg-neutral-900 dark:bg-white"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>

        <p className="mb-1 text-xs font-medium text-neutral-400 dark:text-neutral-500">
          Step {step} of {total}
        </p>

        <h1 className="mb-6 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}
