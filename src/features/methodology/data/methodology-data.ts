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
      "The model tracks a repeating loop: bear-level estimation from Fibonacci retracement, then bull-level scenario projection from cycle ratio behavior.",
    bullets: [
      "Bear start reference: Fibonacci 0.236 calculated from ATH to previous cycle low.",
      "Bear exact-low estimate: apply the fixed drawdown hypothesis of -6.38% from the 0.236 level.",
      "Bull projection zones: +30.20%, +48.50%, +63.40% above the latest cycle ATH.",
      "Phase interpretation: prices are mapped to scenarios, not deterministic targets.",
    ],
  },
  {
    id: "bottom-top-selection",
    indexLabel: "02",
    title: "How cycle bottoms and tops are selected",
    summary:
      "Anchors are chosen on weekly structure and tied to halving-cycle context for consistency across historical comparisons.",
    bullets: [
      "2011-2013 anchor: low $2 (Oct 17, 2011), peak $1,163 (Nov 25, 2013).",
      "2015-2017 anchor: low $152 (Jan 12, 2015), peak $19,666 (Dec 11, 2017).",
      "2018-2021 anchor: low $3,122 (Dec 10, 2018), peak $69,000 (Nov 8, 2021).",
      "2022-2025 anchor: low $15,479 (Nov 21, 2022), peak $126,272 (Oct 26, 2025).",
    ],
  },
  {
    id: "fibonacci-ratio-logic",
    indexLabel: "03",
    title: "Fibonacci ratio logic",
    summary:
      "FibraX uses a fixed Fibonacci retracement set and a ratio-based projection method to define bull/bear zones.",
    bullets: [
      "Retracement set: 0, 0.236, 0.382, 0.5, 0.616, 0.66, 0.786, 1.",
      "Bear process: ATH -> previous low, then read 0.236 as bear-start reference.",
      "Bull process: use historical bull percentages and derive ratio range 3.02-6.34.",
      "Current bull scenarios from $126,272 ATH: $164,400, $187,250, $206,325.",
    ],
  },
  {
    id: "historical-results",
    indexLabel: "04",
    title: "Historical cycle results",
    summary:
      "Historical bear-market checks compare the 0.236 starting point with realized lows to quantify drawdown drift.",
    bullets: [
      "2011-2013 drawdown from Fib 0.236 to low: -45.13%.",
      "2015-2017 drawdown from Fib 0.236 to low: -34.27%.",
      "2018-2021 drawdown from Fib 0.236 to low: -17.10%.",
      "2022-2025 current-cycle estimate applies the base-case -6.38% assumption.",
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
  { cycle: "2011-2013", projectedBand: "$277", actualTop: "$152", deviation: "-45.13%" },
  { cycle: "2015-2017", projectedBand: "$4,768", actualTop: "$3,122", deviation: "-34.27%" },
  { cycle: "2018-2021", projectedBand: "$18,678", actualTop: "$15,479", deviation: "-17.10%" },
  { cycle: "2022-2025", projectedBand: "$41,604", actualTop: "$38,966 (assumed)", deviation: "-6.38% (base case)" },
];
