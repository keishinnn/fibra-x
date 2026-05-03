import { NextRequest, NextResponse } from "next/server";
import { buildDashboardSnapshot } from "@/features/cycle-model/lib/calculate-cycle-projections";
import { getCoinbaseMarketPayload } from "@/features/market-data/lib/coinbase-market";
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

    const market = await getCoinbaseMarketPayload({
      symbol: "BTC-USD",
      interval,
      limit,
    });

    const snapshot = buildDashboardSnapshot(market);
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

