"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  LineSeries,
  LineStyle,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type LineData,
  type UTCTimestamp,
} from "lightweight-charts";
import type { CycleKind, CycleMode } from "@/features/cycle-model/types/cycle-model.types";
import type { MarketCandle } from "@/features/market-data/types/market-data.types";

export interface ChartLevelLine {
  label: string;
  price: number;
  color: string;
  lineStyle?: LineStyle;
}

interface ChartConnection {
  previousCycleId: string | null;
  previousCycleLabel: string | null;
  bridgeStartPrice: number | null;
  bridgeEndPrice: number | null;
  bullLeadTargetPrice: number;
}

interface InteractiveMarketChartProps {
  candles: MarketCandle[];
  levels: ChartLevelLine[];
  mode: CycleMode;
  cycleKind: CycleKind;
  chartConnection: ChartConnection;
  projectedBearLowPrice: number;
  intervalKey: string;
}

const TV_BULL_CANDLE_COLOR = "#089981";
const TV_BEAR_CANDLE_COLOR = "#f23645";
const SELECTED_CYCLE_LINE_COLOR = "#38bdf8";
const BULL_LEAD_LINE_COLOR = "#f59e0b";
const BRIDGE_LINE_COLOR = "#94a3b8";
const DAY_MS = 24 * 60 * 60 * 1000;

type PriceLineHostSeries = ISeriesApi<"Candlestick"> | ISeriesApi<"Line">;

function toChartData(candles: MarketCandle[]): CandlestickData<UTCTimestamp>[] {
  return candles.map((item) => ({
    time: Math.floor(item.time / 1000) as UTCTimestamp,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
  }));
}

function getStepMs(candles: MarketCandle[]): number {
  if (candles.length < 2) {
    return DAY_MS;
  }

  return Math.max(DAY_MS / 2, candles[1].time - candles[0].time);
}

function buildBridgeData(
  candles: MarketCandle[],
  chartConnection: ChartConnection,
): LineData<UTCTimestamp>[] {
  if (candles.length === 0) {
    return [];
  }

  const first = candles[0];
  const stepMs = getStepMs(candles);
  const bridgeStartPrice = chartConnection.bridgeStartPrice ?? first.close * 1.12;
  const bridgeEndPrice = chartConnection.bridgeEndPrice ?? first.close;
  const delta = bridgeEndPrice - bridgeStartPrice;
  const swing = Math.abs(delta) * 0.08;
  const progress = [0, 0.25, 0.5, 0.75, 1];
  const swingPattern = [0, 1, -1, 1, 0];
  const stepPattern = [8, 6, 4, 2, 1];

  return progress.map((ratio, index) => {
    const base = bridgeStartPrice + delta * ratio;
    const shaped = base + swingPattern[index] * swing;
    return {
      time: Math.floor((first.time - stepMs * stepPattern[index]) / 1000) as UTCTimestamp,
      value: Math.max(1, shaped),
    };
  });
}

function buildSelectedFutureCycleZigzag(
  candles: MarketCandle[],
  chartConnection: ChartConnection,
  projectedBearLowPrice: number,
): LineData<UTCTimestamp>[] {
  if (candles.length === 0) {
    return [];
  }

  const first = candles[0];
  const last = candles[candles.length - 1];
  const startPrice = chartConnection.bridgeEndPrice ?? first.close;
  const referencePeak = Math.max(...candles.map((candle) => candle.high));
  const effectiveRange = Math.max(referencePeak - startPrice, startPrice * 0.25);
  const finalBearLow = Math.max(1, projectedBearLowPrice);
  const lateSupport = Math.max(finalBearLow * 1.08, startPrice + effectiveRange * 0.62);

  const pivots = [
    { progress: 0.0, level: 0.0 }, // start
    { progress: 0.12, level: 0.42 }, // wave 1
    { progress: 0.22, level: 0.28 }, // wave 2
    { progress: 0.4, level: 0.78 }, // wave 3
    { progress: 0.5, level: 0.62 }, // wave 4
    { progress: 0.66, level: 1.0 }, // wave 5
    { progress: 0.8, level: 0.83 }, // distribution drop
    { progress: 0.9, level: 0.78 }, // lower high bounce
  ];

  const marketStructure = pivots.map((pivot) => {
    const value = startPrice + effectiveRange * pivot.level;
    const time = first.time + (last.time - first.time) * pivot.progress;
    return {
      time: Math.floor(time / 1000) as UTCTimestamp,
      value: Math.max(1, value),
    };
  });

  // Force terminal move into projected bear low so the selected future cycle reaches the target.
  marketStructure.push({
    time: Math.floor((last.time - (last.time - first.time) * 0.02) / 1000) as UTCTimestamp,
    value: lateSupport,
  });
  marketStructure.push({
    time: Math.floor(last.time / 1000) as UTCTimestamp,
    value: finalBearLow,
  });

  return marketStructure;
}

function buildBullLeadPath(
  candles: MarketCandle[],
  targetPrice: number,
  startPoint?: LineData<UTCTimestamp>,
): LineData<UTCTimestamp>[] {
  if (candles.length === 0) {
    return [];
  }

  const last = candles[candles.length - 1];
  const startTimeMs = startPoint ? Number(startPoint.time) * 1000 : last.time;
  const startPrice = startPoint ? startPoint.value : last.close;
  const effectiveTargetPrice = Math.max(targetPrice, startPrice * 1.04);
  const delta = effectiveTargetPrice - startPrice;
  const stepMs = getStepMs(candles);
  const pivots = [
    { ratio: 0.0, level: 0.0 },
    { ratio: 0.12, level: 0.22 },
    { ratio: 0.24, level: 0.14 },
    { ratio: 0.36, level: 0.42 },
    { ratio: 0.5, level: 0.31 },
    { ratio: 0.64, level: 0.63 },
    { ratio: 0.78, level: 0.52 },
    { ratio: 0.9, level: 0.86 },
    { ratio: 1.0, level: 1.0 },
  ];

  return pivots.map((pivot, index) => ({
    time: Math.floor((startTimeMs + index * stepMs * 2) / 1000) as UTCTimestamp,
    value: Math.max(1, startPrice + delta * pivot.level),
  }));
}

export function InteractiveMarketChart({
  candles,
  levels,
  mode,
  cycleKind,
  chartConnection,
  projectedBearLowPrice,
  intervalKey,
}: InteractiveMarketChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const cycleLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bridgeLineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bullLeadSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const priceLineRefs = useRef<IPriceLine[]>([]);
  const priceLineHostRef = useRef<PriceLineHostSeries | null>(null);
  const hasFittedContentRef = useRef(false);

  const candleData = useMemo(() => toChartData(candles), [candles]);
  const selectedFutureZigzagData = useMemo(
    () => buildSelectedFutureCycleZigzag(candles, chartConnection, projectedBearLowPrice),
    [candles, chartConnection, projectedBearLowPrice],
  );
  const selectedFutureEndPoint = selectedFutureZigzagData[selectedFutureZigzagData.length - 1];
  const bridgeLineData = useMemo(() => buildBridgeData(candles, chartConnection), [candles, chartConnection]);
  const bullLeadLineData = useMemo(
    () => buildBullLeadPath(candles, chartConnection.bullLeadTargetPrice, selectedFutureEndPoint),
    [candles, chartConnection.bullLeadTargetPrice, selectedFutureEndPoint],
  );
  const useFutureLineMode = mode === "assumption" && cycleKind === "future";

  useEffect(() => {
    hasFittedContentRef.current = false;
  }, [intervalKey]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const initialWidth = container.clientWidth || 400;
    const initialHeight = container.clientHeight || 420;

    const chart = createChart(container, {
      width: initialWidth,
      height: initialHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#060606" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "rgba(39, 39, 42, 0.35)" },
        horzLines: { color: "rgba(39, 39, 42, 0.35)" },
      },
      rightPriceScale: {
        borderColor: "rgba(39, 39, 42, 0.55)",
      },
      timeScale: {
        borderColor: "rgba(39, 39, 42, 0.55)",
        rightOffset: 8,
        barSpacing: 8,
        minBarSpacing: 2,
        fixLeftEdge: false,
        fixRightEdge: false,
        lockVisibleTimeRangeOnResize: false,
        timeVisible: true,
      },
      crosshair: {
        vertLine: { color: "rgba(161, 161, 170, 0.45)" },
        horzLine: { color: "rgba(161, 161, 170, 0.45)" },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: TV_BULL_CANDLE_COLOR,
      downColor: TV_BEAR_CANDLE_COLOR,
      borderUpColor: TV_BULL_CANDLE_COLOR,
      borderDownColor: TV_BEAR_CANDLE_COLOR,
      wickUpColor: TV_BULL_CANDLE_COLOR,
      wickDownColor: TV_BEAR_CANDLE_COLOR,
      borderVisible: true,
      wickVisible: true,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    const cycleLineSeries = chart.addSeries(LineSeries, {
      color: SELECTED_CYCLE_LINE_COLOR,
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 2,
      priceLineVisible: false,
      lastValueVisible: true,
    });

    const bridgeLineSeries = chart.addSeries(LineSeries, {
      color: BRIDGE_LINE_COLOR,
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const bullLeadSeries = chart.addSeries(LineSeries, {
      color: BULL_LEAD_LINE_COLOR,
      lineWidth: 2,
      lineStyle: LineStyle.Solid,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    cycleLineSeriesRef.current = cycleLineSeries;
    bridgeLineSeriesRef.current = bridgeLineSeries;
    bullLeadSeriesRef.current = bullLeadSeries;
    hasFittedContentRef.current = false;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;
      chart.applyOptions({
        width: Math.max(320, Math.floor(width)),
        height: Math.max(320, Math.floor(height)),
      });
    });

    resizeObserver.observe(container);

    return () => {
      priceLineRefs.current = [];
      priceLineHostRef.current = null;
      candlestickSeriesRef.current = null;
      cycleLineSeriesRef.current = null;
      bridgeLineSeriesRef.current = null;
      bullLeadSeriesRef.current = null;
      chartRef.current = null;
      hasFittedContentRef.current = false;
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const candlestickSeries = candlestickSeriesRef.current;
    const cycleLineSeries = cycleLineSeriesRef.current;
    const bridgeLineSeries = bridgeLineSeriesRef.current;
    const bullLeadSeries = bullLeadSeriesRef.current;

    if (!candlestickSeries || !cycleLineSeries || !bridgeLineSeries || !bullLeadSeries) {
      return;
    }

    if (useFutureLineMode) {
      candlestickSeries.setData([]);
      cycleLineSeries.setData(selectedFutureZigzagData);
      bridgeLineSeries.setData(bridgeLineData);
      bullLeadSeries.setData(bullLeadLineData);
    } else {
      candlestickSeries.setData(candleData);
      cycleLineSeries.setData([]);
      bridgeLineSeries.setData([]);
      bullLeadSeries.setData([]);
    }

    if (!hasFittedContentRef.current) {
      chartRef.current?.timeScale().fitContent();
      hasFittedContentRef.current = true;
    }
  }, [
    useFutureLineMode,
    candleData,
    selectedFutureZigzagData,
    bridgeLineData,
    bullLeadLineData,
  ]);

  useEffect(() => {
    const candlestickSeries = candlestickSeriesRef.current;
    const cycleLineSeries = cycleLineSeriesRef.current;
    if (!candlestickSeries || !cycleLineSeries) {
      return;
    }

    const previousHost = priceLineHostRef.current;
    if (previousHost) {
      for (const line of priceLineRefs.current) {
        previousHost.removePriceLine(line);
      }
    }

    const hostSeries: PriceLineHostSeries = useFutureLineMode ? cycleLineSeries : candlestickSeries;
    priceLineRefs.current = levels.map((level) =>
      hostSeries.createPriceLine({
        price: level.price,
        color: level.color,
        lineWidth: 1,
        lineStyle: level.lineStyle ?? LineStyle.Dashed,
        axisLabelVisible: true,
        title: level.label,
      }),
    );
    priceLineHostRef.current = hostSeries;
  }, [levels, useFutureLineMode]);

  return <div ref={containerRef} className="h-full w-full" />;
}
