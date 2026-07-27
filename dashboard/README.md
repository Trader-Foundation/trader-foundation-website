# TF Elite Terminal (monthly-leap-screener)

The Trader Foundation members dashboard: Setup Screener (three strategies —
Bounce, SSL sell-side liquidity, and Breakout), Wall Street Exchange grid,
Investment Radar, Portfolio Simulator, Freedom Calculator, Research Terminal,
and AI chatbot.

Note: the Bounce strategy currently runs provisional touch-and-hold criteria —
the official TF bounce spec will replace the scoring functions in
`server/strategyEngine.ts` when provided.

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
| `auto`   | **Default.** Manus proxy if configured → otherwise direct Yahoo Finance → falls back to demo data if Yahoo is unreachable. |
| `direct` | Yahoo Finance public API only (free, no key). Errors surface if unreachable. |
| `demo`   | Deterministic synthetic data. Fully offline; every tab works. Prices are seeded per symbol and stable within a day. |
| `manus`  | Original Manus Forge proxy (requires `BUILT_IN_FORGE_API_URL` + `BUILT_IN_FORGE_API_KEY`). |

Set it via environment variable, e.g. `DATA_MODE=demo pnpm dev`.

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
