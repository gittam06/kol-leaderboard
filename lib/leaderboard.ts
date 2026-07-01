import type { SortState } from "./store";
import type { KolRow } from "./types";

/** Filter rows by handle search (case-insensitive) and minimum accuracy. */
export function filterRows(
  rows: KolRow[],
  search: string,
  minAccuracy: number,
): KolRow[] {
  const q = search.trim().toLowerCase();
  return rows.filter((row) => {
    if (row.accuracy_pct < minAccuracy) return false;
    if (q && !row.handle.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Return a new array sorted by the given sort state (stable, non-mutating). */
export function sortRows(rows: KolRow[], sort: SortState): KolRow[] {
  if (!sort) return rows;
  const { id, desc } = sort;
  const dir = desc ? -1 : 1;
  return [...rows].sort((a, b) => (a[id] - b[id]) * dir);
}
