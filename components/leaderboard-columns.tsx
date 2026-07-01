"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import { AccuracyMeter } from "@/components/accuracy-meter";
import { KolIdentity } from "@/components/kol-identity";
import { RoiValue } from "@/components/signal-badges";
import { Sparkline } from "@/components/sparkline";
import { SortHeader } from "@/components/sort-header";
import { formatRelativeTime } from "@/lib/format";
import type { KolRow } from "@/lib/types";

/**
 * Desktop leaderboard columns. Rank is rendered separately from the visible row
 * position (see LeaderboardTable), so it isn't a column here. Only accuracy,
 * total signals, and ROI are sortable, per spec.
 */
export const leaderboardColumns: ColumnDef<KolRow>[] = [
  {
    id: "kol",
    accessorKey: "handle",
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        KOL
      </span>
    ),
    cell: ({ row }) => <KolIdentity kol={row.original} />,
    enableSorting: false,
  },
  {
    id: "accuracy_pct",
    accessorKey: "accuracy_pct",
    header: () => <SortHeader id="accuracy_pct" label="Accuracy" />,
    cell: ({ row }) => <AccuracyMeter value={row.original.accuracy_pct} />,
  },
  {
    id: "total_signals",
    accessorKey: "total_signals",
    header: () => (
      <div className="text-right">
        <SortHeader id="total_signals" label="Signals" align="right" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="num text-right text-sm tabular-nums text-foreground">
        {row.original.total_signals}
      </div>
    ),
  },
  {
    id: "avg_roi_pct",
    accessorKey: "avg_roi_pct",
    header: () => (
      <div className="text-right">
        <SortHeader id="avg_roi_pct" label="Avg ROI" align="right" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <RoiValue value={row.original.avg_roi_pct} />
      </div>
    ),
  },
  {
    id: "roi_series",
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Trend
      </span>
    ),
    cell: ({ row }) => <Sparkline data={row.original.roiSeries} />,
    enableSorting: false,
  },
  {
    id: "last_signal_at",
    accessorKey: "last_signal_at",
    header: () => (
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Last signal
      </span>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {formatRelativeTime(row.original.last_signal_at)}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "action",
    header: () => <span className="sr-only">View signals</span>,
    cell: () => (
      <div className="flex justify-end pr-1 text-muted-foreground transition-colors group-hover/row:text-foreground">
        <ChevronRight className="size-4" aria-hidden />
      </div>
    ),
    enableSorting: false,
  },
];
