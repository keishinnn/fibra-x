import type { Metadata } from "next";
import { MethodologyPage } from "@/features/methodology/components/MethodologyPage";

export const metadata: Metadata = {
  title: "Methodology | FibraX",
  description:
    "Detailed Fibonacci and cycle-ratio methodology used by FibraX to analyze Bitcoin bull and bear market structures.",
};

export default function MethodologyRoute() {
  return <MethodologyPage />;
}
