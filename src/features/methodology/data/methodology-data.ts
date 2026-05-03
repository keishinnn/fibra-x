export interface MethodologySectionItem {
  id: string;
  indexLabel: string;
  title: string;
  summary: string;
  bullets: string[];
}

export interface MethodologyVisualStep {
  id: string;
  title: string;
  imageSrc: string;
  caption: string;
  highlights: string[];
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

export const methodologyVisualSteps: MethodologyVisualStep[] = [
  {
    id: "visual-overview",
    title: "Cycle Overview with Halving Markers",
    imageSrc: "/methodology/halving-and-price-ranges.png",
    caption:
      "High-level view of Bitcoin cycle structure with halving dates and measured bull ranges used as primary research anchors.",
    highlights: [
      "Vertical halving markers separate cycle regimes.",
      "Green range blocks capture cycle-level expansion magnitude.",
      "These ranges are the base input for ratio comparison logic.",
    ],
  },
  {
    id: "visual-cycle-1",
    title: "1st Cycle Bear Mapping (2011-2013)",
    imageSrc: "/methodology/1st-halving.png",
    caption:
      "Fib retracement is drawn from cycle ATH to prior cycle low, then Fib 0.236 is used as the bear-start reference and compared to realized low.",
    highlights: [
      "Anchor pair: $1,163 high and $2 low.",
      "Fib 0.236 reference marks bear start zone.",
      "Drawdown from Fib 0.236 to realized low is tracked.",
    ],
  },
  {
    id: "visual-cycle-2",
    title: "2nd Cycle Bear Mapping (2015-2017)",
    imageSrc: "/methodology/2nd-halving.png",
    caption:
      "Same rule set is repeated to keep methodology deterministic and comparable across cycles.",
    highlights: [
      "Anchor pair: $19,666 high and $152 low.",
      "Fib 0.236 becomes the bear-start baseline.",
      "Observed drawdown is logged for historical drift analysis.",
    ],
  },
  {
    id: "visual-cycle-3",
    title: "3rd Cycle Bear Mapping (2018-2021)",
    imageSrc: "/methodology/3rd-halving.png",
    caption:
      "The third cycle validates the same Fib process and provides the latest completed bear drawdown reference before current-cycle assumptions.",
    highlights: [
      "Anchor pair: $69,000 high and $3,122 low.",
      "Fib 0.236 level is measured against realized low at $15,479.",
      "Result contributes to the base-case bear hypothesis.",
    ],
  },
  {
    id: "visual-cycle-4",
    title: "4th Cycle Base-Case Bear Scenario",
    imageSrc: "/methodology/4th-halving.png",
    caption:
      "Current-cycle bear mapping applies the fixed base-case drawdown hypothesis from Fib 0.236 because the full cycle is still in progress.",
    highlights: [
      "Anchor pair: $126,272 high and $15,479 prior low.",
      "Fib 0.236 defines the bear-start reference around $41k.",
      "Base-case drawdown assumption: -6.38%.",
    ],
  },
  {
    id: "visual-bull-ratios",
    title: "Bull Ratio Range and Projection Bands",
    imageSrc: "/methodology/5th-halving-bull-price-ranges.png",
    caption:
      "Historical bull-return compression is converted into scenario bands, then projected from the latest ATH to build conservative, median, and extension zones.",
    highlights: [
      "Ratio compression references: 3.02, 4.85, and 6.34.",
      "Scenario bands are applied as percentage expansions from cycle ATH.",
      "Outputs are interpreted as zones, not guaranteed targets.",
    ],
  },
];
