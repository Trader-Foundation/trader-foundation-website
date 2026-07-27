// ============================================================
// DESIGN: "Institutional Edge" — Bloomberg Terminal Reimagined
// Black (#000) + Gold (#D4AF37) color system
// IBM Plex Mono for data, DM Sans for UI, Playfair Display for titles
// ============================================================

export interface LeapSetup {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  currentPrice: number;
  sslLevel: number;
  sweepDepth: string;
  priceAtSweep: number;
  // Grading /9
  liquidityScore: number; // /3 — SSL sweep quality
  volumeClimax: number; // /3 — institutional volume
  monthlyAbsorption: number; // /3 — candle reversal quality
  totalScore: number;
  grade: string;
  // Additional confluence
  bollingerBand: boolean;
  darkPoolPrints: boolean;
  optionsLiquidity: "High" | "Medium" | "Low";
  fundsBuying: boolean;
  stockBuyback: boolean;
  institutionalAccumulation: boolean;
  // Alert status
  alertStatus: "SSL Breached" | "Forming" | "Watching" | "Confirmed";
  // Candle info
  candlePattern: string;
  // Volume data
  currentVolume: string;
  avgVolume: string;
  buyPressure: number;
  // Risk
  riskNote: string;
  // Dates
  sweepDate: string;
  lastUpdated: string;
  // LEAP suggestion
  suggestedExpiry: string;
  suggestedStrike: string;
  optionsOI: string;
  optionsBidAsk: string;
  daysToMonthEnd: number;
}

export interface InvestmentTarget {
  id: string;
  ticker: string;
  company: string;
  sector: string;
  category: "Mag 7" | "Index ETF" | "Blue Chip";
  currentPrice: number;
  allTimeHigh: number;
  drawdownPercent: number;
  // DCA Zones
  dcaZone1: { price: number; label: string; status: "Active" | "Pending" | "Hit" };
  dcaZone2: { price: number; label: string; status: "Active" | "Pending" | "Hit" };
  dcaZone3: { price: number; label: string; status: "Active" | "Pending" | "Hit" };
  // Signal
  signalStatus: "Deploy Now" | "Approaching" | "On Watch" | "Not Yet";
  bollingerBrush: boolean;
  // Valuation
  peRatio: number;
  forwardPE: number;
  pegRatio: number;
  freeCashFlow: string;
  revenueGrowth: string;
  // Bull case
  bullCase: string;
  keyMetrics: string[];
  whyStillSolid: string;
  // Horizon
  investmentHorizon: string;
  targetReturn: string;
  lastUpdated: string;
}

export const leapSetups: LeapSetup[] = [
  {
    id: "1",
    ticker: "CAG",
    company: "ConAgra Brands, Inc.",
    sector: "Consumer Staples",
    currentPrice: 15.72,
    sslLevel: 16.50,
    sweepDepth: "Deep",
    priceAtSweep: 15.10,
    liquidityScore: 2,
    volumeClimax: 3,
    monthlyAbsorption: 3,
    totalScore: 8,
    grade: "A+",
    bollingerBand: true,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: false,
    institutionalAccumulation: true,
    alertStatus: "Confirmed",
    candlePattern: "Bullish Hammer",
    currentVolume: "48M",
    avgVolume: "209M",
    buyPressure: 65,
    riskNote: "Extended selloff from $28. Recovery play but sector rotation risk remains.",
    sweepDate: "Mar 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$17 Call",
    optionsOI: "12,450",
    optionsBidAsk: "$0.85 / $0.95",
    daysToMonthEnd: 25,
  },
  {
    id: "2",
    ticker: "PG",
    company: "Procter & Gamble Co.",
    sector: "Consumer Staples",
    currentPrice: 149.90,
    sslLevel: 141.80,
    sweepDepth: "Moderate",
    priceAtSweep: 136.65,
    liquidityScore: 1,
    volumeClimax: 3,
    monthlyAbsorption: 3,
    totalScore: 7,
    grade: "A",
    bollingerBand: true,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: true,
    institutionalAccumulation: true,
    alertStatus: "Confirmed",
    candlePattern: "Bullish Hammer / Spinning Top",
    currentVolume: "229M",
    avgVolume: "164M",
    buyPressure: 88,
    riskNote: "Breakout trade — could fail the breakout. Watch for monthly close above SSL.",
    sweepDate: "Jan 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$155 Call",
    optionsOI: "34,200",
    optionsBidAsk: "$8.20 / $8.50",
    daysToMonthEnd: 25,
  },
  {
    id: "3",
    ticker: "SPOT",
    company: "Spotify Technology S.A.",
    sector: "Technology",
    currentPrice: 485.30,
    sslLevel: 470.00,
    sweepDepth: "Deep",
    priceAtSweep: 452.10,
    liquidityScore: 3,
    volumeClimax: 3,
    monthlyAbsorption: 3,
    totalScore: 9,
    grade: "A+",
    bollingerBand: true,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: false,
    institutionalAccumulation: true,
    alertStatus: "Confirmed",
    candlePattern: "Bullish Engulfing",
    currentVolume: "18.5M",
    avgVolume: "12.2M",
    buyPressure: 72,
    riskNote: "Strong reversal from Feb lows. Growth stock — higher beta, higher reward.",
    sweepDate: "Feb 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$500 Call",
    optionsOI: "8,900",
    optionsBidAsk: "$42.00 / $43.50",
    daysToMonthEnd: 25,
  },
  {
    id: "4",
    ticker: "NFLX",
    company: "Netflix, Inc.",
    sector: "Communication Services",
    currentPrice: 865.20,
    sslLevel: 820.00,
    sweepDepth: "Moderate",
    priceAtSweep: 798.50,
    liquidityScore: 2,
    volumeClimax: 2,
    monthlyAbsorption: 3,
    totalScore: 7,
    grade: "A",
    bollingerBand: false,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: true,
    institutionalAccumulation: true,
    alertStatus: "Confirmed",
    candlePattern: "Bullish Hammer",
    currentVolume: "14.2M",
    avgVolume: "9.8M",
    buyPressure: 61,
    riskNote: "Classic dead-then-alive pattern. Valuation stretched but momentum strong.",
    sweepDate: "Mar 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jun 2027",
    suggestedStrike: "$900 Call",
    optionsOI: "15,600",
    optionsBidAsk: "$65.00 / $67.20",
    daysToMonthEnd: 25,
  },
  {
    id: "5",
    ticker: "SPY",
    company: "SPDR S&P 500 ETF Trust",
    sector: "Index ETF",
    currentPrice: 503.80,
    sslLevel: 495.00,
    sweepDepth: "Shallow",
    priceAtSweep: 490.20,
    liquidityScore: 2,
    volumeClimax: 2,
    monthlyAbsorption: 2,
    totalScore: 6,
    grade: "B+",
    bollingerBand: true,
    darkPoolPrints: false,
    optionsLiquidity: "High",
    fundsBuying: false,
    stockBuyback: false,
    institutionalAccumulation: false,
    alertStatus: "Forming",
    candlePattern: "Doji",
    currentVolume: "92M",
    avgVolume: "78M",
    buyPressure: 52,
    riskNote: "Index-level sweep. Macro uncertainty. Watch for monthly close confirmation.",
    sweepDate: "Apr 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Dec 2026",
    suggestedStrike: "$520 Call",
    optionsOI: "245,000",
    optionsBidAsk: "$12.40 / $12.60",
    daysToMonthEnd: 25,
  },
  {
    id: "6",
    ticker: "QQQ",
    company: "Invesco QQQ Trust",
    sector: "Index ETF",
    currentPrice: 418.50,
    sslLevel: 410.00,
    sweepDepth: "Moderate",
    priceAtSweep: 402.30,
    liquidityScore: 2,
    volumeClimax: 3,
    monthlyAbsorption: 2,
    totalScore: 7,
    grade: "A",
    bollingerBand: true,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: false,
    institutionalAccumulation: true,
    alertStatus: "Forming",
    candlePattern: "Long Lower Wick",
    currentVolume: "55M",
    avgVolume: "42M",
    buyPressure: 58,
    riskNote: "Tech-heavy. Tariff/macro risk. Strong volume support at sweep level.",
    sweepDate: "Apr 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$440 Call",
    optionsOI: "189,000",
    optionsBidAsk: "$18.50 / $18.80",
    daysToMonthEnd: 25,
  },
  {
    id: "7",
    ticker: "AMD",
    company: "Advanced Micro Devices",
    sector: "Technology",
    currentPrice: 94.20,
    sslLevel: 90.00,
    sweepDepth: "Deep",
    priceAtSweep: 86.50,
    liquidityScore: 3,
    volumeClimax: 2,
    monthlyAbsorption: 2,
    totalScore: 7,
    grade: "A",
    bollingerBand: true,
    darkPoolPrints: true,
    optionsLiquidity: "High",
    fundsBuying: true,
    stockBuyback: false,
    institutionalAccumulation: true,
    alertStatus: "SSL Breached",
    candlePattern: "Forming — Month Not Closed",
    currentVolume: "68M",
    avgVolume: "52M",
    buyPressure: 55,
    riskNote: "SSL breached but month still open. Wait for absorption candle confirmation.",
    sweepDate: "Apr 2026",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$100 Call",
    optionsOI: "98,500",
    optionsBidAsk: "$8.90 / $9.10",
    daysToMonthEnd: 25,
  },
  {
    id: "8",
    ticker: "DIS",
    company: "The Walt Disney Company",
    sector: "Communication Services",
    currentPrice: 88.40,
    sslLevel: 85.00,
    sweepDepth: "Moderate",
    priceAtSweep: 82.10,
    liquidityScore: 2,
    volumeClimax: 2,
    monthlyAbsorption: 1,
    totalScore: 5,
    grade: "B",
    bollingerBand: false,
    darkPoolPrints: false,
    optionsLiquidity: "High",
    fundsBuying: false,
    stockBuyback: false,
    institutionalAccumulation: false,
    alertStatus: "Watching",
    candlePattern: "Indecision — No Clear Pattern",
    currentVolume: "15M",
    avgVolume: "12M",
    buyPressure: 45,
    riskNote: "Approaching SSL but no sweep yet. Needs volume confirmation.",
    sweepDate: "N/A",
    lastUpdated: "Apr 05, 2026",
    suggestedExpiry: "Jan 2027",
    suggestedStrike: "$95 Call",
    optionsOI: "42,300",
    optionsBidAsk: "$5.20 / $5.50",
    daysToMonthEnd: 25,
  },
];

export const investmentTargets: InvestmentTarget[] = [
  {
    id: "1",
    ticker: "MSFT",
    company: "Microsoft Corporation",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 358.20,
    allTimeHigh: 510.00,
    drawdownPercent: 29.8,
    dcaZone1: { price: 380, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 340, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 300, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 28.5,
    forwardPE: 24.2,
    pegRatio: 1.8,
    freeCashFlow: "$74.1B",
    revenueGrowth: "+16.4% YoY",
    bullCase: "Microsoft remains the dominant enterprise software company globally. Azure cloud is growing 30%+ and is the #2 cloud provider. Copilot AI integration across Office 365 is driving new revenue streams. $74B in free cash flow provides massive buyback and dividend capacity.",
    keyMetrics: ["Azure growing 30%+", "$74B FCF", "Office 365 AI upsell", "Dividend aristocrat trajectory"],
    whyStillSolid: "Enterprise software moat is nearly unbreakable. Every Fortune 500 company runs on Microsoft. Azure + AI positioning makes this a generational compounder. The selloff is macro-driven, not fundamental.",
    investmentHorizon: "5-10 Years",
    targetReturn: "80-120%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "2",
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 152.40,
    allTimeHigh: 220.00,
    drawdownPercent: 30.7,
    dcaZone1: { price: 170, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 145, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 120, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 19.2,
    forwardPE: 16.8,
    pegRatio: 1.1,
    freeCashFlow: "$82.4B",
    revenueGrowth: "+14.2% YoY",
    bullCase: "Google dominates search (92% market share), YouTube is the #2 website globally, and Google Cloud is growing 28%+. Trading at just 16x forward earnings — historically cheap for a company growing revenue 14%+ with $82B in free cash flow.",
    keyMetrics: ["92% search market share", "$82B FCF", "Cloud growing 28%", "YouTube dominance"],
    whyStillSolid: "Search advertising moat is untouchable. AI integration through Gemini strengthens the ecosystem. At 16x forward PE, you're getting a growth company at value prices. The antitrust fears are overblown — even a breakup would unlock value.",
    investmentHorizon: "5-10 Years",
    targetReturn: "90-140%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "3",
    ticker: "META",
    company: "Meta Platforms, Inc.",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 485.60,
    allTimeHigh: 740.00,
    drawdownPercent: 34.4,
    dcaZone1: { price: 550, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 470, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 400, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 22.1,
    forwardPE: 18.5,
    pegRatio: 1.3,
    freeCashFlow: "$52.1B",
    revenueGrowth: "+22.1% YoY",
    bullCase: "Meta owns the social media landscape — Facebook, Instagram, WhatsApp, Threads serve 3.9B daily users. Digital advertising revenue is growing 22%+ YoY. AI-driven ad targeting is getting more efficient. $52B in free cash flow funds massive buybacks.",
    keyMetrics: ["3.9B daily users", "$52B FCF", "22% revenue growth", "AI ad targeting moat"],
    whyStillSolid: "Despite the selloff, Meta generates more free cash flow than most S&P 500 companies combined. The advertising business is a cash machine. Reality Labs losses are priced in. At 18x forward PE with 22% growth, this is absurdly cheap.",
    investmentHorizon: "5-10 Years",
    targetReturn: "100-160%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "4",
    ticker: "AAPL",
    company: "Apple Inc.",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 188.50,
    allTimeHigh: 260.00,
    drawdownPercent: 27.5,
    dcaZone1: { price: 210, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 180, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 155, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: false,
    peRatio: 26.8,
    forwardPE: 23.5,
    pegRatio: 2.1,
    freeCashFlow: "$110.5B",
    revenueGrowth: "+5.2% YoY",
    bullCase: "Apple's ecosystem of 2.2B active devices creates the stickiest customer base in tech. Services revenue ($96B run rate) is growing 14% with 75%+ margins. $110B in free cash flow funds the largest buyback program in history.",
    keyMetrics: ["2.2B active devices", "$110B FCF", "Services growing 14%", "Largest buyback ever"],
    whyStillSolid: "The Apple ecosystem is a toll booth on 2.2 billion people's digital lives. Services revenue alone would be a top-50 S&P 500 company. iPhone replacement cycles + India expansion = decades of growth. Tariff concerns are a buying opportunity.",
    investmentHorizon: "5-10 Years",
    targetReturn: "60-100%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "5",
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 98.50,
    allTimeHigh: 153.00,
    drawdownPercent: 35.6,
    dcaZone1: { price: 120, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 95, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 75, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 38.2,
    forwardPE: 25.1,
    pegRatio: 0.8,
    freeCashFlow: "$62.3B",
    revenueGrowth: "+78.2% YoY",
    bullCase: "NVIDIA owns 90%+ of the AI training chip market. Data center revenue is growing 78%+ YoY. Every major tech company is spending billions on NVIDIA GPUs. Blackwell architecture is sold out through 2027. The AI infrastructure buildout is just beginning.",
    keyMetrics: ["90%+ AI chip share", "78% revenue growth", "Blackwell sold out", "$62B FCF"],
    whyStillSolid: "AI infrastructure spending is a multi-decade trend. NVIDIA has no real competitor in AI training chips. At 25x forward PE with 78% growth, the PEG ratio is 0.8 — meaning you're getting growth at a discount. This selloff is a gift.",
    investmentHorizon: "5-10 Years",
    targetReturn: "120-200%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "6",
    ticker: "AMZN",
    company: "Amazon.com, Inc.",
    sector: "Technology",
    category: "Mag 7",
    currentPrice: 178.30,
    allTimeHigh: 242.00,
    drawdownPercent: 26.3,
    dcaZone1: { price: 200, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 170, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 145, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: false,
    peRatio: 32.5,
    forwardPE: 24.8,
    pegRatio: 1.4,
    freeCashFlow: "$54.8B",
    revenueGrowth: "+12.8% YoY",
    bullCase: "AWS is the #1 cloud provider with 31% market share and growing. E-commerce margins are expanding as logistics network matures. Advertising business ($56B run rate) is the fastest-growing segment. Prime membership creates unmatched customer lock-in.",
    keyMetrics: ["#1 cloud provider", "$54B FCF", "Ad business $56B", "Prime ecosystem"],
    whyStillSolid: "Amazon is three world-class businesses in one: cloud computing, e-commerce, and digital advertising. AWS alone is worth more than most companies. The logistics moat took 20 years and $100B+ to build — no one can replicate it.",
    investmentHorizon: "5-10 Years",
    targetReturn: "80-130%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "7",
    ticker: "TSLA",
    company: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    category: "Mag 7",
    currentPrice: 248.60,
    allTimeHigh: 488.00,
    drawdownPercent: 49.1,
    dcaZone1: { price: 350, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 250, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 180, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 85.2,
    forwardPE: 52.0,
    pegRatio: 2.8,
    freeCashFlow: "$8.2B",
    revenueGrowth: "+8.5% YoY",
    bullCase: "Tesla is more than a car company — it's an AI, energy, and robotics platform. FSD (Full Self-Driving) is approaching Level 4 autonomy. Energy storage business is growing 100%+ YoY. Optimus robot has massive long-term potential. Brand loyalty is unmatched in auto.",
    keyMetrics: ["FSD approaching L4", "Energy +100% YoY", "Optimus robot", "Brand moat"],
    whyStillSolid: "The selloff prices in all the negatives but ignores the optionality. FSD licensing alone could be worth more than the current market cap. Energy storage is becoming a second core business. At 49% off highs, you're getting the optionality for free.",
    investmentHorizon: "5-10 Years",
    targetReturn: "100-250%",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "8",
    ticker: "SPY",
    company: "SPDR S&P 500 ETF Trust",
    sector: "Index ETF",
    category: "Index ETF",
    currentPrice: 503.80,
    allTimeHigh: 613.00,
    drawdownPercent: 17.8,
    dcaZone1: { price: 550, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 490, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 430, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Approaching",
    bollingerBrush: true,
    peRatio: 21.5,
    forwardPE: 18.2,
    pegRatio: 1.6,
    freeCashFlow: "N/A",
    revenueGrowth: "N/A",
    bullCase: "The S&P 500 has returned an average of 10.5% annually over the last 100 years. Every 10%+ correction has been a buying opportunity in hindsight. Dollar cost averaging into SPY during drawdowns is the simplest wealth-building strategy that works.",
    keyMetrics: ["100-year track record", "10.5% avg annual return", "500 best US companies", "Ultimate diversification"],
    whyStillSolid: "This is the US economy in one ticker. Every correction in history has been recovered. At 18% off highs, you're buying the greatest wealth-building vehicle ever created at a discount. Time in the market beats timing the market.",
    investmentHorizon: "5-20 Years",
    targetReturn: "50-80% (5yr)",
    lastUpdated: "Apr 05, 2026",
  },
  {
    id: "9",
    ticker: "QQQ",
    company: "Invesco QQQ Trust",
    sector: "Index ETF",
    category: "Index ETF",
    currentPrice: 418.50,
    allTimeHigh: 540.00,
    drawdownPercent: 22.5,
    dcaZone1: { price: 470, label: "Zone 1 — Initial Entry", status: "Hit" },
    dcaZone2: { price: 410, label: "Zone 2 — Aggressive Add", status: "Active" },
    dcaZone3: { price: 360, label: "Zone 3 — Generational Buy", status: "Pending" },
    signalStatus: "Deploy Now",
    bollingerBrush: true,
    peRatio: 25.8,
    forwardPE: 21.0,
    pegRatio: 1.3,
    freeCashFlow: "N/A",
    revenueGrowth: "N/A",
    bullCase: "QQQ holds the 100 largest non-financial Nasdaq companies — the most innovative businesses in the world. Tech-heavy exposure means you're investing in AI, cloud, and digital transformation. Has outperformed SPY over every 10-year period in recent history.",
    keyMetrics: ["Top 100 Nasdaq companies", "Tech + innovation focus", "Outperforms SPY long-term", "AI/Cloud exposure"],
    whyStillSolid: "Technology is eating the world, and QQQ owns the companies doing the eating. At 22% off highs, you're getting the future of the economy at a discount. Every major correction in QQQ has been followed by new all-time highs.",
    investmentHorizon: "5-15 Years",
    targetReturn: "70-110% (5yr)",
    lastUpdated: "Apr 05, 2026",
  },
];

// Market status helpers
export function getDaysToMonthEnd(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
}

export function isScreeningWindow(): boolean {
  return getDaysToMonthEnd() <= 5;
}

export function getScreeningStatus(): { label: string; color: string; description: string } {
  const days = getDaysToMonthEnd();
  if (days <= 5) {
    return {
      label: "SCREENING ACTIVE",
      color: "text-green-400",
      description: `${days} days until month close — Active screening window`,
    };
  } else if (days <= 10) {
    return {
      label: "PRE-SCREENING",
      color: "text-yellow-400",
      description: `${days} days until month close — Building watchlist`,
    };
  } else {
    return {
      label: "MONITORING",
      color: "text-muted-foreground",
      description: `${days} days until month close — Monitoring levels`,
    };
  }
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+": return "text-[#D4AF37]";
    case "A": return "text-[#C4A265]";
    case "B+": return "text-[#8B9A6B]";
    case "B": return "text-[#6B8B9A]";
    case "C": return "text-[#9A6B6B]";
    default: return "text-muted-foreground";
  }
}

export function getGradeBg(grade: string): string {
  switch (grade) {
    case "A+": return "bg-[#D4AF37]/20 border-[#D4AF37]/50";
    case "A": return "bg-[#C4A265]/15 border-[#C4A265]/40";
    case "B+": return "bg-[#8B9A6B]/15 border-[#8B9A6B]/40";
    case "B": return "bg-[#6B8B9A]/15 border-[#6B8B9A]/40";
    case "C": return "bg-[#9A6B6B]/15 border-[#9A6B6B]/40";
    default: return "bg-muted/15 border-muted/40";
  }
}

export function getAlertColor(status: string): string {
  switch (status) {
    case "SSL Breached": return "text-red-400 bg-red-400/10 border-red-400/30";
    case "Bouncing": return "text-green-400 bg-green-400/10 border-green-400/30";
    case "Breakout": return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30";
    case "Approaching": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    case "Confirmed": return "text-green-400 bg-green-400/10 border-green-400/30";
    case "Forming": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    case "Watching": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    default: return "text-muted-foreground bg-muted/10 border-muted/30";
  }
}

export function getSignalColor(status: string): string {
  switch (status) {
    case "Deploy Now": return "text-green-400 bg-green-400/10 border-green-400/30";
    case "Approaching": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    case "On Watch": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    case "Not Yet": return "text-muted-foreground bg-muted/10 border-muted/30";
    default: return "text-muted-foreground bg-muted/10 border-muted/30";
  }
}

export function getDCAZoneColor(status: string): string {
  switch (status) {
    case "Hit": return "text-green-400";
    case "Active": return "text-yellow-400";
    case "Pending": return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
}
