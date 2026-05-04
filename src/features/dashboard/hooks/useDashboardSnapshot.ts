"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getCurrentCycleId,
  getCycleSelectionMeta,
} from "@/features/cycle-model/lib/calculate-cycle-projections";
import { dashboardFallbackSnapshot } from "@/features/dashboard/data/dashboard-fallback-data";
import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const POLL_INTERVAL_MS = 60_000;

const intervalLimit: Record<MarketInterval, number> = {
  "1d": 300,
  "1w": 260,
  "1m": 120,
};

interface UseDashboardSnapshotResult {
  interval: MarketInterval;
  setInterval: (next: MarketInterval) => void;
  selectedCycleId: string;
  setSelectedCycleId: (next: string) => void;
  snapshot: DashboardSnapshot;
  isLoading: boolean;
  isHistoricalCycleLoading: boolean;
  isCurrentCyclePageLoading: boolean;
  isStale: boolean;
  errorMessage: string | null;
  dataSource: "realtime" | "historical" | "assumption" | "fallback";
}

type SnapshotDataSource = "realtime" | "historical" | "assumption" | "fallback";

function toDataSource(mode: DashboardSnapshot["mode"]): SnapshotDataSource {
  if (mode === "realtime") {
    return "realtime";
  }
  if (mode === "historical") {
    return "historical";
  }
  return "assumption";
}

async function fetchSnapshot(targetInterval: MarketInterval, cycleId: string): Promise<DashboardSnapshot> {
  const limit = intervalLimit[targetInterval];
  const response = await fetch(`/api/market/btc?interval=${targetInterval}&limit=${limit}&cycleId=${cycleId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Realtime market feed unavailable.");
  }

  return (await response.json()) as DashboardSnapshot;
}

export function useDashboardSnapshot(): UseDashboardSnapshotResult {
  const defaultCycleId = getCurrentCycleId();
  const [interval, setInterval] = useState<MarketInterval>("1w");
  const [selectedCycleId, setSelectedCycleId] = useState<string>(defaultCycleId);
  const cycleSelection = getCycleSelectionMeta(selectedCycleId);

  const snapshotQuery = useQuery({
    queryKey: ["dashboard-snapshot", interval, selectedCycleId],
    queryFn: () => fetchSnapshot(interval, selectedCycleId),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const payload = query.state.data as DashboardSnapshot | undefined;
      return payload?.isRealtime ? POLL_INTERVAL_MS : false;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const snapshot = snapshotQuery.data ?? dashboardFallbackSnapshot;
  const dataSource: SnapshotDataSource = snapshotQuery.isError ? "fallback" : toDataSource(snapshot.mode);
  const isHistoricalCycleLoading = cycleSelection.kind === "historical" && snapshotQuery.isFetching;
  const isCurrentCyclePageLoading =
    cycleSelection.kind === "current" &&
    (snapshotQuery.isPending || (snapshotQuery.isFetching && snapshotQuery.isPlaceholderData));

  return {
    interval,
    setInterval,
    selectedCycleId,
    setSelectedCycleId,
    snapshot,
    isLoading: snapshotQuery.isFetching,
    isHistoricalCycleLoading,
    isCurrentCyclePageLoading,
    isStale: snapshotQuery.isError,
    errorMessage: snapshotQuery.isError ? snapshotQuery.error?.message ?? "Unable to refresh market data." : null,
    dataSource,
  };
}
