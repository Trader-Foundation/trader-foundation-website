# TF Elite Terminal (monthly-leap-screener)

The Trader Foundation members dashboard: Setup Screener (three strategies —
Bounce, SSL sell-side liquidity, and Breakout), Wall Street Exchange grid,
Investment Radar, Portfolio Simulator, Freedom Calculator, Research Terminal,
and AI chatbot.

The Bounce strategy implements The TF Bounce Profit Plan: trend filter
(50/200 MA), pullback bounce off the 13/20 MA or key swing support, volume
confirmation, reversal candle, with Full Stochastics + MACD confluence and a
Market Pulse strip (SPY direction, VIX, jobs-report-day warning) for the
plan's fundamental layer. The Breakout strategy implements the TF Breakout
Strategy: new-52-week-high breakouts on relative volume over 1 (1M+ average
volume liquidity screen), Marubozu breakout candles, and flag/pennant
continuation-pattern confluence. Scoring lives in `server/strategyEngine.ts`.

Originally built on Manus. It now runs **standalone** — no Manus account or
keys required.

## Quick start

```bash
cd dashboard
pnpm install
pnpm dev        # → http://localhost:3000
```

That's it. With no configuration the terminal boots in open local mode with
free market data (see below).

## Market data sources (`DATA_MODE`)

All market data flows through `server/_core/dataApi.ts`, which picks a source:

| Mode     | What it does                                                            |
| -------- | ----------------------------------------------------------------------- |
| `auto`   | **Default.** Alpaca (if keys set, real-time IEX) → Manus proxy if configured → direct Yahoo Finance → Stooq (free EOD/delayed CSV, datacenter-friendly) → demo data. Each failed live source re-probes every 5 minutes. |
| `direct` | Yahoo Finance public API only (free, no key). Errors surface if unreachable. |
| `demo`   | Deterministic synthetic data. Fully offline; every tab works. Prices are seeded per symbol and stable within a day. |
| `manus`  | Original Manus Forge proxy (requires `BUILT_IN_FORGE_API_URL` + `BUILT_IN_FORGE_API_KEY`). |

Set it via environment variable, e.g. `DATA_MODE=demo pnpm dev`.

**Alpaca (recommended for hosted deployments):** create a free account at
alpaca.markets, generate API keys, and set `ALPACA_API_KEY_ID` +
`ALPACA_API_SECRET_KEY`. The terminal then uses Alpaca's real-time IEX feed as
its primary source (stocks/ETFs; VIX falls through to Yahoo/Stooq). The header
badge shows which source is actually serving: green LIVE, yellow LIVE·EOD
(Stooq), red DEMO.

## AI features (chatbot, research summaries, valuations)

Provider resolution in `server/_core/llm.ts`:

1. `ANTHROPIC_API_KEY` set → Anthropic API directly (works anywhere).
2. Manus Forge key set → original Manus-hosted LLM.
3. Neither → graceful fallback: the chatbot explains AI is disabled, and
   JSON-producing endpoints return "unavailable" placeholders. All market
   data features keep working.

Note: LLM-generated valuations (PE ratios etc.) show as N/A without an AI
provider, since they are computed by the LLM rather than fetched from an API.

## Auth

- With `OAUTH_SERVER_URL` configured, the original Manus OAuth flow applies.
- Without it, the server runs in **open local mode**: every visitor is signed
  in as a local admin user. Fine for local testing and private hosting —
  do not expose a deployment publicly in this mode if the terminal should
  remain members-only.

## Database

Optional. Without `DATABASE_URL` (MySQL) the app runs fine; user-persistence
features are no-ops.

## Environment variables summary

| Variable                | Required | Purpose                                    |
| ----------------------- | -------- | ------------------------------------------ |
| `DATA_MODE`             | no       | `auto` (default) / `direct` / `demo` / `manus` |
| `ALPACA_API_KEY_ID`     | no       | With the secret, enables Alpaca real-time IEX data as the primary source |
| `ALPACA_API_SECRET_KEY` | no       | See above                                  |
| `ANTHROPIC_API_KEY`     | no       | Enables AI chatbot + research + valuations |
| `DATABASE_URL`          | no       | MySQL for user persistence                 |
| `OAUTH_SERVER_URL` etc. | no       | Manus OAuth (only when hosted on Manus)    |
| `PORT`                  | no       | Server port (default 3000)                 |

## Scripts

```bash
pnpm dev     # dev server with hot reload
pnpm check   # TypeScript typecheck
pnpm test    # vitest suite
pnpm build   # production build → dist/
pnpm start   # run production build
```
