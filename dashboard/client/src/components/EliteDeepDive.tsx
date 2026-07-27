// ============================================================
// ELITE DEEP DIVE — Comprehensive Stock Research Terminal
// Analyst targets, insider activity, SSL grading, sector rotation,
// overreaction detection, SEC filings, AI research — all in one view
// ============================================================
import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { TradingViewChart } from "./TradingViewChart";
import { getGradeColor, getGradeBg } from "@/lib/data";

// --- Helpers ---
function formatNum(n: number | null | undefined): string {
  if (n == null) return "N/A";
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}
function formatPct(n: number | null | undefined): string {
  if (n == null) return "N/A";
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

// --- Score Bar ---
function ScoreBar({ score, max, label }: { score: number; max: number; label: string }) {
  const pct = (score / max) * 100;
  const color = score === max ? "#D4AF37" : score >= max * 0.66 ? "#4ade80" : score >= max * 0.33 ? "#facc15" : "#ef4444";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#888]">{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{score}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// --- Metric Row ---
function MetricRow({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#111] last:border-0">
      <span className="text-[10px] font-mono text-[#666]">{label}</span>
      <span className={`text-xs font-mono font-medium ${color || (highlight ? "text-[#D4AF37]" : "text-[#ccc]")}`}>{value}</span>
    </div>
  );
}

// --- Section Panel ---
function Panel({ title, icon, children, className = "" }: { title: string; icon?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden ${className}`}>
      <div className="px-4 py-2.5 border-b border-[#1a1a1a] bg-[#050505]">
        <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">
          {icon && <span className="mr-1.5">{icon}</span>}{title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// --- Overreaction Alert Banner ---
function OverreactionBanner({ alert }: { alert: any }) {
  if (!alert?.isOverreaction) return null;
  const severityColors = {
    CRITICAL: "border-red-500/50 bg-red-500/10 text-red-400",
    MODERATE: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    MILD: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  };
  const cls = severityColors[alert.severity as keyof typeof severityColors] || severityColors.MILD;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 ${cls}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⚡</span>
        <span className="font-mono text-sm font-bold tracking-wider">
          OVERREACTION ALERT — {alert.severity}
        </span>
      </div>
      <p className="text-xs font-mono leading-relaxed opacity-90">{alert.details}</p>
      {alert.historicalComparison && (
        <p className="text-[10px] font-mono mt-2 opacity-70">
          HISTORICAL: {alert.historicalComparison}
        </p>
      )}
    </motion.div>
  );
}

// --- SSL Grade Card ---
function SSLGradeCard({ grade }: { grade: any }) {
  if (!grade) return null;
  const gradeColor = grade.grade === "A+" ? "text-[#D4AF37]" : grade.grade === "A" ? "text-[#C4A265]" : "text-[#666]";
  const gradeBg = grade.grade === "A+" ? "bg-[#D4AF37]/15 border-[#D4AF37]/40" : grade.grade === "A" ? "bg-[#C4A265]/10 border-[#C4A265]/30" : "bg-[#111] border-[#222]";
  return (
    <Panel title={`SSL GRADE — ${grade.timeframe.toUpperCase()}`} icon="◆">
      <div className="space-y-4">
        {/* Grade Badge */}
        <div className="flex items-center justify-between">
          <div className={`px-4 py-2 rounded border ${gradeBg}`}>
            <span className={`text-2xl font-mono font-black ${gradeColor}`}>{grade.grade}</span>
            <span className="text-sm font-mono text-[#888] ml-2">{grade.totalScore}/9</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-[#888]">${grade.currentPrice?.toFixed(2)}</div>
            <div className="text-[10px] font-mono text-[#555]">SSL: ${grade.nearTermSSL?.toFixed(2)}</div>
          </div>
        </div>
        {/* Score Breakdown */}
        <div className="space-y-3">
          <ScoreBar score={grade.liquidityScore} max={3} label="LIQUIDITY (SSL SWEEP)" />
          <ScoreBar score={grade.volumeClimaxScore} max={3} label="VOLUME CLIMAX" />
          <ScoreBar score={grade.absorptionScore} max={3} label="ABSORPTION CANDLE" />
        </div>
        {/* Details */}
        <div className="space-y-2">
          <div className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
            <div className="text-[9px] font-mono text-[#D4AF37] mb-1">LIQUIDITY</div>
            <p className="text-[10px] font-mono text-[#aaa] leading-relaxed">{grade.liquidityDetails}</p>
          </div>
          <div className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
            <div className="text-[9px] font-mono text-[#D4AF37] mb-1">VOLUME</div>
            <p className="text-[10px] font-mono text-[#aaa] leading-relaxed">{grade.volumeClimaxDetails}</p>
          </div>
          <div className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
            <div className="text-[9px] font-mono text-[#D4AF37] mb-1">ABSORPTION</div>
            <p className="text-[10px] font-mono text-[#aaa] leading-relaxed">{grade.absorptionDetails}</p>
          </div>
        </div>
        {/* Additional Confluence */}
        <div className="flex items-center gap-3">
          {grade.rsiBullishDivergence && (
            <span className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-[10px] font-mono text-green-400">
              ✦ RSI DIVERGENCE
            </span>
          )}
          {grade.fibKeyLevel && (
            <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-[10px] font-mono text-purple-400">
              ✦ FIB KEY LEVEL
            </span>
          )}
          {!grade.rsiBullishDivergence && !grade.fibKeyLevel && (
            <span className="text-[10px] font-mono text-[#555]">No additional confluence flags</span>
          )}
        </div>
        {/* RSI & FIB Details */}
        {(grade.rsiBullishDivergence || grade.fibKeyLevel) && (
          <div className="space-y-1.5">
            {grade.rsiBullishDivergence && (
              <p className="text-[10px] font-mono text-green-400/80">{grade.rsiDetails}</p>
            )}
            {grade.fibKeyLevel && (
              <p className="text-[10px] font-mono text-purple-400/80">{grade.fibDetails}</p>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}

// --- Sector Rotation Panel ---
function SectorRotationPanel() {
  const { data: rotations, isLoading } = trpc.market.sectorRotation.useQuery();
  if (isLoading) return <Panel title="SECTOR ROTATION" icon="◎"><LoadingPulse /></Panel>;
  if (!rotations || rotations.length === 0) return null;
  return (
    <Panel title="SECTOR ROTATION — WHERE IS MONEY FLOWING?" icon="◎">
      <div className="space-y-2">
        {rotations.map((r: any) => {
          const flowColor = r.flowDirection === "OUTFLOW" ? "text-red-400" : r.flowDirection === "INFLOW" ? "text-green-400" : "text-[#666]";
          const flowBg = r.flowDirection === "OUTFLOW" ? "bg-red-500/5 border-red-500/20" : r.flowDirection === "INFLOW" ? "bg-green-500/5 border-green-500/20" : "bg-[#111] border-[#1a1a1a]";
          const strengthIcon = r.flowStrength === "STRONG" ? "●●●" : r.flowStrength === "MODERATE" ? "●●○" : "●○○";
          return (
            <div key={r.etf} className={`p-3 rounded border ${flowBg}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#E8E0D0]">{r.sector}</span>
                  <span className="text-[10px] font-mono text-[#555]">({r.etf})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${flowColor}`}>{strengthIcon}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${flowColor} ${r.flowDirection === "OUTFLOW" ? "bg-red-500/15" : r.flowDirection === "INFLOW" ? "bg-green-500/15" : "bg-[#222]"}`}>
                    {r.flowDirection}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-1.5">
                <span className="text-[10px] font-mono text-[#888]">
                  1W: <span className={r.weeklyChangePct >= 0 ? "text-green-400" : "text-red-400"}>{formatPct(r.weeklyChangePct)}</span>
                </span>
                <span className="text-[10px] font-mono text-[#888]">
                  1M: <span className={r.monthlyChangePct >= 0 ? "text-green-400" : "text-red-400"}>{formatPct(r.monthlyChangePct)}</span>
                </span>
                <span className="text-[10px] font-mono text-[#888]">
                  3M: <span className={r.threeMonthChangePct >= 0 ? "text-green-400" : "text-red-400"}>{formatPct(r.threeMonthChangePct)}</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#777] leading-relaxed">{r.interpretation}</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// AlertSchedulePanel removed — no notifications

// --- Loading Pulse ---
function LoadingPulse() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-[#111] rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
      ))}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
type DeepDiveTab = "overview" | "ssl" | "sectors" | "insiders" | "research";

export function EliteDeepDive({ initialSymbol }: { initialSymbol?: string | null } = {}) {
  const [symbol, setSymbol] = useState(initialSymbol || "");
  const [searchInput, setSearchInput] = useState(initialSymbol || "");
  const [activeSubTab, setActiveSubTab] = useState<DeepDiveTab>("overview");
  const [sslTimeframe, setSSLTimeframe] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");

  // Update symbol when navigating from another tab
  useEffect(() => {
    if (initialSymbol && initialSymbol !== symbol) {
      setSymbol(initialSymbol);
      setSearchInput(initialSymbol);
    }
  }, [initialSymbol]);

  // Fast data — loads instantly (all data except AI research)
  const { data: fastData, isLoading: fastLoading, error: deepDiveError } = trpc.deepDive.getFast.useQuery(
    { symbol },
    { enabled: !!symbol, retry: 1, staleTime: 3 * 60 * 1000 }
  );

  // AI research — lazy-loaded in background (only when user has data or clicks AI tab)
  const { data: fullData, isLoading: aiLoading } = trpc.deepDive.getResearch.useQuery(
    { symbol },
    { enabled: !!symbol && !!fastData, retry: 1, staleTime: 10 * 60 * 1000 }
  );

  // Use full data if available (has AI), otherwise use fast data
  const deepDive = fullData || fastData;
  const deepDiveLoading = fastLoading;

  // SSL grade for this stock
  const { data: sslGrade, isLoading: sslLoading } = trpc.market.sslGradeSingle.useQuery(
    { symbol, timeframe: sslTimeframe },
    { enabled: !!symbol, staleTime: 3 * 60 * 1000 }
  );

  // All graded setups for the selected timeframe
  const { data: allGradedSetups } = trpc.market.sslGrading.useQuery(
    { timeframe: sslTimeframe },
    { staleTime: 3 * 60 * 1000 }
  );

  const handleSearch = () => {
    const s = searchInput.trim().toUpperCase();
    if (s) {
      setSymbol(s);
      setActiveSubTab("overview");
    }
  };

  const subTabs = [
    { id: "overview" as const, label: "OVERVIEW" },
    { id: "ssl" as const, label: "SSL GRADE" },
    { id: "sectors" as const, label: "SECTOR ROTATION" },
    { id: "insiders" as const, label: "INSIDERS & FILINGS" },
    { id: "research" as const, label: "AI RESEARCH" },
  ];

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ENTER TICKER (e.g., AAPL, GOOGL, NFLX)"
            className="w-full bg-[#0a0a0a] border border-[#D4AF37]/30 rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] placeholder:text-[#444] focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#555]">⏎ ENTER</span>
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-sm font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all"
        >
          DEEP DIVE
        </button>
      </div>

      {/* Alert Schedule (always visible) */}


      {/* Graded Setups Quick View */}
      {allGradedSetups && allGradedSetups.length > 0 && !symbol && (
        <Panel title={`A-GRADE SETUPS — ${sslTimeframe.toUpperCase()} (7/9+)`} icon="◆">
          <div className="flex items-center gap-2 mb-4">
            {(["Daily", "Weekly", "Monthly"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSSLTimeframe(tf)}
                className={`px-3 py-1.5 rounded text-[10px] font-mono transition-all ${
                  sslTimeframe === tf
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]"
                    : "bg-[#111] border border-[#222] text-[#666] hover:text-[#999]"
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {allGradedSetups.map((s: any) => (
              <button
                key={s.symbol}
                onClick={() => { setSymbol(s.symbol); setSearchInput(s.symbol); }}
                className="w-full text-left p-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#1a1a1a] hover:border-[#D4AF37]/30 rounded transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-mono font-black ${s.grade === "A+" ? "text-[#D4AF37]" : "text-[#C4A265]"}`}>
                      {s.grade}
                    </span>
                    <div>
                      <span className="text-sm font-mono font-bold text-[#E8E0D0]">{s.symbol}</span>
                      <span className="text-xs font-mono text-[#666] ml-2">{s.company}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#ccc]">${s.currentPrice?.toFixed(2)}</div>
                    <div className="text-[10px] font-mono text-[#888]">{s.totalScore}/9</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-mono text-[#888]">LIQ: {s.liquidityScore}/3</span>
                  <span className="text-[10px] font-mono text-[#888]">VOL: {s.volumeClimaxScore}/3</span>
                  <span className="text-[10px] font-mono text-[#888]">ABS: {s.absorptionScore}/3</span>
                  {s.rsiBullishDivergence && <span className="text-[9px] font-mono text-green-400">✦ RSI DIV</span>}
                  {s.fibKeyLevel && <span className="text-[9px] font-mono text-purple-400">✦ FIB</span>}
                </div>
              </button>
            ))}
          </div>
          {allGradedSetups.length === 0 && (
            <p className="text-xs font-mono text-[#555] text-center py-4">
              No setups grading 7/9 or higher on {sslTimeframe} timeframe. Only A-grade shows here.
            </p>
          )}
        </Panel>
      )}

      {/* No symbol selected */}
      {!symbol && (!allGradedSetups || allGradedSetups.length === 0) && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-20">◆</div>
          <h2 className="text-xl font-mono text-[#D4AF37] mb-2">ELITE DEEP DIVE</h2>
          <p className="text-sm font-mono text-[#666] max-w-md mx-auto">
            Enter any ticker symbol above to access comprehensive research — analyst targets, insider activity, SSL grading, sector rotation, overreaction detection, and AI-powered analysis.
          </p>
        </div>
      )}

      {/* Loading */}
      {symbol && deepDiveLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
            <span className="text-sm font-mono text-[#D4AF37]">RUNNING DEEP DIVE ON {symbol}...</span>
          </div>
          <p className="text-[10px] font-mono text-[#555] mt-2">Pulling analyst data, insider activity, SEC filings, technicals...</p>
        </div>
      )}

      {/* Error */}
      {deepDiveError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <span className="text-sm font-mono text-red-400">{deepDiveError.message}</span>
        </div>
      )}

      {/* Deep Dive Results */}
      {deepDive && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-[#050505] border border-[#222] rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-mono font-black text-[#D4AF37]">{deepDive.symbol}</span>
                  <span className="text-sm font-mono text-[#888]">{deepDive.companyName}</span>
                  <span className="px-2 py-0.5 bg-[#111] border border-[#222] rounded text-[10px] font-mono text-[#666]">
                    {deepDive.sector}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-mono text-[#E8E0D0]">
                    ${deepDive.quote?.currentPrice?.toFixed(2)}
                  </span>
                  {deepDive.analyst?.targetPrice && (
                    <span className="text-xs font-mono text-[#888]">
                      Target: <span className="text-[#D4AF37]">${deepDive.analyst.targetPrice.toFixed(2)}</span>
                      {deepDive.quote?.currentPrice && (
                        <span className={deepDive.analyst.targetPrice > deepDive.quote.currentPrice ? "text-green-400" : "text-red-400"}>
                          {" "}({((deepDive.analyst.targetPrice / deepDive.quote.currentPrice - 1) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              {/* Quick Stats */}
              <div className="flex items-center gap-4">
                {deepDive.technicals && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#666]">DRAWDOWN</div>
                    <div className={`text-sm font-mono ${deepDive.technicals.drawdownPct > 20 ? "text-red-400" : deepDive.technicals.drawdownPct > 10 ? "text-yellow-400" : "text-green-400"}`}>
                      -{deepDive.technicals.drawdownPct.toFixed(1)}%
                    </div>
                  </div>
                )}
                {deepDive.valuation?.peRatio != null && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#666]">P/E</div>
                    <div className="text-sm font-mono text-[#ccc]">{deepDive.valuation.peRatio.toFixed(1)}</div>
                  </div>
                )}
                {deepDive.dividends?.annualYield != null && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-[#666]">YIELD</div>
                    <div className="text-sm font-mono text-green-400">{deepDive.dividends.annualYield.toFixed(2)}%</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Overreaction Alert */}
          <OverreactionBanner alert={deepDive.overreactionAlert} />

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 rounded text-[10px] font-mono tracking-wider whitespace-nowrap transition-all ${
                  activeSubTab === tab.id
                    ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]"
                    : "bg-[#0a0a0a] border border-[#1a1a1a] text-[#666] hover:text-[#999]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {/* OVERVIEW TAB */}
              {activeSubTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* TradingView Chart */}
                  <Panel title={`${deepDive.symbol} CHART`} icon="📈" className="lg:col-span-2">
                    <TradingViewChart symbol={deepDive.symbol} height={700} />
                  </Panel>

                  {/* Analyst & Outlook */}
                  <Panel title="ANALYST CONSENSUS" icon="🎯">
                    <div className="space-y-2">
                      <MetricRow label="Target Price" value={deepDive.analyst?.targetPrice ? `$${deepDive.analyst.targetPrice.toFixed(2)}` : "N/A"} highlight />
                      <MetricRow label="Rating" value={deepDive.analyst?.rating || "N/A"} />
                      <MetricRow label="Provider" value={deepDive.analyst?.provider || "N/A"} />
                      {deepDive.shortTermOutlook && (
                        <>
                          <div className="mt-3 pt-2 border-t border-[#1a1a1a]">
                            <span className="text-[9px] font-mono text-[#D4AF37]">TECHNICAL OUTLOOK</span>
                          </div>
                          <MetricRow
                            label="Short Term"
                            value={`${deepDive.shortTermOutlook.direction} (${deepDive.shortTermOutlook.scoreDescription})`}
                            color={deepDive.shortTermOutlook.direction === "Bullish" ? "text-green-400" : deepDive.shortTermOutlook.direction === "Bearish" ? "text-red-400" : "text-yellow-400"}
                          />
                        </>
                      )}
                      {deepDive.intermediateTermOutlook && (
                        <MetricRow
                          label="Intermediate"
                          value={`${deepDive.intermediateTermOutlook.direction} (${deepDive.intermediateTermOutlook.scoreDescription})`}
                          color={deepDive.intermediateTermOutlook.direction === "Bullish" ? "text-green-400" : deepDive.intermediateTermOutlook.direction === "Bearish" ? "text-red-400" : "text-yellow-400"}
                        />
                      )}
                      {deepDive.longTermOutlook && (
                        <MetricRow
                          label="Long Term"
                          value={`${deepDive.longTermOutlook.direction} (${deepDive.longTermOutlook.scoreDescription})`}
                          color={deepDive.longTermOutlook.direction === "Bullish" ? "text-green-400" : deepDive.longTermOutlook.direction === "Bearish" ? "text-red-400" : "text-yellow-400"}
                        />
                      )}
                      {deepDive.keyTechnicals && (
                        <>
                          <MetricRow label="Support" value={`$${deepDive.keyTechnicals.support.toFixed(2)}`} />
                          <MetricRow label="Resistance" value={`$${deepDive.keyTechnicals.resistance.toFixed(2)}`} />
                          <MetricRow label="Stop Loss" value={`$${deepDive.keyTechnicals.stopLoss.toFixed(2)}`} color="text-red-400" />
                        </>
                      )}
                    </div>
                  </Panel>

                  {/* Valuation */}
                  <Panel title="VALUATION" icon="💰">
                    <div className="space-y-2">
                      <MetricRow label="P/E Ratio" value={deepDive.valuation?.peRatio != null ? deepDive.valuation.peRatio.toFixed(1) : "N/A"} />
                      <MetricRow label="Forward P/E" value={deepDive.valuation?.forwardPE != null ? deepDive.valuation.forwardPE.toFixed(1) : "N/A"} />
                      <MetricRow label="PEG Ratio" value={deepDive.valuation?.pegRatio != null ? deepDive.valuation.pegRatio.toFixed(2) : "N/A"} />
                      <MetricRow label="Historical Avg P/E" value={deepDive.valuation?.historicalAvgPE?.toFixed(1) || "N/A"} />
                      <MetricRow
                        label="Discount vs Historical"
                        value={deepDive.valuation?.discountVsHistorical != null ? formatPct(deepDive.valuation.discountVsHistorical) : "N/A"}
                        highlight={deepDive.valuation?.discountVsHistorical != null && deepDive.valuation.discountVsHistorical < -10}
                      />
                      <MetricRow label="Free Cash Flow" value={deepDive.valuation?.freeCashFlow || "N/A"} />
                      <MetricRow label="Revenue Growth" value={deepDive.valuation?.revenueGrowth || "N/A"} />
                      <MetricRow label="Verdict" value={deepDive.valuation?.valuationVerdict || "N/A"} highlight />
                      {deepDive.valuationInsight && (
                        <div className="mt-2 p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
                          <p className="text-[10px] font-mono text-[#aaa] leading-relaxed">{deepDive.valuationInsight.description}</p>
                        </div>
                      )}
                    </div>
                  </Panel>

                  {/* Dividends */}
                  <Panel title="DIVIDENDS" icon="💵">
                    <div className="space-y-2">
                      <MetricRow label="Annual Yield" value={deepDive.dividends?.annualYield != null ? `${deepDive.dividends.annualYield.toFixed(2)}%` : "No dividend"} highlight={!!deepDive.dividends?.annualYield} />
                      <MetricRow label="Annual Dividend" value={deepDive.dividends?.annualDividend != null ? `$${deepDive.dividends.annualDividend.toFixed(2)}` : "N/A"} />
                      <MetricRow label="Frequency" value={deepDive.dividends?.payoutFrequency || "N/A"} />
                      <MetricRow label="Next Ex-Dividend" value={deepDive.dividends?.nextExDividendEstimate || "N/A"} />
                      {deepDive.dividends?.recentDividends?.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[9px] font-mono text-[#D4AF37]">RECENT DIVIDENDS</span>
                          <div className="mt-1 space-y-1">
                            {deepDive.dividends.recentDividends.slice(0, 4).map((d: any, i: number) => (
                              <div key={i} className="flex justify-between text-[10px] font-mono">
                                <span className="text-[#666]">{d.date}</span>
                                <span className="text-green-400">${d.amount.toFixed(4)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>

                  {/* Stock Splits */}
                  <Panel title="STOCK SPLITS" icon="✂️">
                    {deepDive.splits?.hasSplitHistory ? (
                      <div className="space-y-2">
                        {deepDive.splits.splits.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-[#111] rounded">
                            <span className="text-[10px] font-mono text-[#888]">{s.date}</span>
                            <span className="text-xs font-mono text-[#D4AF37] font-bold">{s.ratio}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-[#555]">No stock split history in the last 10 years.</p>
                    )}
                  </Panel>

                  {/* Significant Developments */}
                  {deepDive.sigDevs?.length > 0 && (
                    <Panel title="SIGNIFICANT DEVELOPMENTS" icon="📰" className="lg:col-span-2">
                      <div className="space-y-2">
                        {deepDive.sigDevs.slice(0, 5).map((d: any, i: number) => (
                          <div key={i} className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono text-[#ccc]">{d.headline}</span>
                              <span className="text-[10px] font-mono text-[#555] shrink-0 ml-3">{d.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  )}
                </div>
              )}

              {/* SSL GRADE TAB */}
              {activeSubTab === "ssl" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {(["Daily", "Weekly", "Monthly"] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSSLTimeframe(tf)}
                        className={`px-3 py-1.5 rounded text-[10px] font-mono transition-all ${
                          sslTimeframe === tf
                            ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]"
                            : "bg-[#111] border border-[#222] text-[#666] hover:text-[#999]"
                        }`}
                      >
                        {tf.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {sslLoading ? (
                    <Panel title="SSL GRADE"><LoadingPulse /></Panel>
                  ) : sslGrade ? (
                    <SSLGradeCard grade={sslGrade} />
                  ) : (
                    <Panel title="SSL GRADE">
                      <p className="text-xs font-mono text-[#555]">
                        No SSL grade available for {symbol} on {sslTimeframe} timeframe. Stock may not be in the screener universe.
                      </p>
                    </Panel>
                  )}
                </div>
              )}

              {/* SECTOR ROTATION TAB */}
              {activeSubTab === "sectors" && (
                <SectorRotationPanel />
              )}

              {/* INSIDERS & FILINGS TAB */}
              {activeSubTab === "insiders" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Insider Activity */}
                  <Panel title="INSIDER HOLDINGS" icon="👤">
                    {deepDive.insiders?.length > 0 ? (
                      <div className="space-y-2">
                        {deepDive.insiders.map((ins: any, i: number) => (
                          <div key={i} className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono text-[#ccc] font-medium">{ins.name}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                ins.transactionType?.toLowerCase().includes("buy") ? "bg-green-500/15 text-green-400" :
                                ins.transactionType?.toLowerCase().includes("sell") ? "bg-red-500/15 text-red-400" :
                                "bg-[#222] text-[#888]"
                              }`}>
                                {ins.transactionType || "HOLD"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono text-[#666]">{ins.relation}</span>
                              <span className="text-[10px] font-mono text-[#888]">{ins.sharesHeld} shares</span>
                              <span className="text-[10px] font-mono text-[#555]">{ins.latestDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-[#555]">No insider data available.</p>
                    )}
                  </Panel>

                  {/* SEC Filings */}
                  <Panel title="SEC FILINGS" icon="📋">
                    {deepDive.secFilings?.length > 0 ? (
                      <div className="space-y-2">
                        {deepDive.secFilings.slice(0, 8).map((f: any, i: number) => (
                          <div key={i} className="p-2.5 bg-[#111] rounded border border-[#1a1a1a]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono text-[#D4AF37] font-bold">{f.type}</span>
                              <span className="text-[10px] font-mono text-[#555]">{f.filingDate}</span>
                            </div>
                            <p className="text-[10px] font-mono text-[#888] leading-relaxed">{f.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-[#555]">No SEC filings available.</p>
                    )}
                  </Panel>

                  {/* Company Metrics vs Sector */}
                  {deepDive.companyMetrics && deepDive.sectorMetrics && (
                    <Panel title="COMPANY vs SECTOR METRICS" icon="📊" className="lg:col-span-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(deepDive.companyMetrics).map(([key, val]: [string, any]) => {
                          const sectorVal = (deepDive.sectorMetrics as any)?.[key] || 0;
                          const diff = val - sectorVal;
                          return (
                            <div key={key} className="p-3 bg-[#111] rounded border border-[#1a1a1a]">
                              <div className="text-[9px] font-mono text-[#666] uppercase mb-2">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-mono text-[#ccc]">{(val * 100).toFixed(0)}%</div>
                                  <div className="text-[9px] font-mono text-[#555]">Company</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-mono text-[#888]">{(sectorVal * 100).toFixed(0)}%</div>
                                  <div className="text-[9px] font-mono text-[#555]">Sector</div>
                                </div>
                              </div>
                              <div className={`text-[10px] font-mono mt-1 ${diff > 0 ? "text-green-400" : diff < 0 ? "text-red-400" : "text-[#666]"}`}>
                                {diff > 0 ? "▲" : diff < 0 ? "▼" : "="} {Math.abs(diff * 100).toFixed(0)}% vs sector
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Panel>
                  )}
                </div>
              )}

              {/* AI RESEARCH TAB */}
              {activeSubTab === "research" && (
                <div className="space-y-4">
                  {deepDive.aiResearch ? (
                    <>
                      <Panel title="EXECUTIVE SUMMARY" icon="◆">
                        <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.executiveSummary}</p>
                      </Panel>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Panel title="COMPETITIVE POSITION" icon="🏆">
                          <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.competitivePosition}</p>
                        </Panel>
                        <Panel title="REVENUE DRIVERS" icon="📈">
                          <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.revenueDrivers}</p>
                        </Panel>
                        <Panel title="MARGIN ANALYSIS" icon="📊">
                          <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.marginAnalysis}</p>
                        </Panel>
                        <Panel title="GROWTH CATALYSTS" icon="🚀">
                          <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.growthCatalysts}</p>
                        </Panel>
                        <Panel title="RISK FACTORS" icon="⚠️">
                          <p className="text-xs font-mono text-[#ccc] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.riskFactors}</p>
                        </Panel>
                        <Panel title="TF VERDICT" icon="◆">
                          <p className="text-xs font-mono text-[#D4AF37] leading-relaxed whitespace-pre-wrap">{deepDive.aiResearch.tfVerdict}</p>
                        </Panel>
                      </div>
                    </>
                  ) : aiLoading ? (
                    <Panel title="AI RESEARCH" icon="◆">
                      <div className="flex items-center gap-3 py-4">
                        <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-mono text-[#D4AF37] animate-pulse">GENERATING AI RESEARCH ANALYSIS...</p>
                      </div>
                      <div className="space-y-3 mt-3">
                        {["Executive Summary", "Competitive Position", "Revenue Drivers", "Growth Catalysts"].map(s => (
                          <div key={s} className="space-y-2">
                            <div className="h-3 w-32 bg-[#111] rounded animate-pulse" />
                            <div className="h-2 w-full bg-[#111] rounded animate-pulse" />
                            <div className="h-2 w-3/4 bg-[#111] rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    </Panel>
                  ) : (
                    <Panel title="AI RESEARCH">
                      <p className="text-xs font-mono text-[#555]">AI research not available for this stock. Try a stock in the TF universe.</p>
                    </Panel>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
