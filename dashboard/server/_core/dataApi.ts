/**
 * Market data access layer with interchangeable sources:
 *
 *  0. "alpaca" — Alpaca Market Data v2 (real-time IEX feed on the free plan).
 *                Used FIRST whenever ALPACA_API_KEY_ID + ALPACA_API_SECRET_KEY
 *                are set. Stocks/ETFs only — indices (VIX) fall through.
 *  1. "manus"  — the original Manus Forge proxy (requires BUILT_IN_FORGE_API_URL
 *                + BUILT_IN_FORGE_API_KEY, only available when hosted on Manus)
 *  2. "direct" — Yahoo Finance's public API, called directly. Free, no key.
 *                When Yahoo is unreachable (it blocks many datacenter IPs),
 *                chart data falls back to Stooq's free CSV feed (end-of-day /
 *                delayed, but REAL market data) before resorting to demo.
 *  3. "demo"   — deterministic synthetic market data so the terminal is fully
 *                testable offline (no network, no keys).
 *
 * Selection via DATA_MODE env var: "auto" (default) | "manus" | "direct" | "demo".
 * In auto mode: Alpaca keys present → Alpaca first; Manus creds present → manus;
 * otherwise direct (Yahoo → Stooq), falling back to demo automatically if no
 * live source is reachable.
 *
 * All sources return the same response shapes the rest of the server expects
 * (Yahoo's raw JSON: chart.result[0], finance.result, quoteSummary.result[0]).
 */
import { ENV } from "./env";

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

type DataMode = "auto" | "manus" | "direct" | "demo";

const FETCH_TIMEOUT_MS = 15_000;
const DIRECT_RETRY_INTERVAL_MS = 5 * 60 * 1000;

// When a live source fails at the network level we stop hammering it and move
// down the chain, re-probing every DIRECT_RETRY_INTERVAL_MS.
let alpacaDownSince = 0;
let directDownSince = 0;
let stooqDownSince = 0;

// What the last successful call was actually served from — powers the UI badge.
let lastServed: "alpaca" | "manus" | "yahoo" | "stooq" | "demo" = "yahoo";

export interface DataHealth {
  source: "alpaca" | "manus" | "yahoo" | "stooq" | "demo";
  label: string;
  isLive: boolean;
}

export function dataHealth(): DataHealth {
  switch (lastServed) {
    case "alpaca":
      return { source: "alpaca", label: "LIVE DATA (ALPACA)", isLive: true };
    case "manus":
      return { source: "manus", label: "LIVE DATA", isLive: true };
    case "yahoo":
      return { source: "yahoo", label: "LIVE DATA", isLive: true };
    case "stooq":
      return { source: "stooq", label: "LIVE DATA (EOD/DELAYED)", isLive: true };
    default:
      return { source: "demo", label: "DEMO DATA", isLive: false };
  }
}

function alpacaCreds(): { keyId: string; secret: string } | null {
  const keyId = process.env.ALPACA_API_KEY_ID || process.env.APCA_API_KEY_ID || "";
  const secret = process.env.ALPACA_API_SECRET_KEY || process.env.APCA_API_SECRET_KEY || "";
  return keyId && secret ? { keyId, secret } : null;
}

// Thrown when Alpaca simply doesn't carry a symbol (e.g. VIX) — the call
// should fall through to the next source WITHOUT marking Alpaca down.
class AlpacaUnsupportedError extends Error {}

function resolveMode(): DataMode {
  const raw = (process.env.DATA_MODE ?? "auto").toLowerCase();
  if (raw === "manus" || raw === "direct" || raw === "demo") return raw;
  return "auto";
}

export function activeDataSource(): "manus" | "direct" | "demo" {
  const mode = resolveMode();
  if (mode !== "auto") return mode;
  if (ENV.forgeApiUrl && ENV.forgeApiKey) return "manus";
  if (
    directDownSince && Date.now() - directDownSince < DIRECT_RETRY_INTERVAL_MS &&
    stooqDownSince && Date.now() - stooqDownSince < DIRECT_RETRY_INTERVAL_MS
  ) {
    return "demo";
  }
  return "direct";
}

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  const mode = resolveMode();

  if (mode === "manus" || (mode === "auto" && ENV.forgeApiUrl && ENV.forgeApiKey)) {
    const result = await callManusProxy(apiId, options);
    lastServed = "manus";
    return result;
  }
  if (mode === "demo") {
    lastServed = "demo";
    return callDemo(apiId, options);
  }

  // direct / auto — 0) Alpaca (real-time IEX) whenever keys are configured
  if (apiId === "YahooFinance/get_stock_chart" && alpacaCreds()) {
    const alpacaHealthy = !alpacaDownSince || Date.now() - alpacaDownSince >= DIRECT_RETRY_INTERVAL_MS;
    if (alpacaHealthy) {
      try {
        const result = await callAlpacaChart(options);
        if (alpacaDownSince || lastServed !== "alpaca") console.log("[DataApi] Serving real-time market data via Alpaca (IEX).");
        alpacaDownSince = 0;
        lastServed = "alpaca";
        return result;
      } catch (err) {
        if (!(err instanceof AlpacaUnsupportedError)) {
          if (!alpacaDownSince) {
            console.warn(
              `[DataApi] Alpaca unreachable or rejecting requests (${String(err).slice(0, 200)}). ` +
                "Falling back to Yahoo/Stooq; will re-probe Alpaca in 5 minutes."
            );
          }
          alpacaDownSince = Date.now();
        }
        // fall through to Yahoo → Stooq → demo
      }
    }
  }

  // direct / auto — 1) Yahoo
  const yahooHealthy = !directDownSince || Date.now() - directDownSince >= DIRECT_RETRY_INTERVAL_MS;
  if (yahooHealthy) {
    try {
      const result = await callYahooDirect(apiId, options);
      if (directDownSince) console.log("[DataApi] Yahoo Finance is reachable again — back to live Yahoo data.");
      directDownSince = 0;
      lastServed = "yahoo";
      return result;
    } catch (err) {
      if (mode === "direct") throw err; // explicit direct mode: surface the error
      if (!directDownSince) {
        console.warn(
          `[DataApi] Direct Yahoo Finance unreachable (${String(err).slice(0, 200)}). ` +
            "Trying Stooq for live chart data; will re-probe Yahoo in 5 minutes."
        );
      }
      directDownSince = Date.now();
    }
  }

  // 2) Stooq — real (EOD/delayed) market data, chart endpoint only
  if (apiId === "YahooFinance/get_stock_chart") {
    const stooqHealthy = !stooqDownSince || Date.now() - stooqDownSince >= DIRECT_RETRY_INTERVAL_MS;
    if (stooqHealthy) {
      try {
        const result = await callStooqChart(options);
        if (stooqDownSince || lastServed === "demo") console.log("[DataApi] Serving live chart data via Stooq (EOD/delayed).");
        stooqDownSince = 0;
        lastServed = "stooq";
        return result;
      } catch (err) {
        if (!stooqDownSince) {
          console.warn(
            `[DataApi] Stooq unreachable too (${String(err).slice(0, 200)}). ` +
              "Serving deterministic demo data; will re-probe in 5 minutes."
          );
        }
        stooqDownSince = Date.now();
      }
    }
  }

  // 3) Demo — only chart calls drive the badge; auxiliary endpoints (insights,
  // holders) have no Stooq equivalent and quietly use demo without flipping it.
  // A single unsupported symbol (e.g. VIX on Alpaca) also shouldn't flip the
  // badge while a live source is healthily serving everything else.
  const alpacaServing = lastServed === "alpaca" && !alpacaDownSince;
  if (apiId === "YahooFinance/get_stock_chart" && !alpacaServing) lastServed = "demo";
  return callDemo(apiId, options);
}

// ---------------------------------------------------------------------------
// Source 1: Manus Forge proxy (original behavior)
// ---------------------------------------------------------------------------

async function callManusProxy(
  apiId: string,
  options: DataApiCallOptions
): Promise<unknown> {
  if (!ENV.forgeApiUrl) throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  if (!ENV.forgeApiKey) throw new Error("BUILT_IN_FORGE_API_KEY is not configured");

  const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
  const fullUrl = new URL("webdevtoken.v1.WebDevService/CallApi", baseUrl).toString();

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "connect-protocol-version": "1",
      authorization: `Bearer ${ENV.forgeApiKey}`,
    },
    body: JSON.stringify({
      apiId,
      query: options.query,
      body: options.body,
      path_params: options.pathParams,
      multipart_form_data: options.formData,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Data API request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  const payload = await response.json().catch(() => ({}));
  if (payload && typeof payload === "object" && "jsonData" in payload) {
    try {
      return JSON.parse((payload as Record<string, string>).jsonData ?? "{}");
    } catch {
      return (payload as Record<string, unknown>).jsonData;
    }
  }
  return payload;
}

// ---------------------------------------------------------------------------
// Source 2: Direct Yahoo Finance public API
// ---------------------------------------------------------------------------

const YAHOO_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function yahooFetch(url: string, extraHeaders: Record<string, string> = {}) {
  const response = await fetch(url, {
    headers: { "user-agent": YAHOO_UA, accept: "application/json", ...extraHeaders },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

// quoteSummary endpoints require a crumb tied to a session cookie.
let crumbCache: { cookie: string; crumb: string; timestamp: number } | null = null;
const CRUMB_TTL_MS = 30 * 60 * 1000;

async function getYahooCrumb(): Promise<{ cookie: string; crumb: string }> {
  if (crumbCache && Date.now() - crumbCache.timestamp < CRUMB_TTL_MS) return crumbCache;

  const cookieResp = await fetch("https://fc.yahoo.com/", {
    headers: { "user-agent": YAHOO_UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  }).catch(() => null);
  const setCookie = cookieResp?.headers.get("set-cookie") ?? "";
  const cookie = setCookie.split(";")[0] ?? "";
  if (!cookie) throw new Error("Could not obtain Yahoo session cookie");

  const crumbResp = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "user-agent": YAHOO_UA, cookie },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const crumb = (await crumbResp.text()).trim();
  if (!crumbResp.ok || !crumb || crumb.includes("<")) {
    throw new Error("Could not obtain Yahoo crumb");
  }

  crumbCache = { cookie, crumb, timestamp: Date.now() };
  return crumbCache;
}

async function callYahooDirect(
  apiId: string,
  options: DataApiCallOptions
): Promise<unknown> {
  const q = options.query ?? {};
  const symbol = String(q.symbol ?? "").toUpperCase();
  if (!symbol) throw new Error(`Missing symbol for ${apiId}`);

  switch (apiId) {
    case "YahooFinance/get_stock_chart": {
      const params = new URLSearchParams({
        interval: String(q.interval ?? "1d"),
        range: String(q.range ?? "1mo"),
        includeAdjustedClose: String(q.includeAdjustedClose ?? "true"),
        region: String(q.region ?? "US"),
      });
      if (q.events) params.set("events", String(q.events));
      return yahooFetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?${params}`
      );
    }

    case "YahooFinance/get_stock_insights": {
      return yahooFetch(
        `https://query1.finance.yahoo.com/ws/insights/v2/finance/insights?symbol=${encodeURIComponent(symbol)}`
      );
    }

    case "YahooFinance/get_stock_holders": {
      const { cookie, crumb } = await getYahooCrumb();
      const params = new URLSearchParams({
        modules: "insiderHolders",
        crumb,
      });
      return yahooFetch(
        `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?${params}`,
        { cookie }
      );
    }

    default:
      throw new Error(`Unsupported data API for direct mode: ${apiId}`);
  }
}

// ---------------------------------------------------------------------------
// Source 0: Alpaca Market Data v2 (real-time IEX feed on the free plan)
// ---------------------------------------------------------------------------
// Stocks and ETFs only — no indices (VIX falls through to Yahoo/Stooq).
// Responses are reshaped into Yahoo's chart JSON so nothing downstream changes.

function alpacaTimeframe(interval: string): "1Day" | "1Week" | "1Month" {
  if (interval === "1d") return "1Day";
  if (interval === "1wk") return "1Week";
  if (interval === "1mo") return "1Month";
  throw new AlpacaUnsupportedError(`Alpaca source does not support interval ${interval}`);
}

async function callAlpacaChart(options: DataApiCallOptions): Promise<unknown> {
  const creds = alpacaCreds();
  if (!creds) throw new Error("Alpaca credentials not configured");

  const q = options.query ?? {};
  const symbol = String(q.symbol ?? "").toUpperCase();
  if (!symbol) throw new Error("Missing symbol for Alpaca chart");
  if (symbol.startsWith("^") || symbol === "VIX") {
    throw new AlpacaUnsupportedError(`Alpaca does not carry index symbol ${symbol}`);
  }
  const interval = String(q.interval ?? "1d");
  const range = String(q.range ?? "1mo");
  const timeframe = alpacaTimeframe(interval);

  // Always pull at least 1 year of dailies so quote meta (52-week high/low,
  // average volume) is real even for short chart ranges.
  const years = Math.max(rangeToYears(range), interval === "1d" ? 1 : 0);
  const start = new Date(Date.now() - years * 366 * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    timeframe,
    start,
    limit: "10000",
    adjustment: "split",
    feed: "iex", // the free plan's real-time feed
    sort: "asc",
  });
  const resp = await fetch(
    `https://data.alpaca.markets/v2/stocks/${encodeURIComponent(symbol)}/bars?${params}`,
    {
      headers: {
        "APCA-API-KEY-ID": creds.keyId,
        "APCA-API-SECRET-KEY": creds.secret,
        accept: "application/json",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    }
  );

  if (resp.status === 404 || resp.status === 422) {
    throw new AlpacaUnsupportedError(`Alpaca does not carry ${symbol} (${resp.status})`);
  }
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`Alpaca request failed (${resp.status})${detail ? `: ${detail.slice(0, 120)}` : ""}`);
  }

  const payload = (await resp.json()) as { bars?: { t: string; o: number; h: number; l: number; c: number; v: number }[] };
  const bars = payload.bars ?? [];
  if (bars.length === 0) throw new AlpacaUnsupportedError(`Alpaca returned no bars for ${symbol}`);

  const timestamps: number[] = [];
  const opens: number[] = [];
  const highs: number[] = [];
  const lows: number[] = [];
  const closes: number[] = [];
  const volumes: number[] = [];
  for (const b of bars) {
    const ts = Math.floor(Date.parse(b.t) / 1000);
    if (!isFinite(ts) || !isFinite(b.c)) continue;
    timestamps.push(ts);
    opens.push(b.o);
    highs.push(b.h);
    lows.push(b.l);
    closes.push(b.c);
    volumes.push(isFinite(b.v) ? b.v : 0);
  }
  if (closes.length === 0) throw new Error(`Alpaca returned an empty series for ${symbol}`);

  // Meta from the FULL fetched series (real 52w range / volumes)...
  const lastIdx = closes.length - 1;
  const prevClose = lastIdx > 0 ? closes[lastIdx - 1] : closes[lastIdx];
  const volWindow = volumes.slice(-11, -1);
  const avgVol = volWindow.length > 0 ? Math.round(volWindow.reduce((a, b) => a + b, 0) / volWindow.length) : volumes[lastIdx];
  const yearHighs = interval === "1d" ? highs.slice(-252) : highs;
  const yearLows = interval === "1d" ? lows.slice(-252) : lows;

  const meta = {
    currency: "USD",
    symbol,
    exchangeName: "ALPACA-IEX",
    instrumentType: "EQUITY",
    regularMarketPrice: closes[lastIdx],
    chartPreviousClose: prevClose,
    previousClose: prevClose,
    regularMarketDayHigh: highs[lastIdx],
    regularMarketDayLow: lows[lastIdx],
    regularMarketVolume: volumes[lastIdx],
    averageDailyVolume10Day: avgVol,
    fiftyTwoWeekHigh: Math.max(...yearHighs),
    fiftyTwoWeekLow: Math.min(...yearLows),
    regularMarketTime: timestamps[lastIdx],
    dataGranularity: interval,
    range,
  };

  // ...but return only the bars the caller asked for
  const keep = Math.min(barsForRange(range, interval), closes.length);
  const s = closes.length - keep;

  return {
    chart: {
      result: [
        {
          meta,
          timestamp: timestamps.slice(s),
          indicators: {
            quote: [
              {
                open: opens.slice(s),
                high: highs.slice(s),
                low: lows.slice(s),
                close: closes.slice(s),
                volume: volumes.slice(s),
              },
            ],
            adjclose: [{ adjclose: closes.slice(s) }],
          },
        },
      ],
      error: null,
    },
  };
}

// ---------------------------------------------------------------------------
// Source 2b: Stooq free CSV feed (EOD/delayed but REAL market data)
// ---------------------------------------------------------------------------
// Yahoo blocks many datacenter IPs (e.g. Vercel), Stooq generally doesn't.
// Serves only the chart endpoint; responses are shaped like Yahoo's chart JSON
// so nothing downstream changes.

function stooqSymbol(symbol: string): string {
  const s = symbol.toUpperCase();
  if (s === "VIX" || s === "^VIX") return "^vix";
  if (s.startsWith("^")) return s.toLowerCase();
  return `${s.toLowerCase()}.us`;
}

function stooqInterval(interval: string): "d" | "w" | "m" {
  if (interval === "1d") return "d";
  if (interval === "1wk") return "w";
  if (interval === "1mo") return "m";
  throw new Error(`Stooq does not support interval ${interval}`);
}

function barsForRange(range: string, interval: string): number {
  const years = rangeToYears(range);
  if (interval === "1d") return Math.max(6, Math.round(years * 252));
  if (interval === "1wk") return Math.max(6, Math.round(years * 52));
  return Math.max(6, Math.round(years * 12));
}

function ymd(d: Date): string {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function callStooqChart(options: DataApiCallOptions): Promise<unknown> {
  const q = options.query ?? {};
  const symbol = String(q.symbol ?? "").toUpperCase();
  if (!symbol) throw new Error("Missing symbol for Stooq chart");
  const interval = String(q.interval ?? "1d");
  const range = String(q.range ?? "1mo");
  const i = stooqInterval(interval);

  // Always pull at least 1 year of dailies so quote meta (52-week high/low,
  // average volume) is real even for short chart ranges.
  const years = Math.max(rangeToYears(range), interval === "1d" ? 1 : 0);
  const start = new Date(Date.now() - years * 366 * 24 * 60 * 60 * 1000);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol(symbol))}&d1=${ymd(start)}&d2=${ymd(new Date())}&i=${i}`;

  const resp = await fetch(url, {
    headers: { "user-agent": YAHOO_UA, accept: "text/csv,*/*" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!resp.ok) throw new Error(`Stooq request failed (${resp.status}) for ${symbol}`);
  const csv = (await resp.text()).trim();
  if (!csv.toLowerCase().startsWith("date,")) {
    throw new Error(`Stooq returned no data for ${symbol} (${csv.slice(0, 60)})`);
  }

  const timestamps: number[] = [];
  const opens: number[] = [];
  const highs: number[] = [];
  const lows: number[] = [];
  const closes: number[] = [];
  const volumes: number[] = [];

  for (const line of csv.split("\n").slice(1)) {
    const [date, o, h, l, c, v] = line.trim().split(",");
    const open = parseFloat(o);
    const high = parseFloat(h);
    const low = parseFloat(l);
    const close = parseFloat(c);
    if (!date || !isFinite(open) || !isFinite(high) || !isFinite(low) || !isFinite(close)) continue;
    const ts = Math.floor(Date.parse(`${date}T16:00:00-05:00`) / 1000);
    if (!isFinite(ts)) continue;
    timestamps.push(ts);
    opens.push(open);
    highs.push(high);
    lows.push(low);
    closes.push(close);
    volumes.push(isFinite(parseFloat(v)) ? parseFloat(v) : 0);
  }

  if (closes.length === 0) throw new Error(`Stooq returned an empty series for ${symbol}`);

  // Meta from the FULL fetched series (real 52w range / volumes)...
  const lastIdx = closes.length - 1;
  const prevClose = lastIdx > 0 ? closes[lastIdx - 1] : closes[lastIdx];
  const volWindow = volumes.slice(-11, -1);
  const avgVol = volWindow.length > 0 ? Math.round(volWindow.reduce((a, b) => a + b, 0) / volWindow.length) : volumes[lastIdx];
  const yearHighs = interval === "1d" ? highs.slice(-252) : highs;
  const yearLows = interval === "1d" ? lows.slice(-252) : lows;

  const meta = {
    currency: "USD",
    symbol,
    exchangeName: "STOOQ",
    instrumentType: "EQUITY",
    regularMarketPrice: closes[lastIdx],
    chartPreviousClose: prevClose,
    previousClose: prevClose,
    regularMarketDayHigh: highs[lastIdx],
    regularMarketDayLow: lows[lastIdx],
    regularMarketVolume: volumes[lastIdx],
    averageDailyVolume10Day: avgVol,
    fiftyTwoWeekHigh: Math.max(...yearHighs),
    fiftyTwoWeekLow: Math.min(...yearLows),
    regularMarketTime: timestamps[lastIdx],
    dataGranularity: interval,
    range,
  };

  // ...but return only the bars the caller asked for
  const keep = Math.min(barsForRange(range, interval), closes.length);
  const s = closes.length - keep;

  return {
    chart: {
      result: [
        {
          meta,
          timestamp: timestamps.slice(s),
          indicators: {
            quote: [
              {
                open: opens.slice(s),
                high: highs.slice(s),
                low: lows.slice(s),
                close: closes.slice(s),
                volume: volumes.slice(s),
              },
            ],
            adjclose: [{ adjclose: closes.slice(s) }],
          },
        },
      ],
      error: null,
    },
  };
}

// ---------------------------------------------------------------------------
// Source 3: Deterministic demo data
// ---------------------------------------------------------------------------
// Seeded per symbol so numbers are stable across restarts (and change slowly
// day to day), letting every feature of the terminal be exercised offline.

const BASE_PRICES: Record<string, number> = {
  AAPL: 232, MSFT: 512, GOOGL: 198, AMZN: 226, META: 718, NVDA: 172, TSLA: 318,
  SPY: 632, QQQ: 556, VOO: 580, VTI: 310, DIA: 445, IWM: 226,
  XLK: 244, XLC: 104, XLY: 218, XLF: 52, XLV: 148, XLE: 92, XLI: 142,
  XLP: 82, XLU: 78, XLB: 94, XLRE: 42,
  NFLX: 1180, CAG: 26, PG: 168, SPOT: 620, AMD: 162, AVGO: 265, CRM: 268,
  VIX: 16, "^VIX": 16, GLD: 310, TLT: 88,
};

const GROWTH_SYMBOLS = new Set([
  "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "NFLX", "SPOT", "AMD", "AVGO", "CRM",
]);

const DIVIDEND_YIELDS: Record<string, number> = {
  AAPL: 0.005, MSFT: 0.007, SPY: 0.012, VOO: 0.013, VTI: 0.013, DIA: 0.017,
  PG: 0.024, CAG: 0.052, XLU: 0.028, XLP: 0.025, XLF: 0.015, XLV: 0.015, XLE: 0.031,
};

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rand: () => number): number {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function basePriceFor(symbol: string): number {
  if (BASE_PRICES[symbol]) return BASE_PRICES[symbol];
  const h = hashString(symbol);
  return 20 + (h % 480); // $20 – $500
}

function rangeToYears(range: string): number {
  switch (range) {
    case "1d": case "5d": return 0.1;
    case "1mo": return 1 / 12;
    case "3mo": return 0.25;
    case "6mo": return 0.5;
    case "1y": case "ytd": return 1;
    case "2y": return 2;
    case "5y": return 5;
    case "10y": return 10;
    case "max": return 20;
    default: return 1;
  }
}

type DemoSeries = {
  timestamps: number[];
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
};

function generateSeries(symbol: string, interval: string, range: string): DemoSeries {
  const isGrowth = GROWTH_SYMBOLS.has(symbol);
  const annualDrift = isGrowth ? 0.16 : 0.1;
  const annualVol = isGrowth ? 0.22 : 0.13;

  const stepsPerYear = interval === "1mo" ? 12 : interval === "1wk" ? 52 : 252;
  const stepDays = interval === "1mo" ? 30.44 : interval === "1wk" ? 7 : 1;
  const years = rangeToYears(range);
  const steps = Math.max(Math.round(stepsPerYear * years), interval === "1d" ? 5 : 3);

  const rand = mulberry32(hashString(`${symbol}:${interval}:candles`));

  // Log-return random walk with periodic seeded "shock" drawdowns so SSL
  // sweeps, volume climaxes, and DCA zones have something real to detect.
  const logReturns: number[] = [];
  const volumeBoost: number[] = [];
  const drift = annualDrift / stepsPerYear;
  const vol = annualVol / Math.sqrt(stepsPerYear);
  let shockRemaining = 0;
  for (let i = 0; i < steps; i++) {
    let boost = 1;
    if (shockRemaining > 0) {
      logReturns.push(drift - Math.abs(gaussianPair(rand)) * vol * 1.6);
      shockRemaining--;
      if (shockRemaining === 0) boost = 2.5 + rand() * 2; // climax at the bottom
    } else {
      if (rand() < 0.8 / stepsPerYear) shockRemaining = Math.max(1, Math.round(stepsPerYear / 12));
      logReturns.push(drift + gaussianPair(rand) * vol);
    }
    volumeBoost.push(boost);
  }

  // Build closes, then rescale so the final close lands on the symbol's base
  // price (with a slow day-to-day jitter so the terminal feels alive).
  const rawCloses: number[] = [];
  let acc = 0;
  for (const r of logReturns) {
    acc += r;
    rawCloses.push(Math.exp(acc));
  }

  // Keep the all-time high within a believable distance of the final price so
  // drawdown-from-ATH stats look like a real market, not a broken feed.
  const finalRaw = rawCloses[rawCloses.length - 1];
  const maxRatio = Math.max(...rawCloses) / finalRaw;
  const capRatio = isGrowth ? 1.55 : 1.3;
  if (maxRatio > capRatio) {
    const k = Math.log(capRatio) / Math.log(maxRatio);
    for (let i = 0; i < rawCloses.length; i++) {
      rawCloses[i] = finalRaw * Math.pow(rawCloses[i] / finalRaw, k);
    }
  }
  const daySeed = Math.floor(Date.now() / 86_400_000);
  const dayRand = mulberry32(hashString(`${symbol}:day:${daySeed}`));
  const endPrice = basePriceFor(symbol) * (1 + (dayRand() - 0.5) * 0.02);
  const scale = endPrice / rawCloses[rawCloses.length - 1];

  const now = new Date();
  const baseVolume = 5e6 + (hashString(`${symbol}:vol`) % 45e6);

  const series: DemoSeries = { timestamps: [], opens: [], highs: [], lows: [], closes: [], volumes: [] };
  for (let i = 0; i < steps; i++) {
    const close = rawCloses[i] * scale;
    const open = i === 0 ? close / Math.exp(logReturns[0]) : rawCloses[i - 1] * scale;
    const wick = Math.abs(gaussianPair(rand)) * vol * close * 0.6;
    const high = Math.max(open, close) + wick;
    const low = Math.min(open, close) - wick;

    const d = new Date(now);
    if (interval === "1mo") {
      d.setMonth(d.getMonth() - (steps - 1 - i));
      d.setDate(1);
    } else {
      d.setDate(d.getDate() - Math.round((steps - 1 - i) * stepDays));
      // keep daily/weekly candles on weekdays so completed-day filters pass
      const dow = d.getDay();
      if (dow === 0) d.setDate(d.getDate() - 2);
      if (dow === 6) d.setDate(d.getDate() - 1);
    }
    d.setHours(16, 0, 0, 0);

    series.timestamps.push(Math.floor(d.getTime() / 1000));
    series.opens.push(round2(open));
    series.highs.push(round2(high));
    series.lows.push(round2(Math.max(low, 0.01)));
    series.closes.push(round2(close));
    series.volumes.push(Math.round(baseVolume * (0.6 + rand() * 0.8) * volumeBoost[i]));
  }
  return series;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function demoChart(symbol: string, q: Record<string, unknown>): unknown {
  const interval = String(q.interval ?? "1d");
  const range = String(q.range ?? "1mo");
  const s = generateSeries(symbol, interval, range);

  const lastClose = s.closes[s.closes.length - 1];
  const prevClose = s.closes.length > 1 ? s.closes[s.closes.length - 2] : lastClose;
  const yearIdx = Math.max(0, s.closes.length - (interval === "1mo" ? 12 : interval === "1wk" ? 52 : 252));
  const yearHighs = s.highs.slice(yearIdx);
  const yearLows = s.lows.slice(yearIdx);

  const events: Record<string, unknown> = {};
  const wantEvents = String(q.events ?? "");
  const divYield = DIVIDEND_YIELDS[symbol];
  if (wantEvents.includes("div") && divYield) {
    const dividends: Record<string, { amount: number; date: number }> = {};
    const quarterly = round2((lastClose * divYield) / 4);
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i * 3);
      d.setDate(10);
      const ts = Math.floor(d.getTime() / 1000);
      dividends[String(ts)] = { amount: quarterly, date: ts };
    }
    events.dividends = dividends;
  }

  return {
    chart: {
      result: [
        {
          meta: {
            currency: "USD",
            symbol,
            exchangeName: "DEMO",
            regularMarketPrice: lastClose,
            chartPreviousClose: prevClose,
            previousClose: prevClose,
            regularMarketDayHigh: round2(lastClose * 1.008),
            regularMarketDayLow: round2(lastClose * 0.992),
            regularMarketVolume: s.volumes[s.volumes.length - 1],
            averageDailyVolume10Day: Math.round(
              s.volumes.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, s.volumes.length)
            ),
            fiftyTwoWeekHigh: round2(Math.max(...yearHighs)),
            fiftyTwoWeekLow: round2(Math.min(...yearLows)),
            regularMarketTime: Math.floor(Date.now() / 1000),
            dataGranularity: interval,
            range,
          },
          timestamp: s.timestamps,
          events,
          indicators: {
            quote: [
              {
                open: s.opens,
                high: s.highs,
                low: s.lows,
                close: s.closes,
                volume: s.volumes,
              },
            ],
            adjclose: [{ adjclose: s.closes }],
          },
        },
      ],
      error: null,
    },
  };
}

function demoInsights(symbol: string): unknown {
  const rand = mulberry32(hashString(`${symbol}:insights`));
  const price = basePriceFor(symbol);
  const target = round2(price * (1.1 + rand() * 0.2));
  const ratings = ["BUY", "STRONG_BUY", "HOLD"];
  const today = new Date().toISOString();

  return {
    finance: {
      result: {
        symbol,
        recommendation: {
          targetPrice: target,
          rating: ratings[Math.floor(rand() * ratings.length)],
          provider: "TF Demo Research",
        },
        secReports: [
          { type: "10-K", title: `${symbol} Annual Report (demo)`, description: "Demo filing — sample data for offline testing.", filingDate: Date.now() - 90 * 86_400_000, id: `${symbol}-10K` },
          { type: "10-Q", title: `${symbol} Quarterly Report (demo)`, description: "Demo filing — sample data for offline testing.", filingDate: Date.now() - 30 * 86_400_000, id: `${symbol}-10Q` },
        ],
        sigDevs: [
          { headline: `${symbol} demo development: product expansion announced`, date: today.split("T")[0] },
          { headline: `${symbol} demo development: quarterly results ahead of estimates`, date: today.split("T")[0] },
        ],
      },
      error: null,
    },
  };
}

function demoHolders(symbol: string): unknown {
  const rand = mulberry32(hashString(`${symbol}:holders`));
  const names = [
    ["Jordan Blake", "Chief Executive Officer"],
    ["Casey Morgan", "Chief Financial Officer"],
    ["Riley Hunter", "Director"],
    ["Avery Quinn", "Chief Technology Officer"],
  ];
  const fmtDate = new Date(Date.now() - 21 * 86_400_000);

  return {
    quoteSummary: {
      result: [
        {
          insiderHolders: {
            holders: names.map(([name, relation]) => {
              const shares = Math.round(50_000 + rand() * 950_000);
              return {
                name: `${name} (demo)`,
                relation,
                transactionDescription: rand() > 0.4 ? "Purchase" : "Sale",
                latestTransDate: { fmt: fmtDate.toISOString().split("T")[0] },
                positionDirect: { raw: shares, fmt: shares.toLocaleString("en-US") },
              };
            }),
          },
        },
      ],
      error: null,
    },
  };
}

function callDemo(apiId: string, options: DataApiCallOptions): unknown {
  const q = options.query ?? {};
  const symbol = String(q.symbol ?? "DEMO").toUpperCase();

  switch (apiId) {
    case "YahooFinance/get_stock_chart":
      return demoChart(symbol, q as Record<string, unknown>);
    case "YahooFinance/get_stock_insights":
      return demoInsights(symbol);
    case "YahooFinance/get_stock_holders":
      return demoHolders(symbol);
    default:
      throw new Error(`Unsupported data API for demo mode: ${apiId}`);
  }
}
