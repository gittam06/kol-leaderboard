import { cn } from "@/lib/utils";
import { formatPct } from "@/lib/format";

/** Accuracy as a value plus a thin proportional bar, tinted by tier. */
export function AccuracyMeter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const tier =
    value >= 70
      ? "bg-[var(--gain)]"
      : value >= 50
        ? "bg-[var(--warn)]"
        : "bg-[var(--loss)]";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="num w-[3.25rem] text-right text-sm font-medium text-foreground tabular-nums">
        {formatPct(value)}
      </span>
      <div
        className="relative h-1.5 w-16 overflow-hidden rounded-full bg-secondary"
        role="presentation"
      >
        <div
          className={cn("h-full rounded-full", tier)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
