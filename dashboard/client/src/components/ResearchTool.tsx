import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

function formatCurrency(n: number): string {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(1)}T`;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

function MetricRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#111]">
      <span className="text-[10px] font-mono text-[#666]">{label}</span>
      <span className={`text-xs font-mono ${highlight ? "text-[#D4AF37] font-bold" : "text-[#ccc]"}`}>{value}</span>
    </div>
  );
}

function ResearchSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-3 bg-[#111] rounded border border-[#1a1a1a]">
      <div className="text-[10px] font-mono text-[#D4AF37] mb-1.5 tracking-wider">{title}</div>
      <p className="text-xs text-[#ccc] leading-relaxed">{content}</p>
    </div>
  );
}

function StockCard({ data }: { data: any }) {
  if (!data || data.error) {
    return (
      <div className="bg-[#0a0a0a] border border-red-500/20 rounded-lg p-6 text-center">
        <div className="text-red-400 text-sm font-mono">{data?.error || "ERROR"}</div>
      </div>
    );
  }

  // Backend returns StockQuote shape: { currentPrice, previousClose, dayHigh, dayLow, volume, avgVolume, fiftyTwoWeekHigh, fiftyTwoWeekLow, marketCap }
  // Backend returns TechnicalLevels shape: { monthly20MA, upperBB, lowerBB, distToMA20Pct, distToLowerBBPct, touchingMA20, touchingLowerBB, allTimeHigh, drawdownPct }
  const q = data.quote;
  const t = data.technicals;
  const r = data.research;
  const p = data.projections;

  // Calculate change percent from quote data
  const changePercent = q?.previousClose && q?.currentPrice
    ? ((q.currentPrice - q.previousClose) / q.previousClose) * 100
    : 0;

  return (
    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#222] bg-[#050505]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-bold text-[#D4AF37]">{data.symbol}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xl font-mono text-[#E8E0D0]">${q?.currentPrice?.toFixed(2)}</span>
              <span className={`text-xs font-mono ${changePercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatPct(changePercent)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-0">
        <MetricRow label="MARKET CAP" value={q?.marketCap ? formatCurrency(q.marketCap) : "N/A"} />
        <MetricRow label="52W HIGH" value={q?.fiftyTwoWeekHigh ? `$${q.fiftyTwoWeekHigh.toFixed(2)}` : "N/A"} />
        <MetricRow label="52W LOW" value={q?.fiftyTwoWeekLow ? `$${q.fiftyTwoWeekLow.toFixed(2)}` : "N/A"} />
        <MetricRow label="VOLUME" value={q?.volume ? formatCurrency(q.volume).replace("$", "") : "N/A"} />
        {t && (
          <>
            <MetricRow label="MONTHLY 20 MA" value={t.monthly20MA ? `$${t.monthly20MA.toFixed(2)}` : "N/A"} highlight />
            <MetricRow label="LOWER BB" value={t.lowerBB ? `$${t.lowerBB.toFixed(2)}` : "N/A"} />
            <MetricRow label="DRAWDOWN FROM ATH" value={t.drawdownPct != null ? formatPct(-t.drawdownPct) : "N/A"} />
            <MetricRow label="DIST TO 20 MA" value={t.distToMA20Pct != null ? formatPct(t.distToMA20Pct) : "N/A"} />
          </>
        )}
      </div>

      {/* Research */}
      {r && (
        <div className="p-4 space-y-2 border-t border-[#222]">
          <div className="text-xs font-mono text-[#D4AF37] tracking-wider mb-2">AI RESEARCH ANALYSIS</div>
          <ResearchSection title="OVERVIEW" content={r.overview} />
          <ResearchSection title="COMPETITIVE EDGE" content={r.competitiveEdge} />
          <ResearchSection title="GROWTH DRIVERS" content={r.growthDrivers} />
          <ResearchSection title="RISKS" content={r.risks} />
          <div className="p-3 bg-[#D4AF37]/5 rounded border border-[#D4AF37]/20">
            <div className="text-[10px] font-mono text-[#D4AF37] mb-1 tracking-wider">VERDICT</div>
            <p className="text-xs text-[#D4AF37] leading-relaxed font-medium">{r.verdict}</p>
          </div>
        </div>
      )}

      {/* Projections */}
      {p && p.projections && (
        <div className="p-4 border-t border-[#222]">
          <div className="text-xs font-mono text-[#D4AF37] tracking-wider mb-3">PROJECTED PRICE (5-20 YEARS)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-[#222]">
                  <th className="text-left py-1.5 font-mono text-[#666] font-normal">HORIZON</th>
                  <th className="text-right py-1.5 font-mono text-[#888] font-normal">CONSERVATIVE</th>
                  <th className="text-right py-1.5 font-mono text-[#D4AF37] font-normal">BASE CASE</th>
                  <th className="text-right py-1.5 font-mono text-green-400 font-normal">BULL CASE</th>
                </tr>
              </thead>
              <tbody>
                {p.projections.map((proj: any) => (
                  <tr key={proj.year} className="border-b border-[#111]">
                    <td className="py-1.5 font-mono text-[#ccc]">{proj.year}yr</td>
                    <td className="py-1.5 text-right font-mono text-[#888]">${proj.conservative?.toFixed(0)}</td>
                    <td className="py-1.5 text-right font-mono text-[#D4AF37]">${proj.baseCase?.toFixed(0)}</td>
                    <td className="py-1.5 text-right font-mono text-green-400">${proj.bullCase?.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="px-4 py-2 bg-[#050505] text-[10px] font-mono text-[#444]">
        Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "N/A"}
      </div>
    </div>
  );
}

export function ResearchTool({ onDeepDive }: { onDeepDive?: (symbol: string) => void } = {}) {
  const [mode, setMode] = useState<"search" | "compare">("search");
  const [searchTicker, setSearchTicker] = useState("");
  const [submittedTicker, setSubmittedTicker] = useState("");
  const [tickerA, setTickerA] = useState("");
  const [tickerB, setTickerB] = useState("");
  const [submittedA, setSubmittedA] = useState("");
  const [submittedB, setSubmittedB] = useState("");

  const { data: researchData, isLoading: researchLoading } = trpc.market.researchStock.useQuery(
    { symbol: submittedTicker },
    { enabled: !!submittedTicker, refetchInterval: 3 * 60 * 60 * 1000 }
  );

  const { data: compareData, isLoading: compareLoading } = trpc.market.compareStocks.useQuery(
    { symbolA: submittedA, symbolB: submittedB },
    { enabled: !!submittedA && !!submittedB, refetchInterval: 3 * 60 * 60 * 1000 }
  );

  const handleSearch = () => {
    if (searchTicker.trim()) setSubmittedTicker(searchTicker.trim().toUpperCase());
  };

  const handleCompare = () => {
    if (tickerA.trim() && tickerB.trim()) {
      setSubmittedA(tickerA.trim().toUpperCase());
      setSubmittedB(tickerB.trim().toUpperCase());
    }
  };

  const popularTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "SPY", "QQQ", "AMD", "NFLX", "DIS"];

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-gradient-to-r from-[#0a0a0a] to-[#111] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] font-['Playfair_Display'] relative z-10">
          Research Terminal
        </h1>
        <p className="text-sm text-[#888] mt-2 max-w-2xl relative z-10">
          Deep-dive into any stock with AI-powered analysis. Compare head-to-head to find the better buy.
          Real-time data, competitive edge analysis, and long-term projections.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded text-xs text-[#D4AF37] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          REAL-TIME DATA — REFRESHES EVERY 3 HOURS
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-0 bg-[#0a0a0a] border border-[#222] rounded-lg p-1 w-fit">
        <button
          onClick={() => setMode("search")}
          className={`px-4 py-2 rounded text-xs font-mono transition-all ${
            mode === "search" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#666] hover:text-[#999]"
          }`}
        >
          STOCK SEARCH
        </button>
        <button
          onClick={() => setMode("compare")}
          className={`px-4 py-2 rounded text-xs font-mono transition-all ${
            mode === "compare" ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#666] hover:text-[#999]"
          }`}
        >
          HEAD-TO-HEAD
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "search" ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTicker}
                    onChange={e => setSearchTicker(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                    placeholder="Enter ticker symbol (e.g., MSFT)"
                    className="w-full bg-[#111] border border-[#333] rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] placeholder-[#555] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs rounded hover:bg-[#E8C547] transition-all tracking-wider"
                >
                  ANALYZE
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {popularTickers.map(t => (
                  <button
                    key={t}
                    onClick={() => { setSearchTicker(t); setSubmittedTicker(t); }}
                    className="px-2 py-1 bg-[#111] border border-[#222] rounded text-[10px] font-mono text-[#888] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {researchLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-mono text-[#666]">ANALYZING {submittedTicker}...</div>
                  <div className="text-[10px] font-mono text-[#444]">AI is researching fundamentals, competitive edge, and growth drivers</div>
                </div>
              </div>
            )}

            {researchData && !researchLoading && <StockCard data={researchData} />}
          </motion.div>
        ) : (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Compare Input */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={tickerA}
                  onChange={e => setTickerA(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleCompare()}
                  placeholder="TICKER A (e.g., MSFT)"
                  className="w-full sm:flex-1 bg-[#111] border border-[#333] rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] placeholder-[#555] focus:border-[#D4AF37] focus:outline-none"
                />
                <span className="text-sm font-mono text-[#D4AF37] font-bold">VS</span>
                <input
                  type="text"
                  value={tickerB}
                  onChange={e => setTickerB(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleCompare()}
                  placeholder="TICKER B (e.g., NVDA)"
                  className="w-full sm:flex-1 bg-[#111] border border-[#333] rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] placeholder-[#555] focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  onClick={handleCompare}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-black font-mono font-bold text-xs rounded hover:bg-[#E8C547] transition-all tracking-wider"
                >
                  COMPARE
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[["MSFT", "GOOGL"], ["META", "NVDA"], ["AAPL", "AMZN"], ["SPY", "QQQ"], ["TSLA", "NVDA"]].map(([a, b]) => (
                  <button
                    key={`${a}-${b}`}
                    onClick={() => { setTickerA(a); setTickerB(b); setSubmittedA(a); setSubmittedB(b); }}
                    className="px-2 py-1 bg-[#111] border border-[#222] rounded text-[10px] font-mono text-[#888] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                  >
                    {a} vs {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Compare Results */}
            {compareLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-mono text-[#666]">COMPARING {submittedA} vs {submittedB}...</div>
                  <div className="text-[10px] font-mono text-[#444]">AI is analyzing competitive edges, valuations, and growth potential</div>
                </div>
              </div>
            )}

            {compareData && !compareLoading && !("error" in compareData) && (
              <div className="space-y-6">
                {/* Side by Side Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <StockCard data={compareData.stockA ? {
                    symbol: compareData.stockA.symbol,
                    quote: compareData.stockA.quote,
                    technicals: compareData.stockA.technicals,
                    projections: compareData.stockA.projections,
                    research: null,
                    lastUpdated: compareData.lastUpdated,
                  } : null} />
                  <StockCard data={compareData.stockB ? {
                    symbol: compareData.stockB.symbol,
                    quote: compareData.stockB.quote,
                    technicals: compareData.stockB.technicals,
                    projections: compareData.stockB.projections,
                    research: null,
                    lastUpdated: compareData.lastUpdated,
                  } : null} />
                </div>

                {/* AI Comparison Verdict */}
                {compareData.comparison && (
                  <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-sm font-mono text-[#D4AF37] tracking-wider">AI HEAD-TO-HEAD ANALYSIS</div>
                      <span className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] font-mono text-[#D4AF37]">
                        WINNER: {compareData.comparison.winner}
                      </span>
                    </div>
                    <ResearchSection title={`${submittedA} COMPETITIVE EDGE`} content={compareData.comparison.competitiveEdgeA} />
                    <ResearchSection title={`${submittedB} COMPETITIVE EDGE`} content={compareData.comparison.competitiveEdgeB} />
                    <ResearchSection title="GROWTH COMPARISON" content={compareData.comparison.growthComparison} />
                    <ResearchSection title="VALUATION COMPARISON" content={compareData.comparison.valuationComparison} />
                    <div className="p-4 bg-[#D4AF37]/5 rounded border border-[#D4AF37]/20">
                      <div className="text-[10px] font-mono text-[#D4AF37] mb-1.5 tracking-wider">FINAL VERDICT</div>
                      <p className="text-sm text-[#D4AF37] leading-relaxed font-medium">{compareData.comparison.verdict}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {compareData && "error" in compareData && (
              <div className="bg-[#0a0a0a] border border-red-500/20 rounded-lg p-6 text-center">
                <div className="text-red-400 text-sm font-mono">{compareData.error as string}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
