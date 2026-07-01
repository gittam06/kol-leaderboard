"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hasActiveFilters, useLeaderboard } from "@/lib/store";
import { cn } from "@/lib/utils";

const ACCURACY_PRESETS = [0, 50, 60, 70, 80, 90] as const;

export function LeaderboardToolbar({
  shown,
  total,
}: {
  shown: number;
  total: number;
}) {
  const search = useLeaderboard((s) => s.search);
  const minAccuracy = useLeaderboard((s) => s.minAccuracy);
  const setSearch = useLeaderboard((s) => s.setSearch);
  const setMinAccuracy = useLeaderboard((s) => s.setMinAccuracy);
  const clearFilters = useLeaderboard((s) => s.clearFilters);
  const filtersActive = hasActiveFilters({ search, minAccuracy });

  return (
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
            placeholder="Search by handle…"
            aria-label="Search KOLs by handle"
            className="pl-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "gap-2",
                minAccuracy > 0 && "border-primary/50 text-foreground",
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              <span className="text-sm">
                {minAccuracy > 0 ? `Accuracy ≥ ${minAccuracy}%` : "Min accuracy"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Minimum accuracy</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={String(minAccuracy)}
              onValueChange={(v) => setMinAccuracy(Number(v))}
            >
              {ACCURACY_PRESETS.map((preset) => (
                <DropdownMenuRadioItem key={preset} value={String(preset)}>
                  {preset === 0 ? "Any accuracy" : `${preset}% or higher`}
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
        <span className="font-medium text-foreground">{shown}</span>
        {shown !== total && <> of {total}</>} KOLs
      </p>
    </div>
  );
}
