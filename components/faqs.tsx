"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import { GridLineHorizontal, GridLineVertical } from "./grid-lines";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: "Pricing",
    items: [
      {
        question: "How much does earlyroom cost?",
        answer:
          "Pricing starts at $49/month for the Starter plan (up to 60 rooms) and $79/month for the Property plan (up to 150 rooms, includes PMS integration). Portfolio pricing for management companies with multiple properties is available on request. All plans include a 14-day free trial.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes — 14 days, full access, no credit card required. Setup takes under 15 minutes. Your supervisor team will notice the difference on day one.",
      },
      {
        question: "What's the ROI for a typical hotel?",
        answer:
          "A 100-room hotel enabling 10 additional early check-ins per day at $25 each generates $91,250 in additional annual revenue. The Property plan costs $948/year. The return is clear before the first month is over.",
      },
      {
        question: "Can I change plans at any time?",
        answer:
          "Yes. Upgrade at any time and new features activate immediately. Downgrades take effect at the start of your next billing cycle. We prorate charges for mid-cycle upgrades.",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        question: "How does the smart room assignment work?",
        answer:
          "Each morning the supervisor opens earlyroom and presses Generate Assignments. The AI engine distributes cleaning workload by minutes (not room count), clusters rooms by floor to minimize walking, adjusts for each housekeeper's speed, and schedules priority rooms first. The whole process takes under 10 seconds.",
      },
      {
        question: "What happens when a housekeeper calls in sick?",
        answer:
          "Remove them from the roster and press Rebalance. The system redistributes their rooms across the remaining team instantly, recalculating workload balance and walking clusters automatically. No manual reassignment needed.",
      },
      {
        question: "Does earlyroom replace our existing PMS?",
        answer:
          "No — earlyroom works as an AI layer on top of your existing PMS. It pulls room status and departure data from Cloudbeds, Mews, or your PMS each morning, and pushes clean room status back so front desk can check guests in immediately. Your PMS stays in place.",
      },
      {
        question: "Can housekeepers use their own phones?",
        answer:
          "Yes. The housekeeper interface is mobile-first and works on any smartphone — no app store download required. Large buttons, minimal text, fast loading. They see their assigned rooms, tap to start, tap when done.",
      },
    ],
  },
  {
    title: "Setup & Security",
    items: [
      {
        question: "How long does setup take?",
        answer:
          "Most properties are fully configured in under 15 minutes. You enter your room inventory, set cleaning time estimates per room type, add your staff roster, and you're live. PMS integration takes an additional 30 minutes with our onboarding team.",
      },
      {
        question: "How is our data protected?",
        answer:
          "We use AES-256 encryption at rest and TLS 1.3 in transit. All data is stored in SOC 2 Type II certified infrastructure. Each hotel's data is fully isolated using row-level security — no cross-tenant access is possible.",
      },
      {
        question: "Does earlyroom work if our PMS goes down?",
        answer:
          "Yes. earlyroom operates independently from your PMS. If your franchise system experiences downtime, supervisors can still generate assignments, housekeepers can still update room status, and the dashboard still shows real-time progress. The PMS sync resumes automatically when connectivity returns.",
      },
    ],
  },
];

export function FAQs() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleQuestion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden px-4 py-20 md:px-8 md:py-32">
      <div className="text-center">
        <Heading as="h2">Frequently Asked Questions</Heading>
        <Subheading className="mx-auto mt-4 max-w-2xl">
          Everything you need to know about earlyroom and how it fits into your hotel&apos;s daily operations.
        </Subheading>
      </div>

      <div
        ref={containerRef}
        className="relative mt-16 flex flex-col gap-12 px-4 md:px-8"
      >
        {faqData.map((section) => (
          <div key={section.title}>
            <h3 className="mb-6 text-lg font-medium text-neutral-800 dark:text-neutral-200">
              {section.title}
            </h3>
            <div className="flex flex-col gap-3">
              {section.items.map((item, index) => {
                const id = `${section.title}-${index}`;
                const isActive = activeId === id;

                return (
                  <div
                    key={id}
                    className={cn(
                      "relative rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:shadow-white/5 dark:ring-white/10"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900",
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0">
                        <GridLineHorizontal className="-top-[2px]" offset="100px" />
                        <GridLineHorizontal className="-bottom-[2px]" offset="100px" />
                        <GridLineVertical className="-left-[2px]" offset="100px" />
                        <GridLineVertical className="-right-[2px] left-auto" offset="100px" />
                      </div>
                    )}
                    <button
                      onClick={() => toggleQuestion(id)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left"
                    >
                      <span className="text-sm font-medium text-neutral-700 md:text-base dark:text-neutral-300">
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isActive ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 shrink-0"
                      >
                        <IconPlus className="size-5 text-neutral-500 dark:text-neutral-400" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15, ease: "easeInOut" }}
                          className="relative"
                        >
                          <p className="max-w-[90%] px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-400">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
