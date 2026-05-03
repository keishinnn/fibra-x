import { NextRequest, NextResponse } from "next/server";
import {
  buildAssumptionDashboardSnapshot,
  buildHistoricalDashboardSnapshot,
  buildRealtimeDashboardSnapshot,
  getCycleSelectionMeta,
} from "@/features/cycle-model/lib/calculate-cycle-projections";
import {
  getCoinbaseMarketPayload,
  getHistoricalBtcMarketPayload,
} from "@/features/market-data/lib/coinbase-market";
import {
  buildHistoricalSnapshotCacheKey,
  getHistoricalSnapshotFromCache,
  setHistoricalSnapshotInCache,
} from "@/features/market-data/server/historical-cycle-cache";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const allowedIntervals: MarketInterval[] = ["1d", "1w", "1m"];

function parseInterval(value: string | null): MarketInterval {
  if (!value) {
    return "1w";
  }

  if (allowedIntervals.includes(value as MarketInterval)) {
    return value as MarketInterval;
  }

  return "1w";
}

function parseLimit(value: string | null): number {
  if (!value) {
    return 260;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 260;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const interval = parseInterval(request.nextUrl.searchParams.get("interval"));
    const limit = parseLimit(request.nextUrl.searchParams.get("limit"));
    const cycleId = request.nextUrl.searchParams.get("cycleId");
    const cycleSelection = getCycleSelectionMeta(cycleId);

    if (cycleSelection.kind === "future") {
      const assumptionSnapshot = buildAssumptionDashboardSnapshot({
        cycleId: cycleSelection.id,
        interval,
        limit,
        symbol: "BTC-USD",
      });

      return NextResponse.json(assumptionSnapshot);
    }

    if (cycleSelection.kind === "historical") {
      const startDate = cycleSelection.startDate;
      if (!startDate) {
        throw new Error("Historical cycle is missing startDate metadata.");
      }
      const cacheKey = buildHistoricalSnapshotCacheKey({
        cycleId: cycleSelection.id,
        interval,
        limit,
        startDate,
        endDate: cycleSelection.endDate,
      });
      const cachedSnapshot = getHistoricalSnapshotFromCache(cacheKey);
      if (cachedSnapshot) {
        return NextResponse.json(cachedSnapshot, {
          headers: {
            "x-fibrax-cache": "historical-hit",
          },
        });
      }

      const market = await getHistoricalBtcMarketPayload({
        symbol: "BTC-USD",
        interval,
        limit,
        startDate,
        endDate: cycleSelection.endDate,
        expectedLow: cycleSelection.previousLow,
        expectedHigh: cycleSelection.ath,
      });

      const snapshot = buildHistoricalDashboardSnapshot({
        market,
        cycleId: cycleSelection.id,
      });
      setHistoricalSnapshotInCache(cacheKey, snapshot);
      return NextResponse.json(snapshot, {
        headers: {
          "x-fibrax-cache": "historical-miss",
        },
      });
    }

    const market = await getCoinbaseMarketPayload({
      symbol: "BTC-USD",
      interval,
      limit,
    });

    const snapshot = buildRealtimeDashboardSnapshot({
      market,
      cycleId: cycleSelection.id,
    });
    return NextResponse.json(snapshot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected market data failure.";
    return NextResponse.json(
      {
        error: "Failed to load realtime market snapshot.",
        message,
      },
      { status: 502 },
    );
  }
}
