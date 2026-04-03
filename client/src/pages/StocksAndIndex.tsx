/*
 * Stocks & Index Page - Trader Foundation
 * Chapter-based navigation: TOC on left, selected chapter content on right
 * Design: GOAT Academy style - clean, editorial, three-column layout
 * Differentiators: Erin's Mag 7 / Buy Fear section + Two-Pillar Principle
 */

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { ArrowRight, ArrowLeft, ChevronRight, BarChart3, Shield, Layers, TrendingUp, LineChart, Landmark, Flame, Briefcase } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Chapter data ── */
const CHAPTERS = [
  { id: 'what-are-stocks', label: 'What Stocks Actually Represent', icon: BarChart3 },
  { id: 'mag7-bear-markets', label: 'The Mag 7 & Buying Fear, With Coach Erin', icon: Shield },
  { id: 'index-funds-explained', label: 'Index Funds: The Hands-Off Approach', icon: Layers },
  { id: 'etfs-vs-mutual', label: 'ETFs vs. Mutual Funds, Which One Fits?', icon: TrendingUp },
  { id: 'swing-trading', label: 'How Swing Trading Changes the Equation', icon: LineChart },
  { id: 'reading-charts', label: 'Reading a Stock Chart Without the Guesswork', icon: Landmark },
  { id: 'two-pillar-principle', label: 'The Two-Pillar Principle', icon: Flame },
  { id: 'building-portfolio', label: 'Putting It All Together: Building Your Portfolio', icon: Briefcase },
];

/* ── Chapter Content Components ── */

function ChapterWhatAreStocks() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        A stock is not just a ticker symbol on a screen. When you purchase a share of a company, you are buying fractional ownership of that business, its revenue, its assets, its future earnings potential. If the company grows and becomes more valuable, the price of your share reflects that growth. If it struggles, the price drops accordingly.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        This is an important distinction because it changes how you think about buying and selling. You are not gambling on random price movements. You are making a judgment about whether a business is likely to be worth more tomorrow than it is today. That judgment can be informed by fundamentals, earnings reports, revenue growth, competitive positioning, or by technical analysis, which is what we focus on at Trader Foundation.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Key Stock Concepts</h3>
      <ul className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#444]">
        <li><strong>Market Capitalization:</strong> The total value of a company's outstanding shares. Large-cap stocks (over $10B) tend to be more stable; small-caps offer higher growth potential with more volatility.</li>
        <li><strong>Earnings Per Share (EPS):</strong> A company's profit divided by its number of shares. Rising EPS over time is one signal that a business is growing profitably.</li>
        <li><strong>Dividends:</strong> Cash payments some companies distribute to shareholders from their profits. Dividend-paying stocks can provide income while you hold them.</li>
        <li><strong>Volume:</strong> The number of shares traded in a given period. High volume often confirms the strength of a price move, something swing traders pay close attention to.</li>
      </ul>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        You do not need to memorize every financial metric to start investing in stocks. But understanding that each share represents a real piece of a real business keeps you grounded, especially when the market gets volatile and emotions start running the show.
      </p>
    </>
  );
}

function ChapterMag7() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Most investors hear the word "bear market" and immediately think about protecting what they have. They sell, they panic, they sit on the sidelines waiting for things to "calm down." But some of the greatest wealth in market history has been built by doing the exact opposite, <strong>buying when everyone else is afraid</strong>.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        At Trader Foundation, our coach <strong>Erin</strong> specializes in exactly this. Her focus is on the <strong>Magnificent 7</strong>, Apple, Microsoft, Alphabet, Amazon, Nvidia, Meta, and Tesla, the companies that dominate the global economy and consistently recover stronger after every downturn. Erin's philosophy is straightforward: when fear drives these stocks to irrational lows, that is not a signal to run. It is an opportunity to accumulate shares of the most powerful businesses on the planet at a discount.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>"Buy Fear, Sell Greed"</h3>
      <p className="text-[0.92rem] text-[#888] mb-5 italic">Coach Erin's approach to Mag 7 investing during market downturns</p>

      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        <strong>Bear markets are temporary, the Mag 7 are not.</strong> Every bear market in history has eventually ended. But companies like Apple and Microsoft have not only survived every downturn, they have come out the other side larger, more profitable, and more dominant. Buying during fear means acquiring these assets before the recovery that history tells us is coming.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        <strong>Fear creates the best prices.</strong> When the market drops 20%, 30%, or more, the Mag 7 often get dragged down with everything else, even when their fundamentals remain strong. That disconnect between price and value is where Erin teaches students to act. The same share of Nvidia that costs $900 during euphoria might be available for $500 during panic. Same company, same earnings trajectory, just a better price.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        <strong>Discipline over emotion.</strong> Buying fear sounds simple in theory. In practice, it requires the discipline to act when every headline is screaming "sell." Erin works with students to build a systematic approach, identifying key support levels, dollar-cost averaging into positions during drawdowns, and maintaining conviction based on fundamentals rather than sentiment.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        <strong>Long-term wealth, not quick flips.</strong> This is not about timing the exact bottom. It is about recognizing that bear markets hand you a rare chance to own world-class businesses at prices you may never see again. Erin's students learn to think in years, not days, and that patience is what turns a downturn into a wealth-building event.
      </p>

      {/* Coach Spotlight */}
      <div className="bg-[#f4f1eb] border-l-4 border-[#c7ab77] p-6 rounded-r-md my-8">
        <p className="text-[0.82rem] font-bold uppercase tracking-widest text-[#c7ab77] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Coach Spotlight</p>
        <p className="text-lg font-bold text-[#111] mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>
          How Erin Reached Coast FIRE With Two Pillars
        </p>
        <p className="text-[1rem] leading-[1.8] text-[#555] mb-3">
          Erin did not build her financial independence through trading alone, and she did not build it through investing alone. She used <strong>both pillars together</strong>. Trading generated consistent, active income, money she could deploy immediately. Investing in the Mag 7 during bear markets compounded that income into long-term, generational wealth. The two worked in tandem like a supercharged engine.
        </p>
        <p className="text-[1rem] leading-[1.8] text-[#555] mb-3">
          That combination is what allowed Erin to reach <strong>Coast FIRE</strong>, the point where her invested assets are large enough to grow into a full retirement on their own, without needing to add another dollar. She still trades because she enjoys it and it accelerates her timeline. But she no longer <em>has</em> to. That is the freedom both pillars create when they work together.
        </p>
        <p className="text-[1rem] leading-[1.8] text-[#555] mb-0">
          This is what she teaches her students at Trader Foundation: use trading to generate the fuel, and use investing to build the fire. You need both to become a true wealth-building engine.
        </p>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The Magnificent 7 represent roughly 30% of the entire S&P 500's market capitalization. When you learn to strategically accumulate these stocks during periods of fear, you are not just buying a dip, you are positioning yourself in the companies that shape the global economy. That is the kind of conviction-based investing Erin brings to every student she works with.
      </p>
    </>
  );
}

function ChapterIndexFunds() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Not everyone wants to, or should, pick individual stocks. That is where index funds come in. An index fund is a collection of stocks designed to mirror the performance of a specific market benchmark. The most well-known example is the S&P 500 index, which tracks the 500 largest publicly traded companies in the United States.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        When you buy shares of an S&P 500 index fund, you are effectively buying a tiny slice of all 500 companies at once, Apple, Microsoft, Johnson & Johnson, JPMorgan, and hundreds more. If the overall market goes up, your investment goes up. You do not need to research individual companies or worry about one bad earnings report tanking your portfolio.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        <strong>Why this matters:</strong> Between 1957 and 2024, the S&P 500 delivered an average annual return of approximately 10.5% (before inflation). That means $10,000 invested in 1990 and left untouched would be worth over $200,000 today. No stock picking required, just patience. <a href="/calculator" className="text-[#c7ab77] font-semibold hover:underline">Try our compound interest calculator to see how your money could grow</a>.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Index funds are particularly powerful for long-term wealth building because of their low fees. Since they simply track an index rather than paying a team of analysts to pick stocks, their expense ratios are often below 0.10%, a fraction of what actively managed funds charge. Over decades, that fee difference compounds into tens of thousands of dollars saved.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Popular Index Benchmarks</h3>
      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#444] list-decimal list-inside">
        <li><strong>S&P 500:</strong> Tracks the 500 largest U.S. companies by market cap. The most widely followed benchmark for overall U.S. stock market performance.</li>
        <li><strong>Nasdaq Composite:</strong> Heavily weighted toward technology and growth companies. More volatile than the S&P 500 but has delivered higher returns in recent decades.</li>
        <li><strong>Dow Jones Industrial Average:</strong> Tracks 30 blue-chip U.S. companies. The oldest major index, though its small size makes it less representative of the broader market.</li>
        <li><strong>Russell 2000:</strong> Focuses on 2,000 smaller U.S. companies. Useful for exposure to small-cap growth but comes with higher volatility.</li>
      </ol>
    </>
  );
}

function ChapterETFvsMutual() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Both ETFs and mutual funds let you invest in a basket of securities with a single purchase. They sound similar, and in many ways they are. But the differences matter depending on how you plan to invest.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto my-8">
        <table className="w-full text-[0.92rem] border-collapse border border-[#e5e5e5]">
          <thead>
            <tr className="bg-[#f5f5f5]">
              <th className="text-left p-4 font-bold border border-[#e5e5e5]" style={{ fontFamily: "'Sen', sans-serif" }}>Feature</th>
              <th className="text-left p-4 font-bold border border-[#e5e5e5]" style={{ fontFamily: "'Sen', sans-serif" }}>ETFs</th>
              <th className="text-left p-4 font-bold border border-[#e5e5e5]" style={{ fontFamily: "'Sen', sans-serif" }}>Mutual Funds</th>
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
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                <td className="p-4 font-semibold text-[#111] border border-[#e5e5e5]">{feature}</td>
                <td className="p-4 border border-[#e5e5e5]">{etf}</td>
                <td className="p-4 border border-[#e5e5e5]">{mutual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        For most of our students at Trader Foundation, ETFs are the preferred vehicle for long-term index investing. They offer lower costs, intraday trading flexibility, and better tax treatment in taxable accounts. Mutual funds still have their place, particularly inside employer-sponsored retirement plans like a 401(k) where ETFs may not be available.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The bottom line: the vehicle matters less than the habit. Whether you choose an ETF or a mutual fund, the act of consistently investing in a diversified index is what drives long-term results.
      </p>
    </>
  );
}

function ChapterSwingTrading() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Index investing is a proven long-term strategy. But what if you also want to actively grow your capital on a shorter timeframe, without becoming a full-time day trader glued to six monitors? That is where swing trading enters the picture.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Swing trading involves holding positions for days to weeks, capturing price movements that unfold over a medium-term horizon. Unlike day trading, you are not making dozens of trades per day or reacting to every five-minute candle. You identify a setup, enter with a plan, set your risk parameters, and let the trade develop. At Trader Foundation, our students typically spend about <strong>10 minutes a day</strong> managing their swing trades.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Why Swing Trading Works for Busy Professionals</h3>
      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#444] list-decimal list-inside">
        <li><strong>Time-efficient:</strong> You scan for setups after market hours, place your orders, and go about your day. No need to watch charts during work.</li>
        <li><strong>Defined risk on every trade:</strong> Each position has a predetermined stop loss and profit target before you enter. You know your maximum downside before you commit a dollar.</li>
        <li><strong>Works alongside index investing:</strong> Many of our students keep a core portfolio in index funds for long-term growth while using a separate account for swing trades to generate active returns.</li>
        <li><strong>A skill that compounds:</strong> Unlike a one-time stock tip, swing trading is a repeatable skill. The more you practice reading charts and managing risk, the better your results become over time.</li>
      </ol>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The combination of passive index investing and active swing trading is what we call a <strong>dual-engine approach</strong>. Your index funds provide steady, market-matching growth as a foundation. Your swing trades offer the potential for above-market returns using a disciplined, rules-based system. Neither replaces the other, they complement each other. <a href="/results" className="text-[#c7ab77] font-semibold hover:underline">See what our students have achieved with this approach</a>.
      </p>
    </>
  );
}

function ChapterReadingCharts() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Charts can look intimidating at first, a mess of candles, lines, and indicators. But at its core, a stock chart is simply a visual history of price and volume over time. Learning to read one is like learning to read a map: once you understand the legend, the terrain starts making sense.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Here are the foundational elements our students learn in the Trader Foundation curriculum:
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Core Chart Concepts</h3>
      <ul className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#444]">
        <li><strong>Candlestick Patterns:</strong> Each candle shows four data points: open, high, low, and close for a given time period. Green (or white) candles mean the price closed higher than it opened; red (or black) candles mean it closed lower. Patterns formed by groups of candles can signal potential reversals or continuations.</li>
        <li><strong>Support & Resistance:</strong> Support is a price level where buying interest has historically been strong enough to prevent further decline. Resistance is where selling pressure has capped upward movement. These levels act as decision zones, and they are central to how we identify swing trade entries.</li>
        <li><strong>Moving Averages:</strong> A moving average smooths out price data to show the overall trend direction. The 50-day and 200-day moving averages are the most widely watched. When a shorter moving average crosses above a longer one, it is often interpreted as a bullish signal, and vice versa.</li>
        <li><strong>Volume Confirmation:</strong> Price movement without volume is like a rumor without evidence. When a stock breaks above resistance on heavy volume, it carries more conviction than the same move on thin volume. We teach our students to always check volume before committing to a trade.</li>
        <li><strong>Relative Strength:</strong> How is a stock performing compared to the broader market? A stock that holds up well during a market pullback, or outperforms during a rally, shows relative strength, which is a key filter in our swing trading system.</li>
      </ul>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        You do not need to master every indicator on day one. Our program introduces these concepts gradually, with real chart examples and guided practice through our <strong>Time Machine review process</strong>, where you analyze historical setups before risking real capital. By the time you place your first live trade, reading a chart will feel like second nature.
      </p>
    </>
  );
}

function ChapterTwoPillar() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        There is a distinction most people miss, and it is the single most important concept on this page: <strong>trading is supplemental income, but investing is the real path to wealth.</strong> You need both.
      </p>

      <div className="bg-[#f4f1eb] border border-[#e0d9cc] rounded-md p-6 my-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[#c7ab77] font-bold text-[0.82rem] uppercase tracking-wider mb-1">Pillar 1: Trading</p>
            <p className="text-[#111] font-bold text-[1.05rem] mb-2" style={{ fontFamily: "'Sen', sans-serif" }}>Supplemental Income</p>
            <p className="text-[#666] text-[0.95rem] leading-[1.7] mb-0">Trading generates active cash flow, consistent returns you can use to fund your lifestyle, pay down debt, or reinvest. It is a skill that produces income on demand.</p>
          </div>
          <div>
            <p className="text-[#c7ab77] font-bold text-[0.82rem] uppercase tracking-wider mb-1">Pillar 2: Investing</p>
            <p className="text-[#111] font-bold text-[1.05rem] mb-2" style={{ fontFamily: "'Sen', sans-serif" }}>The Real Path to Wealth</p>
            <p className="text-[#666] text-[0.95rem] leading-[1.7] mb-0">Investing is what turns that income into lasting, compounding wealth. When you buy and hold great businesses, especially during fear, time and compound interest do the heavy lifting for you.</p>
          </div>
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Trading without investing means you are always on the treadmill, earning but never building. Investing without trading means you are limited to whatever you can save from your paycheck. <strong>Together, they become a wealth-building engine that is greater than the sum of its parts.</strong>
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        That is exactly how Coach Erin reached Coast FIRE, and it is the framework every Trader Foundation student learns. Use trading to generate the fuel. Use investing to build the fire. You need both pillars to build real, lasting wealth.
      </p>
    </>
  );
}

function ChapterBuildingPortfolio() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Knowing about stocks, index funds, and swing trading is useful. But knowledge without a plan is just trivia. Here is how our students typically structure their approach:
      </p>

      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#444] list-decimal list-inside">
        <li><strong>Establish your core (Index Funds):</strong> Allocate a portion of your capital to broad market index funds, S&P 500, total market, or a target-date fund if you prefer simplicity. This is your wealth-building engine that runs on autopilot.</li>
        <li><strong>Set aside an active trading account:</strong> Separate from your long-term holdings, fund a brokerage account specifically for swing trades. Start with capital you can afford to risk while you are learning. Many students begin with $2,000–$5,000.</li>
        <li><strong>Follow a rules-based system:</strong> Every trade should have clear entry criteria, a stop loss, and a profit target defined before you click "buy." Our curriculum teaches a specific, repeatable system so you are never guessing.</li>
        <li><strong>Track everything:</strong> Keep a trading journal. Record why you entered, where your stop was, what happened, and what you learned. The students who improve fastest are the ones who review their trades honestly, often with their 1-on-1 coach.</li>
        <li><strong>Rebalance periodically:</strong> As your active trading account grows, consider moving profits into your long-term index holdings. This locks in gains and keeps your risk exposure in check.</li>
      </ol>

      <div className="bg-[#f4f1eb] border-l-4 border-[#c7ab77] p-6 rounded-r-md my-8">
        <p className="text-[1rem] leading-[1.8] text-[#555] mb-0">
          <strong>The Trader Foundation difference:</strong> You are never figuring this out alone. Every student gets a personal coach who reviews their portfolio structure, critiques their trade setups, and helps them stay accountable. It is the closest thing to having a financial mentor in your corner. <a href="/results" className="text-[#c7ab77] font-semibold hover:underline">See what our students have achieved →</a>
        </p>
      </div>
    </>
  );
}

/* Map chapter IDs to their content components */
const CHAPTER_CONTENT: Record<string, React.FC> = {
  'what-are-stocks': ChapterWhatAreStocks,
  'mag7-bear-markets': ChapterMag7,
  'index-funds-explained': ChapterIndexFunds,
  'etfs-vs-mutual': ChapterETFvsMutual,
  'swing-trading': ChapterSwingTrading,
  'reading-charts': ChapterReadingCharts,
  'two-pillar-principle': ChapterTwoPillar,
  'building-portfolio': ChapterBuildingPortfolio,
};

export default function StocksAndIndex() {
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0].id);

  const currentIndex = CHAPTERS.findIndex((c) => c.id === activeChapter);
  const ActiveContent = CHAPTER_CONTENT[activeChapter];
  const activeData = CHAPTERS[currentIndex];
  const Icon = activeData.icon;

  const goTo = (id: string) => {
    setActiveChapter(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ── Breadcrumb ── */}
      <div className="pt-[130px] pb-4 bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[0.78rem] text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <a href="/" className="hover:text-[#c7ab77] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#c7ab77]">Stocks & Index</span>
          </div>
        </div>
      </div>

      {/* ── Page Title Banner ── */}
      <div className="bg-[#111] pb-12">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
            Stocks & <span className="text-[#c7ab77]">Index</span>
          </h1>
          <p className="mt-3 text-white/60 text-lg max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            From individual stock picking to passive index investing, a complete guide to building wealth in the market.
          </p>
        </div>
      </div>

      {/* ── Main Content: TOC Left | Chapter Center | CTA Right ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT: Table of Contents (sticky, always visible) ── */}
          <nav className="hidden lg:block w-[220px] shrink-0">
            <div className="sticky top-[100px]">
              <h2
                className="text-sm font-bold text-[#333] mb-5 uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Table of Contents
              </h2>
              <ul className="space-y-0.5">
                {CHAPTERS.map(({ id, label }, i) => (
                  <li key={id}>
                    <button
                      onClick={() => goTo(id)}
                      className={`block text-left w-full py-2.5 px-4 rounded-md transition-all duration-200 text-[0.84rem] leading-snug ${
                        activeChapter === id
                          ? 'bg-[#c7ab77]/10 text-[#c7ab77] font-semibold border-l-3 border-[#c7ab77]'
                          : 'text-[#555] hover:bg-[#f0ede8] hover:text-[#333]'
                      }`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="text-[0.7rem] opacity-50 mr-2">{String(i + 1).padStart(2, '0')}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* ── MOBILE: Chapter selector ── */}
          <nav className="lg:hidden bg-white rounded-lg border border-[#e8e4dc] p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-[#111] mb-3 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Chapters
            </h2>
            <div className="space-y-1">
              {CHAPTERS.map(({ id, label }, i) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`flex items-center gap-2 text-left w-full py-2 px-3 rounded transition-colors text-[0.88rem] ${
                    activeChapter === id ? 'bg-[#c7ab77]/10 text-[#c7ab77] font-semibold' : 'text-[#555] hover:text-[#c7ab77]'
                  }`}
                >
                  <ChevronRight size={14} className={activeChapter === id ? 'text-[#c7ab77]' : 'text-[#ccc]'} />
                  <span className="text-[0.7rem] opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* ── CENTER: Active Chapter Content ── */}
          <article className="flex-1 min-w-0">
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

              {/* Chapter header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[#c7ab77]" />
                </div>
                <div>
                  <p className="text-[0.75rem] text-[#999] uppercase tracking-wider font-medium mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Chapter {currentIndex + 1} of {CHAPTERS.length}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#111] m-0" style={{ fontFamily: "'Sen', sans-serif" }}>
                    {activeData.label}
                  </h2>
                </div>
              </div>

              {/* Chapter body */}
              <ActiveContent />

              {/* ── Prev / Next Navigation ── */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#e8e4dc]">
                {currentIndex > 0 ? (
                  <button
                    onClick={() => goTo(CHAPTERS[currentIndex - 1].id)}
                    className="flex items-center gap-2 text-[0.88rem] text-[#666] hover:text-[#c7ab77] transition-colors font-medium"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <ArrowLeft size={16} />
                    {CHAPTERS[currentIndex - 1].label}
                  </button>
                ) : (
                  <div />
                )}
                {currentIndex < CHAPTERS.length - 1 ? (
                  <button
                    onClick={() => goTo(CHAPTERS[currentIndex + 1].id)}
                    className="flex items-center gap-2 text-[0.88rem] text-[#c7ab77] hover:text-[#b89a66] transition-colors font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {CHAPTERS[currentIndex + 1].label}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <a
                    href="https://start.traderfoundation.co/trade"
                    className="flex items-center gap-2 text-[0.88rem] text-[#c7ab77] hover:text-[#b89a66] transition-colors font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Watch The Free Masterclass
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </article>

          {/* ── RIGHT: CTA Sidebar (sticky, always visible) ── */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[100px]">
              <div className="bg-[#111] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={SIDEBAR_IMG}
                  alt="Vlad Tayman teaching at Trader Foundation"
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 text-center">
                  <p className="text-[#c7ab77] font-bold text-[0.78rem] uppercase tracking-wider mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Free Masterclass!
                  </p>
                  <h3 className="text-lg font-bold text-white leading-tight mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>
                    Learn the Swing Trading System That Works
                  </h3>
                  <p className="text-white/50 text-[0.82rem] mb-5 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    This proven trading system can help beginners, busy professionals, retirees, and students achieve the financial freedom they deserve.
                  </p>
                  <a
                    href="https://start.traderfoundation.co/trade"
                    className="block w-full py-3 bg-[#c7ab77] text-[#111] font-bold text-[0.85rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    SIGN ME UP NOW &raquo;
                  </a>
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
