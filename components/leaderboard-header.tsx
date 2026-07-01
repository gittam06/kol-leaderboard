"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/motion";
import { useLeaderboard } from "@/lib/store";
import { cn } from "@/lib/utils";
import { formatClockTime, formatRelativeTime } from "@/lib/format";

export function LeaderboardHeader() {
  const rows = useLeaderboard((s) => s.rows);
  const status = useLeaderboard((s) => s.status);
  const lastUpdated = useLeaderboard((s) => s.lastUpdated);
  const refresh = useLeaderboard((s) => s.refresh);

  const isRefreshing = status === "refreshing";
  const isBusy = status === "loading" || status === "refreshing";

  // Re-render each 30s so the "updated Xm ago" label stays honest.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-primary">
            {rows.length > 0 ? `${rows.length} callers` : "Live"}
          </span>
          <span>Updated in real time</span>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Signal Leaderboard
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Ranking crypto signal callers by accuracy, volume, and realized ROI.
          Click any caller to inspect their latest trades.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-muted-foreground">
          <div className="uppercase tracking-wide text-muted-foreground/60">
            Last updated
          </div>
          <div className="num text-foreground/80 tabular-nums">
            {lastUpdated
              ? `${formatRelativeTime(
                  new Date(lastUpdated).toISOString(),
                )} · ${formatClockTime(new Date(lastUpdated))}`
              : "Not yet loaded"}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={refresh}
          disabled={isBusy}
          aria-label="Refresh leaderboard"
          className="gap-2"
        >
          <RefreshCw
            className={cn("size-4", isRefreshing && "animate-spin")}
            aria-hidden
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </motion.header>
  );
}
