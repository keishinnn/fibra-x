import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const HISTORICAL_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface HistoricalSnapshotCacheEntry {
  expiresAt: number;
  snapshot: DashboardSnapshot;
}

const historicalSnapshotCache = new Map<string, HistoricalSnapshotCacheEntry>();

function pruneExpiredEntries(nowMs: number): void {
  for (const [key, entry] of historicalSnapshotCache.entries()) {
    if (entry.expiresAt <= nowMs) {
      historicalSnapshotCache.delete(key);
    }
  }
}

export function buildHistoricalSnapshotCacheKey(input: {
  cycleId: string;
  interval: MarketInterval;
  limit: number;
  startDate: string;
  endDate: string | null;
}): string {
  return [
    input.cycleId,
    input.interval,
    String(input.limit),
    input.startDate,
    input.endDate ?? "open-ended",
  ].join("|");
}

export function getHistoricalSnapshotFromCache(cacheKey: string): DashboardSnapshot | null {
  const nowMs = Date.now();
  pruneExpiredEntries(nowMs);
  const entry = historicalSnapshotCache.get(cacheKey);

  if (!entry) {
    return null;
  }

  return entry.snapshot;
}

export function setHistoricalSnapshotInCache(cacheKey: string, snapshot: DashboardSnapshot): void {
  const nowMs = Date.now();
  pruneExpiredEntries(nowMs);
  historicalSnapshotCache.set(cacheKey, {
    expiresAt: nowMs + HISTORICAL_CACHE_TTL_MS,
    snapshot,
  });
}
