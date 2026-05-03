import { projectionZones } from "@/features/dashboard/data/dashboard-dummy-data";

const toneClass: Record<(typeof projectionZones)[number]["tone"], string> = {
  primary: "border-[#F7931A]/35 bg-[#F7931A]/10 text-zinc-100",
  neutral: "border-zinc-800 bg-black/45 text-zinc-200",
  warning: "border-amber-500/35 bg-amber-500/10 text-zinc-100",
  danger: "border-rose-500/35 bg-rose-500/10 text-zinc-100",
};

export function ProjectionZonesPanel() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500">Projection Zones</h3>
      <div className="mt-3 space-y-3">
        {projectionZones.map((zone) => (
          <article key={zone.label} className={`rounded-md border p-3 ${toneClass[zone.tone]}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{zone.label}</p>
              <p className="text-xs">{zone.range}</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed opacity-85">{zone.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
