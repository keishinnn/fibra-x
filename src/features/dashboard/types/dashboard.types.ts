export type CyclePhase =
  | "Accumulation"
  | "Early Bull"
  | "Mid Bull"
  | "Euphoria"
  | "Distribution"
  | "Bear Market"
  | "Capitulation"
  | "Recovery";

export interface CandlePoint {
  id: string;
  open: number;
  close: number;
  high: number;
  low: number;
  phase: CyclePhase;
}

export interface ProjectionZone {
  label: string;
  range: string;
  tone: "primary" | "neutral" | "warning" | "danger";
  note: string;
}

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface CycleComparisonRow {
  cycle: string;
  bottom: string;
  peak: string;
  growth: string;
  drawdown: string;
}
