import type {
  CandlePoint,
  CycleComparisonRow,
  MetricItem,
  ProjectionZone,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardCandles: CandlePoint[] = [
  {
    id: "c1",
    open: 16800,
    close: 21200,
    high: 22900,
    low: 16200,
    phase: "Accumulation",
  },
  {
    id: "c2",
    open: 21200,
    close: 26700,
    high: 27900,
    low: 20100,
    phase: "Early Bull",
  },
  {
    id: "c3",
    open: 26700,
    close: 28900,
    high: 30100,
    low: 25100,
    phase: "Early Bull",
  },
  {
    id: "c4",
    open: 28900,
    close: 33600,
    high: 34800,
    low: 27200,
    phase: "Mid Bull",
  },
  {
    id: "c5",
    open: 33600,
    close: 41100,
    high: 44300,
    low: 32200,
    phase: "Mid Bull",
  },
  {
    id: "c6",
    open: 41100,
    close: 65300,
    high: 73400,
    low: 39600,
    phase: "Euphoria",
  },
  {
    id: "c7",
    open: 65300,
    close: 59200,
    high: 70200,
    low: 55200,
    phase: "Distribution",
  },
  {
    id: "c8",
    open: 59200,
    close: 54400,
    high: 62100,
    low: 49800,
    phase: "Bear Market",
  },
  {
    id: "c9",
    open: 54400,
    close: 68300,
    high: 71800,
    low: 53600,
    phase: "Recovery",
  },
  {
    id: "c10",
    open: 68300,
    close: 81500,
    high: 84200,
    low: 67100,
    phase: "Mid Bull",
  },
  {
    id: "c11",
    open: 81500,
    close: 93400,
    high: 98300,
    low: 79300,
    phase: "Euphoria",
  },
  {
    id: "c12",
    open: 93400,
    close: 101400,
    high: 110900,
    low: 90200,
    phase: "Euphoria",
  },
  {
    id: "c13",
    open: 101400,
    close: 98800,
    high: 113200,
    low: 94700,
    phase: "Distribution",
  },
];

export const phaseLegend: Array<{ phase: CandlePoint["phase"]; tone: string }> =
  [
    { phase: "Accumulation", tone: "bg-cyan-400/85" },
    { phase: "Early Bull", tone: "bg-sky-400/85" },
    { phase: "Mid Bull", tone: "bg-indigo-400/85" },
    { phase: "Euphoria", tone: "bg-amber-400/85" },
    { phase: "Distribution", tone: "bg-orange-400/85" },
    { phase: "Bear Market", tone: "bg-rose-500/85" },
    { phase: "Capitulation", tone: "bg-red-500/85" },
    { phase: "Recovery", tone: "bg-lime-400/85" },
  ];

export const chartLegend = [
  { label: "Phase Overlay", tone: "bg-zinc-300" },
  { label: "Fib Zones", tone: "bg-[#F7931A]" },
  { label: "Halving Marker", tone: "bg-cyan-400" },
  { label: "Invalidation", tone: "bg-rose-500" },
];

export const currentPhaseFocus = {
  phase: "Distribution",
  confidenceScore: 71,
  invalidation: "$73,200",
  activeZone: "$118k - $146k",
  note: "Price remains within expansion structure but momentum is flattening near late-cycle distribution behavior.",
};

export const chartBottomSummary = [
  { label: "Cycle Similarity", value: "Closest to 2016-2020" },
  { label: "Model State", value: "Active (Phase-Weighted)" },
  { label: "Projection Bias", value: "Neutral to Bullish" },
];

export const bullBearLevels = [
  { label: "Bull Continuation Level", price: 92200, tone: "bull" as const },
  { label: "Bull-Bear Pivot", price: 84200, tone: "pivot" as const },
  { label: "Bear Pressure Level", price: 73200, tone: "bear" as const },
];

export const metricItems: MetricItem[] = [
  {
    label: "Current Cycle Phase",
    value: "Distribution",
    detail: "Model strength decreases below the 0.382 retracement cluster.",
  },
  {
    label: "Expansion Ratio",
    value: "7.12x",
    detail: "Measured from 2022 cycle low to current cycle high.",
  },
  {
    label: "Invalidation Level",
    value: "$73,200",
    detail:
      "Weekly close below this level weakens cycle similarity confidence.",
  },
  {
    label: "Closest Analog Cycle",
    value: "2016-2020",
    detail: "Time-ratio progression currently tracks this cycle profile.",
  },
];

export const projectionZones: ProjectionZone[] = [
  {
    label: "Conservative Zone",
    range: "$98k - $118k",
    tone: "neutral",
    note: "Lower-volatility continuation scenario.",
  },
  {
    label: "Median Fibonacci Zone",
    range: "$118k - $146k",
    tone: "primary",
    note: "Primary expansion band from bottom-to-top ratio history.",
  },
  {
    label: "Extension Zone",
    range: "$146k - $182k",
    tone: "warning",
    note: "High-momentum upside extension if structure persists.",
  },
  {
    label: "Bear Invalidation",
    range: "$73.2k",
    tone: "danger",
    note: "Close below invalidation reduces model reliability.",
  },
];

export const cycleComparison: CycleComparisonRow[] = [
  {
    cycle: "2011-2015",
    bottom: "$2",
    peak: "$1,160",
    growth: "580x",
    drawdown: "-86%",
  },
  {
    cycle: "2015-2018",
    bottom: "$152",
    peak: "$19,783",
    growth: "130x",
    drawdown: "-84%",
  },
  {
    cycle: "2018-2022",
    bottom: "$3,122",
    peak: "$69,000",
    growth: "22.1x",
    drawdown: "-77%",
  },
  {
    cycle: "2022-2026",
    bottom: "$15,476",
    peak: "$110,200",
    growth: "7.1x",
    drawdown: "-31%",
  },
];

export const quickNotes = [
  "This dashboard is a research visualizer built on historical cycle ratio behavior.",
  "Projection zones are scenario bands, not deterministic price targets.",
  "Historical analogs can break under new macro or liquidity regimes.",
];
