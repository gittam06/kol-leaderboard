import { DEFAULT_SORT, type SortableColumnId, type SortState } from "./store";

const SORT_TO_SLUG: Record<SortableColumnId, string> = {
  accuracy_pct: "acc",
  total_signals: "sig",
  avg_roi_pct: "roi",
};

const SLUG_TO_SORT: Record<string, SortableColumnId> = {
  acc: "accuracy_pct",
  sig: "total_signals",
  roi: "avg_roi_pct",
};

export interface FilterParams {
  search: string;
  minAccuracy: number;
  sort: SortState;
}

/** Read filter/sort state out of URL query params, falling back to defaults. */
export function paramsToFilters(params: URLSearchParams): FilterParams {
  const search = params.get("q") ?? "";

  const minRaw = Number(params.get("min"));
  const minAccuracy =
    Number.isFinite(minRaw) && minRaw > 0 ? Math.min(100, minRaw) : 0;

  const sortSlug = params.get("sort");
  const dir = params.get("dir");
  let sort: SortState = DEFAULT_SORT;
  if (sortSlug && SLUG_TO_SORT[sortSlug]) {
    sort = { id: SLUG_TO_SORT[sortSlug], desc: dir !== "asc" };
  }

  return { search, minAccuracy, sort };
}

/** Serialize filter/sort state to a query string, omitting defaults. */
export function filtersToQueryString(filters: FilterParams): string {
  const params = new URLSearchParams();
  if (filters.search.trim() !== "") params.set("q", filters.search.trim());
  if (filters.minAccuracy > 0) params.set("min", String(filters.minAccuracy));

  const { sort } = filters;
  const isDefault =
    sort?.id === DEFAULT_SORT?.id && sort?.desc === DEFAULT_SORT?.desc;
  if (sort && !isDefault) {
    params.set("sort", SORT_TO_SLUG[sort.id]);
    params.set("dir", sort.desc ? "desc" : "asc");
  }

  return params.toString();
}
