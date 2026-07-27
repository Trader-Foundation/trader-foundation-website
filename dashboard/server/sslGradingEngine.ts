// ============================================================
// SSL GRADING ENGINE — The TF Elite 9-Point Scoring System
// Only 7/9+ setups show on the terminal. No noise. Only A-grade.
//
// Scoring:
//   Liquidity (X/3): near-term SSL + further-term SSL
//   Volume Climax (X/3): historical max vs average vs none
//   Absorption Candle (X/3): long wick, close above SSL, doji/hammer/spinning top
//
// Additional Confluence (bonus flags, not scored):
//   RSI bullish divergence, FIB key levels
//
// Alert Schedule:
//   Daily: 2pm ET
//   Weekly: Thursday 3pm ET (watchlist), Friday 3pm ET (execution)
//   Monthly: 5 trading days before month close, narrows as month ends
// ============================================================

import { callDataApi } from "./_core/dataApi";
// import { notifyOwner } from "./_core/notification"; // Notifications disabled
import {
  fetchStockQuote,
  fetchMonthlyData,
  fetchWeeklyData,
  fetchDailyData,
  findSSLLevels,
  INVESTMENT_UNIVERSE,
  SECTOR_ETF_MAP,
  type StockQuote,
} from "./marketData";

// ============================================================
// TYPES
// ============================================================

export type Timeframe = "Daily" | "Weekly" | "Monthly";
export type Grade = "A+" | "A" | "Below Threshold";

export interface SSLGrade {
  symbol: string;
  company: string;
  sector: string;
  timeframe: Timeframe;
  currentPrice: number;

  // Individual scores
  liquidityScore: number; // 0-3
  liquidityDetails: string;
  volumeClimaxScore: number; // 0-3
  volumeClimaxDetails: string;
  absorptionScore: number; // 0-3
  absorptionDetails: string;

  // Total
  totalScore: number; // 0-9
  grade: Grade;

  // Additional confluence (bonus, not scored)
  rsiBullishDivergence: boolean;
  rsiDetails: string;
  fibKeyLevel: boolean;
  fibDetails: string;

  // Key levels
  nearTermSSL: number;
  furtherTermSSL: number;
  distToNearSSLPct: number;

  // Candle data
  lastCandleOpen: number;
  lastCandleClose: number;
  lastCandleHigh: number;
  lastCandleLow: number;
  previousClose: number;

  // Volume data
  lastVolume: number;
  avgVolume: number;
  maxHistoricalVolume: number;
  volumeRatio: number;

  lastUpdated: string;
}

export interface SectorRotation {
  sector: string;
  etf: string;
  currentPrice: number;
  weeklyChangePct: number;
  monthlyChangePct: number;
  threeMonthChangePct: number;
  flowDirection: "INFLOW" | "OUTFLOW" | "NEUTRAL";
  flowStrength: "STRONG" | "MODERATE" | "WEAK";
  interpretation: string;
}

export interface SSLAlertSchedule {
  daily: { nextAlert: string; isAlertTime: boolean };
  weekly: {
    thursdayWatchlist: string;
    fridayExecution: string;
    isThursdayAlert: boolean;
    isFridayAlert: boolean;
  };
  monthly: {
    monthEndDate: string;
    tradingDaysRemaining: number;
    isActive: boolean;
    precision: "WIDE_NET" | "NARROWING" | "PRECISION" | "EXECUTION_DAY";
  };
}

// ============================================================
// ENHANCED DATA FETCHING (with opens & volumes for all timeframes)
// ============================================================

interface OHLCVData {
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
}

async function fetchOHLCV(
  symbol: string,
  interval: string,
  range: string
): Promise<OHLCVData | null> {
  try {
    const response = (await callDataApi("YahooFinance/get_stock_chart", {
      query: { symbol, region: "US", interval, range, includeAdjustedClose: "true" },
    })) as any;
    if (!response?.chart?.result?.[0]) return null;
    const quotes = response.chart.result[0].indicators.quote[0];
    return {
      opens: (quotes.open || []).filter((v: any) => v != null),
      highs: (quotes.high || []).filter((v: any) => v != null),
      lows: (quotes.low || []).filter((v: any) => v != null),
      closes: (quotes.close || []).filter((v: any) => v != null),
      volumes: (quotes.volume || []).filter((v: any) => v != null),
    };
  } catch (err) {
    console.error(`[SSLGrading] Failed to fetch OHLCV for ${symbol} ${interval}:`, err);
    return null;
  }
}

async function fetchTimeframeOHLCV(
  symbol: string,
  timeframe: Timeframe
): Promise<OHLCVData | null> {
  switch (timeframe) {
    case "Monthly":
      return fetchOHLCV(symbol, "1mo", "10y");
    case "Weekly":
      return fetchOHLCV(symbol, "1wk", "2y");
    case "Daily":
      return fetchOHLCV(symbol, "1d", "6mo");
  }
}

// ============================================================
// LIQUIDITY SCORING (X/3)
// ============================================================
// 3 = Near-term SSL AND further-term SSL both swept (price went below both)
// 2 = Near-term SSL swept only
// 1 = Approaching SSL (within 2%) but not swept
// 0 = No SSL setup

function scoreLiquidity(
  currentPrice: number,
  lows: number[]
): { score: number; details: string; nearTermSSL: number; furtherTermSSL: number } {
  const sslLevels = findSSLLevels(lows);
  if (sslLevels.length === 0) {
    return { score: 0, details: "No significant SSL levels identified", nearTermSSL: 0, furtherTermSSL: 0 };
  }

  // Near-term SSL: the closest SSL level below current price (or most recently swept)
  const levelsBelow = sslLevels.filter((l) => l <= currentPrice * 1.02);
  const levelsWellBelow = sslLevels.filter((l) => l < currentPrice * 0.95);

  const nearTermSSL = levelsBelow.length > 0 ? levelsBelow[levelsBelow.length - 1] : 0;
  const furtherTermSSL = levelsBelow.length > 1 ? levelsBelow[levelsBelow.length - 2] : levelsWellBelow.length > 0 ? levelsWellBelow[levelsWellBelow.length - 1] : 0;

  // Check if price swept below SSL levels (went below then came back)
  const lastLow = lows[lows.length - 1];
  const prevLow = lows.length > 1 ? lows[lows.length - 2] : Infinity;

  const sweptNearTerm = nearTermSSL > 0 && (lastLow <= nearTermSSL || prevLow <= nearTermSSL) && currentPrice > nearTermSSL;
  const sweptFurtherTerm = furtherTermSSL > 0 && (lastLow <= furtherTermSSL || prevLow <= furtherTermSSL) && currentPrice > furtherTermSSL;

  if (sweptNearTerm && sweptFurtherTerm) {
    return {
      score: 3,
      details: `DOUBLE SSL SWEEP — Price swept below near-term SSL ($${nearTermSSL.toFixed(2)}) AND further-term SSL ($${furtherTermSSL.toFixed(2)}), now trading above both at $${currentPrice.toFixed(2)}. Maximum liquidity grab confirmed.`,
      nearTermSSL,
      furtherTermSSL,
    };
  }

  if (sweptNearTerm) {
    return {
      score: 2,
      details: `SSL SWEEP — Price swept below near-term SSL ($${nearTermSSL.toFixed(2)}) and recovered above. Institutional liquidity grab confirmed.`,
      nearTermSSL,
      furtherTermSSL,
    };
  }

  // Approaching
  const distPct = nearTermSSL > 0 ? ((currentPrice - nearTermSSL) / nearTermSSL) * 100 : 999;
  if (distPct <= 2) {
    return {
      score: 1,
      details: `APPROACHING SSL — Price is ${distPct.toFixed(1)}% from SSL at $${nearTermSSL.toFixed(2)}. Watch for sweep.`,
      nearTermSSL,
      furtherTermSSL,
    };
  }

  return { score: 0, details: `No active SSL setup. Nearest SSL at $${nearTermSSL.toFixed(2)} (${distPct.toFixed(1)}% away).`, nearTermSSL, furtherTermSSL };
}

// ============================================================
// VOLUME CLIMAX SCORING (X/3)
// ============================================================
// 3 = Largest volume in history (or within top 3 all-time)
// 2 = Larger than average volume (1.5x+ avg)
// 1 = No notable volume increase
// 0 = Below average volume

function scoreVolumeClimax(
  volumes: number[]
): { score: number; details: string; lastVolume: number; avgVolume: number; maxVolume: number; volumeRatio: number } {
  if (volumes.length < 5) {
    return { score: 0, details: "Insufficient volume data", lastVolume: 0, avgVolume: 0, maxVolume: 0, volumeRatio: 0 };
  }

  const lastVolume = volumes[volumes.length - 1];
  const prevVolumes = volumes.slice(0, -1);
  const avgVolume = prevVolumes.reduce((a, b) => a + b, 0) / prevVolumes.length;
  const maxVolume = Math.max(...prevVolumes);
  const volumeRatio = avgVolume > 0 ? lastVolume / avgVolume : 0;

  // Sort all volumes to find percentile
  const sortedVolumes = [...volumes].sort((a, b) => b - a);
  const rank = sortedVolumes.indexOf(lastVolume) + 1;
  const isTopVolume = rank <= 3;

  if (isTopVolume || lastVolume >= maxVolume) {
    return {
      score: 3,
      details: `VOLUME CLIMAX — ${(volumeRatio).toFixed(1)}x average volume. ${rank === 1 ? "LARGEST VOLUME IN HISTORY" : `Top ${rank} volume ever recorded`}. Massive institutional flow confirmed.`,
      lastVolume,
      avgVolume: Math.round(avgVolume),
      maxVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
    };
  }

  if (volumeRatio >= 1.5) {
    return {
      score: 2,
      details: `ELEVATED VOLUME — ${volumeRatio.toFixed(1)}x average volume. Significant institutional participation above normal levels.`,
      lastVolume,
      avgVolume: Math.round(avgVolume),
      maxVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
    };
  }

  if (volumeRatio >= 0.8) {
    return {
      score: 1,
      details: `NORMAL VOLUME — ${volumeRatio.toFixed(1)}x average. No significant volume spike detected.`,
      lastVolume,
      avgVolume: Math.round(avgVolume),
      maxVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
    };
  }

  return {
    score: 0,
    details: `LOW VOLUME — ${volumeRatio.toFixed(1)}x average. Below normal activity.`,
    lastVolume,
    avgVolume: Math.round(avgVolume),
    maxVolume,
    volumeRatio: Math.round(volumeRatio * 100) / 100,
  };
}

// ============================================================
// ABSORPTION CANDLE SCORING (X/3)
// ============================================================
// Checks the last candle for:
//   1. Long wick up closing above SSL (price swept down then recovered)
//   2. Close near previous period close (absorption — sellers absorbed)
//   3. Candle pattern: doji, hammer, or spinning top
//
// 3 = All three criteria met
// 2 = Two criteria met
// 1 = One criterion met
// 0 = No absorption pattern

function scoreAbsorptionCandle(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  nearTermSSL: number
): { score: number; details: string; lastOpen: number; lastClose: number; lastHigh: number; lastLow: number; previousClose: number } {
  if (opens.length < 2 || closes.length < 2) {
    return { score: 0, details: "Insufficient candle data", lastOpen: 0, lastClose: 0, lastHigh: 0, lastLow: 0, previousClose: 0 };
  }

  const lastOpen = opens[opens.length - 1];
  const lastClose = closes[closes.length - 1];
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const previousClose = closes[closes.length - 2];

  const bodySize = Math.abs(lastClose - lastOpen);
  const totalRange = lastHigh - lastLow;
  const lowerWick = Math.min(lastOpen, lastClose) - lastLow;
  const upperWick = lastHigh - Math.max(lastOpen, lastClose);

  let criteriaMetCount = 0;
  const criteriaDetails: string[] = [];

  // Criterion 1: Long wick up closing above SSL
  // The candle's low went below or near SSL, but close is above SSL
  const wickRatio = totalRange > 0 ? lowerWick / totalRange : 0;
  if (nearTermSSL > 0 && lastLow <= nearTermSSL * 1.01 && lastClose > nearTermSSL && wickRatio > 0.3) {
    criteriaMetCount++;
    criteriaDetails.push(`Long wick up closing above SSL ($${nearTermSSL.toFixed(2)}) — swept and recovered`);
  }

  // Criterion 2: Close near previous period close (absorption)
  const closeVsPrevPct = previousClose > 0 ? Math.abs(lastClose - previousClose) / previousClose * 100 : 999;
  if (closeVsPrevPct <= 2.0) {
    criteriaMetCount++;
    criteriaDetails.push(`Close near previous period close ($${previousClose.toFixed(2)} → $${lastClose.toFixed(2)}, ${closeVsPrevPct.toFixed(1)}% diff) — sellers absorbed`);
  }

  // Criterion 3: Candle pattern — doji, hammer, or spinning top
  let candlePattern = "";
  if (totalRange > 0) {
    const bodyPct = bodySize / totalRange;
    const lowerWickPct = lowerWick / totalRange;
    const upperWickPct = upperWick / totalRange;

    // Hammer: small body at top, long lower wick (>60% of range)
    if (bodyPct < 0.35 && lowerWickPct > 0.55 && lastClose >= lastOpen) {
      candlePattern = "HAMMER";
    }
    // Inverted Hammer (bullish in downtrend context)
    else if (bodyPct < 0.35 && upperWickPct > 0.55 && lastClose >= lastOpen) {
      candlePattern = "INVERTED HAMMER";
    }
    // Doji: very small body
    else if (bodyPct < 0.1) {
      candlePattern = "DOJI";
    }
    // Spinning Top: small body with wicks on both sides
    else if (bodyPct < 0.35 && lowerWickPct > 0.2 && upperWickPct > 0.2) {
      candlePattern = "SPINNING TOP";
    }
    // Bullish engulfing-like: large body closing near high
    else if (lastClose > lastOpen && bodyPct > 0.6 && lowerWickPct > 0.2) {
      candlePattern = "BULLISH ABSORPTION";
    }
  }

  if (candlePattern) {
    criteriaMetCount++;
    criteriaDetails.push(`${candlePattern} pattern detected — classic reversal signal`);
  }

  const detailStr = criteriaDetails.length > 0
    ? `${criteriaMetCount}/3 absorption criteria met: ${criteriaDetails.join(". ")}`
    : "No absorption candle pattern detected";

  return {
    score: criteriaMetCount,
    details: detailStr,
    lastOpen,
    lastClose,
    lastHigh,
    lastLow,
    previousClose,
  };
}

// ============================================================
// RSI CALCULATION & BULLISH DIVERGENCE
// ============================================================

function calculateRSI(closes: number[], period: number = 14): number[] {
  const rsiValues: number[] = [];
  if (closes.length < period + 1) return rsiValues;

  let avgGain = 0;
  let avgLoss = 0;

  // Initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }
  avgGain /= period;
  avgLoss /= period;

  rsiValues.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));

  // Subsequent RSI values
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    rsiValues.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }

  return rsiValues;
}

function detectRSIDivergence(
  closes: number[],
  rsiValues: number[]
): { hasDivergence: boolean; details: string } {
  if (rsiValues.length < 10 || closes.length < 10) {
    return { hasDivergence: false, details: "Insufficient data for RSI divergence" };
  }

  // Look at last 10 periods for divergence
  const recentCloses = closes.slice(-10);
  const recentRSI = rsiValues.slice(-10);

  // Find two recent lows in price
  let priceLow1Idx = -1;
  let priceLow2Idx = -1;
  for (let i = 1; i < recentCloses.length - 1; i++) {
    if (recentCloses[i] < recentCloses[i - 1] && recentCloses[i] <= recentCloses[i + 1]) {
      if (priceLow1Idx === -1) priceLow1Idx = i;
      else if (priceLow2Idx === -1) priceLow2Idx = i;
    }
  }

  if (priceLow1Idx === -1 || priceLow2Idx === -1) {
    return { hasDivergence: false, details: "No clear price lows for divergence analysis" };
  }

  // Bullish divergence: price makes lower low, RSI makes higher low
  const priceMakesLowerLow = recentCloses[priceLow2Idx] < recentCloses[priceLow1Idx];
  const rsiMakesHigherLow = recentRSI[priceLow2Idx] > recentRSI[priceLow1Idx];

  if (priceMakesLowerLow && rsiMakesHigherLow) {
    return {
      hasDivergence: true,
      details: `RSI BULLISH DIVERGENCE — Price made lower low ($${recentCloses[priceLow1Idx].toFixed(2)} → $${recentCloses[priceLow2Idx].toFixed(2)}) while RSI made higher low (${recentRSI[priceLow1Idx].toFixed(1)} → ${recentRSI[priceLow2Idx].toFixed(1)}). Momentum shifting bullish.`,
    };
  }

  // Also check if RSI is oversold (below 30) — strong confluence
  const lastRSI = recentRSI[recentRSI.length - 1];
  if (lastRSI < 30) {
    return {
      hasDivergence: true,
      details: `RSI OVERSOLD at ${lastRSI.toFixed(1)} — Extreme selling exhaustion. Watch for reversal.`,
    };
  }

  return { hasDivergence: false, details: `RSI at ${lastRSI.toFixed(1)} — No divergence detected` };
}

// ============================================================
// FIBONACCI KEY LEVELS
// ============================================================

function checkFibLevels(
  currentPrice: number,
  highs: number[],
  lows: number[]
): { atKeyLevel: boolean; details: string } {
  if (highs.length < 5 || lows.length < 5) {
    return { atKeyLevel: false, details: "Insufficient data for FIB analysis" };
  }

  const swingHigh = Math.max(...highs);
  const swingLow = Math.min(...lows.slice(-20)); // Recent 20-period low
  const range = swingHigh - swingLow;

  if (range <= 0) return { atKeyLevel: false, details: "No valid FIB range" };

  // Key FIB levels
  const fibLevels = [
    { level: 0.236, price: swingHigh - range * 0.236 },
    { level: 0.382, price: swingHigh - range * 0.382 },
    { level: 0.5, price: swingHigh - range * 0.5 },
    { level: 0.618, price: swingHigh - range * 0.618 },
    { level: 0.786, price: swingHigh - range * 0.786 },
  ];

  // Check if current price is near any FIB level (within 1.5%)
  for (const fib of fibLevels) {
    const distPct = Math.abs((currentPrice - fib.price) / fib.price) * 100;
    if (distPct <= 1.5) {
      return {
        atKeyLevel: true,
        details: `At FIB ${(fib.level * 100).toFixed(1)}% level ($${fib.price.toFixed(2)}) — Key support/resistance. ${fib.level >= 0.618 ? "GOLDEN ZONE (61.8%+) — highest probability reversal area." : ""}`,
      };
    }
  }

  return { atKeyLevel: false, details: "Not at a key FIB level" };
}

// ============================================================
// MAIN GRADING FUNCTION
// ============================================================

export async function gradeSSLSetup(
  symbol: string,
  timeframe: Timeframe
): Promise<SSLGrade | null> {
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol);
  if (!stockInfo) return null;

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  // Score each criterion
  const liquidity = scoreLiquidity(quote.currentPrice, ohlcv.lows);
  const volumeClimax = scoreVolumeClimax(ohlcv.volumes);
  const absorption = scoreAbsorptionCandle(
    ohlcv.opens,
    ohlcv.highs,
    ohlcv.lows,
    ohlcv.closes,
    liquidity.nearTermSSL
  );

  const totalScore = liquidity.score + volumeClimax.score + absorption.score;
  const grade: Grade = totalScore >= 8 ? "A+" : totalScore >= 7 ? "A" : "Below Threshold";

  // Additional confluence
  const rsiValues = calculateRSI(ohlcv.closes);
  const rsiDivergence = detectRSIDivergence(ohlcv.closes, rsiValues);
  const fibCheck = checkFibLevels(quote.currentPrice, ohlcv.highs, ohlcv.lows);

  return {
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    liquidityScore: liquidity.score,
    liquidityDetails: liquidity.details,
    volumeClimaxScore: volumeClimax.score,
    volumeClimaxDetails: volumeClimax.details,
    absorptionScore: absorption.score,
    absorptionDetails: absorption.details,

    totalScore,
    grade,

    rsiBullishDivergence: rsiDivergence.hasDivergence,
    rsiDetails: rsiDivergence.details,
    fibKeyLevel: fibCheck.atKeyLevel,
    fibDetails: fibCheck.details,

    nearTermSSL: liquidity.nearTermSSL,
    furtherTermSSL: liquidity.furtherTermSSL,
    distToNearSSLPct:
      liquidity.nearTermSSL > 0
        ? Math.round(((quote.currentPrice - liquidity.nearTermSSL) / liquidity.nearTermSSL) * 10000) / 100
        : 0,

    lastCandleOpen: absorption.lastOpen,
    lastCandleClose: absorption.lastClose,
    lastCandleHigh: absorption.lastHigh,
    lastCandleLow: absorption.lastLow,
    previousClose: absorption.previousClose,

    lastVolume: volumeClimax.lastVolume,
    avgVolume: volumeClimax.avgVolume,
    maxHistoricalVolume: volumeClimax.maxVolume,
    volumeRatio: volumeClimax.volumeRatio,

    lastUpdated: new Date().toISOString(),
  };
}

// ============================================================
// SCAN ALL STOCKS FOR A TIMEFRAME (only returns 7/9+)
// ============================================================

export async function scanSSLSetups(
  timeframe: Timeframe,
  minScore: number = 7
): Promise<SSLGrade[]> {
  const results = await Promise.allSettled(
    INVESTMENT_UNIVERSE.map((stock) => gradeSSLSetup(stock.symbol, timeframe))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<SSLGrade | null> =>
        r.status === "fulfilled" && r.value !== null && r.value.totalScore >= minScore
    )
    .map((r) => r.value!)
    .sort((a, b) => b.totalScore - a.totalScore);
}

// ============================================================
// SECTOR ROTATION DETECTION
// ============================================================

const SECTOR_ETFS = [
  { etf: "XLK", sector: "Technology" },
  { etf: "XLY", sector: "Consumer Discretionary" },
  { etf: "XLP", sector: "Consumer Staples" },
  { etf: "XLF", sector: "Financials" },
  { etf: "XLV", sector: "Healthcare" },
  { etf: "XLE", sector: "Energy" },
  { etf: "XLI", sector: "Industrials" },
  { etf: "XLU", sector: "Utilities" },
  { etf: "XLRE", sector: "Real Estate" },
  { etf: "XLB", sector: "Materials" },
  { etf: "XLC", sector: "Communication Services" },
];

export async function detectSectorRotation(): Promise<SectorRotation[]> {
  const rotations: SectorRotation[] = [];

  const results = await Promise.allSettled(
    SECTOR_ETFS.map(async ({ etf, sector }) => {
      const [quote, weeklyData, monthlyData] = await Promise.all([
        fetchStockQuote(etf),
        fetchWeeklyData(etf),
        fetchMonthlyData(etf),
      ]);

      if (!quote || !weeklyData || !monthlyData) return null;

      // Weekly change
      const weeklyCloses = weeklyData.closes;
      const weeklyChangePct =
        weeklyCloses.length >= 2
          ? ((weeklyCloses[weeklyCloses.length - 1] - weeklyCloses[weeklyCloses.length - 2]) /
              weeklyCloses[weeklyCloses.length - 2]) *
            100
          : 0;

      // Monthly change
      const monthlyCloses = monthlyData.closes;
      const monthlyChangePct =
        monthlyCloses.length >= 2
          ? ((monthlyCloses[monthlyCloses.length - 1] - monthlyCloses[monthlyCloses.length - 2]) /
              monthlyCloses[monthlyCloses.length - 2]) *
            100
          : 0;

      // 3-month change
      const threeMonthChangePct =
        monthlyCloses.length >= 4
          ? ((monthlyCloses[monthlyCloses.length - 1] - monthlyCloses[monthlyCloses.length - 4]) /
              monthlyCloses[monthlyCloses.length - 4]) *
            100
          : 0;

      // Determine flow direction
      let flowDirection: "INFLOW" | "OUTFLOW" | "NEUTRAL" = "NEUTRAL";
      let flowStrength: "STRONG" | "MODERATE" | "WEAK" = "WEAK";

      if (monthlyChangePct < -5 && weeklyChangePct < -2) {
        flowDirection = "OUTFLOW";
        flowStrength = monthlyChangePct < -10 ? "STRONG" : "MODERATE";
      } else if (monthlyChangePct > 5 && weeklyChangePct > 2) {
        flowDirection = "INFLOW";
        flowStrength = monthlyChangePct > 10 ? "STRONG" : "MODERATE";
      } else if (Math.abs(monthlyChangePct) > 3) {
        flowDirection = monthlyChangePct > 0 ? "INFLOW" : "OUTFLOW";
        flowStrength = "WEAK";
      }

      let interpretation = "";
      if (flowDirection === "OUTFLOW" && flowStrength === "STRONG") {
        interpretation = `HEAVY OUTFLOW from ${sector} — Money rotating OUT. This creates SSL sweep opportunities in ${sector} stocks. Watch for institutional liquidity grabs.`;
      } else if (flowDirection === "OUTFLOW") {
        interpretation = `Money leaving ${sector}. Potential SSL setups forming as selling pressure creates liquidity pools.`;
      } else if (flowDirection === "INFLOW" && flowStrength === "STRONG") {
        interpretation = `STRONG INFLOW into ${sector} — Institutional money rotating IN. ${sector} stocks are in demand. Momentum plays.`;
      } else if (flowDirection === "INFLOW") {
        interpretation = `Moderate inflow into ${sector}. Sector gaining relative strength.`;
      } else {
        interpretation = `${sector} showing neutral flow. No clear rotation signal.`;
      }

      return {
        sector,
        etf,
        currentPrice: quote.currentPrice,
        weeklyChangePct: Math.round(weeklyChangePct * 100) / 100,
        monthlyChangePct: Math.round(monthlyChangePct * 100) / 100,
        threeMonthChangePct: Math.round(threeMonthChangePct * 100) / 100,
        flowDirection,
        flowStrength,
        interpretation,
      } as SectorRotation;
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled" && r.value) {
      rotations.push(r.value);
    }
  }

  // Sort: outflows first (these create SSL opportunities), then inflows
  rotations.sort((a, b) => {
    const dirOrder = { OUTFLOW: 0, NEUTRAL: 1, INFLOW: 2 };
    const strOrder = { STRONG: 0, MODERATE: 1, WEAK: 2 };
    if (dirOrder[a.flowDirection] !== dirOrder[b.flowDirection]) {
      return dirOrder[a.flowDirection] - dirOrder[b.flowDirection];
    }
    return strOrder[a.flowStrength] - strOrder[b.flowStrength];
  });

  return rotations;
}

// ============================================================
// ALERT SCHEDULE CALCULATOR
// ============================================================

function getEasternTime(): Date {
  // Convert current UTC time to Eastern
  const now = new Date();
  const etString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  return new Date(etString);
}

function getLastTradingDayOfMonth(year: number, month: number): Date {
  // Start from last day of month, work backward to find a weekday
  const lastDay = new Date(year, month + 1, 0);
  while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
    lastDay.setDate(lastDay.getDate() - 1);
  }
  return lastDay;
}

function countTradingDaysUntil(from: Date, to: Date): number {
  let count = 0;
  const current = new Date(from);
  while (current <= to) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function calculateAlertSchedule(): SSLAlertSchedule {
  const et = getEasternTime();
  const hour = et.getHours();
  const minute = et.getMinutes();
  const dayOfWeek = et.getDay(); // 0=Sun, 4=Thu, 5=Fri

  // Daily: 2pm ET
  const isDaily2pm = hour === 14 && minute < 30;
  const nextDailyDate = new Date(et);
  if (hour >= 14) nextDailyDate.setDate(nextDailyDate.getDate() + 1);
  nextDailyDate.setHours(14, 0, 0, 0);
  // Skip weekends
  while (nextDailyDate.getDay() === 0 || nextDailyDate.getDay() === 6) {
    nextDailyDate.setDate(nextDailyDate.getDate() + 1);
  }

  // Weekly: Thursday 3pm (watchlist), Friday 3pm (execution)
  const isThursday3pm = dayOfWeek === 4 && hour === 15 && minute < 30;
  const isFriday3pm = dayOfWeek === 5 && hour === 15 && minute < 30;

  const nextThursday = new Date(et);
  const daysToThursday = (4 - dayOfWeek + 7) % 7 || (hour >= 15 && dayOfWeek === 4 ? 7 : 0);
  nextThursday.setDate(nextThursday.getDate() + daysToThursday);
  nextThursday.setHours(15, 0, 0, 0);

  const nextFriday = new Date(et);
  const daysToFriday = (5 - dayOfWeek + 7) % 7 || (hour >= 15 && dayOfWeek === 5 ? 7 : 0);
  nextFriday.setDate(nextFriday.getDate() + daysToFriday);
  nextFriday.setHours(15, 0, 0, 0);

  // Monthly: 5 trading days before month close
  const lastTradingDay = getLastTradingDayOfMonth(et.getFullYear(), et.getMonth());
  const tradingDaysRemaining = countTradingDaysUntil(et, lastTradingDay);
  const isMonthlyActive = tradingDaysRemaining <= 5;

  let precision: SSLAlertSchedule["monthly"]["precision"] = "WIDE_NET";
  if (tradingDaysRemaining <= 1) precision = "EXECUTION_DAY";
  else if (tradingDaysRemaining <= 2) precision = "PRECISION";
  else if (tradingDaysRemaining <= 3) precision = "NARROWING";

  return {
    daily: {
      nextAlert: nextDailyDate.toISOString(),
      isAlertTime: isDaily2pm,
    },
    weekly: {
      thursdayWatchlist: nextThursday.toISOString(),
      fridayExecution: nextFriday.toISOString(),
      isThursdayAlert: isThursday3pm,
      isFridayAlert: isFriday3pm,
    },
    monthly: {
      monthEndDate: lastTradingDay.toISOString().split("T")[0],
      tradingDaysRemaining,
      isActive: isMonthlyActive,
      precision,
    },
  };
}

// ============================================================
// TIMED ALERT NOTIFICATIONS
// ============================================================

const alertSentToday = new Map<string, string>(); // key -> date string

function shouldSendTimedAlert(key: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return alertSentToday.get(key) !== today;
}

function markTimedAlertSent(key: string): void {
  const today = new Date().toISOString().split("T")[0];
  alertSentToday.set(key, today);
}

export async function checkTimedAlerts(): Promise<void> {
  const schedule = calculateAlertSchedule();

  // Daily 2pm ET alert
  if (schedule.daily.isAlertTime && shouldSendTimedAlert("daily_2pm")) {
    console.log("[SSLGrading] Triggering daily 2pm ET alert...");
    const dailySetups = await scanSSLSetups("Daily", 7);
    if (dailySetups.length > 0) {
      const setupList = dailySetups
        .map(
          (s) =>
            `• ${s.symbol} (${s.company}) — ${s.grade} ${s.totalScore}/9 | $${s.currentPrice.toFixed(2)} | ${s.liquidityDetails.split("—")[0].trim()}`
        )
        .join("\n");

      // notifyOwner disabled — members find data on the terminal
    }
    markTimedAlertSent("daily_2pm");
  }

  // Weekly Thursday 3pm ET — Watchlist
  if (schedule.weekly.isThursdayAlert && shouldSendTimedAlert("weekly_thu_3pm")) {
    console.log("[SSLGrading] Triggering weekly Thursday watchlist alert...");
    const weeklySetups = await scanSSLSetups("Weekly", 7);
    if (weeklySetups.length > 0) {
      const setupList = weeklySetups
        .map(
          (s) =>
            `• ${s.symbol} (${s.company}) — ${s.grade} ${s.totalScore}/9 | $${s.currentPrice.toFixed(2)}\n  Liquidity: ${s.liquidityScore}/3 | Volume: ${s.volumeClimaxScore}/3 | Absorption: ${s.absorptionScore}/3\n  ${s.rsiBullishDivergence ? "✦ RSI Divergence " : ""}${s.fibKeyLevel ? "✦ FIB Key Level" : ""}`
        )
        .join("\n\n");

      // notifyOwner disabled — members find data on the terminal
    }
    markTimedAlertSent("weekly_thu_3pm");
  }

  // Weekly Friday 3pm ET — Execution Day
  if (schedule.weekly.isFridayAlert && shouldSendTimedAlert("weekly_fri_3pm")) {
    console.log("[SSLGrading] Triggering weekly Friday execution alert...");
    const weeklySetups = await scanSSLSetups("Weekly", 7);
    if (weeklySetups.length > 0) {
      const setupList = weeklySetups
        .map(
          (s) =>
            `• ${s.symbol} (${s.company}) — ${s.grade} ${s.totalScore}/9 | $${s.currentPrice.toFixed(2)}\n  ${s.liquidityDetails}\n  ${s.volumeClimaxDetails}\n  ${s.absorptionDetails}`
        )
        .join("\n\n");

      // notifyOwner disabled — members find data on the terminal
    }
    markTimedAlertSent("weekly_fri_3pm");
  }

  // Monthly — 5 days before close
  if (schedule.monthly.isActive && shouldSendTimedAlert(`monthly_${schedule.monthly.precision}`)) {
    console.log(`[SSLGrading] Triggering monthly alert (${schedule.monthly.precision})...`);
    // Adjust minimum score based on precision
    const minScore = schedule.monthly.precision === "WIDE_NET" ? 6 : 7;
    const monthlySetups = await scanSSLSetups("Monthly", minScore);

    if (monthlySetups.length > 0) {
      const precisionLabel = {
        WIDE_NET: "WIDE NET — Casting broad scan, 5 trading days to month close",
        NARROWING: "NARROWING — 3 trading days remaining, filtering to higher conviction",
        PRECISION: "PRECISION — 2 trading days remaining, highest conviction only",
        EXECUTION_DAY: "EXECUTION DAY — Last trading day of the month",
      }[schedule.monthly.precision];

      const setupList = monthlySetups
        .map(
          (s) =>
            `• ${s.symbol} (${s.company}) — ${s.grade} ${s.totalScore}/9 | $${s.currentPrice.toFixed(2)}\n  Liquidity: ${s.liquidityScore}/3 | Volume: ${s.volumeClimaxScore}/3 | Absorption: ${s.absorptionScore}/3\n  ${s.liquidityDetails}\n  ${s.rsiBullishDivergence ? "✦ RSI Divergence " : ""}${s.fibKeyLevel ? "✦ FIB Key Level" : ""}`
        )
        .join("\n\n");

      // notifyOwner disabled — members find data on the terminal
    }
    markTimedAlertSent(`monthly_${schedule.monthly.precision}`);
  }
}

// ============================================================
// CACHE
// ============================================================

const gradingCache = new Map<string, { data: SSLGrade[]; timestamp: number }>();
const GRADING_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export async function getGradedSetups(
  timeframe: Timeframe,
  includeAll: boolean = false
): Promise<SSLGrade[]> {
  const cacheKey = `graded-${timeframe}-${includeAll}`;
  const cached = gradingCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < GRADING_CACHE_TTL) {
    return cached.data;
  }

  const minScore = includeAll ? 0 : 7;
  const results = await scanSSLSetups(timeframe, minScore);
  gradingCache.set(cacheKey, { data: results, timestamp: Date.now() });
  return results;
}

const sectorRotationCache = { data: null as SectorRotation[] | null, timestamp: 0 };
const SECTOR_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function getSectorRotation(): Promise<SectorRotation[]> {
  if (sectorRotationCache.data && Date.now() - sectorRotationCache.timestamp < SECTOR_CACHE_TTL) {
    return sectorRotationCache.data;
  }
  const data = await detectSectorRotation();
  sectorRotationCache.data = data;
  sectorRotationCache.timestamp = Date.now();
  return data;
}
