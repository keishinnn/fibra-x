import type {
  MarketCandle,
  MarketInterval,
  MarketPayload,
  MarketTicker,
} from "@/features/market-data/types/market-data.types";

const COINBASE_API_BASE_URL = "https://api.exchange.coinbase.com";
const COINBASE_MAX_CANDLES = 300;
const ONE_DAY_SECONDS = 86400;
const ONE_DAY_MS = ONE_DAY_SECONDS * 1000;
const EXTRA_WINDOW_DAYS = 21;

const intervalMaxLimit: Record<MarketInterval, number> = {
  "1d": 300,
  "1w": 260,
  "1m": 120,
};

type CoinbaseCandleTuple = [number, number, number, number, number, number];

interface CoinbaseTickerResponse {
  price: string;
  bid: string;
  ask: string;
  volume: string;
  time: string;
}

function parseNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function toMarketCandle(tuple: CoinbaseCandleTuple): MarketCandle {
  const [time, low, high, open, close, volume] = tuple;
  return {
    time: time * 1000,
    low,
    high,
    open,
    close,
    volume,
  };
}

function getMaxLimit(interval: MarketInterval): number {
  return intervalMaxLimit[interval];
}

function normalizeLimit(interval: MarketInterval, limit: number): number {
  const safeLimit = Number.isFinite(limit) ? Math.floor(limit) : 260;
  const bounded = Math.max(30, safeLimit);
  return Math.min(getMaxLimit(interval), bounded);
}

function getRequestedDailyCandles(interval: MarketInterval, limit: number): number {
  if (interval === "1d") {
    return limit + EXTRA_WINDOW_DAYS;
  }

  if (interval === "1w") {
    return limit * 7 + EXTRA_WINDOW_DAYS;
  }

  return limit * 31 + EXTRA_WINDOW_DAYS;
}

async function fetchDailyCandleChunk(
  symbol: string,
  startIso: string,
  endIso: string,
): Promise<MarketCandle[]> {
  const requestUrl = new URL(`${COINBASE_API_BASE_URL}/products/${symbol}/candles`);
  requestUrl.searchParams.set("granularity", String(ONE_DAY_SECONDS));
  requestUrl.searchParams.set("start", startIso);
  requestUrl.searchParams.set("end", endIso);

  const response = await fetch(requestUrl.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Coinbase candles request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CoinbaseCandleTuple[];
  return payload.map(toMarketCandle);
}

async function fetchTicker(symbol: string): Promise<MarketTicker> {
  const response = await fetch(`${COINBASE_API_BASE_URL}/products/${symbol}/ticker`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Coinbase ticker request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CoinbaseTickerResponse;
  const price = parseNumber(payload.price);

  if (price === null) {
    throw new Error("Coinbase ticker returned an invalid price.");
  }

  return {
    price,
    bid: parseNumber(payload.bid),
    ask: parseNumber(payload.ask),
    volume24h: parseNumber(payload.volume),
    time: payload.time ?? new Date().toISOString(),
  };
}

function dedupeAndSortCandles(candles: MarketCandle[]): MarketCandle[] {
  const byTime = new Map<number, MarketCandle>();

  for (const candle of candles) {
    byTime.set(candle.time, candle);
  }

  return Array.from(byTime.values()).sort((a, b) => a.time - b.time);
}

function getWeekStartMs(timestampMs: number): number {
  const date = new Date(timestampMs);
  const utcDay = date.getUTCDay();
  const offset = utcDay === 0 ? 6 : utcDay - 1;
  const start = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - offset,
    0,
    0,
    0,
    0,
  );
  return start;
}

function getMonthStartMs(timestampMs: number): number {
  const date = new Date(timestampMs);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0);
}

function aggregateCandles(
  candles: MarketCandle[],
  bucketStartResolver: (timestampMs: number) => number,
): MarketCandle[] {
  const sorted = dedupeAndSortCandles(candles);
  const grouped = new Map<number, MarketCandle[]>();

  for (const candle of sorted) {
    const bucketStart = bucketStartResolver(candle.time);
    const bucket = grouped.get(bucketStart);

    if (!bucket) {
      grouped.set(bucketStart, [candle]);
      continue;
    }

    bucket.push(candle);
  }

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([bucketStart, bucketCandles]) => {
      const first = bucketCandles[0];
      const last = bucketCandles[bucketCandles.length - 1];

      return {
        time: bucketStart,
        open: first.open,
        close: last.close,
        high: Math.max(...bucketCandles.map((item) => item.high)),
        low: Math.min(...bucketCandles.map((item) => item.low)),
        volume: bucketCandles.reduce((total, item) => total + item.volume, 0),
      };
    });
}

function reshapeCandles(
  candles: MarketCandle[],
  interval: MarketInterval,
  limit: number,
): MarketCandle[] {
  if (interval === "1d") {
    return dedupeAndSortCandles(candles).slice(-limit);
  }

  if (interval === "1w") {
    return aggregateCandles(candles, getWeekStartMs).slice(-limit);
  }

  return aggregateCandles(candles, getMonthStartMs).slice(-limit);
}

async function fetchDailyCandles(symbol: string, requestedCandles: number): Promise<MarketCandle[]> {
  const normalizedRequested = Math.max(30, requestedCandles);
  const requiredBatches = Math.ceil(normalizedRequested / COINBASE_MAX_CANDLES);

  const now = Date.now();
  const ranges = Array.from({ length: requiredBatches }, (_, batchIndex) => {
    const endMs = now - batchIndex * COINBASE_MAX_CANDLES * ONE_DAY_MS;
    const startMs = endMs - COINBASE_MAX_CANDLES * ONE_DAY_MS;
    return {
      startIso: new Date(startMs).toISOString(),
      endIso: new Date(endMs).toISOString(),
    };
  });

  const chunkResults = await Promise.all(
    ranges.map((range) => fetchDailyCandleChunk(symbol, range.startIso, range.endIso)),
  );

  const flattened = chunkResults.flat();
  const sorted = dedupeAndSortCandles(flattened);
  return sorted.slice(-normalizedRequested);
}

export async function getCoinbaseMarketPayload(options?: {
  symbol?: string;
  interval?: MarketInterval;
  limit?: number;
}): Promise<MarketPayload> {
  const symbol = options?.symbol ?? "BTC-USD";
  const interval = options?.interval ?? "1w";
  const normalizedLimit = normalizeLimit(interval, options?.limit ?? 260);
  const requestedDailyCandles = getRequestedDailyCandles(interval, normalizedLimit);

  const [ticker, dailyCandles] = await Promise.all([
    fetchTicker(symbol),
    fetchDailyCandles(symbol, requestedDailyCandles),
  ]);

  const candles = reshapeCandles(dailyCandles, interval, normalizedLimit);

  return {
    symbol,
    interval,
    candles,
    ticker,
    lastUpdated: new Date().toISOString(),
  };
}

