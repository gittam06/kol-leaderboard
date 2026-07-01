import { create } from "zustand";
import { toast } from "sonner";
import { fetchLeaderboard } from "./data";
import type { KolRow } from "./types";

export type SortableColumnId =
  | "accuracy_pct"
  | "total_signals"
  | "avg_roi_pct";

export type SortState = { id: SortableColumnId; desc: boolean } | null;

/** ready = data loaded; refreshing keeps old rows visible under a spinner. */
export type LoadStatus =
  | "idle"
  | "loading"
  | "refreshing"
  | "ready"
  | "error";

export const DEFAULT_SORT: SortState = { id: "accuracy_pct", desc: true };

interface LeaderboardState {
  rows: KolRow[];
  status: LoadStatus;
  error: string | null;
  lastUpdated: number | null;

  // Filters / sort — single source of truth, mirrored to the URL.
  search: string;
  minAccuracy: number;
  sort: SortState;

  selectedKolId: string | null;

  load: () => Promise<void>;
  refresh: () => Promise<void>;
  setSearch: (value: string) => void;
  setMinAccuracy: (value: number) => void;
  toggleSort: (id: SortableColumnId) => void;
  setSort: (sort: SortState) => void;
  clearFilters: () => void;
  hydrate: (partial: Partial<Pick<LeaderboardState, "search" | "minAccuracy" | "sort">>) => void;
  selectKol: (id: string | null) => void;
}

/** Increments on each fetch so a slow response can't overwrite a newer one. */
let requestSeq = 0;

export const useLeaderboard = create<LeaderboardState>((set, get) => ({
  rows: [],
  status: "idle",
  error: null,
  lastUpdated: null,

  search: "",
  minAccuracy: 0,
  sort: DEFAULT_SORT,

  selectedKolId: null,

  async load() {
    if (get().status === "loading") return;
    const seq = ++requestSeq;
    set({ status: "loading", error: null });
    try {
      const rows = await fetchLeaderboard();
      if (seq !== requestSeq) return;
      set({ rows, status: "ready", lastUpdated: Date.now(), error: null });
    } catch (err) {
      if (seq !== requestSeq) return;
      set({
        status: "error",
        error: err instanceof Error ? err.message : "Failed to load data",
      });
    }
  },

  async refresh() {
    const { status } = get();
    if (status === "loading" || status === "refreshing") return;
    const seq = ++requestSeq;
    set({ status: "refreshing" });
    try {
      const rows = await fetchLeaderboard();
      if (seq !== requestSeq) return;
      set({ rows, status: "ready", lastUpdated: Date.now(), error: null });
      toast.success("Leaderboard updated", {
        description: `${rows.length} KOLs refreshed.`,
      });
    } catch (err) {
      if (seq !== requestSeq) return;
      const message = err instanceof Error ? err.message : "Refresh failed";
      // Optimistic: keep the rows already on screen, surface the failure as a toast.
      if (get().rows.length > 0) {
        set({ status: "ready" });
        toast.error("Couldn't refresh", { description: message });
      } else {
        set({ status: "error", error: message });
      }
    }
  },

  setSearch: (search) => set({ search }),
  setMinAccuracy: (minAccuracy) =>
    set({ minAccuracy: Math.min(100, Math.max(0, minAccuracy)) }),
  setSort: (sort) => set({ sort }),
  toggleSort: (id) => {
    const current = get().sort;
    if (current?.id === id) {
      set({ sort: { id, desc: !current.desc } });
    } else {
      set({ sort: { id, desc: true } });
    }
  },
  clearFilters: () => set({ search: "", minAccuracy: 0 }),
  hydrate: (partial) => set(partial),

  selectKol: (selectedKolId) => set({ selectedKolId }),
}));

/** True when a filter is narrowing the list (sort is not a filter). */
export function hasActiveFilters(state: {
  search: string;
  minAccuracy: number;
}): boolean {
  return state.search.trim() !== "" || state.minAccuracy > 0;
}
