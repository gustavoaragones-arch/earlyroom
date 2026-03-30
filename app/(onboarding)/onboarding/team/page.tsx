"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type InviteRow = { firstName: string; email: string; role: string };

const ROLES = [
  { value: "supervisor", label: "Supervisor" },
  { value: "housekeeper", label: "Housekeeper" },
  { value: "front_desk", label: "Front Desk" },
];

export default function OnboardingTeamPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<InviteRow[]>([
    { firstName: "", email: "", role: "housekeeper" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addInvite() {
    setInvites((prev) => [
      ...prev,
      { firstName: "", email: "", role: "housekeeper" },
    ]);
  }

  function updateInvite(index: number, field: keyof InviteRow, value: string) {
    setInvites((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function removeInvite(index: number) {
    if (invites.length === 1) return;
    setInvites((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = invites.filter((i) => i.email.trim());
    if (filled.length === 0) {
      router.push("/dashboard");
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

    const inserts = filled.map((i) => ({
      hotel_id: userData.hotel_id,
      email: i.email.trim().toLowerCase(),
      first_name: i.firstName.trim() || null,
      role: i.role,
      invited_by: user.id,
    }));

    const { error: insertError } = await supabase
      .from("invitations")
      .insert(inserts);
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <OnboardingShell step={3} total={3} title="Invite your team">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Add at least one housekeeper so they can receive their room assignments
        on day one. You can invite more from your dashboard.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {invites.map((invite, i) => (
            <div
              key={i}
              className="rounded-xl bg-neutral-50 p-3 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={invite.firstName}
                  onChange={(e) => updateInvite(i, "firstName", e.target.value)}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                />
                <select
                  value={invite.role}
                  onChange={(e) => updateInvite(i, "role", e.target.value)}
                  className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="email@hotel.com"
                  value={invite.email}
                  onChange={(e) => updateInvite(i, "email", e.target.value)}
                  className="flex-1 rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:text-white dark:shadow-white/5 dark:ring-white/10"
                />
                <button
                  type="button"
                  onClick={() => removeInvite(i)}
                  disabled={invites.length === 1}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 disabled:opacity-30 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
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
          onClick={addInvite}
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
          Add another team member
        </button>

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
          {loading ? "Sending invites..." : "Send invites and go to dashboard"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="text-center text-sm text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
        >
          Skip for now
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
