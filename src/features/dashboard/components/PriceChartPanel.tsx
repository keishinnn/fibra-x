import {
  bullBearLevels,
  chartBottomSummary,
  chartLegend,
  currentPhaseFocus,
  dashboardCandles,
} from "@/features/dashboard/data/dashboard-dummy-data";

function getBounds() {
  const highs = dashboardCandles.map((point) => point.high);
  const lows = dashboardCandles.map((point) => point.low);
  const levelPrices = bullBearLevels.map((item) => item.price);

  return {
    max: Math.max(...highs, ...levelPrices),
    min: Math.min(...lows, ...levelPrices),
  };
}

function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

const levelClasses = {
  bull: "border-lime-400/70 text-lime-300 bg-lime-500/10",
  pivot: "border-[#F7931A]/70 text-[#F7931A] bg-[#F7931A]/10",
  bear: "border-rose-400/70 text-rose-300 bg-rose-500/10",
};

export function PriceChartPanel() {
  const bounds = getBounds();

  return (
    <section className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-zinc-200">Bull/Bear Market Map</h2>
        <div className="flex flex-wrap gap-1.5">
          {chartLegend.map((legend) => (
            <span
              key={legend.label}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-black/55 px-2 py-0.5 text-[10px] text-zinc-400"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${legend.tone}`} />
              {legend.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-900 bg-black/60 p-3">
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.85fr]">
          <div className="relative h-[360px] overflow-hidden rounded-md border border-zinc-900 bg-black/75 sm:h-[430px]">
            <div className="absolute inset-y-0 left-0 right-0 grid grid-rows-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`line-${index}`} className="border-t border-zinc-900/80" />
              ))}
            </div>

            {bullBearLevels.map((level) => {
              const linePosition = normalize(level.price, bounds.min, bounds.max);
              return (
                <div key={level.label}>
                  <div className={`absolute left-0 right-0 border-t border-dashed ${levelClasses[level.tone]}`} style={{ bottom: `${linePosition}%` }} />
                  <div
                    className={`absolute left-2 rounded border px-2 py-0.5 text-[10px] ${levelClasses[level.tone]}`}
                    style={{ bottom: `calc(${linePosition}% + 6px)` }}
                  >
                    {level.label}: ${level.price.toLocaleString("en-US")}
                  </div>
                </div>
              );
            })}

            <div className="absolute inset-0 flex items-end gap-2 px-3 py-3">
              {dashboardCandles.map((point) => {
                const wickLow = normalize(point.low, bounds.min, bounds.max);
                const wickHigh = normalize(point.high, bounds.min, bounds.max);
                const bodyBottom = normalize(Math.min(point.open, point.close), bounds.min, bounds.max);
                const bodyTop = normalize(Math.max(point.open, point.close), bounds.min, bounds.max);
                const isBull = point.close >= point.open;

                return (
                  <div key={point.id} className="group relative flex h-full flex-1 items-end justify-center">
                    <div
                      className="absolute w-px bg-zinc-500/80"
                      style={{
                        bottom: `${wickLow}%`,
                        height: `${Math.max(2, wickHigh - wickLow)}%`,
                      }}
                    />
                    <div
                      className={`relative w-full max-w-3 rounded-sm ${
                        isBull ? "bg-zinc-200/90" : "bg-zinc-500/90"
                      }`}
                      style={{
                        bottom: `${bodyBottom}%`,
                        height: `${Math.max(3, bodyTop - bodyBottom)}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rounded-md border border-zinc-900 bg-zinc-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Current Market Phase</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{currentPhaseFocus.phase}</p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">{currentPhaseFocus.note}</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Phase confidence</span>
                <span>{currentPhaseFocus.confidenceScore}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-zinc-800">
                <div
                  className="h-2 rounded-full bg-[#F7931A]"
                  style={{ width: `${currentPhaseFocus.confidenceScore}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="rounded-md border border-zinc-900 bg-black/45 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">Active Bull Zone</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{currentPhaseFocus.activeZone}</p>
              </div>
              <div className="rounded-md border border-rose-500/35 bg-rose-500/10 p-2.5">
                <p className="text-[11px] uppercase tracking-wide text-rose-300">Bear Invalidation</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">{currentPhaseFocus.invalidation}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-4 rounded-md border border-zinc-900 bg-zinc-950/80 p-3">
          <div className="grid gap-3 md:grid-cols-3">
            {chartBottomSummary.map((item) => (
              <article key={item.label} className="rounded-md border border-zinc-900 bg-black/45 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-zinc-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
