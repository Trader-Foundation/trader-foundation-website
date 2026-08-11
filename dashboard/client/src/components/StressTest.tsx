// ============================================================
// PORTFOLIO STRESS TEST — Crash Scenario Modeling
// 2008, 2020, Dot-Com, Custom, Monte Carlo simulations
// ============================================================

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

type Scenario = "2008_financial_crisis" | "2020_covid" | "2000_dotcom" | "custom" | "monte_carlo";

interface Holding {
  symbol: string;
  shares: number;
  avgCost?: number;
}

const SCENARIOS: { id: Scenario; label: string; shortLabel: string; year: string; description: string; icon: string; color: string }[] = [
  { id: "2008_financial_crisis", label: "2008 Financial Crisis", shortLabel: "2008", year: "2008", description: "Lehman Brothers collapse, housing bubble burst. S&P 500 dropped 57%.", icon: "🏦", color: "text-red-400" },
  { id: "2020_covid", label: "2020 COVID Crash", shortLabel: "COVID", year: "2020", description: "Fastest 30% drop in history. Recovery in 5 months.", icon: "🦠", color: "text-yellow-400" },
  { id: "2000_dotcom", label: "2000 Dot-Com Bubble", shortLabel: "DOT-COM", year: "2000", description: "Tech stocks collapsed 78%. NASDAQ took 15 years to recover.", icon: "💻", color: "text-purple-400" },
  { id: "custom", label: "Custom Drawdown", shortLabel: "CUSTOM", year: "—", description: "Model any drawdown percentage across your portfolio.", icon: "⚙️", color: "text-blue-400" },
  { id: "monte_carlo", label: "Monte Carlo Simulation", shortLabel: "MONTE CARLO", year: "SIM", description: "Random sector-weighted drawdowns based on historical volatility.", icon: "🎲", color: "text-green-400" },
];

const PRESET_PORTFOLIOS: { label: string; holdings: Holding[] }[] = [
  {
    label: "Mag 7 Equal Weight",
    holdings: [
      { symbol: "AAPL", shares: 10 }, { symbol: "MSFT", shares: 8 },
      { symbol: "GOOGL", shares: 15 }, { symbol: "AMZN", shares: 12 },
      { symbol: "META", shares: 10 }, { symbol: "NVDA", shares: 8 },
      { symbol: "TSLA", shares: 15 },
    ],
  },
  {
    label: "ETF Core",
    holdings: [
      { symbol: "SPY", shares: 20 }, { symbol: "QQQ", shares: 15 },
      { symbol: "IWM", shares: 25 }, { symbol: "DIA", shares: 10 },
    ],
  },
  {
    label: "Growth + Safety",
    holdings: [
      { symbol: "NVDA", shares: 10 }, { symbol: "MSFT", shares: 10 },
      { symbol: "GOOGL", shares: 15 }, { symbol: "SPY", shares: 20 },
      { symbol: "QQQ", shares: 15 },
    ],
  },
];

export function StressTest() {
  const [holdings, setHoldings] = useState<Holding[]>(PRESET_PORTFOLIOS[0].holdings);
  const [scenario, setScenario] = useState<Scenario>("2008_financial_crisis");
  const [customDrawdown, setCustomDrawdown] = useState(-30);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const stressTestMutation = trpc.market.stressTest.useMutation();

  const runStressTest = () => {
    setHasRun(true);
    stressTestMutation.mutate({
      holdings: holdings.map(h => ({ symbol: h.symbol, shares: h.shares, avgCost: h.avgCost })),
      scenario,
      customDrawdown: scenario === "custom" ? customDrawdown : undefined,
    });
  };

  const addHolding = () => {
    if (!newSymbol.trim() || !newShares.trim()) return;
    const shares = parseFloat(newShares);
    if (isNaN(shares) || shares <= 0) return;
    setHoldings(prev => [...prev, { symbol: newSymbol.toUpperCase().trim(), shares }]);
    setNewSymbol("");
    setNewShares("");
    setShowAddForm(false);
  };

  const removeHolding = (idx: number) => {
    setHoldings(prev => prev.filter((_, i) => i !== idx));
  };

  const loadPreset = (preset: typeof PRESET_PORTFOLIOS[0]) => {
    setHoldings(preset.holdings);
    setHasRun(false);
  };

  const data = stressTestMutation.data;
  const selectedScenario = SCENARIOS.find(s => s.id === scenario)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-mono font-bold text-[#D4AF37] tracking-wider">PORTFOLIO STRESS TEST</h2>
          <p className="text-[11px] font-mono text-[#666] mt-1">Model historical crashes and custom scenarios against your holdings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Portfolio Input */}
        <div className="space-y-4">
          <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold">YOUR HOLDINGS</h3>
              <span className="text-[10px] font-mono text-[#555]">{holdings.length} POSITIONS</span>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRESET_PORTFOLIOS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => loadPreset(p)}
                  className="px-2 py-1 text-[9px] font-mono rounded border border-[#333] text-[#888] hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Holdings List */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {holdings.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 bg-[#111] rounded border border-[#1A1A1A] group">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">{h.symbol}</span>
                    <span className="text-[10px] font-mono text-[#666]">{h.shares} shares</span>
                  </div>
                  <button
                    onClick={() => removeHolding(i)}
                    className="text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Add Holding */}
            {showAddForm ? (
              <div className="mt-3 p-2 bg-[#111] rounded border border-[#D4AF37]/20 space-y-2">
                <div className="flex gap-2">
                  <input
                    value={newSymbol}
                    onChange={e => setNewSymbol(e.target.value)}
                    placeholder="TICKER"
                    className="flex-1 px-2 py-1.5 bg-[#0A0A0A] border border-[#333] rounded text-xs font-mono text-[#E8E0D0] placeholder-[#444] focus:border-[#D4AF37]/50 outline-none"
                  />
                  <input
                    value={newShares}
                    onChange={e => setNewShares(e.target.value)}
                    placeholder="SHARES"
                    type="number"
                    className="w-20 px-2 py-1.5 bg-[#0A0A0A] border border-[#333] rounded text-xs font-mono text-[#E8E0D0] placeholder-[#444] focus:border-[#D4AF37]/50 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addHolding} className="flex-1 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all">ADD</button>
                  <button onClick={() => setShowAddForm(false)} className="px-3 py-1.5 bg-[#111] border border-[#333] rounded text-[10px] font-mono text-[#666] hover:text-[#999] transition-all">CANCEL</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 w-full py-2 border border-dashed border-[#333] rounded text-[10px] font-mono text-[#555] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
              >
                + ADD HOLDING
              </button>
            )}
          </div>

          {/* Scenario Selection */}
          <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-4">
            <h3 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold mb-3">CRASH SCENARIO</h3>
            <div className="space-y-1.5">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded border transition-all ${
                    scenario === s.id
                      ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                      : "border-[#1A1A1A] hover:border-[#333]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.icon}</span>
                    <span className={`text-xs font-mono font-semibold ${scenario === s.id ? "text-[#D4AF37]" : "text-[#999]"}`}>
                      {s.shortLabel}
                    </span>
                    <span className="ml-auto text-[9px] font-mono text-[#555]">{s.year}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Drawdown Slider */}
            {scenario === "custom" && (
              <div className="mt-3 p-3 bg-[#111] rounded border border-[#333]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#666]">DRAWDOWN</span>
                  <span className="text-sm font-mono font-bold text-red-400">{customDrawdown}%</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="-5"
                  value={customDrawdown}
                  onChange={e => setCustomDrawdown(parseInt(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#444] mt-1">
                  <span>-80%</span><span>-5%</span>
                </div>
              </div>
            )}
          </div>

          {/* Run Button */}
          <button
            onClick={runStressTest}
            disabled={holdings.length === 0 || stressTestMutation.isPending}
            className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg font-mono text-sm text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wider font-semibold"
          >
            {stressTestMutation.isPending ? "RUNNING SIMULATION..." : "RUN STRESS TEST"}
          </button>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-4">
          {!hasRun && !stressTestMutation.isPending && (
            <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-sm font-mono font-bold text-[#D4AF37] mb-2">SELECT A SCENARIO & RUN</h3>
              <p className="text-[11px] font-mono text-[#666] max-w-md mx-auto leading-relaxed">
                Choose your holdings and a crash scenario to see how your portfolio would perform.
                This is where TF members build conviction — crashes are buying opportunities.
              </p>
            </div>
          )}

          {stressTestMutation.isPending && (
            <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-8 text-center">
              <div className="text-[#D4AF37] font-mono text-sm animate-pulse mb-2">SIMULATING CRASH SCENARIO...</div>
              <div className="w-48 h-1 bg-[#111] rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-[#D4AF37] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {stressTestMutation.isError && (
            <div className="bg-red-950/30 rounded-lg border border-red-500/30 p-4">
              <p className="text-xs font-mono text-red-400">Error running stress test. Please try again.</p>
            </div>
          )}

          {data && !stressTestMutation.isPending && (
            <AnimatePresence mode="wait">
              <motion.div
                key={data.scenario + data.lastUpdated}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-3">
                    <span className="text-[9px] font-mono text-[#555]">CURRENT VALUE</span>
                    <p className="text-lg font-mono font-bold text-[#E8E0D0]">${data.totalCurrentValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg border border-red-500/20 p-3">
                    <span className="text-[9px] font-mono text-[#555]">STRESSED VALUE</span>
                    <p className="text-lg font-mono font-bold text-red-400">${data.totalStressedValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg border border-red-500/20 p-3">
                    <span className="text-[9px] font-mono text-[#555]">TOTAL LOSS</span>
                    <p className="text-lg font-mono font-bold text-red-400">-${Math.abs(data.totalLoss).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-3">
                    <span className="text-[9px] font-mono text-[#555]">RECOVERY EST.</span>
                    <p className="text-lg font-mono font-bold text-[#D4AF37]">{data.recoveryEstimateMonths}mo</p>
                  </div>
                </div>

                {/* Scenario Info */}
                <div className={`p-4 rounded-lg border ${
                  data.totalDrawdownPct > -30 ? "bg-green-950/20 border-green-500/20" :
                  data.totalDrawdownPct > -50 ? "bg-yellow-950/20 border-yellow-500/20" :
                  "bg-red-950/20 border-red-500/20"
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{selectedScenario.icon}</span>
                    <div>
                      <h3 className="text-sm font-mono font-bold text-[#E8E0D0]">{data.scenarioName}</h3>
                      <p className="text-[10px] font-mono text-[#666]">{selectedScenario.description}</p>
                    </div>
                    <span className="ml-auto text-2xl font-mono font-bold text-red-400">{data.totalDrawdownPct.toFixed(1)}%</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#999] leading-relaxed mt-2">{data.insight}</p>
                </div>

                {/* Per-Holding Breakdown */}
                <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1A1A1A]">
                    <h3 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold">PER-HOLDING IMPACT</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1A1A1A]">
                          <th className="text-left px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">SYMBOL</th>
                          <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">CURRENT</th>
                          <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">DRAWDOWN</th>
                          <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">STRESSED</th>
                          <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">LOSS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.holdings.map((h: any, i: number) => (
                          <tr key={i} className="border-b border-[#0D0D0D] hover:bg-[#111] transition-colors">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-[#D4AF37]">{h.symbol}</span>
                                <span className="text-[9px] font-mono text-[#444]">{h.sector}</span>
                              </div>
                            </td>
                            <td className="text-right px-4 py-2.5">
                              <div>
                                <span className="text-xs font-mono text-[#CCC]">${h.currentPrice.toFixed(2)}</span>
                                <span className="block text-[9px] font-mono text-[#555]">${h.currentValue.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="text-right px-4 py-2.5">
                              <span className="text-xs font-mono font-bold text-red-400">{h.drawdownPct.toFixed(1)}%</span>
                            </td>
                            <td className="text-right px-4 py-2.5">
                              <div>
                                <span className="text-xs font-mono text-red-300">${h.stressedPrice.toFixed(2)}</span>
                                <span className="block text-[9px] font-mono text-[#555]">${h.stressedValue.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="text-right px-4 py-2.5">
                              <span className="text-xs font-mono font-bold text-red-400">-${Math.abs(h.loss).toLocaleString()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Drawdown Visualization */}
                <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-4">
                  <h3 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold mb-4">DRAWDOWN BY POSITION</h3>
                  <div className="space-y-2">
                    {data.holdings.map((h: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-[#999] w-12 text-right">{h.symbol}</span>
                        <div className="flex-1 h-4 bg-[#1A1A1A] rounded-full overflow-hidden relative">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.abs(h.drawdownPct)}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-red-400 w-12">{h.drawdownPct.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DCA Opportunity */}
                <div className="bg-[#0A0A0A] rounded-lg border border-green-500/20 p-4">
                  <h3 className="text-[11px] font-mono tracking-wider text-green-400 font-semibold mb-1">DCA OPPORTUNITY — BUY THE CRASH</h3>
                  <p className="text-[10px] font-mono text-[#555] mb-4">How many shares you could buy at stressed prices</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {data.dcaOpportunity.map((d: any, i: number) => (
                      <div key={i} className="bg-[#111] rounded border border-[#1A1A1A] p-3">
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">{d.symbol}</span>
                        <p className="text-[10px] font-mono text-[#666] mt-1">@ ${d.stressedPrice.toFixed(2)}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[9px] font-mono text-[#555]">$5K =</span>
                            <span className="text-[10px] font-mono text-green-400 font-bold">{d.sharesFor5K} shares</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[9px] font-mono text-[#555]">$10K =</span>
                            <span className="text-[10px] font-mono text-green-400 font-bold">{d.sharesFor10K} shares</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TF Philosophy */}
                <div className="bg-[#D4AF37]/5 rounded-lg border border-[#D4AF37]/20 p-4">
                  <p className="text-[11px] font-mono text-[#D4AF37] leading-relaxed text-center">
                    "The market rewards the patient and punishes the impatient. Every crash in history has been a buying opportunity.
                    Don't panic — deploy capital at deep discounts and let compounding do the work."
                  </p>
                  <p className="text-[9px] font-mono text-[#D4AF37]/50 text-center mt-2">— TRADER FOUNDATION PHILOSOPHY</p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
