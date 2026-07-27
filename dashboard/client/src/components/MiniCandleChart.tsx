import { useMemo, useCallback, useState } from "react";

interface Candle {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface MiniCandleChartProps {
  candles: Candle[];
  sslLevels?: number[];
  dcaZones?: { price: number; label: string }[];
  ma20?: number;
  width?: number;
  height?: number;
  showVolume?: boolean;
  onCandleClick?: (candle: Candle) => void;
  className?: string;
  expandable?: boolean;
  symbol?: string;
  timeframe?: string;
  currentPrice?: number;
}

function CandleChartSVG({
  candles,
  sslLevels = [],
  dcaZones = [],
  ma20,
  width = 320,
  height = 140,
  showVolume = true,
  onCandleClick,
  className = "",
  showCrosshair = false,
}: {
  candles: Candle[];
  sslLevels?: number[];
  dcaZones?: { price: number; label: string }[];
  ma20?: number;
  width?: number;
  height?: number;
  showVolume?: boolean;
  onCandleClick?: (candle: Candle) => void;
  className?: string;
  showCrosshair?: boolean;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!candles || candles.length === 0) return null;

    const padding = { top: 8, right: showCrosshair ? 50 : 4, bottom: showVolume ? 28 : 8, left: showCrosshair ? 50 : 4 };
    const chartWidth = width - padding.left - padding.right;
    const priceAreaHeight = showVolume ? height - padding.top - padding.bottom - 20 : height - padding.top - padding.bottom;
    const volumeAreaHeight = showVolume ? 16 : 0;

    const allHighs = candles.map(c => c.h);
    const allLows = candles.map(c => c.l);
    const priceMin = Math.min(...allLows) * 0.998;
    const priceMax = Math.max(...allHighs) * 1.002;
    const priceRange = priceMax - priceMin;
    const maxVolume = Math.max(...candles.map(c => c.v), 1);

    const candleSpacing = chartWidth / candles.length;
    const candleWidth = Math.max(1, Math.min(candleSpacing * 0.7, showCrosshair ? 8 : 6));
    const wickWidth = Math.max(0.5, candleWidth * 0.15);

    const priceToY = (price: number) =>
      padding.top + priceAreaHeight - ((price - priceMin) / priceRange) * priceAreaHeight;

    const volumeToHeight = (vol: number) => (vol / maxVolume) * volumeAreaHeight;

    const candleElements = candles.map((candle, i) => {
      const x = padding.left + i * candleSpacing + candleSpacing / 2;
      const isGreen = candle.c >= candle.o;
      const bodyTop = priceToY(Math.max(candle.o, candle.c));
      const bodyBottom = priceToY(Math.min(candle.o, candle.c));
      const bodyHeight = Math.max(0.5, bodyBottom - bodyTop);
      const wickTop = priceToY(candle.h);
      const wickBottom = priceToY(candle.l);
      return { x, bodyTop, bodyHeight, wickTop, wickBottom, candleWidth, wickWidth, isGreen, volumeHeight: volumeToHeight(candle.v), candle };
    });

    const sslLines = sslLevels
      .filter(level => level >= priceMin && level <= priceMax)
      .map(level => ({ y: priceToY(level), price: level }));

    const dcaLines = dcaZones
      .filter(zone => zone.price >= priceMin && zone.price <= priceMax)
      .map(zone => ({ y: priceToY(zone.price), price: zone.price, label: zone.label }));

    const ma20Line = ma20 && ma20 >= priceMin && ma20 <= priceMax ? { y: priceToY(ma20), price: ma20 } : null;
    const volumeBaseY = padding.top + priceAreaHeight + 4;

    // Price grid lines for expanded view
    const gridLines: { y: number; price: number }[] = [];
    if (showCrosshair) {
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const price = priceMin + (priceRange * i) / steps;
        gridLines.push({ y: priceToY(price), price });
      }
    }

    return { padding, candleElements, sslLines, dcaLines, ma20Line, volumeBaseY, priceMin, priceMax, gridLines, candleSpacing };
  }, [candles, sslLevels, dcaZones, ma20, width, height, showVolume, showCrosshair]);

  if (!chartData) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-[10px] font-mono text-[#444]">NO DATA</span>
      </div>
    );
  }

  const hoveredCandle = hoveredIdx !== null ? chartData.candleElements[hoveredIdx] : null;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={{ background: "transparent" }}
      viewBox={`0 0 ${width} ${height}`}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Grid lines for expanded view */}
      {showCrosshair && chartData.gridLines.map((gl, i) => (
        <g key={`grid-${i}`}>
          <line x1={chartData.padding.left} y1={gl.y} x2={width - chartData.padding.right} y2={gl.y} stroke="#222" strokeWidth={0.5} />
          <text x={chartData.padding.left - 4} y={gl.y + 3} fill="#555" fontSize={9} fontFamily="monospace" textAnchor="end">${gl.price.toFixed(gl.price > 100 ? 0 : 2)}</text>
        </g>
      ))}

      {/* SSL levels */}
      {chartData.sslLines.map((ssl, i) => (
        <g key={`ssl-${i}`}>
          <line x1={chartData.padding.left} y1={ssl.y} x2={width - chartData.padding.right} y2={ssl.y} stroke="#D4AF37" strokeWidth={showCrosshair ? 1 : 0.5} strokeDasharray="3,3" opacity={0.6} />
          <text x={width - chartData.padding.right + 2} y={ssl.y + 3} fill="#D4AF37" fontSize={showCrosshair ? 9 : 7} fontFamily="monospace" textAnchor={showCrosshair ? "start" : "end"} opacity={0.7}>SSL ${ssl.price.toFixed(0)}</text>
        </g>
      ))}

      {/* DCA zones */}
      {chartData.dcaLines.map((dca, i) => (
        <g key={`dca-${i}`}>
          <line x1={chartData.padding.left} y1={dca.y} x2={width - chartData.padding.right} y2={dca.y} stroke="#22c55e" strokeWidth={0.5} strokeDasharray="2,4" opacity={0.5} />
          {showCrosshair && <text x={width - chartData.padding.right + 2} y={dca.y + 3} fill="#22c55e" fontSize={8} fontFamily="monospace" textAnchor="start" opacity={0.6}>{dca.label}</text>}
        </g>
      ))}

      {/* 20 MA */}
      {chartData.ma20Line && (
        <line x1={chartData.padding.left} y1={chartData.ma20Line.y} x2={width - chartData.padding.right} y2={chartData.ma20Line.y} stroke="#3b82f6" strokeWidth={0.5} strokeDasharray="4,2" opacity={0.5} />
      )}

      {/* Candles */}
      {chartData.candleElements.map((ce, i) => (
        <g
          key={i}
          onClick={() => onCandleClick?.(ce.candle)}
          onMouseEnter={() => showCrosshair && setHoveredIdx(i)}
          style={{ cursor: onCandleClick || showCrosshair ? "pointer" : "default" }}
        >
          <line x1={ce.x} y1={ce.wickTop} x2={ce.x} y2={ce.wickBottom} stroke={ce.isGreen ? "#22c55e" : "#ef4444"} strokeWidth={ce.wickWidth} opacity={0.8} />
          <rect x={ce.x - ce.candleWidth / 2} y={ce.bodyTop} width={ce.candleWidth} height={ce.bodyHeight} fill={ce.isGreen ? "#22c55e" : "#ef4444"} opacity={hoveredIdx === i ? 1 : 0.9} />
        </g>
      ))}

      {/* Volume bars */}
      {showVolume && chartData.candleElements.map((ce, i) => (
        <rect key={`vol-${i}`} x={ce.x - ce.candleWidth / 2} y={chartData.volumeBaseY + 16 - ce.volumeHeight} width={ce.candleWidth} height={ce.volumeHeight} fill={ce.isGreen ? "#22c55e" : "#ef4444"} opacity={hoveredIdx === i ? 0.5 : 0.25} />
      ))}

      {/* Crosshair on hover */}
      {showCrosshair && hoveredCandle && (
        <g>
          <line x1={hoveredCandle.x} y1={chartData.padding.top} x2={hoveredCandle.x} y2={height - chartData.padding.bottom} stroke="#D4AF37" strokeWidth={0.5} opacity={0.4} strokeDasharray="2,2" />
          <rect x={hoveredCandle.x - 55} y={2} width={110} height={36} fill="#111" stroke="#D4AF37" strokeWidth={0.5} rx={2} opacity={0.95} />
          <text x={hoveredCandle.x} y={14} fill="#E8E0D0" fontSize={9} fontFamily="monospace" textAnchor="middle">
            O:{hoveredCandle.candle.o.toFixed(2)} C:{hoveredCandle.candle.c.toFixed(2)}
          </text>
          <text x={hoveredCandle.x} y={24} fill="#E8E0D0" fontSize={9} fontFamily="monospace" textAnchor="middle">
            H:{hoveredCandle.candle.h.toFixed(2)} L:{hoveredCandle.candle.l.toFixed(2)}
          </text>
          <text x={hoveredCandle.x} y={34} fill="#888" fontSize={8} fontFamily="monospace" textAnchor="middle">
            Vol:{(hoveredCandle.candle.v / 1e6).toFixed(1)}M
          </text>
        </g>
      )}

      {/* Price labels (mini view only) */}
      {!showCrosshair && (
        <>
          <text x={chartData.padding.left + 2} y={chartData.padding.top + 7} fill="#666" fontSize={7} fontFamily="monospace">${chartData.priceMax.toFixed(0)}</text>
          <text x={chartData.padding.left + 2} y={height - (showVolume ? 26 : 6)} fill="#666" fontSize={7} fontFamily="monospace">${chartData.priceMin.toFixed(0)}</text>
        </>
      )}
    </svg>
  );
}

export function MiniCandleChart({
  candles,
  sslLevels = [],
  dcaZones = [],
  ma20,
  width = 320,
  height = 140,
  showVolume = true,
  onCandleClick,
  className = "",
  expandable = true,
  symbol = "",
  timeframe = "",
  currentPrice,
}: MiniCandleChartProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Mini chart with expand button */}
      <div className={`relative group ${className}`} style={{ width, height }}>
        <CandleChartSVG
          candles={candles}
          sslLevels={sslLevels}
          dcaZones={dcaZones}
          ma20={ma20}
          width={width}
          height={height}
          showVolume={showVolume}
          onCandleClick={onCandleClick}
        />
        {expandable && candles.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#111]/90 border border-[#D4AF37]/30 rounded px-1.5 py-0.5 text-[8px] font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 cursor-pointer z-10"
          >
            ⤢ EXPAND
          </button>
        )}
      </div>

      {/* Fullscreen modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="w-full max-w-[1200px] bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D4AF37]/10">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-[#D4AF37] font-bold">{symbol || "CHART"}</span>
                {timeframe && <span className="text-xs font-mono text-[#555]">{timeframe === "Monthly" ? "5Y MONTHLY" : timeframe === "Weekly" ? "1Y WEEKLY" : "6M DAILY"}</span>}
                {currentPrice && <span className="text-xs font-mono text-[#E8E0D0]">${currentPrice.toFixed(2)}</span>}
                <span className="text-[10px] font-mono text-[#444]">{candles.length} bars</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Legend */}
                <div className="flex items-center gap-3">
                  {sslLevels.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-[1px]" style={{ borderBottom: "1px dashed #D4AF37", opacity: 0.6 }} />
                      <span className="text-[9px] font-mono text-[#D4AF37]/60">SSL</span>
                    </div>
                  )}
                  {dcaZones.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-[1px]" style={{ borderBottom: "1px dashed #22c55e", opacity: 0.5 }} />
                      <span className="text-[9px] font-mono text-[#22c55e]/60">DCA</span>
                    </div>
                  )}
                  {ma20 && (
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-[1px]" style={{ borderBottom: "1px dashed #3b82f6", opacity: 0.5 }} />
                      <span className="text-[9px] font-mono text-[#3b82f6]/60">20 MA</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-[#666] hover:text-[#D4AF37] transition-colors text-lg font-mono cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            {/* Expanded chart */}
            <div className="p-2">
              <CandleChartSVG
                candles={candles}
                sslLevels={sslLevels}
                dcaZones={dcaZones}
                ma20={ma20}
                width={1180}
                height={500}
                showVolume={true}
                showCrosshair={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ExpandedCandleChartProps extends MiniCandleChartProps {
  symbol: string;
  timeframe: string;
  currentPrice?: number;
}

export function ExpandedCandleChart({ symbol, timeframe, currentPrice, candles, sslLevels = [], dcaZones = [], ma20, width = 600, height = 300, className = "" }: ExpandedCandleChartProps) {
  const timeframeLabel = timeframe === "Monthly" ? "5Y MONTHLY" : timeframe === "Weekly" ? "1Y WEEKLY" : "6M DAILY";
  return (
    <div className={`bg-[#0a0a0a] border border-[#D4AF37]/10 rounded ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#D4AF37]/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{symbol}</span>
          <span className="text-[9px] font-mono text-[#555]">{timeframeLabel}</span>
        </div>
        {currentPrice && <span className="text-[10px] font-mono text-[#E8E0D0]">${currentPrice.toFixed(2)}</span>}
      </div>
      <div className="p-1">
        <MiniCandleChart candles={candles} sslLevels={sslLevels} dcaZones={dcaZones} ma20={ma20} width={width - 8} height={height - 40} showVolume={true} expandable={true} symbol={symbol} timeframe={timeframe} currentPrice={currentPrice} />
      </div>
      <div className="flex items-center gap-3 px-3 py-1 border-t border-[#D4AF37]/5">
        {sslLevels.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-[1px]" style={{ borderBottom: "1px dashed #D4AF37", opacity: 0.6 }} />
            <span className="text-[8px] font-mono text-[#D4AF37]/60">SSL</span>
          </div>
        )}
        {dcaZones.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-[1px]" style={{ borderBottom: "1px dashed #22c55e", opacity: 0.5 }} />
            <span className="text-[8px] font-mono text-[#22c55e]/60">DCA</span>
          </div>
        )}
        {ma20 && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-[1px]" style={{ borderBottom: "1px dashed #3b82f6", opacity: 0.5 }} />
            <span className="text-[8px] font-mono text-[#3b82f6]/60">20 MA</span>
          </div>
        )}
      </div>
    </div>
  );
}
