import { phaseLegend } from "@/features/dashboard/data/dashboard-dummy-data";

export function PhaseLegendPanel() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500">Cycle Phase Legend</h3>
      <div className="mt-3 grid gap-2">
        {phaseLegend.map((item) => (
          <div key={item.phase} className="flex items-center justify-between gap-3 rounded-md border border-zinc-900 bg-black/45 px-3 py-2">
            <span className="text-sm text-zinc-200">{item.phase}</span>
            <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
