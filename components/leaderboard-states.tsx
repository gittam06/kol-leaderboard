"use client";

import { AlertTriangle, RotateCw, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 8;

/** Skeleton placeholder that mirrors the table's row rhythm while data loads. */
export function LeaderboardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="hidden items-center gap-4 border-b border-border px-4 py-3 md:flex">
        <Skeleton className="h-3 w-6" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="ml-auto h-3 w-20" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="divide-y divide-border/70">
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="ml-auto hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-4 w-10 md:block" />
            <Skeleton className="hidden h-4 w-14 md:block" />
            <Skeleton className="hidden h-6 w-16 lg:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Shown when active filters match no KOLs. Offers a one-click reset. */
export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          No KOLs match your filters
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Try a different handle or lower the minimum accuracy to widen the
          search.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}

/** Shown when the initial data load fails. Offers a retry. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--loss)]/30 bg-[var(--loss-muted)] px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--loss-muted)] text-[var(--loss)]">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Couldn&apos;t load the leaderboard
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
