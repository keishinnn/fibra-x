import type { Metadata } from "next";
import { HomeLandingPage } from "@/features/home/components/HomeLandingPage";

export const metadata: Metadata = {
  title: "FibraX | Bitcoin Cycle Ratio Visualizer",
  description:
    "FibraX is a Bitcoin cycle research dashboard that visualizes bull and bear market phases using Fibonacci ratios, historical cycle behavior, and projection zones.",
};

export default function HomePage() {
  return <HomeLandingPage />;
}
