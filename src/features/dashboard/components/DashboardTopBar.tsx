import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CycleCatalog, CycleMode } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketInterval } from "@/features/market-data/types/market-data.types";

const timeframeOptions: Array<{ label: string; value: MarketInterval }> = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
];

interface DashboardTopBarProps {
  interval: MarketInterval;
  onIntervalChange: (next: MarketInterval) => void;
  selectedCycleId: string;
  selectedCycleLabel: string;
  cycleCatalog: CycleCatalog;
  onCycleChange: (next: string) => void;
  mode: CycleMode;
  currentPrice: number;
  lastUpdated: string;
  dataSource: "realtime" | "historical" | "assumption" | "fallback";
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
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDataSourceLabel(dataSource: DashboardTopBarProps["dataSource"]): string {
  if (dataSource === "realtime") {
    return "Live";
  }
  if (dataSource === "historical") {
    return "Historical";
  }
  if (dataSource === "assumption") {
    return "Assumption";
  }
  return "Fallback";
}

function getDataSourceTone(dataSource: DashboardTopBarProps["dataSource"]): string {
  if (dataSource === "realtime") {
    return "border-lime-500/40 bg-lime-500/10 text-lime-300";
  }
  if (dataSource === "historical") {
    return "border-sky-500/40 bg-sky-500/10 text-sky-300";
  }
  if (dataSource === "assumption") {
    return "border-[#F7931A]/40 bg-[#F7931A]/10 text-[#F7931A]";
  }
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export function DashboardTopBar({
  interval,
  onIntervalChange,
  selectedCycleId,
  selectedCycleLabel,
  cycleCatalog,
  onCycleChange,
  mode,
  currentPrice,
  lastUpdated,
  dataSource,
  isRefreshing,
}: DashboardTopBarProps) {
  return (
    <header className="rounded-xl border border-zinc-900 bg-zinc-950/75 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-zinc-100 sm:text-lg">FibraX Dashboard</p>
          <p className="text-xs text-zinc-500">Bitcoin cycle research view</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md border px-2 py-0.5 ${getDataSourceTone(dataSource)}`}>
            {getDataSourceLabel(dataSource)}
          </span>
          <span className="rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-0.5 text-zinc-300">BTC/USD</span>
          {mode === "realtime" ? (
            <span className="rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-0.5 text-zinc-300">
              {formatPrice(currentPrice)}
            </span>
          ) : (
            <span className="rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-0.5 text-zinc-400">
              {selectedCycleLabel}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="flex min-w-0 items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1">
          <span className="shrink-0 text-xs text-zinc-500">Cycle</span>
          <Select value={selectedCycleId} onValueChange={onCycleChange}>
            <SelectTrigger className="h-auto w-full min-w-0 border-0 bg-transparent p-0 text-xs shadow-none hover:border-0 focus-visible:ring-0">
              <SelectValue placeholder="Select cycle" />
            </SelectTrigger>
            <SelectContent>
              {cycleCatalog.map((cycle) => (
                <SelectItem key={cycle.id} value={cycle.id}>
                  {cycle.label} ({cycle.kind})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {timeframeOptions.map((frame) => (
            <button
              key={frame.value}
              type="button"
              onClick={() => onIntervalChange(frame.value)}
              className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                frame.value === interval
                  ? "border-[#F7931A]/45 bg-[#F7931A]/14 text-[#F7931A]"
                  : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-zinc-500">
        {mode === "realtime"
          ? `Updated ${formatTimestamp(lastUpdated)}${isRefreshing ? " (refreshing...)" : ""}`
          : mode === "historical"
            ? "Historical cycle selected. Live polling is paused."
            : "Future assumption selected. Live polling is paused."}
      </p>
    </header>
  );
}
