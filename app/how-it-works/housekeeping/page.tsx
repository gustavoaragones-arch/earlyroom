"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { LinesGradientShader } from "@/components/lines-gradient-shader";
import { Pricing } from "@/components/pricing";
import { FAQs } from "@/components/faqs";
import { CTA } from "@/components/cta";
import { MacbookSkeleton } from "@/components/features-two/macbook-skeleton";
import { IPhoneSkeleton } from "@/components/features-two/iphone-skeleton";
import { IPadSkeleton } from "@/components/features-two/ipad-skeleton";
import Link from "next/link";

export default function HousekeepingPage() {
  return (
    <main>
      <HeroHK />
      <HKMetrics />
      <HKSteps />
      <HKDevices />
      <HKTrust />
      <Pricing />
      <FAQs />
      <CTA />
    </main>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroHK() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-neutral-950">
      <LinesGradientShader
        className="absolute inset-0 bg-transparent dark:bg-transparent"
        bandSpacing={40}
        bandThickness={100}
        waveAmplitude={0.2}
        speed={1}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-32">
        <div>
          <Badge href="/pricing">For Housekeeping Teams</Badge>
        </div>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-neutral-700 md:text-7xl dark:text-neutral-300">
          No more printed lists. No more morning chaos.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-neutral-700 md:text-xl dark:text-neutral-300">
          earlyroom replaces the 20-minute morning assignment process with one
          button. Supervisors tap Generate — rooms distribute instantly. Housekeepers
          work from their phones. Everyone knows the status without asking.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Button>
            <span className="flex items-center gap-2">
              Start free trial <Arrow className="size-4" />
            </span>
          </Button>
          <Link
            href="/how-it-works/general-managers"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            For general managers
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Metrics bar ───────────────────────────────────────────────────────────────

const HK_METRICS = [
  { value: "~20 min", label: "Saved every morning per supervisor" },
  { value: "10 sec", label: "To generate fully balanced assignments" },
  { value: "0", label: "Printed task lists required" },
  { value: "±4 min", label: "Maximum workload difference between housekeepers" },
];

function HKMetrics() {
  return (
    <div className="border-t border-neutral-100 dark:border-white/10">
      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {HK_METRICS.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl dark:text-white">
                {m.value}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const HK_STEPS = [
  {
    number: "01",
    title: "Supervisor opens the dashboard — rooms are already loaded",
    body: "Departures and stayovers are pulled automatically from the PMS each morning. The supervisor sees today's full room list without exporting a report or entering anything manually.",
    role: "Supervisor",
  },
  {
    number: "02",
    title: "One tap generates balanced assignments",
    body: "The AI engine calculates total cleaning minutes, clusters rooms by floor to minimize walking, accounts for each housekeeper's speed, and schedules priority rooms first. Every housekeeper ends up with the same workload — within 4 minutes of each other.",
    role: "Supervisor",
  },
  {
    number: "03",
    title: "Housekeepers receive their list on their phone",
    body: "Each housekeeper opens earlyroom on their phone and sees their rooms for the day. No app store download required. They tap Start when they enter a room and Done when they finish. That single tap updates the whole team instantly.",
    role: "Housekeeper",
  },
  {
    number: "04",
    title: "Supervisor inspects ready rooms — no walking the floors",
    body: "The dashboard shows which rooms are ready for inspection in real time. Supervisors go directly to finished rooms instead of walking every floor looking for them. Inspection time drops dramatically.",
    role: "Supervisor",
  },
  {
    number: "05",
    title: "Front desk releases rooms the moment they are clean",
    body: "When a room is marked Inspected, the PMS receives a vacant-clean status update instantly. Front desk can check guests in without calling housekeeping to confirm. Rooms become sellable earlier.",
    role: "Front Desk",
  },
];

function HKSteps() {
  return (
    <Container as="section" className="py-10 md:py-20 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <Heading as="h2">The morning shift, rebuilt</Heading>
        <Subheading className="mt-2">
          Five steps that replace a process that has not changed in decades.
        </Subheading>
      </div>
      <div className="mt-12 flex flex-col gap-0">
        {HK_STEPS.map((step, i) => (
          <HKStepRow key={step.number} step={step} index={i} />
        ))}
      </div>
    </Container>
  );
}

function HKStepRow({
  step,
  index,
}: {
  step: (typeof HK_STEPS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const roleColors: Record<string, string> = {
    Supervisor:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    Housekeeper:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
    "Front Desk":
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative grid grid-cols-1 gap-6 border-t border-neutral-100 py-10 md:grid-cols-12 dark:border-white/10"
    >
      <div className="md:col-span-2">
        <span className="text-4xl font-bold text-neutral-100 dark:text-neutral-800">
          {step.number}
        </span>
      </div>
      <div className="md:col-span-10">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {step.title}
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[step.role]}`}
          >
            {step.role}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}

// ── Device section (reuse from features-two) ──────────────────────────────────

function HKDevices() {
  return (
    <div className="border-t border-neutral-100 dark:border-white/10">
      <Container className="py-10 md:py-20">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Heading as="h2">Built for every person on the team</Heading>
          <Subheading className="mt-4 text-balance">
            Supervisors on desktop, housekeepers on mobile, front desk on tablet.
            One system — every role covered.
          </Subheading>
        </div>
        <div className="mx-auto grid w-full grid-cols-1 items-end gap-10 overflow-hidden py-4 md:grid-cols-3 md:py-10">
          <DeviceItem skeleton={<IPhoneSkeleton />} title="Housekeepers on mobile">
            Tap to start a room. Tap when done. Works on any smartphone — no
            download required.
          </DeviceItem>
          <DeviceItem skeleton={<MacbookSkeleton />} title="Supervisors on desktop">
            Generate assignments, view workload balance, inspect rooms, and
            rebalance when someone calls out.
          </DeviceItem>
          <DeviceItem skeleton={<IPadSkeleton />} title="Front desk on tablet">
            Live room status and predicted ready times. Offer early check-ins
            with confidence.
          </DeviceItem>
        </div>
      </Container>
    </div>
  );
}

function DeviceItem({
  skeleton,
  title,
  children,
}: {
  skeleton: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      {skeleton}
      <h3 className="mt-6 text-center text-base font-medium text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-balance text-neutral-500 dark:text-neutral-400">
        {children}
      </p>
    </div>
  );
}

// ── Workload trust section ────────────────────────────────────────────────────

const TRUST_ITEMS = [
  {
    title: "Workload balance bar",
    body: "Every housekeeper's cleaning minutes are shown as a bar. Supervisors see instantly that no one is overloaded. The system explains itself.",
  },
  {
    title: "Floor clustering",
    body: "Rooms are assigned in floor clusters to minimize walking. The system shows which floor each housekeeper is on, and why.",
  },
  {
    title: "One-click rebalance",
    body: "Someone calls in sick — remove them and press Rebalance. Rooms redistribute across the remaining team in seconds.",
  },
  {
    title: "Predicted finish times",
    body: "Each housekeeper's expected finish time is shown on the supervisor dashboard. Front desk can plan early check-ins before shift end.",
  },
  {
    title: "Assignment score",
    body: "A simple balance score (e.g. 94/100) shows how evenly work is distributed. Supervisors trust what they can measure.",
  },
  {
    title: "Priority room scheduling",
    body: "VIP arrivals and early check-in requests get flagged. The algorithm schedules their rooms first without the supervisor having to manually intervene.",
  },
];

function HKTrust() {
  return (
    <div className="border-t border-neutral-100 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50">
      <Container className="py-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <Heading as="h2">Why supervisors trust it after one shift</Heading>
          <Subheading className="mt-4">
            The algorithm does not hide its work. Every decision is visible,
            explainable, and overridable.
          </Subheading>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <TrustCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </Container>
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-balance text-neutral-600 dark:text-neutral-400">
        {body}
      </p>
    </div>
  );
}

// ── Shared Arrow ──────────────────────────────────────────────────────────────

const Arrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l14 0" />
    <path d="M15 16l4 -4" />
    <path d="M15 8l4 4" />
  </svg>
);
