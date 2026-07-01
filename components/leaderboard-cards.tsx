"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { KolIdentity } from "@/components/kol-identity";
import { RoiValue } from "@/components/signal-badges";
import { Sparkline } from "@/components/sparkline";
import { fadeUpItem, staggerContainer } from "@/components/motion";
import { useLeaderboard } from "@/lib/store";
import { formatPct, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KolRow } from "@/lib/types";

function Stat({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
        {label}
      </div>
      <div className="num mt-0.5 text-sm font-medium tabular-nums text-foreground">
        {children}
      </div>
    </div>
  );
}

/** Mobile / small-screen layout: each KOL becomes a tappable card. */
export function LeaderboardCards({ rows }: { rows: KolRow[] }) {
  const selectKol = useLeaderboard((s) => s.selectKol);

  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3"
    >
      {rows.map((row, index) => (
        <motion.li key={row.id} variants={fadeUpItem}>
          <button
            type="button"
            onClick={() => selectKol(row.id)}
            aria-label={`View signals for ${row.handle}`}
            className="group w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-border/80 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <div className="flex items-center gap-3">
              <span className="num inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <KolIdentity kol={row} className="flex-1" />
              <ChevronRight
                className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/70 pt-3">
              <Stat label="Accuracy">{formatPct(row.accuracy_pct)}</Stat>
              <Stat label="Signals" align="right">
                {row.total_signals}
              </Stat>
              <Stat label="Avg ROI" align="right">
                <RoiValue value={row.avg_roi_pct} />
              </Stat>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last signal {formatRelativeTime(row.last_signal_at)}
              </span>
              <Sparkline data={row.roiSeries} width={72} height={24} />
            </div>
          </button>
        </motion.li>
      ))}
    </motion.ul>
  );
}
