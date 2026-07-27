// ============================================================
// WALL STREET CASCADE GRID — NYSE Trading Floor Style
// Real-time mosaic of all tickers, color-coded by performance
// Institutional flow badges, volume anomaly indicators
// ============================================================

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

interface TickerTile {
  symbol: string;
  company: string;
  price: number;
  change: string;
  down: boolean;
  sector: string;
  volumeRatio?: number;
  sslStatus?: string;
  distToSSL?: number;
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(1)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(0)}K`;
  return vol.toString();
}

function TickerCard({ tile, size, onClick }: { tile: TickerTile; size: "lg" | "md" | "sm"; onClick: () => void }) {
  const changePct = parseFloat(tile.change) || 0;
  const isUp = !tile.down;
  const isFlat = Math.abs(changePct) < 0.05;

  // Color intensity based on magnitude
  const magnitude = Math.min(Math.abs(changePct), 5);
  const intensity = Math.round(20 + (magnitude / 5) * 40);

  const bgColor = isFlat
    ? "bg-[#111]"
    : isUp
    ? `bg-green-${Math.min(900, 950 - intensity * 5)}/30`
    : `bg-red-${Math.min(900, 950 - intensity * 5)}/30`;

  const borderColor = isFlat
    ? "border-[#222]"
    : isUp
    ? "border-green-500/20"
    : "border-red-500/20";

  const textColor = isFlat ? "text-[#888]" : isUp ? "text-green-400" : "text-red-400";

  const hasVolumeAnomaly = tile.volumeRatio && tile.volumeRatio >= 2.0;
  const hasSSLAlert = tile.sslStatus === "SSL Breached" || tile.sslStatus === "Approaching";

  if (size === "lg") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, zIndex: 10 }}
        onClick={onClick}
        className={`relative p-3 rounded-lg border cursor-pointer transition-all ${borderColor} ${isFlat ? "bg-[#111]" : isUp ? "bg-green-950/30" : "bg-red-950/30"}`}
      >
        {/* Volume anomaly badge */}
        {hasVolumeAnomaly && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[7px] font-bold text-black">!</span>
          </motion.div>
        )}
        {/* SSL alert badge */}
        {hasSSLAlert && (
          <motion.div
            className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <span className="text-[7px] font-bold text-white">⚡</span>
          </motion.div>
        )}

        <div className="flex items-start justify-between mb-1">
          <span className="text-sm font-mono font-bold text-[#E8E0D0]">{tile.symbol}</span>
          <span className={`text-[10px] font-mono font-semibold ${textColor}`}>
            {isUp ? "▲" : isFlat ? "—" : "▼"} {tile.change}%
          </span>
        </div>
        <p className="text-lg font-mono font-bold text-[#E8E0D0] mb-0.5">${tile.price.toFixed(2)}</p>
        <p className="text-[9px] font-mono text-[#555] truncate">{tile.company}</p>
        {tile.volumeRatio && tile.volumeRatio > 1.5 && (
          <div className="mt-1.5 flex items-center gap-1">
            <div className="h-1 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${tile.volumeRatio >= 2 ? "bg-[#D4AF37]" : "bg-green-500/60"}`}
                style={{ width: `${Math.min(tile.volumeRatio * 33, 100)}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-[#D4AF37]">{tile.volumeRatio.toFixed(1)}x</span>
          </div>
        )}
      </motion.div>
    );
  }

  if (size === "md") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03, zIndex: 10 }}
        onClick={onClick}
        className={`relative p-2 rounded border cursor-pointer transition-all ${borderColor} ${isFlat ? "bg-[#111]" : isUp ? "bg-green-950/25" : "bg-red-950/25"}`}
      >
        {hasVolumeAnomaly && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {hasSSLAlert && (
          <motion.div
            className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#E8E0D0]">{tile.symbol}</span>
          <span className={`text-[9px] font-mono font-semibold ${textColor}`}>
            {isUp ? "▲" : "▼"}{tile.change}%
          </span>
        </div>
        <p className="text-sm font-mono font-bold text-[#CCC]">${tile.price.toFixed(2)}</p>
      </motion.div>
    );
  }

  // Small tile
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onClick={onClick}
      className={`relative px-2 py-1.5 rounded border cursor-pointer transition-all ${borderColor} ${isFlat ? "bg-[#111]" : isUp ? "bg-green-950/20" : "bg-red-950/20"}`}
    >
      {hasVolumeAnomaly && (
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono font-bold text-[#CCC]">{tile.symbol}</span>
        <span className={`text-[9px] font-mono ${textColor}`}>
          {isUp ? "+" : ""}{tile.change}%
        </span>
      </div>
    </motion.div>
  );
}

// InstitutionalFlowPanel removed — no notifications

// RecentAlertsPanel removed — no notifications

export function WallStreetGrid({ onDeepDive }: { onDeepDive?: (symbol: string) => void } = {}) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cascade" | "sector">("cascade");

  // Get ticker tape quotes for all stocks
  const { data: quotes, isLoading: quotesLoading } = trpc.market.tickerTapeQuotes.useQuery(
    undefined,
    { refetchInterval: 15000 }
  );

  // Get SSL watchlist for status overlay
  const { data: sslData } = trpc.market.sslWatchlist.useQuery(
    { timeframe: "Monthly" },
    { refetchInterval: 30000 }
  );

  // Volume anomalies query removed

  // Merge data into tiles
  const tiles = useMemo<TickerTile[]>(() => {
    if (!quotes) return [];
    return quotes.map((q: any) => {
      const ssl = sslData?.find((s: any) => s.symbol === q.symbol);
      return {
        symbol: q.symbol,
        company: q.company || q.symbol,
        price: typeof q.price === "string" ? parseFloat(q.price) : q.price,
        change: q.change,
        down: q.down,
        sector: q.sector || "Unknown",
        volumeRatio: ssl?.volumeRatio,
        sslStatus: ssl?.status,
        distToSSL: ssl?.distToSSLPct,
      };
    });
  }, [quotes, sslData]);

  // Group by sector for sector view
  const sectorGroups = useMemo(() => {
    const groups: Record<string, TickerTile[]> = {};
    tiles.forEach(t => {
      const sector = t.sector || "Other";
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(t);
    });
    return groups;
  }, [tiles]);

  // Market summary
  const upCount = tiles.filter(t => !t.down).length;
  const downCount = tiles.filter(t => t.down).length;
  const anomalyCount = tiles.filter(t => t.volumeRatio && t.volumeRatio >= 2).length;

  if (quotesLoading) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <motion.div
              className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm font-mono text-[#666]">Loading Wall Street data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-[#D4AF37] flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            WALL STREET EXCHANGE
          </h2>
          <p className="text-[10px] font-mono text-[#555] mt-1">
            Real-time cascade of all tracked tickers — institutional flow highlighted
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Market Summary */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
            <span className="text-green-400">▲ {upCount}</span>
            <span className="text-red-400">▼ {downCount}</span>
            {anomalyCount > 0 && (
              <span className="text-[#D4AF37] flex items-center gap-1">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>●</motion.span>
                {anomalyCount} FLOW
              </span>
            )}
          </div>
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#080808] rounded border border-[#222] p-0.5">
            <button
              onClick={() => setViewMode("cascade")}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                viewMode === "cascade" ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#555] border border-transparent"
              }`}
            >
              CASCADE
            </button>
            <button
              onClick={() => setViewMode("sector")}
              className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                viewMode === "sector" ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#555] border border-transparent"
              }`}
            >
              SECTOR
            </button>
          </div>
        </div>
      </div>



      {/* Cascade Grid */}
      {viewMode === "cascade" ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-2">
          {tiles.map((tile, i) => (
            <TickerCard
              key={tile.symbol}
              tile={tile}
              size={i < 6 ? "lg" : i < 15 ? "md" : "sm"}
              onClick={() => setSelectedTicker(selectedTicker === tile.symbol ? null : tile.symbol)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(sectorGroups).map(([sector, sectorTiles]) => (
            <div key={sector} className="rounded-lg border border-[#D4AF37]/10 overflow-hidden bg-[#050505]">
              <div className="px-4 py-2.5 bg-[#0A0A0A] border-b border-[#D4AF37]/10 flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold">{sector.toUpperCase()}</span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-green-400">{sectorTiles.filter(t => !t.down).length} ▲</span>
                  <span className="text-red-400">{sectorTiles.filter(t => t.down).length} ▼</span>
                </div>
              </div>
              <div className="p-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {sectorTiles.map(tile => (
                  <TickerCard
                    key={tile.symbol}
                    tile={tile}
                    size="md"
                    onClick={() => setSelectedTicker(selectedTicker === tile.symbol ? null : tile.symbol)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Ticker Detail */}
      <AnimatePresence>
        {selectedTicker && (
          <SelectedTickerDetail symbol={selectedTicker} onClose={() => setSelectedTicker(null)} />
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-3 py-2.5 bg-[#050505] rounded-lg border border-[#D4AF37]/10 text-[9px] font-mono text-[#555]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500/60" /> UP</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500/60" /> DOWN</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> VOLUME ANOMALY (2x+ avg)</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> SSL ALERT</span>
        <span className="ml-auto text-[#444]">Auto-refresh: 15s</span>
      </div>
    </div>
  );
}

function SelectedTickerDetail({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const { data: quote } = trpc.market.quote.useQuery({ symbol });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="rounded-lg border border-[#D4AF37]/20 bg-[#050505] overflow-hidden"
    >
      <div className="px-4 py-3 bg-[#0A0A0A] border-b border-[#D4AF37]/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-mono font-bold text-[#D4AF37]">{symbol}</span>
          {quote && (
            <span className="text-lg font-mono font-bold text-[#E8E0D0]">${quote.currentPrice.toFixed(2)}</span>
          )}
        </div>
        <button onClick={onClose} className="text-[#555] hover:text-[#999] transition-all text-sm">✕</button>
      </div>
      {quote && (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[9px] font-mono text-[#555]">DAY HIGH</span>
            <p className="text-sm font-mono text-[#CCC]">${quote.dayHigh.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">DAY LOW</span>
            <p className="text-sm font-mono text-[#CCC]">${quote.dayLow.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">52W HIGH</span>
            <p className="text-sm font-mono text-[#CCC]">${quote.fiftyTwoWeekHigh.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">PREV CLOSE</span>
            <p className="text-sm font-mono text-[#CCC]">${quote.previousClose.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">VOLUME</span>
            <p className="text-sm font-mono text-[#CCC]">{formatVolume(quote.volume)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">AVG VOLUME</span>
            <p className="text-sm font-mono text-[#CCC]">{formatVolume(quote.avgVolume)}</p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">VOL RATIO</span>
            <p className={`text-sm font-mono font-bold ${quote.avgVolume > 0 && quote.volume / quote.avgVolume >= 2 ? "text-[#D4AF37]" : "text-[#CCC]"}`}>
              {quote.avgVolume > 0 ? (quote.volume / quote.avgVolume).toFixed(2) : "N/A"}x
            </p>
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#555]">DAY CHANGE</span>
            <p className={`text-sm font-mono font-bold ${quote.currentPrice >= quote.previousClose ? "text-green-400" : "text-red-400"}`}>
              {quote.previousClose > 0
                ? `${quote.currentPrice >= quote.previousClose ? "+" : ""}${(((quote.currentPrice - quote.previousClose) / quote.previousClose) * 100).toFixed(2)}%`
                : "N/A"
              }
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
