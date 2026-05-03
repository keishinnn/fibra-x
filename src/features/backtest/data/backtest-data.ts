export interface BacktestCase {
  id: string;
  cycle: string;
  projectedMin: number;
  projectedMax: number;
  actualTop: number;
  cycleLow: number;
  bearDrawdownPct: number;
  bearScenarioBand: string;
  note: string;
}

export const backtestCases: BacktestCase[] = [
  {
    id: "2013",
    cycle: "2011-2015",
    projectedMin: 980,
    projectedMax: 1280,
    actualTop: 1160,
    cycleLow: 2,
    bearDrawdownPct: -86,
    bearScenarioBand: "Historical realized",
    note: "Actual peak printed inside projected expansion zone.",
  },
  {
    id: "2017",
    cycle: "2015-2018",
    projectedMin: 16200,
    projectedMax: 22600,
    actualTop: 19783,
    cycleLow: 152,
    bearDrawdownPct: -84,
    bearScenarioBand: "Historical realized",
    note: "Late euphoria overshoot remained within upper band width.",
  },
  {
    id: "2021",
    cycle: "2018-2022",
    projectedMin: 56000,
    projectedMax: 79000,
    actualTop: 69000,
    cycleLow: 3122,
    bearDrawdownPct: -77,
    bearScenarioBand: "Historical realized",
    note: "Model tracked top zone with low deviation and quick rejection.",
  },
  {
    id: "2025",
    cycle: "2022-2025",
    projectedMin: 164400,
    projectedMax: 206325,
    actualTop: 126272,
    cycleLow: 15476,
    bearDrawdownPct: -12,
    bearScenarioBand: "-6.38 / -12 / -20",
    note: "Current cycle uses shallow/base/stress bear scenarios from Fib 0.236; base path is highlighted for continuity.",
  },
];

export const backtestSummary = {
  totalCycles: 4,
  withinBandHits: 3,
  averageAbsDeviationPct: 9.7,
  maxMissPct: 31.9,
};
