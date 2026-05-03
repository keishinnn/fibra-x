"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentCycleId,
  getCycleSelectionMeta,
} from "@/features/cycle-model/lib/calculate-cycle-projections";
import { dashboardFallbackSnapshot } from "@/features/dashboard/data/dashboard-fallback-data";
import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const POLL_INTERVAL_MS = 60_000;
const HISTORICAL_LOADING_UI_DELAY_MS = 180;

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

export function useDashboardSnapshot(): UseDashboardSnapshotResult {
  const defaultCycleId = getCurrentCycleId();
  const [interval, setInterval] = useState<MarketInterval>("1w");
  const [selectedCycleId, setSelectedCycleId] = useState<string>(defaultCycleId);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(dashboardFallbackSnapshot);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoricalCycleLoading, setIsHistoricalCycleLoading] = useState(false);
  const [isCurrentCyclePageLoading, setIsCurrentCyclePageLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<SnapshotDataSource>("fallback");
  const requestSequenceRef = useRef(0);
  const previousSelectedCycleIdRef = useRef(selectedCycleId);
  const lastStableCycleIdRef = useRef(defaultCycleId);
  const hasCompletedInitialRequestRef = useRef(false);

  const fetchSnapshot = useCallback(async (targetInterval: MarketInterval, cycleId: string) => {
    const limit = intervalLimit[targetInterval];
    const response = await fetch(`/api/market/btc?interval=${targetInterval}&limit=${limit}&cycleId=${cycleId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Realtime market feed unavailable.");
    }

    return (await response.json()) as DashboardSnapshot;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let loadingStateTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const cycleSelection = getCycleSelectionMeta(selectedCycleId);
    const selectionChanged = previousSelectedCycleIdRef.current !== selectedCycleId;
    const isHistoricalSelectionLoad = selectionChanged && cycleSelection.kind === "historical";
    const isCurrentCycleSelectionLoad = selectionChanged && cycleSelection.kind === "current";
    const isInitialCurrentLoad =
      !hasCompletedInitialRequestRef.current && cycleSelection.kind === "current";

    previousSelectedCycleIdRef.current = selectedCycleId;

    const run = async () => {
      const requestId = requestSequenceRef.current + 1;
      requestSequenceRef.current = requestId;
      let shouldPoll = false;

      try {
        if (isMounted) {
          setIsLoading(true);
          setIsCurrentCyclePageLoading(isCurrentCycleSelectionLoad || isInitialCurrentLoad);
          if (isHistoricalSelectionLoad) {
            loadingStateTimeoutId = setTimeout(() => {
              if (isMounted && requestId === requestSequenceRef.current) {
                setIsHistoricalCycleLoading(true);
              }
            }, HISTORICAL_LOADING_UI_DELAY_MS);
          } else {
            setIsHistoricalCycleLoading(false);
          }
        }
        const payload = await fetchSnapshot(interval, selectedCycleId);
        if (!isMounted || requestId !== requestSequenceRef.current) {
          return;
        }

        setSnapshot(payload);
        setDataSource(toDataSource(payload.mode));
        setIsStale(false);
        setErrorMessage(null);
        lastStableCycleIdRef.current = payload.selectedCycle.id;
        shouldPoll = payload.isRealtime;
      } catch (error) {
        if (!isMounted || requestId !== requestSequenceRef.current) {
          return;
        }

        if (isMounted) {
          setIsStale(true);
          setDataSource("fallback");
          setErrorMessage(error instanceof Error ? error.message : "Unable to refresh market data.");
          if (isHistoricalSelectionLoad && lastStableCycleIdRef.current !== selectedCycleId) {
            previousSelectedCycleIdRef.current = lastStableCycleIdRef.current;
            setSelectedCycleId(lastStableCycleIdRef.current);
          }
        }
      } finally {
        if (loadingStateTimeoutId) {
          clearTimeout(loadingStateTimeoutId);
          loadingStateTimeoutId = null;
        }

        if (!isMounted || requestId !== requestSequenceRef.current) {
          return;
        }

        if (isMounted) {
          hasCompletedInitialRequestRef.current = true;
          setIsLoading(false);
          setIsHistoricalCycleLoading(false);
          setIsCurrentCyclePageLoading(false);

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
      if (loadingStateTimeoutId) {
        clearTimeout(loadingStateTimeoutId);
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
    isHistoricalCycleLoading,
    isCurrentCyclePageLoading,
    isStale,
    errorMessage,
    dataSource,
  };
}
