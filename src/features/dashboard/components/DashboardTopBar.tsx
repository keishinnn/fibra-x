const timeframeOptions = ["1D", "1W", "1M"];
const modelOptions = ["Bull/Bear Levels", "Cycle Phase", "Fib Zones"];

export function DashboardTopBar() {
  return (
    <header className="rounded-xl border border-zinc-900 bg-zinc-950/75 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-end gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-zinc-100">FibraX Dashboard</p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Bull/Bear Cycle Research View</p>
          </div>
          <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400">Dummy Data</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-zinc-700 bg-black px-2.5 py-1 text-zinc-300">BTC/USD</span>
          {timeframeOptions.map((frame) => (
            <button
              key={frame}
              type="button"
              className={`rounded-md border px-2.5 py-1 ${
                frame === "1W"
                  ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-[#F7931A]"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300"
              }`}
            >
              {frame}
            </button>
          ))}
          <button type="button" className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300">
            Log Scale
          </button>
          {modelOptions.map((model) => (
            <button
              key={model}
              type="button"
              className={`rounded-md border px-2.5 py-1 ${
                model === "Bull/Bear Levels"
                  ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-[#F7931A]"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300"
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
