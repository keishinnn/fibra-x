import type { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard | FibraX",
  description:
    "TradingView-inspired Bitcoin cycle research dashboard with Fibonacci ratio model zones, cycle phases, and historical comparisons.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
