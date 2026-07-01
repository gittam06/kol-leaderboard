import { baseSymbol } from "./format";
import type { SignalRow, SignalStatus } from "./types";

export interface CategoryDatum {
  key: string;
  label: string;
  value: number;
}

export interface AnalyticsSummary {
  total: number;
  open: number;
  closed: number;
  winRate: number;
  avgRoi: number;
  statusBreakdown: CategoryDatum[];
  directionBreakdown: CategoryDatum[];
  topSymbols: CategoryDatum[];
  roiBuckets: CategoryDatum[];
  perDay: { date: string; label: string; count: number }[];
}

const STATUS_LABEL: Record<SignalStatus, string> = {
  OPEN: "Open",
  TARGET_HIT: "Target hit",
  STOPLOSS_HIT: "Stop-loss",
  EXPIRED: "Expired",
};

/** ROI histogram edges, in percent. */
const ROI_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "< -10%", min: -Infinity, max: -10 },
  { label: "-10 to -5", min: -10, max: -5 },
  { label: "-5 to 0", min: -5, max: 0 },
  { label: "0 to 5", min: 0, max: 5 },
  { label: "5 to 10", min: 5, max: 10 },
  { label: "> 10%", min: 10, max: Infinity },
];

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

export function computeAnalytics(signals: SignalRow[]): AnalyticsSummary {
  const total = signals.length || 1;
  const open = signals.filter((s) => s.status === "OPEN").length;
  const closed = signals.length - open;
  const wins = signals.filter((s) => s.status === "TARGET_HIT").length;
  const winRate = closed > 0 ? (wins / closed) * 100 : 0;
  const avgRoi = signals.reduce((sum, s) => sum + s.roi_pct, 0) / total;

  const statusMap = countBy(signals, (s) => s.status);
  const statusBreakdown: CategoryDatum[] = (
    Object.keys(STATUS_LABEL) as SignalStatus[]
  ).map((status) => ({
    key: status,
    label: STATUS_LABEL[status],
    value: statusMap.get(status) ?? 0,
  }));

  const dirMap = countBy(signals, (s) => s.direction);
  const directionBreakdown: CategoryDatum[] = [
    { key: "BUY", label: "Buy", value: dirMap.get("BUY") ?? 0 },
    { key: "SELL", label: "Sell", value: dirMap.get("SELL") ?? 0 },
  ];

  const symbolMap = countBy(signals, (s) => baseSymbol(s.symbol));
  const topSymbols: CategoryDatum[] = [...symbolMap.entries()]
    .map(([key, value]) => ({ key, label: key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const roiBuckets: CategoryDatum[] = ROI_BUCKETS.map((bucket) => ({
    key: bucket.label,
    label: bucket.label,
    value: signals.filter(
      (s) => s.roi_pct >= bucket.min && s.roi_pct < bucket.max,
    ).length,
  }));

  const dayMap = countBy(signals, (s) => s.created_at.slice(0, 10));
  const perDay = [...dayMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      date,
      label: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count,
    }));

  return {
    total: signals.length,
    open,
    closed,
    winRate,
    avgRoi,
    statusBreakdown,
    directionBreakdown,
    topSymbols,
    roiBuckets,
    perDay,
  };
}
