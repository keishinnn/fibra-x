"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentCycleId } from "@/features/cycle-model/lib/calculate-cycle-projections";
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
  isStale: boolean;
  errorMessage: string | null;
  dataSource: "realtime" | "assumption" | "fallback";
}

export function useDashboardSnapshot(): UseDashboardSnapshotResult {
  const defaultCycleId = getCurrentCycleId();
  const [interval, setInterval] = useState<MarketInterval>("1w");
  const [selectedCycleId, setSelectedCycleId] = useState<string>(defaultCycleId);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(dashboardFallbackSnapshot);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"realtime" | "assumption" | "fallback">("fallback");

  const fetchSnapshot = useCallback(async (targetInterval: MarketInterval, cycleId: string) => {
    const limit = intervalLimit[targetInterval];
    const response = await fetch(`/api/market/btc?interval=${targetInterval}&limit=${limit}&cycleId=${cycleId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Realtime market feed unavailable.");
    }

    const payload = (await response.json()) as DashboardSnapshot;
    setSnapshot(payload);
    setDataSource(payload.isRealtime ? "realtime" : "assumption");
    setIsStale(false);
    setErrorMessage(null);
    return payload;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      let shouldPoll = false;

      try {
        if (isMounted) {
          setIsLoading(true);
        }
        const payload = await fetchSnapshot(interval, selectedCycleId);
        shouldPoll = payload.isRealtime;
      } catch (error) {
        if (isMounted) {
          setIsStale(true);
          setDataSource("fallback");
          setErrorMessage(error instanceof Error ? error.message : "Unable to refresh market data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);

          if (shouldPoll) {
            timeoutId = setTimeout(async () => {
              await run();
            }, POLL_INTERVAL_MS);
          }
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchSnapshot, interval, selectedCycleId]);

  return {
    interval,
    setInterval,
    selectedCycleId,
    setSelectedCycleId,
    snapshot,
    isLoading,
    isStale,
    errorMessage,
    dataSource,
  };
}
