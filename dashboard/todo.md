# Project TODO

## Full-Stack Upgrade
- [x] Resolve merge conflicts from web-db-user upgrade (App.tsx, Home.tsx, NotFound.tsx)
- [x] Run pnpm db:push to sync database schema
- [x] Restart dev server after upgrade

## Backend API - Real-Time Market Data
- [x] Build tRPC router for market data using Yahoo Finance data API
- [x] Endpoint: fetch real-time prices for all tracked tickers
- [x] Endpoint: calculate monthly 20 MA and Bollinger Bands from monthly chart data
- [x] Endpoint: calculate drawdown from ATH for Investment Radar
- [x] Endpoint: determine DCA zones based on real technical levels (20 MA, lower BB)

## Leap Screener Restructure
- [x] Multi-timeframe support: Daily / Weekly / Monthly tabs
- [x] Move CAG/PG/SPOT/NFLX to Past Winners archive with outcome data
- [x] Add proper empty state when no active setups exist
- [x] Add Watchlist section showing tickers being monitored with SSL levels
- [x] Screening activates 5 days before period end
- [x] Real-time data integration for all screener data

## Investment Radar - Real-Time Data
- [x] Pull current real-time trading prices for all Mag 7 + ETFs
- [x] Calculate actual monthly 20 MA levels (rare touch = signal)
- [x] Calculate monthly lower Bollinger Band levels (brush = go heavy)
- [x] Set realistic DCA zones based on actual technical levels
- [x] Show proper buy signals: On Watch / Good Buy / Aggressive Buy
- [x] Add bull case research summaries for each stock
- [x] Fund buying / stock buyback indicators

## Market Correction Alerts
- [x] Add SPY/QQQ correction territory alerts (10% correction, 15% deep correction, 20% bear market)
- [x] Display prominent alert banners when indices enter correction zones

## Valuation Context
- [x] Add forward PE, current PE, historical PE for ALL tracked stocks (Mag 7 + ETFs)
- [x] Show discount vs historical average so members see valuation opportunity
- [x] Include earnings growth estimates for conviction building

## Projected Stock Prices
- [x] Add 5/10/15/20 year projected prices for all stocks
- [x] Three scenarios: Conservative / Base Case / Bull Case
- [x] Based on historical growth rates for each company

## Portfolio Builder
- [x] Add Portfolio Builder tab for someone starting from scratch
- [x] Suggested allocation across Mag 7 + ETFs based on current valuations
- [x] Starting capital input, age, risk tolerance, time horizon inputs
- [x] Monthly contribution plan with deployment suggestions
- [x] Projected portfolio value at 5/10/15/20 years (conservative/base/bull)
- [x] Anti-mutual fund comparison (7-8% vs 18% TF strategy)
- [x] Coaching CTA and tidbits throughout

## Research Tool & Stock Comparison
- [x] Add stock search — type any ticker and get instant analysis
- [x] LLM-powered research summary for any searched stock
- [x] Head-to-head comparison mode (e.g., MSFT vs NVDA)

## TradingView Chart Embeds
- [x] Embed TradingView chart widget in LeapScreener detail panels
- [x] Embed TradingView chart in InvestmentRadar stock cards
- [x] Embed TradingView chart in ResearchTool stock analysis

## Skool Exclusivity
- [x] Ensure branding references TF Elite Skool community (skool.com/tfelite)
- [x] Add exclusive member access messaging throughout the terminal

## Sector Benchmark & Relative PE Analysis
- [x] Add sector ETF benchmarks (XLK, XLC, XLY, etc.) for each stock
- [x] Calculate relative PE vs historical average PE for each stock
- [x] Show stock performance vs sector ETF benchmark

## Investment Calculator ("What if $10K today?")
- [x] Add $10K investment calculator to Investment Radar detail panels
- [x] Show projected value at 5, 10, 15, 20 years
- [x] Allow user to adjust investment amount

## AI Education & Research Chatbot
- [x] Add chatbot tRPC endpoint with LLM integration
- [x] System prompt: Trader Foundation philosophy, educational + stock comparison capable
- [x] Inject real-time market data context
- [x] Floating chat widget accessible from any tab (terminal-styled)
- [x] Handle educational Q&A and stock comparisons

## Position Builder with DCA Deployment Styles
- [x] Add position builder endpoint — input: symbol, full position size, deployment style
- [x] Deployment styles: Conservative, Aggressive, All-In Zone 3
- [x] Show shares at each zone, average cost basis, projected returns
- [x] "Don't Panic — ALL ZONES DEPLOYED" reassurance

## "Screaming Buy" Conviction Signals
- [x] When stock hits deep DCA zones, show conviction data
- [x] Display current PE vs forward PE vs historical avg PE
- [x] Show earnings growth rate vs price decline
- [x] Revenue growth, FCF growth, buyback data as conviction reinforcement

## Portfolio Import & Rebalancing
- [x] CSV upload for current portfolio holdings (ticker, shares, avg cost)
- [x] Analyze sector allocation vs ideal allocation
- [x] Show overweight/underweight sectors with rebalancing suggestions

## Market Lifecycle Indicator (Long-Term Cycle)
- [x] Add market lifecycle phase detection based on sector rotation and price action
- [x] Phases: Accumulation → Markup → Distribution → Markdown
- [x] Visual gauge showing current phase at top of Investment Radar
- [x] Context messaging for each phase

## Customizable Portfolio Growth Simulator
- [x] Per-stock individual growth rate selection (conservative/base/bull/outperform/custom)
- [x] Per-stock 5/10/20 year projections displayed individually
- [x] "Add a stock" feature — add new holding and see impact on total portfolio
- [x] Total portfolio projection summing all individual stock projections

## Wall Street Exchange Cascade Ticker Grid
- [x] Build NYSE-style cascading mosaic grid of all tickers
- [x] Small tiles showing symbol, price, change — color-coded green/red
- [x] Volume anomaly detection and institutional flow indicators

## Volume Anomaly Alerts
- [x] Detect volume spikes 2x+ above weekly/monthly average
- [x] Alert badges on ticker tiles
- [x] "UNUSUAL VOLUME" flag when institutional activity detected

## Email Alert System
- [x] Email alerts on SSL level breach (via notifyOwner)
- [x] Email alerts on volume anomaly (2x+ avg volume)
- [x] Email alerts on DCA zone entry
- [x] Wire to built-in notifyOwner system
- [x] Auto-scan every 5 minutes

## Polish & Delivery
- [x] Write vitest tests for backend API (19 tests passing)
- [x] Save checkpoint and deliver

## Future: Mobile App
- [ ] Native iOS/Android app with push notifications (future project)

## Future: Excel (.xlsx) Portfolio Import
- [ ] Support Excel (.xlsx) file upload in addition to CSV

## Portfolio Stress Testing
- [ ] Add stress test backend endpoint with crash scenarios (2008, 2020, dot-com, custom)
- [ ] Monte Carlo simulation for portfolio outcomes
- [ ] Max drawdown analysis for user's specific portfolio
- [ ] "What if market drops 30%?" scenario modeling
- [ ] Recovery timeline estimates based on historical data
- [ ] Stress test results UI in Portfolio Simulator tab

## Competitive Analysis Document
- [ ] 50-page comprehensive competitive analysis of trading platforms
- [ ] Compare TF Elite vs TradingView, Thinkorswim, Bloomberg, Finviz, Stock Rover, Seeking Alpha, Motley Fool, etc.
- [ ] Feature comparison, pricing, target audience, strengths/weaknesses
- [ ] TF Elite differentiation and competitive advantages

## Docker & Deployment
- [ ] Dockerfile with multi-stage build (Node.js + Vite)
- [ ] docker-compose.yml for local development
- [ ] AWS deployment scripts (ECS/Fargate, CloudFormation)
- [ ] Vercel deployment config and scripts
- [ ] Deployment documentation with environment variable guide

## Plaid Brokerage Integration
- [ ] Add Plaid API integration for automatic brokerage syncing
- [ ] Support Fidelity, Schwab, TD Ameritrade, Robinhood, etc.
- [ ] Plaid Link frontend widget for secure brokerage login
- [ ] Auto-import holdings, balances, and positions
- [ ] Combine with existing CSV/Excel import as dual option
- [ ] Request PLAID_CLIENT_ID and PLAID_SECRET as secrets

## Elite Deep Stock Research
- [x] Deep research endpoint using Yahoo Finance APIs (insights, holders, financials)
- [x] Analyst price targets and consensus ratings
- [x] Institutional ownership changes and insider activity
- [x] Revenue/earnings/margin trends with historical data
- [x] Competitive positioning and market share context
- [x] SEC filings and significant developments
- [x] Elite research panel UI (EliteDeepDive component)
- [x] LLM-powered comprehensive research summary for each stock

## Dividends, Stock Splits & Earnings Calendar
- [x] Dividend yield, payout ratio, ex-dividend date, next payment
- [x] Stock split history for each stock
- [x] Earnings calendar — next earnings date, EPS estimate, revenue estimate
- [x] Earnings history — beat/miss track record

## Overreaction Alert System
- [x] Detect earnings beat + price dump = "OVERREACTION ALERT"
- [x] Show EPS beat %, revenue beat %, vs price decline %
- [x] Flag as buying opportunity with fundamentals context
- [x] Integrate into deep research panel and alert system

## Freedom Calculator (Integrated with Portfolio)
- [x] Backend endpoint: calculate freedom number (desired annual income / withdrawal rate)
- [x] Show how much you need invested to live off $X/year
- [x] Integrate with Portfolio Simulator holdings — pull actual stocks/allocations
- [x] Per-stock projected growth rates based on historical performance (Mag 7 > ETFs)
- [x] Portfolio-weighted blended return rate calculation
- [x] Current portfolio gap analysis (how far you are from freedom number)
- [x] Timeline projection: when you'll hit freedom number based on your actual portfolio
- [x] "What if" scenarios: add stocks, increase contributions, adjust allocations
- [x] Monthly contribution impact on timeline
- [x] Milestone markers ($100K, $250K, $500K, $1M, freedom number)
- [x] Terminal-styled UI flowing seamlessly with Portfolio Simulator
- [x] All return rates derived from stock-specific historical data — no advertised return claims

## SSL Multi-Timeframe
- [x] Ensure SSL setup detection covers Weekly, Daily, and Monthly timeframes (already implemented)
- [x] Display all three timeframes in screener (tab switching already works)
- [x] Include SSL levels in Deep Dive research panel

## SSL Timed Alert System
- [x] Daily SSL alert at 2pm ET — "Here are today's daily SSL setups to watch"
- [x] Weekly SSL alert Thursday 3pm ET — "Weekly watchlist" (approaching setups)
- [x] Weekly SSL alert Friday 3pm ET — "Execution day" (act on these)
- [x] Monthly SSL alert starting 5 trading days before month close
- [x] Monthly alert narrows/gets more precise as month closes (countdown precision)
- [x] Notification delivery via owner notification system
- [x] Display alert schedule and countdown in the UI

## SSL 9-Point Grading Engine
- [x] Liquidity score (X/3): near-term SSL + further-term SSL detection
- [x] Volume Climax score (X/3): historical max vs average vs no volume
- [x] Absorption Candle score (X/3): long wick up closing above SSL, near prev close, doji/hammer/spinning top
- [x] Additional confluence flags: RSI bullish divergence, FIB key levels
- [x] Only display setups grading 7/9 or higher (A grade minimum)
- [x] Grade display: A+ (9/9), A+ (8/9), A (7/9)
- [x] Integrate grading into LeapScreener SSL watchlist

## Sector Rotation Deep Dive
- [x] Detect money flowing out of sectors (creating SSL sweeps)
- [x] Detect money flowing into sectors (rotation targets)
- [x] Sector performance comparison and rotation visualization
- [x] Integrate with SSL grading — sector rotation as context for setups

## Mini Candle Chart Previews (Screener + Investment Radar + Deep Dive)
- [x] Backend: return OHLCV candle data with screener results (timeframe-appropriate range)
- [x] Monthly timeframe: show ~5 years of candle data
- [x] Weekly timeframe: show ~1 year of candle data
- [x] Daily timeframe: show ~3 months of candle data
- [x] Frontend: MiniCandleChart component — reusable across screener, radar, deep dive
- [x] Mark SSL levels on the mini chart
- [x] Mark DCA zones / 20 MA on Investment Radar charts
- [x] Terminal-styled chart matching the dark/gold aesthetic
- [x] Show chart in context wherever it adds value (screener rows, radar cards, deep dive)
- [x] Click any stock anywhere → opens full Elite Deep Dive for that ticker
- [x] Deep Dive accessible from screener rows, radar cards, exchange tiles, research results

## Expandable Charts
- [x] Add expand/fullscreen button to MiniCandleChart component
- [x] Full-screen modal overlay with larger chart view (crosshair, OHLCV tooltip, price grid)
- [ ] Add resize option to TradingView chart embeds
- [x] Smooth expand/collapse animation

## Deep Dive Speed Optimization
- [x] Add aggressive server-side caching for Deep Dive data (5-min TTL)
- [x] Parallelize all Yahoo Finance API calls in getStockDeepDive
- [x] Split Deep Dive into fast + slow endpoints (getFast instant, getResearch lazy)
- [x] Progressive loading UI — skeleton animation while AI loads
- [x] Cache LLM research summaries longer (30 min AI_RESEARCH_CACHE_TTL)

## Institutional Flow Detection
- [x] Volume-based institutional flow detection (volume spike analysis)
- [x] Block trade detection (large volume patterns)
- [x] Accumulation/distribution scoring
- [x] Flow badges in screener rows (INSANE/HEAVY/ELEVATED/MODERATE)
- [x] Alert on institutional flow anomalies

## Deep Dive Speed Optimization (duplicate — merged above)
- [x] All items completed above

## Expandable Charts (duplicate — merged above)
- [x] All items completed above

## Bug Fix
- [x] Chatbox (TerminalChatbot) confirmed present in Home.tsx — was not actually removed


## Bug Fix — Candle Data
- [x] Weekly candle chart fixed — only shows Friday closes (Mon open → Fri close)
- [x] Filter out non-trading days (weekends/holidays) from candle data
- [x] Filter out incomplete/current week candle if today is not Friday
- [x] Monthly — only show completed month candles
- [x] Daily — only show completed trading days (no weekends/holidays)

## Chatbot Upgrade + Auth Lockdown
- [x] Upgrade chatbot system prompt with full TF strategy knowledge (SSL 9-point grading, risk/reward, upside analysis, position sizing)
- [x] Add SSL grading data and institutional flow data to chatbot context
- [x] Lock all key endpoints behind protectedProcedure for Skool member exclusivity
- [x] Add login gate on frontend for unauthenticated users

## Rename
- [x] Rename "SSL LEAP SCREENER" to "SSL SCREENER" across all UI references
- [x] Remove Trader Foundation logo image from header — text only

## Portfolio Stress Testing UI
- [x] Build StressTest frontend component with crash scenario selection
- [x] Show portfolio impact for 2008, 2020, dot-com, custom crash scenarios
- [x] Monte Carlo simulation visualization
- [x] Recovery timeline estimates
- [x] Integrate into Portfolio Simulator tab with sub-tab navigation

## Plaid Brokerage Integration UI (PAUSED)
- [x] Build PlaidConnect component with Plaid Link widget
- [x] Auto-import holdings after brokerage connection
- [x] Display synced holdings in portfolio view
- [ ] Combine with existing CSV import as dual option (paused)
- [ ] Request PLAID_CLIENT_ID and PLAID_SECRET secrets (paused)

## Chatbot Speed Fix
- [x] Dramatically speed up AI chatbot response time (currently extremely slow)
- [x] Trim system prompt to reduce token overhead
- [x] Remove heavy data fetching from chat context (SSL grades, flow data)
- [x] Add streaming responses for instant feedback
- [x] Fix chatbot to reference latest closing prices instead of saying it has no live data

## UI Fixes
- [x] Expand the live chart on SSL Screener — currently too small (600x320 candle chart + 500px TradingView)
- [x] Remove all alert scanners, notifyOwner calls, and notification triggers from the app

## SSL Logic Fix
- [x] Fix sell-side vs buy-side liquidity confusion in SSL detection (AAPL showing incorrectly)
  - Fixed: swing low now requires BOTH left AND right side confirmation (was only checking left)
  - Fixed: sslLevels now shows 3 nearest levels BELOW current price (was showing 3 highest = above price)
  - Added: clustering to merge nearby levels within 2%

## Investment Radar - Relative Value Fix
- [x] Fix radar to not just say "deploy" because something is in correction — evaluate relative value
- [x] Add peer comparison for Mag 7/big tech (AAPL vs MSFT vs GOOGL vs META vs AMZN vs NVDA vs TSLA)
- [x] Use Forward PE / Current PE / Historical PE to determine if discount is real
- [x] AAPL at current levels should NOT be a deploy — not down enough relative to peers
- [x] MSFT at current levels SHOULD be a deploy — better relative value
- [x] Show peer comparison data in the radar UI (PeerComparisonPanel added to detail view)

## Portfolio Simulator - Excel Upload
- [x] Add Excel (.xlsx) upload support alongside existing CSV upload

## Freedom Calculator Chart
- [x] Add simple SVG line chart to Freedom Calculator showing portfolio value (gold) vs contributions (cyan)
- [x] Use high contrast colors (gold #D4AF37, cyan #00E5FF, dark background)
- [x] Freedom line dashed, freedom year marker dot, area fill under value line

## Bug Fixes
- [x] Fix head-to-head analyze button in Research Terminal (data shape mismatch fixed)
- [x] Make Elite Deep Dive chart much bigger (700px)
- [x] Fix valuation data — now LLM-powered real-time calculations for ANY stock (no hardcoded data)

## Bug Fix - SSL Screener Empty
- [x] Fix SSL screener showing 0 setups (was API quota exhaustion — caching now prevents this)
- [x] Extend cache TTLs (monthly: 24hr, weekly: 6hr, daily: 30min during market hours)
- [x] Add "data temporarily unavailable" fallback UI instead of showing 0 setups
- [x] Reduce API calls to prevent quota exhaustion during market hours
