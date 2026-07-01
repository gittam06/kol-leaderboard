"use client";

import { useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leaderboardColumns } from "@/components/leaderboard-columns";
import { useLeaderboard } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { KolRow } from "@/lib/types";

const HEAD_WIDTH: Record<string, string> = {
  kol: "w-[26%] min-w-[220px]",
  accuracy_pct: "w-[18%]",
  total_signals: "w-[10%]",
  avg_roi_pct: "w-[12%]",
  roi_series: "w-[12%]",
  last_signal_at: "w-[14%]",
  action: "w-[48px]",
};

/** Top-3 get a tinted medal rank; the rest a plain muted number. */
function RankBadge({ rank }: { rank: number }) {
  const medal =
    rank === 1
      ? "text-[var(--warn)] border-[var(--warn)]/40 bg-[var(--warn-muted)]"
      : rank === 2
        ? "text-foreground border-border bg-secondary"
        : rank === 3
          ? "text-[var(--loss)] border-[var(--loss)]/40 bg-[var(--loss-muted)]"
          : null;

  if (medal) {
    return (
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
          medal,
        )}
      >
        {rank}
      </span>
    );
  }
  return (
    <span className="tabular inline-flex w-7 justify-center text-sm tabular-nums text-muted-foreground">
      {rank}
    </span>
  );
}

export function LeaderboardTable({ rows }: { rows: KolRow[] }) {
  const selectKol = useLeaderboard((s) => s.selectKol);

  // Rows arrive already filtered and sorted; TanStack handles rendering only,
  // so table order and the mobile cards stay in lockstep.
  const table = useReactTable({
    data: rows,
    columns: leaderboardColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  const sortedRows = table.getRowModel().rows;
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const focusRow = (index: number) => {
    const clamped = Math.max(0, Math.min(sortedRows.length - 1, index));
    rowRefs.current[clamped]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    index: number,
    kolId: string,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusRow(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusRow(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusRow(0);
        break;
      case "End":
        e.preventDefault();
        focusRow(sortedRows.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectKol(kolId);
        break;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-border hover:bg-transparent"
            >
              <TableHead className="w-[56px] pl-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                #
              </TableHead>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn("h-11", HEAD_WIDTH[header.column.id])}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow
              key={row.id}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              tabIndex={0}
              role="button"
              aria-label={`View signals for ${row.original.handle}`}
              onClick={() => selectKol(row.original.id)}
              onKeyDown={(e) => handleKeyDown(e, index, row.original.id)}
              className="group/row cursor-pointer border-border/70 outline-none focus-visible:bg-muted/60 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <TableCell className="pl-4">
                <RankBadge rank={index + 1} />
              </TableCell>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-2.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
