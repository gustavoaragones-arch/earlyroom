"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Vancouver",
  "America/Toronto",
  "America/Edmonton",
  "Europe/London",
  "Europe/Paris",
];

export default function OnboardingHotelPage() {
  const router = useRouter();
  const [hotelName, setHotelName] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [earlyCheckinFee, setEarlyCheckinFee] = useState("25");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function makeSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: hotel, error: hotelError } = await supabase
      .from("hotels")
      .insert({
        name: hotelName,
        slug: makeSlug(hotelName) + "-" + Date.now(),
        timezone,
        check_in_time: checkInTime,
        check_out_time: checkOutTime,
        early_checkin_fee: parseFloat(earlyCheckinFee),
      })
      .select()
      .single();

    if (hotelError) {
      setError(hotelError.message);
      setLoading(false);
      return;
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ hotel_id: hotel.id, role: "owner" })
      .eq("id", user.id);

    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding/rooms");
  }

  return (
    <OnboardingShell
      step={1}
      total={3}
      title="Tell us about your property"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Hotel name
          </label>
          <input
            type="text"
            required
            placeholder="Banff Mountain Lodge"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10 dark:focus:ring-neutral-500"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Check-in time
            </label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Check-out time
            </label>
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Early check-in fee (USD)
          </label>
          <input
            type="number"
            min="0"
            step="5"
            placeholder="25"
            value={earlyCheckinFee}
            onChange={(e) => setEarlyCheckinFee(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10"
          />
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Used to calculate your early check-in revenue potential
          </p>
        </div>

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
