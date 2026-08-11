// ============================================================
// INVESTMENT RADAR — Deploy Capital / Wealth Building Mode
// Real-time tRPC data: Market Lifecycle, Sector Benchmarks,
// Relative PE, $10K Calculator, Position Builder, Conviction Signals
// ============================================================

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { TradingViewChart } from "./TradingViewChart";

// --- Helper Components ---

function DrawdownMeter({ percent }: { percent: number }) {
  const getColor = (p: number) => {
    if (p >= 40) return { bar: "bg-red-500", text: "text-red-400", label: "GENERATIONAL DISCOUNT" };
    if (p >= 30) return { bar: "bg-orange-500", text: "text-orange-400", label: "DEEP VALUE" };
    if (p >= 20) return { bar: "bg-yellow-500", text: "text-yellow-400", label: "DISCOUNTED" };
    if (p >= 10) return { bar: "bg-blue-400", text: "text-blue-400", label: "PULLBACK" };
    return { bar: "bg-[#555]", text: "text-[#888]", label: "NEAR HIGHS" };
  };
  const c = getColor(percent);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-[#555]">DRAWDOWN FROM ATH</span>
        <span className={`text-[10px] font-mono font-bold ${c.text}`}>{c.label}</span>
      </div>
      <div className="h-3.5 bg-[#1A1A1A] rounded-sm overflow-hidden relative">
        <motion.div className={`h-full ${c.bar} rounded-sm`} initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white/90 drop-shadow-sm">-{percent.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function getSignalColor(status: string) {
  switch (status) {
    case "Deploy Now": return "bg-green-500/10 border-green-500/30 text-green-400";
    case "Good Buy": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "Approaching": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
    case "On Watch": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    default: return "bg-[#111] border-[#222] text-[#555]";
  }
}

function getDCAZoneColor(status: string) {
  if (status === "Hit") return "text-green-400";
  if (status === "Active") return "text-yellow-400";
  return "text-[#555]";
}

// --- Market Lifecycle Gauge ---

function MarketLifecycleGauge() {
  const { data, isLoading } = trpc.market.marketLifecycle.useQuery(undefined, { refetchInterval: 60000 });

  if (isLoading || !data) {
    return (
      <div className="p-4 bg-[#050505] rounded-lg border border-[#D4AF37]/15 animate-pulse">
        <div className="h-6 bg-[#1A1A1A] rounded w-48 mb-2" />
        <div className="h-4 bg-[#1A1A1A] rounded w-full" />
      </div>
    );
  }

  const phases = ["Accumulation", "Markup", "Distribution", "Markdown"] as const;
  const phaseIdx = phases.indexOf(data.phase as any);

  return (
    <div className="rounded-lg border border-[#D4AF37]/25 overflow-hidden bg-[#050505]">
      {/* Phase Header */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-[#0A0A0A] to-[#050505] border-b border-[#D4AF37]/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.color }}
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <h3 className="text-lg font-mono font-bold text-[#E8E0D0]">
                MARKET LIFECYCLE: <span style={{ color: data.color }}>{data.phase.toUpperCase()}</span>
              </h3>
              <span className="text-[10px] font-mono text-[#666]">CONFIDENCE: {data.confidence}%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-[#888]">SPY: <span className="text-[#CCC]">${data.spyPrice?.toFixed(2)}</span> <span className="text-red-400">(-{data.spyDrawdown}%)</span></span>
            <span className="text-[#555]">|</span>
            <span className="text-[#888]">QQQ: <span className="text-[#CCC]">${data.qqqPrice?.toFixed(2)}</span> <span className="text-red-400">(-{data.qqqDrawdown}%)</span></span>
          </div>
        </div>
      </div>

      {/* Phase Bar */}
      <div className="px-4 sm:px-6 py-3 bg-[#030303]">
        <div className="flex gap-1">
          {phases.map((p, i) => {
            const isActive = i === phaseIdx;
            const colors: Record<string, string> = {
              Accumulation: "#4488FF",
              Markup: "#00CC66",
              Distribution: "#FFD700",
              Markdown: "#FF4444",
            };
            return (
              <div key={p} className="flex-1 relative">
                <div className={`h-2 rounded-full transition-all ${isActive ? "" : "opacity-25"}`} style={{ backgroundColor: colors[p] }} />
                <span className={`text-[8px] font-mono mt-1 block text-center ${isActive ? "text-[#CCC]" : "text-[#444]"}`}>{p.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message + Action */}
      <div className="px-4 sm:px-6 py-4 space-y-3">
        <p className="text-[13px] font-mono leading-relaxed" style={{ color: data.color }}>{data.message}</p>
        <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#D4AF37]/15">
          <span className="text-[9px] font-mono text-[#D4AF37] font-bold block mb-1">ACTION</span>
          <p className="text-[12px] font-mono text-[#CCC] leading-relaxed">{data.actionMessage}</p>
        </div>

        {/* Signals */}
        {data.signals && data.signals.length > 0 && (
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[#555] tracking-wider">SIGNALS</span>
            {data.signals.map((s: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-[#999]">
                <span className="text-[#D4AF37] mt-0.5">◆</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Conviction Signal ---

function ConvictionSignal({ item }: { item: any }) {
  const v = item.valuation;
  if (!v) return null;

  const isScreamingBuy = v.discountVsHistorical != null && v.discountVsHistorical > 15 && item.technicals?.drawdownPct > 20;
  const isGoodValue = v.discountVsHistorical != null && v.discountVsHistorical > 5;

  if (!isScreamingBuy && !isGoodValue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-lg border ${
        isScreamingBuy
          ? "bg-green-950/30 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          : "bg-[#0D0D08] border-[#D4AF37]/20"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isScreamingBuy && (
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-lg">
            🟢
          </motion.span>
        )}
        <span className={`text-[11px] font-mono font-bold tracking-wider ${isScreamingBuy ? "text-green-400" : "text-[#D4AF37]"}`}>
          {isScreamingBuy ? "SCREAMING BUY SIGNAL" : "VALUE OPPORTUNITY"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div>
          <span className="text-[8px] font-mono text-[#555]">CURRENT PE</span>
          <p className="text-base font-mono font-bold text-[#CCC]">{v.peRatio?.toFixed(1) || "N/A"}x</p>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#555]">FORWARD PE</span>
          <p className="text-base font-mono font-bold text-green-400">{v.forwardPE?.toFixed(1) || "N/A"}x</p>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#555]">HIST AVG PE</span>
          <p className="text-base font-mono font-bold text-[#888]">{v.historicalAvgPE}x</p>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#555]">DISCOUNT</span>
          <p className="text-base font-mono font-bold text-green-400">{v.discountVsHistorical?.toFixed(1)}%</p>
        </div>
      </div>
      {isScreamingBuy && (
        <p className="text-[11px] font-mono text-green-400/80 mt-3 leading-relaxed">
          Revenue growing {v.revenueGrowth}, earnings est. {v.earningsGrowthEstimate}, FCF {v.freeCashFlow} — yet the stock is down {item.technicals?.drawdownPct?.toFixed(1)}% from ATH. The business is getting BETTER while the price is getting CHEAPER.
        </p>
      )}
    </motion.div>
  );
}

// --- Peer Comparison Panel ---

function PeerComparisonPanel({ peer }: { peer: any }) {
  if (!peer) return null;

  const valueColors: Record<string, string> = {
    "Best Value": "text-green-400 bg-green-500/10 border-green-500/30",
    "Good Value": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    "Fair Value": "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    "Overvalued": "text-red-400 bg-red-500/10 border-red-500/30",
    "N/A": "text-[#555] bg-[#111] border-[#222]",
  };

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-[#D4AF37]/60 font-semibold">PEER COMPARISON — {peer.peerGroup}</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${valueColors[peer.relativeValue] || valueColors["N/A"]}`}>
          {peer.relativeValue}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <span className="text-[8px] font-mono text-[#555]">RANK</span>
          <p className="text-lg font-mono font-bold text-[#D4AF37]">#{peer.rank}<span className="text-[10px] text-[#555]">/{peer.totalPeers}</span></p>
        </div>
        <div className="text-center">
          <span className="text-[8px] font-mono text-[#555]">FWD PE vs MEDIAN</span>
          <p className={`text-base font-mono font-bold ${peer.fwdPEvsMedian != null && peer.fwdPEvsMedian < 0 ? "text-green-400" : "text-red-400"}`}>
            {peer.fwdPEvsMedian != null ? `${peer.fwdPEvsMedian > 0 ? "+" : ""}${peer.fwdPEvsMedian}%` : "N/A"}
          </p>
        </div>
        <div className="text-center">
          <span className="text-[8px] font-mono text-[#555]">DRAWDOWN vs MEDIAN</span>
          <p className={`text-base font-mono font-bold ${peer.drawdownVsMedian != null && peer.drawdownVsMedian > 0 ? "text-green-400" : "text-[#888]"}`}>
            {peer.drawdownVsMedian != null ? `${peer.drawdownVsMedian > 0 ? "+" : ""}${peer.drawdownVsMedian}%` : "N/A"}
          </p>
        </div>
      </div>
      <div className="text-[11px] font-mono text-[#999] leading-relaxed">{peer.verdict}</div>
    </div>
  );
}

// --- Sector Benchmark ---

function SectorBenchmarkPanel({ benchmark }: { benchmark: any }) {
  if (!benchmark) return null;
  return (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
      <span className="text-[10px] font-mono text-[#D4AF37]/60 block mb-3 font-semibold">SECTOR BENCHMARK vs {benchmark.sectorETF}</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[8px] font-mono text-[#555]">STOCK vs SECTOR (TODAY)</span>
          <p className={`text-base font-mono font-bold ${benchmark.relativePerformance >= 0 ? "text-green-400" : "text-red-400"}`}>
            {benchmark.relativePerformance >= 0 ? "+" : ""}{benchmark.relativePerformance}%
          </p>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#555]">RELATIVE PE</span>
          <p className={`text-base font-mono font-bold ${
            benchmark.relativePE != null && benchmark.relativePE < 1 ? "text-green-400" : "text-[#CCC]"
          }`}>
            {benchmark.relativePE?.toFixed(2) || "N/A"}x
          </p>
        </div>
      </div>
      <div className="mt-2 text-[10px] font-mono text-[#888]">{benchmark.relativePEVerdict}</div>
    </div>
  );
}

// --- Position Builder Panel ---

function PositionBuilderPanel({ symbol }: { symbol: string }) {
  const [amount, setAmount] = useState(10000);
  const [style, setStyle] = useState<"conservative" | "aggressive" | "allin_zone3">("conservative");
  const [showBuilder, setShowBuilder] = useState(false);

  const { data, isLoading } = trpc.market.positionBuilder.useQuery(
    { symbol, fullPositionSize: amount, deploymentStyle: style },
    { enabled: showBuilder, refetchInterval: 30000 }
  );

  if (!showBuilder) {
    return (
      <button
        onClick={() => setShowBuilder(true)}
        className="w-full p-3 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A0A] hover:bg-[#0D0D08] transition-all text-[11px] font-mono text-[#D4AF37] tracking-wider"
      >
        ◆ OPEN POSITION BUILDER — DEPLOY CAPITAL AT DCA ZONES
      </button>
    );
  }

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/20 space-y-4">
      <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
        <span className="w-1 h-4 bg-[#D4AF37] rounded" />
        POSITION BUILDER — {symbol}
      </h4>

      {/* Amount Input */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-[#666]">FULL POSITION:</span>
        <div className="flex gap-1">
          {[5000, 10000, 25000, 50000, 100000].map(a => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                amount === a ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#111] border-[#222] text-[#555] hover:text-[#888]"
              }`}
            >
              ${(a / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-[#666]">STYLE:</span>
        <div className="flex gap-1">
          {[
            { key: "conservative" as const, label: "EVEN SPLIT" },
            { key: "aggressive" as const, label: "HEAVY ZONE 3" },
            { key: "allin_zone3" as const, label: "ALL-IN ZONE 3" },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setStyle(s.key)}
              className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                style === s.key ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#111] border-[#222] text-[#555] hover:text-[#888]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="text-[10px] font-mono text-[#555] animate-pulse">Calculating deployment plan...</div>}

      {data && !("error" in data) && (
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-[#888]">{data.styleLabel}</div>

          {/* Zone Deployment Table */}
          <div className="space-y-2">
            {data.deploymentPlan.map((zone: any, i: number) => (
              <div key={i} className={`flex items-center justify-between p-2.5 rounded border ${
                zone.deployed ? "bg-green-500/5 border-green-500/20" : "bg-[#080808] border-[#1A1A1A]"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${zone.deployed ? "text-green-400" : "text-[#555]"}`}>
                    {zone.deployed ? "✓" : "○"}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#777]">{zone.label}</span>
                    <p className="text-sm font-mono font-bold text-[#CCC]">${zone.priceLevel.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#666]">{zone.allocationPct}% → {zone.shares} shares</span>
                  <p className="text-[10px] font-mono text-[#888]">${zone.actualCapital.toFixed(0)} deployed</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#080808] rounded-lg border border-[#D4AF37]/10">
            <div className="text-center">
              <span className="text-[8px] font-mono text-[#555]">TOTAL SHARES</span>
              <p className="text-lg font-mono font-bold text-[#D4AF37]">{data.totalShares}</p>
            </div>
            <div className="text-center">
              <span className="text-[8px] font-mono text-[#555]">AVG COST BASIS</span>
              <p className="text-lg font-mono font-bold text-[#CCC]">${data.avgCostBasis.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <span className="text-[8px] font-mono text-[#555]">CAPITAL DEPLOYED</span>
              <p className="text-lg font-mono font-bold text-[#CCC]">${data.totalCapitalDeployed.toFixed(0)}</p>
            </div>
          </div>

          {/* Don't Panic Message */}
          <div className={`p-3 rounded-lg border text-[11px] font-mono leading-relaxed ${
            data.allDeployed
              ? "bg-green-950/20 border-green-500/20 text-green-400"
              : data.zonesDeployed > 0
              ? "bg-yellow-950/20 border-yellow-500/20 text-yellow-400"
              : "bg-[#080808] border-[#222] text-[#888]"
          }`}>
            {data.dontPanicMessage}
          </div>

          {/* Projected Returns */}
          {data.projectedReturns && data.projectedReturns.length > 0 && (
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#555] tracking-wider">PROJECTED PORTFOLIO VALUE</span>
              <div className="grid grid-cols-4 gap-2">
                {data.projectedReturns.map((p: any) => (
                  <div key={p.year} className="text-center p-2 bg-[#080808] rounded border border-[#1A1A1A]">
                    <span className="text-[8px] font-mono text-[#555]">{p.year}Y</span>
                    <p className="text-sm font-mono font-bold text-green-400">${(p.baseCase / 1000).toFixed(0)}K</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- $10K Calculator ---

function InvestmentCalculatorPanel({ symbol }: { symbol: string }) {
  const [amount, setAmount] = useState(10000);
  const [showCalc, setShowCalc] = useState(false);

  const { data, isLoading } = trpc.market.investmentCalculator.useQuery(
    { symbol, investmentAmount: amount },
    { enabled: showCalc, refetchInterval: 30000 }
  );

  if (!showCalc) {
    return (
      <button
        onClick={() => setShowCalc(true)}
        className="w-full p-3 rounded-lg border border-green-500/20 bg-green-950/10 hover:bg-green-950/20 transition-all text-[11px] font-mono text-green-400 tracking-wider"
      >
        ◆ WHAT IF YOU INVESTED $10K TODAY?
      </button>
    );
  }

  return (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-green-500/20 space-y-3">
      <h4 className="text-[11px] font-mono tracking-wider text-green-400 font-semibold">
        INVESTMENT CALCULATOR — {symbol}
      </h4>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-[#666]">INVEST:</span>
        {[5000, 10000, 25000, 50000].map(a => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
              amount === a ? "bg-green-500/15 border-green-500/40 text-green-400" : "bg-[#111] border-[#222] text-[#555]"
            }`}
          >
            ${(a / 1000).toFixed(0)}K
          </button>
        ))}
      </div>

      {isLoading && <div className="text-[10px] font-mono text-[#555] animate-pulse">Calculating...</div>}

      {data && !("error" in data) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#888]">Buy {data.sharesYouCanBuy} shares at ${data.currentPrice.toFixed(2)}</span>
            <span className="text-[#666]">Invested: ${data.actualInvested.toFixed(0)}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="text-[#555] border-b border-[#222]">
                  <th className="text-left py-1.5">YEAR</th>
                  <th className="text-right py-1.5">CONSERVATIVE</th>
                  <th className="text-right py-1.5">BASE CASE</th>
                  <th className="text-right py-1.5">BULL CASE</th>
                </tr>
              </thead>
              <tbody>
                {data.futureValues.map((fv: any) => (
                  <tr key={fv.year} className="border-b border-[#111]">
                    <td className="py-1.5 text-[#888]">{fv.year}Y</td>
                    <td className="py-1.5 text-right text-[#CCC]">${(fv.conservative / 1000).toFixed(1)}K <span className="text-[#555]">(+{fv.conservativeReturn}%)</span></td>
                    <td className="py-1.5 text-right text-green-400">${(fv.baseCase / 1000).toFixed(1)}K <span className="text-green-400/60">(+{fv.baseCaseReturn}%)</span></td>
                    <td className="py-1.5 text-right text-[#D4AF37]">${(fv.bullCase / 1000).toFixed(1)}K <span className="text-[#D4AF37]/60">(+{fv.bullCaseReturn}%)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] font-mono text-[#555]">
            Growth rates: Conservative {data.growthRates.conservative}% | Base {data.growthRates.baseCase}% | Bull {data.growthRates.bullCase}%
          </div>
        </div>
      )}
    </div>
  );
}

// --- Detail Panel ---

function InvestmentDetailPanel({ item }: { item: any }) {
  const [showChart, setShowChart] = useState(false);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="px-4 sm:px-6 py-6 bg-[#060606] border-t border-[#D4AF37]/15">
        {/* Conviction Signal */}
        <ConvictionSignal item={item} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Column 1: DCA Zones & Drawdown */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              DCA ZONES — DOLLAR COST AVERAGING
            </h4>
            <div className="space-y-2">
              {item.dcaZones.map((zone: any, i: number) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  zone.status === "Active" ? "bg-yellow-500/5 border-yellow-500/25" :
                  zone.status === "Hit" ? "bg-green-500/5 border-green-500/25" :
                  "bg-[#0A0A0A] border-[#1A1A1A]"
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-base ${getDCAZoneColor(zone.status)}`}>
                      {zone.status === "Hit" ? "✓" : zone.status === "Active" ? "◆" : "○"}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-[#777]">{zone.label}</span>
                      <p className={`text-base font-mono font-bold ${getDCAZoneColor(zone.status)}`}>${zone.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded border font-semibold ${
                    zone.status === "Active" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" :
                    zone.status === "Hit" ? "text-green-400 bg-green-400/10 border-green-400/30" :
                    "text-[#555] bg-[#111] border-[#222]"
                  }`}>
                    {zone.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
              <DrawdownMeter percent={item.technicals?.drawdownPct || 0} />
            </div>

            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#555]">ALL-TIME HIGH</span>
                <p className="text-base font-mono font-bold text-[#666] line-through decoration-[#333]">${item.technicals?.allTimeHigh?.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#555]">CURRENT PRICE</span>
                <p className="text-base font-mono font-bold text-[#E8E0D0]">${item.quote.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            {/* Sector Benchmark */}
            <SectorBenchmarkPanel benchmark={item.sectorBenchmark} />

            {/* Peer Comparison */}
            <PeerComparisonPanel peer={item.peerComparison} />
          </div>

          {/* Column 2: Valuation & Fundamentals */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              VALUATION & FUNDAMENTALS
            </h4>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
              <div className="grid grid-cols-2 gap-5">
                <div className="text-center">
                  <span className="text-[9px] font-mono text-[#555] block mb-1">CURRENT P/E</span>
                  <p className={`text-xl font-mono font-bold ${item.valuation?.peRatio != null && item.valuation.peRatio < 25 ? "text-green-400" : "text-[#CCC]"}`}>
                    {item.valuation?.peRatio?.toFixed(1) || "N/A"}x
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-mono text-[#555] block mb-1">FORWARD P/E</span>
                  <p className={`text-xl font-mono font-bold ${item.valuation?.forwardPE != null && item.valuation.forwardPE < 22 ? "text-green-400" : "text-[#CCC]"}`}>
                    {item.valuation?.forwardPE?.toFixed(1) || "N/A"}x
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-mono text-[#555] block mb-1">HIST AVG P/E</span>
                  <p className="text-xl font-mono font-bold text-[#888]">{item.valuation?.historicalAvgPE}x</p>
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-mono text-[#555] block mb-1">FREE CASH FLOW</span>
                  <p className="text-xl font-mono font-bold text-[#D4AF37]">{item.valuation?.freeCashFlow || "N/A"}</p>
                </div>
              </div>
              <div className="border-t border-[#D4AF37]/10 mt-4 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] font-mono text-[#555]">REVENUE GROWTH</span>
                  <p className="text-base font-mono font-bold text-green-400">{item.valuation?.revenueGrowth || "N/A"}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-[#555]">EARNINGS GROWTH EST</span>
                  <p className="text-base font-mono font-bold text-green-400">{item.valuation?.earningsGrowthEstimate || "N/A"}</p>
                </div>
              </div>
              <div className="border-t border-[#D4AF37]/10 mt-3 pt-3">
                <span className="text-[9px] font-mono text-[#555]">VALUATION VERDICT</span>
                <p className="text-[12px] font-mono text-[#CCC] mt-1">{item.valuation?.valuationVerdict}</p>
              </div>
            </div>

            {/* Bollinger + Horizon */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${item.technicals?.touchingLowerBB ? "bg-[#D4AF37]/5 border-[#D4AF37]/25" : "bg-[#0A0A0A] border-[#1A1A1A]"}`}>
                <span className="text-[9px] font-mono text-[#555]">LOWER BB</span>
                <p className={`text-sm font-mono font-bold mt-0.5 ${item.technicals?.touchingLowerBB ? "text-[#D4AF37]" : "text-[#555]"}`}>
                  {item.technicals?.touchingLowerBB ? "BRUSHING ✓" : "NOT YET"}
                </p>
                <p className="text-[10px] font-mono text-[#444] mt-0.5">${item.technicals?.lowerBB?.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg border bg-[#0A0A0A] border-[#1A1A1A]">
                <span className="text-[9px] font-mono text-[#555]">HORIZON</span>
                <p className="text-sm font-mono font-bold text-[#CCC] mt-0.5">{item.investmentHorizon}</p>
              </div>
            </div>

            {/* Investment Calculator */}
            <InvestmentCalculatorPanel symbol={item.symbol} />
          </div>

          {/* Column 3: Bull Case + Position Builder */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded" />
              WHY THIS COMPANY IS STILL SOLID
            </h4>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#D4AF37]/10">
              <span className="text-[10px] font-mono text-[#D4AF37]/60 block mb-2 font-semibold">BULL CASE</span>
              <p className="text-[13px] text-[#BBB] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.bullCase}</p>
            </div>

            <div className="bg-[#0D0D08] p-4 rounded-lg border border-[#D4AF37]/25">
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold block mb-2">CLIFF NOTES — THE BOTTOM LINE</span>
              <p className="text-[13px] text-[#CCC] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.whyStillSolid}</p>
            </div>

            {/* Position Builder */}
            <PositionBuilderPanel symbol={item.symbol} />

            {/* Signal Status Banner */}
            <div className={`p-3 rounded-lg border flex items-center justify-between ${getSignalColor(item.signalStatus)}`}>
              <span className="text-[11px] font-mono font-bold">
                {item.signalStatus === "Deploy Now" && "🟢 "}
                {item.signalStatus.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono opacity-70">
                Updated {new Date(item.lastUpdated).toLocaleTimeString()}
              </span>
            </div>

            {/* TradingView Chart Toggle */}
            <button
              onClick={() => setShowChart(!showChart)}
              className="w-full p-2.5 rounded-lg border border-[#D4AF37]/15 bg-[#080808] hover:bg-[#0A0A0A] transition-all text-[10px] font-mono text-[#888] tracking-wider"
            >
              {showChart ? "▲ HIDE CHART" : "▼ SHOW LIVE CHART"}
            </button>
          </div>
        </div>

        {/* Full-width TradingView Chart */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4"
            >
              <TradingViewChart symbol={item.symbol} interval="M" height={450} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export function InvestmentRadar({ onDeepDive }: { onDeepDive?: (symbol: string) => void } = {}) {
  const { data: radarData, isLoading } = trpc.market.investmentRadar.useQuery(undefined, { refetchInterval: 30000 });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSignal, setFilterSignal] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("drawdown");

  const items = radarData?.items || [];

  const filtered = useMemo(() => {
    let result = [...items];
    if (filterCategory !== "all") result = result.filter(t => t.category === filterCategory);
    if (filterSignal !== "all") result = result.filter(t => t.signalStatus === filterSignal);
    result.sort((a, b) => {
      if (sortBy === "drawdown") return (b.technicals?.drawdownPct || 0) - (a.technicals?.drawdownPct || 0);
      if (sortBy === "ticker") return a.symbol.localeCompare(b.symbol);
      if (sortBy === "pe") return (a.valuation?.forwardPE || 999) - (b.valuation?.forwardPE || 999);
      return 0;
    });
    return result;
  }, [items, filterCategory, filterSignal, sortBy]);

  const deployCount = items.filter(t => t.signalStatus === "Deploy Now" || t.signalStatus === "Good Buy").length;
  const avgDrawdown = items.length > 0 ? (items.reduce((sum, t) => sum + (t.technicals?.drawdownPct || 0), 0) / items.length).toFixed(1) : "0";

  if (isLoading) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="h-48 bg-[#0A0A0A] rounded-lg animate-pulse border border-[#D4AF37]/10" />
        <div className="h-32 bg-[#0A0A0A] rounded-lg animate-pulse border border-[#D4AF37]/10" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-[#0A0A0A] rounded-lg animate-pulse border border-[#D4AF37]/10" />
        ))}
      </div>
    );
  }

  // Data unavailable fallback
  if (!radarData || items.length === 0) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        <MarketLifecycleGauge />
        <div className="rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="opacity-60">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-mono font-bold text-[#D4AF37] mb-2">DATA TEMPORARILY UNAVAILABLE</h2>
          <p className="text-sm font-mono text-[#888] max-w-lg mx-auto mb-4">
            Market data is being refreshed. This usually resolves within a few minutes as cached data repopulates.
            The terminal will automatically retry and display data when available.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-[#222] rounded text-xs font-mono text-[#666]">
            <div className="w-2 h-2 border border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            AUTO-RETRYING EVERY 30 SECONDS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Market Lifecycle Gauge */}
      <MarketLifecycleGauge />

      {/* Hero Banner */}
      <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-r from-[#0A0A0A] to-[#050505]">
        <div className="px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Investment Radar
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#E8E0D0] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Deploy Capital — Wealth Building Mode
              </p>
              <p className="text-sm font-mono text-[#999] max-w-xl leading-relaxed">
                Mag 7 + Index ETFs with real-time valuations. DCA zones mapped. Sector benchmarks. Position builder. 5+ year horizon.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE DATA
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#666]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  Auto-refresh 30s
                </div>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3">
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-[#666]">BUY SIGNALS</span>
                <p className="text-3xl font-mono font-bold text-green-400">{deployCount}</p>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-[#666]">AVG DRAWDOWN</span>
                <p className="text-3xl font-mono font-bold text-orange-400">-{avgDrawdown}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correction Alerts */}
      {radarData?.correctionAlerts && radarData.correctionAlerts.length > 0 && (
        <div className="space-y-2">
          {radarData.correctionAlerts.map((alert: any) => (
            <motion.div
              key={alert.symbol}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg border flex items-center gap-3 ${
                alert.status === "Bear Market" ? "bg-red-950/20 border-red-500/20" :
                alert.status === "Deep Correction" ? "bg-orange-950/20 border-orange-500/20" :
                "bg-yellow-950/20 border-yellow-500/20"
              }`}
            >
              <motion.div
                className={`w-2.5 h-2.5 rounded-full ${
                  alert.status === "Bear Market" ? "bg-red-500" : alert.status === "Deep Correction" ? "bg-orange-500" : "bg-yellow-500"
                }`}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[11px] font-mono text-[#CCC]">{alert.message}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-[#080808] rounded-lg border border-[#D4AF37]/10">
        <span className="text-[10px] font-mono text-[#666] tracking-wider font-semibold">FILTERS</span>
        <div className="h-4 w-px bg-[#222]" />
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-mono text-[#555]">CATEGORY:</span>
          {["all", "Mag 7", "Index ETF"].map(c => (
            <button key={c} onClick={() => setFilterCategory(c)} className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${filterCategory === c ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#0A0A0A] border-[#222] text-[#555] hover:text-[#888]"}`}>
              {c === "all" ? "ALL" : c.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-[#222] hidden sm:block" />
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] font-mono text-[#555]">SIGNAL:</span>
          {["all", "Deploy Now", "Good Buy", "Approaching", "On Watch"].map(s => (
            <button key={s} onClick={() => setFilterSignal(s)} className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${filterSignal === s ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#0A0A0A] border-[#222] text-[#555] hover:text-[#888]"}`}>
              {s === "all" ? "ALL" : s.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-[#222] hidden sm:block" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-[#555]">SORT:</span>
          {[{ key: "drawdown", label: "DRAWDOWN" }, { key: "ticker", label: "TICKER" }, { key: "pe", label: "FWD P/E" }].map(s => (
            <button key={s.key} onClick={() => setSortBy(s.key)} className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${sortBy === s.key ? "bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]" : "bg-[#0A0A0A] border-[#222] text-[#555] hover:text-[#888]"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden lg:block rounded-lg border border-[#D4AF37]/15 overflow-hidden bg-[#050505]">
        <div className="grid grid-cols-[80px_1fr_100px_100px_100px_90px_100px_120px_50px] gap-0 bg-[#0A0A0A] border-b border-[#D4AF37]/20 px-4 py-2.5 text-[10px] font-mono tracking-wider text-[#666] font-semibold">
          <span>TICKER</span>
          <span>COMPANY</span>
          <span className="text-right">PRICE</span>
          <span className="text-right">ATH</span>
          <span className="text-center">DRAWDOWN</span>
          <span className="text-center">FWD P/E</span>
          <span className="text-center">REL PE</span>
          <span className="text-center">SIGNAL</span>
          <span className="text-center">◆</span>
        </div>

        {filtered.map((item, index) => (
          <div key={item.symbol}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setExpandedId(expandedId === item.symbol ? null : item.symbol)}
              className={`grid grid-cols-[80px_1fr_100px_100px_100px_90px_100px_120px_50px] gap-0 px-4 py-3.5 items-center cursor-pointer transition-all duration-200 border-b border-[#111] ${
                expandedId === item.symbol ? "bg-[#0D0D0A] border-l-2 border-l-[#D4AF37]" : "hover:bg-[#0A0A08] border-l-2 border-l-transparent"
              }`}
            >
              <span className="text-sm font-mono font-bold text-[#D4AF37]">{item.symbol}</span>
              <div className="flex flex-col">
                <span className="text-xs text-[#AAA] truncate">{item.company}</span>
                <span className="text-[10px] font-mono text-[#555]">{item.sector}</span>
              </div>
              <span className="text-sm font-mono text-[#CCC] text-right">${item.quote.currentPrice.toFixed(2)}</span>
              <span className="text-sm font-mono text-[#666] text-right">${item.technicals?.allTimeHigh?.toFixed(2)}</span>
              <div className="flex justify-center">
                <span className={`text-sm font-mono font-bold ${
                  (item.technicals?.drawdownPct || 0) >= 30 ? "text-red-400" :
                  (item.technicals?.drawdownPct || 0) >= 20 ? "text-orange-400" : "text-yellow-400"
                }`}>
                  -{(item.technicals?.drawdownPct || 0).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-center">
                <span className={`text-sm font-mono ${(item.valuation?.forwardPE || 999) < 22 ? "text-green-400" : "text-[#CCC]"}`}>
                  {item.valuation?.forwardPE?.toFixed(1) || "N/A"}x
                </span>
              </div>
              <div className="flex justify-center">
                <span className={`text-sm font-mono ${
                  item.sectorBenchmark?.relativePE != null && item.sectorBenchmark.relativePE < 1 ? "text-green-400" : "text-[#888]"
                }`}>
                  {item.sectorBenchmark?.relativePE?.toFixed(2) || "—"}x
                </span>
              </div>
              <div className="flex justify-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getSignalColor(item.signalStatus)}`}>
                  {item.signalStatus === "Deploy Now" ? "🟢 DEPLOY" : item.signalStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-center">
                <motion.span animate={{ rotate: expandedId === item.symbol ? 180 : 0 }} className="text-[#555] text-xs">▼</motion.span>
              </div>
            </motion.div>
            <AnimatePresence>{expandedId === item.symbol && <InvestmentDetailPanel item={item} />}</AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {filtered.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-[#D4AF37]/15 bg-[#050505] overflow-hidden"
          >
            <div
              onClick={() => setExpandedId(expandedId === item.symbol ? null : item.symbol)}
              className="p-4 cursor-pointer hover:bg-[#0A0A08] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-bold text-[#D4AF37]">{item.symbol}</span>
                  <span className={`text-[10px] font-mono ${item.category === "Mag 7" ? "text-[#D4AF37]" : "text-blue-400"}`}>{item.category}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getSignalColor(item.signalStatus)}`}>
                  {item.signalStatus === "Deploy Now" ? "🟢 DEPLOY" : item.signalStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#888]">{item.company}</span>
                <span className="font-mono text-[#CCC]">${item.quote.currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#555] mt-1.5">
                <span className={`font-bold ${
                  (item.technicals?.drawdownPct || 0) >= 30 ? "text-red-400" :
                  (item.technicals?.drawdownPct || 0) >= 20 ? "text-orange-400" : "text-yellow-400"
                }`}>
                  -{(item.technicals?.drawdownPct || 0).toFixed(1)}% from ATH
                </span>
                <span>Fwd P/E: {item.valuation?.forwardPE?.toFixed(1) || "N/A"}x</span>
              </div>
            </div>
            <AnimatePresence>{expandedId === item.symbol && <InvestmentDetailPanel item={item} />}</AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-between px-2 text-[10px] font-mono text-[#444]">
        <span>Showing {filtered.length} of {items.length} targets — 5+ Year Horizon — LIVE</span>
        <span>Last updated: {radarData?.lastUpdated ? new Date(radarData.lastUpdated).toLocaleTimeString() : "N/A"}</span>
      </div>
    </div>
  );
}
