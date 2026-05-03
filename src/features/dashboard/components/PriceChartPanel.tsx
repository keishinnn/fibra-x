import { LineStyle } from "lightweight-charts";
import { InteractiveMarketChart, type ChartLevelLine } from "@/features/dashboard/components/InteractiveMarketChart";
import type { DashboardSnapshot } from "@/features/cycle-model/types/cycle-model.types";

interface PriceChartPanelProps {
  snapshot: DashboardSnapshot;
}

const chartLegend = [
  { label: "Bull Candle", color: "#089981" },
  { label: "Bear Candle", color: "#f23645" },
  { label: "Selected Cycle Line", color: "#38bdf8" },
  { label: "Bull Lead Path", color: "#f59e0b" },
  { label: "Bull Levels", color: "#84cc16" },
  { label: "ATH Reference", color: "#F7931A" },
  { label: "Bear Scenarios", color: "#fb7185" },
];

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildChartLevels(snapshot: DashboardSnapshot): ChartLevelLine[] {
  const bullLevels =
    snapshot.mode === "historical"
      ? []
      : snapshot.projections.bull.map((zone) => ({
          label: zone.label,
          price: zone.projectedPrice,
          color: "#84cc16",
          lineStyle: LineStyle.Dashed,
        }));
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

function buildChartLegend(snapshot: DashboardSnapshot): Array<{ label: string; color: string }> {
  if (snapshot.mode === "historical") {
    return chartLegend.filter((item) => item.label !== "Bull Levels" && item.label !== "Bull Lead Path");
  }

  return chartLegend;
}

export function PriceChartPanel({ snapshot }: PriceChartPanelProps) {
  const chartLevels = buildChartLevels(snapshot);
  const visibleLegend = buildChartLegend(snapshot);

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">Bull/Bear Market Map</h2>
          <p className="text-[11px] text-zinc-500">
            {snapshot.selectedCycle.label} | Halving {snapshot.selectedCycle.halvingDate} | {snapshot.mode}
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

      <div className="mt-3 rounded-lg border border-zinc-900 bg-black/60 p-3">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="h-[360px] overflow-hidden rounded-md border border-zinc-900 bg-black/75 sm:h-[430px]">
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

          <aside className="rounded-md border border-zinc-900 bg-zinc-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Current Market Phase</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{snapshot.phaseState.phase}</p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">{snapshot.phaseState.note}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Phase confidence</span>
                <span>{snapshot.phaseState.confidenceScore}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-[#F7931A]"
                  style={{ width: `${snapshot.phaseState.confidenceScore}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bull Projection Zone</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{snapshot.phaseState.activeZone}</p>
              </div>
              <div className="rounded-md border border-rose-500/35 bg-rose-500/10 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-rose-300">Invalidation Reference</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{snapshot.phaseState.invalidation}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-md border border-zinc-900 bg-zinc-950/80 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bear Start (Fib 0.236)</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">{formatUsd(snapshot.projections.bear.fib236)}</p>
          </article>
          <article className="rounded-md border border-zinc-900 bg-zinc-950/80 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Projected Bear Low (Base)</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {formatUsd(snapshot.projections.bear.projectedLow)} ({snapshot.projections.bear.drawdownPct}%)
            </p>
          </article>
          <article className="rounded-md border border-zinc-900 bg-zinc-950/80 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bear Scenario Band</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">{snapshot.projections.bear.scenarioRangeLabel}</p>
          </article>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {snapshot.projections.bear.scenarios.map((scenario) => (
            <article key={scenario.id} className="rounded-md border border-zinc-900 bg-zinc-950/80 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">{scenario.label}</p>
              <p className="mt-1 text-sm font-medium text-zinc-200">
                {formatUsd(scenario.projectedLow)} ({scenario.drawdownPct}%)
              </p>
            </article>
          ))}
        </div>

        <div className="mt-3 rounded-md border border-[#F7931A]/30 bg-[#F7931A]/10 p-3">
          <p className="text-[11px] uppercase tracking-wide text-[#F7931A]">Model Assumptions</p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-200">
            {snapshot.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-zinc-300">
            {snapshot.disclaimer} Treat all levels as scenario zones, not guaranteed outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
