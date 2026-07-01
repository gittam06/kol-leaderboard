"use client";

import { motion } from "motion/react";
import { Target, TrendingUp, Users, Zap } from "lucide-react";
import { CountUp, fadeUpItem, staggerContainer } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { KolRow } from "@/lib/types";

interface Metric {
  label: string;
  icon: typeof Users;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  tone?: "default" | "gain" | "loss";
}

function computeMetrics(rows: KolRow[]): Metric[] {
  const n = rows.length || 1;
  const avgAcc = rows.reduce((s, r) => s + r.accuracy_pct, 0) / n;
  const avgRoi = rows.reduce((s, r) => s + r.avg_roi_pct, 0) / n;
  const totalSignals = rows.reduce((s, r) => s + r.total_signals, 0);
  const verified = rows.filter((r) => r.verified).length;

  return [
    {
      label: "KOLs tracked",
      icon: Users,
      value: rows.length,
      sub: `${verified} verified`,
    },
    {
      label: "Avg accuracy",
      icon: Target,
      value: avgAcc,
      decimals: 1,
      suffix: "%",
      sub: "across all callers",
    },
    {
      label: "Total signals",
      icon: Zap,
      value: totalSignals,
      sub: "all-time calls",
    },
    {
      label: "Avg ROI",
      icon: TrendingUp,
      value: avgRoi,
      decimals: 1,
      suffix: "%",
      prefix: avgRoi > 0 ? "+" : "",
      sub: "per closed signal",
      tone: avgRoi > 0 ? "gain" : avgRoi < 0 ? "loss" : "default",
    },
  ];
}

export function StatsBand({ rows }: { rows: KolRow[] }) {
  const metrics = computeMetrics(rows);

  return (
    <motion.dl
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {metrics.map((m) => {
        const Icon = m.icon;
        const valueTone =
          m.tone === "gain"
            ? "text-[var(--gain)]"
            : m.tone === "loss"
              ? "text-[var(--loss)]"
              : "text-foreground";
        return (
          <motion.div
            key={m.label}
            variants={fadeUpItem}
            className="glass group relative overflow-hidden rounded-xl p-4 transition-colors hover:border-white/15"
          >
            <div
              className={cn(
                "pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                m.tone === "gain"
                  ? "bg-[var(--gain)]/20"
                  : m.tone === "loss"
                    ? "bg-[var(--loss)]/20"
                    : "bg-primary/20",
              )}
              aria-hidden
            />
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <Icon className="size-3.5" aria-hidden />
              </span>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {m.label}
              </dt>
            </div>
            <dd
              className={cn(
                "num mt-3 text-2xl font-semibold tabular-nums sm:text-[1.7rem]",
                valueTone,
              )}
            >
              <CountUp
                value={m.value}
                decimals={m.decimals}
                prefix={m.prefix}
                suffix={m.suffix}
              />
            </dd>
            <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
          </motion.div>
        );
      })}
    </motion.dl>
  );
}
