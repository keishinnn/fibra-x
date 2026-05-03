import type {
  MarketCandle,
  MarketInterval,
  MarketPayload,
  MarketTicker,
} from "@/features/market-data/types/market-data.types";

const COINBASE_API_BASE_URL = "https://api.exchange.coinbase.com";
const COINBASE_MAX_CANDLES = 300;
const CRYPTOCOMPARE_API_BASE_URL = "https://min-api.cryptocompare.com";
const CRYPTOCOMPARE_MAX_CANDLES = 2000;
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

interface CryptoCompareCandle {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volumefrom: number;
  volumeto: number;
}

interface CryptoCompareHistodayResponse {
  Response?: string;
  Message?: string;
  Data?: {
    Data?: CryptoCompareCandle[];
  };
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

function toMarketCandleFromCryptoCompare(item: CryptoCompareCandle): MarketCandle {
  return {
    time: item.time * 1000,
    low: item.low,
    high: item.high,
    open: item.open,
    close: item.close,
    volume: item.volumeto || item.volumefrom || 0,
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

function dedupeAndSortCandles(candles: MarketCandle[]): MarketCandle[] {
  const byTime = new Map<number, MarketCandle>();

  for (const candle of candles) {
    byTime.set(candle.time, candle);
  }

  return Array.from(byTime.values()).sort((a, b) => a.time - b.time);
}

function isFiniteCandle(candle: MarketCandle): boolean {
  return (
    Number.isFinite(candle.time) &&
    Number.isFinite(candle.open) &&
    Number.isFinite(candle.high) &&
    Number.isFinite(candle.low) &&
    Number.isFinite(candle.close) &&
    Number.isFinite(candle.volume)
  );
}

function sanitizeHistoricalCandles(
  candles: MarketCandle[],
  expectedLow: number,
  expectedHigh: number,
): MarketCandle[] {
  const rangeFloor = Math.max(0.01, expectedLow * 0.2);
  const rangeCeiling = Math.max(expectedHigh * 3, expectedLow * 15);

  const filtered = dedupeAndSortCandles(candles).filter((candle) => {
    if (!isFiniteCandle(candle)) {
      return false;
    }

    if (candle.low <= 0 || candle.high <= 0 || candle.open <= 0 || candle.close <= 0) {
      return false;
    }

    if (candle.low > candle.high) {
      return false;
    }

    if (
      candle.open > rangeCeiling ||
      candle.close > rangeCeiling ||
      candle.high > rangeCeiling ||
      candle.low > rangeCeiling
    ) {
      return false;
    }

    if (
      candle.open < rangeFloor ||
      candle.close < rangeFloor ||
      candle.high < rangeFloor ||
      candle.low < rangeFloor
    ) {
      return false;
    }

    return true;
  });

  return filtered.length > 0 ? filtered : dedupeAndSortCandles(candles);
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

function parseTradingPair(symbol: string): { base: string; quote: string } {
  const [base, quote] = symbol.split("-");
  if (!base || !quote) {
    throw new Error(`Invalid market symbol "${symbol}". Expected format like BTC-USD.`);
  }
  return { base, quote };
}

function toStartMs(date: string): number {
  return new Date(`${date}T00:00:00.000Z`).getTime();
}

function toEndMs(date: string): number {
  return new Date(`${date}T23:59:59.999Z`).getTime();
}

function buildTickerFromCandles(candles: MarketCandle[]): MarketTicker {
  if (candles.length === 0) {
    throw new Error("Historical candle response contained no data.");
  }

  const last = candles[candles.length - 1];
  return {
    price: last.close,
    bid: last.close * 0.9985,
    ask: last.close * 1.0015,
    volume24h: last.volume,
    time: new Date(last.time).toISOString(),
  };
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

async function fetchDailyCandlesInRange(
  symbol: string,
  startMs: number,
  endMs: number,
): Promise<MarketCandle[]> {
  if (endMs <= startMs) {
    return [];
  }

  const ranges: Array<{ startIso: string; endIso: string }> = [];
  let cursorEnd = endMs;
  let guard = 0;

  while (cursorEnd > startMs && guard < 400) {
    const cursorStart = Math.max(startMs, cursorEnd - COINBASE_MAX_CANDLES * ONE_DAY_MS);
    ranges.push({
      startIso: new Date(cursorStart).toISOString(),
      endIso: new Date(cursorEnd).toISOString(),
    });

    cursorEnd = cursorStart - ONE_DAY_MS;
    guard += 1;
  }

  const chunkResults = await Promise.all(
    ranges.map((range) => fetchDailyCandleChunk(symbol, range.startIso, range.endIso)),
  );

  return dedupeAndSortCandles(chunkResults.flat()).filter(
    (candle) => candle.time >= startMs && candle.time <= endMs,
  );
}

async function fetchCryptoCompareDailyChunk(
  symbol: string,
  toTs: number,
): Promise<MarketCandle[]> {
  const { base, quote } = parseTradingPair(symbol);
  const requestUrl = new URL(`${CRYPTOCOMPARE_API_BASE_URL}/data/v2/histoday`);
  requestUrl.searchParams.set("fsym", base);
  requestUrl.searchParams.set("tsym", quote);
  requestUrl.searchParams.set("limit", String(CRYPTOCOMPARE_MAX_CANDLES));
  requestUrl.searchParams.set("toTs", String(toTs));

  const response = await fetch(requestUrl.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CryptoCompare candles request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as CryptoCompareHistodayResponse;
  if (payload.Response !== "Success") {
    const message = payload.Message ?? "Unknown CryptoCompare error";
    throw new Error(`CryptoCompare candles request failed: ${message}`);
  }

  return (payload.Data?.Data ?? []).map(toMarketCandleFromCryptoCompare);
}

async function fetchCryptoCompareDailyCandlesInRange(
  symbol: string,
  startMs: number,
  endMs: number,
): Promise<MarketCandle[]> {
  if (endMs <= startMs) {
    return [];
  }

  const candles: MarketCandle[] = [];
  let cursorToTs = Math.floor(endMs / 1000);
  const startTs = Math.floor(startMs / 1000);
  let guard = 0;

  while (cursorToTs >= startTs && guard < 32) {
    const chunk = await fetchCryptoCompareDailyChunk(symbol, cursorToTs);
    if (chunk.length === 0) {
      break;
    }

    candles.push(
      ...chunk.filter((item) => item.time >= startMs && item.time <= endMs),
    );

    const oldestMs = chunk[0].time;
    if (oldestMs <= startMs) {
      break;
    }

    cursorToTs = Math.floor((oldestMs - ONE_DAY_MS) / 1000);
    guard += 1;
  }

  return dedupeAndSortCandles(candles);
}

async function fetchHistoricalDailyCandles(
  symbol: string,
  startMs: number,
  endMs: number,
): Promise<MarketCandle[]> {
  try {
    const historicalCandles = await fetchCryptoCompareDailyCandlesInRange(symbol, startMs, endMs);
    if (historicalCandles.length > 0) {
      return historicalCandles;
    }
  } catch {
    // Fall through to Coinbase range fetch as secondary source.
  }

  const coinbaseCandles = await fetchDailyCandlesInRange(symbol, startMs, endMs);
  if (coinbaseCandles.length > 0) {
    return coinbaseCandles;
  }

  throw new Error("No historical BTC/USD candles found for the selected cycle window.");
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

async function fetchDailyCandles(symbol: string, requestedCandles: number): Promise<MarketCandle[]> {
  const normalizedRequested = Math.max(30, requestedCandles);
  const now = Date.now();
  const startMs = now - normalizedRequested * ONE_DAY_MS;

  const candles = await fetchDailyCandlesInRange(symbol, startMs, now);
  return candles.slice(-normalizedRequested);
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

export async function getHistoricalBtcMarketPayload(options: {
  symbol?: string;
  interval?: MarketInterval;
  limit?: number;
  startDate: string;
  endDate?: string | null;
  expectedLow: number;
  expectedHigh: number;
}): Promise<MarketPayload> {
  const symbol = options.symbol ?? "BTC-USD";
  const interval = options.interval ?? "1w";
  const normalizedLimit = normalizeLimit(interval, options.limit ?? 260);

  const startMs = toStartMs(options.startDate);
  const endMs = options.endDate ? toEndMs(options.endDate) : Date.now();

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    throw new Error("Invalid historical cycle date range.");
  }

  const dailyCandles = await fetchHistoricalDailyCandles(symbol, startMs, endMs);
  const sanitizedDailyCandles = sanitizeHistoricalCandles(
    dailyCandles,
    options.expectedLow,
    options.expectedHigh,
  );
  const candles = reshapeCandles(sanitizedDailyCandles, interval, normalizedLimit);
  const ticker = buildTickerFromCandles(candles);

  return {
    symbol,
    interval,
    candles,
    ticker,
    lastUpdated: new Date(endMs).toISOString(),
  };
}
