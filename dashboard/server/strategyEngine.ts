// ============================================================
// STRATEGY ENGINE — The TF Elite 9-Point Scoring System
// Three strategies, one grading scale. Only 7/9+ setups show on
// the terminal. No noise. Only A-grade.
//
// BOUNCE — The TF Bounce Profit Plan. An uptrend pullback bounce:
// the stock trades above its 50 & 200 MA (trend filter — "may be
// stretched if the market had a very big downturn"), pulls back to
// the 13/20 MA or a key swing support, and bounces off it.
//   Bounce Zone (X/3) + Volume "The True Ammunition" (X/3) + Reversal Candle (X/3)
//   Confluence (bonus flags): Stochastics oversold turning up, MACD cross/direction
//   Fundamental layer (Market Pulse, served via routers): trade with
//   SPY's direction and avoid jobs-report Fridays / major event days.
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
      // 1y of dailies so the 200-day trend MA is computable at the last bar
      return fetchOHLCV(symbol, "1d", "1y");
  }
}

// ============================================================
// INDICATOR TOOLKIT — SMA, EMA, MACD, Full Stochastics
// (the tools prescribed by The Bounce Profit Plan)
// ============================================================

export function smaAt(values: number[], period: number): number | null {
  if (period <= 0 || values.length < period) return null;
  let sum = 0;
  for (let i = values.length - period; i < values.length; i++) sum += values[i];
  return sum / period;
}

function emaSeries(values: number[], period: number): number[] {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out.push(ema);
  for (let i = period; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    out.push(ema);
  }
  return out;
}

export interface MACDReading {
  macd: number;
  signal: number;
  histogram: number;
  prevHistogram: number;
}

export function calculateMACD(closes: number[], fast = 12, slow = 26, signalPeriod = 9): MACDReading | null {
  if (closes.length < slow + signalPeriod + 2) return null;
  const emaFast = emaSeries(closes, fast);
  const emaSlow = emaSeries(closes, slow);
  // Align: emaSlow starts (slow - fast) entries later than emaFast
  const offset = slow - fast;
  const macdLine: number[] = [];
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + offset] - emaSlow[i]);
  }
  const signalLine = emaSeries(macdLine, signalPeriod);
  if (signalLine.length < 2) return null;
  const last = macdLine.length - 1;
  const prev = last - 1;
  return {
    macd: macdLine[last],
    signal: signalLine[signalLine.length - 1],
    histogram: macdLine[last] - signalLine[signalLine.length - 1],
    prevHistogram: macdLine[prev] - signalLine[signalLine.length - 2],
  };
}

export interface StochReading {
  k: number; // slow %K
  prevK: number;
  d: number; // %D
}

export function calculateFullStochastics(
  highs: number[],
  lows: number[],
  closes: number[],
  kPeriod = 14,
  kSmooth = 3,
  dSmooth = 3
): StochReading | null {
  if (closes.length < kPeriod + kSmooth + dSmooth) return null;
  const rawK: number[] = [];
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const windowHigh = Math.max(...highs.slice(i - kPeriod + 1, i + 1));
    const windowLow = Math.min(...lows.slice(i - kPeriod + 1, i + 1));
    const range = windowHigh - windowLow;
    rawK.push(range > 0 ? ((closes[i] - windowLow) / range) * 100 : 50);
  }
  const slowK: number[] = [];
  for (let i = kSmooth - 1; i < rawK.length; i++) {
    slowK.push(rawK.slice(i - kSmooth + 1, i + 1).reduce((a, b) => a + b, 0) / kSmooth);
  }
  if (slowK.length < Math.max(2, dSmooth)) return null;
  const dWindow = slowK.slice(-dSmooth);
  return {
    k: slowK[slowK.length - 1],
    prevK: slowK[slowK.length - 2],
    d: dWindow.reduce((a, b) => a + b, 0) / dWindow.length,
  };
}

// Bounce Plan MA settings per timeframe. Daily is the plan as written
// (50/200 trend filter, 13/20 bounce MAs); Weekly and Monthly use the
// standard equivalents (10/40-week ≈ 50/200-day).
export const BOUNCE_MA_CONFIG: Record<Timeframe, { trend: [number, number]; bounce: [number, number] }> = {
  Daily: { trend: [50, 200], bounce: [13, 20] },
  Weekly: { trend: [10, 40], bounce: [13, 20] },
  Monthly: { trend: [12, 24], bounce: [6, 10] },
};

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
// BOUNCE — BOUNCE ZONE SCORING (X/3)  [The Bounce Profit Plan]
// ============================================================
// Trend filter first: the stock should be above its 50 AND 200 MA
// (per the plan, this rule "may have to be stretched if the market
// had a very big downturn"). The bounce zone is the 13/20 MA or a
// key swing support that price pulls back to and HOLDS.
// 3 = Uptrend intact AND price tapped the bounce zone and is holding above it
// 2 = Uptrend intact AND price is in the bounce zone (within 2%) — armed
// 1 = Zone tapped/armed but trend filter only partial (stretched bounce)
// 0 = No bounce setup

// A tap of the zone only counts as a bounce if the candle agrees.
// A bearish engulfing or a red close near the lows is a REJECTION
// candle — sellers in control — not a bounce, even if the level
// technically held on the close.
export function detectBearishRejection(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[]
): { rejected: boolean; reason: string } {
  const n = closes.length;
  if (n < 2) return { rejected: false, reason: "" };
  const lastOpen = opens[n - 1];
  const lastClose = closes[n - 1];
  const lastHigh = highs[n - 1];
  const lastLow = lows[n - 1];
  const prevBodyHigh = Math.max(opens[n - 2], closes[n - 2]);
  const prevBodyLow = Math.min(opens[n - 2], closes[n - 2]);

  const bearish = lastClose < lastOpen;
  if (!bearish) return { rejected: false, reason: "" };

  const engulfing = lastOpen >= prevBodyHigh && lastClose <= prevBodyLow;
  if (engulfing) return { rejected: true, reason: "BEARISH ENGULFING — the candle swallowed the prior body to the downside" };

  const range = lastHigh - lastLow;
  const closePosition = range > 0 ? (lastClose - lastLow) / range : 0.5;
  if (closePosition <= 0.35) return { rejected: true, reason: "bearish close in the bottom of the range — sellers rejected the move up" };

  return { rejected: false, reason: "" };
}

function scoreBounceZone(
  currentPrice: number,
  ohlcv: OHLCVData,
  timeframe: Timeframe
): { score: number; details: string; nearSupport: number; furtherSupport: number } {
  const { closes, lows } = ohlcv;
  const cfg = BOUNCE_MA_CONFIG[timeframe];
  const lastClose = closes[closes.length - 1];
  const lastLow = lows[lows.length - 1];
  const prevLow = lows.length > 1 ? lows[lows.length - 2] : Infinity;

  // Trend filter — 50/200 MA equivalents for the timeframe
  const trendFast = smaAt(closes, cfg.trend[0]);
  const trendSlow = smaAt(closes, cfg.trend[1]);
  const aboveFast = trendFast != null && currentPrice > trendFast;
  const aboveSlow = trendSlow != null ? currentPrice > trendSlow : null; // null = not enough history
  const fullTrend = aboveFast && aboveSlow !== false;
  const partialTrend = aboveFast || aboveSlow === true;
  const trendLabel = `${cfg.trend[0]}/${cfg.trend[1]} MA`;
  const trendDesc = trendFast != null
    ? `${aboveFast ? "above" : "below"} the ${cfg.trend[0]} MA ($${trendFast.toFixed(2)})${trendSlow != null ? ` and ${aboveSlow ? "above" : "below"} the ${cfg.trend[1]} MA ($${trendSlow.toFixed(2)})` : ""}`
    : "insufficient history for the trend MAs";

  // Bounce zone candidates: 13/20 MA (timeframe equivalents) + nearest swing support
  const bounceFast = smaAt(closes, cfg.bounce[0]);
  const bounceSlow = smaAt(closes, cfg.bounce[1]);
  const supports = findSupportLevels(lows);
  const nearSwing = supports.filter((l) => l <= currentPrice * 1.01).pop() || 0;

  const candidates: { level: number; name: string }[] = [];
  if (bounceFast != null && bounceFast <= currentPrice * 1.01) candidates.push({ level: Math.round(bounceFast * 100) / 100, name: `${cfg.bounce[0]} MA` });
  if (bounceSlow != null && bounceSlow <= currentPrice * 1.01) candidates.push({ level: Math.round(bounceSlow * 100) / 100, name: `${cfg.bounce[1]} MA` });
  if (nearSwing > 0) candidates.push({ level: nearSwing, name: "swing support" });

  const furtherSupport = supports.filter((l) => l < (nearSwing || currentPrice)).pop() || 0;

  if (candidates.length === 0) {
    return { score: 0, details: `No bounce zone below price (price is under its ${trendLabel === "50/200 MA" ? "bounce MAs" : "key MAs"} and mapped support).`, nearSupport: 0, furtherSupport };
  }

  // The zone = the closest candidate below price
  candidates.sort((a, b) => b.level - a.level);
  const zone = candidates[0];
  const distPct = ((currentPrice - zone.level) / zone.level) * 100;

  // Tap-and-hold: this bar (or last bar) dipped into the zone, close held above it
  const tapped = (lastLow <= zone.level * 1.01 || prevLow <= zone.level * 1.01) && lastClose > zone.level;
  const armed = distPct <= 2;

  // The candle must agree — a bearish engulfing / rejection candle at the
  // zone is NOT a bounce, even if the level technically held on the close.
  const rejection = detectBearishRejection(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes);
  if (tapped && rejection.rejected) {
    return {
      score: fullTrend ? 1 : 0,
      details: `ZONE UNDER TEST — Price tapped the ${zone.name} at $${zone.level.toFixed(2)} and the level held on the close, but the candle is a rejection: ${rejection.reason}. Sellers are in control — no bounce confirmation. Wait for a reversal candle.`,
      nearSupport: zone.level,
      furtherSupport: nearSwing > 0 && nearSwing !== zone.level ? nearSwing : furtherSupport,
    };
  }

  if (tapped && fullTrend) {
    return {
      score: 3,
      details: `BOUNCE CONFIRMED — Uptrend intact (${trendDesc}). Price pulled back, tapped the ${zone.name} at $${zone.level.toFixed(2)}, and is holding above it. Classic Bounce Plan setup.`,
      nearSupport: zone.level,
      furtherSupport: nearSwing > 0 && nearSwing !== zone.level ? nearSwing : furtherSupport,
    };
  }

  if (armed && fullTrend) {
    return {
      score: 2,
      details: `BOUNCE ZONE ARMED — Uptrend intact (${trendDesc}). Price is ${distPct.toFixed(1)}% above the ${zone.name} at $${zone.level.toFixed(2)}. Watching for the tap and hold.`,
      nearSupport: zone.level,
      furtherSupport: nearSwing > 0 && nearSwing !== zone.level ? nearSwing : furtherSupport,
    };
  }

  if ((tapped || armed) && partialTrend) {
    return {
      score: 1,
      details: `STRETCHED BOUNCE — Price ${tapped ? "tapped" : "is near"} the ${zone.name} at $${zone.level.toFixed(2)} but the trend filter is only partial (${trendDesc}). The plan allows stretching this rule after a big market downturn — treat with extra caution.`,
      nearSupport: zone.level,
      furtherSupport: nearSwing > 0 && nearSwing !== zone.level ? nearSwing : furtherSupport,
    };
  }

  return {
    score: 0,
    details: fullTrend
      ? `No active bounce. Uptrend intact (${trendDesc}) but price is ${distPct.toFixed(1)}% above the ${zone.name} at $${zone.level.toFixed(2)} — no pullback to the zone yet.`
      : `No bounce setup — trend filter failed (${trendDesc}). The plan wants the stock above its ${trendLabel} first.`,
    nearSupport: zone.level,
    furtherSupport,
  };
}

// ============================================================
// BOUNCE PLAN CONFLUENCE — Stochastics & MACD
// ============================================================

function detectStochasticsSignal(
  highs: number[],
  lows: number[],
  closes: number[]
): { active: boolean; details: string } {
  const stoch = calculateFullStochastics(highs, lows, closes);
  if (!stoch) return { active: false, details: "Insufficient data for Full Stochastics" };
  const { k, prevK, d } = stoch;

  const inOversold = k <= 20 || prevK <= 20;
  const pointingUp = k > prevK;

  if (inOversold && pointingUp) {
    return {
      active: true,
      details: `STOCHASTICS OVERSOLD & TURNING UP — %K at ${k.toFixed(1)} (from ${prevK.toFixed(1)}), %D at ${d.toFixed(1)}. Oversold and pointing up, ready to rise — textbook Bounce Plan signal.`,
    };
  }
  if (k >= 80) {
    return {
      active: false,
      details: `STOCHASTICS OVERBOUGHT at ${k.toFixed(1)} — ${pointingUp ? "still pointing up, but extended" : "pointing down, ready to drop"}. Not a bounce entry zone.`,
    };
  }
  return {
    active: false,
    details: `Stochastics %K at ${k.toFixed(1)} (${pointingUp ? "rising" : "falling"}), %D at ${d.toFixed(1)} — no oversold turn yet.`,
  };
}

function detectMACDSignal(closes: number[]): { active: boolean; details: string } {
  const m = calculateMACD(closes);
  if (!m) return { active: false, details: "Insufficient data for MACD" };
  const { macd, signal, histogram, prevHistogram } = m;
  const price = closes[closes.length - 1];
  const nearZero = Math.abs(histogram) <= price * 0.002; // within 0.2% of price = "close to crossing"

  if (prevHistogram <= 0 && histogram > 0) {
    return {
      active: true,
      details: `MACD BULLISH CROSS — MACD line (${macd.toFixed(2)}) just crossed above the signal line (${signal.toFixed(2)}). Histogram flipped positive.`,
    };
  }
  if (histogram > 0 && histogram >= prevHistogram) {
    return {
      active: true,
      details: `MACD POINTED UP — MACD (${macd.toFixed(2)}) above signal (${signal.toFixed(2)}) with a rising histogram. Momentum in the right direction.`,
    };
  }
  if (histogram < 0 && histogram > prevHistogram && nearZero) {
    return {
      active: true,
      details: `MACD CONVERGING FOR A CROSS — lines are close and the histogram is shrinking toward zero. Watch for the bullish cross.`,
    };
  }
  return {
    active: false,
    details: `MACD ${histogram >= 0 ? "positive but fading" : "below signal"} (MACD ${macd.toFixed(2)} vs signal ${signal.toFixed(2)}) — no bullish cross setup.`,
  };
}

// ============================================================
// BREAKOUT — BREAKOUT LEVEL SCORING (X/3)  [TF Breakout Strategy]
// ============================================================
// The plan: "ride the wave of a stock that breaks out and starts to
// hit NEW HIGHS" — the 52-week-high screen is the heart of the setup.
// 3 = Fresh resistance break AND printing new period highs (blue sky),
//     or a double resistance break
// 2 = Near-term resistance freshly broken (still below the period high)
// 1 = Approaching resistance or the period high (within 2%)
// 0 = No breakout setup
//
// "Freshly broken" = close is above the level AND (the break happened
// on this bar, or the level sits within 5% below the current close —
// i.e. the move just cleared it, not ancient history).

function scoreBreakoutLevel(
  currentPrice: number,
  highs: number[],
  closes: number[]
): { score: number; details: string; nearResistance: number; furtherResistance: number } {
  const resistanceLevels = findResistanceLevels(highs);
  const lastClose = closes[closes.length - 1];
  const prevClose = closes.length > 1 ? closes[closes.length - 2] : Infinity;

  // New period high = at/above the highest high in the dataset
  // (1y of dailies ≈ the plan's 52-week-high screen)
  const priorHighs = highs.slice(0, -1);
  const periodHigh = priorHighs.length > 0 ? Math.max(...priorHighs) : 0;
  const atNewHigh = periodHigh > 0 && lastClose >= periodHigh * 0.999;

  const freshlyBroken = resistanceLevels
    .filter((l) => lastClose > l && (prevClose <= l * 1.005 || l >= lastClose * 0.95))
    .sort((a, b) => b - a); // nearest broken level first

  const levelsAbove = resistanceLevels.filter((l) => l >= lastClose).sort((a, b) => a - b);
  const nearestAbove = levelsAbove.length > 0 ? levelsAbove[0] : 0;

  if (atNewHigh && (freshlyBroken.length >= 1 || periodHigh > 0)) {
    const brokeLevel = freshlyBroken.length > 0 ? freshlyBroken[0] : Math.round(periodHigh * 100) / 100;
    return {
      score: 3,
      details: `NEW-HIGH BREAKOUT — Price cleared resistance at $${brokeLevel.toFixed(2)} and is printing fresh period highs (prior high $${periodHigh.toFixed(2)}). Blue-sky territory with no overhead supply — ride the wave.`,
      nearResistance: brokeLevel,
      furtherResistance: freshlyBroken.length > 1 ? freshlyBroken[1] : 0,
    };
  }

  if (freshlyBroken.length >= 2) {
    return {
      score: 3,
      details: `DOUBLE RESISTANCE BREAK — Price broke above near-term resistance ($${freshlyBroken[0].toFixed(2)}) AND further resistance ($${freshlyBroken[1].toFixed(2)}), now trading at $${currentPrice.toFixed(2)}. Maximum overhead clearance — full breakout confirmed.`,
      nearResistance: freshlyBroken[0],
      furtherResistance: freshlyBroken[1],
    };
  }

  if (freshlyBroken.length === 1) {
    const toHighPct = periodHigh > 0 ? ((periodHigh - lastClose) / lastClose) * 100 : 999;
    return {
      score: 2,
      details: `RESISTANCE BREAK — Price broke above key resistance ($${freshlyBroken[0].toFixed(2)}) and is holding above it. Broken resistance now acts as support.${periodHigh > 0 && toHighPct <= 10 ? ` The period high ($${periodHigh.toFixed(2)}) is ${toHighPct.toFixed(1)}% away — the new-high trigger.` : ""}`,
      nearResistance: freshlyBroken[0],
      furtherResistance: nearestAbove,
    };
  }

  const distToRes = nearestAbove > 0 ? ((nearestAbove - lastClose) / lastClose) * 100 : 999;
  const distToHigh = periodHigh > 0 ? ((periodHigh - lastClose) / lastClose) * 100 : 999;
  const nearestTrigger = Math.min(distToRes, distToHigh);
  if (nearestTrigger <= 2 && nearestTrigger >= 0) {
    const triggerLevel = distToHigh <= distToRes ? periodHigh : nearestAbove;
    const triggerName = distToHigh <= distToRes ? "the period high" : "key resistance";
    return {
      score: 1,
      details: `APPROACHING BREAKOUT — Price is ${nearestTrigger.toFixed(1)}% below ${triggerName} at $${triggerLevel.toFixed(2)}. Watch for a high-volume Marubozu break.`,
      nearResistance: Math.round(triggerLevel * 100) / 100,
      furtherResistance: 0,
    };
  }

  return {
    score: 0,
    details: nearestAbove > 0
      ? `No active breakout setup. Nearest resistance at $${nearestAbove.toFixed(2)} (${distToRes.toFixed(1)}% above), period high at $${periodHigh.toFixed(2)}.`
      : `No fresh breakout to grade. Period high at $${periodHigh.toFixed(2)} (${distToHigh.toFixed(1)}% above).`,
    nearResistance: nearestAbove || Math.round(periodHigh * 100) / 100,
    furtherResistance: 0,
  };
}

// ============================================================
// BREAKOUT — VOLUME SCORING (X/3)  [TF Breakout Strategy]
// ============================================================
// The plan's screen: average volume over 1M (liquidity — "legitimate
// stocks that won't be affected by minor news") and RELATIVE VOLUME
// OVER 1 (above the 3-month average "which will help the stock
// movement"). Below-average volume fails the screen outright.

function scoreBreakoutVolume(
  volumes: number[],
  quoteAvgVolume: number
): { score: number; details: string; lastVolume: number; avgVolume: number; maxVolume: number; volumeRatio: number } {
  if (volumes.length < 5) {
    return { score: 0, details: "Insufficient volume data", lastVolume: 0, avgVolume: 0, maxVolume: 0, volumeRatio: 0 };
  }

  const lastVolume = volumes[volumes.length - 1];
  const prevVolumes = volumes.slice(0, -1);
  const avgVolume = prevVolumes.reduce((a, b) => a + b, 0) / prevVolumes.length;
  const maxVolume = Math.max(...prevVolumes);
  const volumeRatio = avgVolume > 0 ? lastVolume / avgVolume : 0;

  const liquidityNote = quoteAvgVolume > 0 && quoteAvgVolume < 1_000_000
    ? " ⚠ Average daily volume is under the plan's 1M liquidity screen — thin stock, treat with caution."
    : "";

  const sortedVolumes = [...volumes].sort((a, b) => b - a);
  const rank = sortedVolumes.indexOf(lastVolume) + 1;

  const base = {
    lastVolume,
    avgVolume: Math.round(avgVolume),
    maxVolume,
    volumeRatio: Math.round(volumeRatio * 100) / 100,
  };

  if (rank <= 3 || lastVolume >= maxVolume) {
    return { score: 3, details: `VOLUME SURGE — ${volumeRatio.toFixed(1)}x average volume. ${rank === 1 ? "LARGEST VOLUME IN HISTORY" : `Top ${rank} volume ever recorded`}. Maximum fuel behind the breakout.${liquidityNote}`, ...base };
  }
  if (volumeRatio >= 1.5) {
    return { score: 2, details: `STRONG RELATIVE VOLUME — ${volumeRatio.toFixed(1)}x the average. Well above the plan's over-1 relative-volume screen — real participation behind the move.${liquidityNote}`, ...base };
  }
  if (volumeRatio > 1.0) {
    return { score: 1, details: `RELATIVE VOLUME OVER 1 — ${volumeRatio.toFixed(1)}x the average. Passes the plan's screen, but a convincing breakout wants more fuel.${liquidityNote}`, ...base };
  }
  return { score: 0, details: `RELATIVE VOLUME BELOW 1 — ${volumeRatio.toFixed(1)}x the average. The plan requires volume above the 3-month average; a breakout without volume is suspect.${liquidityNote}`, ...base };
}

// ============================================================
// BREAKOUT — CONTINUATION PATTERN (flag / pennant) CONFLUENCE
// ============================================================
// Plan: "Breaking out of a continuation pattern such as a flag or a
// pennant." Heuristic: a sharp pole, a short contracting consolidation
// drifting sideways/slightly down, then a close above the flag's high.

function detectContinuationPattern(
  highs: number[],
  lows: number[],
  closes: number[]
): { active: boolean; details: string } {
  const n = closes.length;
  if (n < 16) return { active: false, details: "Insufficient data for pattern analysis" };

  const FLAG_LEN = 5;
  const POLE_LEN = 9;
  const lastClose = closes[n - 1];

  // Pole: the advance leading into the consolidation
  const poleStart = closes[n - 1 - FLAG_LEN - POLE_LEN];
  const poleEnd = closes[n - 1 - FLAG_LEN];
  const polePct = poleStart > 0 ? ((poleEnd - poleStart) / poleStart) * 100 : 0;

  // Flag: the bars between the pole and the current bar
  const flagHighs = highs.slice(n - 1 - FLAG_LEN, n - 1);
  const flagLows = lows.slice(n - 1 - FLAG_LEN, n - 1);
  const flagCloses = closes.slice(n - 1 - FLAG_LEN, n - 1);
  const flagHigh = Math.max(...flagHighs);
  const flagRangePct = flagHigh > 0 ? ((flagHigh - Math.min(...flagLows)) / flagHigh) * 100 : 999;
  const flagDriftPct = flagCloses[0] > 0 ? ((flagCloses[flagCloses.length - 1] - flagCloses[0]) / flagCloses[0]) * 100 : 0;

  const hasPole = polePct >= 5;
  const tightFlag = flagRangePct <= Math.max(6, polePct * 0.6) && flagDriftPct <= 2;
  const breaking = lastClose > flagHigh;

  if (hasPole && tightFlag && breaking) {
    return {
      active: true,
      details: `FLAG/PENNANT BREAKOUT — ${polePct.toFixed(1)}% pole, then a tight ${FLAG_LEN}-bar consolidation (${flagRangePct.toFixed(1)}% range), now closing above the flag high ($${flagHigh.toFixed(2)}). Classic continuation pattern resolving upward.`,
    };
  }
  if (hasPole && tightFlag) {
    return {
      active: false,
      details: `Flag forming — ${polePct.toFixed(1)}% pole with a tight consolidation under $${flagHigh.toFixed(2)}. Not yet breaking the flag high.`,
    };
  }
  return { active: false, details: "No flag/pennant continuation pattern detected." };
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

  // "The true ammunition of the stock" — is volume increasing?
  const n = volumes.length;
  const risingNote = n >= 3 && volumes[n - 1] > volumes[n - 2] && volumes[n - 2] > volumes[n - 3]
    ? " Volume rising for 3 straight bars — ammunition building."
    : "";

  // Sort all volumes to find percentile
  const sortedVolumes = [...volumes].sort((a, b) => b - a);
  const rank = sortedVolumes.indexOf(lastVolume) + 1;
  const isTopVolume = rank <= 3;

  if (isTopVolume || lastVolume >= maxVolume) {
    return {
      score: 3,
      details: `VOLUME CLIMAX — ${(volumeRatio).toFixed(1)}x average volume. ${rank === 1 ? "LARGEST VOLUME IN HISTORY" : `Top ${rank} volume ever recorded`}. Massive institutional flow confirmed.${risingNote}`,
      lastVolume,
      avgVolume: Math.round(avgVolume),
      maxVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
    };
  }

  if (volumeRatio >= 1.5) {
    return {
      score: 2,
      details: `ELEVATED VOLUME — ${volumeRatio.toFixed(1)}x average volume. Significant institutional participation above normal levels.${risingNote}`,
      lastVolume,
      avgVolume: Math.round(avgVolume),
      maxVolume,
      volumeRatio: Math.round(volumeRatio * 100) / 100,
    };
  }

  if (volumeRatio >= 0.8) {
    return {
      score: 1,
      details: `NORMAL VOLUME — ${volumeRatio.toFixed(1)}x average. No significant volume spike detected.${risingNote}`,
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
// BREAKOUT — MARUBOZU CANDLE SCORING (X/3)  [TF Breakout Strategy]
// ============================================================
// The plan: "Focusing on Marubozu (full-bodied) candles is extremely
// important — a strong signal toward the desired direction."
// Checks the last candle for:
//   1. Close above the key resistance level (breakout bar confirmed)
//   2. Conviction body — strong full body closing near the highs
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
// MAIN GRADING FUNCTIONS
// ============================================================

function toGrade(totalScore: number): Grade {
  return totalScore >= 8 ? "A+" : totalScore >= 7 ? "A" : "Below Threshold";
}

async function gradeBounceSetup(
  symbol: string,
  timeframe: Timeframe
): Promise<SetupGrade | null> {
  // Grade ANY symbol — fall back to the ticker itself when it's outside the tracked universe
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol) ?? { symbol, company: symbol, sector: "—" };

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  const bounce = scoreBounceZone(quote.currentPrice, ohlcv, timeframe);
  const volume = scoreVolume(ohlcv.volumes);
  const candle = scoreBounceCandle(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes, bounce.nearSupport);

  const totalScore = bounce.score + volume.score + candle.score;

  const stochSignal = detectStochasticsSignal(ohlcv.highs, ohlcv.lows, ohlcv.closes);
  const macdSignal = detectMACDSignal(ohlcv.closes);

  return {
    strategy: "Bounce",
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    criteria: [
      { key: "level", label: "BOUNCE ZONE", score: bounce.score, max: 3, details: bounce.details },
      { key: "volume", label: "VOLUME (THE AMMUNITION)", score: volume.score, max: 3, details: volume.details },
      { key: "candle", label: "REVERSAL CANDLE", score: candle.score, max: 3, details: candle.details },
    ],

    totalScore,
    grade: toGrade(totalScore),

    confluence: [
      { key: "stoch", label: "STOCHASTICS", active: stochSignal.active, details: stochSignal.details },
      { key: "macd", label: "MACD", active: macdSignal.active, details: macdSignal.details },
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
  // Grade ANY symbol — fall back to the ticker itself when it's outside the tracked universe
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol) ?? { symbol, company: symbol, sector: "—" };

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
  // Bounce Plan toolkit shared with SSL as extra confluence
  const stochSignal = detectStochasticsSignal(ohlcv.highs, ohlcv.lows, ohlcv.closes);
  const macdSignal = detectMACDSignal(ohlcv.closes);

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
      { key: "stoch", label: "STOCHASTICS", active: stochSignal.active, details: stochSignal.details },
      { key: "macd", label: "MACD", active: macdSignal.active, details: macdSignal.details },
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
  // Grade ANY symbol — fall back to the ticker itself when it's outside the tracked universe
  const stockInfo = INVESTMENT_UNIVERSE.find((s) => s.symbol === symbol) ?? { symbol, company: symbol, sector: "—" };

  const [quote, ohlcv] = await Promise.all([
    fetchStockQuote(symbol),
    fetchTimeframeOHLCV(symbol, timeframe),
  ]);

  if (!quote || !ohlcv || ohlcv.closes.length < 10) return null;

  const breakScore = scoreBreakoutLevel(quote.currentPrice, ohlcv.highs, ohlcv.closes);
  const volume = scoreBreakoutVolume(ohlcv.volumes, quote.avgVolume || 0);
  const candle = scoreBreakoutCandle(ohlcv.opens, ohlcv.highs, ohlcv.lows, ohlcv.closes, breakScore.nearResistance);

  const totalScore = breakScore.score + volume.score + candle.score;

  const pattern = detectContinuationPattern(ohlcv.highs, ohlcv.lows, ohlcv.closes);
  const rsiValues = calculateRSI(ohlcv.closes);
  const rsiMomentum = detectRSIMomentum(rsiValues);

  return {
    strategy: "Breakout",
    symbol,
    company: stockInfo.company,
    sector: stockInfo.sector,
    timeframe,
    currentPrice: quote.currentPrice,

    criteria: [
      { key: "level", label: "BREAKOUT (NEW HIGHS)", score: breakScore.score, max: 3, details: breakScore.details },
      { key: "volume", label: "RELATIVE VOLUME", score: volume.score, max: 3, details: volume.details },
      { key: "candle", label: "MARUBOZU CANDLE", score: candle.score, max: 3, details: candle.details },
    ],

    totalScore,
    grade: toGrade(totalScore),

    confluence: [
      { key: "pattern", label: "FLAG/PENNANT", active: pattern.active, details: pattern.details },
      { key: "rsi", label: "RSI MOMENTUM", active: rsiMomentum.hasMomentum, details: rsiMomentum.details },
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
// MARKET PULSE — the Bounce Plan's fundamental layer
// ============================================================
// "Don't trade on the unemployment announcement days. This is usually
// the first Friday of every month." + "Analyze which way the overall
// market is headed (look at SPY)."

export interface JobsReportInfo {
  isJobsReportDay: boolean;
  nextJobsReportDate: string; // YYYY-MM-DD (first Friday of the month)
}

function firstFridayOfMonth(year: number, month: number): Date {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return d;
}

export function calculateJobsReportInfo(): JobsReportInfo {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const thisMonths = firstFridayOfMonth(et.getFullYear(), et.getMonth());
  const isSameDay =
    et.getFullYear() === thisMonths.getFullYear() &&
    et.getMonth() === thisMonths.getMonth() &&
    et.getDate() === thisMonths.getDate();
  const next = et.getDate() <= thisMonths.getDate()
    ? thisMonths
    : firstFridayOfMonth(et.getFullYear(), et.getMonth() + 1);
  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { isJobsReportDay: isSameDay, nextJobsReportDate: toYMD(next) };
}

export type MarketTrend = "BULLISH" | "BEARISH" | "CONSOLIDATING";

export function classifyMarketTrend(closes: number[]): { trend: MarketTrend; sma50: number | null; detail: string } {
  const sma50 = smaAt(closes, 50);
  const price = closes[closes.length - 1];
  const lookback = Math.min(10, closes.length - 1);
  const slope = lookback > 0 ? price - closes[closes.length - 1 - lookback] : 0;

  if (sma50 == null) return { trend: "CONSOLIDATING", sma50: null, detail: "Insufficient history to classify the trend" };
  if (price > sma50 * 1.005 && slope > 0) {
    return { trend: "BULLISH", sma50, detail: `Above the 50-day MA ($${sma50.toFixed(2)}) and rising over the last ${lookback} sessions` };
  }
  if (price < sma50 * 0.995 && slope < 0) {
    return { trend: "BEARISH", sma50, detail: `Below the 50-day MA ($${sma50.toFixed(2)}) and falling over the last ${lookback} sessions` };
  }
  return { trend: "CONSOLIDATING", sma50, detail: `Hovering around the 50-day MA ($${sma50.toFixed(2)}) — no decisive direction` };
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
