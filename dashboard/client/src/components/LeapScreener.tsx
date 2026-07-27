// ============================================================
// SETUP SCREENER — Real-time detection across the three TF
// Elite strategies: BOUNCE, SSL (sell-side liquidity), BREAKOUT
// Multi-timeframe tabs (Daily/Weekly/Monthly)
// Past Winners archive, TradingView charts, auto-refresh
// ============================================================

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { getAlertColor } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { TradingViewChart } from "./TradingViewChart";
import { MiniCandleChart } from "./MiniCandleChart";

type Timeframe = "Daily" | "Weekly" | "Monthly";
type Strategy = "Bounce" | "SSL" | "Breakout";

interface StrategyConfig {
  tabLabel: string;
  title: string;
  description: string;
  levelLabel: string; // table column / detail panel label
  chartLevelLabel: string; // short label drawn on the candle chart
  activeStatus: string; // the "it's happening" status
  activeStatLabel: string; // hero stat label
  statuses: string[]; // filter options
  alertHeadline: string;
  alertDetail: (item: any) => string;
  planTag?: string; // small badge next to the hero title
}

const STRATEGY_CONFIG: Record<Strategy, StrategyConfig> = {
  Bounce: {
    tabLabel: "BOUNCE",
    title: "Bounce Screener",
    description:
      "The TF Bounce Profit Plan — uptrending stocks (above the 50 & 200 MA) pulling back and bouncing off the 13/20 MA or key support, confirmed by volume, a reversal candle, stochastics, and MACD.",
    levelLabel: "BOUNCE ZONE",
    chartLevelLabel: "ZONE",
    activeStatus: "Bouncing",
    activeStatLabel: "BOUNCING",
    statuses: ["all", "Bouncing", "Approaching", "Watching"],
    alertHeadline: "◉ BOUNCE FORMING",
    alertDetail: (item) => `${item.symbol} — Holding the bounce zone at $${item.level.toFixed(2)}`,
    planTag: "◆ THE BOUNCE PROFIT PLAN",
  },
  SSL: {
    tabLabel: "SSL",
    title: "SSL Screener",
    description:
      "Real-time sell-side liquidity sweep detection. Identifying setups where price sweeps below a key low to grab liquidity while smart money is loading.",
    levelLabel: "SSL LEVEL",
    chartLevelLabel: "SSL",
    activeStatus: "SSL Breached",
    activeStatLabel: "BREACHED",
    statuses: ["all", "SSL Breached", "Approaching", "Watching"],
    alertHeadline: "⚡ SSL LEVEL BREACHED",
    alertDetail: (item) => `${item.symbol} — Sell-side liquidity swept at $${item.level.toFixed(2)}`,
  },
  Breakout: {
    tabLabel: "BREAKOUT",
    title: "Breakout Screener",
    description:
      "The TF Breakout Strategy — ride the wave of stocks breaking to new highs on above-average relative volume, with full-bodied Marubozu candles, ideally out of a flag or pennant.",
    levelLabel: "RESISTANCE",
    chartLevelLabel: "RES",
    activeStatus: "Breakout",
    activeStatLabel: "BREAKOUTS",
    statuses: ["all", "Breakout", "Approaching", "Watching"],
    alertHeadline: "▲ BREAKOUT",
    alertDetail: (item) => `${item.symbol} — Cleared resistance at $${item.level.toFixed(2)}`,
    planTag: "◆ TF BREAKOUT STRATEGY",
  },
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "SSL Breached": "text-red-400 bg-red-500/15 border-red-500/30",
    "Bouncing": "text-green-400 bg-green-500/15 border-green-500/30",
    "Breakout": "text-[#D4AF37] bg-[#D4AF37]/15 border-[#D4AF37]/40",
    "Approaching": "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
    "Watching": "text-blue-400 bg-blue-500/15 border-blue-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${colors[status] || "text-[#666] bg-[#111] border-[#222]"}`}>
      {status === "SSL Breached" && "⚡ "}
      {status === "Breakout" && "▲ "}
      {status === "Bouncing" && "◉ "}
      {status.toUpperCase()}
    </span>
  );
}

// Market Pulse — the Bounce Plan's fundamental layer: SPY direction,
// volatility, and the jobs-report-day warning
function MarketPulseStrip() {
  const { data: pulse } = trpc.market.marketPulse.useQuery(undefined, { refetchInterval: 5 * 60 * 1000 });
  if (!pulse) return null;

  const trendColor =
    pulse.spy?.trend === "BULLISH" ? "text-green-400" : pulse.spy?.trend === "BEARISH" ? "text-red-400" : "text-yellow-400";
  const warn = pulse.isJobsReportDay;

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 rounded-lg border text-[10px] font-mono ${
      warn ? "bg-red-950/30 border-red-500/30" : "bg-[#050505] border-[#D4AF37]/10"
    }`}>
      <span className="text-[#D4AF37] font-semibold tracking-wider">MARKET PULSE</span>
      {pulse.spy && (
        <span className="text-[#888]">
          SPY <span className={`font-bold ${trendColor}`}>{pulse.spy.trend}</span>
          {" "}${pulse.spy.price?.toFixed(2)}
          {pulse.spy.sma50 != null && <span className="text-[#555]"> · 50MA ${pulse.spy.sma50.toFixed(2)}</span>}
        </span>
      )}
      {pulse.vix != null && (
        <span className="text-[#888]">
          VIX <span className={`font-bold ${pulse.vix >= 25 ? "text-red-400" : pulse.vix >= 18 ? "text-yellow-400" : "text-green-400"}`}>{pulse.vix.toFixed(1)}</span>
        </span>
      )}
      <span className="text-[#666]">
        {warn ? "⚠ " : "Next jobs report: "}
        <span className={warn ? "text-red-400 font-bold" : "text-[#888]"}>
          {warn ? "JOBS REPORT DAY" : pulse.nextJobsReportDate}
        </span>
      </span>
      <span className={`${warn ? "text-red-300" : "text-[#666]"} basis-full sm:basis-auto sm:ml-auto`}>{pulse.guidance}</span>
    </div>
  );
}

function VolumeBar({ ratio }: { ratio: number }) {
  const pct = Math.min(ratio * 50, 100); // 2x avg = 100%
  const color = ratio > 1.5 ? "bg-[#D4AF37]" : ratio > 1 ? "bg-green-500" : "bg-[#444]";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <span className="text-[10px] font-mono text-[#888]">{ratio.toFixed(1)}x</span>
    </div>
  );
}

function WhatToWatch({ item, strategy, timeframe }: { item: any; strategy: Strategy; timeframe: Timeframe }) {
  const cfg = STRATEGY_CONFIG[strategy];
  const lvl = `$${item.level.toFixed(2)}`;
  const tf = timeframe.toLowerCase();

  let lines: { icon: string; iconClass: string; text: string }[] = [];

  if (strategy === "SSL") {
    if (item.status === "SSL Breached") {
      lines = [
        { icon: "⚡", iconClass: "text-red-400", text: `SSL level at ${lvl} has been swept` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Wait for absorption candle on ${tf} close` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Check for volume climax confirmation" },
      ];
    } else if (item.status === "Approaching") {
      lines = [
        { icon: "●", iconClass: "text-yellow-400", text: `Price within ${item.distToLevelPct.toFixed(1)}% of SSL level` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Monitor for sell-side liquidity sweep" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Set alerts at ${lvl}` },
      ];
    } else {
      lines = [
        { icon: "●", iconClass: "text-blue-400", text: `Price ${item.distToLevelPct.toFixed(1)}% above SSL level` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "On radar — not yet actionable" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Watch for breakdown toward ${lvl}` },
      ];
    }
  } else if (strategy === "Bounce") {
    if (item.status === "Bouncing") {
      lines = [
        { icon: "◉", iconClass: "text-green-400", text: `Bounce zone (13/20 MA or support) at ${lvl} tapped and holding` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Wait for the reversal candle on the ${tf} close` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Confirm with volume, stochastics turning up, and MACD" },
      ];
    } else if (item.status === "Approaching") {
      lines = [
        { icon: "●", iconClass: "text-yellow-400", text: `Price within ${item.distToLevelPct.toFixed(1)}% of the bounce zone at ${lvl}` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Watch for a tap-and-hold of the zone" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Set alerts at ${lvl} — check the stock is above its 50/200 MA` },
      ];
    } else {
      lines = [
        { icon: "●", iconClass: "text-blue-400", text: `Price ${item.distToLevelPct.toFixed(1)}% above the bounce zone at ${lvl}` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "On radar — not yet actionable" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Watch for a pullback toward ${lvl}` },
      ];
    }
  } else {
    if (item.status === "Breakout") {
      lines = [
        { icon: "▲", iconClass: "text-[#D4AF37]", text: `Resistance at ${lvl} has been broken — riding toward new highs` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Confirm the ${tf} close: full-bodied Marubozu candle + relative volume over 1` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Broken resistance should now act as support — watch the retest" },
      ];
    } else if (item.status === "Approaching") {
      lines = [
        { icon: "●", iconClass: "text-yellow-400", text: `Price within ${item.distToLevelPct.toFixed(1)}% below resistance at ${lvl}` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "Watch for a high-volume Marubozu break — flag/pennant patterns are ideal" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Set alerts at ${lvl}` },
      ];
    } else {
      lines = [
        { icon: "●", iconClass: "text-blue-400", text: `Resistance overhead at ${lvl} (${item.distToLevelPct.toFixed(1)}% above)` },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: "On radar — not yet actionable" },
        { icon: "◆", iconClass: "text-[#D4AF37]", text: `Needs momentum toward ${lvl}` },
      ];
    }
  }

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
      <span className="text-[10px] font-mono text-[#666] block mb-2">WHAT TO WATCH — {cfg.tabLabel}</span>
      <ul className="space-y-2 text-xs font-mono text-[#999]">
        {lines.map((l, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`${l.iconClass} mt-0.5`}>{l.icon}</span> {l.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SetupDetailPanel({ item, strategy, timeframe, onDeepDive }: { item: any; strategy: Strategy; timeframe: Timeframe; onDeepDive?: (symbol: string) => void }) {
  const [showChart, setShowChart] = useState(false);
  const interval = timeframe === "Monthly" ? "M" : timeframe === "Weekly" ? "W" : "D";
  const cfg = STRATEGY_CONFIG[strategy];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="px-4 sm:px-6 py-6 bg-[#060606] border-t border-[#D4AF37]/15">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Price & Level Data */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              PRICE & LEVEL DATA
            </h4>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-[#555]">CURRENT PRICE</span>
                  <p className="text-xl font-mono font-bold text-[#E8E0D0]">${item.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#555]">{cfg.levelLabel}</span>
                  <p className="text-xl font-mono font-bold text-[#D4AF37]">${item.level.toFixed(2)}</p>
                </div>
              </div>
              <div className="border-t border-[#1A1A1A] pt-3 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-[#555]">DISTANCE TO {cfg.levelLabel}</span>
                  <p className={`text-lg font-mono font-bold ${item.distToLevelPct < 2 ? "text-red-400" : item.distToLevelPct < 5 ? "text-yellow-400" : "text-green-400"}`}>
                    {item.distToLevelPct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#555]">TIMEFRAME</span>
                  <p className="text-lg font-mono font-bold text-[#CCC]">{timeframe}</p>
                </div>
              </div>
            </div>

            {/* Volume Analysis */}
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
              <span className="text-[10px] font-mono text-[#666] block mb-3">VOLUME ANALYSIS</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-mono text-[#555]">CURRENT VOL</span>
                  <p className="text-base font-mono font-bold text-[#CCC]">{(item.volume / 1e6).toFixed(1)}M</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#555]">AVG VOL</span>
                  <p className="text-base font-mono font-bold text-[#CCC]">{(item.avgVolume / 1e6).toFixed(1)}M</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-mono text-[#555]">VOLUME RATIO</span>
                  <span className={`text-[11px] font-mono font-bold ${item.volumeRatio > 1.5 ? "text-[#D4AF37]" : item.volumeRatio > 1 ? "text-green-400" : "text-[#888]"}`}>
                    {item.volumeRatio.toFixed(2)}x AVG
                  </span>
                </div>
                <div className="h-2.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${item.volumeRatio > 1.5 ? "bg-[#D4AF37]" : item.volumeRatio > 1 ? "bg-green-500" : "bg-[#444]"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.volumeRatio * 50, 100)}%` }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Alert Status */}
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getAlertColor(item.status)}`}>
              <span className="text-[11px] font-mono font-bold">
                {item.status === "SSL Breached" && "⚡ "}
                {item.status === "Breakout" && "▲ "}
                {item.status === "Bouncing" && "◉ "}
                STATUS: {item.status.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono opacity-70">
                {new Date(item.lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Column 2: Sector & Context */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              CONTEXT & SECTOR
            </h4>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10 space-y-3">
              <div>
                <span className="text-[9px] font-mono text-[#555]">COMPANY</span>
                <p className="text-sm font-mono text-[#CCC] font-medium">{item.company}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#555]">SECTOR</span>
                <p className="text-sm font-mono text-[#CCC]">{item.sector}</p>
              </div>
            </div>

            {/* What to Watch */}
            <WhatToWatch item={item} strategy={strategy} timeframe={timeframe} />

            {/* Risk Note */}
            <div className="bg-red-950/30 p-4 rounded-lg border border-red-500/20">
              <span className="text-[10px] font-mono text-red-400 font-semibold flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                RISK NOTE
              </span>
              <p className="text-[12px] font-mono text-red-300/80 mt-2 leading-relaxed">
                {timeframe} {cfg.tabLabel.toLowerCase()} analysis only. Always confirm with the candle close and volume before acting. This is NOT financial advice — for educational purposes only.
              </p>
            </div>
          </div>

          {/* Column 3: Chart & Deep Dive */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              CHART & ANALYSIS
            </h4>

            {/* Mini Candle Chart Preview — Large */}
            {item.candles && item.candles.length > 0 && (
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-[#888] font-semibold">CANDLE CHART — {timeframe.toUpperCase()}</span>
                  <span className="text-[9px] font-mono text-[#555]">{item.candles.length} BARS</span>
                </div>
                <MiniCandleChart
                  candles={item.candles}
                  levels={item.levels || []}
                  levelLabel={cfg.chartLevelLabel}
                  width={600}
                  height={320}
                  showVolume={true}
                  expandable={true}
                  symbol={item.symbol}
                  timeframe={timeframe.toLowerCase()}
                  currentPrice={item.currentPrice}
                />
              </div>
            )}

            {/* Deep Dive & TradingView buttons side by side */}
            <div className="flex gap-2">
              {onDeepDive && (
                <button
                  onClick={() => onDeepDive(item.symbol)}
                  className="flex-1 px-4 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 font-bold tracking-wider"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  DEEP DIVE
                </button>
              )}
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg text-xs font-mono text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                {showChart ? "HIDE TV CHART" : "TRADINGVIEW"}
              </button>
            </div>
            <AnimatePresence>
              {showChart && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <TradingViewChart symbol={item.symbol} interval={interval} height={500} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PastWinnersSection() {
  const { data: pastWinners, isLoading } = trpc.market.pastWinners.useQuery();
  const [expanded, setExpanded] = useState(false);

  if (isLoading || !pastWinners || pastWinners.length === 0) return null;

  return (
    <div className="rounded-lg border border-[#D4AF37]/15 overflow-hidden bg-[#050505]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-[#0A0A0A] hover:bg-[#0D0D0D] transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-wider text-[#D4AF37] font-semibold">
            ◆ PAST WINNERS ARCHIVE
          </span>
          <span className="text-[10px] font-mono text-[#555]">
            {pastWinners.length} completed setups
          </span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-[#D4AF37] text-sm"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-[#D4AF37]/10">
              {pastWinners.map((w: any) => (
                <div key={w.symbol} className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                  <div>
                    <span className="text-sm font-mono font-bold text-[#D4AF37]">{w.symbol}</span>
                    <p className="text-[10px] font-mono text-[#666]">{w.company}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#555]">ENTRY → EXIT</span>
                    <p className="text-xs font-mono text-[#CCC]">${w.entryPrice} → ${w.exitPrice}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#555]">RETURN</span>
                    <p className={`text-sm font-mono font-bold ${w.returnPct > 0 ? "text-green-400" : "text-red-400"}`}>
                      {w.returnPct > 0 ? "+" : ""}{w.returnPct}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#555]">HOLD TIME</span>
                    <p className="text-xs font-mono text-[#CCC]">{w.holdingPeriod}</p>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-[9px] font-mono text-[#555]">GRADE</span>
                    <p className="text-sm font-mono font-bold text-[#D4AF37]">{w.grade}</p>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-[9px] font-mono text-[#555]">OUTCOME</span>
                    <p className="text-xs font-mono text-green-400">{w.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LeapScreener({ onDeepDive }: { onDeepDive?: (symbol: string) => void } = {}) {
  const [strategy, setStrategy] = useState<Strategy>("Bounce");
  const [timeframe, setTimeframe] = useState<Timeframe>("Monthly");
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("distance");

  const cfg = STRATEGY_CONFIG[strategy];

  // Real-time strategy watchlist from tRPC
  const { data: watchlist, isLoading, isError } = trpc.market.strategyWatchlist.useQuery(
    { strategy, timeframe },
    { refetchInterval: 30000 } // Auto-refresh every 30s
  );

  // Screening status
  const { data: screeningStatus } = trpc.market.screeningStatus.useQuery(
    undefined,
    { refetchInterval: 60000 }
  );

  // Institutional flow scan
  const { data: flowData } = trpc.market.flowScan.useQuery(
    undefined,
    { refetchInterval: 60000 }
  );

  // Map flow data by symbol for quick lookup
  const flowBySymbol = useMemo(() => {
    const map = new Map<string, any>();
    if (flowData) {
      for (const flow of flowData) {
        map.set(flow.symbol, flow);
      }
    }
    return map;
  }, [flowData]);

  // Filter and sort
  const filtered = useMemo(() => {
    if (!watchlist) return [];
    let items = [...watchlist];

    if (filterStatus !== "all") {
      items = items.filter(i => i.status === filterStatus);
    }

    items.sort((a, b) => {
      if (sortBy === "distance") return a.distToLevelPct - b.distToLevelPct;
      if (sortBy === "ticker") return a.symbol.localeCompare(b.symbol);
      if (sortBy === "volume") return b.volumeRatio - a.volumeRatio;
      return 0;
    });

    return items;
  }, [watchlist, filterStatus, sortBy]);

  const activeItems = watchlist?.filter(i => i.status === cfg.activeStatus) || [];

  const switchStrategy = (s: Strategy) => {
    setStrategy(s);
    setExpandedSymbol(null);
    setFilterStatus("all");
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Active Setup Alerts */}
      {activeItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {activeItems.map(alert => (
            <div
              key={alert.symbol}
              className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                strategy === "SSL"
                  ? "bg-red-950/30 border-red-500/30 hover:bg-red-950/40"
                  : strategy === "Bounce"
                  ? "bg-green-950/30 border-green-500/30 hover:bg-green-950/40"
                  : "bg-[#D4AF37]/10 border-[#D4AF37]/30 hover:bg-[#D4AF37]/15"
              }`}
              onClick={() => setExpandedSymbol(expandedSymbol === alert.symbol ? null : alert.symbol)}
            >
              <motion.div
                className={`w-2.5 h-2.5 rounded-full ${strategy === "SSL" ? "bg-red-500" : strategy === "Bounce" ? "bg-green-500" : "bg-[#D4AF37]"}`}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className={`text-sm font-mono font-bold ${strategy === "SSL" ? "text-red-400" : strategy === "Bounce" ? "text-green-400" : "text-[#D4AF37]"}`}>
                {cfg.alertHeadline}
              </span>
              <span className="text-sm font-mono text-[#CCC]">{cfg.alertDetail(alert)}</span>
              <span className="ml-auto text-[10px] font-mono opacity-60 hidden sm:inline text-[#999]">CLICK TO VIEW</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Hero Banner */}
      <div
        className="relative rounded-lg overflow-hidden border border-[#D4AF37]/20"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/PTAYzGVyp8VVoVaBzmbyC8/leap-hero-v2-myJnjkxs3YUXptC2bax6xc.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        <div className="relative px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {timeframe} {cfg.title}
                </h1>
                {cfg.planTag && (
                  <span className="mb-3 px-2 py-1 rounded border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-mono tracking-wider">
                    {cfg.planTag}
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-[#999] max-w-xl leading-relaxed">
                {cfg.description}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE DATA
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  Auto-refresh: 30s
                </div>
                {screeningStatus && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    Month End: {screeningStatus.daysToMonthEnd}D
                  </div>
                )}
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3">
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-[#666]">TRACKED</span>
                <p className="text-3xl font-mono font-bold text-[#D4AF37]">{watchlist?.length || 0}</p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-[#666]">{cfg.activeStatLabel}</span>
                <p className={`text-3xl font-mono font-bold ${strategy === "SSL" ? "text-red-400" : strategy === "Bounce" ? "text-green-400" : "text-[#D4AF37]"}`}>
                  {activeItems.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Pulse — Bounce Plan fundamental layer */}
      <MarketPulseStrip />

      {/* Strategy Tabs */}
      <div className="flex items-center gap-2 p-2 bg-[#080808] rounded-lg border border-[#D4AF37]/10">
        <span className="text-[10px] font-mono text-[#666] tracking-wider font-semibold px-2">STRATEGY</span>
        <div className="h-4 w-px bg-[#222]" />
        {(Object.keys(STRATEGY_CONFIG) as Strategy[]).map(s => (
          <button
            key={s}
            onClick={() => switchStrategy(s)}
            className={`px-4 py-1.5 rounded text-xs font-mono font-semibold border transition-all ${
              strategy === s
                ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                : "bg-[#0A0A0A] border-[#222] text-[#555] hover:border-[#444] hover:text-[#888]"
            }`}
          >
            {STRATEGY_CONFIG[s].tabLabel}
          </button>
        ))}
      </div>

      {/* Timeframe Tabs + Status Filter */}
      <div className="flex items-center gap-2 p-2 bg-[#080808] rounded-lg border border-[#D4AF37]/10 flex-wrap">
        <span className="text-[10px] font-mono text-[#666] tracking-wider font-semibold px-2">TIMEFRAME</span>
        <div className="h-4 w-px bg-[#222]" />
        {(["Daily", "Weekly", "Monthly"] as Timeframe[]).map(tf => (
          <button
            key={tf}
            onClick={() => { setTimeframe(tf); setExpandedSymbol(null); }}
            className={`px-4 py-1.5 rounded text-xs font-mono font-semibold border transition-all ${
              timeframe === tf
                ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                : "bg-[#0A0A0A] border-[#222] text-[#555] hover:border-[#444] hover:text-[#888]"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono text-[#555]">STATUS:</span>
          {cfg.statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                filterStatus === s
                  ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]"
                  : "bg-[#0A0A0A] border-[#222] text-[#555] hover:border-[#444]"
              }`}
            >
              {s === "all" ? "ALL" : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <motion.div
              className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-sm font-mono text-[#666]">Scanning {timeframe.toLowerCase()} {cfg.tabLabel.toLowerCase()} setups...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 bg-red-950/20 rounded-lg border border-red-500/20 text-center">
          <p className="text-sm font-mono text-red-400">Failed to load screener data. Retrying...</p>
        </div>
      )}

      {/* Error / Data Unavailable State */}
      {!isLoading && isError && (
        <div className="p-12 bg-[#050505] rounded-lg border border-[#D4AF37]/20 text-center space-y-3">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="opacity-60">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-mono text-[#D4AF37]">DATA TEMPORARILY UNAVAILABLE</p>
          <p className="text-[10px] font-mono text-[#666] max-w-md mx-auto">
            Market data is being refreshed. The screener will automatically retry and display setups when data becomes available.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#222] rounded text-[10px] font-mono text-[#555]">
            <div className="w-1.5 h-1.5 border border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            AUTO-RETRYING
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="p-12 bg-[#050505] rounded-lg border border-[#D4AF37]/10 text-center space-y-3">
          <div className="text-4xl">◆</div>
          <p className="text-sm font-mono text-[#888]">No active {cfg.tabLabel.toLowerCase()} setups on the {timeframe.toLowerCase()} timeframe</p>
          <p className="text-[10px] font-mono text-[#555]">
            Key levels are being monitored. Setups will appear when price approaches {strategy === "Breakout" ? "resistance" : "support"}.
          </p>
        </div>
      )}

      {/* Data Table */}
      {!isLoading && filtered.length > 0 && (
        <div className="rounded-lg border border-[#D4AF37]/15 overflow-hidden bg-[#050505]">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-[80px_1fr_100px_100px_80px_100px_120px_80px_50px] gap-0 bg-[#0A0A0A] border-b border-[#D4AF37]/20 px-4 py-2.5 text-[10px] font-mono tracking-wider text-[#666] font-semibold">
            <span>TICKER</span>
            <span>COMPANY</span>
            <span className="text-right">PRICE</span>
            <span className="text-right">{cfg.levelLabel}</span>
            <span className="text-center">DIST %</span>
            <span className="text-center">VOL RATIO</span>
            <span className="text-center">STATUS</span>
            <span className="text-center">SECTOR</span>
            <span className="text-center">◆</span>
          </div>

          {/* Table Rows */}
          {filtered.map((item: any) => (
            <div key={item.symbol}>
              {/* Desktop Row */}
              <div
                className="hidden lg:grid grid-cols-[80px_1fr_100px_100px_80px_100px_120px_80px_50px] gap-0 px-4 py-3 border-b border-[#D4AF37]/5 items-center cursor-pointer hover:bg-[#D4AF37]/[0.03] transition-all"
                onClick={() => setExpandedSymbol(expandedSymbol === item.symbol ? null : item.symbol)}
              >
                <span className={`text-sm font-mono font-bold ${item.status === cfg.activeStatus ? (strategy === "SSL" ? "text-red-400" : strategy === "Bounce" ? "text-green-400" : "text-[#D4AF37]") : "text-[#D4AF37]"}`}>
                  {item.symbol}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#CCC]">{item.company}</span>
                  {flowBySymbol.get(item.symbol)?.institutionalActivity !== "LOW" && flowBySymbol.get(item.symbol)?.institutionalActivity && (
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      flowBySymbol.get(item.symbol)?.institutionalActivity === "EXTREME"
                        ? "text-red-300 bg-red-500/20 border-red-500/40 animate-pulse"
                        : flowBySymbol.get(item.symbol)?.institutionalActivity === "HIGH"
                        ? "text-orange-300 bg-orange-500/15 border-orange-500/30"
                        : "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                    }`}>
                      {flowBySymbol.get(item.symbol)?.institutionalActivity === "EXTREME" ? "🔥 EXTREME FLOW" :
                       flowBySymbol.get(item.symbol)?.institutionalActivity === "HIGH" ? "⚡ HIGH FLOW" : "◆ FLOW"}
                    </span>
                  )}
                </div>
                <span className="text-sm font-mono text-[#E8E0D0] text-right">${item.currentPrice.toFixed(2)}</span>
                <span className="text-sm font-mono text-[#D4AF37] text-right">${item.level.toFixed(2)}</span>
                <span className={`text-sm font-mono text-center font-bold ${item.distToLevelPct < 2 ? "text-red-400" : item.distToLevelPct < 5 ? "text-yellow-400" : "text-[#888]"}`}>
                  {item.distToLevelPct.toFixed(1)}%
                </span>
                <div className="flex justify-center">
                  <VolumeBar ratio={item.volumeRatio} />
                </div>
                <div className="flex justify-center">
                  <StatusBadge status={item.status} />
                </div>
                <span className="text-[10px] font-mono text-[#666] text-center truncate">{item.sector?.split(" ")[0]}</span>
                <div className="flex justify-center">
                  <motion.span
                    animate={{ rotate: expandedSymbol === item.symbol ? 180 : 0 }}
                    className="text-[#D4AF37] text-xs"
                  >
                    ▼
                  </motion.span>
                </div>
              </div>

              {/* Mobile Card */}
              <div
                className="lg:hidden px-4 py-3 border-b border-[#D4AF37]/5 cursor-pointer hover:bg-[#D4AF37]/[0.03] transition-all"
                onClick={() => setExpandedSymbol(expandedSymbol === item.symbol ? null : item.symbol)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono font-bold ${item.status === cfg.activeStatus ? (strategy === "SSL" ? "text-red-400" : strategy === "Bounce" ? "text-green-400" : "text-[#D4AF37]") : "text-[#D4AF37]"}`}>
                      {item.symbol}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <span className="text-sm font-mono text-[#E8E0D0]">${item.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-[#666]">
                  <span>{cfg.levelLabel}: ${item.level.toFixed(2)}</span>
                  <span>Dist: {item.distToLevelPct.toFixed(1)}%</span>
                  <span>Vol: {item.volumeRatio.toFixed(1)}x</span>
                </div>
              </div>

              {/* Expanded Detail */}
              <AnimatePresence>
                {expandedSymbol === item.symbol && (
                  <SetupDetailPanel item={item} strategy={strategy} timeframe={timeframe} onDeepDive={onDeepDive} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Past Winners Archive */}
      <PastWinnersSection />
    </div>
  );
}
