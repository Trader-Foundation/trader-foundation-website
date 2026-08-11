import { callDataApi } from "./_core/dataApi";

// ============================================================
// INSTITUTIONAL FLOW DETECTION SERVICE
// Detects unusual volume activity indicating institutional moves
// Volume spikes + price action = smart money footprint
// ============================================================

export interface FlowSignal {
  symbol: string;
  timeframe: "Daily" | "Weekly" | "Monthly";
  volumeRatio: number;           // current vol / avg vol
  volumeSpike: boolean;          // > 2x average
  volumeClimax: boolean;         // highest in lookback period
  historicalMax: boolean;        // all-time volume record
  buyPressure: number;           // 0-100% estimated buy pressure
  flowType: "INSTITUTIONAL_ACCUMULATION" | "INSTITUTIONAL_DISTRIBUTION" | "DARK_POOL_PRINT" | "BLOCK_TRADE" | "NORMAL";
  severity: "EXTREME" | "HIGH" | "MODERATE" | "NORMAL";
  description: string;
  volumeCurrent: number;
  volumeAvg: number;
  volumeMax: number;
  priceChange: number;           // % change on the volume bar
  candleType: string;            // hammer, doji, engulfing, etc.
}

export interface FlowSummary {
  symbol: string;
  signals: FlowSignal[];
  overallFlow: "HEAVY_ACCUMULATION" | "ACCUMULATION" | "DISTRIBUTION" | "HEAVY_DISTRIBUTION" | "NEUTRAL";
  institutionalActivity: "EXTREME" | "HIGH" | "MODERATE" | "LOW";
  alertMessage: string | null;
}

// --- Flow Detection Cache ---
const flowCache = new Map<string, { data: FlowSummary; timestamp: number }>();
const FLOW_CACHE_TTL = 60 * 1000; // 1 minute — flow data should be fresh

// --- Volume Analysis Functions ---

function estimateBuyPressure(open: number, high: number, low: number, close: number): number {
  // Buy pressure estimation using candle body position within range
  // If close > open and close near high = strong buying
  const range = high - low;
  if (range === 0) return 50;
  
  const bodyMidpoint = (open + close) / 2;
  const rangePosition = (bodyMidpoint - low) / range; // 0 = bottom, 1 = top
  
  // Adjust for close vs open
  const isGreen = close >= open;
  const bodySize = Math.abs(close - open) / range;
  
  let pressure = rangePosition * 100;
  if (isGreen) {
    pressure = Math.min(100, pressure + bodySize * 20);
  } else {
    pressure = Math.max(0, pressure - bodySize * 20);
  }
  
  return Math.round(pressure);
}

function detectCandleType(open: number, high: number, low: number, close: number): string {
  const range = high - low;
  if (range === 0) return "doji";
  
  const body = Math.abs(close - open);
  const bodyRatio = body / range;
  const upperWick = high - Math.max(open, close);
  const lowerWick = Math.min(open, close) - low;
  const upperWickRatio = upperWick / range;
  const lowerWickRatio = lowerWick / range;
  
  // Doji — tiny body
  if (bodyRatio < 0.1) return "doji";
  
  // Hammer — small body at top, long lower wick
  if (lowerWickRatio > 0.6 && bodyRatio < 0.3 && upperWickRatio < 0.1) return "hammer";
  
  // Inverted hammer — small body at bottom, long upper wick
  if (upperWickRatio > 0.6 && bodyRatio < 0.3 && lowerWickRatio < 0.1) return "inverted_hammer";
  
  // Spinning top — small body, wicks on both sides
  if (bodyRatio < 0.3 && upperWickRatio > 0.2 && lowerWickRatio > 0.2) return "spinning_top";
  
  // Marubozu — full body, no wicks
  if (bodyRatio > 0.8) return close > open ? "bullish_marubozu" : "bearish_marubozu";
  
  // Engulfing-like — large body
  if (bodyRatio > 0.6) return close > open ? "bullish_engulfing" : "bearish_engulfing";
  
  return close > open ? "bullish" : "bearish";
}

function classifyFlowType(
  volumeRatio: number,
  buyPressure: number,
  candleType: string,
  priceChange: number,
  isVolumeClimax: boolean,
): FlowSignal["flowType"] {
  // DARK POOL PRINT: massive volume with tiny price movement (big players hiding)
  if (volumeRatio > 3 && Math.abs(priceChange) < 1) return "DARK_POOL_PRINT";
  
  // BLOCK TRADE: huge volume spike on single bar
  if (volumeRatio > 5) return "BLOCK_TRADE";
  
  // INSTITUTIONAL ACCUMULATION: high volume + buying pressure + bullish candle
  if (volumeRatio > 2 && buyPressure > 60 && (candleType.includes("bullish") || candleType === "hammer")) {
    return "INSTITUTIONAL_ACCUMULATION";
  }
  
  // INSTITUTIONAL DISTRIBUTION: high volume + selling pressure
  if (volumeRatio > 2 && buyPressure < 40 && (candleType.includes("bearish") || candleType === "inverted_hammer")) {
    return "INSTITUTIONAL_DISTRIBUTION";
  }
  
  return "NORMAL";
}

function classifySeverity(volumeRatio: number, isHistoricalMax: boolean): FlowSignal["severity"] {
  if (isHistoricalMax || volumeRatio > 5) return "EXTREME";
  if (volumeRatio > 3) return "HIGH";
  if (volumeRatio > 2) return "MODERATE";
  return "NORMAL";
}

// --- Main Flow Detection ---

async function analyzeFlow(
  symbol: string,
  timeframe: "Daily" | "Weekly" | "Monthly",
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
): Promise<FlowSignal[]> {
  if (!volumes || volumes.length < 10) return [];
  
  const signals: FlowSignal[] = [];
  const lookback = Math.min(volumes.length, timeframe === "Daily" ? 60 : timeframe === "Weekly" ? 52 : 24);
  const recentVolumes = volumes.slice(-lookback);
  const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
  const maxVolume = Math.max(...volumes);
  
  // Analyze last 5 bars for recent flow signals
  const barsToCheck = Math.min(5, volumes.length);
  for (let i = volumes.length - barsToCheck; i < volumes.length; i++) {
    if (i < 0) continue;
    
    const vol = volumes[i];
    const volumeRatio = avgVolume > 0 ? vol / avgVolume : 1;
    const isSpike = volumeRatio > 2;
    const isClimax = vol === Math.max(...volumes.slice(Math.max(0, i - lookback), i + 1));
    const isHistoricalMax = vol >= maxVolume * 0.95; // within 5% of all-time max
    
    if (!isSpike && !isClimax) continue; // Skip normal volume bars
    
    const o = opens[i] || closes[i];
    const h = highs[i] || closes[i];
    const l = lows[i] || closes[i];
    const c = closes[i];
    const prevClose = i > 0 ? closes[i - 1] : c;
    const priceChange = prevClose > 0 ? ((c - prevClose) / prevClose) * 100 : 0;
    
    const buyPressure = estimateBuyPressure(o, h, l, c);
    const candleType = detectCandleType(o, h, l, c);
    const flowType = classifyFlowType(volumeRatio, buyPressure, candleType, priceChange, isClimax);
    const severity = classifySeverity(volumeRatio, isHistoricalMax);
    
    if (flowType === "NORMAL" && severity === "NORMAL") continue;
    
    let description = "";
    switch (flowType) {
      case "DARK_POOL_PRINT":
        description = `Dark pool activity detected — ${volumeRatio.toFixed(1)}x avg volume with only ${Math.abs(priceChange).toFixed(1)}% price movement. Large players accumulating without moving price.`;
        break;
      case "BLOCK_TRADE":
        description = `Block trade detected — ${volumeRatio.toFixed(1)}x average volume. Institutional-sized order executed.`;
        break;
      case "INSTITUTIONAL_ACCUMULATION":
        description = `Institutional accumulation — ${volumeRatio.toFixed(1)}x avg volume with ${buyPressure}% buy pressure. ${candleType.replace("_", " ")} candle confirms buying.`;
        break;
      case "INSTITUTIONAL_DISTRIBUTION":
        description = `Institutional distribution — ${volumeRatio.toFixed(1)}x avg volume with ${100 - buyPressure}% sell pressure. Smart money may be exiting.`;
        break;
      default:
        description = `Unusual volume spike — ${volumeRatio.toFixed(1)}x average. Monitor for follow-through.`;
    }
    
    signals.push({
      symbol,
      timeframe,
      volumeRatio: Math.round(volumeRatio * 10) / 10,
      volumeSpike: isSpike,
      volumeClimax: isClimax,
      historicalMax: isHistoricalMax,
      buyPressure,
      flowType,
      severity,
      description,
      volumeCurrent: vol,
      volumeAvg: Math.round(avgVolume),
      volumeMax: maxVolume,
      priceChange: Math.round(priceChange * 100) / 100,
      candleType,
    });
  }
  
  // Sort by severity (EXTREME first)
  const severityOrder = { EXTREME: 0, HIGH: 1, MODERATE: 2, NORMAL: 3 };
  signals.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return signals;
}

export async function detectInstitutionalFlow(
  symbol: string,
  dailyData: { opens: number[]; closes: number[]; highs: number[]; lows: number[]; volumes: number[] } | null,
  weeklyData: { opens: number[]; closes: number[]; highs: number[]; lows: number[]; volumes: number[] } | null,
  monthlyData: { opens: number[]; closes: number[]; highs: number[]; lows: number[]; volumes: number[] } | null,
): Promise<FlowSummary> {
  const cached = flowCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < FLOW_CACHE_TTL) return cached.data;
  
  const allSignals: FlowSignal[] = [];
  
  if (dailyData) {
    const dailySignals = await analyzeFlow(symbol, "Daily", dailyData.opens, dailyData.highs, dailyData.lows, dailyData.closes, dailyData.volumes);
    allSignals.push(...dailySignals);
  }
  
  if (weeklyData) {
    const weeklySignals = await analyzeFlow(symbol, "Weekly", weeklyData.opens, weeklyData.highs, weeklyData.lows, weeklyData.closes, weeklyData.volumes);
    allSignals.push(...weeklySignals);
  }
  
  if (monthlyData) {
    const monthlySignals = await analyzeFlow(symbol, "Monthly", monthlyData.opens, monthlyData.highs, monthlyData.lows, monthlyData.closes, monthlyData.volumes);
    allSignals.push(...monthlySignals);
  }
  
  // Determine overall flow
  const accumulationSignals = allSignals.filter(s => s.flowType === "INSTITUTIONAL_ACCUMULATION" || s.flowType === "DARK_POOL_PRINT").length;
  const distributionSignals = allSignals.filter(s => s.flowType === "INSTITUTIONAL_DISTRIBUTION").length;
  const extremeSignals = allSignals.filter(s => s.severity === "EXTREME" || s.severity === "HIGH").length;
  
  let overallFlow: FlowSummary["overallFlow"] = "NEUTRAL";
  if (accumulationSignals >= 3) overallFlow = "HEAVY_ACCUMULATION";
  else if (accumulationSignals >= 1) overallFlow = "ACCUMULATION";
  else if (distributionSignals >= 3) overallFlow = "HEAVY_DISTRIBUTION";
  else if (distributionSignals >= 1) overallFlow = "DISTRIBUTION";
  
  let institutionalActivity: FlowSummary["institutionalActivity"] = "LOW";
  if (extremeSignals >= 2) institutionalActivity = "EXTREME";
  else if (extremeSignals >= 1 || allSignals.length >= 3) institutionalActivity = "HIGH";
  else if (allSignals.length >= 1) institutionalActivity = "MODERATE";
  
  let alertMessage: string | null = null;
  if (institutionalActivity === "EXTREME") {
    const topSignal = allSignals[0];
    alertMessage = `🔥 EXTREME INSTITUTIONAL FLOW — ${symbol}: ${topSignal.description}`;
  } else if (institutionalActivity === "HIGH" && overallFlow.includes("ACCUMULATION")) {
    alertMessage = `⚡ HIGH ACCUMULATION DETECTED — ${symbol}: Smart money is loading up across ${allSignals.length} timeframe(s)`;
  }
  
  const result: FlowSummary = {
    symbol,
    signals: allSignals,
    overallFlow,
    institutionalActivity,
    alertMessage,
  };
  
  flowCache.set(symbol, { data: result, timestamp: Date.now() });
  return result;
}

// Batch scan for institutional flow across all symbols
export async function scanInstitutionalFlow(
  symbols: { symbol: string; dailyData: any; weeklyData: any; monthlyData: any }[],
): Promise<FlowSummary[]> {
  const results = await Promise.all(
    symbols.map(s => detectInstitutionalFlow(s.symbol, s.dailyData, s.weeklyData, s.monthlyData))
  );
  
  // Only return symbols with actual flow signals
  return results.filter(r => r.signals.length > 0);
}
