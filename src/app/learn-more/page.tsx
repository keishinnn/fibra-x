import type { Metadata } from "next";
import { LearnPage } from "@/features/learn-more/components/LearnPage";

export const metadata: Metadata = {
  title: "Learn | FibraX",
  description:
    "Beginner-friendly guide to Fibonacci retracement and Bitcoin halving context for cycle-based market research.",
};

export default function LearnRoute() {
  return <LearnPage />;
}
