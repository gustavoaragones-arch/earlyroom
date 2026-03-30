"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell>
      <AuthLogo />

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Reset your password
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email and we will send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Check your inbox. If an account exists for{" "}
            <span className="font-medium">{email}</span>, you will receive a
            reset link shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@hotel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ring-1 shadow-black/5 ring-black/10 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-900 dark:text-white dark:shadow-white/5 dark:ring-white/10 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-linear-to-b from-neutral-700 to-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-neutral-600 hover:to-neutral-900 active:scale-[0.98] disabled:opacity-60 dark:from-neutral-600 dark:to-neutral-900"
            style={{
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        <Link
          href="/login"
          className="font-medium text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src="/early_room.png" alt="earlyroom" width={28} height={28} />
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
