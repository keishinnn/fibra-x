import type { Metadata } from "next";
import { BacktestPage } from "@/features/backtest/components/BacktestPage";

export const metadata: Metadata = {
  title: "Backtest | FibraX",
  description:
    "Backtest-style review of FibraX projection zones versus realized Bitcoin cycle outcomes across historical market periods.",
};

export default function BacktestRoute() {
  return <BacktestPage />;
}
