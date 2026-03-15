"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { WorldMapSkeleton } from "./world-map-skeleton";
import { KeyboardSkeleton } from "./keyboard-skeleton";
import { LoginSkeleton } from "./login-skeleton";
import { ChatConversation } from "./chat";
import { VerticalPulseLines } from "./vertical-pulse-lines";
import { FlippingImagesWithBar } from "./flipping-images";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { Container } from "../container";
import { Zap, BarChart3, Puzzle } from "lucide-react";

export function FeaturesOne() {
  return (
    <Container as="section" id="product" className="py-10 md:py-20 lg:py-32">
      <Heading>Everything your housekeeping team needs</Heading>
      <Subheading className="mt-2">
        From morning assignment to room ready — all in one platform
      </Subheading>
      <div className="mx-auto mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3 md:grid-rows-2">
        <Card className="md:row-span-2">
          <CardContent className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Quick hotel setup</CardTitle>
              <CardDescription>
                Add your room inventory, set cleaning times per room type, and
                onboard your team in under 15 minutes.
              </CardDescription>
            </CardHeader>
            <CardSkeleton className="mt-auto flex flex-1 items-center justify-center overflow-hidden pt-4">
              <LoginSkeleton />
            </CardSkeleton>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Multi-property portfolio view</CardTitle>
              <CardDescription>
                Management companies see housekeeping performance across all
                properties in one dashboard. No more logging into 15 systems.
              </CardDescription>
            </CardHeader>
            <CardSkeleton className="mt-auto flex flex-1 items-center justify-center pt-4">
              <WorldMapSkeleton />
            </CardSkeleton>
          </CardContent>
        </Card>

        <Card className="md:row-span-2">
          <CardContent className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Real-time team coordination</CardTitle>
              <CardDescription>
                Supervisors and front desk see live room status. Housekeepers
                update rooms from their phones the moment they finish.
              </CardDescription>
            </CardHeader>
            <CardSkeleton className="mt-auto flex flex-1 flex-col items-center justify-between gap-2 overflow-hidden pt-4">
              <ChatConversation className="min-h-0 shrink p-2" />
              <VerticalPulseLines className="h-24 shrink-0" />
              <div className="shrink-0 scale-75">
                <FlippingImagesWithBar />
              </div>
            </CardSkeleton>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Works on any smartphone</CardTitle>
              <CardDescription>
                No app download required. Housekeepers access their task list
                from any phone — large buttons, fast loading, offline tolerant.
              </CardDescription>
            </CardHeader>
            <CardSkeleton className="mt-auto flex flex-1 items-center justify-center overflow-hidden mask-r-from-50% pt-4">
              <KeyboardSkeleton />
            </CardSkeleton>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-4 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3">
        <FeatureCard
          icon={<Zap className="group-hover:text-brand-primary size-5" />}
          title="Assignments generated in under 10 seconds"
          description="The AI engine balances workload by cleaning minutes, clusters rooms by floor, and schedules priority rooms first — instantly."
        />
        <FeatureCard
          icon={<BarChart3 className="group-hover:text-brand-primary size-5" />}
          title="Early room availability tracking"
          description="See what percentage of checkout rooms are ready before your check-in deadline, and translate that directly into early check-in revenue."
        />
        <FeatureCard
          icon={<Puzzle className="group-hover:text-brand-primary size-5" />}
          title="PMS integration out of the box"
          description="Connects with Cloudbeds, Mews, and more. Pulls today's departures automatically and pushes clean room status back in real time."
        />
      </div>
    </Container>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/10", className)}>
      {children}
    </div>
  );
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 p-6", className)}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-sm font-semibold text-neutral-900 dark:text-white", className)}>{children}</h3>;
}

function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-balance text-neutral-600 dark:text-neutral-400", className)}>{children}</p>;
}

function CardSkeleton({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl bg-white p-6 dark:bg-neutral-900">
      {icon}
      <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-balance text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  );
}
