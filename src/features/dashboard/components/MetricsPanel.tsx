import { metricItems } from "@/features/dashboard/data/dashboard-dummy-data";

export function MetricsPanel() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500">Cycle Metrics</h3>
      <div className="mt-3 space-y-3">
        {metricItems.map((item) => (
          <article key={item.label} className="rounded-md border border-zinc-900 bg-black/45 p-3">
            <p className="text-[11px] uppercase tracking-wide text-zinc-500">{item.label}</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">{item.value}</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
