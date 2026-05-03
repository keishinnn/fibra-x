import { LineStyle } from "lightweight-charts";
import { InteractiveMarketChart, type ChartLevelLine } from "@/features/dashboard/components/InteractiveMarketChart";
import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";

interface PriceChartPanelProps {
  snapshot: DashboardSnapshot;
}

const baseLegend = [
  { label: "Bull Candle", color: "#089981" },
  { label: "Bear Candle", color: "#f23645" },
  { label: "ATH Reference", color: "#F7931A" },
  { label: "Bear Levels", color: "#fb7185" },
];

const futureLegend = [
  { label: "Selected Cycle Line", color: "#38bdf8" },
  { label: "Bull Lead Path", color: "#f59e0b" },
  { label: "Bull Levels", color: "#84cc16" },
];

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildChartLevels(snapshot: DashboardSnapshot): ChartLevelLine[] {
  const showBullLevels = snapshot.mode !== "historical";
  const bullLevels = showBullLevels
    ? snapshot.projections.bull.map((zone) => ({
      label: zone.label,
      price: zone.projectedPrice,
      color: "#84cc16",
      lineStyle: LineStyle.Dashed,
    }))
    : [];

  const bearScenarioLevels = snapshot.projections.bear.scenarios.map((scenario) => ({
    label: `${scenario.label} (${scenario.drawdownPct}%)`,
    price: scenario.projectedLow,
    color: scenario.id === "base" ? "#fda4af" : scenario.id === "shallow" ? "#fecdd3" : "#fb7185",
    lineStyle: scenario.id === "base" ? LineStyle.Dotted : LineStyle.Dashed,
  }));

  return [
    ...bullLevels,
    {
      label: "Cycle ATH Reference",
      price: snapshot.projections.referenceAth,
      color: "#F7931A",
      lineStyle: LineStyle.Solid,
    },
    {
      label: "Fib 0.236 Bear Start",
      price: snapshot.projections.bear.fib236,
      color: "#fb7185",
      lineStyle: LineStyle.Dashed,
    },
    ...bearScenarioLevels,
  ];
}

function buildLegend(snapshot: DashboardSnapshot): Array<{ label: string; color: string }> {
  if (snapshot.mode === "historical") {
    return baseLegend;
  }

  if (snapshot.mode === "assumption") {
    return [...baseLegend, ...futureLegend];
  }

  return [...baseLegend, { label: "Bull Levels", color: "#84cc16" }];
}

function getPhaseTitle(snapshot: DashboardSnapshot): string {
  if (snapshot.mode === "historical") {
    return "Historical Cycle Snapshot";
  }
  if (snapshot.mode === "assumption") {
    return "Future Cycle Snapshot";
  }
  return "Current Cycle Snapshot";
}

export function PriceChartPanel({ snapshot }: PriceChartPanelProps) {
  const chartLevels = buildChartLevels(snapshot);
  const visibleLegend = buildLegend(snapshot);
  const isHistorical = snapshot.mode === "historical";

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-3 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">Market Structure</h2>
          <p className="text-[11px] text-zinc-500">
            {snapshot.selectedCycle.label} | {snapshot.market.interval.toUpperCase()} view
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleLegend.map((legend) => (
            <span
              key={legend.label}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-black/55 px-2 py-0.5 text-[10px] text-zinc-400"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: legend.color }} />
              {legend.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-900 bg-black/60 p-2.5 sm:p-3">
        <div className="grid gap-3 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="h-[300px] overflow-hidden rounded-md border border-zinc-900 bg-black/75 sm:h-[430px]">
            <InteractiveMarketChart
              candles={snapshot.market.candles}
              levels={chartLevels}
              mode={snapshot.mode}
              cycleKind={snapshot.selectedCycle.kind}
              chartConnection={snapshot.chartConnection}
              projectedBearLowPrice={snapshot.projections.bear.projectedLow}
              intervalKey={`${snapshot.market.interval}-${snapshot.selectedCycle.id}`}
            />
          </div>

          <aside className="rounded-md border border-zinc-900 bg-zinc-950/80 p-3.5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{getPhaseTitle(snapshot)}</p>
            <p className="mt-1.5 text-xl font-semibold text-zinc-100">{snapshot.phaseState.phase}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{snapshot.phaseState.note}</p>

            <div className="mt-4 grid gap-2">
              <article className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Fib 0.236 Bear Start</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{formatUsd(snapshot.projections.bear.fib236)}</p>
              </article>
              <article className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bear Low (Base)</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">
                  {formatUsd(snapshot.projections.bear.projectedLow)} ({snapshot.projections.bear.drawdownPct}%)
                </p>
              </article>
              {isHistorical ? null : (
                <article className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bull Zone</p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">{snapshot.phaseState.activeZone}</p>
                </article>
              )}
            </div>
          </aside>
        </div>

        <details className="mt-3 rounded-md border border-zinc-900 bg-zinc-950/80 p-3">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-wide text-zinc-400">
            Advanced Model Details
          </summary>
          <div className="mt-3 space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              {snapshot.projections.bear.scenarios.map((scenario) => (
                <article key={scenario.id} className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">{scenario.label}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-200">
                    {formatUsd(scenario.projectedLow)} ({scenario.drawdownPct}%)
                  </p>
                </article>
              ))}
            </div>
            <ul className="space-y-1 text-xs leading-relaxed text-zinc-300">
              {snapshot.assumptions.map((assumption) => (
                <li key={assumption}>- {assumption}</li>
              ))}
            </ul>
          </div>
        </details>

        {/* Disclaimer */}
        <section className="rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4 mt-3">
          <p className="text-xs uppercase tracking-wide text-[#F7931A]">Research Disclaimer</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            FibraX is for educational and research purposes only. It is not financial advice, not an investment
            recommendation, and not a guarantee of future market behavior.
          </p>
        </section>
      </div>
    </section>
  );
}
