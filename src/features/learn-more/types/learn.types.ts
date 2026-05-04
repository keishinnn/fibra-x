export interface LearnNavItem {
  id: string;
  indexLabel: string;
  title: string;
}

export interface FibLevelExplainer {
  id: string;
  ratio: number;
  label: string;
  summary: string;
  explanation: string;
}

export interface WhyFibonacciReason {
  id: string;
  title: string;
  body: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export type HalvingStatus = "completed" | "active" | "upcoming";

export interface HalvingMilestoneSeed {
  id: string;
  cycleId: string | null;
  label: string;
  blockHeight: number;
  rewardBefore: number;
  rewardAfter: number;
  status: HalvingStatus;
  note: string;
  estimatedDate?: string;
}

export interface HalvingMilestone extends HalvingMilestoneSeed {
  date: string;
  isEstimatedDate: boolean;
  cycleLabel: string;
}

export interface ResearchWorkflowStep {
  id: string;
  title: string;
  detail: string;
}

export interface LearnLinkCard {
  id: string;
  href: string;
  title: string;
  body: string;
}
