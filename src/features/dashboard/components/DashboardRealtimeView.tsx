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
    isHistoricalCycleLoading,
    isCurrentCyclePageLoading,
    isStale,
    errorMessage,
    dataSource,
  } = useDashboardSnapshot();

  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1440px] space-y-4 px-3 py-4 sm:px-6 sm:py-6">
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
          isHistoricalCycleLoading={isHistoricalCycleLoading}
          isCurrentCyclePageLoading={isCurrentCyclePageLoading}
        />

        {isCurrentCyclePageLoading ? (
          <section className="space-y-4 animate-pulse">
            <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-3 sm:p-5">
              <div className="h-4 w-44 rounded bg-zinc-800" />
              <div className="mt-3 h-[300px] rounded-md border border-zinc-900 bg-zinc-900/70 sm:h-[430px]" />
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <div className="h-12 rounded-md border border-zinc-900 bg-zinc-900/75" />
                <div className="h-12 rounded-md border border-zinc-900 bg-zinc-900/75" />
                <div className="h-12 rounded-md border border-zinc-900 bg-zinc-900/75" />
              </div>
            </section>
            <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
              <div className="h-3 w-52 rounded bg-zinc-800" />
              <div className="mt-3 space-y-2">
                <div className="h-10 rounded-md border border-zinc-900 bg-zinc-900/75" />
                <div className="h-10 rounded-md border border-zinc-900 bg-zinc-900/75" />
                <div className="h-10 rounded-md border border-zinc-900 bg-zinc-900/75" />
              </div>
            </section>
          </section>
        ) : (
          <>
            {isStale && errorMessage ? (
              <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
                Live feed is temporarily unavailable. Showing fallback data. Reason: {errorMessage}
              </section>
            ) : null}

            <PriceChartPanel snapshot={snapshot} isHistoricalCycleLoading={isHistoricalCycleLoading} />

            <details className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
              <summary className="cursor-pointer text-xs font-medium uppercase tracking-wide text-zinc-400">
                Historical Comparison Table
              </summary>
              <div className="mt-3">
                <CycleComparisonTable />
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
