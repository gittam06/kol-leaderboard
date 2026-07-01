"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeaderboard, type SortableColumnId } from "@/lib/store";

/** Column header button that reads and drives the store's sort state. */
export function SortHeader({
  id,
  label,
  align = "left",
}: {
  id: SortableColumnId;
  label: string;
  align?: "left" | "right";
}) {
  const sort = useLeaderboard((s) => s.sort);
  const toggleSort = useLeaderboard((s) => s.toggleSort);
  const active = sort?.id === id;
  const Icon = !active ? ChevronsUpDown : sort!.desc ? ArrowDown : ArrowUp;

  return (
    <button
      type="button"
      onClick={() => toggleSort(id)}
      aria-label={`Sort by ${label}`}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-medium uppercase tracking-wide transition-colors",
        "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-0",
        active ? "text-foreground" : "text-muted-foreground",
        align === "right" && "flex-row-reverse",
      )}
    >
      {label}
      <Icon
        className={cn(
          "size-3.5 transition-opacity",
          active ? "text-primary opacity-100" : "opacity-40 group-hover:opacity-70",
        )}
        aria-hidden
      />
    </button>
  );
}
