import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const timeframeOptions: Array<{ label: string; value: MarketInterval }> = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
];

const modelOptions = ["Bull/Bear Levels", "Cycle Phase", "Fib Zones"];

interface DashboardTopBarProps {
  interval: MarketInterval;
  onIntervalChange: (next: MarketInterval) => void;
  currentPrice: number;
  lastUpdated: string;
  dataSource: "realtime" | "fallback";
  isRefreshing: boolean;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimestamp(value: string): string {
  const parsed = new Date(value);
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DashboardTopBar({
  interval,
  onIntervalChange,
  currentPrice,
  lastUpdated,
  dataSource,
  isRefreshing,
}: DashboardTopBarProps) {
  return (
    <header className="rounded-xl border border-zinc-900 bg-zinc-950/75 px-4 py-3 sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-zinc-100">FibraX Dashboard</p>
            <p className="text-xs uppercase tracking-wide text-zinc-500">Bull/Bear Cycle Research View</p>
          </div>

          <span
            className={`rounded-md border px-2 py-0.5 text-xs ${
              dataSource === "realtime"
                ? "border-lime-500/40 bg-lime-500/10 text-lime-300"
                : "border-zinc-700 bg-zinc-900 text-zinc-300"
            }`}
          >
            {dataSource === "realtime" ? "Realtime Feed" : "Fallback Snapshot"}
          </span>

          <span className="rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-0.5 text-xs text-zinc-400">
            BTC {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-zinc-700 bg-black px-2.5 py-1 text-zinc-300">BTC/USD</span>
          {timeframeOptions.map((frame) => (
            <button
              key={frame.value}
              type="button"
              onClick={() => onIntervalChange(frame.value)}
              className={`rounded-md border px-2.5 py-1 transition-colors ${
                frame.value === interval
                  ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-[#F7931A]"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {frame.label}
            </button>
          ))}
          <button type="button" className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300">
            Log Scale
          </button>
          {modelOptions.map((model) => (
            <span
              key={model}
              className={`rounded-md border px-2.5 py-1 ${
                model === "Bull/Bear Levels"
                  ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-[#F7931A]"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300"
              }`}
            >
              {model}
            </span>
          ))}
          <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-400">
            Updated {formatTimestamp(lastUpdated)} {isRefreshing ? "(refreshing...)" : ""}
          </span>
        </div>
      </div>
    </header>
  );
}
