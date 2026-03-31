/*
 * Stocks & Index Page — Trader Foundation
 * Same layout as Investing 101: two-column with TOC + sticky sidebar
 * 100% original content — no overlap with GOAT Academy
 * Voice: Trader Foundation philosophy — swing trading, technical analysis, safe options, 1-on-1 coaching
 */

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, BarChart3, Waypoints, ScanSearch, Scale, TrendingUp, ShieldCheck } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Table of Contents data ── */
const TOC = [
  { id: 'what-are-stocks', label: 'What Stocks Actually Represent' },
  { id: 'index-funds-explained', label: 'Index Funds: The Hands-Off Approach' },
  { id: 'etfs-vs-mutual', label: 'ETFs vs. Mutual Funds — Which One Fits?' },
  { id: 'swing-trading', label: 'How Swing Trading Changes the Equation' },
  { id: 'reading-charts', label: 'Reading a Stock Chart Without the Guesswork' },
  { id: 'building-portfolio', label: 'Putting It All Together: Building Your Portfolio' },
];

export default function StocksAndIndex() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 }
    );

    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ── Breadcrumb ── */}
      <div className="pt-[130px] pb-4 bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div
            className="flex items-center gap-2 text-[0.78rem] text-white/50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <a href="/" className="hover:text-[#c7ab77] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#c7ab77]">Stocks & Index</span>
          </div>
        </div>
      </div>

      {/* ── Page Title Banner ── */}
      <div className="bg-[#111] pb-12">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Stocks & <span className="text-[#c7ab77]">Index Investing</span>
          </h1>
          <p
            className="mt-3 text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            From individual stock picks to broad market exposure — understand the vehicles that build real wealth over time.
          </p>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── Article Content (Left Column) ── */}
          <article className="flex-1 min-w-0">
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

              {/* ── Table of Contents ── */}
              <nav className="bg-white rounded-lg border border-[#e8e4dc] p-6 md:p-8 mb-14 shadow-sm">
                <h2
                  className="text-lg font-bold text-[#111] mb-5 flex items-center gap-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  <span className="w-1 h-5 bg-[#c7ab77] rounded-full inline-block" />
                  In This Guide
                </h2>
                <ol className="space-y-2.5">
                  {TOC.map(({ id, label }, i) => (
                    <li key={id}>
                      <button
                        onClick={() => scrollTo(id)}
                        className={`flex items-center gap-3 text-left w-full group transition-colors duration-200 ${
                          activeSection === id ? 'text-[#c7ab77]' : 'text-[#555] hover:text-[#c7ab77]'
                        }`}
                      >
                        <span className="text-[0.75rem] font-bold w-5 text-right shrink-0 opacity-50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`shrink-0 transition-transform duration-200 ${
                            activeSection === id ? 'translate-x-0.5 text-[#c7ab77]' : 'text-[#ccc] group-hover:translate-x-0.5'
                          }`}
                        />
                        <span className="text-[0.95rem] font-medium">{label}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* ── Section 1: What Stocks Actually Represent ── */}
              <section id="what-are-stocks" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    What Stocks Actually Represent
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  A stock is not just a ticker symbol on a screen. When you purchase a share of a company, you are buying fractional ownership of that business — its revenue, its assets, its future earnings potential. If the company grows and becomes more valuable, the price of your share reflects that growth. If it struggles, the price drops accordingly.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  This is an important distinction because it changes how you think about buying and selling. You are not gambling on random price movements. You are making a judgment about whether a business is likely to be worth more tomorrow than it is today. That judgment can be informed by fundamentals — earnings reports, revenue growth, competitive positioning — or by technical analysis, which is what we focus on at Trader Foundation.
                </p>

                <div className="bg-[#111] rounded-lg p-8 my-8">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Key Stock Concepts:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        term: 'Market Capitalization',
                        def: 'The total value of a company\'s outstanding shares. Large-cap stocks (over $10B) tend to be more stable; small-caps offer higher growth potential with more volatility.',
                      },
                      {
                        term: 'Earnings Per Share (EPS)',
                        def: 'A company\'s profit divided by its number of shares. Rising EPS over time is one signal that a business is growing profitably.',
                      },
                      {
                        term: 'Dividends',
                        def: 'Cash payments some companies distribute to shareholders from their profits. Dividend-paying stocks can provide income while you hold them.',
                      },
                      {
                        term: 'Volume',
                        def: 'The number of shares traded in a given period. High volume often confirms the strength of a price move — something swing traders pay close attention to.',
                      },
                    ].map((item) => (
                      <div
                        key={item.term}
                        className="p-4 rounded-md bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="font-semibold text-[#c7ab77] text-[0.88rem]">
                          {item.term}
                        </span>
                        <p className="text-white/60 text-[0.85rem] mt-1.5 mb-0 leading-relaxed">
                          {item.def}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  You do not need to memorize every financial metric to start investing in stocks. But understanding that each share represents a real piece of a real business keeps you grounded — especially when the market gets volatile and emotions start running the show.
                </p>
              </section>

              {/* ── Section 2: Index Funds Explained ── */}
              <section id="index-funds-explained" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Waypoints size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Index Funds: The Hands-Off Approach
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Not everyone wants to — or should — pick individual stocks. That is where index funds come in. An index fund is a collection of stocks designed to mirror the performance of a specific market benchmark. The most well-known example is the S&P 500 index, which tracks the 500 largest publicly traded companies in the United States.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  When you buy shares of an S&P 500 index fund, you are effectively buying a tiny slice of all 500 companies at once — Apple, Microsoft, Johnson & Johnson, JPMorgan, and hundreds more. If the overall market goes up, your investment goes up. You do not need to research individual companies or worry about one bad earnings report tanking your portfolio.
                </p>

                <div className="bg-[#c7ab77]/[0.08] border-l-4 border-[#c7ab77] p-6 rounded-r-lg my-8">
                  <p className="text-[1rem] leading-relaxed text-[#333] m-0">
                    <strong>Why this matters:</strong> Between 1957 and 2024, the S&P 500 delivered an average annual return of approximately 10.5% (before inflation). That means $10,000 invested in 1990 and left untouched would be worth over $200,000 today. No stock picking required — just patience.
                  </p>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Index funds are particularly powerful for long-term wealth building because of their low fees. Since they simply track an index rather than paying a team of analysts to pick stocks, their expense ratios are often below 0.10% — a fraction of what actively managed funds charge. Over decades, that fee difference compounds into tens of thousands of dollars saved.
                </p>

                <div className="bg-white rounded-lg border border-[#e8e4dc] p-8 my-8 shadow-sm">
                  <h3
                    className="text-lg font-bold text-[#111] mb-5"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Popular Index Benchmarks:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: 'S&P 500',
                        desc: 'Tracks the 500 largest U.S. companies by market cap. The most widely followed benchmark for overall U.S. stock market performance.',
                      },
                      {
                        name: 'Nasdaq Composite',
                        desc: 'Heavily weighted toward technology and growth companies. More volatile than the S&P 500 but has delivered higher returns in recent decades.',
                      },
                      {
                        name: 'Dow Jones Industrial Average',
                        desc: 'Tracks 30 blue-chip U.S. companies. The oldest major index, though its small size makes it less representative of the broader market.',
                      },
                      {
                        name: 'Russell 2000',
                        desc: 'Focuses on 2,000 smaller U.S. companies. Useful for exposure to small-cap growth but comes with higher volatility.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#c7ab77] text-xs font-bold">
                            {i + 1}
                          </span>
                        </span>
                        <div>
                          <span className="font-semibold text-[#111] text-[0.95rem]">
                            {item.name}
                          </span>
                          <p className="text-[#666] text-[0.9rem] mt-1 mb-0 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Section 3: ETFs vs. Mutual Funds ── */}
              <section id="etfs-vs-mutual" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Scale size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    ETFs vs. Mutual Funds — Which One Fits?
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Both ETFs and mutual funds let you invest in a basket of securities with a single purchase. They sound similar, and in many ways they are. But the differences matter depending on how you plan to invest.
                </p>

                {/* Comparison table */}
                <div className="overflow-x-auto my-8">
                  <table className="w-full text-[0.9rem] border-collapse">
                    <thead>
                      <tr className="bg-[#111] text-white">
                        <th className="text-left p-4 font-semibold rounded-tl-lg" style={{ fontFamily: "'Sen', sans-serif" }}>Feature</th>
                        <th className="text-left p-4 font-semibold" style={{ fontFamily: "'Sen', sans-serif" }}>ETFs</th>
                        <th className="text-left p-4 font-semibold rounded-tr-lg" style={{ fontFamily: "'Sen', sans-serif" }}>Mutual Funds</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#444]">
                      {[
                        ['Trading', 'Trades throughout the day like a stock', 'Priced once at market close'],
                        ['Minimum Investment', 'Price of one share (often $50–$500)', 'Often $1,000–$3,000 minimum'],
                        ['Expense Ratios', 'Typically 0.03%–0.20%', 'Ranges from 0.10% to 1.00%+'],
                        ['Tax Efficiency', 'Generally more tax-efficient', 'Can trigger capital gains distributions'],
                        ['Automatic Investing', 'Requires manual purchases', 'Easy to set up auto-contributions'],
                        ['Best For', 'Flexible, cost-conscious investors', 'Set-it-and-forget-it retirement savers'],
                      ].map(([feature, etf, mutual], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf9f6]'}>
                          <td className="p-4 font-semibold text-[#111]">{feature}</td>
                          <td className="p-4">{etf}</td>
                          <td className="p-4">{mutual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  For most of our students at Trader Foundation, ETFs are the preferred vehicle for long-term index investing. They offer lower costs, intraday trading flexibility, and better tax treatment in taxable accounts. Mutual funds still have their place — particularly inside employer-sponsored retirement plans like a 401(k) where ETFs may not be available.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  The bottom line: the vehicle matters less than the habit. Whether you choose an ETF or a mutual fund, the act of consistently investing in a diversified index is what drives long-term results.
                </p>
              </section>

              {/* ── Section 4: Swing Trading ── */}
              <section id="swing-trading" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    How Swing Trading Changes the Equation
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Index investing is a proven long-term strategy. But what if you also want to actively grow your capital on a shorter timeframe — without becoming a full-time day trader glued to six monitors? That is where swing trading enters the picture.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Swing trading involves holding positions for days to weeks, capturing price movements that unfold over a medium-term horizon. Unlike day trading, you are not making dozens of trades per day or reacting to every five-minute candle. You identify a setup, enter with a plan, set your risk parameters, and let the trade develop. At Trader Foundation, our students typically spend about <strong>10 minutes a day</strong> managing their swing trades.
                </p>

                <div className="bg-[#111] rounded-lg p-8 my-8">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Why Swing Trading Works for Busy Professionals:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        point: 'Time-Efficient',
                        detail: 'You scan for setups after market hours, place your orders, and go about your day. No need to watch charts during work.',
                      },
                      {
                        point: 'Defined Risk on Every Trade',
                        detail: 'Each position has a predetermined stop loss and profit target before you enter. You know your maximum downside before you commit a dollar.',
                      },
                      {
                        point: 'Works Alongside Index Investing',
                        detail: 'Many of our students keep a core portfolio in index funds for long-term growth while using a separate account for swing trades to generate active returns.',
                      },
                      {
                        point: 'Skill That Compounds',
                        detail: 'Unlike a one-time stock tip, swing trading is a repeatable skill. The more you practice reading charts and managing risk, the better your results become over time.',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-md bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="text-[#c7ab77] font-bold text-[0.78rem] shrink-0 mt-0.5 w-4">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <span className="font-semibold text-white text-[0.95rem]">
                            {item.point}
                          </span>
                          <p className="text-white/60 text-[0.88rem] mt-1 mb-0">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  The combination of passive index investing and active swing trading is what we call a <strong>dual-engine approach</strong>. Your index funds provide steady, market-matching growth as a foundation. Your swing trades offer the potential for above-market returns using a disciplined, rules-based system. Neither replaces the other — they complement each other.
                </p>
              </section>

              {/* ── Section 5: Reading a Stock Chart ── */}
              <section id="reading-charts" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <ScanSearch size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Reading a Stock Chart Without the Guesswork
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Charts can look intimidating at first — a mess of candles, lines, and indicators. But at its core, a stock chart is simply a visual history of price and volume over time. Learning to read one is like learning to read a map: once you understand the legend, the terrain starts making sense.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
                  Here are the foundational elements our students learn in the Trader Foundation curriculum:
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      concept: 'Candlestick Patterns',
                      explanation: 'Each candle shows four data points: open, high, low, and close for a given time period. Green (or white) candles mean the price closed higher than it opened; red (or black) candles mean it closed lower. Patterns formed by groups of candles can signal potential reversals or continuations.',
                    },
                    {
                      concept: 'Support & Resistance',
                      explanation: 'Support is a price level where buying interest has historically been strong enough to prevent further decline. Resistance is where selling pressure has capped upward movement. These levels act as decision zones — and they are central to how we identify swing trade entries.',
                    },
                    {
                      concept: 'Moving Averages',
                      explanation: 'A moving average smooths out price data to show the overall trend direction. The 50-day and 200-day moving averages are the most widely watched. When a shorter moving average crosses above a longer one, it is often interpreted as a bullish signal — and vice versa.',
                    },
                    {
                      concept: 'Volume Confirmation',
                      explanation: 'Price movement without volume is like a rumor without evidence. When a stock breaks above resistance on heavy volume, it carries more conviction than the same move on thin volume. We teach our students to always check volume before committing to a trade.',
                    },
                    {
                      concept: 'Relative Strength',
                      explanation: 'How is a stock performing compared to the broader market? A stock that holds up well during a market pullback — or outperforms during a rally — shows relative strength, which is a key filter in our swing trading system.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm"
                    >
                      <p className="font-semibold text-[#111] text-[0.95rem] mb-2 flex items-start gap-2">
                        <span className="text-[#c7ab77] shrink-0 font-bold text-[0.82rem] mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                        {item.concept}
                      </p>
                      <p className="text-[#666] text-[0.9rem] leading-relaxed mb-0 ml-7">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  You do not need to master every indicator on day one. Our program introduces these concepts gradually, with real chart examples and guided practice through our <strong>Time Machine review process</strong> — where you analyze historical setups before risking real capital. By the time you place your first live trade, reading a chart will feel like second nature.
                </p>
              </section>

              {/* ── Section 6: Building Your Portfolio ── */}
              <section id="building-portfolio" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Putting It All Together: Building Your Portfolio
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Knowing about stocks, index funds, and swing trading is useful. But knowledge without a plan is just trivia. Here is how our students typically structure their approach:
                </p>

                <div className="bg-white rounded-lg border border-[#e8e4dc] p-8 my-4 shadow-sm">
                  <div className="space-y-5">
                    {[
                      {
                        title: 'Establish Your Core (Index Funds)',
                        desc: 'Allocate a portion of your capital to broad market index funds — S&P 500, total market, or a target-date fund if you prefer simplicity. This is your wealth-building engine that runs on autopilot.',
                      },
                      {
                        title: 'Set Aside an Active Trading Account',
                        desc: 'Separate from your long-term holdings, fund a brokerage account specifically for swing trades. Start with capital you can afford to risk while you are learning. Many students begin with $2,000–$5,000.',
                      },
                      {
                        title: 'Follow a Rules-Based System',
                        desc: 'Every trade should have clear entry criteria, a stop loss, and a profit target defined before you click "buy." Our curriculum teaches a specific, repeatable system so you are never guessing.',
                      },
                      {
                        title: 'Track Everything',
                        desc: 'Keep a trading journal. Record why you entered, where your stop was, what happened, and what you learned. The students who improve fastest are the ones who review their trades honestly — often with their 1-on-1 coach.',
                      },
                      {
                        title: 'Rebalance Periodically',
                        desc: 'As your active trading account grows, consider moving profits into your long-term index holdings. This locks in gains and keeps your risk exposure in check.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#c7ab77] text-xs font-bold">
                            {i + 1}
                          </span>
                        </span>
                        <div>
                          <span className="font-semibold text-[#111] text-[0.95rem]">
                            {item.title}
                          </span>
                          <p className="text-[#666] text-[0.9rem] mt-1 mb-0 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#c7ab77]/[0.08] border-l-4 border-[#c7ab77] p-6 rounded-r-lg my-8">
                  <p className="text-[1rem] leading-relaxed text-[#333] m-0">
                    <strong>The Trader Foundation difference:</strong> You are never figuring this out alone. Every student gets a personal coach who reviews their portfolio structure, critiques their trade setups, and helps them stay accountable. It is the closest thing to having a financial mentor in your corner.{' '}
                    <a href="/results" className="text-[#c7ab77] font-semibold hover:underline">
                      See what our students have achieved →
                    </a>
                  </p>
                </div>
              </section>

              {/* ── Bottom CTA ── */}
              <section className="bg-[#111] rounded-lg p-8 md:p-10">
                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Ready to Learn the System?
                </h2>
                <p className="text-white/60 text-[1rem] mb-6 leading-relaxed">
                  Our free masterclass walks you through the exact swing trading approach our students use — including how it works alongside long-term index investing. No fluff, no upsell pressure. Just the strategy.
                </p>
                <a
                  href="https://start.traderfoundation.co/trade"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] font-bold text-[0.88rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Watch The Free Masterclass
                  <ArrowRight size={16} />
                </a>
              </section>
            </div>
          </article>

          {/* ── Sidebar (Right Column) ── */}
          <aside className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-[140px]">
              {/* Sidebar CTA Card */}
              <div className="bg-[#111] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={SIDEBAR_IMG}
                  alt="Vlad Tayman teaching at Trader Foundation"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 text-center">
                  <p
                    className="text-[#c7ab77] font-bold text-[0.82rem] uppercase tracking-wider mb-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Free Masterclass
                  </p>
                  <h3
                    className="text-xl font-bold text-white leading-tight mb-3"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Learn the Swing Trading
                    <br />
                    System That Works
                  </h3>
                  <p
                    className="text-white/50 text-[0.85rem] mb-5 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Designed for busy professionals who want to trade confidently in just 10 minutes a day — without quitting their job.
                  </p>
                  <a
                    href="https://start.traderfoundation.co/trade"
                    className="block w-full py-3.5 bg-[#c7ab77] text-[#111] font-bold text-[0.85rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Sign Me Up Now →
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
                <h4
                  className="text-[0.82rem] uppercase tracking-wider text-[#888] font-semibold mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Continue Learning
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Investing 101', href: '/investing-101' },
                    { label: 'Trading Tools', href: '/trading-tools' },
                    { label: 'Options Trading', href: '/options-trading' },
                    { label: 'Compound Interest Calculator', href: '/calculator' },
                    { label: 'Student Results', href: '/results' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 text-[0.88rem] text-[#444] hover:text-[#c7ab77] transition-colors font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <ArrowRight size={14} className="text-[#c7ab77] shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
