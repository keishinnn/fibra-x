import { CycleComparisonTable } from "@/features/dashboard/components/CycleComparisonTable";
import { DashboardTopBar } from "@/features/dashboard/components/DashboardTopBar";
import { PriceChartPanel } from "@/features/dashboard/components/PriceChartPanel";

export function DashboardPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-5 sm:px-6 sm:py-6">
        <DashboardTopBar />
        <PriceChartPanel />
        <CycleComparisonTable />
      </div>
    </div>
  );
}
