"use client";

import { CycleComparisonTable } from "@/features/dashboard/components/CycleComparisonTable";
import { DashboardTopBar } from "@/features/dashboard/components/DashboardTopBar";
import { PriceChartPanel } from "@/features/dashboard/components/PriceChartPanel";
import { useDashboardSnapshot } from "@/features/dashboard/hooks/useDashboardSnapshot";

export function DashboardRealtimeView() {
  const {
    interval,
    setInterval,
    selectedCycleId,
    setSelectedCycleId,
    snapshot,
    isLoading,
    isStale,
    errorMessage,
    dataSource,
  } = useDashboardSnapshot();

  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-5 sm:px-6 sm:py-6">
        <DashboardTopBar
          interval={interval}
          onIntervalChange={setInterval}
          currentPrice={snapshot.market.ticker.price}
          lastUpdated={snapshot.market.lastUpdated}
          dataSource={dataSource}
          mode={snapshot.mode}
          selectedCycleId={selectedCycleId}
          selectedCycleLabel={snapshot.selectedCycle.label}
          cycleCatalog={snapshot.cycleCatalog}
          onCycleChange={setSelectedCycleId}
          isRefreshing={isLoading}
        />

        {snapshot.mode === "assumption" ? (
          <section className="rounded-xl border border-[#F7931A]/40 bg-[#F7931A]/10 p-3 text-sm text-zinc-200">
            Assumption mode is active for <strong>{snapshot.selectedCycle.label}</strong>. Realtime market values are
            intentionally disabled for non-current cycles.
          </section>
        ) : null}

        {isStale && errorMessage ? (
          <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            Live feed is temporarily unavailable. Showing latest fallback snapshot. Reason: {errorMessage}
          </section>
        ) : null}

        <PriceChartPanel snapshot={snapshot} />
        <CycleComparisonTable />
      </div>
    </div>
  );
}
