import { buildDashboardSnapshot } from "@/features/cycle-model/lib/calculate-cycle-projections";
import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketCandle, MarketPayload } from "@/features/market-data/types/market-data.types";

const fallbackCandles: MarketCandle[] = [
  { time: Date.UTC(2024, 0, 1), open: 42000, high: 49000, low: 39000, close: 47000, volume: 48210 },
  { time: Date.UTC(2024, 1, 1), open: 47000, high: 54000, low: 43000, close: 52000, volume: 43811 },
  { time: Date.UTC(2024, 2, 1), open: 52000, high: 64000, low: 49000, close: 61000, volume: 59821 },
  { time: Date.UTC(2024, 3, 1), open: 61000, high: 74000, low: 56000, close: 69000, volume: 62311 },
  { time: Date.UTC(2024, 4, 1), open: 69000, high: 78000, low: 62000, close: 74200, volume: 51110 },
  { time: Date.UTC(2024, 5, 1), open: 74200, high: 83200, low: 70100, close: 78600, volume: 45773 },
  { time: Date.UTC(2024, 6, 1), open: 78600, high: 88200, low: 74800, close: 85100, volume: 40322 },
  { time: Date.UTC(2024, 7, 1), open: 85100, high: 96500, low: 81200, close: 93400, volume: 51919 },
  { time: Date.UTC(2024, 8, 1), open: 93400, high: 104300, low: 89100, close: 100600, volume: 44883 },
  { time: Date.UTC(2024, 9, 1), open: 100600, high: 112400, low: 96600, close: 109200, volume: 47600 },
  { time: Date.UTC(2024, 10, 1), open: 109200, high: 121600, low: 104400, close: 116700, volume: 42532 },
  { time: Date.UTC(2024, 11, 1), open: 116700, high: 126272, low: 112300, close: 121500, volume: 38700 },
  { time: Date.UTC(2025, 0, 1), open: 121500, high: 123800, low: 110600, close: 118400, volume: 36220 },
];

const fallbackMarket: MarketPayload = {
  symbol: "BTC-USD",
  interval: "1w",
  candles: fallbackCandles,
  ticker: {
    price: fallbackCandles[fallbackCandles.length - 1].close,
    bid: fallbackCandles[fallbackCandles.length - 1].close - 120,
    ask: fallbackCandles[fallbackCandles.length - 1].close + 120,
    volume24h: fallbackCandles[fallbackCandles.length - 1].volume,
    time: new Date(Date.UTC(2025, 0, 2)).toISOString(),
  },
  lastUpdated: new Date(Date.UTC(2025, 0, 2)).toISOString(),
};

export const dashboardFallbackSnapshot: DashboardSnapshot = buildDashboardSnapshot(fallbackMarket);

