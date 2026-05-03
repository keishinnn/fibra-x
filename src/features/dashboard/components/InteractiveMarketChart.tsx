"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  LineStyle,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { MarketCandle } from "@/features/market-data/types/market-data.types";

export interface ChartLevelLine {
  label: string;
  price: number;
  color: string;
  lineStyle?: LineStyle;
}

interface InteractiveMarketChartProps {
  candles: MarketCandle[];
  levels: ChartLevelLine[];
  intervalKey: string;
}

const TV_BULL_CANDLE_COLOR = "#089981";
const TV_BEAR_CANDLE_COLOR = "#f23645";

function toChartData(candles: MarketCandle[]): CandlestickData<UTCTimestamp>[] {
  return candles.map((item) => ({
    time: Math.floor(item.time / 1000) as UTCTimestamp,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
  }));
}

export function InteractiveMarketChart({ candles, levels, intervalKey }: InteractiveMarketChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRefs = useRef<IPriceLine[]>([]);
  const hasFittedContentRef = useRef(false);

  const chartData = useMemo(() => toChartData(candles), [candles]);

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

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
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
      seriesRef.current = null;
      chartRef.current = null;
      hasFittedContentRef.current = false;
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || chartData.length === 0) {
      return;
    }

    seriesRef.current.setData(chartData);
    if (!hasFittedContentRef.current) {
      chartRef.current?.timeScale().fitContent();
      hasFittedContentRef.current = true;
    }
  }, [chartData]);

  useEffect(() => {
    const series = seriesRef.current;

    if (!series) {
      return;
    }

    for (const line of priceLineRefs.current) {
      series.removePriceLine(line);
    }

    priceLineRefs.current = levels.map((level) =>
      series.createPriceLine({
        price: level.price,
        color: level.color,
        lineWidth: 1,
        lineStyle: level.lineStyle ?? LineStyle.Dashed,
        axisLabelVisible: true,
        title: level.label,
      }),
    );
  }, [levels]);

  return <div ref={containerRef} className="h-full w-full" />;
}
