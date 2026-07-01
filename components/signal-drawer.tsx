"use client";

import { motion } from "motion/react";
import { Inbox } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fadeUpItem, staggerContainer } from "@/components/motion";
import { KolIdentity } from "@/components/kol-identity";
import {
  DirectionBadge,
  RoiValue,
  StatusBadge,
} from "@/components/signal-badges";
import { useLeaderboard } from "@/lib/store";
import { MAX_RECENT_SIGNALS } from "@/lib/data";
import {
  baseSymbol,
  formatPct,
  formatPrice,
  formatRelativeTime,
  formatSignedPct,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KolRow, Signal } from "@/lib/types";

function PriceStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "gain" | "loss";
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
        {label}
      </div>
      <div
        className={cn(
          "num mt-0.5 text-sm font-medium tabular-nums",
          tone === "gain" && "text-[var(--gain)]",
          tone === "loss" && "text-[var(--loss)]",
          !tone && "text-foreground",
        )}
      >
        {formatPrice(value)}
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <motion.li
      variants={fadeUpItem}
      className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <DirectionBadge direction={signal.direction} />
          <div>
            <span className="text-sm font-semibold text-foreground">
              {baseSymbol(signal.symbol)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              {signal.symbol}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RoiValue value={signal.roi_pct} className="text-sm" />
          <StatusBadge status={signal.status} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 border-t border-border/70 pt-3">
        <PriceStat label="Entry" value={signal.entry_price} />
        <PriceStat label="Target" value={signal.target_price} tone="gain" />
        <PriceStat label="Stop" value={signal.stop_loss} tone="loss" />
        <PriceStat label="Current" value={signal.current_price} />
      </div>

      <div className="mt-2.5 text-[11px] text-muted-foreground">
        Opened {formatRelativeTime(signal.entry_time)}
      </div>
    </motion.li>
  );
}

function KolSummary({ kol }: { kol: KolRow }) {
  const stats = [
    { label: "Accuracy", node: formatPct(kol.accuracy_pct) },
    { label: "Signals", node: String(kol.total_signals) },
    {
      label: "Avg ROI",
      node: (
        <span
          className={cn(
            kol.avg_roi_pct > 0 && "text-[var(--gain)]",
            kol.avg_roi_pct < 0 && "text-[var(--loss)]",
          )}
        >
          {formatSignedPct(kol.avg_roi_pct)}
        </span>
      ),
    },
  ];

  return (
    <div className="glass grid grid-cols-3 gap-2 rounded-xl p-3">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
            {s.label}
          </div>
          <div className="num mt-0.5 text-sm font-semibold tabular-nums text-foreground">
            {s.node}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SignalDrawer() {
  const selectedKolId = useLeaderboard((s) => s.selectedKolId);
  const rows = useLeaderboard((s) => s.rows);
  const selectKol = useLeaderboard((s) => s.selectKol);

  const kol = rows.find((r) => r.id === selectedKolId) ?? null;

  return (
    <Sheet
      open={selectedKolId !== null}
      onOpenChange={(open) => {
        if (!open) selectKol(null);
      }}
    >
      <SheetContent
        side="right"
        className="w-full gap-0 sm:max-w-md"
        aria-describedby={undefined}
      >
        {kol && (
          <>
            <SheetHeader className="gap-3 border-b border-border">
              <SheetTitle className="sr-only">
                {kol.handle} recent signals
              </SheetTitle>
              <KolIdentity kol={kol} size="lg" />
              {kol.bio && (
                <SheetDescription className="text-left">
                  {kol.bio}
                </SheetDescription>
              )}
              <KolSummary kol={kol} />
            </SheetHeader>

            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <h3 className="text-sm font-medium text-foreground">
                Latest signals
              </h3>
              <span className="text-xs text-muted-foreground tabular-nums">
                Showing {Math.min(kol.recentSignals.length, MAX_RECENT_SIGNALS)}
              </span>
            </div>

            {kol.recentSignals.length > 0 ? (
              <motion.ul
                key={kol.id}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4"
              >
                {kol.recentSignals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </motion.ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-10 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="size-5" aria-hidden />
                </div>
                <p className="text-sm text-muted-foreground">
                  {kol.handle} hasn&apos;t posted any signals yet.
                </p>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
