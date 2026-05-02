export type PreviewCandleTone = "bull" | "bear";

export interface PreviewCandle {
  id: string;
  bodyHeight: number;
  wickHeight: number;
  tone: PreviewCandleTone;
}

export interface PreviewMetric {
  label: string;
  value: string;
  highlight?: boolean;
}
