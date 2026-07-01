import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Minimal dependency-free ROI sparkline. Colored by the trend's net direction
 * (last point vs. first), with a soft area fill and an end-point dot. Baseline
 * is zero so gains rise above and losses dip below the axis.
 */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  className,
}: SparklineProps) {
  if (data.length === 0) {
    return (
      <span className="text-xs text-muted-foreground/60" aria-hidden>
        No data
      </span>
    );
  }

  const net = data[data.length - 1] - data[0];
  const up = net >= 0;
  const stroke = up ? "var(--gain)" : "var(--loss)";

  const pad = 3;
  const w = width;
  const h = height;
  const min = Math.min(0, ...data);
  const max = Math.max(0, ...data);
  const span = max - min || 1;

  const x = (i: number) =>
    data.length === 1 ? w / 2 : pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v: number) => pad + (1 - (v - min) / span) * (h - pad * 2);

  const points = data.map((v, i) => `${x(i)},${y(v)}`);
  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${x(data.length - 1)},${h - pad} L${x(0)},${
    h - pad
  } Z`;
  const gradientId = `spark-${up ? "up" : "down"}`;

  const lastX = x(data.length - 1);
  const lastY = y(data[data.length - 1]);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label={`ROI trend ${up ? "up" : "down"} across ${data.length} signals`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
          <stop offset="100%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill={stroke} />
    </svg>
  );
}
