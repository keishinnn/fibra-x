import {
  bullRatioLevels,
  cycleAnchors,
  defaultBearDrawdownPct,
} from "@/features/cycle-model/data/cycle-anchors";
import type {
  BullProjection,
  CycleAnchor,
  DashboardSnapshot,
  PhaseState,
  ProjectionSet,
} from "@/features/cycle-model/types/cycle-model.types";
import type { MarketPayload } from "@/features/market-data/types/market-data.types";

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

function toCurrencyRange(min: number, max: number): string {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
  return `$${formatNumber(min)} - $${formatNumber(max)}`;
}

export function buildProjectionSet(
  anchor: CycleAnchor,
  drawdownPct: number = defaultBearDrawdownPct,
): ProjectionSet {
  const fib236 = calculateFibRetracementLevel(anchor.ath, anchor.previousLow, 0.236);
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

export function getActiveCycleAnchor(): CycleAnchor {
  return cycleAnchors[cycleAnchors.length - 1];
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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

export function buildDashboardSnapshot(market: MarketPayload): DashboardSnapshot {
  const activeAnchor = getActiveCycleAnchor();
  const projections = buildProjectionSet(activeAnchor, defaultBearDrawdownPct);
  const phaseState = detectPhaseState(market.ticker.price, projections);

  return {
    market,
    projections,
    phaseState,
    assumptions: [
      "Bear low estimate uses Fib 0.236 and a fixed -6.38% drawdown assumption.",
      "Bull projection levels are scenario zones at +30.20%, +48.50%, and +63.40% from cycle ATH.",
      "Model outputs are research heuristics and can fail under new market regimes.",
    ],
    disclaimer:
      "This tool is for educational and research purposes only. It does not provide financial advice, investment recommendations, or guaranteed predictions.",
  };
}

export interface HistoricalCycleRow {
  cycle: string;
  bottom: number;
  peak: number;
  growthPct: number;
  drawdownFromFibPct: number | null;
}

export function getHistoricalCycleRows(): HistoricalCycleRow[] {
  return cycleAnchors.map((anchor) => ({
    cycle: anchor.cycleId,
    bottom: anchor.previousLow,
    peak: anchor.ath,
    growthPct: ((anchor.ath - anchor.previousLow) / anchor.previousLow) * 100,
    drawdownFromFibPct: anchor.historicalDrawdownPct ?? null,
  }));
}

