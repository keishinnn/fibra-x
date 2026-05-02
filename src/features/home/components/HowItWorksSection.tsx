import { workflowSteps } from "@/features/home/data/landing-dummy-data";

export function HowItWorksSection() {
  return (
    <section className="fx-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-100">How It Works</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {workflowSteps.map((step, index) => (
          <article key={step} className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Step {index + 1}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{step}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
