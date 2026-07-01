import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSignedPct } from "@/lib/format";
import type { SignalDirection, SignalStatus } from "@/lib/types";

/** BUY/SELL pill. Color reinforces direction but the text carries the meaning. */
export function DirectionBadge({ direction }: { direction: SignalDirection }) {
  const isBuy = direction === "BUY";
  const Icon = isBuy ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tracking-wide",
        isBuy
          ? "bg-[var(--gain-muted)] text-[var(--gain)]"
          : "bg-[var(--loss-muted)] text-[var(--loss)]",
      )}
    >
      <Icon className="size-3" aria-hidden />
      {direction}
    </span>
  );
}

const STATUS_META: Record<
  SignalStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  OPEN: {
    label: "Open",
    text: "text-[var(--open)]",
    bg: "bg-[var(--open-muted)]",
    dot: "bg-[var(--open)]",
  },
  TARGET_HIT: {
    label: "Target hit",
    text: "text-[var(--gain)]",
    bg: "bg-[var(--gain-muted)]",
    dot: "bg-[var(--gain)]",
  },
  STOPLOSS_HIT: {
    label: "Stop-loss",
    text: "text-[var(--loss)]",
    bg: "bg-[var(--loss-muted)]",
    dot: "bg-[var(--loss)]",
  },
  EXPIRED: {
    label: "Expired",
    text: "text-[var(--warn)]",
    bg: "bg-[var(--warn-muted)]",
    dot: "bg-[var(--warn)]",
  },
};

/** Signal lifecycle badge with a status dot and label. */
export function StatusBadge({ status }: { status: SignalStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        meta.bg,
        meta.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}

/** Signed ROI, green for gain / red for loss / muted for flat. */
export function RoiValue({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const tone =
    value > 0
      ? "text-[var(--gain)]"
      : value < 0
        ? "text-[var(--loss)]"
        : "text-muted-foreground";
  return (
    <span className={cn("num font-semibold", tone, className)}>
      {formatSignedPct(value)}
    </span>
  );
}
