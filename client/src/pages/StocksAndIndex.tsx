import React from 'react';
import ChapterLayout, { type Chapter } from '@/components/ChapterLayout';

/* Chapter data. Labels double as the contents list and each chapter's h2. */
const CHAPTERS: Chapter[] = [
  { id: 'what-are-stocks', label: 'What Stocks Actually Represent' },
  { id: 'mag7-bear-markets', label: 'The Mag 7, and Buying Into Fear' },
  { id: 'index-funds-explained', label: 'Index Funds, and What They Are For' },
  { id: 'etfs-vs-mutual', label: 'ETFs vs. Mutual Funds, Which One Fits?' },
  { id: 'swing-trading', label: 'Holding for Days, Not Minutes' },
  { id: 'reading-charts', label: 'Reading a Stock Chart Without the Guesswork' },
  { id: 'two-pillar-principle', label: 'The Two-Pillar Principle' },
  { id: 'building-portfolio', label: 'Putting It Together' },
];

/* ── Chapter Content Components ── */

function ChapterWhatAreStocks() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        A stock is not just a ticker symbol on a screen. When you purchase a share of a company, you are buying fractional ownership of that business, its revenue, its assets, its future earnings potential. If the company grows and becomes more valuable, the price of your share reflects that growth. If it struggles, the price drops accordingly.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        This is an important distinction because it changes how you think about buying and selling. You are not gambling on random price movements. You are making a judgment about whether a business is likely to be worth more tomorrow than it is today. That judgment can be informed by fundamentals, earnings reports, revenue growth, competitive positioning, or by technical analysis, which is what we focus on at Trader Foundation.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">Key Stock Concepts</h3>
      <ul className="space-y-4 mb-6 text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        <li><strong>Market Capitalization:</strong> The total value of a company's outstanding shares. Large-cap stocks (over $10B) tend to be more stable; small-caps offer higher growth potential with more volatility.</li>
        <li><strong>Earnings Per Share (EPS):</strong> A company's profit divided by its number of shares. Rising EPS over time is one signal that a business is growing profitably.</li>
        <li><strong>Dividends:</strong> Cash payments some companies distribute to shareholders from their profits. Dividend-paying stocks can provide income while you hold them.</li>
        <li><strong>Volume:</strong> The number of shares traded in a given period. High volume often confirms the strength of a price move, which is why it is one of the first things we check.</li>
      </ul>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        You do not need to memorize every financial metric to start investing in stocks. But understanding that each share represents a real piece of a real business keeps you grounded, especially when the market gets volatile and emotions start running the show.
      </p>
    </>
  );
}

function ChapterMag7() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Most investors hear the word "bear market" and immediately think about protecting what they have. They sell, they panic, they sit on the sidelines waiting for things to "calm down." But some of the greatest wealth in market history has been built by doing the exact opposite, <strong>buying when everyone else is afraid</strong>.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        At Trader Foundation, our coach <strong>Erin</strong> specializes in exactly this. Her focus is on the <strong>Magnificent 7</strong>, Apple, Microsoft, Alphabet, Amazon, Nvidia, Meta, and Tesla, the companies that dominate the global economy and consistently recover stronger after every downturn. Erin's philosophy is straightforward: when fear drives these stocks to irrational lows, that is not a signal to run. It is an opportunity to accumulate shares of the most powerful businesses on the planet at a discount.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">"Buy Fear, Sell Greed"</h3>
      <p className="text-[0.92rem] text-[#767269] mb-5 italic">Coach Erin's approach to Mag 7 investing during market downturns</p>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        <strong>Bear markets are temporary, the Mag 7 are not.</strong> Every bear market in history has eventually ended. But companies like Apple and Microsoft have not only survived every downturn, they have come out the other side larger, more profitable, and more dominant. Buying during fear means acquiring those businesses while they are cheap. Whether a recovery follows, and when, is not something history promises anyone.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        <strong>Fear creates the best prices.</strong> When the market drops 20%, 30%, or more, the Mag 7 often get dragged down with everything else, even when their fundamentals remain strong. That gap between price and sentiment is where Erin teaches students to look. The business has not changed in the week the share price fell; the mood around it has.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        <strong>Discipline over emotion.</strong> Buying fear sounds simple in theory. In practice, it requires the discipline to act when every headline is screaming "sell." Erin works with students to build a systematic approach, identifying key support levels, dollar-cost averaging into positions during drawdowns, and maintaining conviction based on fundamentals rather than sentiment.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        <strong>Years, not weeks.</strong> This is not about timing the bottom, which nobody does reliably. It is about being willing to buy a business you already wanted to own on the day it is least comfortable to buy it. Erin works with students on holding that view for years rather than weeks.
      </p>

      <div className="border-t-2 border-b border-[#1a1a1a] border-b-[#e3ded4] py-7 my-8">
        <h3 className="text-[1.125rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mb-3">
          Two things at once
        </h3>
        <p className="text-[1rem] leading-[1.75] text-[#55534e] max-w-[64ch] mb-3">
          Erin does not treat trading and long-term holding as competing choices. The active
          account and the long-term core do different jobs, and she runs both. What comes out of
          the active account is not a salary and is not treated as one.
        </p>
        <p className="text-[1rem] leading-[1.75] text-[#55534e] max-w-[64ch] mb-0">
          That is what she teaches: the active side is a skill you practise, the long-term side
          is where time does the work, and neither one substitutes for the other.
        </p>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        The Magnificent 7 represent roughly 30% of the entire S&P 500's market capitalization. When you learn to strategically accumulate these stocks during periods of fear, you are not just buying a dip, you are positioning yourself in the companies that shape the global economy. That is the kind of conviction-based investing Erin brings to every student she works with.
      </p>
    </>
  );
}

function ChapterIndexFunds() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Not everyone wants to, or should, pick individual stocks. That is where index funds come in. An index fund is a collection of stocks designed to mirror the performance of a specific market benchmark. The most well-known example is the S&P 500 index, which tracks the 500 largest publicly traded companies in the United States.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        When you buy shares of an S&P 500 index fund, you are effectively buying a tiny slice of all 500 companies at once, Apple, Microsoft, Johnson & Johnson, JPMorgan, and hundreds more. If the overall market goes up, your investment goes up. You do not need to research individual companies or worry about one bad earnings report tanking your portfolio.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        <strong>Why this matters:</strong> Over long periods, broad US equity indices have outpaced
        inflation, with real losses along the way and no guarantee of repeating it. The point is
        not a number. It is that holding the whole market asks almost nothing of you, which is
        exactly why it belongs underneath anything more active.{' '}
        <a href="/calculator" className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]">Run your own assumptions through the calculator</a>
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Their main structural advantage is cost. Because they track an index instead of paying a team to pick stocks, their expense ratios sit far below those of actively managed funds. Fees are one of the few things in this whole business you can know in advance and control.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">Popular Index Benchmarks</h3>
      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#3a3834] list-decimal list-inside">
        <li><strong>S&P 500:</strong> Tracks the 500 largest U.S. companies by market cap. The most widely followed benchmark for overall U.S. stock market performance.</li>
        <li><strong>Nasdaq Composite:</strong> Heavily weighted toward technology and growth companies, and more volatile than the S&P 500 in both directions.</li>
        <li><strong>Dow Jones Industrial Average:</strong> Tracks 30 blue-chip U.S. companies. The oldest major index, though its small size makes it less representative of the broader market.</li>
        <li><strong>Russell 2000:</strong> Focuses on 2,000 smaller U.S. companies. Useful for exposure to small-cap growth but comes with higher volatility.</li>
      </ol>
    </>
  );
}

function ChapterETFvsMutual() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Both ETFs and mutual funds let you invest in a basket of securities with a single purchase. They sound similar, and in many ways they are. But the differences matter depending on how you plan to invest.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto my-8">
        <table className="w-full text-[0.9375rem] border-collapse">
          <thead>
            <tr className="bg-[#141414] text-white">
              <th className="text-left p-4 font-semibold border border-[#2c2c2c]">Feature</th>
              <th className="text-left p-4 font-bold border border-[#e5e5e5]">ETFs</th>
              <th className="text-left p-4 font-bold border border-[#e5e5e5]">Mutual Funds</th>
            </tr>
          </thead>
          <tbody className="text-[#3a3834]">
            {[
              ['Trading', 'Trades throughout the day like a stock', 'Priced once at market close'],
              ['Minimum Investment', 'Price of one share (often $50–$500)', 'Often $1,000–$3,000 minimum'],
              ['Expense Ratios', 'Typically 0.03%–0.20%', 'Ranges from 0.10% to 1.00%+'],
              ['Tax Efficiency', 'Generally more tax-efficient', 'Can trigger capital gains distributions'],
              ['Automatic Investing', 'Requires manual purchases', 'Straightforward to set up automatic contributions'],
              ['Best for', 'Investors who want control over cost and timing', 'Steady automatic contributions inside a retirement plan'],
            ].map(([feature, etf, mutual], i) => (
              <tr key={i} className="border-b border-[#ece8e0]">
                <td className="p-4 font-semibold text-[#1a1a1a] align-top">{feature}</td>
                <td className="p-4 text-[#55534e] align-top">{etf}</td>
                <td className="p-4 text-[#55534e] align-top">{mutual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        For most of our students at Trader Foundation, ETFs are the preferred vehicle for long-term index investing. They offer lower costs, intraday trading flexibility, and better tax treatment in taxable accounts. Mutual funds still have their place, particularly inside employer-sponsored retirement plans like a 401(k) where ETFs may not be available.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        The vehicle matters less than the habit. Whichever you hold, what does the work is contributing to a diversified index and then leaving it alone.
      </p>
    </>
  );
}

function ChapterSwingTrading() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Holding an index and leaving it alone is the quiet half of this. The other half is what you do with capital you want to manage yourself, on a timeframe shorter than decades, without sitting in front of six screens.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        The positions we teach are held for days to weeks, not minutes. You are not placing dozens of trades a day or reacting to every five-minute candle. You find a setup, decide your risk before you enter, place it, and let it develop. Most of our students manage this in about <strong>ten minutes a day</strong>.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">Why this timeframe fits a career</h3>
      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#3a3834] list-decimal list-inside">
        <li><strong>Time-efficient:</strong> You scan for setups after market hours, place your orders, and go about your day. No need to watch charts during work.</li>
        <li><strong>Defined risk on every trade:</strong> Each position has a predetermined stop loss and profit target before you enter. You know your maximum downside before you commit a dollar.</li>
        <li><strong>It sits alongside the long-term core:</strong> Most of our students keep a core portfolio in index funds and run a separate account for the active side, so the two never compete for the same capital.</li>
        <li><strong>It is a skill, not a tip:</strong> A tip is used once. Reading a chart and sizing a position are things you get better at, and they stay yours.</li>
      </ol>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        Holding the index and managing an active account are two different jobs. The core is
        there to track the market with almost no attention from you. The active account is where
        you apply a rules-based method deliberately, accepting that it can lose. Neither replaces
        the other.{' '}
        <a href="/results" className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]">The results we publish</a>
      </p>
    </>
  );
}

function ChapterReadingCharts() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Charts can look intimidating at first, a mess of candles, lines, and indicators. But at its core, a stock chart is simply a visual history of price and volume over time. Learning to read one is like learning to read a map: once you understand the legend, the terrain starts making sense.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Here are the foundational elements our students learn in the Trader Foundation curriculum:
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">Core Chart Concepts</h3>
      <ul className="space-y-4 mb-6 text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        <li><strong>Candlestick Patterns:</strong> Each candle shows four data points: open, high, low, and close for a given time period. Green (or white) candles mean the price closed higher than it opened; red (or black) candles mean it closed lower. Patterns formed by groups of candles can signal potential reversals or continuations.</li>
        <li><strong>Support & Resistance:</strong> Support is a price level where buying interest has historically been strong enough to prevent further decline. Resistance is where selling pressure has capped upward movement. These levels act as decision zones, and they are central to how we choose where to draw a line below a stock.</li>
        <li><strong>Moving Averages:</strong> A moving average smooths out price data to show the overall trend direction. The 50-day and 200-day moving averages are the most widely watched. When a shorter moving average crosses above a longer one, it is often interpreted as a bullish signal, and vice versa.</li>
        <li><strong>Volume Confirmation:</strong> Price movement without volume is like a rumor without evidence. When a stock breaks above resistance on heavy volume, it carries more conviction than the same move on thin volume. We teach our students to always check volume before committing to a trade.</li>
        <li><strong>Relative Strength:</strong> How is a stock performing compared to the broader market? A stock that holds up well during a market pullback, or leads during a rally, shows relative strength. It is one of the filters in the method we teach.</li>
      </ul>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        You do not need to master every indicator on day one. Our program introduces these concepts gradually, with real chart examples and guided practice through our <strong>Time Machine review process</strong>, where you analyze historical setups before risking real capital. By the time you place your first live trade, you will have read a great many charts with someone watching over your shoulder.
      </p>
    </>
  );
}

function ChapterTwoPillar() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        There is a distinction worth being precise about: <strong>the active account and the long-term core do different jobs.</strong> Most people run one and ignore the other.
      </p>

      <div className="border-t-2 border-b border-[#1a1a1a] border-b-[#e3ded4] py-7 my-8">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
              The active account
            </dt>
            <dd className="text-[#55534e] text-[0.9375rem] leading-[1.7] mt-2 mb-0">
              Capital you manage yourself, on a timeframe of days to weeks, under a written set
              of rules. It is a skill you practise, and it can lose money in any given month.
              Nothing about it is a wage.
            </dd>
          </div>
          <div>
            <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
              The long-term core
            </dt>
            <dd className="text-[#55534e] text-[0.9375rem] leading-[1.7] mt-2 mb-0">
              Broad holdings you are not trading, left alone for years so that time and
              compounding do the work. It asks almost nothing of you, which is the whole point of
              it.
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Run only the active account and you are always working for it. Hold only the core and the only lever you have is how much you can put in. <strong>Most of our students end up running both, deliberately, with different money in each.</strong>
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        It is the frame every student here is taught to think in, and the reason the first conversation with your coach is about which money goes where before it is about any trade.
      </p>
    </>
  );
}

function ChapterBuildingPortfolio() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        All of the above is just information until it is arranged into something you will actually follow. Here is how our students usually structure it:
      </p>

      <ol className="space-y-3 mb-6 text-[1.02rem] leading-[1.8] text-[#3a3834] list-decimal list-inside">
        <li><strong>Set the core first:</strong> A portion of your capital in broad market index funds, whether that is the S&P 500, a total market fund, or a target-date fund. This is the part you do not touch.</li>
        <li><strong>Keep the active account separate:</strong> A brokerage account of its own, funded with capital you have already built and whose loss would not change your plans. The method calls for enough room to size positions properly, which is something your coach will work through with you against your own numbers.</li>
        <li><strong>Decide the rules before the trade:</strong> Entry criteria, where you are wrong, and where you are done, all written down before you click. We teach one specific method so that nothing is left to the moment.</li>
        <li><strong>Track everything:</strong> Keep a trading journal. Record why you entered, where your stop was, what happened, and what you learned. The students who improve fastest are the ones who review their trades honestly, often with their 1-on-1 coach.</li>
        <li><strong>Move money deliberately:</strong> When the active account grows, decide on a schedule whether some of it belongs in the long-term core. Letting an active account grow unchecked is how position sizes drift.</li>
      </ol>

      <div className="border-t-2 border-[#1a1a1a] pt-6 my-8">
        <p className="text-[1rem] leading-[1.75] text-[#55534e] max-w-[64ch] mb-0">
          <strong className="text-[#1a1a1a]">You are not working this out alone.</strong> Every
          student gets their own coach, who goes through how the accounts are structured, reads
          the setups you are considering, and tells you when your sizing has drifted.{' '}
          <a
            href="/results"
            className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
          >
            The results we publish
          </a>
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
  return (
    <ChapterLayout
      title={'Stocks & Index Funds'}
      heading={'Stocks & Index Funds'}
      deck={'How shares and index funds actually work, how to read a chart without guessing, and how a long-term core and an active account sit alongside each other.'}
      description={'How stocks and index funds work, how to read a chart without guesswork, and how a long-term core portfolio and an active account sit side by side.'}
      path={'/stocks-and-index'}
      chapters={CHAPTERS}
      content={CHAPTER_CONTENT}
    />
  );
}
