export interface MethodologySectionItem {
  id: string;
  indexLabel: string;
  title: string;
  summary: string;
  bullets: string[];
}

export const methodologySections: MethodologySectionItem[] = [
  {
    id: "model-measures",
    indexLabel: "01",
    title: "What the model measures",
    summary:
      "The model maps where Bitcoin sits in a cycle by combining price expansion, retracement depth, and phase transition behavior.",
    bullets: [
      "Bottom-to-top expansion multiples across halving cycles.",
      "Retracement depth against key Fibonacci anchors.",
      "Phase behavior shifts: accumulation, expansion, distribution, and bear pressure.",
      "Relative position versus prior cycle progression windows.",
    ],
  },
  {
    id: "bottom-top-selection",
    indexLabel: "02",
    title: "How cycle bottoms and tops are selected",
    summary:
      "Cycle anchors are selected from structural turning points on weekly price action rather than single intraday spikes.",
    bullets: [
      "Bottom anchor: drawdown completion and base-building confirmation.",
      "Top anchor: exhaustion zone after accelerated expansion and distribution behavior.",
      "Secondary validation through post-anchor retest and rejection patterns.",
      "No anchor is treated as permanent truth; anchors are revised if structure breaks.",
    ],
  },
  {
    id: "fibonacci-ratio-logic",
    indexLabel: "03",
    title: "Fibonacci ratio logic",
    summary:
      "FibraX uses Fibonacci-based ratio bands to define projection zones rather than a single deterministic target.",
    bullets: [
      "Base expansion from cycle low to prior cycle high.",
      "Projection bands built around common extension clusters.",
      "Retracement thresholds used for invalidation and confidence shifts.",
      "Zones are evaluated as probabilities, not certainties.",
    ],
  },
  {
    id: "historical-results",
    indexLabel: "04",
    title: "Historical cycle results",
    summary:
      "Historical results show how zone-based outputs compare against realized cycle behavior, including over- and under-shoots.",
    bullets: [
      "Cross-cycle growth and drawdown comparison.",
      "Model fit reviewed at regime boundaries.",
      "Deviations tracked to recalibrate future zone widths.",
    ],
  },
  {
    id: "limitations",
    indexLabel: "05",
    title: "Limitations",
    summary:
      "The model is research-oriented and can fail when market structure changes under new macro, liquidity, or policy conditions.",
    bullets: [
      "Past cycle similarity does not guarantee future repetition.",
      "Structural breaks can invalidate previously reliable ratios.",
      "External shocks can move price outside projected zones quickly.",
      "The dashboard is not financial advice and should not be used as a sole decision system.",
    ],
  },
];

export const methodologyResults = [
  { cycle: "2011-2013", projectedBand: "$980-$1,280", actualTop: "$1,160", deviation: "+5.2%" },
  { cycle: "2015-2017", projectedBand: "$16.2k-$22.6k", actualTop: "$19,783", deviation: "+2.1%" },
  { cycle: "2018-2021", projectedBand: "$56k-$79k", actualTop: "$69,000", deviation: "-1.6%" },
  { cycle: "2022-2025", projectedBand: "$118k-$146k", actualTop: "$110,200", deviation: "-8.1%" },
];
