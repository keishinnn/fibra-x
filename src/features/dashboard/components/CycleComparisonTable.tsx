import { cycleComparison } from "@/features/dashboard/data/dashboard-dummy-data";

export function CycleComparisonTable() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs uppercase tracking-wide text-zinc-500">Historical Cycle Comparison</h3>
        <p className="text-xs text-zinc-500">Current similarity: closest to 2016-2020</p>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
              <th className="px-2 py-2 font-medium">Cycle</th>
              <th className="px-2 py-2 font-medium">Bottom</th>
              <th className="px-2 py-2 font-medium">Peak</th>
              <th className="px-2 py-2 font-medium">Growth</th>
              <th className="px-2 py-2 font-medium">Drawdown</th>
            </tr>
          </thead>
          <tbody>
            {cycleComparison.map((row) => (
              <tr key={row.cycle} className="border-b border-zinc-900/80">
                <td className="px-2 py-3 text-zinc-200">{row.cycle}</td>
                <td className="px-2 py-3 text-zinc-300">{row.bottom}</td>
                <td className="px-2 py-3 text-zinc-300">{row.peak}</td>
                <td className="px-2 py-3 text-zinc-200">{row.growth}</td>
                <td className="px-2 py-3 text-rose-300">{row.drawdown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
