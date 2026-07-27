// ============================================================
// STRATEGY ENGINE — The TF Elite 9-Point Scoring System
// Three strategies, one grading scale. Only 7/9+ setups show on
// the terminal. No noise. Only A-grade.
//
// BOUNCE — price taps a key support zone, holds it, and reverses.
//   Support Bounce (X/3) + Volume Confirmation (X/3) + Reversal Candle (X/3)
//   Confluence (bonus flags): RSI bullish divergence, FIB key levels
//   >>> PROVISIONAL: the TF Bounce setup is a unique methodology and
//   >>> its official criteria are coming from Vlad. The scoring below
//   >>> is a placeholder (touch-and-hold logic). Each criterion is an
//   >>> isolated function — swap them out when the real spec lands.
//
// SSL (Sell-Side Liquidity) — price sweeps BELOW a key low to grab
// liquidity, absorbs the selling, and reclaims the level.
//   Liquidity (X/3) + Volume Climax (X/3) + Absorption Candle (X/3)
//   Confluence (bonus flags): RSI bullish divergence, FIB key levels
//
// BREAKOUT — price breaks above a key resistance level with
// volume behind the move and a conviction close.
//   Resistance Break (X/3) + Volume Expansion (X/3) + Breakout Candle (X/3)
//   Confluence (bonus flags): RSI momentum, period-high zone
//
// Alert Schedule:
//   Daily: 2pm ET
//   Weekly: Thursday 3pm ET (watchlist), Friday 3pm ET (execution)
//   Monthly: 5 trading days before month close, narrows as month ends
// ============================================================

import { callDataApi } from "./_core/dataApi";
import {
  fetchStockQuote,
  fetchMonthlyData,
  fetchWeeklyData,
  findSupportLevels,
  findResistanceLevels,
  INVESTMENT_UNIVERSE,
  type Strategy,
} from "./marketData";

export type { Strategy };

// ============================================================
// TYPES
// ============================================================

export type Timeframe = "Daily" | "Weekly" | "Monthly";
export type Grade = "A+" | "A" | "Below Threshold";

export interface GradeCriterion {
  key: "level" | "volume" | "candle";
  label: string;
  score: number; // 0-3
  max: number; // always 3
  details: string;
}

export interface ConfluenceFlag {
  key: string;
  label: string;
  active: boolean;
  details: string;
}

export interface SetupGrade {
  strategy: Strategy;
  symbol: string;
  company: string;
  sector: string;
  timeframe: Timeframe;
  currentPrice: number;

  // The three scored criteria (order: level, volume, candle)
  criteria: GradeCriterion[];

  // Total
  totalScore: number; // 0-9
  grade: Grade;

  // Bonus confluence flags (not scored)
  confluence: ConfluenceFlag[];

  // Key levels
  keyLevel: number; // support (Bounce), SSL level (SSL), or resistance (Breakout)
  keyLevelLabel: "SUPPORT" | "SSL" | "RESISTANCE";
  secondaryLevel: number;
  distToLevelPct: number; // % of price above (+) / below (-) the key level

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

export interface AlertSchedule {
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
    console.error(`[StrategyEngine] Failed to fetch OHLCV for ${symbol} ${interval}:`, err);
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
// SSL — LIQUIDITY SCORING (X/3)
// ============================================================
// 3 = Near-term SSL AND further-term SSL both swept (price went below both)
// 2 = Near-term SSL swept only
// 1 = Approaching SSL (within 2%) but not swept
// 0 = No SSL setup

function scoreSSLSweep(
  currentPrice: number,
  lows: number[]
): { score: number; details: string; nearSupport: number; furtherSupport: number } {
  const supportLevels = findSupportLevels(lows);
  if (supportLevels.length === 0) {
    return { score: 0, details: "No significant SSL levels identified", nearSupport: 0, furtherSupport: 0 };
  }

  // Near-term SSL: the closest level below current price (or most recently swept)
  const levelsBelow = supportLevels.filter((l) => l <= currentPrice * 1.02);
  const levelsWellBelow = supportLevels.filter((l) => l < currentPrice * 0.95);

  const nearSupport = levelsBelow.length > 0 ? levelsBelow[levelsBelow.length - 1] : 0;
  const furtherSupport = levelsBelow.length > 1 ? levelsBelow[levelsBelow.length - 2] : levelsWellBelow.length > 0 ? levelsWellBelow[levelsWellBelow.length - 1] : 0;

  // Check if price swept below the levels (went below then came back)
  const lastLow = lows[lows.length - 1];
  const prevLow = lows.length > 1 ? lows[lows.length - 2] : Infinity;

  const sweptNear = nearSupport > 0 && (lastLow <= nearSupport || prevLow <= nearSupport) && currentPrice > nearSupport;
  const sweptFurther = furtherSupport > 0 && (lastLow <= furtherSupport || prevLow <= furtherSupport) && currentPrice > furtherSupport;

  if (sweptNear && sweptFurther) {
    return {
      score: 3,
      details: `DOUBLE SSL SWEEP — Price swept below near-term SSL ($${nearSupport.toFixed(2)}) AND further-term SSL ($${furtherSupport.toFixed(2)}), now trading above both at $${currentPrice.toFixed(2)}. Maximum liquidity grab confirmed.`,
      nearSupport,
      furtherSupport,
    };
  }

  if (sweptNear) {
    return {
      score: 2,
      details: `SSL SWEEP — Price swept below near-term SSL ($${nearSupport.toFixed(2)}) and recovered above. Institutional liquidity grab confirmed.`,
      nearSupport,
      furtherSupport,
    };
  }

  // Approaching
  const distPct = nearSupport > 0 ? ((currentPrice - nearSupport) / nearSupport) * 100 : 999;
  if (distPct <= 2) {
    return {
      score: 1,
      details: `APPROACHING SSL — Price is ${distPct.toFixed(1)}% from SSL at $${nearSupport.toFixed(2)}. Watch for sweep.`,
      nearSupport,
      furtherSupport,
    };
  }

  return { score: 0, details: `No active SSL setup. Nearest SSL at $${nearSupport.toFixed(2)} (${distPct.toFixed(1)}% away).`, nearSupport, furtherSupport };
}

// ============================================================
// BOUNCE — SUPPORT BOUNCE SCORING (X/3)  [PROVISIONAL]
// ============================================================
// A bounce is distinct from an SSL sweep: the level HOLDS. Price taps
// key support and reverses off it without losing the level on a close.
// 3 = Tapped key support this bar and closed 2%+ above it (strong rejection)
// 2 = Tapped key support (within 1%) and closed above it
// 1 = Approaching support (within 2%) — bounce zone armed
// 0 = No bounce setup

function scoreSupportBounce(
  currentPrice: number,
  lows: number[],
  closes: number[]
): { score: number; details: string; nearSupport: number; furtherSupport: number } {
  const supportLevels = findSupportLevels(lows);
  if (supportLevels.length === 0) {
    return { score: 0, details: "No significant support levels identified", nearSupport: 0, furtherSupport: 0 };
  }

  const lastClose = closes[closes.length - 1];
  const lastLow = lows[lows.length - 1];
  const prevLow = lows.length > 1 ? lows[lows.length - 2] : Infinity;

  // Nearest support at or below current price
  const levelsBelow = supportLevels.filter((l) => l <= currentPrice * 1.01);
  const nearSupport = levelsBelow.length > 0 ? levelsBelow[levelsBelow.length - 1] : 0;
  const furtherSupport = levelsBelow.length > 1 ? levelsBelow[levelsBelow.length - 2] : 0;

  if (nearSupport <= 0) {
    return { score: 0, details: "No mapped support below price", nearSupport: 0, furtherSupport: 0 };
  }

  // Did price tap the level (within 1%) while holding it on a closing basis?
  const tappedThisBar = lastLow <= nearSupport * 1.01 && lastLow >= nearSupport * 0.99;
  const tappedRecently = tappedThisBar || (prevLow <= nearSupport * 1.01 && prevLow >= nearSupport * 0.99);
  const heldOnClose = lastClose > nearSupport;

  const reboundPct = nearSupport > 0 ? ((lastClose - nearSupport) / nearSupport) * 100 : 0;

  if (tappedRecently && heldOnClose && reboundPct >= 2) {
    return {
      score: 3,
      details: `STRONG BOUNCE — Price tapped key support at $${nearSupport.toFixed(2)}, held it, and rebounded ${reboundPct.toFixed(1)}% off the level. Buyers defended the zone with conviction.`,
      nearSupport,
      furtherSupport,
    };
  }

  if (tappedRecently && heldOnClose) {
    return {
      score: 2,
      details: `BOUNCE FORMING — Price tapped key support at $${nearSupport.toFixed(2)} and is holding above it. Watch for follow-through confirmation.`,
      nearSupport,
      furtherSupport,
    };
  }

  const distPct = ((currentPrice - nearSupport) / nearSupport) * 100;
  if (distPct <= 2) {
    return {
      score: 1,
      details: `BOUNCE ZONE ARMED — Price is ${distPct.toFixed(1)}% above key support at $${nearSupport.toFixed(2)}. Watching for the tap and hold.`,
      nearSupport,
      furtherSupport,
    };
  }

  return { score: 0, details: `No active bounce setup. Nearest support at $${nearSupport.toFixed(2)} (${distPct.toFixed(1)}% below price).`, nearSupport, furtherSupport };
}

// ============================================================
// BREAKOUT — RESISTANCE BREAK SCORING (X/3)
// ============================================================
// 3 = Two resistance levels freshly broken (double break)
// 2 = Near-term resistance freshly broken
// 1 = Approaching resistance (within 2% below) but not broken
// 0 = No breakout setup
//
// "Freshly broken" = close is above the level AND (the break happened
// on this bar, or the level sits within 5% below the current close —
// i.e. the move just cleared it, not ancient history).

function scoreResistanceBreak(
  currentPrice: number,
  highs: number[],
  closes: number[]
): { score: number; details: string; nearResistance: number; furtherResistance: number } {
  const resistanceLevels = findResistanceLevels(highs);
  if (resistanceLevels.length === 0) {
    return { score: 0, details: "No significant resistance levels identified", nearResistance: 0, furtherResistance: 0 };
  }

  const lastClose = closes[closes.length - 1];
  const prevClose = closes.length > 1 ? closes[closes.length - 2] : Infinity;

  const freshlyBroken = resistanceLevels
    .filter((l) => lastClose > l && (prevClose <= l * 1.005 || l >= lastClose * 0.95))
    .sort((a, b) => b - a); // nearest broken level first

  const levelsAbove = resistanceLevels.filter((l) => l >= lastClose).sort((a, b) => a - b);
  const nearestAbove = levelsAbove.length > 0 ? levelsAbove[0] : 0;

  if (freshlyBroken.length >= 2) {
    return {
      score: 3,
      details: `DOUBLE RESISTANCE BREAK — Price broke above near-term resistance ($${freshlyBroken[0].toFixed(2)}) AND further resistance ($${freshlyBroken[1].toFixed(2)}), now trading at $${currentPrice.toFixed(2)}. Maximum overhead clearance — full breakout confirmed.`,
      nearResistance: freshlyBroken[0],
      furtherResistance: freshlyBroken[1],
    };
  }

  if (freshlyBroken.length === 1) {
    return {
      score: 2,
      details: `RESISTANCE BREAK — Price broke above key resistance ($${freshlyBroken[0].toFixed(2)}) and is holding above it. Broken resistance now acts as support.`,
      nearResistance: freshlyBroken[0],
      furtherResistance: nearestAbove,
    };
  }

  const distPct = nearestAbove > 0 ? ((nearestAbove - lastClose) / lastClose) * 100 : 999;
  if (distPct <= 2) {
    return {
      score: 1,
      details: `APPROACHING RESISTANCE — Price is ${distPct.toFixed(1)}% below key resistance at $${nearestAbove.toFixed(2)}. Watch for a high-volume break.`,
      nearResistance: nearestAbove,
      furtherResistance: 0,
    };
  }

  return {
    score: 0,
    details: nearestAbove > 0
      ? `No active breakout setup. Nearest resistance at $${nearestAbove.toFixed(2)} (${distPct.toFixed(1)}% above).`
      : "Price is in blue-sky territory with no mapped resistance overhead — no fresh break to grade.",
    nearResistance: nearestAbove,
    furtherResistance: 0,
  };
}

// ============================================================
// VOLUME SCORING (X/3) — shared scale for both strategies
// ============================================================
// 3 = Largest volume in history (or within top 3 all-time)
// 2 = Larger than average volume (1.5x+ avg)
// 1 = Normal volume
// 0 = Below average volume

function scoreVolume(
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
// SSL — ABSORPTION CANDLE SCORING (X/3)
// ============================================================
// Checks the last candle for:
//   1. Long lower wick closing back above the SSL level (swept then recovered)
//   2. Close near previous period close (absorption — sellers absorbed)
//   3. Candle pattern: doji, hammer, or spinning top
//
// 3 = All three criteria met / 2 = Two / 1 = One / 0 = None

function scoreAbsorptionCandle(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  nearSupport: number
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

  // Criterion 1: Long lower wick closing back above support
  const wickRatio = totalRange > 0 ? lowerWick / totalRange : 0;
  if (nearSupport > 0 && lastLow <= nearSupport * 1.01 && lastClose > nearSupport && wickRatio > 0.3) {
    criteriaMetCount++;
    criteriaDetails.push(`Long wick up closing above SSL ($${nearSupport.toFixed(2)}) — swept and recovered`);
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

    // Hammer: small body at top, long lower wick (>55% of range)
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
// BOUNCE — REVERSAL CANDLE SCORING (X/3)  [PROVISIONAL]
// ============================================================
// Checks the last candle for a clean rejection of the support zone:
//   1. Long lower wick rejecting the level (wick > 40% of range, low at support)
//   2. Bullish close — close above open, finishing in the top half of the range
//   3. Reversal pattern: hammer, doji, bullish engulfing, or spinning top
//
// 3 = All three criteria met / 2 = Two / 1 = One / 0 = None

function scoreBounceCandle(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  nearSupport: number
): { score: number; details: string; lastOpen: number; lastClose: number; lastHigh: number; lastLow: number; previousClose: number } {
  if (opens.length < 2 || closes.length < 2) {
    return { score: 0, details: "Insufficient candle data", lastOpen: 0, lastClose: 0, lastHigh: 0, lastLow: 0, previousClose: 0 };
  }

  const lastOpen = opens[opens.length - 1];
  const lastClose = closes[closes.length - 1];
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const previousClose = closes[closes.length - 2];
  const previousOpen = opens[opens.length - 2];

  const bodySize = Math.abs(lastClose - lastOpen);
  const totalRange = lastHigh - lastLow;
  const lowerWick = Math.min(lastOpen, lastClose) - lastLow;
  const upperWick = lastHigh - Math.max(lastOpen, lastClose);

  let criteriaMetCount = 0;
  const criteriaDetails: string[] = [];

  // Criterion 1: Long lower wick rejecting the support zone
  const wickRatio = totalRange > 0 ? lowerWick / totalRange : 0;
  if (nearSupport > 0 && lastLow <= nearSupport * 1.02 && wickRatio > 0.4) {
    criteriaMetCount++;
    criteriaDetails.push(`Long lower wick rejecting support ($${nearSupport.toFixed(2)}) — buyers stepped in at the zone`);
  }

  // Criterion 2: Bullish close in the top half of the range
  if (totalRange > 0) {
    const closePosition = (lastClose - lastLow) / totalRange;
    if (lastClose >= lastOpen && closePosition >= 0.5) {
      criteriaMetCount++;
      criteriaDetails.push(`Bullish close in the top ${(100 - closePosition * 100).toFixed(0) === "0" ? "of the range" : `${(100 - closePosition * 100).toFixed(0)}% of the range`} — momentum shifting up off the level`);
    }
  }

  // Criterion 3: Reversal pattern
  let candlePattern = "";
  if (totalRange > 0) {
    const bodyPct = bodySize / totalRange;
    const lowerWickPct = lowerWick / totalRange;
    const upperWickPct = upperWick / totalRange;
    const prevBodyHigh = Math.max(previousOpen, previousClose);
    const prevBodyLow = Math.min(previousOpen, previousClose);

    if (bodyPct < 0.35 && lowerWickPct > 0.55 && lastClose >= lastOpen) {
      candlePattern = "HAMMER";
    } else if (bodyPct < 0.1) {
      candlePattern = "DOJI";
    } else if (lastClose > lastOpen && lastClose >= prevBodyHigh && lastOpen <= prevBodyLow && bodySize > 0) {
      candlePattern = "BULLISH ENGULFING";
    } else if (bodyPct < 0.35 && lowerWickPct > 0.2 && upperWickPct > 0.2) {
      candlePattern = "SPINNING TOP";
    }
  }

  if (candlePattern) {
    criteriaMetCount++;
    criteriaDetails.push(`${candlePattern} pattern detected — classic reversal signal at support`);
  }

  const detailStr = criteriaDetails.length > 0
    ? `${criteriaMetCount}/3 reversal criteria met: ${criteriaDetails.join(". ")}`
    : "No reversal candle pattern detected";

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
// BREAKOUT — BREAKOUT CANDLE SCORING (X/3)
// ============================================================
// Checks the last candle for:
//   1. Close above the key resistance level (breakout bar confirmed)
//   2. Conviction body — strong bullish body closing near the highs
//   3. Candle pattern: marubozu, bullish engulfing, gap-up, or new period high
//
// 3 = All three criteria met / 2 = Two / 1 = One / 0 = None

function scoreBreakoutCandle(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  keyResistance: number
): { score: number; details: string; lastOpen: number; lastClose: number; lastHigh: number; lastLow: number; previousClose: number } {
  if (opens.length < 2 || closes.length < 2) {
    return { score: 0, details: "Insufficient candle data", lastOpen: 0, lastClose: 0, lastHigh: 0, lastLow: 0, previousClose: 0 };
  }

  const lastOpen = opens[opens.length - 1];
  const lastClose = closes[closes.length - 1];
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const previousClose = closes[closes.length - 2];
  const previousOpen = opens[opens.length - 2];

  const bodySize = Math.abs(lastClose - lastOpen);
  const totalRange = lastHigh - lastLow;

  let criteriaMetCount = 0;
  const criteriaDetails: string[] = [];

  // Criterion 1: Close above the key resistance level
  if (keyResistance > 0 && lastClose > keyResistance) {
    criteriaMetCount++;
    criteriaDetails.push(`Closed above resistance ($${keyResistance.toFixed(2)}) — breakout bar confirmed`);
  }

  // Criterion 2: Conviction body — strong bullish body closing near the highs
  if (totalRange > 0) {
    const bodyPct = bodySize / totalRange;
    const closePosition = (lastClose - lastLow) / totalRange; // 1 = closed at the high
    if (lastClose > lastOpen && bodyPct >= 0.55 && closePosition >= 0.7) {
      criteriaMetCount++;
      criteriaDetails.push(`Conviction body — ${(bodyPct * 100).toFixed(0)}% body closing in the top of the range. Buyers in control into the close`);
    }
  }

  // Criterion 3: Candle pattern — marubozu, engulfing, gap-up, or new period high
  let candlePattern = "";
  if (totalRange > 0 && lastClose > lastOpen) {
    const bodyPct = bodySize / totalRange;
    const prevBodyHigh = Math.max(previousOpen, previousClose);
    const prevBodyLow = Math.min(previousOpen, previousClose);
    const lookbackHighs = highs.slice(Math.max(0, highs.length - 21), highs.length - 1);
    const priorHigh = lookbackHighs.length > 0 ? Math.max(...lookbackHighs) : 0;

    // Marubozu: nearly all body, no meaningful wicks
    if (bodyPct >= 0.8) {
      candlePattern = "BULLISH MARUBOZU";
    }
    // Bullish engulfing: body swallows the previous candle's body
    else if (lastClose >= prevBodyHigh && lastOpen <= prevBodyLow && bodySize > 0) {
      candlePattern = "BULLISH ENGULFING";
    }
    // Gap up: opened above previous close by 1%+
    else if (previousClose > 0 && lastOpen > previousClose * 1.01) {
      candlePattern = "GAP UP";
    }
    // New period high: highest high of the last 20 bars
    else if (priorHigh > 0 && lastHigh > priorHigh) {
      candlePattern = "NEW PERIOD HIGH";
    }
  }

  if (candlePattern) {
    criteriaMetCount++;
    criteriaDetails.push(`${candlePattern} — classic breakout/continuation signal`);
  }

  const detailStr = criteriaDetails.length > 0
    ? `${criteriaMetCount}/3 breakout criteria met: ${criteriaDetails.join(". ")}`
    : "No breakout candle pattern detected";

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
// RSI CALCULATION & CONFLUENCE CHECKS
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

// Bounce confluence: bullish divergence (price lower low, RSI higher low) or oversold
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

// Breakout confluence: strong momentum without overbought exhaustion
function detectRSIMomentum(rsiValues: number[]): { hasMomentum: boolean; details: string } {
  if (rsiValues.length < 2) {
    return { hasMomentum: false, details: "Insufficient data for RSI momentum" };
  }
  const lastRSI = rsiValues[rsiValues.length - 1];
  const prevRSI = rsiValues[rsiValues.length - 2];

  if (lastRSI >= 55 && lastRSI <= 80) {
    return {
      hasMomentum: true,
      details: `RSI MOMENTUM at ${lastRSI.toFixed(1)} (${lastRSI >= prevRSI ? "rising" : "cooling"}) — strong trend without overbought exhaustion. Fuel left in the tank.`,
    };
  }
  if (lastRSI > 80) {
    return {
      hasMomentum: false,
      details: `RSI OVERBOUGHT at ${lastRSI.toFixed(1)} — extended move. Consider waiting for a retest of the broken level instead of chasing.`,
    };
  }
  return { hasMomentum: false, details: `RSI at ${lastRSI.toFixed(1)} — momentum not yet confirmed for a breakout.` };
}

// ============================================================
// FIBONACCI KEY LEVELS (bounce confluence)
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
// PERIOD-HIGH ZONE (breakout confluence)
// ============================================================

function checkHighZone(
  currentPrice: number,
  highs: number[]
): { inZone: boolean; details: string } {
  if (highs.length < 5) {
    return { inZone: false, details: "Insufficient data for high-zone analysis" };
  }
  const periodHigh = Math.max(...highs);
  if (periodHigh <= 0) return { inZone: false, details: "No valid period high" };

  const distPct = ((periodHigh - currentPrice) / periodHigh) * 100;
  if (distPct <= 3) {
    return {
      inZone: true,
      details: `HIGH ZONE — Price is within ${distPct.toFixed(1)}% of the period high ($${periodHigh.toFixed(2)}). Minimal overhead supply — blue-sky territory on a confirmed break.`,
    };
  }
  return { inZone: false, details: `Price is ${distPct.toFixed(1)}% below the period high ($${periodHigh.toFixed(2)}).` };
}

// ============================================================
// MAIN GRADING FUNCTIONS
// ============================================================

function toGrade(totalScore: number): Grade {
  return totalScore >= 8 ? "A+" : totalScore >= 7 ? "A" : "Below Threshold";
}

async function gradeBounceSetup(
  symbol: string,
  timeframe: Timeframe
): Promise<SetupGrade | null> {
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol);
  if (!stockInfo) return null;

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  const bounce = scoreSupportBounce(quote.currentPrice, ohlcv.lows, ohlcv.closes);
  const volume = scoreVolume(ohlcv.volumes);
  const candle = scoreBounceCandle(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes, bounce.nearSupport);

  const totalScore = bounce.score + volume.score + candle.score;

  const rsiValues = calculateRSI(ohlcv.closes);
  const rsiDivergence = detectRSIDivergence(ohlcv.closes, rsiValues);
  const fibCheck = checkFibLevels(quote.currentPrice, ohlcv.highs, ohlcv.lows);

  return {
    strategy: "Bounce",
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    criteria: [
      { key: "level", label: "SUPPORT BOUNCE", score: bounce.score, max: 3, details: bounce.details },
      { key: "volume", label: "VOLUME CONFIRMATION", score: volume.score, max: 3, details: volume.details },
      { key: "candle", label: "REVERSAL CANDLE", score: candle.score, max: 3, details: candle.details },
    ],

    totalScore,
    grade: toGrade(totalScore),

    confluence: [
      { key: "rsi", label: "RSI BULLISH DIVERGENCE", active: rsiDivergence.hasDivergence, details: rsiDivergence.details },
      { key: "fib", label: "FIB KEY LEVEL", active: fibCheck.atKeyLevel, details: fibCheck.details },
    ],

    keyLevel: bounce.nearSupport,
    keyLevelLabel: "SUPPORT",
    secondaryLevel: bounce.furtherSupport,
    distToLevelPct:
      bounce.nearSupport > 0
        ? Math.round(((quote.currentPrice - bounce.nearSupport) / bounce.nearSupport) * 10000) / 100
        : 0,

    lastCandleOpen: candle.lastOpen,
    lastCandleClose: candle.lastClose,
    lastCandleHigh: candle.lastHigh,
    lastCandleLow: candle.lastLow,
    previousClose: candle.previousClose,

    lastVolume: volume.lastVolume,
    avgVolume: volume.avgVolume,
    maxHistoricalVolume: volume.maxVolume,
    volumeRatio: volume.volumeRatio,

    lastUpdated: new Date().toISOString(),
  };
}

async function gradeSSLSetup(
  symbol: string,
  timeframe: Timeframe
): Promise<SetupGrade | null> {
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol);
  if (!stockInfo) return null;

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  const sweep = scoreSSLSweep(quote.currentPrice, ohlcv.lows);
  const volume = scoreVolume(ohlcv.volumes);
  const candle = scoreAbsorptionCandle(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes, sweep.nearSupport);

  const totalScore = sweep.score + volume.score + candle.score;

  const rsiValues = calculateRSI(ohlcv.closes);
  const rsiDivergence = detectRSIDivergence(ohlcv.closes, rsiValues);
  const fibCheck = checkFibLevels(quote.currentPrice, ohlcv.highs, ohlcv.lows);

  return {
    strategy: "SSL",
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    criteria: [
      { key: "level", label: "LIQUIDITY (SSL SWEEP)", score: sweep.score, max: 3, details: sweep.details },
      { key: "volume", label: "VOLUME CLIMAX", score: volume.score, max: 3, details: volume.details },
      { key: "candle", label: "ABSORPTION CANDLE", score: candle.score, max: 3, details: candle.details },
    ],

    totalScore,
    grade: toGrade(totalScore),

    confluence: [
      { key: "rsi", label: "RSI BULLISH DIVERGENCE", active: rsiDivergence.hasDivergence, details: rsiDivergence.details },
      { key: "fib", label: "FIB KEY LEVEL", active: fibCheck.atKeyLevel, details: fibCheck.details },
    ],

    keyLevel: sweep.nearSupport,
    keyLevelLabel: "SSL",
    secondaryLevel: sweep.furtherSupport,
    distToLevelPct:
      sweep.nearSupport > 0
        ? Math.round(((quote.currentPrice - sweep.nearSupport) / sweep.nearSupport) * 10000) / 100
        : 0,

    lastCandleOpen: candle.lastOpen,
    lastCandleClose: candle.lastClose,
    lastCandleHigh: candle.lastHigh,
    lastCandleLow: candle.lastLow,
    previousClose: candle.previousClose,

    lastVolume: volume.lastVolume,
    avgVolume: volume.avgVolume,
    maxHistoricalVolume: volume.maxVolume,
    volumeRatio: volume.volumeRatio,

    lastUpdated: new Date().toISOString(),
  };
}

async function gradeBreakoutSetup(
  symbol: string,
  timeframe: Timeframe
): Promise<SetupGrade | null> {
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol);
  if (!stockInfo) return null;

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  const breakScore = scoreResistanceBreak(quote.currentPrice, ohlcv.highs, ohlcv.closes);
  const volume = scoreVolume(ohlcv.volumes);
  const candle = scoreBreakoutCandle(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes, breakScore.nearResistance);

  const totalScore = breakScore.score + volume.score + candle.score;

  const rsiValues = calculateRSI(ohlcv.closes);
  const rsiMomentum = detectRSIMomentum(rsiValues);
  const highZone = checkHighZone(quote.currentPrice, ohlcv.highs);

  return {
    strategy: "Breakout",
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    criteria: [
      { key: "level", label: "RESISTANCE BREAK", score: breakScore.score, max: 3, details: breakScore.details },
      { key: "volume", label: "VOLUME EXPANSION", score: volume.score, max: 3, details: volume.details },
      { key: "candle", label: "BREAKOUT CANDLE", score: candle.score, max: 3, details: candle.details },
    ],

    totalScore,
    grade: toGrade(totalScore),

    confluence: [
      { key: "rsi", label: "RSI MOMENTUM", active: rsiMomentum.hasMomentum, details: rsiMomentum.details },
      { key: "highzone", label: "HIGH ZONE", active: highZone.inZone, details: highZone.details },
    ],

    keyLevel: breakScore.nearResistance,
    keyLevelLabel: "RESISTANCE",
    secondaryLevel: breakScore.furtherResistance,
    distToLevelPct:
      breakScore.nearResistance > 0
        ? Math.round(((quote.currentPrice - breakScore.nearResistance) / breakScore.nearResistance) * 10000) / 100
        : 0,

    lastCandleOpen: candle.lastOpen,
    lastCandleClose: candle.lastClose,
    lastCandleHigh: candle.lastHigh,
    lastCandleLow: candle.lastLow,
    previousClose: candle.previousClose,

    lastVolume: volume.lastVolume,
    avgVolume: volume.avgVolume,
    maxHistoricalVolume: volume.maxVolume,
    volumeRatio: volume.volumeRatio,

    lastUpdated: new Date().toISOString(),
  };
}

export async function gradeSetup(
  strategy: Strategy,
  symbol: string,
  timeframe: Timeframe
): Promise<SetupGrade | null> {
  switch (strategy) {
    case "Bounce":
      return gradeBounceSetup(symbol, timeframe);
    case "SSL":
      return gradeSSLSetup(symbol, timeframe);
    case "Breakout":
      return gradeBreakoutSetup(symbol, timeframe);
  }
}

// ============================================================
// SCAN ALL STOCKS FOR A STRATEGY + TIMEFRAME (only returns 7/9+)
// ============================================================

export async function scanSetups(
  strategy: Strategy,
  timeframe: Timeframe,
  minScore: number = 7
): Promise<SetupGrade[]> {
  const results = await Promise.allSettled(
    INVESTMENT_UNIVERSE.map((stock) => gradeSetup(strategy, stock.symbol, timeframe))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<SetupGrade | null> =>
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
        interpretation = `HEAVY OUTFLOW from ${sector} — Money rotating OUT. Selling pressure builds liquidity pools at support — prime hunting ground for BOUNCE setups in ${sector} stocks.`;
      } else if (flowDirection === "OUTFLOW") {
        interpretation = `Money leaving ${sector}. Potential BOUNCE setups forming as selling pressure sweeps key support levels.`;
      } else if (flowDirection === "INFLOW" && flowStrength === "STRONG") {
        interpretation = `STRONG INFLOW into ${sector} — Institutional money rotating IN. Momentum favors BREAKOUT setups in ${sector} leaders clearing resistance.`;
      } else if (flowDirection === "INFLOW") {
        interpretation = `Moderate inflow into ${sector}. Sector gaining relative strength — watch for BREAKOUT setups at key resistance.`;
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

  // Sort: outflows first (bounce opportunities), then inflows (breakout opportunities)
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

export function calculateAlertSchedule(): AlertSchedule {
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

  let precision: AlertSchedule["monthly"]["precision"] = "WIDE_NET";
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
// CACHE
// ============================================================

const gradingCache = new Map<string, { data: SetupGrade[]; timestamp: number }>();
const GRADING_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export async function getGradedSetups(
  strategy: Strategy,
  timeframe: Timeframe,
  includeAll: boolean = false
): Promise<SetupGrade[]> {
  const cacheKey = `graded-${strategy}-${timeframe}-${includeAll}`;
  const cached = gradingCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < GRADING_CACHE_TTL) {
    return cached.data;
  }

  const minScore = includeAll ? 0 : 7;
  const results = await scanSetups(strategy, timeframe, minScore);
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
