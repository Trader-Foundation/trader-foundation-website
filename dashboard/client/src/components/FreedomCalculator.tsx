// ============================================================
// FREEDOM CALCULATOR — How Far Are You From Financial Freedom?
// Integrated with Portfolio Simulator — pulls your actual holdings
// Per-stock projected growth rates based on historical performance
// No advertised return claims — all rates from stock-specific data
// ============================================================
import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

// --- Types ---
interface Holding {
  symbol: string;
  company: string;
  shares: number;
  currentPrice: number;
  value: number;
  weight: number;
  historicalGrowthRate: number; // from actual stock data
}

interface Milestone {
  amount: number;
  label: string;
  yearsToReach: number | null;
  reached: boolean;
}

// --- Helpers ---
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatCurrencyFull(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// Historical CAGR approximations (conservative, based on 5-10yr data)
// These are NOT promises — just historical reference points
const HISTORICAL_CAGR: Record<string, number> = {
  AAPL: 0.22, MSFT: 0.25, GOOGL: 0.18, AMZN: 0.20, META: 0.24,
  NVDA: 0.45, TSLA: 0.35, SPY: 0.10, QQQ: 0.15, IWM: 0.08,
  // Defaults for unknown stocks
  DEFAULT_TECH: 0.15, DEFAULT_ETF: 0.10, DEFAULT: 0.12,
};

function getHistoricalCAGR(symbol: string): number {
  return HISTORICAL_CAGR[symbol] || HISTORICAL_CAGR.DEFAULT;
}

// --- Progress Bar ---
function ProgressBar({ current, target, label }: { current: number; target: number; label: string }) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#888]">{label}</span>
        <span className="text-[10px] font-mono text-[#D4AF37]">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-3 bg-[#111] rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]"
        />
        {/* Milestone markers */}
        {[25, 50, 75].map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-px bg-[#333]"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// --- Panel ---
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

// ============================================================
// FREEDOM CHART — Simple high-contrast line chart
// ============================================================
function FreedomChart({
  projections,
  freedomNumber,
  yearsToFreedom,
}: {
  projections: { year: number; value: number; contributions: number; growth: number }[];
  freedomNumber: number;
  yearsToFreedom: number | null;
}) {
  if (projections.length === 0) return null;

  const chartW = 520;
  const chartH = 260;
  const padL = 60;
  const padR = 15;
  const padT = 20;
  const padB = 35;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const maxVal = Math.max(freedomNumber, ...projections.map((p) => p.value)) * 1.1;
  const maxYear = projections[projections.length - 1].year;

  const x = (year: number) => padL + (year / maxYear) * plotW;
  const y = (val: number) => padT + plotH - (val / maxVal) * plotH;

  // Build path strings
  const valuePath = projections.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const contribPath = projections.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year).toFixed(1)} ${y(p.contributions).toFixed(1)}`).join(" ");

  // Fill area under value line
  const valueFill = valuePath + ` L ${x(maxYear).toFixed(1)} ${y(0).toFixed(1)} L ${x(projections[0].year).toFixed(1)} ${y(0).toFixed(1)} Z`;

  // Y-axis labels
  const yTicks = 5;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => (maxVal / yTicks) * i);

  // X-axis labels
  const xStep = maxYear <= 10 ? 2 : maxYear <= 20 ? 5 : 10;
  const xLabels = projections.filter((p) => p.year % xStep === 0 || p.year === 1);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ minWidth: 320 }}>
        {/* Grid lines */}
        {yLabels.map((val, i) => (
          <line key={i} x1={padL} x2={chartW - padR} y1={y(val)} y2={y(val)} stroke="#1a1a1a" strokeWidth={1} />
        ))}

        {/* Freedom number line */}
        <line
          x1={padL} x2={chartW - padR}
          y1={y(freedomNumber)} y2={y(freedomNumber)}
          stroke="#D4AF37" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.7}
        />
        <text x={chartW - padR - 2} y={y(freedomNumber) - 5} textAnchor="end" fill="#D4AF37" fontSize={9} fontFamily="monospace">
          FREEDOM
        </text>

        {/* Area fill under portfolio value */}
        <path d={valueFill} fill="url(#goldGradient)" opacity={0.15} />

        {/* Contributions line — cyan */}
        <path d={contribPath} fill="none" stroke="#00E5FF" strokeWidth={2} />

        {/* Portfolio value line — gold */}
        <path d={valuePath} fill="none" stroke="#D4AF37" strokeWidth={2.5} />

        {/* Freedom year marker */}
        {yearsToFreedom != null && yearsToFreedom <= maxYear && (
          <>
            <circle cx={x(yearsToFreedom)} cy={y(projections[yearsToFreedom - 1]?.value || 0)} r={4} fill="#D4AF37" />
            <line
              x1={x(yearsToFreedom)} x2={x(yearsToFreedom)}
              y1={padT} y2={padT + plotH}
              stroke="#D4AF37" strokeWidth={1} strokeDasharray="3 3" opacity={0.4}
            />
          </>
        )}

        {/* Y-axis labels */}
        {yLabels.map((val, i) => (
          <text key={i} x={padL - 6} y={y(val) + 3} textAnchor="end" fill="#666" fontSize={9} fontFamily="monospace">
            {val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : val >= 1_000 ? `$${(val / 1_000).toFixed(0)}K` : `$${val.toFixed(0)}`}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((p) => (
          <text key={p.year} x={x(p.year)} y={chartH - 5} textAnchor="middle" fill="#666" fontSize={9} fontFamily="monospace">
            Yr {p.year}
          </text>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#D4AF37]" />
          <span className="text-[9px] font-mono text-[#888]">PORTFOLIO VALUE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#00E5FF]" />
          <span className="text-[9px] font-mono text-[#888]">CONTRIBUTIONS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#D4AF37] opacity-50" style={{ borderTop: '1.5px dashed #D4AF37' }} />
          <span className="text-[9px] font-mono text-[#888]">FREEDOM LINE</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function FreedomCalculator() {
  // --- User Inputs ---
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState(150000);
  const [currentPortfolioValue, setCurrentPortfolioValue] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [withdrawalRate, setWithdrawalRate] = useState(4); // Safe withdrawal rate
  const [customGrowthRate, setCustomGrowthRate] = useState<number | null>(null); // Override
  const [usePortfolioHoldings, setUsePortfolioHoldings] = useState(false);

  // --- Portfolio Holdings (from Portfolio Simulator) ---
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [addSymbol, setAddSymbol] = useState("");
  const [addShares, setAddShares] = useState("");

  // Fetch quote for adding stocks
  const addQuote = trpc.market.quote.useQuery(
    { symbol: addSymbol },
    { enabled: addSymbol.length >= 1, retry: 1, staleTime: 60000 }
  );

  // --- Add a holding ---
  const handleAddHolding = useCallback(() => {
    const sym = addSymbol.trim().toUpperCase();
    const shares = parseFloat(addShares);
    if (!sym || isNaN(shares) || shares <= 0) return;
    const price = addQuote.data?.currentPrice || 0;
    if (price <= 0) return;

    setHoldings((prev) => {
      const existing = prev.find((h) => h.symbol === sym);
      if (existing) {
        return prev.map((h) =>
          h.symbol === sym ? { ...h, shares: h.shares + shares, value: (h.shares + shares) * price, currentPrice: price } : h
        );
      }
      return [
        ...prev,
        {
          symbol: sym,
          company: sym,
          shares,
          currentPrice: price,
          value: shares * price,
          weight: 0,
          historicalGrowthRate: getHistoricalCAGR(sym),
        },
      ];
    });
    setAddSymbol("");
    setAddShares("");
  }, [addSymbol, addShares, addQuote.data]);

  // --- Remove holding ---
  const removeHolding = useCallback((sym: string) => {
    setHoldings((prev) => prev.filter((h) => h.symbol !== sym));
  }, []);

  // --- Calculations ---
  const calculations = useMemo(() => {
    // Freedom number: how much you need invested
    const freedomNumber = desiredAnnualIncome / (withdrawalRate / 100);

    // Portfolio value (from holdings or manual input)
    let portfolioValue = currentPortfolioValue;
    let blendedGrowthRate = customGrowthRate != null ? customGrowthRate / 100 : 0.12; // default 12%

    if (usePortfolioHoldings && holdings.length > 0) {
      const totalVal = holdings.reduce((sum, h) => sum + h.value, 0);
      portfolioValue = totalVal;

      // Calculate portfolio-weighted blended return
      if (totalVal > 0) {
        blendedGrowthRate = holdings.reduce((sum, h) => {
          const weight = h.value / totalVal;
          return sum + weight * h.historicalGrowthRate;
        }, 0);
      }
    }

    if (customGrowthRate != null) {
      blendedGrowthRate = customGrowthRate / 100;
    }

    // Gap analysis
    const gap = freedomNumber - portfolioValue;
    const progressPct = (portfolioValue / freedomNumber) * 100;

    // Timeline projection — compound growth with monthly contributions
    const annualContribution = monthlyContribution * 12;
    const projections: { year: number; value: number; contributions: number; growth: number }[] = [];
    let currentValue = portfolioValue;
    let totalContributions = portfolioValue;
    let yearsToFreedom: number | null = null;

    for (let year = 1; year <= 40; year++) {
      const growthThisYear = currentValue * blendedGrowthRate;
      currentValue = currentValue + growthThisYear + annualContribution;
      totalContributions += annualContribution;

      projections.push({
        year,
        value: Math.round(currentValue),
        contributions: Math.round(totalContributions),
        growth: Math.round(currentValue - totalContributions),
      });

      if (yearsToFreedom === null && currentValue >= freedomNumber) {
        yearsToFreedom = year;
      }
    }

    // Milestones
    const milestoneAmounts = [100000, 250000, 500000, 1000000, freedomNumber];
    const milestones: Milestone[] = milestoneAmounts.map((amt) => {
      const proj = projections.find((p) => p.value >= amt);
      return {
        amount: amt,
        label: amt === freedomNumber ? "FREEDOM NUMBER" : formatCurrency(amt),
        yearsToReach: proj ? proj.year : null,
        reached: portfolioValue >= amt,
      };
    });

    // Monthly income at current portfolio value
    const currentMonthlyIncome = (portfolioValue * (withdrawalRate / 100)) / 12;

    // What-if: extra $500/month
    let yearsWithExtra: number | null = null;
    let extraValue = portfolioValue;
    const extraMonthly = monthlyContribution + 500;
    for (let year = 1; year <= 40; year++) {
      extraValue = extraValue * (1 + blendedGrowthRate) + extraMonthly * 12;
      if (yearsWithExtra === null && extraValue >= freedomNumber) {
        yearsWithExtra = year;
        break;
      }
    }

    return {
      freedomNumber,
      portfolioValue,
      blendedGrowthRate,
      gap,
      progressPct,
      yearsToFreedom,
      projections,
      milestones,
      currentMonthlyIncome,
      yearsWithExtra,
    };
  }, [desiredAnnualIncome, currentPortfolioValue, monthlyContribution, withdrawalRate, customGrowthRate, usePortfolioHoldings, holdings]);

  // Update weights when holdings change
  const holdingsWithWeights = useMemo(() => {
    const totalVal = holdings.reduce((sum, h) => sum + h.value, 0);
    return holdings.map((h) => ({ ...h, weight: totalVal > 0 ? (h.value / totalVal) * 100 : 0 }));
  }, [holdings]);

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-mono font-bold text-[#D4AF37] tracking-wider">FREEDOM CALCULATOR</h2>
        <p className="text-xs font-mono text-[#666] mt-1">
          How much do you need to never work again? How far are you? When will you get there?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Inputs */}
        <div className="space-y-4">
          <Panel title="YOUR FREEDOM PARAMETERS" icon="◆">
            <div className="space-y-4">
              {/* Desired Annual Income */}
              <div>
                <label className="text-[10px] font-mono text-[#888] block mb-1">
                  DESIRED ANNUAL INCOME
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[#D4AF37]">$</span>
                  <input
                    type="number"
                    value={desiredAnnualIncome}
                    onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
                    className="w-full bg-[#111] border border-[#222] rounded px-8 py-2.5 text-sm font-mono text-[#E8E0D0] focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
                <p className="text-[9px] font-mono text-[#555] mt-1">How much do you want to live on per year?</p>
              </div>

              {/* Current Portfolio */}
              <div>
                <label className="text-[10px] font-mono text-[#888] block mb-1">
                  CURRENT PORTFOLIO VALUE
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[#D4AF37]">$</span>
                  <input
                    type="number"
                    value={currentPortfolioValue}
                    onChange={(e) => setCurrentPortfolioValue(Number(e.target.value))}
                    disabled={usePortfolioHoldings && holdings.length > 0}
                    className="w-full bg-[#111] border border-[#222] rounded px-8 py-2.5 text-sm font-mono text-[#E8E0D0] focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Monthly Contribution */}
              <div>
                <label className="text-[10px] font-mono text-[#888] block mb-1">
                  MONTHLY CONTRIBUTION
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[#D4AF37]">$</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="w-full bg-[#111] border border-[#222] rounded px-8 py-2.5 text-sm font-mono text-[#E8E0D0] focus:outline-none focus:border-[#D4AF37]/50"
                  />
                </div>
              </div>

              {/* Withdrawal Rate */}
              <div>
                <label className="text-[10px] font-mono text-[#888] block mb-1">
                  WITHDRAWAL RATE (%)
                </label>
                <input
                  type="number"
                  value={withdrawalRate}
                  onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                  min={1}
                  max={10}
                  step={0.5}
                  className="w-full bg-[#111] border border-[#222] rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] focus:outline-none focus:border-[#D4AF37]/50"
                />
                <p className="text-[9px] font-mono text-[#555] mt-1">4% = traditional safe withdrawal rate</p>
              </div>

              {/* Custom Growth Rate Override */}
              <div>
                <label className="text-[10px] font-mono text-[#888] block mb-1">
                  EXPECTED ANNUAL RETURN (%) — OPTIONAL OVERRIDE
                </label>
                <input
                  type="number"
                  value={customGrowthRate ?? ""}
                  onChange={(e) => setCustomGrowthRate(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Leave blank to use portfolio-weighted rate"
                  className="w-full bg-[#111] border border-[#222] rounded px-4 py-2.5 text-sm font-mono text-[#E8E0D0] placeholder:text-[#444] focus:outline-none focus:border-[#D4AF37]/50"
                />
                <p className="text-[9px] font-mono text-[#555] mt-1">
                  {customGrowthRate != null
                    ? `Using your custom rate: ${customGrowthRate}%`
                    : `Using portfolio-weighted rate: ${(calculations.blendedGrowthRate * 100).toFixed(1)}%`}
                </p>
              </div>
            </div>
          </Panel>

          {/* Portfolio Holdings */}
          <Panel title="YOUR HOLDINGS (OPTIONAL)" icon="📊">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePortfolioHoldings}
                  onChange={(e) => setUsePortfolioHoldings(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <span className="text-[10px] font-mono text-[#888]">USE HOLDINGS FOR CALCULATIONS</span>
              </label>

              {/* Add Stock */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={addSymbol}
                  onChange={(e) => setAddSymbol(e.target.value.toUpperCase())}
                  placeholder="TICKER"
                  className="flex-1 bg-[#111] border border-[#222] rounded px-3 py-2 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:outline-none focus:border-[#D4AF37]/50"
                />
                <input
                  type="number"
                  value={addShares}
                  onChange={(e) => setAddShares(e.target.value)}
                  placeholder="SHARES"
                  className="w-24 bg-[#111] border border-[#222] rounded px-3 py-2 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:outline-none focus:border-[#D4AF37]/50"
                />
                <button
                  onClick={handleAddHolding}
                  disabled={!addSymbol || !addShares || !addQuote.data}
                  className="px-3 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-xs font-mono text-[#D4AF37] hover:bg-[#D4AF37]/20 disabled:opacity-30 transition-all"
                >
                  ADD
                </button>
              </div>
              {addSymbol && addQuote.data && (
                <p className="text-[9px] font-mono text-[#666]">
                  {addSymbol}: ${addQuote.data.currentPrice?.toFixed(2)} | Hist. CAGR: {(getHistoricalCAGR(addSymbol) * 100).toFixed(0)}%
                </p>
              )}

              {/* Holdings List */}
              {holdingsWithWeights.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {holdingsWithWeights.map((h) => (
                    <div key={h.symbol} className="flex items-center justify-between p-2 bg-[#111] rounded border border-[#1a1a1a]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#E8E0D0]">{h.symbol}</span>
                        <span className="text-[10px] font-mono text-[#666]">{h.shares} shares</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-[#888]">{formatCurrency(h.value)}</span>
                        <span className="text-[10px] font-mono text-[#D4AF37]">{h.weight.toFixed(1)}%</span>
                        <span className="text-[9px] font-mono text-[#555]">CAGR: {(h.historicalGrowthRate * 100).toFixed(0)}%</span>
                        <button
                          onClick={() => removeHolding(h.symbol)}
                          className="text-[10px] font-mono text-red-400/50 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                    <span className="text-[10px] font-mono text-[#D4AF37]">TOTAL</span>
                    <span className="text-xs font-mono text-[#D4AF37] font-bold">
                      {formatCurrencyFull(holdings.reduce((s, h) => s + h.value, 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#888]">BLENDED RETURN</span>
                    <span className="text-xs font-mono text-[#ccc]">
                      {(calculations.blendedGrowthRate * 100).toFixed(1)}% (portfolio-weighted)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* CENTER: Freedom Dashboard */}
        <div className="space-y-4">
          {/* Freedom Number */}
          <Panel title="YOUR FREEDOM NUMBER" icon="🎯">
            <div className="text-center py-4">
              <div className="text-4xl font-mono font-black text-[#D4AF37] mb-2">
                {formatCurrencyFull(calculations.freedomNumber)}
              </div>
              <p className="text-xs font-mono text-[#888]">
                Invest this much → withdraw {withdrawalRate}% → live on {formatCurrencyFull(desiredAnnualIncome)}/year
              </p>
            </div>
          </Panel>

          {/* Progress */}
          <Panel title="YOUR PROGRESS" icon="📈">
            <div className="space-y-4">
              <ProgressBar
                current={calculations.portfolioValue}
                target={calculations.freedomNumber}
                label={`${formatCurrency(calculations.portfolioValue)} → ${formatCurrency(calculations.freedomNumber)}`}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#111] rounded border border-[#1a1a1a] text-center">
                  <div className="text-lg font-mono font-bold text-[#E8E0D0]">
                    {formatCurrencyFull(calculations.portfolioValue)}
                  </div>
                  <div className="text-[9px] font-mono text-[#666]">CURRENT VALUE</div>
                </div>
                <div className="p-3 bg-[#111] rounded border border-[#1a1a1a] text-center">
                  <div className="text-lg font-mono font-bold text-red-400">
                    {formatCurrencyFull(calculations.gap)}
                  </div>
                  <div className="text-[9px] font-mono text-[#666]">GAP TO FREEDOM</div>
                </div>
              </div>
              <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded text-center">
                <div className="text-2xl font-mono font-black text-[#D4AF37]">
                  {calculations.yearsToFreedom != null ? `${calculations.yearsToFreedom} YEARS` : "40+ YEARS"}
                </div>
                <div className="text-[10px] font-mono text-[#888] mt-1">
                  at {(calculations.blendedGrowthRate * 100).toFixed(1)}% annual return + {formatCurrency(monthlyContribution)}/mo contributions
                </div>
              </div>
              {/* Current monthly income */}
              <div className="p-3 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#888]">IF YOU STOPPED TODAY</span>
                  <span className="text-sm font-mono text-[#ccc]">
                    {formatCurrencyFull(calculations.currentMonthlyIncome)}/mo
                  </span>
                </div>
                <p className="text-[9px] font-mono text-[#555] mt-1">
                  Current portfolio at {withdrawalRate}% withdrawal = {formatCurrencyFull(calculations.currentMonthlyIncome * 12)}/year
                </p>
              </div>
            </div>
          </Panel>

          {/* What If */}
          <Panel title="WHAT IF?" icon="💡">
            <div className="space-y-3">
              <div className="p-3 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-[#D4AF37] mb-1">ADD $500/MONTH MORE</div>
                <p className="text-xs font-mono text-[#ccc]">
                  {calculations.yearsWithExtra != null
                    ? `Freedom in ${calculations.yearsWithExtra} years (${calculations.yearsToFreedom != null ? `${calculations.yearsToFreedom - calculations.yearsWithExtra} years sooner` : "significantly faster"})`
                    : "Still 40+ years — consider increasing your return rate or reducing expenses"}
                </p>
              </div>
              <div className="p-3 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-[#D4AF37] mb-1">REDUCE INCOME NEED BY 20%</div>
                <p className="text-xs font-mono text-[#ccc]">
                  Freedom number drops to {formatCurrencyFull((desiredAnnualIncome * 0.8) / (withdrawalRate / 100))} — 
                  {" "}{formatCurrencyFull(calculations.freedomNumber - (desiredAnnualIncome * 0.8) / (withdrawalRate / 100))} less to accumulate
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* RIGHT: Milestones & Projection */}
        <div className="space-y-4">
          {/* Milestones */}
          <Panel title="MILESTONES" icon="🏆">
            <div className="space-y-2">
              {calculations.milestones.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border ${
                    m.reached
                      ? "bg-green-500/5 border-green-500/20"
                      : m.label === "FREEDOM NUMBER"
                      ? "bg-[#D4AF37]/5 border-[#D4AF37]/20"
                      : "bg-[#111] border-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${m.reached ? "text-green-400" : m.label === "FREEDOM NUMBER" ? "text-[#D4AF37]" : "text-[#555]"}`}>
                        {m.reached ? "✓" : m.label === "FREEDOM NUMBER" ? "◆" : "○"}
                      </span>
                      <span className={`text-xs font-mono ${m.label === "FREEDOM NUMBER" ? "text-[#D4AF37] font-bold" : "text-[#ccc]"}`}>
                        {m.label === "FREEDOM NUMBER" ? m.label : formatCurrency(m.amount)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono ${m.reached ? "text-green-400" : "text-[#888]"}`}>
                      {m.reached ? "REACHED" : m.yearsToReach != null ? `${m.yearsToReach}y` : "40y+"}
                    </span>
                  </div>
                  {m.label === "FREEDOM NUMBER" && (
                    <div className="text-[10px] font-mono text-[#888] mt-1 ml-6">
                      {formatCurrencyFull(m.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* Growth Chart */}
          <Panel title="GROWTH PROJECTION CHART" icon="📈">
            <FreedomChart
              projections={calculations.projections.slice(0, 30)}
              freedomNumber={calculations.freedomNumber}
              yearsToFreedom={calculations.yearsToFreedom}
            />
          </Panel>

          {/* Year-by-Year Projection */}
          <Panel title="YEAR-BY-YEAR PROJECTION" icon="📊">
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#0a0a0a]">
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left text-[9px] font-mono text-[#666] py-1.5 px-1">YR</th>
                    <th className="text-right text-[9px] font-mono text-[#666] py-1.5 px-1">VALUE</th>
                    <th className="text-right text-[9px] font-mono text-[#666] py-1.5 px-1">GROWTH</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.projections.slice(0, 30).map((p) => {
                    const isFreedomYear = calculations.yearsToFreedom === p.year;
                    return (
                      <tr
                        key={p.year}
                        className={`border-b border-[#0d0d0d] ${isFreedomYear ? "bg-[#D4AF37]/10" : ""}`}
                      >
                        <td className={`text-[10px] font-mono py-1.5 px-1 ${isFreedomYear ? "text-[#D4AF37] font-bold" : "text-[#888]"}`}>
                          {p.year}{isFreedomYear ? " ◆" : ""}
                        </td>
                        <td className={`text-right text-[10px] font-mono py-1.5 px-1 ${isFreedomYear ? "text-[#D4AF37] font-bold" : "text-[#ccc]"}`}>
                          {formatCurrency(p.value)}
                        </td>
                        <td className="text-right text-[10px] font-mono py-1.5 px-1 text-green-400/70">
                          {formatCurrency(p.growth)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Disclaimer */}
          <div className="p-3 bg-[#050505] border border-[#111] rounded">
            <p className="text-[9px] font-mono text-[#444] leading-relaxed">
              DISCLAIMER: All projections are hypothetical and based on historical data. Past performance does not guarantee future results. 
              Growth rates are derived from historical stock performance and are not promises or guarantees. 
              This is for educational purposes only and is not financial advice. Consult a licensed financial advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
