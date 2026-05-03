export type MarketInterval = "1d" | "1w" | "1m";

export interface MarketCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  price: number;
  bid: number | null;
  ask: number | null;
  volume24h: number | null;
  time: string;
}

export interface MarketPayload {
  symbol: string;
  interval: MarketInterval;
  candles: MarketCandle[];
  ticker: MarketTicker;
  lastUpdated: string;
}
