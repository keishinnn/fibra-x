import { methodologyResults, methodologySections } from "@/features/methodology/data/methodology-data";

export function MethodologyPage() {
  return (
    <div className="min-h-full bg-black text-zinc-100">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
          <p className="fx-kicker">Methodology</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Fibonacci + Cycle Ratio Research Logic
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            This page explains how FibraX builds cycle anchors, ratio bands, and projection zones. The model is designed
            for structured research and visualization, not deterministic forecasting.
          </p>
        </header>

        <div className="mt-5 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-zinc-900 bg-zinc-950/70 p-4 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Section Index</p>
            <nav className="mt-3 space-y-2">
              {methodologySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between rounded-md border border-zinc-900 bg-black/40 px-2.5 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
                >
                  <span>{section.title}</span>
                  <span className="text-xs text-zinc-500">{section.indexLabel}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-4">
            {methodologySections.map((section) => (
              <section key={section.id} id={section.id} className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-zinc-800 px-2 py-0.5 text-xs text-zinc-500">{section.indexLabel}</span>
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-100 sm:text-xl">{section.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">{section.summary}</p>

                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2 text-sm leading-relaxed text-zinc-300">
                      {bullet}
                    </li>
                  ))}
                </ul>

                {section.id === "historical-results" ? (
                  <div className="mt-4 overflow-x-auto rounded-md border border-zinc-900 bg-black/45 p-2">
                    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wide text-zinc-500">
                          <th className="px-2 py-2 font-medium">Cycle</th>
                          <th className="px-2 py-2 font-medium">Fib 0.236 Start</th>
                          <th className="px-2 py-2 font-medium">Exact / Assumed Low</th>
                          <th className="px-2 py-2 font-medium">Drawdown from 0.236</th>
                        </tr>
                      </thead>
                      <tbody>
                        {methodologyResults.map((row) => (
                          <tr key={row.cycle} className="border-b border-zinc-900/70">
                            <td className="px-2 py-3 text-zinc-200">{row.cycle}</td>
                            <td className="px-2 py-3 text-zinc-300">{row.projectedBand}</td>
                            <td className="px-2 py-3 text-zinc-300">{row.actualTop}</td>
                            <td className="px-2 py-3 text-zinc-200">{row.deviation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ))}

            <section className="rounded-xl border border-[#F7931A]/30 bg-[#F7931A]/10 p-4">
              <p className="text-xs uppercase tracking-wide text-[#F7931A]">Research Disclaimer</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                FibraX is for educational and research purposes only. It is not financial advice, not an investment
                recommendation, and not a guarantee of future market behavior.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
