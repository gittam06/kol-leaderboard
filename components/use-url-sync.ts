"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLeaderboard } from "@/lib/store";
import { filtersToQueryString, paramsToFilters } from "@/lib/url";

/**
 * Two-way binds the store's filter/sort state to the URL query string:
 * reads params once on mount, then writes back on every subsequent change.
 * The store stays the single source of truth; the URL is a shareable mirror.
 */
export function useUrlSync(): void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useRef(false);

  const search = useLeaderboard((s) => s.search);
  const minAccuracy = useLeaderboard((s) => s.minAccuracy);
  const sort = useLeaderboard((s) => s.sort);
  const hydrate = useLeaderboard((s) => s.hydrate);

  // Hydrate from the initial URL exactly once.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    hydrate(paramsToFilters(params));
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror store changes back into the URL (skip the pre-hydration render).
  useEffect(() => {
    if (!hydrated.current) return;
    const query = filtersToQueryString({ search, minAccuracy, sort });
    const next = query ? `${pathname}?${query}` : pathname;
    router.replace(next, { scroll: false });
  }, [search, minAccuracy, sort, pathname, router]);
}
