import type { Metadata } from "next";
import { LearnMorePage } from "@/features/learn-more/components/LearnMorePage";

export const metadata: Metadata = {
  title: "Learn More | FibraX",
  description:
    "Beginner-friendly guide to Fibonacci retracement and Bitcoin halving context for cycle-based market research.",
};

export default function LearnMoreRoute() {
  return <LearnMorePage />;
}
