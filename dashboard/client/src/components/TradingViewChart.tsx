import { useEffect, useRef, memo } from "react";

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
  theme?: "dark" | "light";
}

function TradingViewChartInner({ symbol, interval = "M", height = 500, theme = "dark" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: "America/New_York",
      theme: "dark",
      style: "1", // Candlestick
      locale: "en",
      backgroundColor: "rgba(0, 0, 0, 1)",
      gridColor: "rgba(212, 175, 55, 0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      studies: [
        "STD;Bollinger_Bands",
        "STD;Stochastic"
      ],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#D4AF37",
        "mainSeriesProperties.candleStyle.downColor": "#555555",
        "mainSeriesProperties.candleStyle.borderUpColor": "#D4AF37",
        "mainSeriesProperties.candleStyle.borderDownColor": "#555555",
        "mainSeriesProperties.candleStyle.wickUpColor": "#D4AF37",
        "mainSeriesProperties.candleStyle.wickDownColor": "#555555",
        "volumePaneSize": "small",
      },
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval]);

  return (
    <div className="rounded-lg overflow-hidden border border-[#D4AF37]/10 bg-black">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#050505] border-b border-[#D4AF37]/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider">LIVE CHART</span>
          <span className="text-[10px] font-mono text-[#666]">|</span>
          <span className="text-[10px] font-mono text-[#888]">{symbol}</span>
        </div>
        <span className="text-[10px] font-mono text-[#444]">
          {interval === "M" ? "MONTHLY" : interval === "W" ? "WEEKLY" : interval === "D" ? "DAILY" : interval}
        </span>
      </div>
      <div
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: `${height}px`, width: "100%" }}
      />
    </div>
  );
}

export const TradingViewChart = memo(TradingViewChartInner);
