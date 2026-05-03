import {
  bullRatioLevels,
  cycleAnchors,
  defaultBearDrawdownPct,
} from "@/features/cycle-model/data/cycle-anchors";
import type {
  BullProjection,
  CycleAnchor,
  CycleCatalog,
  CycleDescriptor,
  DashboardSnapshot,
  PhaseState,
  ProjectionSet,
} from "@/features/cycle-model/types/cycle-model.types";
import type {
  MarketCandle,
  MarketInterval,
  MarketPayload,
  MarketTicker,
} from "@/features/market-data/types/market-data.types";

const FIB_LEVEL = 0.236;
const HALVING_CADENCE_YEARS = 4;
const LAST_HALVING_YEAR = 2140;
const MEDIAN_RATIO_PCT = bullRatioLevels[1].ratioPct;

interface CycleChainNode {
  descriptor: CycleDescriptor;
  anchor: CycleAnchor;
  projections: ProjectionSet;
}

function toCycleId(halvingYear: number): string {
  return `cycle-${halvingYear}`;
}

function getHalvingYear(halvingDate: string): number {
  return Number.parseInt(halvingDate.slice(0, 4), 10);
}

function buildIsoDate(year: number, templateIsoDate: string): string {
  const monthDay = templateIsoDate.slice(5);
  return `${year}-${monthDay}`;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function toCurrencyRange(min: number, max: number): string {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  return `$${formatNumber(min)} - $${formatNumber(max)}`;
}

function getKnownAnchorsSorted(): CycleAnchor[] {
  return [...cycleAnchors].sort(
    (a, b) => new Date(a.halvingDate).getTime() - new Date(b.halvingDate).getTime(),
  );
}

function getCurrentKnownHalvingYear(): number {
  const known = getKnownAnchorsSorted();
  return getHalvingYear(known[known.length - 1].halvingDate);
}

function getCurrentTemplateHalvingDate(): string {
  const known = getKnownAnchorsSorted();
  return known[known.length - 1].halvingDate;
}

function computeConfidence(price: number, referenceAth: number): number {
  const ratio = price / referenceAth;

  if (ratio >= 1.1) {
    return 78;
  }
  if (ratio >= 0.95) {
    return 72;
  }
  if (ratio >= 0.75) {
    return 66;
  }
  return 58;
}

function getIntervalStepMs(interval: MarketInterval): number {
  if (interval === "1d") {
    return 24 * 60 * 60 * 1000;
  }
  if (interval === "1w") {
    return 7 * 24 * 60 * 60 * 1000;
  }
  return 30 * 24 * 60 * 60 * 1000;
}

function buildCycleChain(lastHalvingYear: number = LAST_HALVING_YEAR): CycleChainNode[] {
  const knownAnchors = getKnownAnchorsSorted();
  const currentHalvingYear = getCurrentKnownHalvingYear();
  const templateHalvingDate = getCurrentTemplateHalvingDate();

  const knownNodes = knownAnchors.map<CycleChainNode>((anchor) => {
    const halvingYear = getHalvingYear(anchor.halvingDate);
    const kind = halvingYear < currentHalvingYear ? "historical" : "current";

    return {
      descriptor: {
        id: toCycleId(halvingYear),
        label: anchor.cycleId,
        halvingDate: anchor.halvingDate,
        kind,
      },
      anchor,
      projections: buildProjectionSet(anchor, defaultBearDrawdownPct),
    };
  });

  const chain = [...knownNodes];
  let previousNode = chain[chain.length - 1];

  for (
    let halvingYear = currentHalvingYear + HALVING_CADENCE_YEARS;
    halvingYear <= lastHalvingYear;
    halvingYear += HALVING_CADENCE_YEARS
  ) {
    const previousLow = previousNode.projections.bear.projectedLow;
    const ath = previousNode.anchor.ath * (1 + MEDIAN_RATIO_PCT / 100);

    const futureAnchor: CycleAnchor = {
      cycleId: `Cycle ${halvingYear}-${halvingYear + 3} (Assumed)`,
      halvingDate: buildIsoDate(halvingYear, templateHalvingDate),
      previousLow,
      ath,
      historicalDrawdownPct: null,
      exactBearLow: null,
    };

    const futureNode: CycleChainNode = {
      descriptor: {
        id: toCycleId(halvingYear),
        label: futureAnchor.cycleId,
        halvingDate: futureAnchor.halvingDate,
        kind: "future",
      },
      anchor: futureAnchor,
      projections: buildProjectionSet(futureAnchor, defaultBearDrawdownPct),
    };

    chain.push(futureNode);
    previousNode = futureNode;
  }

  return chain;
}

function getCycleNodeById(chain: CycleChainNode[], cycleId: string | null | undefined): CycleChainNode {
  const currentNode = chain.find((node) => node.descriptor.kind === "current") ?? chain[chain.length - 1];

  if (!cycleId) {
    return currentNode;
  }

  return chain.find((node) => node.descriptor.id === cycleId) ?? currentNode;
}

function buildCycleCatalog(chain: CycleChainNode[]): CycleCatalog {
  return chain.map((node) => node.descriptor);
}

function generateSyntheticCandles(
  node: CycleChainNode,
  interval: MarketInterval,
  limit: number,
): MarketCandle[] {
  const count = Math.max(30, Math.floor(limit));
  const stepMs = getIntervalStepMs(interval);
  const halvingMs = new Date(`${node.descriptor.halvingDate}T00:00:00.000Z`).getTime();
  const startMs = halvingMs - Math.floor(count * 0.3) * stepMs;

  const low = node.anchor.previousLow;
  const ath = node.anchor.ath;
  const fib236 = node.projections.bear.fib236;
  const projectedBearLow = node.projections.bear.projectedLow;

  let previousClose = low * 1.02;
  const candles: MarketCandle[] = [];

  for (let index = 0; index < count; index += 1) {
    const progress = index / (count - 1);
    let baselinePrice = low;

    if (progress < 0.18) {
      baselinePrice = low + (fib236 * 0.9 - low) * (progress / 0.18);
    } else if (progress < 0.58) {
      baselinePrice = fib236 * 0.9 + (ath - fib236 * 0.9) * ((progress - 0.18) / 0.4);
    } else if (progress < 0.72) {
      baselinePrice = ath - ath * 0.07 * ((progress - 0.58) / 0.14);
    } else {
      baselinePrice = ath * 0.93 + (projectedBearLow - ath * 0.93) * ((progress - 0.72) / 0.28);
    }

    const wave = Math.sin(index * 0.47) * 0.015 + Math.cos(index * 0.19) * 0.008;
    const close = Math.max(projectedBearLow * 0.85, baselinePrice * (1 + wave));
    const open = previousClose;
    const high = Math.max(open, close) * (1 + 0.012 + Math.abs(Math.sin(index * 0.31)) * 0.01);
    const lowPrice = Math.max(
      projectedBearLow * 0.75,
      Math.min(open, close) * (1 - 0.012 - Math.abs(Math.cos(index * 0.23)) * 0.008),
    );
    const volume = 25000 + Math.abs(Math.sin(index * 0.29)) * 18000 + progress * 6000;

    candles.push({
      time: startMs + index * stepMs,
      open,
      high,
      low: lowPrice,
      close,
      volume,
    });

    previousClose = close;
  }

  return candles;
}

function buildSyntheticTicker(candles: MarketCandle[]): MarketTicker {
  const last = candles[candles.length - 1];
  const bid = last.close * 0.9985;
  const ask = last.close * 1.0015;

  return {
    price: last.close,
    bid,
    ask,
    volume24h: last.volume,
    time: new Date(last.time).toISOString(),
  };
}

function buildSyntheticMarketPayload(options: {
  node: CycleChainNode;
  interval: MarketInterval;
  limit: number;
  symbol?: string;
}): MarketPayload {
  const candles = generateSyntheticCandles(options.node, options.interval, options.limit);

  return {
    symbol: options.symbol ?? "BTC-USD",
    interval: options.interval,
    candles,
    ticker: buildSyntheticTicker(candles),
    lastUpdated: new Date().toISOString(),
  };
}

function getAssumptionMessages(mode: "realtime" | "assumption"): string[] {
  if (mode === "assumption") {
    return [
      "Selected cycle is rendered in assumption mode using deterministic synthetic candles.",
      "Bear low estimate uses Fib 0.236 and a fixed -6.38% drawdown assumption.",
      "Future cycle chaining uses the +48.50% median bull path as the canonical connector.",
      "Bull projection levels remain scenario zones at +30.20%, +48.50%, and +63.40% from cycle ATH.",
    ];
  }

  return [
    "Selected cycle is in realtime mode with live market candles.",
    "Bear low estimate uses Fib 0.236 and a fixed -6.38% drawdown assumption.",
    "Bull projection levels are scenario zones at +30.20%, +48.50%, and +63.40% from cycle ATH.",
    "Model outputs are research heuristics and can fail under new market regimes.",
  ];
}

export function calculateFibRetracementLevel(
  ath: number,
  previousLow: number,
  ratio: number,
): number {
  return previousLow + (ath - previousLow) * ratio;
}

export function calculateProjectedBearLow(fibLevel: number, drawdownPct: number): number {
  return fibLevel * (1 + drawdownPct / 100);
}

export function buildProjectionSet(
  anchor: CycleAnchor,
  drawdownPct: number = defaultBearDrawdownPct,
): ProjectionSet {
  const fib236 = calculateFibRetracementLevel(anchor.ath, anchor.previousLow, FIB_LEVEL);
  const projectedLow = calculateProjectedBearLow(fib236, drawdownPct);

  const bull = bullRatioLevels.map<BullProjection>((ratioItem) => ({
    label: ratioItem.label,
    ratioPct: ratioItem.ratioPct,
    projectedPrice: anchor.ath * (1 + ratioItem.ratioPct / 100),
  }));

  return {
    referenceAth: anchor.ath,
    referenceLow: anchor.previousLow,
    bear: {
      fib236,
      drawdownPct,
      projectedLow,
      rangeLabel: toCurrencyRange(projectedLow, fib236),
    },
    bull,
  };
}

export function getCurrentCycleId(): string {
  return toCycleId(getCurrentKnownHalvingYear());
}

export function getCycleCatalog(lastHalvingYear: number = LAST_HALVING_YEAR): CycleCatalog {
  return buildCycleCatalog(buildCycleChain(lastHalvingYear));
}

export function detectPhaseState(currentPrice: number, projections: ProjectionSet): PhaseState {
  const [conservative, median, extension] = projections.bull;
  const fib236 = projections.bear.fib236;
  const projectedBearLow = projections.bear.projectedLow;
  const invalidationLevel = projections.referenceAth * 0.5;

  let phase = "Recovery";
  let note =
    "Price is rebuilding from the prior cycle drawdown area while the model tracks whether structure can hold above key retracement levels.";

  if (currentPrice <= projectedBearLow) {
    phase = "Capitulation Risk";
    note =
      "Price is testing or below the projected bear low scenario, which indicates a weak cycle structure and elevated downside pressure.";
  } else if (currentPrice <= fib236) {
    phase = "Bear Market";
    note =
      "Price is below the 0.236 retracement reference, where the model marks bear-pressure behavior and lower confidence in expansion continuation.";
  } else if (currentPrice < conservative.projectedPrice) {
    phase = "Early Bull";
    note =
      "Price is above bear-risk reference levels and approaching the conservative expansion band while trend confirmation remains in progress.";
  } else if (currentPrice < median.projectedPrice) {
    phase = "Mid Bull";
    note =
      "Price is inside the projected expansion structure between conservative and median bull zones.";
  } else if (currentPrice < extension.projectedPrice) {
    phase = "Late Bull";
    note =
      "Price is in upper-cycle expansion territory and nearing extension conditions where volatility and rejection risk can increase.";
  } else {
    phase = "Euphoria Extension";
    note =
      "Price is beyond the extension zone, indicating potential overextension where historical analog reliability can degrade quickly.";
  }

  const activeZone = toCurrencyRange(conservative.projectedPrice, extension.projectedPrice);

  return {
    phase,
    confidenceScore: computeConfidence(currentPrice, projections.referenceAth),
    activeZone,
    invalidation: formatUsd(invalidationLevel),
    note,
  };
}

export function buildRealtimeDashboardSnapshot(options: {
  market: MarketPayload;
  cycleId?: string | null;
  lastHalvingYear?: number;
}): DashboardSnapshot {
  const chain = buildCycleChain(options.lastHalvingYear ?? LAST_HALVING_YEAR);
  const currentNode = getCycleNodeById(chain, getCurrentCycleId());
  const selectedNode = options.cycleId ? getCycleNodeById(chain, options.cycleId) : currentNode;
  const realtimeNode = selectedNode.descriptor.kind === "current" ? selectedNode : currentNode;

  return {
    market: options.market,
    projections: realtimeNode.projections,
    phaseState: detectPhaseState(options.market.ticker.price, realtimeNode.projections),
    selectedCycle: realtimeNode.descriptor,
    cycleCatalog: buildCycleCatalog(chain),
    mode: "realtime",
    isRealtime: true,
    interval: options.market.interval,
    assumptions: getAssumptionMessages("realtime"),
    disclaimer:
      "This tool is for educational and research purposes only. It does not provide financial advice, investment recommendations, or guaranteed predictions.",
  };
}

export function buildAssumptionDashboardSnapshot(options: {
  cycleId: string;
  interval: MarketInterval;
  limit: number;
  symbol?: string;
  lastHalvingYear?: number;
}): DashboardSnapshot {
  const chain = buildCycleChain(options.lastHalvingYear ?? LAST_HALVING_YEAR);
  const selectedNode = getCycleNodeById(chain, options.cycleId);
  const market = buildSyntheticMarketPayload({
    node: selectedNode,
    interval: options.interval,
    limit: options.limit,
    symbol: options.symbol,
  });

  return {
    market,
    projections: selectedNode.projections,
    phaseState: detectPhaseState(market.ticker.price, selectedNode.projections),
    selectedCycle: selectedNode.descriptor,
    cycleCatalog: buildCycleCatalog(chain),
    mode: "assumption",
    isRealtime: false,
    interval: options.interval,
    assumptions: getAssumptionMessages("assumption"),
    disclaimer:
      "This tool is for educational and research purposes only. It does not provide financial advice, investment recommendations, or guaranteed predictions.",
  };
}

export function buildDashboardSnapshot(market: MarketPayload): DashboardSnapshot {
  return buildRealtimeDashboardSnapshot({ market });
}

export interface HistoricalCycleRow {
  cycle: string;
  bottom: number;
  peak: number;
  growthPct: number;
  drawdownFromFibPct: number | null;
}

export function getHistoricalCycleRows(): HistoricalCycleRow[] {
  return getKnownAnchorsSorted().map((anchor) => ({
    cycle: anchor.cycleId,
    bottom: anchor.previousLow,
    peak: anchor.ath,
    growthPct: ((anchor.ath - anchor.previousLow) / anchor.previousLow) * 100,
    drawdownFromFibPct: anchor.historicalDrawdownPct ?? null,
  }));
}
