import type { MarketPayload } from "@/features/market-data/types/market-data.types";

export interface CycleAnchor {
  cycleId: string;
  halvingDate: string;
  previousLow: number;
  ath: number;
  fib236?: number;
  historicalDrawdownPct?: number | null;
  exactBearLow?: number | null;
}

export interface BearProjection {
  fib236: number;
  drawdownPct: number;
  projectedLow: number;
  rangeLabel: string;
}

export interface BullProjection {
  label: string;
  ratioPct: number;
  projectedPrice: number;
}

export interface ProjectionSet {
  referenceAth: number;
  referenceLow: number;
  bear: BearProjection;
  bull: BullProjection[];
}

export interface PhaseState {
  phase: string;
  confidenceScore: number;
  activeZone: string;
  invalidation: string;
  note: string;
}

export interface DashboardSnapshot {
  market: MarketPayload;
  projections: ProjectionSet;
  phaseState: PhaseState;
  assumptions: string[];
  disclaimer: string;
}
