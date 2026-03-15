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
import Link from "next/link";

export default function GeneralManagersPage() {
  return (
    <main>
      <HeroGM />
      <GMMetrics />
      <GMSteps />
      <GMImpact />
      <Pricing />
      <FAQs />
      <CTA />
    </main>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroGM() {
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
          <Badge href="/pricing">For General Managers</Badge>
        </div>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight text-neutral-700 md:text-7xl dark:text-neutral-300">
          Housekeeping is your fastest revenue lever.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-neutral-700 md:text-xl dark:text-neutral-300">
          Every hour a room sits dirty after checkout is revenue left on the table.
          earlyroom makes rooms sellable earlier — and shows you exactly how much
          that is worth every single day.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Button>
            <span className="flex items-center gap-2">
              Start free trial <Arrow className="size-4" />
            </span>
          </Button>
          <Link
            href="/how-it-works/housekeeping"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            For housekeeping teams
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Metrics bar ───────────────────────────────────────────────────────────────

const GM_METRICS = [
  { value: "$91,250", label: "Estimated annual revenue uplift per 100-room hotel" },
  { value: "46%", label: "Average early room availability rate on earlyroom" },
  { value: "+15–25%", label: "Improvement in early room rate vs manual operations" },
  { value: "14 days", label: "Free trial — no credit card required" },
];

function GMMetrics() {
  return (
    <div className="border-t border-neutral-100 dark:border-white/10">
      <Container className="py-10 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {GM_METRICS.map((m) => (
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

const GM_STEPS = [
  {
    number: "01",
    title: "Open the dashboard — rooms are already synced",
    body: "earlyroom pulls today's departures and stayovers from your PMS automatically each morning. No exports, no double entry. You open the app and today's workload is already there.",
  },
  {
    number: "02",
    title: "See predicted room availability times",
    body: "Based on historical cleaning times and current team progress, earlyroom shows when each room will be ready. Room 214: ready at 1:40 PM. Room 318: ready at 2:10 PM. Front desk knows before anyone has to ask.",
  },
  {
    number: "03",
    title: "Track early room availability rate in real time",
    body: "The single metric that matters: what percentage of checkout rooms are ready before your check-in deadline. earlyroom shows this live, with a trend line against last week.",
  },
  {
    number: "04",
    title: "See the revenue number — every day",
    body: "Below the availability rate, earlyroom shows the estimated early check-in revenue for the day and the month. It turns housekeeping performance into a number your ownership group understands.",
  },
];

function GMSteps() {
  return (
    <Container as="section" className="py-10 md:py-20 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <Heading as="h2">How it works for GMs</Heading>
        <Subheading className="mt-2">
          Four things you will see every morning that you have never seen before.
        </Subheading>
      </div>
      <div className="mt-12 flex flex-col gap-0">
        {GM_STEPS.map((step, i) => (
          <StepRow key={step.number} step={step} index={i} />
        ))}
      </div>
    </Container>
  );
}

function StepRow({
  step,
  index,
}: {
  step: (typeof GM_STEPS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative grid grid-cols-1 gap-6 border-t border-neutral-100 py-10 md:grid-cols-12 dark:border-white/10"
    >
      <div className="md:col-span-2">
        <span className="text-4xl font-bold text-neutral-100 dark:text-neutral-800">
          {step.number}
        </span>
      </div>
      <div className="md:col-span-10">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {step.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {step.body}
        </p>
      </div>
    </motion.div>
  );
}

// ── Revenue impact ────────────────────────────────────────────────────────────

const IMPACT_ROWS = [
  { label: "Hotel size", value: "100 rooms" },
  { label: "Early check-in fee", value: "$25 / room" },
  { label: "Additional early check-ins per day", value: "10 rooms" },
  { label: "Daily revenue opportunity", value: "$250" },
  { label: "Annual revenue uplift", value: "$91,250" },
  { label: "earlyroom Property plan cost", value: "$948 / year" },
];

function GMImpact() {
  return (
    <div className="border-t border-neutral-100 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900/50">
      <Container className="py-10 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
          <div>
            <Heading as="h2">The ROI is obvious before lunch</Heading>
            <Subheading className="mt-4">
              Hotels using earlyroom increase early room availability by 15–25%
              because room assignments are balanced and priority rooms get cleaned
              sooner. The math is straightforward.
            </Subheading>
            <div className="mt-8">
              <Button>
                <span className="flex items-center gap-2">
                  Start free trial <Arrow className="size-4" />
                </span>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10">
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Revenue impact calculator
              </p>
              <div className="mt-6 flex flex-col gap-0">
                {IMPACT_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between py-3 ${
                      i < IMPACT_ROWS.length - 1
                        ? "border-b border-neutral-100 dark:border-white/10"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {row.label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        i === IMPACT_ROWS.length - 2 || i === IMPACT_ROWS.length - 1
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// ── Shared Arrow icon ─────────────────────────────────────────────────────────

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
