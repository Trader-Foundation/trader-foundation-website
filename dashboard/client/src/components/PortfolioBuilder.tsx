import { useState, useMemo, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

// ─── Types ───────────────────────────────────────────────────────
interface Holding {
  symbol: string;
  shares: number;
  avgCost: number;
  growthScenario: "conservative" | "base" | "bull" | "outperform" | "custom";
  customRate?: number;
}

// Growth rates derived from fundamentals (PE expansion + earnings growth)
const FUNDAMENTALS_GROWTH: Record<string, { conservative: number; base: number; bull: number; outperform: number; earningsGrowth: string; revenueGrowth: string; forwardPE: string; rationale: string }> = {
  AAPL: { conservative: 6, base: 10, bull: 16, outperform: 22, earningsGrowth: "+8%", revenueGrowth: "+5%", forwardPE: "26.8x", rationale: "Mature growth + services expansion. Base case: 8% EPS growth + slight multiple expansion from 26.8x fwd PE." },
  MSFT: { conservative: 9, base: 15, bull: 22, outperform: 28, earningsGrowth: "+16%", revenueGrowth: "+14%", forwardPE: "24.5x", rationale: "Azure + AI Copilot driving 16% earnings growth. Base case: earnings growth + stable 24.5x fwd multiple." },
  GOOGL: { conservative: 8, base: 14, bull: 20, outperform: 26, earningsGrowth: "+15%", revenueGrowth: "+12%", forwardPE: "17.8x", rationale: "Cheapest Mag 7 at 17.8x fwd PE with 15% earnings growth. Base case: earnings growth + PE re-rating toward 22x." },
  AMZN: { conservative: 10, base: 18, bull: 26, outperform: 32, earningsGrowth: "+20%", revenueGrowth: "+11%", forwardPE: "28.5x", rationale: "AWS margins expanding + retail profitability inflecting. Base case: 20% EPS growth + multiple holds at 28x." },
  META: { conservative: 9, base: 16, bull: 24, outperform: 30, earningsGrowth: "+22%", revenueGrowth: "+20%", forwardPE: "19.2x", rationale: "Cheapest growth stock at 19.2x fwd PE with 22% earnings growth. Base case: earnings growth + PE expansion to 24x." },
  NVDA: { conservative: 10, base: 22, bull: 35, outperform: 45, earningsGrowth: "+40%", revenueGrowth: "+55%", forwardPE: "26.0x", rationale: "AI infrastructure monopoly. 40% earnings growth at 26x fwd PE. Base case: earnings growth + data center TAM expansion." },
  TSLA: { conservative: 5, base: 15, bull: 30, outperform: 50, earningsGrowth: "+25%", revenueGrowth: "+15%", forwardPE: "48.0x", rationale: "High multiple but optionality in FSD, energy, robotics. Base case: 25% EPS growth but multiple compression from 48x." },
  SPY: { conservative: 6, base: 10, bull: 14, outperform: 18, earningsGrowth: "+10%", revenueGrowth: "+8%", forwardPE: "19.2x", rationale: "S&P 500 historical avg ~10%. Base case: earnings growth + mean-reversion to ~20x PE." },
  QQQ: { conservative: 7, base: 12, bull: 18, outperform: 22, earningsGrowth: "+14%", revenueGrowth: "+12%", forwardPE: "23.5x", rationale: "Tech-heavy index with 14% earnings growth. Base case: earnings growth + stable tech multiples." },
  IWM: { conservative: 5, base: 9, bull: 14, outperform: 18, earningsGrowth: "+8%", revenueGrowth: "+6%", forwardPE: "16.2x", rationale: "Small caps historically outperform in recovery cycles. Base case: earnings normalization + multiple expansion from 16x." },
  DIA: { conservative: 5, base: 9, bull: 13, outperform: 17, earningsGrowth: "+9%", revenueGrowth: "+7%", forwardPE: "18.5x", rationale: "Blue chip index. Base case: steady earnings growth + dividend reinvestment." },
};

function getGrowthRate(symbol: string, scenario: string, customRate?: number): number {
  if (scenario === "custom" && customRate != null) return customRate;
  const data = FUNDAMENTALS_GROWTH[symbol.toUpperCase()];
  if (!data) {
    const defaults = { conservative: 7, base: 10, bull: 15, outperform: 20 };
    return defaults[scenario as keyof typeof defaults] || 10;
  }
  return data[scenario as keyof typeof data] as number || data.base;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function formatPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

const SCENARIO_COLORS: Record<string, string> = {
  conservative: "text-[#888]",
  base: "text-[#D4AF37]",
  bull: "text-green-400",
  outperform: "text-cyan-400",
  custom: "text-purple-400",
};

const SCENARIO_LABELS: Record<string, string> = {
  conservative: "Conservative",
  base: "Base Case",
  bull: "Bull Case",
  outperform: "Outperform",
  custom: "Custom",
};

// ─── Component ───────────────────────────────────────────────────
export function PortfolioBuilder() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [csvText, setCsvText] = useState("");
  const [showImport, setShowImport] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState("");

  // Analyze portfolio via tRPC
  const analyzeMutation = trpc.market.analyzePortfolio.useMutation();

  // Import parsed holdings into state
  const importHoldings = useCallback((parsed: Holding[]) => {
    if (parsed.length > 0) {
      setHoldings(parsed);
      setShowImport(false);
      setFileError("");
      analyzeMutation.mutate({ holdings: parsed.map(h => ({ symbol: h.symbol, shares: h.shares, avgCost: h.avgCost || undefined })) });
      setShowAnalysis(true);
    }
  }, []);

  // Parse CSV text
  const parseCSV = useCallback(() => {
    const lines = csvText.trim().split("\n").filter(l => l.trim());
    const parsed: Holding[] = [];
    for (const line of lines) {
      const parts = line.split(/[,\t]+/).map(p => p.trim());
      if (parts.length >= 2) {
        const symbol = parts[0].toUpperCase().replace(/[^A-Z]/g, "");
        const shares = parseFloat(parts[1]);
        const avgCost = parts[2] ? parseFloat(parts[2]) : 0;
        if (symbol && !isNaN(shares) && shares > 0) {
          parsed.push({ symbol, shares, avgCost: isNaN(avgCost) ? 0 : avgCost, growthScenario: "base" });
        }
      }
    }
    importHoldings(parsed);
  }, [csvText, importHoldings]);

  // Parse Excel file
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const parsed: Holding[] = [];
        for (const row of rows) {
          if (!row || row.length < 2) continue;
          // Try to find symbol and shares in the row
          const rawSymbol = String(row[0] || "").trim().toUpperCase().replace(/[^A-Z]/g, "");
          const rawShares = parseFloat(String(row[1] || ""));
          const rawCost = row[2] ? parseFloat(String(row[2])) : 0;

          // Skip header rows
          if (!rawSymbol || rawSymbol === "SYMBOL" || rawSymbol === "TICKER" || rawSymbol === "STOCK") continue;
          if (isNaN(rawShares) || rawShares <= 0) continue;

          parsed.push({
            symbol: rawSymbol,
            shares: rawShares,
            avgCost: isNaN(rawCost) ? 0 : rawCost,
            growthScenario: "base",
          });
        }

        if (parsed.length === 0) {
          setFileError("No valid holdings found. Ensure columns: Symbol, Shares, Avg Cost (optional)");
          return;
        }
        importHoldings(parsed);
      } catch (err) {
        console.error("Excel parse error:", err);
        setFileError("Failed to parse file. Ensure it's a valid .xlsx or .csv file.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [importHoldings]);

  // Add single stock
  const addStock = useCallback(() => {
    const symbol = newSymbol.toUpperCase().replace(/[^A-Z]/g, "");
    const shares = parseFloat(newShares);
    const cost = parseFloat(newCost);
    if (!symbol || isNaN(shares) || shares <= 0) return;

    const updated = [...holdings, { symbol, shares, avgCost: isNaN(cost) ? 0 : cost, growthScenario: "base" as const }];
    setHoldings(updated);
    setNewSymbol("");
    setNewShares("");
    setNewCost("");

    // Re-analyze
    analyzeMutation.mutate({ holdings: updated.map(h => ({ symbol: h.symbol, shares: h.shares, avgCost: h.avgCost || undefined })) });
    setShowAnalysis(true);
    setShowImport(false);
  }, [newSymbol, newShares, newCost, holdings]);

  // Remove stock
  const removeStock = (idx: number) => {
    const updated = holdings.filter((_, i) => i !== idx);
    setHoldings(updated);
    if (updated.length > 0) {
      analyzeMutation.mutate({ holdings: updated.map(h => ({ symbol: h.symbol, shares: h.shares, avgCost: h.avgCost || undefined })) });
    } else {
      setShowAnalysis(false);
      setShowImport(true);
    }
  };

  // Update growth scenario for a stock
  const updateScenario = (idx: number, scenario: Holding["growthScenario"], customRate?: number) => {
    const updated = [...holdings];
    updated[idx] = { ...updated[idx], growthScenario: scenario, customRate };
    setHoldings(updated);
  };

  // Calculate per-stock projections
  const projections = useMemo(() => {
    if (!analyzeMutation.data) return [];
    return holdings.map((h, idx) => {
      const detail = analyzeMutation.data?.holdings?.[idx];
      const currentPrice = detail?.currentPrice || h.avgCost || 0;
      const currentValue = h.shares * currentPrice;
      const rate = getGrowthRate(h.symbol, h.growthScenario, h.customRate);
      const fundamentals = FUNDAMENTALS_GROWTH[h.symbol.toUpperCase()];

      return {
        symbol: h.symbol,
        shares: h.shares,
        currentPrice,
        currentValue,
        growthRate: rate,
        scenario: h.growthScenario,
        fundamentals,
        gainLoss: detail?.gainLoss,
        projectedValues: [5, 10, 15, 20].map(y => ({
          year: y,
          value: Math.round(currentValue * Math.pow(1 + rate / 100, y)),
          price: Math.round(currentPrice * Math.pow(1 + rate / 100, y) * 100) / 100,
        })),
      };
    });
  }, [holdings, analyzeMutation.data]);

  // Total portfolio projections
  const totalProjections = useMemo(() => {
    if (projections.length === 0) return null;
    const totalCurrent = projections.reduce((s, p) => s + p.currentValue, 0);
    const years = [5, 10, 15, 20];
    return {
      totalCurrent,
      projections: years.map(y => ({
        year: y,
        value: projections.reduce((s, p) => {
          const pv = p.projectedValues.find(v => v.year === y);
          return s + (pv?.value || 0);
        }, 0),
      })),
    };
  }, [projections]);

  // Mutual fund comparison
  const mutualFundValue = useCallback((years: number, principal: number) => {
    const rate = 0.07; // 7% annual after fees
    return Math.round(principal * Math.pow(1 + rate, years));
  }, []);

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-gradient-to-r from-[#0a0a0a] to-[#111] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] font-['Playfair_Display'] relative z-10">
          Portfolio Tracker & Growth Simulator
        </h1>
        <p className="text-sm text-[#888] mt-2 max-w-2xl relative z-10">
          Import your holdings, analyze sector allocation, and simulate growth with fundamentals-driven projections.
          Customize each stock's growth scenario based on real PE multiples, earnings growth, and revenue data.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded text-xs text-[#D4AF37] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE PRICES
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111] border border-[#333] rounded text-xs text-[#888] font-mono">
            FUNDAMENTALS-DRIVEN PROJECTIONS
          </span>
        </div>
      </div>

      {/* Import Section */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* CSV / Excel Import */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-mono text-[#D4AF37] tracking-wider">IMPORT PORTFOLIO</h2>

              {/* File Upload */}
              <div className="space-y-2">
                <p className="text-[10px] text-[#666]">Upload an Excel (.xlsx) or CSV file with columns: Symbol, Shares, Avg Cost</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="portfolio-file-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-[#D4AF37]/10 border-2 border-dashed border-[#D4AF37]/30 text-[#D4AF37] font-mono font-bold text-sm rounded hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all tracking-wider flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  UPLOAD EXCEL / CSV FILE
                </button>
                {fileError && (
                  <div className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                    {fileError}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#222]" />
                <span className="text-[10px] font-mono text-[#555]">OR PASTE CSV</span>
                <div className="flex-1 h-px bg-[#222]" />
              </div>

              {/* CSV Paste */}
              <textarea
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={"AAPL, 50, 145.00\nMSFT, 30, 280.00\nNVDA, 100, 120.00\nGOOGL, 40, 130.00\nSPY, 20, 420.00"}
                className="w-full h-32 bg-[#111] border border-[#333] rounded p-3 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none resize-none"
              />
              <button
                onClick={parseCSV}
                disabled={!csvText.trim()}
                className="w-full py-3 bg-[#D4AF37] text-black font-mono font-bold text-sm rounded hover:bg-[#E8C547] transition-all tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
              >
                IMPORT & ANALYZE →
              </button>
            </div>

            {/* Quick Add */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-mono text-[#D4AF37] tracking-wider">OR ADD MANUALLY</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-[#666] block mb-1">TICKER</label>
                  <input
                    value={newSymbol}
                    onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                    placeholder="NVDA"
                    className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-[#666] block mb-1">SHARES</label>
                    <input
                      value={newShares}
                      onChange={e => setNewShares(e.target.value)}
                      placeholder="100"
                      type="number"
                      className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[#666] block mb-1">AVG COST (optional)</label>
                    <input
                      value={newCost}
                      onChange={e => setNewCost(e.target.value)}
                      placeholder="120.00"
                      type="number"
                      className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addStock}
                  disabled={!newSymbol.trim() || !newShares.trim()}
                  className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono font-bold text-sm rounded hover:bg-[#D4AF37]/20 transition-all tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  + ADD TO PORTFOLIO
                </button>
              </div>

              {/* Fundamentals Preview */}
              <div className="mt-4 p-3 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-[#D4AF37] mb-2">FUNDAMENTALS-DRIVEN GROWTH</div>
                <p className="text-[10px] text-[#666] leading-relaxed">
                  Unlike generic calculators, this simulator uses real earnings growth rates, forward PE multiples,
                  and revenue data to project each stock individually. NVDA at 40% earnings growth gets a different
                  base case than AAPL at 8%. You control the scenario for each position.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio loaded — show add stock inline */}
      {!showImport && (
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="px-3 py-2 bg-[#111] border border-[#333] rounded text-xs font-mono text-[#888] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
              >
                ← IMPORT CSV
              </button>
            </div>
            <div className="flex-1 flex flex-wrap items-end gap-2 min-w-0">
              <div className="flex-1 min-w-[80px]">
                <label className="text-[10px] font-mono text-[#666] block mb-1">ADD STOCK</label>
                <input
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="MSFT"
                  className="w-full bg-[#111] border border-[#333] rounded px-2 py-1.5 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                />
              </div>
              <div className="w-20">
                <label className="text-[10px] font-mono text-[#666] block mb-1">SHARES</label>
                <input
                  value={newShares}
                  onChange={e => setNewShares(e.target.value)}
                  placeholder="50"
                  type="number"
                  className="w-full bg-[#111] border border-[#333] rounded px-2 py-1.5 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                />
              </div>
              <div className="w-24">
                <label className="text-[10px] font-mono text-[#666] block mb-1">AVG COST</label>
                <input
                  value={newCost}
                  onChange={e => setNewCost(e.target.value)}
                  placeholder="280"
                  type="number"
                  className="w-full bg-[#111] border border-[#333] rounded px-2 py-1.5 text-xs font-mono text-[#E8E0D0] placeholder:text-[#444] focus:border-[#D4AF37]/50 focus:outline-none"
                />
              </div>
              <button
                onClick={addStock}
                disabled={!newSymbol.trim() || !newShares.trim()}
                className="px-4 py-1.5 bg-[#D4AF37] text-black font-mono font-bold text-xs rounded hover:bg-[#E8C547] transition-all disabled:opacity-30"
              >
                + ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {analyzeMutation.isPending && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs font-mono text-[#666]">FETCHING LIVE PRICES & ANALYZING...</div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {showAnalysis && analyzeMutation.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-4">
              <div className="text-[10px] font-mono text-[#666]">TOTAL VALUE</div>
              <div className="text-xl font-bold text-[#D4AF37] font-mono mt-1">
                {formatCurrency(analyzeMutation.data.totalValue)}
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="text-[10px] font-mono text-[#666]">HOLDINGS</div>
              <div className="text-xl font-bold text-[#E8E0D0] font-mono mt-1">
                {analyzeMutation.data.holdingCount}
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="text-[10px] font-mono text-[#666]">HEALTH SCORE</div>
              <div className={`text-xl font-bold font-mono mt-1 ${
                analyzeMutation.data.healthScore >= 70 ? "text-green-400" :
                analyzeMutation.data.healthScore >= 50 ? "text-yellow-400" : "text-red-400"
              }`}>
                {analyzeMutation.data.healthScore}/100
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4">
              <div className="text-[10px] font-mono text-[#666]">CONCENTRATION</div>
              <div className={`text-xl font-bold font-mono mt-1 ${
                analyzeMutation.data.concentrationRisk === "LOW" ? "text-green-400" :
                analyzeMutation.data.concentrationRisk === "MODERATE" ? "text-yellow-400" : "text-red-400"
              }`}>
                {analyzeMutation.data.concentrationRisk}
              </div>
            </div>
          </div>

          {/* Sector Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
              <h3 className="text-sm font-mono text-[#D4AF37] mb-4">YOUR SECTOR ALLOCATION</h3>
              <div className="space-y-2">
                {analyzeMutation.data.sectorAllocation.map((s: any) => (
                  <div key={s.sector} className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#888] w-32 truncate">{s.sector}</span>
                    <div className="flex-1 h-3 bg-[#111] rounded overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37]/60 rounded transition-all"
                        style={{ width: `${Math.min(100, s.weight)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-[#E8E0D0] w-12 text-right">{s.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
              <h3 className="text-sm font-mono text-[#D4AF37] mb-4">TF RECOMMENDED ALLOCATION</h3>
              <div className="space-y-2">
                {analyzeMutation.data.idealAllocation.map((s: any) => {
                  const actual = analyzeMutation.data!.sectorAllocation.find((a: any) => a.sector === s.sector);
                  const diff = (actual?.weight || 0) - s.weight;
                  return (
                    <div key={s.sector} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#888] w-32 truncate">{s.sector}</span>
                      <div className="flex-1 h-3 bg-[#111] rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500/40 rounded transition-all"
                          style={{ width: `${Math.min(100, s.weight)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#888] w-12 text-right">{s.weight}%</span>
                      {Math.abs(diff) > 5 && (
                        <span className={`text-[10px] font-mono w-16 text-right ${diff > 0 ? "text-yellow-400" : "text-cyan-400"}`}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Suggestions */}
              {analyzeMutation.data.suggestions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-mono text-[#D4AF37]">REBALANCING SUGGESTIONS</div>
                  {analyzeMutation.data.suggestions.map((s: string, i: number) => (
                    <div key={i} className="text-[10px] text-[#888] p-2 bg-[#111] rounded border border-[#1a1a1a]">
                      ◆ {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Per-Stock Growth Simulator */}
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-mono text-[#D4AF37] tracking-wider">
                PER-STOCK GROWTH SIMULATOR
              </h3>
              <span className="text-[10px] font-mono text-[#555]">
                CUSTOMIZE EACH STOCK'S GROWTH SCENARIO
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#222]">
                    <th className="text-left py-2 font-mono text-[#666] font-normal">TICKER</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">SHARES</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">PRICE</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">VALUE</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">P&L</th>
                    <th className="text-center py-2 font-mono text-[#666] font-normal">GROWTH SCENARIO</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">RATE</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal hidden md:table-cell">5Y</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal hidden md:table-cell">10Y</th>
                    <th className="text-right py-2 font-mono text-[#666] font-normal">20Y</th>
                    <th className="text-center py-2 font-mono text-[#666] font-normal w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((p, idx) => (
                    <tr key={`${p.symbol}-${idx}`} className="border-b border-[#111] hover:bg-[#111] transition-colors group">
                      <td className="py-3 font-mono font-bold text-[#D4AF37]">
                        <div>{p.symbol}</div>
                        {p.fundamentals && (
                          <div className="text-[9px] text-[#555] font-normal mt-0.5">
                            EPS: {p.fundamentals.earningsGrowth} | Rev: {p.fundamentals.revenueGrowth}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-right font-mono text-[#ccc]">{p.shares}</td>
                      <td className="py-3 text-right font-mono text-[#E8E0D0]">${p.currentPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono text-[#E8E0D0]">{formatCurrency(p.currentValue)}</td>
                      <td className={`py-3 text-right font-mono ${p.gainLoss != null ? (p.gainLoss >= 0 ? "text-green-400" : "text-red-400") : "text-[#555]"}`}>
                        {p.gainLoss != null ? formatPct(p.gainLoss) : "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center gap-1 flex-wrap">
                          {(["conservative", "base", "bull", "outperform"] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => updateScenario(idx, s)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-all ${
                                p.scenario === s
                                  ? `${SCENARIO_COLORS[s]} bg-[#222] border border-[#D4AF37]/30`
                                  : "text-[#555] hover:text-[#888] border border-transparent"
                              }`}
                            >
                              {s === "conservative" ? "CON" : s === "base" ? "BASE" : s === "bull" ? "BULL" : "OUT"}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className={`py-3 text-right font-mono font-bold ${SCENARIO_COLORS[p.scenario]}`}>
                        {p.growthRate}%
                      </td>
                      <td className="py-3 text-right font-mono text-[#888] hidden md:table-cell">
                        {formatCurrency(p.projectedValues[0]?.value || 0)}
                      </td>
                      <td className="py-3 text-right font-mono text-[#ccc] hidden md:table-cell">
                        {formatCurrency(p.projectedValues[1]?.value || 0)}
                      </td>
                      <td className="py-3 text-right font-mono text-[#D4AF37] font-bold">
                        {formatCurrency(p.projectedValues[3]?.value || 0)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => removeStock(idx)}
                          className="text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fundamentals Rationale */}
            {projections.some(p => p.fundamentals) && (
              <div className="mt-4 p-4 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-[#D4AF37] mb-2">WHY THESE GROWTH RATES?</div>
                <div className="space-y-2">
                  {projections.filter(p => p.fundamentals).map(p => (
                    <div key={p.symbol} className="text-[10px] text-[#888] leading-relaxed">
                      <span className="text-[#D4AF37] font-bold">{p.symbol}</span> ({SCENARIO_LABELS[p.scenario]} @ {p.growthRate}%): {p.fundamentals!.rationale}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total Portfolio Projection */}
          {totalProjections && (
            <div className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-lg p-6">
              <h3 className="text-sm font-mono text-[#D4AF37] mb-4 tracking-wider">
                TOTAL PORTFOLIO PROJECTION
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="bg-[#111] rounded p-3 border border-[#222]">
                  <div className="text-[10px] font-mono text-[#666]">TODAY</div>
                  <div className="text-lg font-bold text-[#E8E0D0] font-mono mt-1">
                    {formatCurrency(totalProjections.totalCurrent)}
                  </div>
                </div>
                {totalProjections.projections.map(p => (
                  <div key={p.year} className="bg-[#111] rounded p-3 border border-[#D4AF37]/10">
                    <div className="text-[10px] font-mono text-[#666]">{p.year} YEARS</div>
                    <div className="text-lg font-bold text-[#D4AF37] font-mono mt-1">
                      {formatCurrency(p.value)}
                    </div>
                    <div className="text-[9px] text-green-400 font-mono mt-0.5">
                      +{Math.round(((p.value - totalProjections.totalCurrent) / totalProjections.totalCurrent) * 100)}%
                    </div>
                  </div>
                ))}
              </div>

              {/* vs Mutual Fund */}
              <div className="p-4 bg-[#111] rounded border border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-[#D4AF37] mb-3">YOUR PORTFOLIO vs MUTUAL FUND (7% avg)</div>
                <div className="space-y-2">
                  {totalProjections.projections.map(p => {
                    const mfValue = mutualFundValue(p.year, totalProjections.totalCurrent);
                    const diff = p.value - mfValue;
                    return (
                      <div key={p.year} className="flex items-center justify-between text-xs">
                        <span className="text-[#666] font-mono w-16">{p.year} YEARS</span>
                        <div className="flex-1 mx-3">
                          <div className="flex items-center gap-2">
                            <span className="text-red-400/70 text-[10px] w-20 text-right">{formatCurrency(mfValue)}</span>
                            <div className="flex-1 h-1.5 bg-[#222] rounded overflow-hidden">
                              <div className="h-full bg-red-500/40 rounded" style={{ width: `${Math.min(100, (mfValue / Math.max(p.value, 1)) * 100)}%` }} />
                            </div>
                            <span className="text-[#D4AF37] text-[10px] w-20">{formatCurrency(p.value)}</span>
                          </div>
                        </div>
                        <span className="text-green-400 text-[10px] font-mono w-20 text-right">+{formatCurrency(Math.round(diff))}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] text-[#555] mt-3 text-center font-mono">
                  RED = Mutual Fund (7%) | GOLD = Your Custom Portfolio
                </div>
              </div>
            </div>
          )}

          {/* Missing from Universe */}
          {analyzeMutation.data.missingFromUniverse.length > 0 && (
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6">
              <h3 className="text-sm font-mono text-[#D4AF37] mb-3">CONSIDER ADDING</h3>
              <p className="text-[10px] text-[#666] mb-3">These TF Universe stocks are not in your portfolio yet:</p>
              <div className="flex flex-wrap gap-2">
                {analyzeMutation.data.missingFromUniverse.map((s: any) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      setNewSymbol(s.symbol);
                      setNewShares("10");
                      setNewCost("");
                    }}
                    className="px-3 py-1.5 bg-[#111] border border-[#333] rounded text-xs font-mono text-[#888] hover:border-[#D4AF37]/30 hover:text-[#D4AF37] transition-all"
                  >
                    <span className="text-[#D4AF37]">{s.symbol}</span> — {s.company}
                    <span className="text-[#555] ml-1">({s.sector})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coaching CTA */}
          <div className="bg-gradient-to-r from-[#1a1500] to-[#0a0a0a] border border-[#D4AF37]/30 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-mono text-[#D4AF37] font-bold mb-1">
                  WANT HELP BUILDING YOUR PLAN?
                </div>
                <p className="text-xs text-[#888] leading-relaxed">
                  Our coaches can help you optimize your portfolio allocation, time your entries at DCA zones,
                  and build a personalized wealth plan. The growth simulator shows the math — coaching shows you the execution.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded text-[10px] font-mono text-[#D4AF37]">
                    ◆ 1-ON-1 COACHING AVAILABLE
                  </span>
                  <span className="px-3 py-1.5 bg-[#222] border border-[#333] rounded text-[10px] font-mono text-[#888]">
                    TF ELITE EXCLUSIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
