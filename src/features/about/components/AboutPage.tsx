import {
  aboutHighlights,
  architecturePrinciples,
  researchGuardrails,
  technicalStack,
} from "@/features/about/data/about-data";

export function AboutPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
          <p className="fx-kicker">About</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            FibraX: Bitcoin Cycle Ratio Visualizer
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            FibraX is a developer research portfolio project combining cycle-based market analysis concepts with a
            chart-focused frontend product. It explores how to communicate model uncertainty through zone-based
            visualization rather than absolute predictions.
          </p>
        </header>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          {aboutHighlights.map((item) => (
            <article key={item.title} className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-2">
          <article className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5">
            <h2 className="text-sm font-medium text-zinc-200">Technical Stack</h2>
            <ul className="mt-3 space-y-2">
              {technicalStack.map((item) => (
                <li key={item} className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2 text-sm text-zinc-300">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5">
            <h2 className="text-sm font-medium text-zinc-200">Architecture Principles</h2>
            <ul className="mt-3 space-y-2">
              {architecturePrinciples.map((item) => (
                <li key={item} className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2 text-sm text-zinc-300">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-4 rounded-xl border border-zinc-900 bg-zinc-950/70 p-5">
          <h2 className="text-sm font-medium text-zinc-200">Research Guardrails</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {researchGuardrails.map((item) => (
              <article key={item} className="rounded-md border border-zinc-900 bg-black/45 p-3">
                <p className="text-sm leading-relaxed text-zinc-300">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4">
          <p className="text-xs uppercase tracking-wide text-[#F7931A]">Project Scope</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            FibraX is built for educational research and portfolio demonstration. It is not financial advice and should
            not be used as the sole basis for investment decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
