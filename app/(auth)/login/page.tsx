"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  }

  return (
    <AuthShell>
      <AuthLogo />

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Sign in to your earlyroom account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@hotel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-500"
          />
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
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        No account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          Start free trial
        </Link>
      </p>

      <TestimonialCard />
    </AuthShell>
  );
}

function TestimonialCard() {
  return (
    <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
        &ldquo;We stopped wasting 20 minutes every morning on room assignments.
        earlyroom just handles it — and our front desk can finally offer early
        check-ins without calling housekeeping.&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          M
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
            Maria Gonzalez
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Housekeeping Manager, Banff Lodge
          </span>
        </div>
      </div>
    </div>
  );
}

function AuthLogo() {
  return (
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
  );
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-950">
      <div className="relative w-full max-w-sm">
        <GridLineHorizontal className="top-0" offset="40px" />
        <GridLineHorizontal className="bottom-0 top-auto" offset="40px" />
        <GridLineVertical className="left-0" offset="40px" />
        <GridLineVertical className="left-auto right-0" offset="40px" />
        <div className="flex flex-col gap-6 px-6 py-10">{children}</div>
      </div>
    </div>
  );
}

function GridLineHorizontal({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)]",
        "absolute left-[calc(var(--offset)/2*-1)] h-(--height) w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
}

function GridLineVertical({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "[--color-dark:var(--color-neutral-800)] [--color:var(--color-neutral-400)]",
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-(--width)",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    />
  );
}
