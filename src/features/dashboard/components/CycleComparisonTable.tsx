import { getHistoricalCycleRows } from "@/features/cycle-model/lib/calculate-cycle-projections";

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function CycleComparisonTable() {
  const rows = getHistoricalCycleRows();

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs uppercase tracking-wide text-zinc-500">Historical Cycle Comparison</h3>
        <p className="text-xs text-zinc-500">Current similarity: closest to 2018-2021 structure</p>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-2 py-2 font-medium">Cycle</th>
              <th className="px-2 py-2 font-medium">Bottom</th>
              <th className="px-2 py-2 font-medium">Peak</th>
              <th className="px-2 py-2 font-medium">Growth %</th>
              <th className="px-2 py-2 font-medium">Drawdown from Fib 0.236</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.cycle} className="border-b border-zinc-900/80">
                <td className="px-2 py-3 text-zinc-200">{row.cycle}</td>
                <td className="px-2 py-3 text-zinc-300">{formatUsd(row.bottom)}</td>
                <td className="px-2 py-3 text-zinc-300">{formatUsd(row.peak)}</td>
                <td className="px-2 py-3 text-zinc-200">{row.growthPct.toFixed(2)}%</td>
                <td className="px-2 py-3 text-rose-300">
                  {row.drawdownFromFibPct === null ? "Pending current cycle" : `${row.drawdownFromFibPct.toFixed(2)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

