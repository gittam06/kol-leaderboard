"use client";

import { motion } from "motion/react";
import { fadeUp } from "@/components/motion";

/** Shared hero header used across the Signals and Analytics routes. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-2.5">
        {eyebrow && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-primary">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.header>
  );
}

/** Page container with the same masked-grid backdrop as the leaderboard. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-1">
      <div
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {children}
      </div>
    </div>
  );
}
