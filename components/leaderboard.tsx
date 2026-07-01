"use client";

import { useEffect, useMemo } from "react";
import { motion, MotionConfig } from "motion/react";
import { LeaderboardHeader } from "@/components/leaderboard-header";
import { StatsBand } from "@/components/stats-band";
import { LeaderboardToolbar } from "@/components/leaderboard-toolbar";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { LeaderboardCards } from "@/components/leaderboard-cards";
import {
  EmptyState,
  ErrorState,
  LeaderboardSkeleton,
} from "@/components/leaderboard-states";
import { SignalDrawer } from "@/components/signal-drawer";
import { useUrlSync } from "@/components/use-url-sync";
import { fadeUp } from "@/components/motion";
import { useLeaderboard } from "@/lib/store";
import { filterRows, sortRows } from "@/lib/leaderboard";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  useUrlSync();

  const rows = useLeaderboard((s) => s.rows);
  const status = useLeaderboard((s) => s.status);
  const error = useLeaderboard((s) => s.error);
  const search = useLeaderboard((s) => s.search);
  const minAccuracy = useLeaderboard((s) => s.minAccuracy);
  const sort = useLeaderboard((s) => s.sort);
  const load = useLeaderboard((s) => s.load);
  const clearFilters = useLeaderboard((s) => s.clearFilters);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleRows = useMemo(
    () => sortRows(filterRows(rows, search, minAccuracy), sort),
    [rows, search, minAccuracy, sort],
  );

  const hasData = rows.length > 0;
  const isInitialLoading = status === "loading" && !hasData;
  const isInitialError = status === "error" && !hasData;
  const isRefreshing = status === "refreshing";

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex-1">
        <div
          className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
          <LeaderboardHeader />

          {hasData && (
            <div className="mt-8">
              <StatsBand rows={rows} />
            </div>
          )}

          <div className="mt-6 space-y-4">
            {hasData && (
              <LeaderboardToolbar
                shown={visibleRows.length}
                total={rows.length}
              />
            )}

            {isInitialLoading && <LeaderboardSkeleton />}

            {isInitialError && (
              <ErrorState
                message={error ?? "Something went wrong."}
                onRetry={load}
              />
            )}

            {hasData &&
              (visibleRows.length === 0 ? (
                <EmptyState onClearFilters={clearFilters} />
              ) : (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  className={cn(
                    "transition-opacity duration-200",
                    isRefreshing && "pointer-events-none opacity-60",
                  )}
                  aria-busy={isRefreshing}
                >
                  <div className="hidden md:block">
                    <LeaderboardTable rows={visibleRows} />
                  </div>
                  <div className="md:hidden">
                    <LeaderboardCards rows={visibleRows} />
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      <SignalDrawer />
    </MotionConfig>
  );
}
