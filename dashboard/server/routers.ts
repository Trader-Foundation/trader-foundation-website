import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getInvestmentRadarData,
  PAST_WINNERS,
  INVESTMENT_UNIVERSE,
  fetchStockQuote,
  fetchMonthlyData,
  fetchWeeklyData,
  fetchDailyData,
  calculateTechnicalLevels,
  findSupportLevels,
  findResistanceLevels,
  calculateCorrectionAlert,
  calculateProjections,
  buildPortfolioPlan,
  calculateValuation,
  SECTOR_ETF_MAP,
  calculateSectorBenchmark,
  type Strategy,
} from "./marketData";
import { z } from "zod";
// Alert service disabled — no notifications
// import { getRecentAlerts, detectVolumeAnomalies, runAlertScan, startAlertScanner } from "./alertService";
import { createLinkToken, exchangePublicToken, getInvestmentHoldings, isPlaidConfigured } from "./plaidService";
import { getStockDeepDive, getStockDeepDiveFast } from "./deepDiveData";
import {
  getGradedSetups,
  getSectorRotation,
  gradeSetup,
  smaAt,
  BOUNCE_MA_CONFIG,
  calculateJobsReportInfo,
  classifyMarketTrend,
  detectBearishRejection,
  type Timeframe as SetupTimeframe,
} from "./strategyEngine";
import { detectInstitutionalFlow, scanInstitutionalFlow } from "./institutionalFlow";

// Alert scanner and timed alerts DISABLED — no notifications sent;

// In-memory cache with tiered TTLs
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL_FAST = 5 * 60 * 1000;        // 5 min — quotes (price changes)
const CACHE_TTL_MEDIUM = 30 * 60 * 1000;     // 30 min — daily screener, radar
const CACHE_TTL_SLOW = 6 * 60 * 60 * 1000;   // 6 hours — weekly data, deep dive, sector rotation
const CACHE_TTL_MONTHLY = 24 * 60 * 60 * 1000; // 24 hours — monthly candle data
const CACHE_TTL_AI = 3 * 60 * 60 * 1000;     // 3 hours — AI research/deep dives (expensive LLM calls, fundamentals don't change fast)

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < entry.ttl) {
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: any, ttl: number = CACHE_TTL_MEDIUM): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

// AGGRESSIVE PREFETCH — warm ALL endpoints on boot so first load is instant
const ALL_SYMBOLS = INVESTMENT_UNIVERSE.map(s => s.symbol);

// The three TF Elite setup strategies
const STRATEGIES = ["Bounce", "SSL", "Breakout"] as const;
type WatchTimeframe = "Daily" | "Weekly" | "Monthly";

// Active-status-first sort order per strategy
const STATUS_ORDER: Record<string, number> = {
  "Bouncing": 0,
  "SSL Breached": 0,
  "Breakout": 0,
  "Approaching": 1,
  "Watching": 2,
};

// Build one watchlist row for a symbol under a given strategy.
// Bounce/SSL key off support levels (swing lows); Breakout keys off resistance (swing highs).
function buildWatchItem(strategy: Strategy, symbol: string, quote: any, data: any, tf: WatchTimeframe): any {
  const stockInfo = INVESTMENT_UNIVERSE.find(s => s.symbol === symbol);
  const volumeRatio = quote.avgVolume > 0 ? quote.volume / quote.avgVolume : 1;
  const chartLen = tf === "Monthly" ? 60 : tf === "Weekly" ? 52 : 65;
  const startIdx = Math.max(0, data.closes.length - chartLen);
  const candles: { t: number; o: number; h: number; l: number; c: number; v: number }[] = [];
  for (let i = startIdx; i < data.closes.length; i++) {
    candles.push({ t: data.timestamps?.[i] || 0, o: data.opens?.[i] || data.closes[i], h: data.highs[i], l: data.lows[i], c: data.closes[i], v: data.volumes?.[i] || 0 });
  }

  const lastLow = data.lows[data.lows.length - 1];
  let level = 0;
  let distToLevelPct = 999;
  let status: "Watching" | "Approaching" | "Bouncing" | "SSL Breached" | "Breakout" = "Watching";
  let chartLevels: number[] = [];

  if (strategy === "Breakout") {
    const resistanceLevels = findResistanceLevels(data.highs);
    // New period high (the plan's 52-week-high screen): last close at/above the prior highest high
    const priorHighs = data.highs.slice(0, -1);
    const periodHigh = priorHighs.length > 0 ? Math.max(...priorHighs) : 0;
    const lastClose = data.closes[data.closes.length - 1];
    const atNewHigh = periodHigh > 0 && lastClose >= periodHigh * 0.999;
    // Freshly broken = resistance now sitting within 5% below price
    const broken = resistanceLevels.filter(l => l < quote.currentPrice && l >= quote.currentPrice * 0.95);
    const above = resistanceLevels.filter(l => l >= quote.currentPrice);
    if (atNewHigh) {
      level = Math.round(periodHigh * 100) / 100;
      distToLevelPct = ((quote.currentPrice - periodHigh) / periodHigh) * 100;
      status = "Breakout";
    } else if (broken.length > 0) {
      level = broken[broken.length - 1];
      distToLevelPct = ((quote.currentPrice - level) / level) * 100;
      status = "Breakout";
    } else if (above.length > 0) {
      level = above[0];
      distToLevelPct = ((level - quote.currentPrice) / quote.currentPrice) * 100;
      status = distToLevelPct < 2 ? "Approaching" : "Watching";
    }
    chartLevels = resistanceLevels.filter(l => l >= quote.currentPrice * 0.9 && l <= quote.currentPrice * 1.15).slice(0, 3);
  } else if (strategy === "SSL") {
    const supportLevels = findSupportLevels(data.lows);
    // Allow a level slightly above price so an in-progress sweep still maps to its level
    const nearest = supportLevels.filter(l => l <= quote.currentPrice * 1.02).pop() || 0;
    level = nearest;
    distToLevelPct = nearest > 0 ? ((quote.currentPrice - nearest) / nearest) * 100 : 999;
    if (nearest > 0 && quote.currentPrice < nearest) status = "SSL Breached";
    else if (distToLevelPct < 2) status = "Approaching";
    chartLevels = supportLevels.filter(l => l <= quote.currentPrice * 1.02).slice(-3);
  } else {
    // Bounce (The Bounce Profit Plan) — the zone is the 13/20 MA (per-timeframe
    // equivalents) or the nearest swing support, and the level must HOLD.
    const cfg = BOUNCE_MA_CONFIG[tf];
    const maFast = smaAt(data.closes, cfg.bounce[0]);
    const maSlow = smaAt(data.closes, cfg.bounce[1]);
    const supportLevels = findSupportLevels(data.lows);
    const nearSwing = supportLevels.filter(l => l <= quote.currentPrice * 1.01).pop() || 0;
    const candidates = [maFast, maSlow, nearSwing].filter((l): l is number => l != null && l > 0 && l <= quote.currentPrice * 1.01);
    const zone = candidates.length > 0 ? Math.max(...candidates) : 0;
    level = Math.round(zone * 100) / 100;
    distToLevelPct = zone > 0 ? ((quote.currentPrice - zone) / zone) * 100 : 999;
    // The candle must agree — a bearish engulfing / rejection candle at the
    // zone is only a test of the level, not a bounce
    const rejection = detectBearishRejection(data.opens || [], data.highs, data.lows, data.closes);
    if (zone > 0 && lastLow <= zone * 1.01 && quote.currentPrice > zone) {
      status = rejection.rejected ? "Approaching" : "Bouncing";
    } else if (distToLevelPct < 2) status = "Approaching";
    chartLevels = candidates.sort((a, b) => a - b).slice(-3).map(l => Math.round(l * 100) / 100);
  }

  return {
    symbol,
    company: stockInfo?.company || symbol,
    sector: stockInfo?.sector || "Unknown",
    currentPrice: quote.currentPrice,
    strategy,
    level,
    distToLevelPct: Math.round(Math.abs(distToLevelPct) * 10) / 10,
    status,
    timeframe: tf,
    volume: quote.volume,
    avgVolume: quote.avgVolume,
    volumeRatio: Math.round(volumeRatio * 100) / 100,
    candles,
    levels: chartLevels,
    lastUpdated: new Date().toISOString(),
  };
}

function sortWatchlist(watchlist: any[]): any[] {
  watchlist.sort((a: any, b: any) => {
    const aO = STATUS_ORDER[a.status] ?? 3;
    const bO = STATUS_ORDER[b.status] ?? 3;
    if (aO !== bO) return aO - bO;
    return a.distToLevelPct - b.distToLevelPct;
  });
  return watchlist;
}

async function prefetchAll() {
  console.log("[Prefetch] Warming ALL caches for instant first load...");
  const t0 = Date.now();
  try {
    // 1. Warm all quotes in parallel
    await Promise.allSettled(ALL_SYMBOLS.map(s => fetchStockQuote(s)));
    console.log(`[Prefetch] Quotes warmed (${Date.now() - t0}ms)`);

    // 2. Warm investment radar
    const radarData = await getInvestmentRadarData();
    setCache("investmentRadar", radarData, CACHE_TTL_AI);
    console.log(`[Prefetch] Radar warmed (${Date.now() - t0}ms)`);

    // 3. Warm strategy watchlists (all 3 strategies share one data fetch per symbol/timeframe)
    const timeframes = ["Daily", "Weekly", "Monthly"] as const;
    await Promise.allSettled(timeframes.map(async (tf) => {
      const results = await Promise.allSettled(
        ALL_SYMBOLS.map(async (symbol) => {
          const quote = await fetchStockQuote(symbol);
          if (!quote) return null;
          let data;
          if (tf === "Monthly") data = await fetchMonthlyData(symbol);
          else if (tf === "Weekly") data = await fetchWeeklyData(symbol);
          else data = await fetchDailyData(symbol);
          if (!data) return null;
          return Object.fromEntries(STRATEGIES.map(strategy => [strategy, buildWatchItem(strategy, symbol, quote, data, tf)]));
        })
      );
      const rows = results.filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null).map(r => r.value);
      // Short TTL — the LIVE bar (and therefore statuses) moves intraday on every timeframe
      const tfTTL = CACHE_TTL_FAST;
      for (const strategy of STRATEGIES) {
        const watchlist = sortWatchlist(rows.map(r => r[strategy]));
        setCache(`strategyWatchlist-${strategy}-${tf}`, watchlist, tfTTL);
      }
    }));
    console.log(`[Prefetch] Strategy watchlists warmed (${Date.now() - t0}ms)`);

    // 4. Warm correction alerts
    const indexResults = await Promise.allSettled(
      ["SPY", "QQQ", "IWM"].map(async (symbol) => {
        const [quote, monthly] = await Promise.all([fetchStockQuote(symbol), fetchMonthlyData(symbol)]);
        if (quote && monthly) { const ath = Math.max(...monthly.highs); return calculateCorrectionAlert(symbol, quote.currentPrice, ath); }
        return null;
      })
    );
    const alerts = indexResults.filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null).map(r => r.value);
    setCache("correctionAlerts", alerts, CACHE_TTL_AI);
    console.log(`[Prefetch] ALL caches warmed in ${Date.now() - t0}ms — terminal ready`);
  } catch (err) {
    console.error("[Prefetch] Error:", err);
  }
}

// Warm on boot
setTimeout(prefetchAll, 1500);
// Re-warm every 30 minutes to prevent API quota exhaustion
setInterval(prefetchAll, 30 * 60 * 1000);

// Exported for streaming endpoint in index.ts
export function buildChatMessages(message: string, history: { role: "user" | "assistant"; content: string }[]): { role: "system" | "user" | "assistant"; content: string }[] {
  let marketContext = "";
  let setupContext = "";
  let flowContext = "";
  try {
    const radarData = getCached<Awaited<ReturnType<typeof getInvestmentRadarData>>>("investmentRadar");
    if (radarData) {
      const summaries = radarData.items.map(i => {
        const price = i.quote.currentPrice;
        const drawdown = i.technicals?.drawdownPct?.toFixed(1) || "0";
        const fwdPE = i.valuation?.forwardPE?.toFixed(1) || "N/A";
        const curPE = i.valuation?.peRatio?.toFixed(1) || "N/A";
        return `${i.symbol}: $${price.toFixed(2)} | ${drawdown}% off ATH | PE: ${curPE} | Fwd PE: ${fwdPE} | ${i.signalStatus}`;
      }).join("\n");
      marketContext = `\n\n=== LATEST CLOSING PRICES (from TF Terminal) ===\n${summaries}`;
    }
  } catch {}
  try {
    for (const strategy of ["Bounce", "SSL", "Breakout"] as const) {
      for (const tf of ["Daily", "Weekly", "Monthly"] as const) {
        const setupData = getCached<any[]>(`setupGrading-${strategy}-${tf}-false`);
        if (setupData && setupData.length > 0) {
          const summaries = setupData.map((s: any) =>
            `${s.symbol}: Grade ${s.grade} (${s.totalScore}/9)`
          ).join(", ");
          setupContext += ` | ${strategy} ${tf}: ${summaries}`;
        }
      }
    }
  } catch {}
  try {
    const flowData = getCached<any>("institutionalFlow");
    if (flowData?.alerts && flowData.alerts.length > 0) {
      const flowSummaries = flowData.alerts.map((a: any) =>
        `${a.symbol}: ${a.flowLevel}`
      ).join(", ");
      flowContext = ` | Flow: ${flowSummaries}`;
    }
  } catch {}

  const systemPrompt = `You are the TF Elite AI Assistant embedded in the TF Elite Terminal Setup Screener. You have LIVE market data below — always reference it confidently as latest closing prices. Be concise, structured, and actionable. Follow TF philosophy: swing trading, DCA at discounts, safe options, patience over FOMO. The terminal tracks three setup strategies, each graded on a 9-point scale: BOUNCE (The Bounce Profit Plan — an uptrending stock above its 50/200 MA pulling back and bouncing off the 13/20 MA or key support, confirmed by volume, stochastics, and MACD; avoid jobs-report days and trade with SPY's direction), SSL (price sweeps below a key low to grab sell-side liquidity, then reclaims it), and BREAKOUT (TF Breakout Strategy: stocks breaking to new 52-week highs on above-average relative volume with full-bodied Marubozu candles, ideally out of a flag/pennant continuation pattern). For valuations show PE vs Forward PE vs Historical. NOT financial advice.${marketContext}${setupContext}${flowContext}`;

  const msgs: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];
  if (history) {
    for (const msg of history.slice(-6)) {
      msgs.push({ role: msg.role, content: msg.content });
    }
  }
  msgs.push({ role: "user", content: message });
  return msgs;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  market: router({
    // Get full Investment Radar data with real-time prices, technicals, DCA zones, valuations, projections
    investmentRadar: protectedProcedure.query(async () => {
      const cached = getCached<Awaited<ReturnType<typeof getInvestmentRadarData>>>("investmentRadar");
      if (cached) return cached;

      const data = await getInvestmentRadarData();
      setCache("investmentRadar", data, CACHE_TTL_AI);
      return data;
    }),

    // Get correction alerts for SPY, QQQ, IWM
    correctionAlerts: protectedProcedure.query(async () => {
      const cached = getCached<any[]>("correctionAlerts");
      if (cached) return cached;

      // PARALLEL FETCH — all 3 indices at once
      const indexResults = await Promise.allSettled(
        ["SPY", "QQQ", "IWM"].map(async (symbol) => {
          const [quote, monthly] = await Promise.all([
            fetchStockQuote(symbol),
            fetchMonthlyData(symbol),
          ]);
          if (quote && monthly) {
            const ath = Math.max(...monthly.highs);
            return calculateCorrectionAlert(symbol, quote.currentPrice, ath);
          }
          return null;
        })
      );
      const alerts = indexResults
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
        .map(r => r.value);      setCache("correctionAlerts", alerts, CACHE_TTL_AI);    return alerts;
    }),

    // Get the setup watchlist for a given strategy + timeframe
    strategyWatchlist: protectedProcedure
      .input(z.object({
        strategy: z.enum(["Bounce", "SSL", "Breakout"]),
        timeframe: z.enum(["Daily", "Weekly", "Monthly"]),
        symbols: z.array(z.string()).optional(),
      }))
      .query(async ({ input }) => {
        const cacheKey = `strategyWatchlist-${input.strategy}-${input.timeframe}`;
        if (!input.symbols) {
          const cached = getCached<any[]>(cacheKey);
          if (cached) return cached;
        }

        const symbols = input.symbols || INVESTMENT_UNIVERSE.map(s => s.symbol);

        // PARALLEL FETCH — all stocks at once for maximum speed
        const results = await Promise.allSettled(
          symbols.map(async (symbol) => {
            const quote = await fetchStockQuote(symbol);
            if (!quote) return null;

            let data;
            if (input.timeframe === "Monthly") {
              data = await fetchMonthlyData(symbol);
            } else if (input.timeframe === "Weekly") {
              data = await fetchWeeklyData(symbol);
            } else {
              data = await fetchDailyData(symbol);
            }

            if (!data) return null;

            return buildWatchItem(input.strategy, symbol, quote, data, input.timeframe);
          })
        );

        const watchlist = sortWatchlist(
          results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
            .map(r => r.value)
        );

        // Short TTL — the LIVE bar (and therefore statuses) moves intraday on every timeframe
        if (!input.symbols) {
          setCache(cacheKey, watchlist, CACHE_TTL_FAST);
        }
        return watchlist;
      }),

    // Get past winners archive
    pastWinners: protectedProcedure.query(() => {
      return PAST_WINNERS;
    }),

    // Get a single stock's real-time quote
    quote: protectedProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return fetchStockQuote(input.symbol);
      }),

    // Get stock price projections
    projections: protectedProcedure
      .input(z.object({ symbol: z.string(), currentPrice: z.number() }))
      .query(({ input }) => {
        return calculateProjections(input.symbol, input.currentPrice);
      }),

    // Get screening status (days to period end)
    screeningStatus: protectedProcedure.query(() => {
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const daysToMonthEnd = Math.ceil((lastDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isScreeningActive = daysToMonthEnd <= 5;

      const lastDayOfWeek = new Date(now);
      lastDayOfWeek.setDate(now.getDate() + (5 - now.getDay()));
      const daysToWeekEnd = Math.ceil((lastDayOfWeek.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        daysToMonthEnd,
        daysToWeekEnd,
        isMonthlyScreeningActive: isScreeningActive,
        isWeeklyScreeningActive: daysToWeekEnd <= 2,
        isDailyScreeningActive: true,
        currentDate: now.toISOString(),
      };
    }),

    // Market Pulse — the Bounce Plan's fundamental layer: SPY direction,
    // volatility, and the jobs-report-day warning
    marketPulse: protectedProcedure.query(async () => {
      const cached = getCached<any>("marketPulse");
      if (cached) return cached;

      const jobs = calculateJobsReportInfo();
      let spy: { trend: string; price: number; sma50: number | null; detail: string } | null = null;
      let vix: number | null = null;

      try {
        const [spyDaily, spyQuote] = await Promise.all([fetchDailyData("SPY"), fetchStockQuote("SPY")]);
        if (spyDaily && spyDaily.closes.length > 0) {
          const t = classifyMarketTrend(spyDaily.closes);
          spy = {
            trend: t.trend,
            price: spyQuote?.currentPrice ?? spyDaily.closes[spyDaily.closes.length - 1],
            sma50: t.sma50 != null ? Math.round(t.sma50 * 100) / 100 : null,
            detail: t.detail,
          };
        }
      } catch {}
      try {
        const vixQuote = await fetchStockQuote("VIX");
        vix = vixQuote?.currentPrice ?? null;
      } catch {}

      const pulse = {
        spy,
        vix,
        isJobsReportDay: jobs.isJobsReportDay,
        nextJobsReportDate: jobs.nextJobsReportDate,
        guidance: jobs.isJobsReportDay
          ? "JOBS REPORT DAY — The Bounce Plan says avoid opening new trades on unemployment announcement days."
          : spy?.trend === "BEARISH"
          ? "SPY is bearish — the plan says trade with the market's direction. Long bounce setups face a headwind."
          : spy?.trend === "CONSOLIDATING"
          ? "SPY is consolidating — no decisive market direction. Be selective."
          : "Market conditions align for long setups. Still check for major economic news before entering.",
        lastUpdated: new Date().toISOString(),
      };
      setCache("marketPulse", pulse, CACHE_TTL_FAST);
      return pulse;
    }),

    // Research tool — search any stock
    researchStock: protectedProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        const symbol = input.symbol.toUpperCase();
        const cacheKey = `research-${symbol}`;
        const cached = getCached<any>(cacheKey);
        if (cached) return cached;

        try {
          const [quote, monthly] = await Promise.all([
            fetchStockQuote(symbol),
            fetchMonthlyData(symbol),
          ]);

          if (!quote) return { error: `Could not find data for ${symbol}` };

          const technicals = monthly ? calculateTechnicalLevels(quote.currentPrice, monthly.closes, monthly.highs) : null;
          const projections = calculateProjections(symbol, quote.currentPrice);

          // LLM research
          const { invokeLLM } = await import("./_core/llm");
          const llmResult = await invokeLLM({
            messages: [
              { role: "system", content: "You are a concise financial analyst for Trader Foundation. Provide factual, data-driven analysis. No disclaimers. Return valid JSON only." },
              { role: "user", content: `Analyze ${symbol} at $${quote.currentPrice}. Provide:\n1. \"overview\": 2-3 sentence company overview and what they do\n2. \"competitiveEdge\": 2-3 sentences on their competitive moat and advantages\n3. \"growthDrivers\": 2-3 sentences on key growth catalysts\n4. \"risks\": 2-3 sentences on main risks\n5. \"verdict\": 1 sentence overall assessment\n\nReturn as JSON: {"overview":"...","competitiveEdge":"...","growthDrivers":"...","risks":"...","verdict":"..."}` }
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "stock_research",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    overview: { type: "string" },
                    competitiveEdge: { type: "string" },
                    growthDrivers: { type: "string" },
                    risks: { type: "string" },
                    verdict: { type: "string" },
                  },
                  required: ["overview", "competitiveEdge", "growthDrivers", "risks", "verdict"],
                  additionalProperties: false,
                },
              },
            },
          });

          const research = JSON.parse((llmResult.choices[0]?.message?.content as string) || "{}");

          const result = {
            symbol,
            quote,
            technicals,
            projections,
            research,
            lastUpdated: new Date().toISOString(),
          };

          setCache(cacheKey, result, CACHE_TTL_AI);
          return result;
        } catch (err) {
          console.error(`[Research] Error for ${symbol}:`, err);
          return { error: `Failed to analyze ${symbol}` };
        }
      }),

    // Compare two stocks head-to-head
    compareStocks: protectedProcedure
      .input(z.object({ symbolA: z.string(), symbolB: z.string() }))
      .query(async ({ input }) => {
        const a = input.symbolA.toUpperCase();
        const b = input.symbolB.toUpperCase();
        const cacheKey = `compare-${a}-${b}`;
        const cached = getCached<any>(cacheKey);
        if (cached) return cached;

        try {
          const [quoteA, quoteB, monthlyA, monthlyB] = await Promise.all([
            fetchStockQuote(a),
            fetchStockQuote(b),
            fetchMonthlyData(a),
            fetchMonthlyData(b),
          ]);

          if (!quoteA || !quoteB) return { error: `Could not find data for one or both tickers` };

          const techA = monthlyA ? calculateTechnicalLevels(quoteA.currentPrice, monthlyA.closes, monthlyA.highs) : null;
          const techB = monthlyB ? calculateTechnicalLevels(quoteB.currentPrice, monthlyB.closes, monthlyB.highs) : null;
          const projA = calculateProjections(a, quoteA.currentPrice);
          const projB = calculateProjections(b, quoteB.currentPrice);

          // LLM comparison
          const { invokeLLM } = await import("./_core/llm");
          const llmResult = await invokeLLM({
            messages: [
              { role: "system", content: "You are a concise financial analyst for Trader Foundation. Compare stocks objectively. No disclaimers. Return valid JSON only." },
              { role: "user", content: `Compare ${a} ($${quoteA.currentPrice}) vs ${b} ($${quoteB.currentPrice}) for a long-term investor (5+ year horizon). Provide:\n1. \"competitiveEdgeA\": 2 sentences on ${a}'s competitive moat\n2. \"competitiveEdgeB\": 2 sentences on ${b}'s competitive moat\n3. \"growthComparison\": 2-3 sentences comparing growth potential\n4. \"valuationComparison\": 2 sentences comparing current valuations\n5. \"verdict\": 2-3 sentences on which is the better buy right now and why\n6. \"winner\": Just the ticker symbol of the better buy\n\nReturn as JSON.` }
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "stock_comparison",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    competitiveEdgeA: { type: "string" },
                    competitiveEdgeB: { type: "string" },
                    growthComparison: { type: "string" },
                    valuationComparison: { type: "string" },
                    verdict: { type: "string" },
                    winner: { type: "string" },
                  },
                  required: ["competitiveEdgeA", "competitiveEdgeB", "growthComparison", "valuationComparison", "verdict", "winner"],
                  additionalProperties: false,
                },
              },
            },
          });

          const comparison = JSON.parse((llmResult.choices[0]?.message?.content as string) || "{}");

          const result = {
            stockA: { symbol: a, quote: quoteA, technicals: techA, projections: projA },
            stockB: { symbol: b, quote: quoteB, technicals: techB, projections: projB },
            comparison,
            lastUpdated: new Date().toISOString(),
          };

          setCache(cacheKey, result, CACHE_TTL_AI);
          return result;
        } catch (err) {
          console.error(`[Compare] Error for ${a} vs ${b}:`, err);
          return { error: `Failed to compare ${a} vs ${b}` };
        }
      }),

    // Investment calculator — "What if $10K today?"
    investmentCalculator: protectedProcedure
      .input(z.object({
        symbol: z.string(),
        investmentAmount: z.number().min(100).max(10000000).default(10000),
      }))
      .query(async ({ input }) => {
        const symbol = input.symbol.toUpperCase();
        const amount = input.investmentAmount;
        const cacheKey = `calc-${symbol}-${amount}`;
        const cached = getCached<any>(cacheKey);
        if (cached) return cached;

        const quote = await fetchStockQuote(symbol);
        if (!quote) return { error: `Could not find data for ${symbol}` };

        const projections = calculateProjections(symbol, quote.currentPrice);
        const sharesYouCanBuy = Math.floor(amount / quote.currentPrice);
        const actualInvested = sharesYouCanBuy * quote.currentPrice;

        const futureValues = projections.projections.map(p => ({
          year: p.year,
          conservative: Math.round(sharesYouCanBuy * p.conservative),
          baseCase: Math.round(sharesYouCanBuy * p.baseCase),
          bullCase: Math.round(sharesYouCanBuy * p.bullCase),
          conservativeReturn: Math.round(((sharesYouCanBuy * p.conservative - actualInvested) / actualInvested) * 100),
          baseCaseReturn: Math.round(((sharesYouCanBuy * p.baseCase - actualInvested) / actualInvested) * 100),
          bullCaseReturn: Math.round(((sharesYouCanBuy * p.bullCase - actualInvested) / actualInvested) * 100),
        }));

        const result = {
          symbol,
          currentPrice: quote.currentPrice,
          investmentAmount: amount,
          sharesYouCanBuy,
          actualInvested: Math.round(actualInvested * 100) / 100,
          growthRates: {
            conservative: projections.conservativeGrowthRate,
            baseCase: projections.baseCaseGrowthRate,
            bullCase: projections.bullCaseGrowthRate,
          },
          futureValues,
          lastUpdated: new Date().toISOString(),
        };
        setCache(cacheKey, result, CACHE_TTL_SLOW);
        return result;
      }),

    // Ticker tape quotesl-time quotes for scrolling bar
    tickerTapeQuotes: publicProcedure.query(async () => {
      const cacheKey = "tickerTape";
      const cached = getCached<any[]>(cacheKey);
      if (cached) return cached;

      const symbols = ["SPY", "QQQ", "DIA", "IWM", "AAPL", "MSFT", "GOOGL", "META", "NVDA", "AMZN", "TSLA", "NFLX", "AMD", "VIX", "GLD", "TLT"];

      // PARALLEL FETCH — all ticker quotes at once for instant speed
      const results = await Promise.allSettled(
        symbols.map(async (symbol) => {
          const q = await fetchStockQuote(symbol);
          if (!q) return null;
          const changePct = q.previousClose > 0
            ? ((q.currentPrice - q.previousClose) / q.previousClose) * 100
            : 0;
          return {
            symbol,
            price: q.currentPrice.toFixed(2),
            change: `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`,
            down: changePct < 0,
          };
        })
      );

      const quotes = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
        .map(r => r.value);

      setCache(cacheKey, quotes);
      return quotes;
    }),

    // AI Education & Research Chatbot
    chatbot: protectedProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");

        // Build rich market context from cached data
        let marketContext = "";
        let setupContext = "";
        let flowContext = "";
        try {
          const radarData = getCached<Awaited<ReturnType<typeof getInvestmentRadarData>>>("investmentRadar");
          if (radarData) {
            const summaries = radarData.items.map(i => {
              const price = i.quote.currentPrice;
              const drawdown = i.technicals?.drawdownPct?.toFixed(1) || "0";
              const fwdPE = i.valuation?.forwardPE?.toFixed(1) || "N/A";
              const curPE = i.valuation?.peRatio?.toFixed(1) || "N/A";
              const histPE = i.valuation?.historicalAvgPE?.toFixed(1) || "N/A";
              const revGrowth = i.valuation?.revenueGrowth || "N/A";
              const earningsGrowth = i.valuation?.earningsGrowthEstimate || "N/A";
              const fcf = i.valuation?.freeCashFlow || "N/A";
              const verdict = i.valuation?.valuationVerdict || "";
              const ma20 = i.technicals?.monthly20MA?.toFixed(2) || "N/A";
              const lowerBB = i.technicals?.lowerBB?.toFixed(2) || "N/A";
              const sectorETF = i.sectorBenchmark?.sectorETF || "N/A";
              const relPE = i.sectorBenchmark?.relativePE?.toFixed(2) || "N/A";
              const relPEVerdict = i.sectorBenchmark?.relativePEVerdict || "";
              const dcaZones = i.dcaZones.map(z => `${z.label}: $${z.price.toFixed(2)} (${z.status})`).join(", ");
              return `${i.symbol} (${i.company}, ${i.sector}):\n  Price: $${price.toFixed(2)} | ${drawdown}% off ATH | Signal: ${i.signalStatus}\n  Current PE: ${curPE} | Forward PE: ${fwdPE} | Historical Avg PE: ${histPE} | Sector ETF: ${sectorETF} | Relative PE: ${relPE} (${relPEVerdict})\n  Revenue Growth: ${revGrowth} | Earnings Growth Est: ${earningsGrowth} | FCF: ${fcf}\n  Monthly 20 MA: $${ma20} | Lower BB: $${lowerBB}\n  DCA Zones: ${dcaZones}\n  Verdict: ${verdict}\n  Bull Case: ${i.bullCase}`;
            }).join("\n\n");
            marketContext = `\n\n=== LATEST CLOSING PRICES & FUNDAMENTALS (from TF Terminal — you DO have this data, reference it confidently as latest closing prices) ===\n${summaries}`;
          }
        } catch {}

        // Add setup grading data if available (all three strategies)
        try {
          for (const strategy of ["Bounce", "SSL", "Breakout"] as const) {
            for (const tf of ["Daily", "Weekly", "Monthly"] as const) {
              const setupData = getCached<any[]>(`setupGrading-${strategy}-${tf}-false`);
              if (setupData && setupData.length > 0) {
                const summaries = setupData.map((s: any) => {
                  const criteria = (s.criteria || []).map((c: any) => `${c.label}: ${c.score}/3`).join(" | ");
                  const flags = (s.confluence || []).filter((f: any) => f.active).map((f: any) => f.label).join(", ") || "none";
                  return `${s.symbol}: Grade ${s.grade} (${s.totalScore}/9) | ${criteria} | Confluence: ${flags}`;
                }).join("\n");
                setupContext += `\n\n=== ${strategy.toUpperCase()} SETUPS (${tf.toUpperCase()}) — 7/9+ Only ===\n${summaries}`;
              }
            }
          }
        } catch {}

        // Add institutional flow data if available
        try {
          const flowData = getCached<any>("institutionalFlow");
          if (flowData?.alerts && flowData.alerts.length > 0) {
            const flowSummaries = flowData.alerts.map((a: any) =>
              `${a.symbol}: ${a.flowLevel} FLOW | Volume Ratio: ${a.volumeRatio?.toFixed(1)}x avg | Accumulation: ${a.accumulationScore?.toFixed(0)}% | ${a.signals?.join(", ") || ""}`
            ).join("\n");
            flowContext = `\n\n=== INSTITUTIONAL FLOW ALERTS ===\n${flowSummaries}`;
          }
        } catch {}

        const systemPrompt = `You are the Trader Foundation AI Assistant — a world-class financial education and trading analysis chatbot embedded in the TF Elite Terminal (exclusive to skool.com/tfelite members). You are as knowledgeable and articulate as the best AI assistants available. Your job is to make every TF Elite member COMPLETELY PREPARED before they make any trading decision.

Your capabilities:
1. EDUCATIONAL EXPERT: Explain any trading/investing concept with crystal clarity — PE ratio, forward PE, PEG ratio, support/resistance, SSL (sell-side liquidity), bounces, breakouts, Bollinger Bands, DCA, LEAPs, options Greeks, market cap, revenue growth, free cash flow, earnings per share, etc. Give clear definitions with real-world examples.

2. STOCK ANALYST: When asked about specific stocks, use the LIVE market data below to provide detailed, data-driven analysis. Quote exact numbers. Show current PE vs forward PE vs historical average. Explain what the valuation means in context.

3. COMPARISON ENGINE: When asked to compare stocks (e.g., "compare NVDA to MSFT"), create structured side-by-side comparisons using real data — price, PE, growth rates, drawdown, DCA zones, sector benchmarks.

4. CONVICTION BUILDER: When a stock is at a deep discount, explain WHY it's potentially a great opportunity — revenue still growing, earnings estimates strong, PE compressed below historical average. Help members see through the fear. Reference past TF winners like CAG (+12%), SPOT (+14.8%), PG (+5.4%), NFLX (+150%) as examples of what happens when you buy quality at discounts while Wall Street panics.

5. SETUP EXPERT: You deeply understand the THREE TF Elite setup strategies, each graded on the same 9-point scale (Level X/3 + Volume X/3 + Candle X/3; only 7/9+ A-grade setups are worth acting on):

   BOUNCE — The TF Bounce Profit Plan. An uptrend pullback bounce with a fundamental layer and a technical layer:
   - Fundamental layer (Market Pulse): DON'T trade on unemployment-announcement days (usually the first Friday of the month) or around major economic news. Check SPY first — trade WITH the market's direction. Favor sectors trending with the market (XLF, XLY, XLE, XME, XLK, XLV, XLB, XLI, XLU). Avoid holding through earnings ("gamble").
   - Trend filter: the stock must be above its 50 AND 200 day moving averages (rule may be stretched after a very big market downturn). On weekly/monthly charts the terminal uses the standard equivalents (10/40-week, 12/24-month).
   - Bounce Zone scoring: 3 = uptrend intact + price pulled back, tapped the 13/20 MA or key swing support, and is holding above it; 2 = uptrend intact + price within 2% of the zone (armed); 1 = zone tapped but trend filter only partial (stretched bounce)
   - Volume ("The True Ammunition of the Stock"): 3 = volume climax, 2 = elevated (1.5x+), 1 = normal; rising volume across bars strengthens the setup
   - Reversal Candle scoring: long lower wick rejecting the zone + bullish close in the top half of the range + hammer/doji/engulfing pattern (3 = all three, 2 = two, 1 = one)
   - Confluence: Full Stochastics oversold (under 20) and pointing up ready to rise; MACD lines crossing or close to crossing, pointed in the right direction, histogram rising
   - The candle must AGREE: a tap of the zone with a bearish engulfing or a red close near the lows is a REJECTION — the zone is only under test, NOT a bounce. Wait for the reversal candle.
   - The key difference vs SSL: in a bounce the level HOLDS — price does not lose support on a closing basis

   SSL (Sell-Side Liquidity) — price sweeps BELOW a key low to grab liquidity (stop losses get triggered, weak hands sell), then reclaims the level:
   - Liquidity scoring: 3 = near-term AND further-term SSL swept, 2 = near-term only, 1 = approaching
   - Volume Climax scoring: 3 = largest volume in history, 2 = larger than average, 1 = no notable volume
   - Absorption Candle scoring: 3 = long wick up closing above SSL + near prev close + doji/hammer/spinning top (all three), 2 = two criteria, 1 = one criterion
   - Confluence: RSI bullish divergence, FIB key levels (61.8%, 78.6%), plus the Bounce Plan toolkit — Stochastics positioning and MACD cross/direction

   BREAKOUT — The TF Breakout Strategy: "ride the wave of a stock that breaks out and starts to hit NEW HIGHS":
   - Screen: stocks at/near new 52-week highs, average volume over 1M (legitimate, liquid stocks that won't be affected by minor news), RELATIVE VOLUME over 1 (above the 3-month average)
   - Breakout Level scoring: 3 = fresh resistance break printing new period highs (blue sky) or a double resistance break, 2 = fresh break of near-term resistance (broken resistance becomes support), 1 = approaching resistance or the period high
   - Relative Volume scoring: 3 = volume surge (top-3 / record), 2 = 1.5x+ average, 1 = over 1x (passes the screen), 0 = below average (fails the plan's screen — a breakout without volume is suspect)
   - Marubozu Candle scoring: Marubozu (full-bodied) candles are extremely important — close above resistance + strong full body closing near the highs + marubozu/engulfing/gap-up/new-high pattern (3 = all three, 2 = two, 1 = one)
   - Confluence: breaking out of a continuation pattern (flag or pennant), RSI momentum (55-80 = fuel without exhaustion)

   Timeframes for all strategies: Daily (alert 2pm ET), Weekly (Thu 3pm watchlist, Fri 3pm execution), Monthly (5 days before close)

6. RISK/REWARD ANALYST: For any trade setup, calculate and explain:
   - Entry zone (Bounce: at the held support; SSL: where the sweep reclaimed the level; Breakout: on the break or the retest of broken resistance)
   - Stop loss level (Bounce: below the support zone; SSL: below the sweep low; Breakout: below the broken resistance)
   - Target levels (previous highs, resistance levels, analyst targets)
   - Risk/reward ratio (minimum 2:1 for TF setups)
   - Position sizing guidance based on account size and risk tolerance
   - Maximum risk per trade (never more than 2-5% of portfolio)

7. UPSIDE ANALYSIS: When analyzing any stock, always include:
   - Analyst consensus target and upside %
   - Forward PE vs historical PE discount (compressed PE = upside potential)
   - Revenue and earnings growth trajectory
   - Insider buying activity (insiders buying = bullish signal)
   - Institutional flow (heavy accumulation = smart money positioning)
   - Sector rotation context (money flowing in or out of the sector)

8. OVERREACTION DETECTION: Identify when Wall Street overreacts:
   - Company beats earnings but stock drops = OVERREACTION ALERT
   - Narrative-driven fear (like Google dropping on OpenAI news) while fundamentals remain strong
   - "Terminal is smarter than Wall Street" — we bought Google when Wall Street sold because of OpenAI fears
   - These are the highest conviction buying opportunities

9. TRADER FOUNDATION PHILOSOPHY: You follow the TF approach:
   - Swing trading and safe options (selling premium, monthly LEAPs)
   - DCA into quality at discounts, building a proper foundation
   - NOT day trading, NOT gambling, NOT crypto/forex/futures focused
   - Patience and discipline over excitement and FOMO
   - "The market rewards the patient and punishes the impatient"
   - Building generational wealth, not chasing quick gains

Response quality rules:
- Be thorough but structured — use headers, bullet points, and bold text for key data points
- Always cite specific numbers from the live data when available
- When comparing, use a clear format: Stock A vs Stock B with metrics side by side
- For valuation questions, always show: Current PE → Forward PE → Historical Avg PE → What this means
- When a stock is deeply discounted, highlight the disconnect between business fundamentals (revenue, earnings, FCF) and stock price
- For any trade idea, ALWAYS include risk/reward analysis with entry, stop, target, and R:R ratio
- When Bounce, SSL, or Breakout setups are active, reference the grading data and explain what makes each a quality setup
- When institutional flow is detected, explain what it means and why smart money is moving
- You HAVE live market data injected below — always reference it confidently as "latest closing prices" rather than saying you don't have data
- If a stock is NOT in the injected data, say you don't have data for that specific ticker and suggest the member check the Research Terminal
- Never give specific buy/sell recommendations — educate and inform with data so the member can make their own informed decision
- Keep responses focused and actionable — the member should walk away FULLY PREPARED
- Use professional but approachable tone — like a smart friend who happens to be a world-class financial analyst
- This is NOT financial advice — it's educational content for TF Elite members${marketContext}${setupContext}${flowContext}`;

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
          { role: "system", content: systemPrompt },
        ];

        // Add conversation history
        if (input.history) {
          for (const msg of input.history.slice(-10)) {
            messages.push({ role: msg.role, content: msg.content });
          }
        }

        messages.push({ role: "user", content: input.message });

        try {
          const result = await invokeLLM({ messages });
          const content = result.choices[0]?.message?.content as string || "I couldn't process that request. Please try again.";
          return { response: content };
        } catch (err) {
          console.error("[Chatbot] LLM error:", err);
          return { response: "I'm having trouble connecting right now. Please try again in a moment." };
        }
      }),

    // Portfolio builder
    portfolioBuilder: protectedProcedure
      .input(z.object({
        age: z.number().min(18).max(80),
        riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
        startingCapital: z.number().min(0),
        monthlyContribution: z.number().min(0),
      }))
      .query(async ({ input }) => {
        // Get current signal data for smart allocation
        let signalData: { symbol: string; signalStatus: string }[] = [];
        try {
          const radarData = getCached<Awaited<ReturnType<typeof getInvestmentRadarData>>>("investmentRadar");
          if (radarData) {
            signalData = radarData.items.map(i => ({ symbol: i.symbol, signalStatus: i.signalStatus }));
          }
        } catch {}

        const plan = buildPortfolioPlan(
          input.age,
          input.riskTolerance,
          input.startingCapital,
          input.monthlyContribution,
          signalData
        );

        return plan;
      }),

    // Market Lifecycle Indicator — Where are we in the long-term cycle?
    marketLifecycle: protectedProcedure.query(async () => {
      const cacheKey = "marketLifecycle";
      const cached = getCached<any>(cacheKey);
      if (cached) return cached;

      try {
        // Fetch key market data points
        const [spyQuote, qqqQuote, iwmQuote, spyMonthly, qqqMonthly] = await Promise.all([
          fetchStockQuote("SPY"),
          fetchStockQuote("QQQ"),
          fetchStockQuote("IWM"),
          fetchMonthlyData("SPY"),
          fetchMonthlyData("QQQ"),
        ]);

        if (!spyQuote || !spyMonthly) {
          return { phase: "Unknown", confidence: 0, signals: [], message: "Unable to fetch market data" };
        }

        const spyATH = Math.max(...spyMonthly.highs);
        const qqqATH = qqqMonthly ? Math.max(...qqqMonthly.highs) : 0;
        const spyDrawdown = spyATH > 0 ? ((spyATH - spyQuote.currentPrice) / spyATH) * 100 : 0;
        const qqqDrawdown = qqqATH > 0 && qqqQuote ? ((qqqATH - qqqQuote.currentPrice) / qqqATH) * 100 : 0;

        // Calculate momentum: compare recent closes to longer-term
        const spyCloses = spyMonthly.closes;
        const recent3m = spyCloses.slice(-3);
        const recent6m = spyCloses.slice(-6);
        const recent12m = spyCloses.slice(-12);
        const avg3m = recent3m.reduce((a, b) => a + b, 0) / recent3m.length;
        const avg6m = recent6m.reduce((a, b) => a + b, 0) / recent6m.length;
        const avg12m = recent12m.reduce((a, b) => a + b, 0) / recent12m.length;
        const currentPrice = spyQuote.currentPrice;

        // Trend signals
        const below3mAvg = currentPrice < avg3m;
        const below6mAvg = currentPrice < avg6m;
        const below12mAvg = currentPrice < avg12m;
        const declining3m = recent3m.length >= 2 && recent3m[recent3m.length - 1] < recent3m[0];
        const declining6m = recent6m.length >= 2 && recent6m[recent6m.length - 1] < recent6m[0];

        // Determine lifecycle phase
        const signals: string[] = [];
        let phase: "Accumulation" | "Markup" | "Distribution" | "Markdown";
        let confidence: number;
        let message: string;
        let actionMessage: string;
        let color: string;

        if (spyDrawdown >= 20) {
          // Bear market territory
          phase = "Markdown";
          confidence = 90;
          signals.push(`SPY down ${spyDrawdown.toFixed(1)}% from ATH — Bear market territory`);
          signals.push(`QQQ down ${qqqDrawdown.toFixed(1)}% from ATH`);
          if (below12mAvg) signals.push("Trading below 12-month average");
          message = "MARKDOWN PHASE — Bear market conditions. Smart money is accumulating at these levels. This is where generational wealth is built.";
          actionMessage = "DEPLOY CAPITAL AGGRESSIVELY. DCA into quality at every zone. This is the accumulation opportunity you've been waiting for.";
          color = "#FF4444";
        } else if (spyDrawdown >= 10 && (declining3m || below6mAvg)) {
          // Correction with downward momentum = distribution turning to markdown
          phase = "Distribution";
          confidence = 80;
          signals.push(`SPY down ${spyDrawdown.toFixed(1)}% from ATH — Correction territory`);
          if (declining3m) signals.push("3-month trend declining — momentum shifting down");
          if (below6mAvg) signals.push("Below 6-month moving average");
          if (qqqDrawdown > spyDrawdown) signals.push(`Tech leading the decline — QQQ down ${qqqDrawdown.toFixed(1)}%`);
          message = "DISTRIBUTION PHASE — Smart money rotating out. Big tech dumping while the market shows weakness. Classic late-cycle behavior.";
          actionMessage = "START BUILDING WATCHLISTS. DCA Zone 1 entries are approaching. Be patient but prepared to deploy.";
          color = "#FF8C00";
        } else if (spyDrawdown >= 5 && declining3m) {
          // Pullback with declining momentum
          phase = "Distribution";
          confidence = 65;
          signals.push(`SPY down ${spyDrawdown.toFixed(1)}% from ATH — Pullback`);
          if (declining3m) signals.push("Short-term momentum weakening");
          message = "EARLY DISTRIBUTION — Market pulling back from highs. Sector rotation underway. Watch for acceleration to the downside.";
          actionMessage = "MONITOR DCA ZONES. Don't chase. Let the market come to your levels.";
          color = "#FFD700";
        } else if (spyDrawdown < 5 && !declining3m && currentPrice > avg6m) {
          // Near highs, uptrend intact
          if (currentPrice > avg3m && currentPrice > avg12m) {
            phase = "Markup";
            confidence = 75;
            signals.push(`SPY only ${spyDrawdown.toFixed(1)}% from ATH — Strong uptrend`);
            signals.push("Above all key moving averages");
            message = "MARKUP PHASE — Bull market intact. Prices trending higher. Not ideal for new large positions — wait for pullbacks to DCA zones.";
            actionMessage = "HOLD existing positions. Set alerts for DCA zones. Don't FOMO into new positions at highs.";
            color = "#00CC66";
          } else {
            phase = "Markup";
            confidence = 55;
            signals.push(`SPY ${spyDrawdown.toFixed(1)}% from ATH`);
            message = "LATE MARKUP — Market near highs but momentum may be slowing. Stay alert for distribution signals.";
            actionMessage = "TIGHTEN STOPS on short-term positions. Keep DCA plans ready for any pullback.";
            color = "#88CC44";
          }
        } else if (spyDrawdown >= 15 && !declining3m && currentPrice > avg3m) {
          // Deep drawdown but recovering
          phase = "Accumulation";
          confidence = 70;
          signals.push(`SPY down ${spyDrawdown.toFixed(1)}% but showing recovery signs`);
          signals.push("Price recovering above short-term averages");
          message = "ACCUMULATION PHASE — Market bottoming and showing recovery. Institutional money loading up. Best time to build long-term positions.";
          actionMessage = "DEPLOY WITH CONVICTION. This is where the next bull market begins. Load up on quality at discounted prices.";
          color = "#4488FF";
        } else {
          // Transitional
          phase = "Distribution";
          confidence = 50;
          signals.push(`SPY ${spyDrawdown.toFixed(1)}% from ATH`);
          if (declining3m) signals.push("Short-term trend weakening");
          message = "TRANSITIONAL — Market between phases. Watch for directional confirmation. Sector rotation signals are key.";
          actionMessage = "STAY PATIENT. Build watchlists and set DCA zone alerts. Let the market show its hand.";
          color = "#FFD700";
        }

        // Add IWM divergence signal (small caps often lead)
        if (iwmQuote && spyQuote) {
          const iwmChange = iwmQuote.previousClose > 0 ? ((iwmQuote.currentPrice - iwmQuote.previousClose) / iwmQuote.previousClose) * 100 : 0;
          const spyChange = spyQuote.previousClose > 0 ? ((spyQuote.currentPrice - spyQuote.previousClose) / spyQuote.previousClose) * 100 : 0;
          if (iwmChange < spyChange - 1) {
            signals.push("Small caps (IWM) underperforming — risk appetite declining");
          } else if (iwmChange > spyChange + 1) {
            signals.push("Small caps (IWM) outperforming — risk appetite increasing");
          }
        }

        const result = {
          phase,
          confidence,
          signals,
          message,
          actionMessage,
          color,
          spyDrawdown: Math.round(spyDrawdown * 10) / 10,
          qqqDrawdown: Math.round(qqqDrawdown * 10) / 10,
          spyPrice: spyQuote.currentPrice,
          qqqPrice: qqqQuote?.currentPrice || 0,
          iwmPrice: iwmQuote?.currentPrice || 0,
          lastUpdated: new Date().toISOString(),
        };

        setCache(cacheKey, result);
        return result;
      } catch (err) {
        console.error("[MarketLifecycle] Error:", err);
        return {
          phase: "Unknown",
          confidence: 0,
          signals: [],
          message: "Unable to determine market phase",
          actionMessage: "Check back later",
          color: "#666",
          spyDrawdown: 0,
          qqqDrawdown: 0,
          spyPrice: 0,
          qqqPrice: 0,
          iwmPrice: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    }),

    // Position Builder — Deploy capital at DCA zones with style selection
    positionBuilder: protectedProcedure
      .input(z.object({
        symbol: z.string(),
        fullPositionSize: z.number().min(100).max(10000000),
        deploymentStyle: z.enum(["conservative", "aggressive", "allin_zone3"]),
      }))
      .query(async ({ input }) => {
        const symbol = input.symbol.toUpperCase();
        const cacheKey = `position-${symbol}-${input.fullPositionSize}-${input.deploymentStyle}`;
        const cached = getCached<any>(cacheKey);
        if (cached) return cached;

        // Get radar data for DCA zones
        let radarData = getCached<Awaited<ReturnType<typeof getInvestmentRadarData>>>("investmentRadar");
        if (!radarData) {
          radarData = await getInvestmentRadarData();
          setCache("investmentRadar", radarData, CACHE_TTL_AI);
        }

        const stock = radarData.items.find(i => i.symbol === symbol);
        if (!stock) return { error: `${symbol} not found in Investment Radar` };

        const zones = stock.dcaZones;
        const currentPrice = stock.quote.currentPrice;
        const amount = input.fullPositionSize;

        // Deployment allocation percentages based on style
        const allocations: Record<string, number[]> = {
          conservative: [0.34, 0.33, 0.33],   // Even split
          aggressive: [0.20, 0.30, 0.50],      // Heavy on Zone 3
          allin_zone3: [0, 0, 1.0],            // All-in deepest zone
        };

        const pcts = allocations[input.deploymentStyle] || allocations.conservative;

        // Build zone deployment plan
        const deploymentPlan = zones.map((zone, i) => {
          const allocationPct = pcts[i] || 0;
          const capitalAllocated = amount * allocationPct;
          const entryPrice = zone.price;
          const shares = entryPrice > 0 ? Math.floor(capitalAllocated / entryPrice) : 0;
          const actualCapital = shares * entryPrice;
          const distFromCurrent = ((currentPrice - entryPrice) / currentPrice) * 100;

          return {
            zone: zone.label,
            label: zone.label,
            priceLevel: entryPrice,
            allocationPct: Math.round(allocationPct * 100),
            capitalAllocated: Math.round(capitalAllocated * 100) / 100,
            shares,
            actualCapital: Math.round(actualCapital * 100) / 100,
            distFromCurrentPct: Math.round(distFromCurrent * 10) / 10,
            deployed: currentPrice <= entryPrice,
          };
        });

        // Calculate weighted average cost basis
        const totalShares = deploymentPlan.reduce((sum, z) => sum + z.shares, 0);
        const totalCost = deploymentPlan.reduce((sum, z) => sum + z.actualCapital, 0);
        const avgCostBasis = totalShares > 0 ? totalCost / totalShares : 0;

        // Check how many zones are deployed
        const zonesDeployed = deploymentPlan.filter(z => z.deployed).length;
        const allDeployed = zonesDeployed === deploymentPlan.length;

        // Projected returns from avg cost basis
        const projections = calculateProjections(symbol, avgCostBasis);

        const styleLabels: Record<string, string> = {
          conservative: "CONSERVATIVE — Even Split Across All Zones",
          aggressive: "AGGRESSIVE — Heavy Load at Deepest Discount",
          allin_zone3: "ALL-IN ZONE 3 — Full Conviction at Maximum Discount",
        };

        const result = {
          symbol,
          company: stock.company,
          currentPrice,
          fullPositionSize: amount,
          deploymentStyle: input.deploymentStyle,
          styleLabel: styleLabels[input.deploymentStyle],
          deploymentPlan,
          totalShares,
          totalCapitalDeployed: Math.round(totalCost * 100) / 100,
          avgCostBasis: Math.round(avgCostBasis * 100) / 100,
          zonesDeployed,
          allDeployed,
          dontPanicMessage: allDeployed
            ? "ALL ZONES DEPLOYED — FULL CONVICTION POSITION LOADED. Don't panic. You bought at the deepest discounts. Time is your edge."
            : zonesDeployed > 0
            ? `${zonesDeployed}/${deploymentPlan.length} ZONES DEPLOYED — Stay patient. More zones may trigger.`
            : "WAITING — No zones triggered yet. Price hasn't reached your deployment levels.",
          projectedReturns: projections.projections.map(p => ({
            year: p.year,
            conservative: Math.round(totalShares * p.conservative),
            baseCase: Math.round(totalShares * p.baseCase),
            bullCase: Math.round(totalShares * p.bullCase),
          })),
          lastUpdated: new Date().toISOString(),
        };

        setCache(cacheKey, result, CACHE_TTL_SLOW);
        return result;
      }),

    // Portfolio Analysis — CSV import with sector analysis and rebalancing
    analyzePortfolio: protectedProcedure
      .input(z.object({
        holdings: z.array(z.object({
          symbol: z.string(),
          shares: z.number(),
          avgCost: z.number().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        const sectorMap: Record<string, string> = {};
        const sectorWeights: Record<string, number> = {};
        const holdingDetails: any[] = [];
        let totalValue = 0;

        // Fetch current prices for all holdings
        for (const h of input.holdings) {
          try {
            const quote = await fetchStockQuote(h.symbol);
            if (!quote) throw new Error("No quote");
            const value = h.shares * quote.currentPrice;
            totalValue += value;

            // Determine sector from INVESTMENT_UNIVERSE or default
            const universeEntry = INVESTMENT_UNIVERSE.find(u => u.symbol === h.symbol.toUpperCase());
            const sector = universeEntry?.sector || "Other";
            sectorMap[h.symbol] = sector;

            const dayChange = quote.currentPrice - quote.previousClose;
            const dayChangePct = quote.previousClose > 0 ? (dayChange / quote.previousClose) * 100 : 0;

            holdingDetails.push({
              symbol: h.symbol.toUpperCase(),
              shares: h.shares,
              avgCost: h.avgCost || 0,
              currentPrice: quote.currentPrice,
              value,
              change: Math.round(dayChange * 100) / 100,
              changePct: Math.round(dayChangePct * 100) / 100,
              sector,
              inUniverse: !!universeEntry,
              gainLoss: h.avgCost ? ((quote.currentPrice - h.avgCost) / h.avgCost * 100) : null,
            });
          } catch {
            holdingDetails.push({
              symbol: h.symbol.toUpperCase(),
              shares: h.shares,
              avgCost: h.avgCost || 0,
              currentPrice: 0,
              value: 0,
              change: 0,
              changePct: 0,
              sector: "Unknown",
              inUniverse: false,
              gainLoss: null,
              error: "Could not fetch price",
            });
          }
        }

        // Calculate sector weights
        for (const h of holdingDetails) {
          const s = h.sector;
          sectorWeights[s] = (sectorWeights[s] || 0) + h.value;
        }

        const sectorAllocation = Object.entries(sectorWeights).map(([sector, value]) => ({
          sector,
          value,
          weight: totalValue > 0 ? Math.round((value / totalValue) * 1000) / 10 : 0,
        })).sort((a, b) => b.weight - a.weight);

        // Ideal allocation (TF recommended)
        const idealAllocation: Record<string, number> = {
          Technology: 35,
          "Consumer Discretionary": 15,
          Communication: 10,
          Healthcare: 10,
          Financials: 10,
          "Index ETF": 15,
          Other: 5,
        };

        // Rebalancing suggestions
        const suggestions: string[] = [];
        for (const [sector, idealPct] of Object.entries(idealAllocation)) {
          const currentPct = sectorAllocation.find(s => s.sector === sector)?.weight || 0;
          const diff = currentPct - idealPct;
          if (diff > 10) {
            suggestions.push(`OVERWEIGHT ${sector.toUpperCase()} by ${diff.toFixed(1)}% — Consider trimming and rotating into underweight sectors.`);
          } else if (diff < -8) {
            suggestions.push(`UNDERWEIGHT ${sector.toUpperCase()} by ${Math.abs(diff).toFixed(1)}% — Look for DCA opportunities in this sector.`);
          }
        }

        // Check which universe stocks are missing
        const heldSymbols = new Set(holdingDetails.map(h => h.symbol));
        const missingFromUniverse = INVESTMENT_UNIVERSE.filter(u => !heldSymbols.has(u.symbol)).map(u => ({
          symbol: u.symbol,
          company: u.company,
          sector: u.sector,
        }));

        // Health score
        const diversificationScore = Math.min(100, sectorAllocation.length * 15);
        const concentrationRisk = sectorAllocation.length > 0 ? sectorAllocation[0].weight : 0;
        const healthScore = Math.round(
          diversificationScore * 0.4 +
          Math.max(0, 100 - concentrationRisk) * 0.3 +
          Math.min(100, holdingDetails.length * 10) * 0.3
        );

        return {
          totalValue,
          holdingCount: holdingDetails.length,
          holdings: holdingDetails,
          sectorAllocation,
          idealAllocation: Object.entries(idealAllocation).map(([sector, weight]) => ({ sector, weight })),
          suggestions,
          missingFromUniverse: missingFromUniverse.slice(0, 5),
          healthScore,
          concentrationRisk: concentrationRisk > 50 ? "HIGH" : concentrationRisk > 35 ? "MODERATE" : "LOW",
          lastUpdated: new Date().toISOString(),
        };
      }),

    // Portfolio Stress Testing — crash scenarios, max drawdown, recovery estimates
    stressTest: protectedProcedure
      .input(z.object({
        holdings: z.array(z.object({
          symbol: z.string(),
          shares: z.number(),
          avgCost: z.number().optional(),
        })),
        scenario: z.enum(["2008_financial_crisis", "2020_covid", "2000_dotcom", "custom", "monte_carlo"]),
        customDrawdown: z.number().optional(), // for custom scenario
      }))
      .mutation(async ({ input }) => {
        // Historical crash drawdowns by sector
        const crashDrawdowns: Record<string, Record<string, number>> = {
          "2008_financial_crisis": {
            Technology: -55, Consumer: -50, Communication: -45, Index: -57,
            Healthcare: -35, Financials: -80, Energy: -55, default: -50,
          },
          "2020_covid": {
            Technology: -30, Consumer: -35, Communication: -25, Index: -34,
            Healthcare: -20, Energy: -60, default: -34,
          },
          "2000_dotcom": {
            Technology: -78, Communication: -70, Consumer: -30, Index: -49,
            Healthcare: -20, Energy: -15, default: -40,
          },
          custom: {},
          monte_carlo: {},
        };

        // Recovery timelines (months)
        const recoveryTimelines: Record<string, number> = {
          "2008_financial_crisis": 48,
          "2020_covid": 5,
          "2000_dotcom": 84,
          custom: 24,
          monte_carlo: 36,
        };

        const scenarioDrawdowns = crashDrawdowns[input.scenario] || {};
        const customDraw = input.customDrawdown || -30;

        // Get current prices for all holdings in parallel
        const quoteResults = await Promise.allSettled(
          input.holdings.map(async (h) => {
            const quote = await fetchStockQuote(h.symbol);
            const stockInfo = INVESTMENT_UNIVERSE.find(s => s.symbol === h.symbol);
            const sector = stockInfo?.sector || "default";
            return { ...h, quote, sector };
          })
        );

        const holdingResults = quoteResults
          .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
          .map(r => r.value);

        let totalCurrentValue = 0;
        let totalStressedValue = 0;
        const holdingStress = holdingResults.map((h: any) => {
          const price = h.quote?.currentPrice || h.avgCost || 0;
          const currentValue = price * h.shares;
          totalCurrentValue += currentValue;

          let drawdownPct: number;
          if (input.scenario === "custom") {
            drawdownPct = customDraw;
          } else if (input.scenario === "monte_carlo") {
            // Random drawdown between -15% and -65% based on sector volatility
            const sectorVol: Record<string, number> = {
              Technology: 0.65, Consumer: 0.50, Communication: 0.55,
              Index: 0.45, Healthcare: 0.35, default: 0.45,
            };
            const vol = sectorVol[h.sector] || sectorVol.default;
            drawdownPct = -(Math.random() * vol * 100);
          } else {
            drawdownPct = scenarioDrawdowns[h.sector] || scenarioDrawdowns.default || -40;
          }

          const stressedPrice = price * (1 + drawdownPct / 100);
          const stressedValue = stressedPrice * h.shares;
          totalStressedValue += stressedValue;
          const loss = stressedValue - currentValue;

          return {
            symbol: h.symbol,
            sector: h.sector,
            shares: h.shares,
            currentPrice: Math.round(price * 100) / 100,
            currentValue: Math.round(currentValue * 100) / 100,
            drawdownPct: Math.round(drawdownPct * 10) / 10,
            stressedPrice: Math.round(stressedPrice * 100) / 100,
            stressedValue: Math.round(stressedValue * 100) / 100,
            loss: Math.round(loss * 100) / 100,
          };
        });

        const totalLoss = totalStressedValue - totalCurrentValue;
        const totalDrawdownPct = totalCurrentValue > 0 ? (totalLoss / totalCurrentValue) * 100 : 0;
        const recoveryMonths = recoveryTimelines[input.scenario] || 24;

        // DCA opportunity — how much you could buy at stressed prices
        const dcaOpportunity = holdingStress.map((h: any) => ({
          symbol: h.symbol,
          stressedPrice: h.stressedPrice,
          sharesFor5K: h.stressedPrice > 0 ? Math.floor(5000 / h.stressedPrice) : 0,
          sharesFor10K: h.stressedPrice > 0 ? Math.floor(10000 / h.stressedPrice) : 0,
        }));

        return {
          scenario: input.scenario,
          scenarioName: {
            "2008_financial_crisis": "2008 Financial Crisis",
            "2020_covid": "2020 COVID Crash",
            "2000_dotcom": "2000 Dot-Com Bubble",
            custom: `Custom ${customDraw}% Drawdown`,
            monte_carlo: "Monte Carlo Simulation",
          }[input.scenario],
          totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
          totalStressedValue: Math.round(totalStressedValue * 100) / 100,
          totalLoss: Math.round(totalLoss * 100) / 100,
          totalDrawdownPct: Math.round(totalDrawdownPct * 10) / 10,
          recoveryEstimateMonths: recoveryMonths,
          holdings: holdingStress,
          dcaOpportunity,
          insight: totalDrawdownPct > -30
            ? "Your portfolio is relatively resilient. The diversification is working."
            : totalDrawdownPct > -50
            ? "Significant drawdown expected. This is where DCA at deep discounts creates generational wealth. Don't panic — deploy capital."
            : "Severe drawdown scenario. This is exactly when the TF strategy shines — buying at maximum fear. History shows these are the best entry points.",
          lastUpdated: new Date().toISOString(),
        };
      }),
    // Strategy Grading Engine — 9-point scoring system (Bounce / SSL / Breakout)
    setupGrading: protectedProcedure
      .input(z.object({
        strategy: z.enum(["Bounce", "SSL", "Breakout"]),
        timeframe: z.enum(["Daily", "Weekly", "Monthly"]),
        includeAll: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        const cacheKey = `setupGrading-${input.strategy}-${input.timeframe}-${input.includeAll || false}`;
        const cached = getCached<any[]>(cacheKey);
        if (cached) return cached;
        const results = await getGradedSetups(input.strategy, input.timeframe as SetupTimeframe, input.includeAll || false);
        setCache(cacheKey, results, CACHE_TTL_AI);
        return results;
      }),

    // Grade a single stock under one strategy
    gradeSingle: protectedProcedure
      .input(z.object({
        strategy: z.enum(["Bounce", "SSL", "Breakout"]),
        symbol: z.string().min(1).max(10),
        timeframe: z.enum(["Daily", "Weekly", "Monthly"]),
      }))
      .query(async ({ input }) => {
        return await gradeSetup(input.strategy, input.symbol.toUpperCase(), input.timeframe as SetupTimeframe);
      }),
    // Sector Rotation Detection
    sectorRotation: protectedProcedure.query(async () => {
      const cached = getCached<any[]>("sectorRotation");
      if (cached) return cached;
      const data = await getSectorRotation();
      setCache("sectorRotation", data, CACHE_TTL_SLOW);
      return data;
    }),
    // Alert schedule removed — no notifications

    // Institutional flow detection for a single symbol
    institutionalFlow: protectedProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        const symbol = input.symbol.toUpperCase();
        const [dailyData, weeklyData, monthlyData] = await Promise.all([
          fetchDailyData(symbol),
          fetchWeeklyData(symbol),
          fetchMonthlyData(symbol),
        ]);
        return detectInstitutionalFlow(symbol, dailyData, weeklyData, monthlyData);
      }),

    // Scan all universe for unusual institutional flow
    flowScan: protectedProcedure.query(async () => {
      const cacheKey = "flowScan";
      const cached = getCached<any>(cacheKey);
      if (cached) return cached;

      const symbols = INVESTMENT_UNIVERSE.map(s => s.symbol);
      const dataPromises = symbols.map(async (symbol) => {
        const [dailyData, weeklyData, monthlyData] = await Promise.all([
          fetchDailyData(symbol),
          fetchWeeklyData(symbol),
          fetchMonthlyData(symbol),
        ]);
        return { symbol, dailyData, weeklyData, monthlyData };
      });
      const allData = await Promise.all(dataPromises);
      const results = await scanInstitutionalFlow(allData);
      // Sort by severity
      const severityOrder: Record<string, number> = { EXTREME: 0, HIGH: 1, MODERATE: 2, LOW: 3 };
      results.sort((a, b) => severityOrder[a.institutionalActivity] - severityOrder[b.institutionalActivity]);
      setCache(cacheKey, results);
      return results;
    }),
  }),
  // Plaid brokerage integration
  plaid: router({
    // Check if Plaid is configured
    status: publicProcedure.query(() => {
      return { configured: isPlaidConfigured() };
    }),

    // Create link token for Plaid Link widget
    createLinkToken: protectedProcedure.mutation(async ({ ctx }) => {
      const result = await createLinkToken(ctx.user.openId);
      if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Plaid not configured. Add PLAID_CLIENT_ID and PLAID_SECRET." });
      return result;
    }),

    // Exchange public token after user completes Plaid Link
    exchangeToken: protectedProcedure
      .input(z.object({ publicToken: z.string() }))
      .mutation(async ({ input }) => {
        const result = await exchangePublicToken(input.publicToken);
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to exchange token" });
        return result;
      }),

    // Get holdings from connected brokerage
    getHoldings: protectedProcedure
      .input(z.object({ accessToken: z.string() }))
      .query(async ({ input }) => {
        const result = await getInvestmentHoldings(input.accessToken);
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch holdings" });
        return result;
      }),
  }),

  // Elite Deep Dive Research
  deepDive: router({
    // Fast data-only endpoint — returns everything except AI research (~3-5s)
    getFast: protectedProcedure
      .input(z.object({ symbol: z.string().min(1).max(10) }))
      .query(async ({ input }) => {
        try {
          return await getStockDeepDiveFast(input.symbol);
        } catch (err: any) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: err.message || `Could not find data for ${input.symbol}`,
          });
        }
      }),

    // Full research with AI summary (~10-15s, lazy-loaded)
    getResearch: protectedProcedure
      .input(z.object({ symbol: z.string().min(1).max(10) }))
      .query(async ({ input }) => {
        try {
          return await getStockDeepDive(input.symbol);
        } catch (err: any) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: err.message || `Could not find data for ${input.symbol}`,
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
