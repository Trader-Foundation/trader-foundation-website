import { callDataApi } from "./_core/dataApi";
import { invokeLLM } from "./_core/llm";
import { fetchStockQuote, fetchMonthlyData, calculateTechnicalLevels, calculateValuation, calculateSectorBenchmark, calculateProjections, SECTOR_ETF_MAP, INVESTMENT_UNIVERSE, type StockQuote, type ValuationData } from "./marketData";

// ============================================================
// ELITE DEEP DIVE RESEARCH SERVICE
// Comprehensive stock research using Yahoo Finance APIs
// Factual, verifiable data — matches what you'd find on any terminal
// ============================================================

// --- Types ---

export interface DividendData {
  recentDividends: { date: string; amount: number }[];
  annualYield: number | null;
  annualDividend: number | null;
  payoutFrequency: string;
  nextExDividendEstimate: string | null;
}

export interface SplitData {
  splits: { date: string; ratio: string; numerator: number; denominator: number }[];
  hasSplitHistory: boolean;
}

export interface InsiderHolder {
  name: string;
  relation: string;
  transactionType: string;
  latestDate: string;
  sharesHeld: string;
  sharesHeldRaw: number;
}

export interface SECFiling {
  type: string;
  title: string;
  description: string;
  filingDate: string;
  id: string;
}

export interface AnalystData {
  targetPrice: number | null;
  rating: string | null;
  provider: string | null;
}

export interface TechnicalOutlook {
  direction: string;
  score: number;
  scoreDescription: string;
  sectorDirection: string;
  sectorScore: number;
}

export interface CompanyMetrics {
  innovativeness: number;
  hiring: number;
  sustainability: number;
  insiderSentiments: number;
  earningsReports: number;
  dividends: number;
}

export interface SignificantDevelopment {
  headline: string;
  date: string;
}

export interface ValuationInsight {
  description: string;
  discount: string;
  relativeValue: string;
}

export interface OverreactionAlert {
  isOverreaction: boolean;
  type: "EARNINGS_BEAT_DUMP" | "NARRATIVE_FEAR" | "SECTOR_ROTATION" | "NONE";
  severity: "CRITICAL" | "MODERATE" | "MILD" | "NONE";
  headline: string;
  details: string;
  fundamentalStrength: string;
  buyingOpportunity: string;
}

export interface DeepDiveResearch {
  symbol: string;
  companyName: string;
  sector: string;
  quote: StockQuote;
  
  // Analyst consensus
  analyst: AnalystData;
  
  // Technical outlook (from Trading Central)
  shortTermOutlook: TechnicalOutlook | null;
  intermediateTermOutlook: TechnicalOutlook | null;
  longTermOutlook: TechnicalOutlook | null;
  keyTechnicals: { support: number; resistance: number; stopLoss: number } | null;
  
  // Valuation insight from Trading Central
  valuationInsight: ValuationInsight | null;
  
  // Company vs sector comparison scores
  companyMetrics: CompanyMetrics | null;
  sectorMetrics: CompanyMetrics | null;
  
  // Dividends
  dividends: DividendData;
  
  // Stock splits
  splits: SplitData;
  
  // Insider activity
  insiders: InsiderHolder[];
  
  // SEC filings
  secFilings: SECFiling[];
  
  // Significant developments (news)
  sigDevs: SignificantDevelopment[];
  
  // Overreaction detection
  overreactionAlert: OverreactionAlert;
  
  // Valuation context (from our existing system)
  valuation: Awaited<ReturnType<typeof calculateValuation>>;
  
  // Sector benchmark
  sectorBenchmark: Awaited<ReturnType<typeof calculateSectorBenchmark>>;
  
  // Technicals (BB, MA, drawdown)
  technicals: ReturnType<typeof calculateTechnicalLevels> | null;
  
  // Projections
  projections: ReturnType<typeof calculateProjections>;
  
  // LLM-powered comprehensive research
  aiResearch: {
    executiveSummary: string;
    competitivePosition: string;
    revenueDrivers: string;
    marginAnalysis: string;
    growthCatalysts: string;
    riskFactors: string;
    tfVerdict: string;
  } | null;
  
  lastUpdated: string;
}

// --- Deep Dive Cache ---
const deepDiveCache = new Map<string, { data: DeepDiveResearch; timestamp: number }>();
const DEEP_DIVE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes for market data
const aiResearchCache = new Map<string, { data: DeepDiveResearch["aiResearch"]; timestamp: number }>();
const AI_RESEARCH_CACHE_TTL = 30 * 60 * 1000; // 30 minutes for AI research (doesn't change fast)

// --- Data Fetching Functions ---

async function fetchInsights(symbol: string): Promise<any> {
  try {
    const response = await callDataApi("YahooFinance/get_stock_insights", {
      query: { symbol, region: "US" },
    }) as any;
    return response?.finance?.result || null;
  } catch (err) {
    console.error(`[DeepDive] Failed to fetch insights for ${symbol}:`, err);
    return null;
  }
}

async function fetchHolders(symbol: string): Promise<any> {
  try {
    const response = await callDataApi("YahooFinance/get_stock_holders", {
      query: { symbol, region: "US" },
    }) as any;
    return response?.quoteSummary?.result?.[0] || null;
  } catch (err) {
    console.error(`[DeepDive] Failed to fetch holders for ${symbol}:`, err);
    return null;
  }
}

async function fetchChartWithEvents(symbol: string): Promise<any> {
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1mo",
        range: "max",
        events: "div,split",
        includeAdjustedClose: "true",
      },
    }) as any;
    return response?.chart?.result?.[0] || null;
  } catch (err) {
    console.error(`[DeepDive] Failed to fetch chart events for ${symbol}:`, err);
    return null;
  }
}

// --- Parse Functions ---

function parseDividends(chartData: any, currentPrice: number): DividendData {
  const dividends = chartData?.events?.dividends;
  if (!dividends || Object.keys(dividends).length === 0) {
    return {
      recentDividends: [],
      annualYield: null,
      annualDividend: null,
      payoutFrequency: "None",
      nextExDividendEstimate: null,
    };
  }

  // Sort dividends by date descending
  const sortedDivs = Object.entries(dividends)
    .map(([, v]: [string, any]) => ({
      date: new Date(v.date * 1000).toISOString().split("T")[0],
      amount: v.amount,
      timestamp: v.date,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  // Recent dividends (last 8)
  const recentDividends = sortedDivs.slice(0, 8).map(d => ({
    date: d.date,
    amount: Math.round(d.amount * 10000) / 10000,
  }));

  // Calculate annual dividend from last 4 payments
  const last4 = sortedDivs.slice(0, 4);
  const annualDividend = last4.length >= 4
    ? Math.round(last4.reduce((sum, d) => sum + d.amount, 0) * 10000) / 10000
    : last4.length > 0
    ? Math.round(last4[0].amount * 4 * 10000) / 10000
    : null;

  const annualYield = annualDividend && currentPrice > 0
    ? Math.round((annualDividend / currentPrice) * 10000) / 100
    : null;

  // Determine payout frequency
  let payoutFrequency = "Unknown";
  if (sortedDivs.length >= 2) {
    const gap = (sortedDivs[0].timestamp - sortedDivs[1].timestamp) / (24 * 60 * 60);
    if (gap < 45) payoutFrequency = "Monthly";
    else if (gap < 120) payoutFrequency = "Quarterly";
    else if (gap < 200) payoutFrequency = "Semi-Annual";
    else payoutFrequency = "Annual";
  }

  // Estimate next ex-dividend date
  let nextExDividendEstimate: string | null = null;
  if (sortedDivs.length >= 2) {
    const lastDate = new Date(sortedDivs[0].timestamp * 1000);
    const gapMs = (sortedDivs[0].timestamp - sortedDivs[1].timestamp) * 1000;
    const nextDate = new Date(lastDate.getTime() + gapMs);
    if (nextDate > new Date()) {
      nextExDividendEstimate = nextDate.toISOString().split("T")[0];
    }
  }

  return {
    recentDividends,
    annualYield,
    annualDividend,
    payoutFrequency,
    nextExDividendEstimate,
  };
}

function parseSplits(chartData: any): SplitData {
  const splits = chartData?.events?.splits;
  if (!splits || Object.keys(splits).length === 0) {
    return { splits: [], hasSplitHistory: false };
  }

  const sortedSplits = Object.entries(splits)
    .map(([, v]: [string, any]) => ({
      date: new Date(v.date * 1000).toISOString().split("T")[0],
      ratio: `${v.numerator}:${v.denominator}`,
      numerator: v.numerator,
      denominator: v.denominator,
      timestamp: v.date,
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    splits: sortedSplits.map(s => ({
      date: s.date,
      ratio: s.ratio,
      numerator: s.numerator,
      denominator: s.denominator,
    })),
    hasSplitHistory: true,
  };
}

function parseInsiders(holdersData: any): InsiderHolder[] {
  const holders = holdersData?.insiderHolders?.holders;
  if (!holders || !Array.isArray(holders)) return [];

  return holders.map((h: any) => {
    const sharesHeldRaw = h.positionDirect?.raw || h.positionIndirect?.raw || 0;
    const sharesHeld = h.positionDirect?.fmt || h.positionIndirect?.fmt || "N/A";
    return {
      name: h.name || "Unknown",
      relation: h.relation || "Unknown",
      transactionType: h.transactionDescription || "Unknown",
      latestDate: h.latestTransDate?.fmt || "N/A",
      sharesHeld,
      sharesHeldRaw,
    };
  }).sort((a: InsiderHolder, b: InsiderHolder) => b.sharesHeldRaw - a.sharesHeldRaw);
}

function parseSECFilings(insightsData: any): SECFiling[] {
  const filings = insightsData?.secReports;
  if (!filings || !Array.isArray(filings)) return [];

  return filings.slice(0, 10).map((f: any) => ({
    type: f.type || "Unknown",
    title: f.title || "Unknown",
    description: f.description || "",
    filingDate: f.filingDate
      ? new Date(f.filingDate).toISOString().split("T")[0]
      : "Unknown",
    id: f.id || "",
  }));
}

function parseSigDevs(insightsData: any): SignificantDevelopment[] {
  const devs = insightsData?.sigDevs;
  if (!devs || !Array.isArray(devs)) return [];

  return devs.slice(0, 10).map((d: any) => ({
    headline: d.headline || "Unknown",
    date: d.date || "Unknown",
  }));
}

// --- Overreaction Detection ---
// This is the GOOGL/OpenAI example: Wall Street panics on narrative, fundamentals stay strong
// TF Elite members buy the fear, not sell it

function detectOverreaction(
  symbol: string,
  quote: StockQuote,
  valuation: ValuationData,
  technicals: ReturnType<typeof calculateTechnicalLevels> | null,
  companyMetrics: CompanyMetrics | null,
  sigDevs: SignificantDevelopment[],
  analystRating: string | null,
  analystTarget: number | null,
): OverreactionAlert {
  const noAlert: OverreactionAlert = {
    isOverreaction: false,
    type: "NONE",
    severity: "NONE",
    headline: "",
    details: "",
    fundamentalStrength: "",
    buyingOpportunity: "",
  };

  if (!technicals || !valuation) return noAlert;

  const drawdown = technicals.drawdownPct;
  const forwardPE = valuation.forwardPE;
  const historicalPE = valuation.historicalAvgPE;
  const earningsGrowth = valuation.earningsGrowthEstimate;
  const revenueGrowth = valuation.revenueGrowth;
  const fcf = valuation.freeCashFlow;

  // Check for fundamental strength indicators
  const hasStrongEarnings = earningsGrowth && !earningsGrowth.includes("-") && earningsGrowth !== "N/A";
  const hasStrongRevenue = revenueGrowth && !revenueGrowth.includes("-") && revenueGrowth !== "N/A";
  const hasStrongFCF = fcf && fcf !== "N/A" && !fcf.includes("-");
  const isBelowHistoricalPE = forwardPE != null && forwardPE < historicalPE;
  const hasAnalystBuy = analystRating && ["BUY", "STRONG BUY", "OUTPERFORM", "OVERWEIGHT"].includes(analystRating.toUpperCase());
  const hasUpsideToTarget = analystTarget != null && analystTarget > quote.currentPrice * 1.15;

  // Count fundamental strength signals
  const strengthSignals = [
    hasStrongEarnings,
    hasStrongRevenue,
    hasStrongFCF,
    isBelowHistoricalPE,
    hasAnalystBuy,
    hasUpsideToTarget,
  ].filter(Boolean).length;

  // Company metrics strength (earnings reports score > 0.7 = strong)
  const hasStrongCompanyScore = companyMetrics && companyMetrics.earningsReports > 0.7;

  // OVERREACTION DETECTION LOGIC
  // Case 1: Stock is significantly down but fundamentals are strong
  if (drawdown >= 15 && strengthSignals >= 4) {
    const uptoPct = analystTarget ? Math.round(((analystTarget - quote.currentPrice) / quote.currentPrice) * 100) : 0;
    return {
      isOverreaction: true,
      type: "NARRATIVE_FEAR",
      severity: drawdown >= 25 ? "CRITICAL" : "MODERATE",
      headline: `OVERREACTION ALERT — ${symbol} DOWN ${drawdown.toFixed(1)}% BUT FUNDAMENTALS REMAIN STRONG`,
      details: `${symbol} has sold off ${drawdown.toFixed(1)}% from ATH while earnings growth is ${earningsGrowth}, revenue growth is ${revenueGrowth}, and FCF is ${fcf}. Forward PE of ${forwardPE?.toFixed(1)} is ${isBelowHistoricalPE ? "BELOW" : "near"} the historical average of ${historicalPE}. ${hasAnalystBuy ? `Analysts rate ${analystRating} with $${analystTarget} target (${uptoPct}% upside).` : ""} This is a classic Wall Street overreaction — the business is growing but the stock is being punished.`,
      fundamentalStrength: `${strengthSignals}/6 fundamental strength signals firing. ${hasStrongEarnings ? "Earnings growing. " : ""}${hasStrongRevenue ? "Revenue growing. " : ""}${hasStrongFCF ? "Strong FCF. " : ""}${isBelowHistoricalPE ? "Trading below historical PE. " : ""}${hasStrongCompanyScore ? "Strong earnings track record. " : ""}`,
      buyingOpportunity: drawdown >= 25
        ? `GENERATIONAL OPPORTUNITY — This is the kind of setup where TF Elite members built wealth. Remember GOOGL when Wall Street sold on OpenAI fears? Same playbook. Fundamentals > Narrative. Deploy capital with conviction.`
        : `STRONG BUYING ZONE — The market is giving you a discount on a fundamentally strong company. DCA into this weakness. The business hasn't changed, only the sentiment.`,
    };
  }

  // Case 2: Moderate pullback with strong fundamentals
  if (drawdown >= 10 && strengthSignals >= 3) {
    return {
      isOverreaction: true,
      type: "SECTOR_ROTATION",
      severity: "MILD",
      headline: `OPPORTUNITY FLAG — ${symbol} PULLING BACK ${drawdown.toFixed(1)}% WITH SOLID FUNDAMENTALS`,
      details: `${symbol} is in pullback territory at ${drawdown.toFixed(1)}% off ATH. Key fundamentals remain intact: earnings growth ${earningsGrowth}, revenue growth ${revenueGrowth}. Forward PE ${forwardPE?.toFixed(1)} vs historical ${historicalPE}.`,
      fundamentalStrength: `${strengthSignals}/6 fundamental signals positive. Business fundamentals have not deteriorated.`,
      buyingOpportunity: `WATCH CLOSELY — If this pullback deepens to DCA zones, it could become a strong entry point. Set alerts and be ready to deploy.`,
    };
  }

  return noAlert;
}

// --- LLM-Powered Comprehensive Research ---

export async function generateDeepResearch(
  symbol: string,
  companyName: string,
  quote: StockQuote,
  valuation: ValuationData,
  technicals: ReturnType<typeof calculateTechnicalLevels> | null,
  dividends: DividendData,
  overreaction: OverreactionAlert,
): Promise<DeepDiveResearch["aiResearch"]> {
  try {
    const drawdown = technicals?.drawdownPct?.toFixed(1) || "0";
    const fwdPE = valuation.forwardPE?.toFixed(1) || "N/A";
    const curPE = valuation.peRatio?.toFixed(1) || "N/A";
    const histPE = valuation.historicalAvgPE?.toFixed(1) || "N/A";
    const divYield = dividends.annualYield ? `${dividends.annualYield}%` : "None";

    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an elite financial analyst for the Trader Foundation terminal. You provide factual, data-driven research that matches the quality of Bloomberg or Gemini. Be specific with numbers. No disclaimers. No fluff. Every sentence must add value. You are writing for sophisticated investors who want conviction-building data.`,
        },
        {
          role: "user",
          content: `Write a comprehensive deep-dive research summary for ${companyName} (${symbol}).

Current data:
- Price: $${quote.currentPrice.toFixed(2)} | ${drawdown}% off ATH
- Current PE: ${curPE} | Forward PE: ${fwdPE} | Historical Avg PE: ${histPE}
- Revenue Growth: ${valuation.revenueGrowth} | Earnings Growth: ${valuation.earningsGrowthEstimate}
- FCF: ${valuation.freeCashFlow} | Dividend Yield: ${divYield}
- 52-Week Range: $${quote.fiftyTwoWeekLow.toFixed(2)} - $${quote.fiftyTwoWeekHigh.toFixed(2)}
${overreaction.isOverreaction ? `- OVERREACTION DETECTED: ${overreaction.headline}` : ""}

Provide these sections (2-4 sentences each, factual and specific):
1. "executiveSummary": What this company does, market position, and current state
2. "competitivePosition": Competitive moats, market share, barriers to entry
3. "revenueDrivers": Key revenue segments, growth drivers, TAM expansion
4. "marginAnalysis": Gross/operating/net margin trends, efficiency improvements
5. "growthCatalysts": Near-term and long-term catalysts (AI, new products, expansion)
6. "riskFactors": Key risks — regulatory, competition, macro, execution
7. "tfVerdict": TF Elite perspective — is this a buy at current levels? Why or why not? Reference the data.

Return as JSON.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "deep_research",
          strict: true,
          schema: {
            type: "object",
            properties: {
              executiveSummary: { type: "string" },
              competitivePosition: { type: "string" },
              revenueDrivers: { type: "string" },
              marginAnalysis: { type: "string" },
              growthCatalysts: { type: "string" },
              riskFactors: { type: "string" },
              tfVerdict: { type: "string" },
            },
            required: [
              "executiveSummary",
              "competitivePosition",
              "revenueDrivers",
              "marginAnalysis",
              "growthCatalysts",
              "riskFactors",
              "tfVerdict",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = result.choices[0]?.message?.content;
    return typeof content === "string" ? JSON.parse(content) : null;
  } catch (err) {
    console.error(`[DeepDive] LLM research failed for ${symbol}:`, err);
    return null;
  }
}

// --- Main Deep Dive Function ---

// Fast version — returns all data except AI research (instant)
export async function getStockDeepDiveFast(symbol: string): Promise<DeepDiveResearch> {
  const upperSymbol = symbol.toUpperCase();

  // Check cache — if we have a full cached result, return it instantly
  const cached = deepDiveCache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < DEEP_DIVE_CACHE_TTL) {
    return cached.data;
  }

  console.log(`[DeepDive] Fast research for ${upperSymbol}...`);

  const universeEntry = INVESTMENT_UNIVERSE.find(s => s.symbol === upperSymbol);
  const companyName = universeEntry?.company || upperSymbol;
  const sector = universeEntry?.sector || "Unknown";

  // PARALLEL FETCH — all data sources at once
  const [quote, monthlyData, insightsData, holdersData, chartEventsData] = await Promise.all([
    fetchStockQuote(upperSymbol),
    fetchMonthlyData(upperSymbol),
    fetchInsights(upperSymbol),
    fetchHolders(upperSymbol),
    fetchChartWithEvents(upperSymbol),
  ]);

  if (!quote) throw new Error(`Could not find data for ${upperSymbol}`);

  const technicals = monthlyData
    ? calculateTechnicalLevels(quote.currentPrice, monthlyData.closes, monthlyData.highs)
    : null;
  const valuation = await calculateValuation(upperSymbol, quote.currentPrice, technicals?.drawdownPct || 0);
  const projections = calculateProjections(upperSymbol, quote.currentPrice);
  const dividends = parseDividends(chartEventsData, quote.currentPrice);
  const splits = parseSplits(chartEventsData);
  const insiders = parseInsiders(holdersData);

  const analyst: AnalystData = {
    targetPrice: insightsData?.recommendation?.targetPrice || null,
    rating: insightsData?.recommendation?.rating || null,
    provider: insightsData?.recommendation?.provider || null,
  };

  const shortTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.shortTermOutlook || null;
  const intermediateTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.intermediateTermOutlook || null;
  const longTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.longTermOutlook || null;
  const keyTechnicals = insightsData?.instrumentInfo?.keyTechnicals
    ? { support: insightsData.instrumentInfo.keyTechnicals.support || 0, resistance: insightsData.instrumentInfo.keyTechnicals.resistance || 0, stopLoss: insightsData.instrumentInfo.keyTechnicals.stopLoss || 0 }
    : null;
  const valuationInsight = insightsData?.instrumentInfo?.valuation
    ? { description: insightsData.instrumentInfo.valuation.description || "N/A", discount: insightsData.instrumentInfo.valuation.discount || "N/A", relativeValue: insightsData.instrumentInfo.valuation.relativeValue || "N/A" }
    : null;
  const companyMetrics = insightsData?.companySnapshot?.company || null;
  const sectorMetrics = insightsData?.companySnapshot?.sector || null;
  const secFilings = parseSECFilings(insightsData);
  const sigDevs = parseSigDevs(insightsData);

  const overreactionAlert = detectOverreaction(upperSymbol, quote, valuation, technicals, companyMetrics, sigDevs, analyst.rating, analyst.targetPrice);

  // Sector benchmark — run async but don't block
  const sectorBenchmark = await calculateSectorBenchmark(upperSymbol, quote, valuation);

  // Check AI cache — return cached AI if available, null otherwise
  const cachedAI = aiResearchCache.get(upperSymbol);
  const aiResearch = cachedAI && Date.now() - cachedAI.timestamp < AI_RESEARCH_CACHE_TTL ? cachedAI.data : null;

  const result: DeepDiveResearch = {
    symbol: upperSymbol, companyName, sector, quote, analyst,
    shortTermOutlook, intermediateTermOutlook, longTermOutlook,
    keyTechnicals, valuationInsight, companyMetrics, sectorMetrics,
    dividends, splits, insiders, secFilings, sigDevs,
    overreactionAlert, valuation, sectorBenchmark, technicals, projections,
    aiResearch,
    lastUpdated: new Date().toISOString(),
  };

  // Cache the fast result
  deepDiveCache.set(upperSymbol, { data: result, timestamp: Date.now() });
  console.log(`[DeepDive] Fast research complete for ${upperSymbol}`);
  return result;
}

// Full version — includes AI research (slower)
export async function getStockDeepDive(symbol: string): Promise<DeepDiveResearch> {
  const upperSymbol = symbol.toUpperCase();

  // Check cache
  const cached = deepDiveCache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < DEEP_DIVE_CACHE_TTL) {
    return cached.data;
  }

  console.log(`[DeepDive] Starting elite research for ${upperSymbol}...`);

  // Determine company name
  const universeEntry = INVESTMENT_UNIVERSE.find(s => s.symbol === upperSymbol);
  const companyName = universeEntry?.company || upperSymbol;
  const sector = universeEntry?.sector || "Unknown";

  // PARALLEL FETCH — all data sources at once for maximum speed
  const [quote, monthlyData, insightsData, holdersData, chartEventsData] = await Promise.all([
    fetchStockQuote(upperSymbol),
    fetchMonthlyData(upperSymbol),
    fetchInsights(upperSymbol),
    fetchHolders(upperSymbol),
    fetchChartWithEvents(upperSymbol),
  ]);

  if (!quote) {
    throw new Error(`Could not find data for ${upperSymbol}`);
  }

  // Calculate technicals
  const technicals = monthlyData
    ? calculateTechnicalLevels(quote.currentPrice, monthlyData.closes, monthlyData.highs)
    : null;

  // Calculate valuation
  const valuation = await calculateValuation(upperSymbol, quote.currentPrice, technicals?.drawdownPct || 0);

  // Calculate projections (sync — instant)
  const projections = calculateProjections(upperSymbol, quote.currentPrice);

  // Parse dividends and splits from chart events (sync — instant)
  const dividends = parseDividends(chartEventsData, quote.currentPrice);
  const splits = parseSplits(chartEventsData);

  // Parse insiders (sync — instant)
  const insiders = parseInsiders(holdersData);

  // Parse insights data (sync — instant)
  const analyst: AnalystData = {
    targetPrice: insightsData?.recommendation?.targetPrice || null,
    rating: insightsData?.recommendation?.rating || null,
    provider: insightsData?.recommendation?.provider || null,
  };

  const shortTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.shortTermOutlook || null;
  const intermediateTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.intermediateTermOutlook || null;
  const longTermOutlook = insightsData?.instrumentInfo?.technicalEvents?.longTermOutlook || null;

  const keyTechnicals = insightsData?.instrumentInfo?.keyTechnicals
    ? {
        support: insightsData.instrumentInfo.keyTechnicals.support || 0,
        resistance: insightsData.instrumentInfo.keyTechnicals.resistance || 0,
        stopLoss: insightsData.instrumentInfo.keyTechnicals.stopLoss || 0,
      }
    : null;

  const valuationInsight = insightsData?.instrumentInfo?.valuation
    ? {
        description: insightsData.instrumentInfo.valuation.description || "N/A",
        discount: insightsData.instrumentInfo.valuation.discount || "N/A",
        relativeValue: insightsData.instrumentInfo.valuation.relativeValue || "N/A",
      }
    : null;

  const companyMetrics = insightsData?.companySnapshot?.company || null;
  const sectorMetrics = insightsData?.companySnapshot?.sector || null;

  const secFilings = parseSECFilings(insightsData);
  const sigDevs = parseSigDevs(insightsData);

  // Detect overreaction (sync — instant)
  const overreactionAlert = detectOverreaction(
    upperSymbol,
    quote,
    valuation,
    technicals,
    companyMetrics,
    sigDevs,
    analyst.rating,
    analyst.targetPrice,
  );

  // PARALLEL: Run sector benchmark + AI research simultaneously (the two slow async calls)
  // Also check AI research cache first — it's valid for 30 min
  const cachedAI = aiResearchCache.get(upperSymbol);
  const aiFromCache = cachedAI && Date.now() - cachedAI.timestamp < AI_RESEARCH_CACHE_TTL ? cachedAI.data : null;

  const [sectorBenchmark, aiResearch] = await Promise.all([
    calculateSectorBenchmark(upperSymbol, quote, valuation),
    aiFromCache
      ? Promise.resolve(aiFromCache)
      : generateDeepResearch(upperSymbol, companyName, quote, valuation, technicals, dividends, overreactionAlert),
  ]);

  // Cache AI research separately with longer TTL
  if (aiResearch && !aiFromCache) {
    aiResearchCache.set(upperSymbol, { data: aiResearch, timestamp: Date.now() });
  }

  const result: DeepDiveResearch = {
    symbol: upperSymbol,
    companyName,
    sector,
    quote,
    analyst,
    shortTermOutlook,
    intermediateTermOutlook,
    longTermOutlook,
    keyTechnicals,
    valuationInsight,
    companyMetrics,
    sectorMetrics,
    dividends,
    splits,
    insiders,
    secFilings,
    sigDevs,
    overreactionAlert,
    valuation,
    sectorBenchmark,
    technicals,
    projections,
    aiResearch,
    lastUpdated: new Date().toISOString(),
  };

  // Cache the result
  deepDiveCache.set(upperSymbol, { data: result, timestamp: Date.now() });
  console.log(`[DeepDive] Research complete for ${upperSymbol}`);

  return result;
}
