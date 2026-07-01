"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, PageShell } from "@/components/page-header";
import { ErrorState } from "@/components/leaderboard-states";
import {
  DirectionBadge,
  RoiValue,
  StatusBadge,
} from "@/components/signal-badges";
import { fadeUp, fadeUpItem, staggerContainer } from "@/components/motion";
import { useAsync } from "@/components/use-async";
import { fetchSignalFeed } from "@/lib/data";
import { baseSymbol, formatPrice, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SignalRow, SignalStatus } from "@/lib/types";

type StatusFilter = "ALL" | SignalStatus;
type DirectionFilter = "ALL" | "BUY" | "SELL";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "TARGET_HIT", label: "Target hit" },
  { value: "STOPLOSS_HIT", label: "Stop-loss" },
  { value: "EXPIRED", label: "Expired" },
];

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: "ALL", label: "Both sides" },
  { value: "BUY", label: "Buy only" },
  { value: "SELL", label: "Sell only" },
];

function labelFor<T extends string>(
  options: { value: T; label: string }[],
  value: T,
): string {
  return options.find((o) => o.value === value)?.label ?? "";
}

function SignalsSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="divide-y divide-border/70">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="ml-auto hidden h-4 w-16 sm:block" />
            <Skeleton className="hidden h-4 w-16 md:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalMobileCard({ signal }: { signal: SignalRow }) {
  return (
    <motion.li
      variants={fadeUpItem}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <DirectionBadge direction={signal.direction} />
          <div>
            <span className="text-sm font-semibold text-foreground">
              {baseSymbol(signal.symbol)}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">
              {signal.kol_handle}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RoiValue value={signal.roi_pct} className="text-sm" />
          <StatusBadge status={signal.status} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/70 pt-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
            Entry
          </div>
          <div className="num text-sm text-foreground">
            {formatPrice(signal.entry_price)}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
            Target
          </div>
          <div className="num text-sm text-[var(--gain)]">
            {formatPrice(signal.target_price)}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
            Stop
          </div>
          <div className="num text-sm text-[var(--loss)]">
            {formatPrice(signal.stop_loss)}
          </div>
        </div>
      </div>
      <div className="mt-2.5 text-[11px] text-muted-foreground">
        {formatRelativeTime(signal.created_at)}
      </div>
    </motion.li>
  );
}

export function SignalsView() {
  const { status, data, error, reload } = useAsync(fetchSignalFeed);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [directionFilter, setDirectionFilter] =
    useState<DirectionFilter>("ALL");

  const signals = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return signals.filter((s) => {
      if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
      if (directionFilter !== "ALL" && s.direction !== directionFilter)
        return false;
      if (
        q &&
        !s.symbol.toLowerCase().includes(q) &&
        !s.kol_handle.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [signals, search, statusFilter, directionFilter]);

  const filtersActive =
    search.trim() !== "" || statusFilter !== "ALL" || directionFilter !== "ALL";
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDirectionFilter("ALL");
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow={status === "ready" ? `${signals.length} signals` : "Live feed"}
        title="Signal Feed"
        subtitle="Every trading call across all tracked KOLs, newest first. Filter by status, side, symbol, or caller."
      />

      <div className="mt-8 space-y-4">
        {status === "ready" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search symbol or handle…"
                  aria-label="Search signals"
                  className="pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(statusFilter !== "ALL" && "border-primary/50")}
                  >
                    {labelFor(STATUS_OPTIONS, statusFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <DropdownMenuRadioItem key={o.value} value={o.value}>
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      directionFilter !== "ALL" && "border-primary/50",
                    )}
                  >
                    {labelFor(DIRECTION_OPTIONS, directionFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuRadioGroup
                    value={directionFilter}
                    onValueChange={(v) =>
                      setDirectionFilter(v as DirectionFilter)
                    }
                  >
                    {DIRECTION_OPTIONS.map((o) => (
                      <DropdownMenuRadioItem key={o.value} value={o.value}>
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {filtersActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X className="size-4" aria-hidden />
                  Clear
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>
              {filtered.length !== signals.length && <> of {signals.length}</>}{" "}
              signals
            </p>
          </div>
        )}

        {status === "loading" && <SignalsSkeleton />}

        {status === "error" && (
          <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />
        )}

        {status === "ready" &&
          (filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
              <h3 className="text-base font-semibold text-foreground">
                No signals match your filters
              </h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Widen the status or side filter, or clear the search.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      {[
                        "Symbol",
                        "Side",
                        "Caller",
                        "Entry",
                        "Target",
                        "Stop",
                        "ROI",
                        "Status",
                        "Opened",
                      ].map((h, i) => (
                        <TableHead
                          key={h}
                          className={cn(
                            "h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                            i >= 3 && i <= 6 && "text-right",
                            i === 0 && "pl-4",
                          )}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow key={s.id} className="border-border/70">
                        <TableCell className="pl-4">
                          <span className="text-sm font-semibold text-foreground">
                            {baseSymbol(s.symbol)}
                          </span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            {s.symbol}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DirectionBadge direction={s.direction} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {s.kol_handle}
                        </TableCell>
                        <TableCell className="num text-right text-sm text-foreground">
                          {formatPrice(s.entry_price)}
                        </TableCell>
                        <TableCell className="num text-right text-sm text-[var(--gain)]">
                          {formatPrice(s.target_price)}
                        </TableCell>
                        <TableCell className="num text-right text-sm text-[var(--loss)]">
                          {formatPrice(s.stop_loss)}
                        </TableCell>
                        <TableCell className="text-right">
                          <RoiValue value={s.roi_pct} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={s.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatRelativeTime(s.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3 md:hidden"
              >
                {filtered.map((s) => (
                  <SignalMobileCard key={s.id} signal={s} />
                ))}
              </motion.ul>
            </motion.div>
          ))}
      </div>
    </PageShell>
  );
}
