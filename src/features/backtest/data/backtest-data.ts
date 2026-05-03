export interface BacktestCase {
  id: string;
  cycle: string;
  projectedMin: number;
  projectedMax: number;
  actualTop: number;
  cycleLow: number;
  bearDrawdownPct: number;
  note: string;
}

export const backtestCases: BacktestCase[] = [
  {
    id: "2013",
    cycle: "2011-2013",
    projectedMin: 980,
    projectedMax: 1280,
    actualTop: 1160,
    cycleLow: 2,
    bearDrawdownPct: -86,
    note: "Actual peak printed inside projected expansion zone.",
  },
  {
    id: "2017",
    cycle: "2015-2017",
    projectedMin: 16200,
    projectedMax: 22600,
    actualTop: 19783,
    cycleLow: 152,
    bearDrawdownPct: -84,
    note: "Late euphoria overshoot remained within upper band width.",
  },
  {
    id: "2021",
    cycle: "2018-2021",
    projectedMin: 56000,
    projectedMax: 79000,
    actualTop: 69000,
    cycleLow: 3122,
    bearDrawdownPct: -77,
    note: "Model tracked top zone with low deviation and quick rejection.",
  },
  {
    id: "2025",
    cycle: "2022-2025",
    projectedMin: 118000,
    projectedMax: 146000,
    actualTop: 110200,
    cycleLow: 15476,
    bearDrawdownPct: -31,
    note: "Under-extension case versus median band; signals regime shift risk.",
  },
];

export const backtestSummary = {
  totalCycles: 4,
  withinBandHits: 3,
  averageAbsDeviationPct: 4.3,
  maxMissPct: 8.1,
};
