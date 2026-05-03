import type { MarketPayload } from "@/features/market-data/types/market-data.types";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

export type CycleKind = "historical" | "current" | "future";
export type CycleMode = "realtime" | "assumption";

export interface CycleDescriptor {
  id: string;
  label: string;
  halvingDate: string;
  kind: CycleKind;
}

export type CycleCatalog = CycleDescriptor[];

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
  selectedCycle: CycleDescriptor;
  cycleCatalog: CycleCatalog;
  mode: CycleMode;
  isRealtime: boolean;
  interval: MarketInterval;
  chartConnection: {
    previousCycleId: string | null;
    previousCycleLabel: string | null;
    bridgeStartPrice: number | null;
    bridgeEndPrice: number | null;
    bullLeadTargetPrice: number;
  };
  assumptions: string[];
  disclaimer: string;
}
