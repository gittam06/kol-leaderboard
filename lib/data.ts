import type { Kol, KolRow, Signal } from "./types";

const KOLS_URL =
  "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/kols.json";
const SIGNALS_URL =
  "https://gist.githubusercontent.com/Sandeepsorout01/4fef48fa4ddaa7551ad9fdeb5a0087e1/raw/signals.json";

/** Max signals shown per KOL in the detail drawer. */
export const MAX_RECENT_SIGNALS = 10;

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { cache: "no-store", signal });
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Newest-first by creation time. */
function byCreatedDesc(a: Signal, b: Signal): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

/**
 * Fetches both endpoints in parallel and joins signals onto their KOL, deriving
 * the latest-10 list and ROI sparkline series each row needs. Rejects if either
 * request fails so the UI can surface a single error state.
 */
export async function fetchLeaderboard(
  signal?: AbortSignal,
): Promise<KolRow[]> {
  const [kols, signals] = await Promise.all([
    fetchJson<Kol[]>(KOLS_URL, signal),
    fetchJson<Signal[]>(SIGNALS_URL, signal),
  ]);

  const byKol = new Map<string, Signal[]>();
  for (const s of signals) {
    const list = byKol.get(s.kol_id);
    if (list) list.push(s);
    else byKol.set(s.kol_id, [s]);
  }

  return kols.map((kol): KolRow => {
    const sorted = (byKol.get(kol.id) ?? []).sort(byCreatedDesc);
    const recentSignals = sorted.slice(0, MAX_RECENT_SIGNALS);
    // Sparkline reads left→right as oldest→newest.
    const roiSeries = recentSignals
      .map((s) => s.roi_pct)
      .reverse();
    return { ...kol, recentSignals, roiSeries };
  });
}
