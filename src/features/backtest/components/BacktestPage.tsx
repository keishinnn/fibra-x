import { backtestCases, backtestSummary, type BacktestCase } from "@/features/backtest/data/backtest-data";

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDeviationPct(testCase: BacktestCase): number {
  const center = (testCase.projectedMin + testCase.projectedMax) / 2;
  return ((testCase.actualTop - center) / center) * 100;
}

function getStatus(testCase: BacktestCase): "inside" | "below" | "above" {
  if (testCase.actualTop < testCase.projectedMin) {
    return "below";
  }
  if (testCase.actualTop > testCase.projectedMax) {
    return "above";
  }
  return "inside";
}

function getRangeMarkerPosition(testCase: BacktestCase): number {
  if (testCase.actualTop <= testCase.projectedMin) {
    return 0;
  }
  if (testCase.actualTop >= testCase.projectedMax) {
    return 100;
  }
  return ((testCase.actualTop - testCase.projectedMin) / (testCase.projectedMax - testCase.projectedMin)) * 100;
}

const statusClass: Record<ReturnType<typeof getStatus>, string> = {
  inside: "border-lime-500/35 bg-lime-500/10 text-lime-300",
  below: "border-rose-500/35 bg-rose-500/10 text-rose-300",
  above: "border-amber-500/35 bg-amber-500/10 text-amber-300",
};

export function BacktestPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
          <p className="fx-kicker">Backtest</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Historical Projection vs Actual Cycle Outcomes
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            This page compares FibraX projection bands against realized cycle tops to evaluate directional usefulness,
            over/under extension behavior, and model robustness across market regimes.
          </p>
        </header>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Total Cycles Tested</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">{backtestSummary.totalCycles}</p>
          </article>
          <article className="rounded-xl border border-lime-500/30 bg-lime-500/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-lime-300">Within Band Hit Rate</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">
              {Math.round((backtestSummary.withinBandHits / backtestSummary.totalCycles) * 100)}%
            </p>
          </article>
          <article className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">Avg Absolute Deviation</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">{backtestSummary.averageAbsDeviationPct}%</p>
          </article>
          <article className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-[11px] uppercase tracking-wide text-amber-300">Max Miss</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-100">{backtestSummary.maxMissPct}%</p>
          </article>
        </section>

        <section className="mt-4 rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-zinc-200">Cycle Replay Cards</h2>
            <p className="text-xs text-zinc-500">Projected range (bar) vs realized top (marker)</p>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {backtestCases.map((testCase) => {
              const status = getStatus(testCase);
              const markerPosition = getRangeMarkerPosition(testCase);
              const deviation = getDeviationPct(testCase);
              return (
                <article key={testCase.id} className="rounded-lg border border-zinc-900 bg-black/45 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-100">{testCase.cycle}</p>
                    <span className={`rounded border px-2 py-0.5 text-[11px] uppercase ${statusClass[status]}`}>
                      {status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="h-3 rounded-full border border-zinc-800 bg-zinc-900/80">
                      <div className="relative h-full rounded-full bg-[#F7931A]/30">
                        <span
                          className="absolute top-1/2 h-4 w-1.5 -translate-y-1/2 rounded bg-zinc-100"
                          style={{ left: `calc(${markerPosition}% - 3px)` }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{formatUsd(testCase.projectedMin)}</span>
                      <span>{formatUsd(testCase.projectedMax)}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-zinc-300 sm:grid-cols-2">
                    <p>Actual top: {formatUsd(testCase.actualTop)}</p>
                    <p>Deviation: {deviation >= 0 ? "+" : ""}{deviation.toFixed(1)}%</p>
                    <p>Cycle low: {formatUsd(testCase.cycleLow)}</p>
                    <p>Bear drawdown: {testCase.bearDrawdownPct}%</p>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400">{testCase.note}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-4 overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/70 p-3">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
                <th className="px-2 py-2 font-medium">Cycle</th>
                <th className="px-2 py-2 font-medium">Projected Zone</th>
                <th className="px-2 py-2 font-medium">Actual Top</th>
                <th className="px-2 py-2 font-medium">Deviation</th>
                <th className="px-2 py-2 font-medium">Bear Drawdown</th>
                <th className="px-2 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {backtestCases.map((testCase) => {
                const status = getStatus(testCase);
                const deviation = getDeviationPct(testCase);

                return (
                  <tr key={`${testCase.id}-row`} className="border-b border-zinc-900/70">
                    <td className="px-2 py-3 text-zinc-200">{testCase.cycle}</td>
                    <td className="px-2 py-3 text-zinc-300">
                      {formatUsd(testCase.projectedMin)} - {formatUsd(testCase.projectedMax)}
                    </td>
                    <td className="px-2 py-3 text-zinc-300">{formatUsd(testCase.actualTop)}</td>
                    <td className="px-2 py-3 text-zinc-200">{deviation >= 0 ? "+" : ""}{deviation.toFixed(1)}%</td>
                    <td className="px-2 py-3 text-zinc-300">{testCase.bearDrawdownPct}%</td>
                    <td className="px-2 py-3">
                      <span className={`rounded border px-2 py-0.5 text-[11px] uppercase ${statusClass[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-4 rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4">
          <p className="text-xs uppercase tracking-wide text-[#F7931A]">Interpretation Guardrails</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            Backtest alignment indicates historical fit, not future certainty. Treat projection bands as probabilistic
            research zones, and always reassess when price structure breaks invalidation thresholds.
          </p>
        </section>
      </div>
    </div>
  );
}
