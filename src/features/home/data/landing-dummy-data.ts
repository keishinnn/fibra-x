import type { PreviewCandle, PreviewMetric } from "@/features/home/types/preview.types";

export const previewCandles: PreviewCandle[] = [
  { id: "c1", bodyHeight: 36, wickHeight: 52, tone: "bull" },
  { id: "c2", bodyHeight: 28, wickHeight: 40, tone: "bear" },
  { id: "c3", bodyHeight: 42, wickHeight: 58, tone: "bull" },
  { id: "c4", bodyHeight: 35, wickHeight: 49, tone: "bull" },
  { id: "c5", bodyHeight: 30, wickHeight: 46, tone: "bear" },
  { id: "c6", bodyHeight: 44, wickHeight: 63, tone: "bull" },
  { id: "c7", bodyHeight: 39, wickHeight: 55, tone: "bull" },
  { id: "c8", bodyHeight: 26, wickHeight: 43, tone: "bear" },
  { id: "c9", bodyHeight: 41, wickHeight: 59, tone: "bull" },
  { id: "c10", bodyHeight: 33, wickHeight: 47, tone: "bear" },
  { id: "c11", bodyHeight: 47, wickHeight: 68, tone: "bull" },
  { id: "c12", bodyHeight: 38, wickHeight: 53, tone: "bull" },
];

export const previewMetrics: PreviewMetric[] = [
  { label: "Current Phase", value: "Distribution" },
  { label: "Median Zone", value: "$118k - $146k", highlight: true },
  { label: "Invalidation", value: "$73.2k" },
];

export const featureBullets = [
  "Cycle phase overlays for bull/bear structure interpretation.",
  "Fibonacci projection zones presented as scenario ranges.",
  "Historical cycle comparison table for context and validation.",
  "Backtest-style review against prior market peaks and drawdowns.",
];

export const workflowSteps = [
  "Map historical cycle bottoms and tops from prior halving eras.",
  "Calculate retracement and expansion ratios across cycle segments.",
  "Render projection zones and invalidation levels as research outputs.",
];
