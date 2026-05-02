import { previewCandles, previewMetrics } from "@/features/home/data/landing-dummy-data";

export function ChartPreviewSection() {
  return (
    <section className="fx-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Chart Preview</h2>
        <span className="rounded-full border border-zinc-800 px-2.5 py-1 text-xs uppercase tracking-wide text-zinc-400">
          Dummy Data
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.8fr_1fr]">
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
            <span>BTC/USD</span>
            <span>1W</span>
            <span className="rounded border border-[#F7931A]/40 px-2 py-0.5 text-[#F7931A]">Cycle Model</span>
          </div>

          <div className="grid h-48 grid-cols-12 items-end gap-2 rounded-md border border-zinc-900 bg-black/70 px-3 py-2 sm:h-56">
            {previewCandles.map((candle) => (
              <div key={candle.id} className="relative flex h-full items-end justify-center">
                <div className="absolute bottom-0 w-px bg-zinc-600" style={{ height: `${candle.wickHeight}%` }} />
                <div
                  className={`relative w-2 rounded-sm ${
                    candle.tone === "bull" ? "bg-zinc-200" : "bg-zinc-500"
                  }`}
                  style={{ height: `${candle.bodyHeight}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {previewMetrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-3.5">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{metric.label}</p>
              <p className={`mt-1 text-base font-semibold ${metric.highlight ? "text-[#F7931A]" : "text-zinc-100"}`}>
                {metric.value}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
