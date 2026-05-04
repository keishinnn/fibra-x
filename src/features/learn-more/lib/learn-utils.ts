import type { CycleAnchor } from "@/features/cycle-model/types/cycle-model.types";
import type { HalvingMilestone, HalvingMilestoneSeed } from "@/features/learn-more/types/learn.types";

const BLOCKS_PER_DAY = 144;

export function buildHalvingMilestones(
  cycleAnchors: CycleAnchor[],
  seeds: HalvingMilestoneSeed[],
): HalvingMilestone[] {
  return seeds.map((seed) => {
    const anchor = seed.cycleId ? cycleAnchors.find((item) => item.cycleId === seed.cycleId) : null;
    const date = anchor?.halvingDate ?? seed.estimatedDate ?? "";
    const isEstimatedDate = !anchor;
    const cycleLabel = anchor ? anchor.cycleId : "Future cycle estimate";

    return {
      ...seed,
      date,
      isEstimatedDate,
      cycleLabel,
    };
  });
}

export function formatCalendarDate(value: string): string {
  if (!value) {
    return "Date unavailable";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFibPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(ratio === 0.5 ? 0 : 1)}%`;
}

export function formatRewardBtc(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 4 })} BTC`;
}

export function formatBlockHeight(value: number): string {
  return value.toLocaleString("en-US");
}

export function estimateDailyIssuance(blockReward: number): string {
  const estimate = blockReward * BLOCKS_PER_DAY;
  return `${estimate.toLocaleString("en-US", { maximumFractionDigits: 2 })} BTC/day`;
}
