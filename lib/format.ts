/** Signed percentage, one decimal: 14.1 → "+14.1%", -9.2 → "−9.2%". */
export function formatSignedPct(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

/** Plain percentage, one decimal: 74.3 → "74.3%". */
export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Prices span many orders of magnitude (0.68 → 63901). Show enough precision to
 * be meaningful without noise: sub-$1 gets 4 decimals, the rest gets 2.
 */
export function formatPrice(value: number): string {
  const decimals = Math.abs(value) < 1 ? 4 : 2;
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Base asset from a Binance-style pair: "MATICUSDT" → "MATIC". */
export function baseSymbol(pair: string): string {
  return pair.replace(/USDT$|USDC$|BUSD$/i, "");
}

/** Compact relative time from an ISO string: "3h ago", "2d ago". */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  if (Number.isNaN(diff)) return "n/a";
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

/** Absolute timestamp for the header's "last updated" line. */
export function formatClockTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
