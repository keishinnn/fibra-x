import { quickNotes } from "@/features/dashboard/data/dashboard-dummy-data";

export function BottomResearchPanel() {
  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
      <h3 className="text-xs uppercase tracking-wide text-zinc-500">Research Notes</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {quickNotes.map((note) => (
          <article key={note} className="rounded-md border border-zinc-900 bg-black/45 p-3">
            <p className="text-sm leading-relaxed text-zinc-300">{note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
