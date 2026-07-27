import { callDataApi } from "./_core/dataApi";
import { invokeLLM } from "./_core/llm";

// ============================================================
// MARKET DATA SERVICE
// Real-time data from Yahoo Finance + calculated technicals
// ============================================================

// --- Types ---

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
}

export interface TechnicalLevels {
  monthly20MA: number;
  upperBB: number;
  lowerBB: number;
  distToMA20Pct: number;
  distToLowerBBPct: number;
  touchingMA20: boolean;
  touchingLowerBB: boolean;
  allTimeHigh: number;
  drawdownPct: number;
}

export interface CorrectionAlert {
  symbol: string;
  currentPrice: number;
  allTimeHigh: number;
  drawdownPct: number;
  status: "Normal" | "Pullback" | "Correction" | "Deep Correction" | "Bear Market";
  message: string;
}

export interface DCAZone {
  price: number;
  label: string;
  status: "Active" | "Pending" | "Hit";
  description: string;
}

export interface PeerComparison {
  peerGroup: string;
  rank: number;
  totalPeers: number;
  relativeValue: "Best Value" | "Good Value" | "Fair Value" | "Overvalued" | "N/A";
  fwdPEvsMedian: number | null; // % above/below peer median forward PE
  drawdownVsMedian: number | null; // how much more/less drawdown vs peer median
  pegVsMedian: number | null; // PEG ratio vs peer median
  verdict: string;
}

export interface InvestmentRadarItem {
  symbol: string;
  company: string;
  sector: string;
  category: "Mag 7" | "Index ETF" | "Growth";
  quote: StockQuote;
  technicals: TechnicalLevels;
  dcaZones: DCAZone[];
  signalStatus: "Deploy Now" | "Good Buy" | "Approaching" | "On Watch" | "Not Yet";
  valuation: ValuationData;
  sectorBenchmark: SectorBenchmark | null;
  peerComparison: PeerComparison | null;
  bullCase: string;
  whyStillSolid: string;
  investmentHorizon: string;
  projections: StockProjections;
  lastUpdated: string;
}

export interface ValuationData {
  peRatio: number | null;
  forwardPE: number | null;
  pegRatio: number | null;
  historicalAvgPE: number;
  discountVsHistorical: number | null;
  freeCashFlow: string;
  revenueGrowth: string;
  earningsGrowthEstimate: string;
  valuationVerdict: string;
}

export type Strategy = "Bounce" | "SSL" | "Breakout";

export interface StrategyWatchItem {
  symbol: string;
  company: string;
  sector: string;
  currentPrice: number;
  strategy: Strategy;
  level: number; // key support (Bounce/SSL) or resistance (Breakout)
  distToLevelPct: number;
  status: "Watching" | "Approaching" | "Bouncing" | "SSL Breached" | "Breakout";
  timeframe: "Daily" | "Weekly" | "Monthly";
  volume: number;
  avgVolume: number;
  volumeRatio: number;
  lastUpdated: string;
}

export interface PastWinner {
  symbol: string;
  company: string;
  setupDate: string;
  grade: string;
  totalScore: number;
  entryPrice: number;
  exitPrice: number;
  returnPct: number;
  timeframe: string;
  holdingPeriod: string;
  keyTakeaway: string;
}

export interface ProjectedPrice {
  year: number;
  conservative: number;
  baseCase: number;
  bullCase: number;
}

export interface StockProjections {
  symbol: string;
  currentPrice: number;
  conservativeGrowthRate: number;
  baseCaseGrowthRate: number;
  bullCaseGrowthRate: number;
  projections: ProjectedPrice[];
}

export interface PortfolioAllocation {
  symbol: string;
  company: string;
  weight: number;
  reason: string;
  currentSignal: string;
}

export interface PortfolioPlan {
  riskProfile: string;
  ageGroup: string;
  timeHorizon: number;
  startingCapital: number;
  monthlyContribution: number;
  allocations: PortfolioAllocation[];
  projectedValues: { year: number; conservative: number; baseCase: number; bullCase: number }[];
  coachingTip: string;
}

// --- Stock Universe ---

export const INVESTMENT_UNIVERSE: { symbol: string; company: string; sector: string; category: "Mag 7" | "Index ETF" | "Growth" }[] = [
  { symbol: "AAPL", company: "Apple Inc.", sector: "Technology", category: "Mag 7" },
  { symbol: "MSFT", company: "Microsoft Corp.", sector: "Technology", category: "Mag 7" },
  { symbol: "GOOGL", company: "Alphabet Inc.", sector: "Technology", category: "Mag 7" },
  { symbol: "AMZN", company: "Amazon.com Inc.", sector: "Consumer Cyclical", category: "Mag 7" },
  { symbol: "META", company: "Meta Platforms Inc.", sector: "Technology", category: "Mag 7" },
  { symbol: "NVDA", company: "NVIDIA Corp.", sector: "Technology", category: "Mag 7" },
  { symbol: "TSLA", company: "Tesla Inc.", sector: "Consumer Cyclical", category: "Mag 7" },
  { symbol: "UBER", company: "Uber Technologies Inc.", sector: "Industrials", category: "Growth" },
  { symbol: "SPY", company: "SPDR S&P 500 ETF", sector: "Index", category: "Index ETF" },
  { symbol: "QQQ", company: "Invesco QQQ Trust", sector: "Index", category: "Index ETF" },
  { symbol: "IWM", company: "iShares Russell 2000 ETF", sector: "Index", category: "Index ETF" },
];

// Historical average PE ratios (approximate 10-year averages)
const HISTORICAL_AVG_PE: Record<string, number> = {
  AAPL: 28, MSFT: 32, GOOGL: 27, AMZN: 60, META: 25,
  NVDA: 55, TSLA: 80, UBER: 35, SPY: 22, QQQ: 28, IWM: 20,
};

// Sector ETF mapping for benchmark comparisons
export const SECTOR_ETF_MAP: Record<string, { etf: string; sectorName: string }> = {
  AAPL: { etf: "XLK", sectorName: "Technology" },
  MSFT: { etf: "XLK", sectorName: "Technology" },
  GOOGL: { etf: "XLC", sectorName: "Communication Services" },
  AMZN: { etf: "XLY", sectorName: "Consumer Discretionary" },
  META: { etf: "XLC", sectorName: "Communication Services" },
  NVDA: { etf: "XLK", sectorName: "Technology" },
  TSLA: { etf: "XLY", sectorName: "Consumer Discretionary" },
  UBER: { etf: "XLI", sectorName: "Industrials" },
  SPY: { etf: "SPY", sectorName: "S&P 500" },
  QQQ: { etf: "QQQ", sectorName: "Nasdaq 100" },
  IWM: { etf: "IWM", sectorName: "Russell 2000" },
};

export interface SectorBenchmark {
  sectorETF: string;
  sectorName: string;
  sectorPrice: number;
  sectorChangePct: number;
  stockChangePct: number;
  relativePerformance: number; // stock change - sector change (positive = outperforming)
  relativePE: number | null; // current PE / historical avg PE (< 1 = cheap, > 1 = expensive)
  relativePEVerdict: string;
}

// --- Past Winners Archive ---
export const PAST_WINNERS: PastWinner[] = [
  {
    symbol: "CAG", company: "ConAgra Brands", setupDate: "March 2026",
    grade: "A+", totalScore: 8, entryPrice: 15.72, exitPrice: 17.60,
    returnPct: 12.0, timeframe: "Monthly", holdingPeriod: "1 week",
    keyTakeaway: "Classic bounce setup — swept the multi-year low at $16 and reclaimed it. Institutional volume spike with 65% buy pressure. Hammer candle closed above the sweep level. Ripped 12% in one week."
  },
  {
    symbol: "SPOT", company: "Spotify Technology", setupDate: "February 2026",
    grade: "A+", totalScore: 9, entryPrice: 540.00, exitPrice: 620.00,
    returnPct: 14.8, timeframe: "Monthly", holdingPeriod: "3 weeks",
    keyTakeaway: "A+ bounce setup with dark pool prints confirming institutional accumulation. Swept below the previous month low with massive volume climax. Perfect hammer absorption candle."
  },
  {
    symbol: "PG", company: "Procter & Gamble", setupDate: "January 2026",
    grade: "A", totalScore: 7, entryPrice: 149.90, exitPrice: 158.04,
    returnPct: 5.4, timeframe: "Monthly", holdingPeriod: "2 weeks",
    keyTakeaway: "Swept previous month low with largest buying volume in months. Long wick up reclaiming support near previous month close. Bullish hammer spinning top. Doubled as a breakout trade — risk was breakout failure."
  },
  {
    symbol: "NFLX", company: "Netflix Inc.", setupDate: "2022 Recovery",
    grade: "A+", totalScore: 9, entryPrice: 180.00, exitPrice: 450.00,
    returnPct: 150.0, timeframe: "Monthly", holdingPeriod: "12 months",
    keyTakeaway: "Stock looked dead after crashing from $700 to $180. Institutional money swept the lows, loaded up massively. Classic 'everyone gave up on it' then LIFE. Generational LEAP opportunity."
  },
];

// --- Data Fetching ---

// Per-symbol cache at the data layer — avoids redundant API calls across endpoints
const quoteCache = new Map<string, { data: StockQuote; timestamp: number }>();
const QUOTE_CACHE_TTL = 5 * 60 * 1000; // 5 min — quotes don't need second-by-second for swing trading

// Candle data caches — dramatically reduces API calls
type CandleData = { opens: number[]; closes: number[]; highs: number[]; lows: number[]; volumes: number[]; timestamps: number[] };
const monthlyCache = new Map<string, { data: CandleData; timestamp: number }>();
const MONTHLY_CACHE_TTL = 15 * 60 * 1000; // 15 min — closed bars rarely change, but the LIVE month bar moves intraday
const weeklyCache = new Map<string, { data: CandleData; timestamp: number }>();
const WEEKLY_CACHE_TTL = 15 * 60 * 1000; // 15 min — the live week bar moves intraday
const dailyCache = new Map<string, { data: CandleData; timestamp: number }>();
const DAILY_CACHE_TTL = 15 * 60 * 1000; // 15 min — daily matters during market hours

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  const cached = quoteCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < QUOTE_CACHE_TTL) {
    return cached.data;
  }
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1d",
        range: "5d",
        includeAdjustedClose: "true",
      },
    }) as any;

    if (!response?.chart?.result?.[0]) return null;
    const meta = response.chart.result[0].meta;

    const result: StockQuote = {
      symbol,
      currentPrice: meta.regularMarketPrice ?? 0,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? 0,
      dayHigh: meta.regularMarketDayHigh ?? 0,
      dayLow: meta.regularMarketDayLow ?? 0,
      volume: meta.regularMarketVolume ?? 0,
      avgVolume: meta.averageDailyVolume10Day ?? meta.regularMarketVolume ?? 0,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? 0,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? 0,
      marketCap: 0,
    };
    quoteCache.set(symbol, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error(`[MarketData] Failed to fetch quote for ${symbol}:`, err);
    return null;
  }
}

export async function fetchMonthlyData(symbol: string): Promise<CandleData | null> {
  const cached = monthlyCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < MONTHLY_CACHE_TTL) return cached.data;
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1mo",
        range: "10y",
        includeAdjustedClose: "true",
      },
    }) as any;

    if (!response?.chart?.result?.[0]) return null;
    const result = response.chart.result[0];
    const quotes = result.indicators.quote[0];
    const rawTimestamps = (result.timestamp || []);
    const rawOpens = quotes.open || [];
    const rawCloses = quotes.close || [];
    const rawHighs = quotes.high || [];
    const rawLows = quotes.low || [];
    const rawVolumes = quotes.volume || [];

    // Filter out incomplete current month — only show completed month candles
    // The last candle from Yahoo is always the current (incomplete) month
    const now = new Date();
    const isLastDayOfMonth = now.getDate() === new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dropLast = !isLastDayOfMonth && rawTimestamps.length > 0;
    const endIdx = dropLast ? rawTimestamps.length - 1 : rawTimestamps.length;

    const timestamps: number[] = [];
    const opens: number[] = [];
    const closes: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];
    const volumes: number[] = [];

    for (let i = 0; i < endIdx; i++) {
      if (rawTimestamps[i] != null && rawCloses[i] != null) {
        timestamps.push(rawTimestamps[i]);
        opens.push(rawOpens[i] ?? rawCloses[i]);
        closes.push(rawCloses[i]);
        highs.push(rawHighs[i] ?? rawCloses[i]);
        lows.push(rawLows[i] ?? rawCloses[i]);
        volumes.push(rawVolumes[i] ?? 0);
      }
    }

    const data = { opens, closes, highs, lows, volumes, timestamps };
    monthlyCache.set(symbol, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error(`[MarketData] Failed to fetch monthly data for ${symbol}:`, err);
    // Return stale cache if available
    const stale = monthlyCache.get(symbol);
    if (stale) return stale.data;
    return null;
  }
}

export async function fetchWeeklyData(symbol: string): Promise<CandleData | null> {
  const cached = weeklyCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < WEEKLY_CACHE_TTL) return cached.data;
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1wk",
        range: "2y",
        includeAdjustedClose: "true",
      },
    }) as any;

    if (!response?.chart?.result?.[0]) return null;
    const result = response.chart.result[0];
    const quotes = result.indicators.quote[0];
    const rawTimestamps = (result.timestamp || []);
    const rawOpens = quotes.open || [];
    const rawCloses = quotes.close || [];
    const rawHighs = quotes.high || [];
    const rawLows = quotes.low || [];
    const rawVolumes = quotes.volume || [];

    // Weekly candles = Monday open → Friday 4pm ET close
    // Only show completed weeks. The last candle from Yahoo is the current week.
    // If today is Sat/Sun, the last week is complete (Friday close happened).
    // If today is Mon-Fri before market close, the current week is incomplete — drop it.
    const now = new Date();
    const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const dayOfWeek = etNow.getDay(); // 0=Sun, 6=Sat
    const etHour = etNow.getHours();
    // Week is complete if: Saturday, Sunday, or Friday after 4pm ET
    const isWeekComplete = dayOfWeek === 6 || dayOfWeek === 0 || (dayOfWeek === 5 && etHour >= 16);

    // If the current week is not complete, drop the last candle
    const dropLast = !isWeekComplete && rawTimestamps.length > 0;
    const endIdx = dropLast ? rawTimestamps.length - 1 : rawTimestamps.length;

    const timestamps: number[] = [];
    const opens: number[] = [];
    const closes: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];
    const volumes: number[] = [];

    for (let i = 0; i < endIdx; i++) {
      if (rawTimestamps[i] != null && rawCloses[i] != null) {
        timestamps.push(rawTimestamps[i]);
        opens.push(rawOpens[i] ?? rawCloses[i]);
        closes.push(rawCloses[i]);
        highs.push(rawHighs[i] ?? rawCloses[i]);
        lows.push(rawLows[i] ?? rawCloses[i]);
        volumes.push(rawVolumes[i] ?? 0);
      }
    }

    const data = { opens, closes, highs, lows, volumes, timestamps };
    weeklyCache.set(symbol, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error(`[MarketData] Failed to fetch weekly data for ${symbol}:`, err);
    const stale = weeklyCache.get(symbol);
    if (stale) return stale.data;
    return null;
  }
}

export async function fetchDailyData(symbol: string): Promise<CandleData | null> {
  const cached = dailyCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < DAILY_CACHE_TTL) return cached.data;
  try {
    const response = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol,
        region: "US",
        interval: "1d",
        range: "6mo",
        includeAdjustedClose: "true",
      },
    }) as any;
    if (!response?.chart?.result?.[0]) return null;
    const result = response.chart.result[0];
    const quotes = result.indicators.quote[0];
    const rawTimestamps = (result.timestamp || []);
    const rawOpens = quotes.open || [];
    const rawCloses = quotes.close || [];
    const rawHighs = quotes.high || [];
    const rawLows = quotes.low || [];
    const rawVolumes = quotes.volume || [];

    // Only include completed trading days — each candle = one trading day close at 4pm ET
    // Filter out: weekends, today if market is still open (before 4pm ET), null values
    const now = new Date();
    const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const etHour = etNow.getHours();
    const isMarketClosed = etHour >= 16; // Market closes at 4pm ET
    const todayStr = etNow.toISOString().slice(0, 10);

    const timestamps: number[] = [];
    const opens: number[] = [];
    const closes: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];
    const volumes: number[] = [];

    for (let i = 0; i < rawTimestamps.length; i++) {
      if (rawTimestamps[i] == null || rawCloses[i] == null) continue;

      const candleDate = new Date(rawTimestamps[i] * 1000);
      const candleDay = candleDate.getDay(); // 0=Sun, 6=Sat

      // Skip weekends (Yahoo shouldn't return these but just in case)
      if (candleDay === 0 || candleDay === 6) continue;

      // Skip today's candle if market hasn't closed yet
      const candleDateStr = new Date(candleDate.toLocaleString("en-US", { timeZone: "America/New_York" })).toISOString().slice(0, 10);
      if (candleDateStr === todayStr && !isMarketClosed) continue;

      timestamps.push(rawTimestamps[i]);
      opens.push(rawOpens[i] ?? rawCloses[i]);
      closes.push(rawCloses[i]);
      highs.push(rawHighs[i] ?? rawCloses[i]);
      lows.push(rawLows[i] ?? rawCloses[i]);
      volumes.push(rawVolumes[i] ?? 0);
    }

    const data = { opens, closes, highs, lows, volumes, timestamps };
    dailyCache.set(symbol, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.error(`[MarketData] Failed to fetch daily data for ${symbol}:`, err);
    const stale = dailyCache.get(symbol);
    if (stale) return stale.data;
    return null;
  }
}

// --- Technical Calculations ---

export function calculateTechnicalLevels(
  currentPrice: number,
  closes: number[],
  highs: number[]
): TechnicalLevels {
  const period = 20;
  const allTimeHigh = highs.length > 0 ? Math.max(...highs) : 0;
  const drawdownPct = allTimeHigh > 0 ? ((allTimeHigh - currentPrice) / allTimeHigh) * 100 : 0;

  // Monthly 20 SMA
  const maSlice = closes.slice(-period);
  const monthly20MA = maSlice.length > 0 ? maSlice.reduce((a, b) => a + b, 0) / maSlice.length : 0;

  // Bollinger Bands (20 period, 2 std dev)
  const variance = maSlice.length > 0
    ? maSlice.reduce((sum, val) => sum + Math.pow(val - monthly20MA, 2), 0) / maSlice.length
    : 0;
  const stdDev = Math.sqrt(variance);
  const upperBB = monthly20MA + 2 * stdDev;
  const lowerBB = monthly20MA - 2 * stdDev;

  const distToMA20Pct = monthly20MA > 0 ? ((currentPrice - monthly20MA) / monthly20MA) * 100 : 0;
  const distToLowerBBPct = lowerBB > 0 ? ((currentPrice - lowerBB) / lowerBB) * 100 : 0;

  return {
    monthly20MA: Math.round(monthly20MA * 100) / 100,
    upperBB: Math.round(upperBB * 100) / 100,
    lowerBB: Math.round(lowerBB * 100) / 100,
    distToMA20Pct: Math.round(distToMA20Pct * 10) / 10,
    distToLowerBBPct: Math.round(distToLowerBBPct * 10) / 10,
    touchingMA20: currentPrice <= monthly20MA * 1.02,
    touchingLowerBB: currentPrice <= lowerBB * 1.02,
    allTimeHigh: Math.round(allTimeHigh * 100) / 100,
    drawdownPct: Math.round(drawdownPct * 10) / 10,
  };
}

// --- DCA Zone Calculation ---

export function calculateDCAZones(
  currentPrice: number,
  technicals: TechnicalLevels,
  allTimeHigh: number
): DCAZone[] {
  const { monthly20MA, lowerBB } = technicals;

  // Zone 1: Monthly 20 MA touch (On Watch / first add)
  const zone1Price = Math.round(monthly20MA * 100) / 100;
  const zone1Hit = currentPrice <= monthly20MA * 1.02;

  // Zone 2: Midpoint between 20 MA and lower BB (Good Buy)
  const zone2Price = Math.round(((monthly20MA + lowerBB) / 2) * 100) / 100;
  const zone2Hit = currentPrice <= zone2Price * 1.02;

  // Zone 3: Lower Bollinger Band brush (Aggressive Buy — go heavy)
  const zone3Price = Math.round(lowerBB * 100) / 100;
  const zone3Hit = currentPrice <= lowerBB * 1.02;

  return [
    {
      price: zone1Price,
      label: "Monthly 20 MA Touch",
      status: zone1Hit ? "Hit" : (currentPrice <= monthly20MA * 1.10 ? "Active" : "Pending"),
      description: "Rare event — price touches the monthly 20 MA. Historically happens every few years. Start adding.",
    },
    {
      price: zone2Price,
      label: "Mid-Zone — Good Buy",
      status: zone2Hit ? "Hit" : (zone1Hit ? "Active" : "Pending"),
      description: "Between the 20 MA and lower BB. Solid discount territory. Add more aggressively.",
    },
    {
      price: zone3Price,
      label: "Lower BB Brush — Go Heavy",
      status: zone3Hit ? "Hit" : (zone2Hit ? "Active" : "Pending"),
      description: "Brushing the monthly lower Bollinger Band. Generational discount. Deploy heavy.",
    },
  ];
}

// --- Signal Status ---

export function determineSignalStatus(
  currentPrice: number,
  technicals: TechnicalLevels,
  valuation?: ValuationData | null,
  peerComparison?: PeerComparison | null
): "Deploy Now" | "Good Buy" | "Approaching" | "On Watch" | "Not Yet" {
  // Technical signals alone aren't enough — must also pass valuation check
  const hasGoodValue = peerComparison
    ? (peerComparison.relativeValue === "Best Value" || peerComparison.relativeValue === "Good Value")
    : true; // if no peer data, fall back to technicals only
  const hasFairValue = peerComparison
    ? peerComparison.relativeValue !== "Overvalued"
    : true;

  if (technicals.touchingLowerBB && hasGoodValue) return "Deploy Now";
  if (technicals.touchingLowerBB && hasFairValue) return "Good Buy";
  if (technicals.touchingLowerBB) return "Approaching"; // touching BB but overvalued vs peers
  if (technicals.touchingMA20 && hasGoodValue) return "Good Buy";
  if (technicals.touchingMA20) return "Approaching";
  if (technicals.distToMA20Pct < 5) return "Approaching";
  if (technicals.drawdownPct > 15) return "On Watch";
  return "Not Yet";
}

// --- Peer Comparison for Mag 7 ---

const MAG7_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"];

export function calculatePeerComparison(
  symbol: string,
  valuation: ValuationData,
  drawdownPct: number,
  allPeerData: { symbol: string; valuation: ValuationData; drawdownPct: number }[]
): PeerComparison | null {
  if (!MAG7_SYMBOLS.includes(symbol)) return null;
  const peers = allPeerData.filter(p => MAG7_SYMBOLS.includes(p.symbol));
  if (peers.length < 2) return null;

  // Calculate median forward PE among peers
  const fwdPEs = peers.map(p => p.valuation.forwardPE).filter((v): v is number => v != null).sort((a, b) => a - b);
  const medianFwdPE = fwdPEs.length > 0 ? fwdPEs[Math.floor(fwdPEs.length / 2)] : null;

  // Calculate median PEG among peers
  const pegs = peers.map(p => p.valuation.pegRatio).filter((v): v is number => v != null).sort((a, b) => a - b);
  const medianPEG = pegs.length > 0 ? pegs[Math.floor(pegs.length / 2)] : null;

  // Calculate median drawdown among peers
  const drawdowns = peers.map(p => p.drawdownPct).sort((a, b) => a - b);
  const medianDrawdown = drawdowns[Math.floor(drawdowns.length / 2)];

  // This stock's metrics
  const myFwdPE = valuation.forwardPE;
  const myPEG = valuation.pegRatio;

  const fwdPEvsMedian = myFwdPE != null && medianFwdPE != null
    ? Math.round(((myFwdPE - medianFwdPE) / medianFwdPE) * 100 * 10) / 10
    : null;
  const drawdownVsMedian = Math.round((drawdownPct - medianDrawdown) * 10) / 10;
  const pegVsMedian = myPEG != null && medianPEG != null
    ? Math.round(((myPEG - medianPEG) / medianPEG) * 100 * 10) / 10
    : null;

  // Rank by composite score: lower forward PE + higher drawdown + lower PEG = better value
  const scored = peers.map(p => {
    let score = 0;
    if (p.valuation.forwardPE != null && medianFwdPE != null) {
      score += (medianFwdPE - p.valuation.forwardPE) / medianFwdPE * 100; // lower PE = higher score
    }
    score += (p.drawdownPct - medianDrawdown); // more drawdown = higher score
    if (p.valuation.pegRatio != null && medianPEG != null) {
      score += (medianPEG - p.valuation.pegRatio) / medianPEG * 50; // lower PEG = higher score
    }
    return { symbol: p.symbol, score };
  }).sort((a, b) => b.score - a.score);

  const rank = scored.findIndex(s => s.symbol === symbol) + 1;

  // Determine relative value label
  let relativeValue: PeerComparison["relativeValue"] = "Fair Value";
  if (rank <= 2) relativeValue = "Best Value";
  else if (rank <= 4) relativeValue = "Good Value";
  else if (rank <= 5) relativeValue = "Fair Value";
  else relativeValue = "Overvalued";

  // Build verdict
  let verdict = "";
  if (relativeValue === "Best Value") {
    verdict = `${symbol} ranks #${rank} among Mag 7 for relative value. Forward PE and drawdown make this one of the best deployment opportunities right now.`;
  } else if (relativeValue === "Good Value") {
    verdict = `${symbol} ranks #${rank} among Mag 7. Decent relative value but not the cheapest in the peer group.`;
  } else if (relativeValue === "Fair Value") {
    verdict = `${symbol} ranks #${rank} among Mag 7. Trading near peer median — not a standout value vs peers.`;
  } else {
    verdict = `${symbol} ranks #${rank} of ${peers.length} among Mag 7. Still relatively expensive vs peers — better opportunities exist in the group.`;
  }

  return {
    peerGroup: "Mag 7",
    rank,
    totalPeers: peers.length,
    relativeValue,
    fwdPEvsMedian,
    drawdownVsMedian,
    pegVsMedian,
    verdict,
  };
}

// --- Correction Alerts ---

export function calculateCorrectionAlert(
  symbol: string,
  currentPrice: number,
  allTimeHigh: number
): CorrectionAlert {
  const drawdownPct = allTimeHigh > 0 ? ((allTimeHigh - currentPrice) / allTimeHigh) * 100 : 0;
  const roundedDrawdown = Math.round(drawdownPct * 10) / 10;

  let status: CorrectionAlert["status"];
  let message: string;

  if (roundedDrawdown >= 20) {
    status = "Bear Market";
    message = `${symbol} is in BEAR MARKET territory — down ${roundedDrawdown}% from ATH. Maximum deployment zone.`;
  } else if (roundedDrawdown >= 15) {
    status = "Deep Correction";
    message = `${symbol} in DEEP CORRECTION — down ${roundedDrawdown}% from ATH. Aggressive buying zone.`;
  } else if (roundedDrawdown >= 10) {
    status = "Correction";
    message = `${symbol} in CORRECTION territory — down ${roundedDrawdown}% from ATH. Start deploying capital.`;
  } else if (roundedDrawdown >= 5) {
    status = "Pullback";
    message = `${symbol} in pullback — down ${roundedDrawdown}% from ATH. Watch for further weakness.`;
  } else {
    status = "Normal";
    message = `${symbol} trading near highs — only ${roundedDrawdown}% from ATH.`;
  }

  return { symbol, currentPrice, allTimeHigh, drawdownPct: roundedDrawdown, status, message };
}

// --- Valuation Data ---

// Valuation cache — 24 hour TTL so LLM isn't called on every request
const valuationCache = new Map<string, { data: ValuationData; timestamp: number }>();
const VALUATION_CACHE_TTL = 24 * 60 * 60 * 1000;

export async function calculateValuation(
  symbol: string,
  currentPrice: number,
  drawdownPct: number
): Promise<ValuationData> {
  const cacheKey = `${symbol}_${Math.round(currentPrice)}`;
  const cached = valuationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < VALUATION_CACHE_TTL) {
    return cached.data;
  }

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a financial data analyst. Return ONLY valid JSON. Use the most recent publicly available financial data. All numbers must be based on real reported earnings, analyst consensus estimates, and actual financial statements. Do not make up numbers."
        },
        {
          role: "user",
          content: `For ${symbol} at current price $${currentPrice.toFixed(2)} (down ${drawdownPct.toFixed(1)}% from ATH), provide real-time valuation metrics using the latest available financial data:

1. "peRatio": Current trailing P/E ratio (price / trailing 12-month EPS). Use actual reported EPS.
2. "forwardPE": Forward P/E ratio (price / consensus forward EPS estimate for next fiscal year)
3. "pegRatio": PEG ratio (forward PE / expected earnings growth rate). null for ETFs.
4. "historicalAvgPE": The stock's own 5-year average P/E ratio
5. "freeCashFlow": Latest annual free cash flow as a string like "$85B" or "$12.5B"
6. "revenueGrowth": Latest YoY revenue growth as string like "+12%" or "-3%"
7. "earningsGrowthEstimate": Consensus forward earnings growth estimate as string like "+15% est. FY26"

For ETFs (SPY, QQQ, IWM, etc.), use the index-level PE and set pegRatio to null.

Return JSON: {"peRatio": number|null, "forwardPE": number|null, "pegRatio": number|null, "historicalAvgPE": number, "freeCashFlow": "string", "revenueGrowth": "string", "earningsGrowthEstimate": "string"}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "valuation_data",
          strict: true,
          schema: {
            type: "object",
            properties: {
              peRatio: { type: ["number", "null"], description: "Trailing PE ratio" },
              forwardPE: { type: ["number", "null"], description: "Forward PE ratio" },
              pegRatio: { type: ["number", "null"], description: "PEG ratio" },
              historicalAvgPE: { type: "number", description: "5-year average PE" },
              freeCashFlow: { type: "string", description: "Annual FCF" },
              revenueGrowth: { type: "string", description: "YoY revenue growth" },
              earningsGrowthEstimate: { type: "string", description: "Forward earnings growth" },
            },
            required: ["peRatio", "forwardPE", "pegRatio", "historicalAvgPE", "freeCashFlow", "revenueGrowth", "earningsGrowthEstimate"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = result?.choices?.[0]?.message?.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    const discountVsHistorical = parsed.forwardPE != null && parsed.historicalAvgPE
      ? Math.round(((parsed.historicalAvgPE - parsed.forwardPE) / parsed.historicalAvgPE) * 100 * 10) / 10
      : null;

    let verdict = "Fair value";
    if (discountVsHistorical != null) {
      if (discountVsHistorical > 20) verdict = "Significantly undervalued vs historical";
      else if (discountVsHistorical > 10) verdict = "Trading at a discount to historical average";
      else if (discountVsHistorical > 0) verdict = "Slightly below historical average";
      else if (discountVsHistorical > -10) verdict = "Near fair value";
      else verdict = "Premium to historical average";
    }

    const valuationData: ValuationData = {
      peRatio: parsed.peRatio,
      forwardPE: parsed.forwardPE,
      pegRatio: parsed.pegRatio,
      historicalAvgPE: parsed.historicalAvgPE || 25,
      discountVsHistorical,
      freeCashFlow: parsed.freeCashFlow || "N/A",
      revenueGrowth: parsed.revenueGrowth || "N/A",
      earningsGrowthEstimate: parsed.earningsGrowthEstimate || "N/A",
      valuationVerdict: verdict,
    };

    valuationCache.set(cacheKey, { data: valuationData, timestamp: Date.now() });
    return valuationData;
  } catch (err) {
    console.error(`[Valuation] LLM calculation failed for ${symbol}:`, err);
    // Return empty data on failure
    return {
      peRatio: null,
      forwardPE: null,
      pegRatio: null,
      historicalAvgPE: 25,
      discountVsHistorical: null,
      freeCashFlow: "N/A",
      revenueGrowth: "N/A",
      earningsGrowthEstimate: "N/A",
      valuationVerdict: "Data unavailable",
    };
  }
}

// --- Bull Case Research (LLM-powered) ---

const bullCaseCache = new Map<string, { text: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function generateBullCase(symbol: string, company: string, drawdownPct: number): Promise<{ bullCase: string; whyStillSolid: string }> {
  const cached = bullCaseCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    const parsed = JSON.parse(cached.text);
    return parsed;
  }

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a concise financial analyst. Provide brief, factual analysis. No disclaimers. Be direct and data-driven. Return valid JSON only."
        },
        {
          role: "user",
          content: `For ${company} (${symbol}), currently down ${drawdownPct.toFixed(1)}% from all-time highs, provide:
1. "bullCase": A 2-3 sentence CliffsNotes bull case for why this is still a great long-term investment (5+ year horizon). Focus on competitive moats, revenue drivers, and growth catalysts.
2. "whyStillSolid": A 1-2 sentence explanation of why the company fundamentals are still strong despite the selloff.

Return as JSON: {"bullCase": "...", "whyStillSolid": "..."}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "bull_case",
          strict: true,
          schema: {
            type: "object",
            properties: {
              bullCase: { type: "string", description: "2-3 sentence bull case" },
              whyStillSolid: { type: "string", description: "1-2 sentence why still solid" },
            },
            required: ["bullCase", "whyStillSolid"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = result.choices[0]?.message?.content;
    const parsed = typeof content === "string" ? JSON.parse(content) : { bullCase: "Analysis pending.", whyStillSolid: "Fundamentals remain strong." };

    bullCaseCache.set(symbol, { text: JSON.stringify(parsed), timestamp: Date.now() });
    return parsed;
  } catch (err) {
    console.error(`[MarketData] Failed to generate bull case for ${symbol}:`, err);
    return {
      bullCase: `${company} remains a market leader with strong competitive advantages and growing revenue streams. Despite the current selloff, the long-term thesis remains intact.`,
      whyStillSolid: `${company} continues to generate strong free cash flow and maintains dominant market position in its core segments.`,
    };
  }
}

// --- Projected Stock Prices ---

const GROWTH_RATES: Record<string, { conservative: number; baseCase: number; bullCase: number }> = {
  AAPL: { conservative: 8, baseCase: 12, bullCase: 18 },
  MSFT: { conservative: 10, baseCase: 15, bullCase: 22 },
  GOOGL: { conservative: 9, baseCase: 14, bullCase: 20 },
  AMZN: { conservative: 10, baseCase: 16, bullCase: 24 },
  META: { conservative: 10, baseCase: 15, bullCase: 22 },
  NVDA: { conservative: 12, baseCase: 20, bullCase: 30 },
  TSLA: { conservative: 8, baseCase: 18, bullCase: 35 },
  SPY: { conservative: 7, baseCase: 10, bullCase: 14 },
  QQQ: { conservative: 8, baseCase: 12, bullCase: 16 },
  IWM: { conservative: 6, baseCase: 9, bullCase: 13 },
};

export function calculateProjections(symbol: string, currentPrice: number): StockProjections {
  const rates = GROWTH_RATES[symbol] || { conservative: 7, baseCase: 10, bullCase: 15 };
  const years = [5, 10, 15, 20];

  const projections: ProjectedPrice[] = years.map(y => ({
    year: y,
    conservative: Math.round(currentPrice * Math.pow(1 + rates.conservative / 100, y) * 100) / 100,
    baseCase: Math.round(currentPrice * Math.pow(1 + rates.baseCase / 100, y) * 100) / 100,
    bullCase: Math.round(currentPrice * Math.pow(1 + rates.bullCase / 100, y) * 100) / 100,
  }));

  return {
    symbol,
    currentPrice,
    conservativeGrowthRate: rates.conservative,
    baseCaseGrowthRate: rates.baseCase,
    bullCaseGrowthRate: rates.bullCase,
    projections,
  };
}

// --- Portfolio Builder ---

const COACHING_TIPS: Record<string, string> = {
  aggressive: "Your aggressive profile means you can weather volatility for higher returns. Our coaches can help you time entries during corrections for maximum impact. Book a session to build your personalized deployment strategy.",
  moderate: "A balanced approach is smart. Our coaches specialize in helping you identify the right moments to deploy capital — like when Mag 7 stocks hit DCA zones. Let's build your plan together.",
  conservative: "Capital preservation is key at your stage. Our coaches can help you build a rock-solid foundation with quality names at the right prices. Schedule a session to get your personalized roadmap.",
};

export function buildPortfolioPlan(
  age: number,
  riskTolerance: "conservative" | "moderate" | "aggressive",
  startingCapital: number,
  monthlyContribution: number,
  signalData?: { symbol: string; signalStatus: string }[]
): PortfolioPlan {
  const timeHorizon = Math.max(5, Math.min(40, 65 - age));
  let ageGroup: string;
  if (age < 30) ageGroup = "20s — Maximum Growth Phase";
  else if (age < 40) ageGroup = "30s — Aggressive Growth Phase";
  else if (age < 50) ageGroup = "40s — Growth & Stability Phase";
  else if (age < 60) ageGroup = "50s — Balanced Growth Phase";
  else ageGroup = "60+ — Capital Preservation Phase";

  // Base allocations by risk profile
  const baseAllocations: Record<string, { etf: number; mag7: number }> = {
    aggressive: { etf: 30, mag7: 70 },
    moderate: { etf: 50, mag7: 50 },
    conservative: { etf: 70, mag7: 30 },
  };

  // Adjust for age
  const ageAdjustment = Math.max(0, (age - 30) * 0.5);
  const base = baseAllocations[riskTolerance] || baseAllocations.moderate;
  const etfWeight = Math.min(80, base.etf + ageAdjustment);
  const mag7Weight = 100 - etfWeight;

  // Build allocations — favor stocks currently in discount zones
  const allocations: PortfolioAllocation[] = [];

  // ETF portion
  const spyWeight = etfWeight * 0.6;
  const qqqWeight = etfWeight * 0.3;
  const iwmWeight = etfWeight * 0.1;

  allocations.push(
    { symbol: "SPY", company: "SPDR S&P 500 ETF", weight: Math.round(spyWeight), reason: "Core broad market exposure. The foundation of any portfolio.", currentSignal: signalData?.find(s => s.symbol === "SPY")?.signalStatus || "On Watch" },
    { symbol: "QQQ", company: "Invesco QQQ Trust", weight: Math.round(qqqWeight), reason: "Tech-heavy growth exposure. Outperforms in bull markets.", currentSignal: signalData?.find(s => s.symbol === "QQQ")?.signalStatus || "On Watch" },
    { symbol: "IWM", company: "iShares Russell 2000", weight: Math.round(iwmWeight), reason: "Small-cap diversification. Tends to lead in recoveries.", currentSignal: signalData?.find(s => s.symbol === "IWM")?.signalStatus || "On Watch" },
  );

  // Mag 7 portion — distribute based on current discount levels
  const mag7Stocks = ["MSFT", "GOOGL", "AAPL", "AMZN", "META", "NVDA", "TSLA"];
  const mag7Names: Record<string, string> = { MSFT: "Microsoft", GOOGL: "Alphabet", AAPL: "Apple", AMZN: "Amazon", META: "Meta", NVDA: "NVIDIA", TSLA: "Tesla" };
  const mag7Reasons: Record<string, string> = {
    MSFT: "Cloud + AI leader. Azure growing 30%+ YoY. Most diversified tech giant.",
    GOOGL: "Search monopoly + YouTube + Cloud. Cheapest Mag 7 on forward PE.",
    AAPL: "Ecosystem lock-in. Services revenue growing. Massive buyback program.",
    AMZN: "AWS dominance + retail scale. Margin expansion story just beginning.",
    META: "Digital ad duopoly. AI investments driving engagement. Cheap on PE.",
    NVDA: "AI infrastructure monopoly. Data center revenue exploding.",
    TSLA: "EV + Energy + AI/Robotics optionality. High risk, high reward.",
  };

  const perStock = mag7Weight / mag7Stocks.length;
  for (const sym of mag7Stocks) {
    allocations.push({
      symbol: sym,
      company: mag7Names[sym] || sym,
      weight: Math.round(perStock * 10) / 10,
      reason: mag7Reasons[sym] || "Quality growth stock.",
      currentSignal: signalData?.find(s => s.symbol === sym)?.signalStatus || "On Watch",
    });
  }

  // Projected portfolio values
  // TF Strategy: 18% avg (10% base + bear market deploying)
  // Mutual Fund: 7% avg after fees
  const tfRate = riskTolerance === "aggressive" ? 0.18 : riskTolerance === "moderate" ? 0.14 : 0.10;
  const mutualFundRate = 0.07;

  const projectedValues = [5, 10, 15, 20, 25, 30].filter(y => y <= timeHorizon + 5).map(year => {
    // Future value with monthly contributions: FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
    const monthlyRate = tfRate / 12;
    const months = year * 12;
    const tfFV = startingCapital * Math.pow(1 + monthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const mfMonthlyRate = mutualFundRate / 12;
    const mfFV = startingCapital * Math.pow(1 + mfMonthlyRate, months) +
      monthlyContribution * ((Math.pow(1 + mfMonthlyRate, months) - 1) / mfMonthlyRate);

    // Conservative TF (lower bound)
    const conservativeRate = (tfRate * 0.6) / 12;
    const consFV = startingCapital * Math.pow(1 + conservativeRate, months) +
      monthlyContribution * ((Math.pow(1 + conservativeRate, months) - 1) / conservativeRate);

    return {
      year,
      conservative: Math.round(consFV),
      baseCase: Math.round(tfFV),
      bullCase: Math.round(tfFV * 1.3),
      mutualFund: Math.round(mfFV),
    };
  });

  return {
    riskProfile: riskTolerance,
    ageGroup,
    timeHorizon,
    startingCapital,
    monthlyContribution,
    allocations,
    projectedValues,
    coachingTip: COACHING_TIPS[riskTolerance] || COACHING_TIPS.moderate,
  };
}

// --- Key Level Detection (support & resistance) ---

export function findSupportLevels(lows: number[], period: number = 3): number[] {
  // Find significant swing lows that act as key support (sell-side liquidity pools)
  // A true swing low must be lower than bars on BOTH left AND right sides
  const rawLevels: { price: number; index: number }[] = [];
  for (let i = period; i < lows.length - period; i++) {
    const leftLows = lows.slice(i - period, i);
    const rightLows = lows.slice(i + 1, i + 1 + period);
    const isSwingLow = leftLows.every(l => lows[i] <= l) && rightLows.every(l => lows[i] <= l);
    if (isSwingLow) {
      rawLevels.push({ price: Math.round(lows[i] * 100) / 100, index: i });
    }
  }
  // Cluster nearby levels (within 2%) and keep the lowest in each cluster
  const clustered: number[] = [];
  const used = new Set<number>();
  for (const level of rawLevels) {
    if (used.has(level.index)) continue;
    const cluster = [level];
    for (const other of rawLevels) {
      if (other.index === level.index || used.has(other.index)) continue;
      if (Math.abs(other.price - level.price) / level.price < 0.02) {
        cluster.push(other);
        used.add(other.index);
      }
    }
    used.add(level.index);
    const lowest = cluster.reduce((a, b) => (a.price < b.price ? a : b));
    clustered.push(lowest.price);
  }
  // Return unique levels sorted ascending
  return Array.from(new Set(clustered)).sort((a, b) => a - b);
}

export function findResistanceLevels(highs: number[], period: number = 3): number[] {
  // Find significant swing highs that act as key resistance (buy-side liquidity pools)
  // A true swing high must be higher than bars on BOTH left AND right sides
  const rawLevels: { price: number; index: number }[] = [];
  for (let i = period; i < highs.length - period; i++) {
    const leftHighs = highs.slice(i - period, i);
    const rightHighs = highs.slice(i + 1, i + 1 + period);
    const isSwingHigh = leftHighs.every(h => highs[i] >= h) && rightHighs.every(h => highs[i] >= h);
    if (isSwingHigh) {
      rawLevels.push({ price: Math.round(highs[i] * 100) / 100, index: i });
    }
  }
  // Cluster nearby levels (within 2%) and keep the highest in each cluster
  const clustered: number[] = [];
  const used = new Set<number>();
  for (const level of rawLevels) {
    if (used.has(level.index)) continue;
    const cluster = [level];
    for (const other of rawLevels) {
      if (other.index === level.index || used.has(other.index)) continue;
      if (Math.abs(other.price - level.price) / level.price < 0.02) {
        cluster.push(other);
        used.add(other.index);
      }
    }
    used.add(level.index);
    const highest = cluster.reduce((a, b) => (a.price > b.price ? a : b));
    clustered.push(highest.price);
  }
  // Return unique levels sorted ascending
  return Array.from(new Set(clustered)).sort((a, b) => a - b);
}

// --- Sector Benchmark Calculation ---

export async function calculateSectorBenchmark(
  symbol: string,
  stockQuote: StockQuote,
  valuation: ValuationData
): Promise<SectorBenchmark | null> {
  const mapping = SECTOR_ETF_MAP[symbol];
  if (!mapping) return null;

  // If the stock IS the sector ETF, skip benchmark
  if (mapping.etf === symbol) return null;

  try {
    const sectorQuote = await fetchStockQuote(mapping.etf);
    if (!sectorQuote) return null;

    const stockChangePct = stockQuote.previousClose > 0
      ? ((stockQuote.currentPrice - stockQuote.previousClose) / stockQuote.previousClose) * 100
      : 0;
    const sectorChangePct = sectorQuote.previousClose > 0
      ? ((sectorQuote.currentPrice - sectorQuote.previousClose) / sectorQuote.previousClose) * 100
      : 0;

    const relativePerformance = Math.round((stockChangePct - sectorChangePct) * 100) / 100;

    // Relative PE: current PE / historical avg PE
    const historicalAvgPE = HISTORICAL_AVG_PE[symbol] || 25;
    const relativePE = valuation.peRatio != null
      ? Math.round((valuation.peRatio / historicalAvgPE) * 100) / 100
      : null;

    let relativePEVerdict = "N/A";
    if (relativePE != null) {
      if (relativePE < 0.7) relativePEVerdict = "Deeply discounted vs historical";
      else if (relativePE < 0.85) relativePEVerdict = "Below historical average";
      else if (relativePE < 1.0) relativePEVerdict = "Slightly below average";
      else if (relativePE < 1.15) relativePEVerdict = "Near historical average";
      else if (relativePE < 1.3) relativePEVerdict = "Above historical average";
      else relativePEVerdict = "Premium to historical";
    }

    return {
      sectorETF: mapping.etf,
      sectorName: mapping.sectorName,
      sectorPrice: sectorQuote.currentPrice,
      sectorChangePct: Math.round(sectorChangePct * 100) / 100,
      stockChangePct: Math.round(stockChangePct * 100) / 100,
      relativePerformance,
      relativePE,
      relativePEVerdict,
    };
  } catch (err) {
    console.error(`[MarketData] Failed to calculate sector benchmark for ${symbol}:`, err);
    return null;
  }
}

// --- Main Data Aggregation ---

export async function getInvestmentRadarData(): Promise<{
  items: InvestmentRadarItem[];
  correctionAlerts: CorrectionAlert[];
  lastUpdated: string;
}> {
  const items: InvestmentRadarItem[] = [];
  const correctionAlerts: CorrectionAlert[] = [];

  for (const stock of INVESTMENT_UNIVERSE) {
    try {
      const [quote, monthlyData] = await Promise.all([
        fetchStockQuote(stock.symbol),
        fetchMonthlyData(stock.symbol),
      ]);

      if (!quote || !monthlyData) continue;

      const technicals = calculateTechnicalLevels(
        quote.currentPrice,
        monthlyData.closes,
        monthlyData.highs
      );

      const dcaZones = calculateDCAZones(quote.currentPrice, technicals, technicals.allTimeHigh);
      const signalStatus = determineSignalStatus(quote.currentPrice, technicals);
      const valuation = await calculateValuation(stock.symbol, quote.currentPrice, technicals.drawdownPct);

      // Generate correction alert for ETFs
      if (stock.category === "Index ETF" || technicals.drawdownPct >= 10) {
        correctionAlerts.push(
          calculateCorrectionAlert(stock.symbol, quote.currentPrice, technicals.allTimeHigh)
        );
      }

      // Get bull case (async, cached)
      const { bullCase, whyStillSolid } = await generateBullCase(
        stock.symbol, stock.company, technicals.drawdownPct
      );

      // Calculate sector benchmark
      const sectorBenchmark = await calculateSectorBenchmark(stock.symbol, quote, valuation);

      items.push({
        symbol: stock.symbol,
        company: stock.company,
        sector: stock.sector,
        category: stock.category,
        quote,
        technicals,
        dcaZones,
        signalStatus,
        valuation,
        sectorBenchmark,
        peerComparison: null, // populated after all items are built
        bullCase,
        whyStillSolid,
        investmentHorizon: "5+ Years",
        projections: calculateProjections(stock.symbol, quote.currentPrice),
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error(`[MarketData] Error processing ${stock.symbol}:`, err);
    }
  }

  // Calculate peer comparisons now that all items are built
  const allPeerData = items.map(item => ({
    symbol: item.symbol,
    valuation: item.valuation,
    drawdownPct: item.technicals.drawdownPct,
  }));
  for (const item of items) {
    item.peerComparison = calculatePeerComparison(
      item.symbol, item.valuation, item.technicals.drawdownPct, allPeerData
    );
    // Re-evaluate signal status with peer comparison context
    item.signalStatus = determineSignalStatus(
      item.quote.currentPrice, item.technicals, item.valuation, item.peerComparison
    );
  }

  // Sort: Deploy Now first, then by drawdown
  items.sort((a, b) => {
    const signalOrder = { "Deploy Now": 0, "Good Buy": 1, "Approaching": 2, "On Watch": 3, "Not Yet": 4 };
    const aOrder = signalOrder[a.signalStatus] ?? 5;
    const bOrder = signalOrder[b.signalStatus] ?? 5;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.technicals.drawdownPct - a.technicals.drawdownPct;
  });

  return {
    items,
    correctionAlerts: correctionAlerts.filter(a => a.status !== "Normal"),
    lastUpdated: new Date().toISOString(),
  };
}
