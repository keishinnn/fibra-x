import type {
  ChecklistItem,
  FibLevelExplainer,
  HalvingMilestoneSeed,
  LearnLinkCard,
  LearnNavItem,
  ResearchWorkflowStep,
  WhyFibonacciReason,
  WorkflowStep,
} from "@/features/learn-more/types/learn.types";

export const learnNavItems: LearnNavItem[] = [
  { id: "what-is-fib", indexLabel: "01", title: "What Is Fibonacci Retracement?" },
  { id: "why-fibonacci", indexLabel: "02", title: "Why Fibonacci?" },
  { id: "how-to-use", indexLabel: "03", title: "How To Use It" },
  { id: "halving-primer", indexLabel: "04", title: "Bitcoin Halving Primer" },
  { id: "fibrax-workflow", indexLabel: "05", title: "Fib + Halving Workflow" },
];

export const fibLevelExplainers: FibLevelExplainer[] = [
  {
    id: "fib-236",
    ratio: 0.236,
    label: "Shallow Pullback",
    summary: "Often seen when momentum is strong and buyers return quickly.",
    explanation:
      "In uptrends, this can act as an early support test. In downtrends, it can become an early rejection zone.",
  },
  {
    id: "fib-382",
    ratio: 0.382,
    label: "Moderate Pullback",
    summary: "A common area where trend continuation can resume.",
    explanation:
      "Many traders watch this level for confirmation with structure breaks, wick reactions, or volume response.",
  },
  {
    id: "fib-500",
    ratio: 0.5,
    label: "Midpoint Zone",
    summary: "Not a Fibonacci ratio from the sequence, but widely tracked.",
    explanation:
      "The 50% level often matters because market participants view it as a fair-value pullback area.",
  },
  {
    id: "fib-618",
    ratio: 0.618,
    label: "Golden Pocket Core",
    summary: "A key retracement level with strong attention across timeframes.",
    explanation:
      "Traders often combine 0.618 with local support/resistance and market structure for higher-confidence setups.",
  },
  {
    id: "fib-786",
    ratio: 0.786,
    label: "Deep Retracement",
    summary: "A deeper correction that can still preserve trend structure.",
    explanation:
      "When price reaches this zone, invalidation planning becomes important because trend failure risk increases.",
  },
];

export const whyFibonacciReasons: WhyFibonacciReason[] = [
  {
    id: "crowd-behavior",
    title: "Shared Attention Creates Reactions",
    body: "Fibonacci levels are widely watched, so clusters of orders often gather around similar zones.",
  },
  {
    id: "risk-structure",
    title: "Clear Risk Structure",
    body: "Fib zones give traders repeatable reference points for entries, invalidation, and target planning.",
  },
  {
    id: "confluence",
    title: "Confluence Over Certainty",
    body: "The best use is confluence: combine fib zones with structure, trend direction, and higher timeframe context.",
  },
];

export const fibonacciLimitations: string[] = [
  "Fibonacci levels do not predict the future by themselves.",
  "A level can fail quickly during macro shocks or liquidity events.",
  "Using fib without trend context can lead to low-quality signals.",
  "FibraX treats fib outputs as research zones, not guaranteed targets.",
];

export const uptrendSteps: WorkflowStep[] = [
  {
    id: "uptrend-1",
    title: "Find a clear swing low to swing high.",
    detail: "Anchor the retracement from low to high in a rising structure.",
  },
  {
    id: "uptrend-2",
    title: "Map support candidates at 0.382, 0.5, and 0.618.",
    detail: "These levels often become pullback zones when the trend remains healthy.",
  },
  {
    id: "uptrend-3",
    title: "Wait for reaction before acting.",
    detail: "Look for acceptance, reclaim, or momentum return rather than guessing early.",
  },
];

export const downtrendSteps: WorkflowStep[] = [
  {
    id: "downtrend-1",
    title: "Find a clear swing high to swing low.",
    detail: "Anchor the retracement from high to low in a falling structure.",
  },
  {
    id: "downtrend-2",
    title: "Map resistance candidates at 0.382, 0.5, and 0.618.",
    detail: "These levels can act as bounce-and-reject zones inside the downtrend.",
  },
  {
    id: "downtrend-3",
    title: "Confirm rejection before biasing lower.",
    detail: "Use structure and candle behavior to reduce false continuation signals.",
  },
];

export const doChecklist: ChecklistItem[] = [
  { id: "do-1", text: "Start from higher timeframe context before lower timeframe entries." },
  { id: "do-2", text: "Treat fib levels as zones, not exact single-price lines." },
  { id: "do-3", text: "Define invalidation before setting any target expectations." },
];

export const dontChecklist: ChecklistItem[] = [
  { id: "dont-1", text: "Do not force fib anchors on unclear or noisy swings." },
  { id: "dont-2", text: "Do not use fib levels as standalone guarantees." },
  { id: "dont-3", text: "Do not ignore volatility and macro conditions around key events." },
];

export const halvingPrimerPoints: string[] = [
  "Bitcoin halving is coded by block height: every 210,000 blocks, reward issuance is cut in half.",
  "Because it is block-based, the calendar date is always an estimate for future halvings.",
  "Lower new issuance can shift miner economics, supply flow, and long-term cycle narratives.",
];

export const halvingMilestoneSeeds: HalvingMilestoneSeed[] = [
  {
    id: "halving-2012",
    cycleId: "2011-2015",
    label: "1st Halving",
    blockHeight: 210000,
    rewardBefore: 50,
    rewardAfter: 25,
    status: "completed",
    note: "First major reduction in issuance. Early market structure still highly volatile.",
  },
  {
    id: "halving-2016",
    cycleId: "2015-2018",
    label: "2nd Halving",
    blockHeight: 420000,
    rewardBefore: 25,
    rewardAfter: 12.5,
    status: "completed",
    note: "Second reduction as market participation and infrastructure continued to expand.",
  },
  {
    id: "halving-2020",
    cycleId: "2018-2022",
    label: "3rd Halving",
    blockHeight: 630000,
    rewardBefore: 12.5,
    rewardAfter: 6.25,
    status: "completed",
    note: "Third reduction during an era of broader institutional awareness.",
  },
  {
    id: "halving-2024",
    cycleId: "2022-2025",
    label: "4th Halving",
    blockHeight: 840000,
    rewardBefore: 6.25,
    rewardAfter: 3.125,
    status: "active",
    note: "Current issuance era. FibraX treats this cycle as active and scenario-based.",
  },
  {
    id: "halving-2028",
    cycleId: null,
    label: "5th Halving (Estimated)",
    blockHeight: 1050000,
    rewardBefore: 3.125,
    rewardAfter: 1.5625,
    status: "upcoming",
    estimatedDate: "2028-04-20",
    note: "Estimated window only. Exact timing depends on when block 1,050,000 is mined.",
  },
];

export const researchWorkflowSteps: ResearchWorkflowStep[] = [
  {
    id: "workflow-1",
    title: "Start with cycle context",
    detail: "Check where Bitcoin sits relative to the active halving cycle and broader market regime.",
  },
  {
    id: "workflow-2",
    title: "Draw and validate fib anchors",
    detail: "Use clear swing structure first, then map retracement zones that the market is respecting.",
  },
  {
    id: "workflow-3",
    title: "Build scenario zones",
    detail: "Translate structure into bull and bear zones, then rank by confidence instead of certainty.",
  },
  {
    id: "workflow-4",
    title: "Track invalidation conditions",
    detail: "Define what would weaken or invalidate the thesis so decision-making stays disciplined.",
  },
];

export const learnLinkCards: LearnLinkCard[] = [
  {
    id: "link-methodology",
    href: "/methodology",
    title: "Go Deeper: Methodology",
    body: "Review FibraX anchor selection, cycle-ratio logic, and historical comparisons in detail.",
  },
  {
    id: "link-dashboard",
    href: "/dashboard",
    title: "Apply It: Dashboard",
    body: "Use live cycle metrics, projection zones, and phase states to continue your research flow.",
  },
];