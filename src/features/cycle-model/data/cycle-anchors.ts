import type { CycleAnchor } from "@/features/cycle-model/types/cycle-model.types";

export const cycleAnchors: CycleAnchor[] = [
  {
    cycleId: "2011-2013",
    halvingDate: "2012-11-28",
    previousLow: 2,
    ath: 1163,
    fib236: 277,
    historicalDrawdownPct: -45.13,
    exactBearLow: 152,
  },
  {
    cycleId: "2015-2017",
    halvingDate: "2016-07-09",
    previousLow: 152,
    ath: 19666,
    fib236: 4768,
    historicalDrawdownPct: -34.27,
    exactBearLow: 3122,
  },
  {
    cycleId: "2018-2021",
    halvingDate: "2020-05-11",
    previousLow: 3122,
    ath: 69000,
    fib236: 18678,
    historicalDrawdownPct: -17.1,
    exactBearLow: 15479,
  },
  {
    cycleId: "2022-2025",
    halvingDate: "2024-04-20",
    previousLow: 15479,
    ath: 126272,
    fib236: 41604,
    historicalDrawdownPct: null,
    exactBearLow: null,
  },
];

export const bullRatioLevels = [
  { label: "Conservative Bull Zone", ratioPct: 30.2 },
  { label: "Median Bull Zone", ratioPct: 48.5 },
  { label: "Extension Bull Zone", ratioPct: 63.4 },
] as const;

export const defaultBearDrawdownPct = -6.38;

