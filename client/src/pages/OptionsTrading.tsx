import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import ChapterLayout, { type Chapter } from '@/components/ChapterLayout';

/* Chapter data. Labels double as the contents list and each chapter's h2. */
const CHAPTERS: Chapter[] = [
  { id: 'what-are-options', label: 'What Are Options and Why Should You Care' },
  { id: 'calls-vs-puts', label: 'Calls vs. Puts: The Two Building Blocks' },
  { id: 'why-options-matter', label: 'What Options Let You Do That Shares Do Not' },
  { id: 'safe-strategies', label: 'Defined-Risk Option Selling' },
  { id: 'reading-the-chain', label: 'How to Read an Options Chain' },
  { id: 'risk-management', label: 'Risk Management: Protecting Your Capital' },
  { id: 'psychology', label: 'The Mental Game Most Traders Lose' },
  { id: 'getting-started', label: 'Your First 30 Days' },
];

/* ── Chapter Content Components ── */
function ChapterWhatAreOptions() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        An option is a contract. That is all it is. It gives you the right, but not the obligation, to buy or sell a stock at a specific price before a specific date. You are not buying the stock itself. You are buying the <em>opportunity</em> to act on it.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Think of it like putting a deposit on a house. You pay a small amount to lock in the purchase price for a set period. If the market moves in your favor, you exercise that right and profit from the difference. If it does not, you walk away and your loss is limited to the deposit you paid. That deposit is called the <strong>premium</strong>.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Options exist on virtually every major stock and index. They were originally created as hedging instruments, tools for large institutions to protect their portfolios against sudden drops. Individual traders later took them up for other reasons: to be paid for taking on a defined obligation, to control a larger position with less capital, and to cap a loss at a number known in advance.
      </p>

      <div className="bg-[#141414] p-8 my-10">
        <h3 className="text-[1.125rem] font-semibold text-white tracking-[-0.015em] mb-6">
          Options vs. Stocks at a Glance:
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 text-[#c7ab77] font-semibold">Factor</th>
                <th className="text-left py-3 pr-4 text-white/70 font-semibold">Stocks</th>
                <th className="text-left py-3 text-white/70 font-semibold">Options</th>
              </tr>
            </thead>
            <tbody className="text-white/60">
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">Capital Required</td>
                <td className="py-3 pr-4">Full share price</td>
                <td className="py-3">Fraction of share price</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">Max Loss</td>
                <td className="py-3 pr-4">Entire investment</td>
                <td className="py-3">Premium paid (when buying)</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">Leverage</td>
                <td className="py-3 pr-4">1:1</td>
                <td className="py-3">Each contract controls 100 shares</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">Time Sensitivity</td>
                <td className="py-3 pr-4">None, hold indefinitely</td>
                <td className="py-3">Contracts expire on a set date</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/80 font-medium">Income Generation</td>
                <td className="py-3 pr-4">Dividends only</td>
                <td className="py-3">Premiums from selling contracts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        The reason options matter for busy professionals is simple: they let you do more with less. A stock that costs $150 per share might require $15,000 to buy 100 shares. An options contract on that same stock might cost $300 to $500, and if the stock moves in your direction, the percentage return on that contract can be many times greater than owning the shares outright. That is the power of <strong>leverage with defined risk</strong>.
      </p>
    </>
  );
}

function ChapterCallsVsPuts() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Every option falls into one of two categories. Understanding the difference between them is the single most important concept you will learn on this page.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-emerald-50 border border-emerald-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-800">Call Options</h3>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-emerald-900/70 mb-3">
            A call gives you the right to <strong>buy</strong> a stock at a set price (the strike price) before the contract expires. You buy a call when you believe the stock will go <strong>up</strong>.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-emerald-900/70">
            <strong>Example:</strong> A stock trades at $100. You buy a $105 call for $2.50 per share ($250 total). If the stock rises to $115, your contract is worth at least $10 per share ($1,000). Your profit: $750 on a $250 investment, a 300% return. If the stock stays below $105, you lose the $250 premium. That is your maximum risk.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-red-600 rotate-180" />
            </div>
            <h3 className="text-lg font-bold text-red-800">Put Options</h3>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-red-900/70 mb-3">
            A put gives you the right to <strong>sell</strong> a stock at a set price before expiration. You buy a put when you believe the stock will go <strong>down</strong>, or when you want to protect shares you already own.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-red-900/70">
            <strong>Example:</strong> You own 100 shares of a stock at $100. You buy a $95 put for $1.50 ($150 total). If the stock drops to $80, your put lets you sell at $95, saving you $1,500 in losses for a $150 insurance cost. Puts are the seatbelt of your portfolio.
          </p>
        </div>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        At Trader Foundation, we use both calls and puts depending on market conditions. The setups we teach typically play out over days to weeks. When we spot a bullish setup, we buy calls. When the market shows weakness or we want to protect gains, we use puts. The key difference from gambling is that every position has a <strong>defined entry, a defined exit, and a defined maximum loss</strong> before the trade is placed.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        One detail that is routinely missed: we use <strong>longer expiration dates</strong>, typically 30 to 60 days out. This gives the trade room to develop. Cheap weekly options are tempting because they cost less, but they decay rapidly and leave almost no margin for error. Buying time is buying safety.
      </p>
    </>
  );
}

function ChapterWhyOptionsMatter() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        If stocks are the highway, options are the express lane. They are not inherently risky, they are inherently <em>efficient</em>. The risk comes from how people use them, not from the instrument itself. A kitchen knife is dangerous in the wrong hands and indispensable in the right ones. Options work the same way.
      </p>

      <h3 className="text-xl font-bold text-[#1a1a1a] mt-8 mb-4">
        The Leverage Advantage
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        The structural difference is that one contract represents a hundred shares. The same capital therefore controls a far larger position than buying the shares outright would, which cuts both ways: the move you wanted is amplified, and so is the move you did not. How far in either direction depends entirely on the strike and expiration you chose, which is why that choice gets a disproportionate amount of attention in the curriculum.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        None of that is clever; it is arithmetic. The real trade-off is time. Options expire and shares do not, so an option can be right about the company and still be worth nothing by the date on the contract. Choosing the expiration is a skill we work on with every student from the first week.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-4 pt-5 border-t border-[#e3ded4]">
        Being paid without owning the shares
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Most people think of options as something you buy. You can also <strong>sell</strong> them, and that is the side we teach. When you sell a contract you are paid the premium up front. If the stock stays where your position needs it to stay, you keep that premium; if it does not, the position loses, up to a cap you set before you placed it. Credit spreads are built on this, and they are the whole of what we teach, in the strategy we call the Paycheck Collector.
      </p>

      <div className="border-t-2 border-b border-[#1a1a1a] border-b-[#e3ded4] py-7 my-8">
        <p className="text-[1rem] leading-[1.75] text-[#55534e] max-w-[64ch] mb-0">
          <strong className="text-[#1a1a1a]">The two-pillar frame.</strong> The active account
          and the long-term core do different jobs, and options are where they meet: the same
          instrument can be sold against a position you hold or used to put a floor under one.
          Neither pillar is a wage, and we are careful not to describe them as one.{' '}
          <a href="/stocks-and-index" className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]">
            More on the two-pillar frame
          </a>
        </p>
      </div>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-4 pt-5 border-t border-[#e3ded4]">
        Knowing your worst case before you enter
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        When you buy an option, the most you can lose is the premium you paid. Period. There is no margin call, no surprise debt, no waking up to find your account negative. Compare that to shorting a stock, where losses are theoretically unlimited, or even holding shares through a 40% crash. Options let you participate in the market's upside while placing a hard floor under your downside. That is not gambling, that is <strong>risk engineering</strong>.
      </p>
    </>
  );
}

function ChapterSafeStrategies() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Most content about options focuses on high-risk, high-reward plays: buying cheap contracts that expire worthless most of the time. We take the opposite approach. We do not call our strategies safe, because no strategy is. We call them <strong>defined risk</strong>, which means something precise: you know the most a trade can cost you before you place it.
      </p>

      <div className="space-y-6 my-8">
        <div className="border-t border-[#1a1a1a] pt-5">
          <h4 className="text-[1.125rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mb-3">
            The Paycheck Collector, Getting Paid to Wait
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#55534e] mb-3">
            You pick a stock and draw a line well below where it trades today, then sell a spread against that line. The premium lands in your account the moment you place the trade. If the stock stays above your line, you keep it.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-[#55534e] mb-3">
            It works the way insurance does. The insurer is paid up front and stays safe by being picky about who it covers. You are picky about where the line sits: the farther below the stock, the better the odds and the smaller the premium, and that trade-off is a deliberate choice.
          </p>
          <div className="border-t border-[#e3ded4] pt-5 mt-5">
            <h5 className="text-[1rem] font-semibold text-[#1a1a1a] tracking-[-0.01em] mb-2">Where we take it further: charting the line</h5>
            <p className="text-[0.9375rem] leading-[1.65] text-[#55534e]">
              Most programs teach premium selling as a mechanical exercise: pick a delta, sell the spread, repeat. At Trader Foundation we layer <strong>technical analysis and charting</strong> into the decision. Before selling anything, our coaches teach you to read the chart: identify support and resistance, analyze the trend, and evaluate where the stock sits in its range. You are not blindly picking a strike, you are putting your line where the chart says the stock is likely to hold. The spread is kept narrow, and positions are staged so one opens at a time rather than committing the whole account at once.
            </p>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-5">
          <h4 className="text-[1.125rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mb-3">
            Credit Spreads, Paid Up Front with Protection Built In
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#55534e] mb-3">
            A credit spread involves selling one option and buying another at a different strike price. The premium you collect from the sold option is greater than the cost of the bought option, so you receive a net credit. Your maximum loss is the difference between the two strikes minus the credit received.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-[#55534e]">
            This is the strategy our students use most, because it requires far less capital than owning the shares outright, defines your maximum risk upfront, and profits when the stock stays within a predictable range. You do not need the stock to make a big move, you just need it to <em>not</em> move against you past your short strike.
          </p>
        </div>

        <div className="border-t border-[#1a1a1a] pt-5">
          <h4 className="text-[1.125rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mb-3">
            Protective Puts, Insurance for Your Portfolio
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#55534e]">
            If you hold a stock position and want to guard against a sudden drop, buying a put option acts as an insurance policy. You pay a small premium, and if the stock falls below your strike price, the put increases in value to offset your losses. This is how institutional investors protect billion-dollar portfolios, and you can use the exact same tool on a personal account.
          </p>
        </div>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        Notice the pattern: every strategy above has a <strong>defined maximum loss</strong>. There are no open-ended risks, no hoping and praying. Each trade is structured before you enter it, with a clear plan for what happens if the market moves against you. That is what defined risk means, and it is the honest version of the claim: not that you cannot lose, but that you know exactly how much you can lose before you commit a single dollar.
      </p>
    </>
  );
}

function ChapterReadingTheChain() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        An options chain is the menu of available contracts for a given stock. When you first look at one, it can feel like staring at a spreadsheet written in a foreign language. Rows of numbers, Greek letters, and abbreviations that seem designed to confuse. But once you understand the five key columns, the entire chain becomes readable in seconds.
      </p>

      <div className="bg-[#141414] p-8 my-10">
        <h3 className="text-[1.125rem] font-semibold text-white tracking-[-0.015em] mb-6">
          The Five Columns That Matter:
        </h3>
        <div className="space-y-5">
          {[
            { term: 'Strike Price', desc: 'The price at which you can buy (call) or sell (put) the underlying stock. Strikes are listed in increments, $1, $2.50, or $5 apart depending on the stock price.' },
            { term: 'Expiration Date', desc: 'When the contract expires. We typically look at options 30 to 60 days out. Shorter expirations decay faster; longer ones cost more but give your trade room to breathe.' },
            { term: 'Bid / Ask', desc: 'The bid is what buyers will pay. The ask is what sellers want. The difference (the spread) is your transaction cost. Tighter spreads mean more liquid options, always prefer these.' },
            { term: 'Volume & Open Interest', desc: 'Volume shows how many contracts traded today. Open interest shows total outstanding contracts. Higher numbers mean better liquidity and tighter spreads. Avoid contracts with open interest below 100.' },
            { term: 'Implied Volatility (IV)', desc: 'A measure of how much the market expects the stock to move. Higher IV means more expensive premiums. We use IV to time entries, buying when IV is relatively low and selling when it is elevated.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-[#c7ab77] font-bold text-[0.85rem] shrink-0 w-6 text-right">{i + 1}.</span>
              <div>
                <p className="text-white font-semibold text-[0.95rem] mb-1">{item.term}</p>
                <p className="text-white/60 text-[0.88rem] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#1a1a1a] mt-8 mb-4">
        In the Money, At the Money, Out of the Money
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        These three terms describe where the strike price sits relative to the current stock price. For a call option: if the stock trades at $100 and your strike is $95, you are <strong>in the money (ITM)</strong>, the option already has intrinsic value. If your strike is $100, you are <strong>at the money (ATM)</strong>. If your strike is $105, you are <strong>out of the money (OTM)</strong>, the stock needs to rise for your option to gain intrinsic value.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        At Trader Foundation, your coach will walk you through exactly which strike and expiration to select based on the specific setup. This is not a one-size-fits-all formula, it depends on the stock, the volatility environment, and your account size. That is why 1-on-1 coaching matters. A YouTube video cannot adjust its advice to your situation. Your coach can.{' '}
        <a href="/trading-tools" className="text-[#c7ab77] font-semibold hover:underline">See how our Trading Tools chapter covers options chains in more detail →</a>
      </p>
    </>
  );
}

function ChapterRiskManagement() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Risk management is not a chapter you read once and forget. It is the operating system that runs underneath every single trade you place. The best setup in the world means nothing if you size the position wrong, ignore your stop, or let a small loss turn into a catastrophic one.
      </p>

      <h3 className="text-xl font-bold text-[#1a1a1a] mt-8 mb-4">
        Position Sizing: The Rule That Saves Accounts
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Never risk more than you can afford to lose on a single trade. That sounds obvious, but the temptation to "go big" on a high-conviction setup has wiped out more accounts than bad analysis ever has. At Trader Foundation, we teach a tiered approach to position sizing based on your total account value. Smaller accounts allocate a higher percentage per trade to generate meaningful returns, while larger accounts reduce that percentage to prioritize capital preservation.
      </p>

      <div className="bg-[#141414] p-8 my-10">
        <h3 className="text-[1.125rem] font-semibold text-white tracking-[-0.015em] mb-6">
          Position Sizing Guidelines:
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 text-[#c7ab77] font-semibold">Account Size</th>
                <th className="text-left py-3 pr-4 text-white/70 font-semibold">Max Per Trade</th>
                <th className="text-left py-3 text-white/70 font-semibold">Rationale</th>
              </tr>
            </thead>
            <tbody className="text-white/60">
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">$5,000</td>
                <td className="py-3 pr-4">Up to 50%</td>
                <td className="py-3">Smaller accounts need concentration to generate meaningful dollar returns</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">$10,000</td>
                <td className="py-3 pr-4">Up to 30%</td>
                <td className="py-3">Enough capital to start diversifying across 3-4 positions</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">$20,000</td>
                <td className="py-3 pr-4">Up to 25%</td>
                <td className="py-3">Balanced between growth and protection</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 pr-4 text-white/80 font-medium">$30,000</td>
                <td className="py-3 pr-4">Up to 20%</td>
                <td className="py-3">Preservation becomes increasingly important</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-white/80 font-medium">$50,000+</td>
                <td className="py-3 pr-4">10% or less</td>
                <td className="py-3">Capital protection is the priority, no single trade should threaten the account</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#1a1a1a] mt-8 mb-4">
        The Exit Plan: Decided Before You Enter
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Every trade at Trader Foundation has three numbers defined before the order is placed: the entry price, the profit target, and the stop loss. If the trade hits your target, you take the profit. If it hits your stop, you take the loss. There is no negotiating with the market, no "let me hold a little longer," no hoping it comes back. The plan is the plan.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        Your coach reviews every trade plan with you, not after the fact, but before you place it. That loop is the difference between our students and self-taught traders, who tend to build habits in isolation and keep them. When someone is watching, you follow the rules. When you follow the rules, you protect your capital. When you protect your capital, you stay in the game long enough for compounding to work. <a href="/calculator" className="text-[#c7ab77] font-semibold hover:underline">See how compounding transforms your trading income over time →</a>
      </p>
    </>
  );
}

function ChapterPsychology() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        You can have the best strategy, the best tools, and the best coach, and still lose money if your emotions are running the show. Trading psychology is not a soft skill. It is the hardest part of this entire discipline, and it is the reason most self-taught traders eventually quit.
      </p>

      <h3 className="text-xl font-bold text-[#1a1a1a] mt-8 mb-4">
        Fear and Greed: The Two Forces That Destroy Accounts
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Fear makes you exit winning trades too early and avoid perfectly good setups because the last trade was a loss. Greed makes you hold losing trades too long, add to positions that are going against you, and risk more than your plan allows because "this one is a sure thing." Neither emotion has a place in your trading process.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        The antidote is not willpower, it is <strong>process</strong>. When your entry, exit, and position size are predetermined, there is nothing left for emotion to influence. You are executing a plan, not making decisions in the heat of the moment. That is why we insist on trade plans being written down and reviewed by your coach before execution.
      </p>

      <div className="space-y-4 my-8">
        {[
          { trap: 'Revenge trading after a loss', solution: 'Step away for 24 hours. Review the loss with your coach. The market will be there tomorrow.' },
          { trap: 'Moving your stop loss to avoid taking a loss', solution: 'If the trade hit your stop, the setup was wrong. Accept it. A small loss is a business expense, not a personal failure.' },
          { trap: 'Overtrading because you feel like you should "be doing something"', solution: 'The best traders spend most of their time waiting. If there is no setup that meets your criteria, the correct trade is no trade.' },
          { trap: 'Comparing your results to others in the community', solution: 'Everyone has a different account size, risk tolerance, and timeline. Focus on your own process and your own progress.' },
        ].map((item, i) => (
          <div key={i} className="border-t border-[#1a1a1a] pt-5">
            <p className="font-semibold text-[#1a1a1a] text-[0.95rem] mb-2 flex items-start gap-2">
              <span className="text-red-400 shrink-0">✕</span>
              {item.trap}
            </p>
            <p className="text-[#55534e] text-[0.9rem] leading-relaxed mb-0 ml-6">
              <span className="text-emerald-600 font-semibold">Instead:</span> {item.solution}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        The reason 1-on-1 coaching works so well for psychology is accountability. When you know your coach will see every trade, you think twice before making an impulsive decision. Over time, that external accountability becomes internal discipline, and that is when trading stops being stressful and starts being systematic.
      </p>
    </>
  );
}

function ChapterGettingStarted() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Reading about options is useful. Practicing them is essential. The gap between understanding something and doing it under pressure is where this gets difficult, and it is the gap the program exists to close. Here is what your first 30 days look like when you join Trader Foundation.
      </p>

      <div className="bg-[#141414] p-8 my-10">
        <h3 className="text-[1.125rem] font-semibold text-white tracking-[-0.015em] mb-6">
          Your First 30 Days:
        </h3>
        <div className="space-y-6">
          {[
            { week: 'Week 1', title: 'Foundation & Setup', desc: 'Meet your personal coach. Set up your brokerage account. Learn to read a chart and recognise the setups the method uses. Begin paper trading with the Time Machine, our structured practice system that uses real historical data.' },
            { week: 'Week 2', title: 'Options Fundamentals', desc: 'Understand calls, puts, strike selection, and expiration timing. Practice reading options chains. Submit your first paper trade plans to your coach for review. Learn position sizing based on your account.' },
            { week: 'Week 3', title: 'Strategy Application', desc: 'Apply the Paycheck Collector in paper trading. Review your trade journal with your coach. Identify patterns in your decision-making. Begin to develop your personal trading rules.' },
            { week: 'Week 4', title: 'Transition to Live Trading', desc: 'With your coach\'s approval, place your first live trade with real capital, small position, defined risk, full trade plan reviewed beforehand. Continue daily practice with the Time Machine alongside live positions.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-[#c7ab77]/10 flex flex-col items-center justify-center">
                  <span className="text-[0.65rem] text-[#c7ab77]/60 uppercase tracking-wider font-medium">{item.week.split(' ')[0]}</span>
                  <span className="text-xl font-bold text-[#c7ab77]">{item.week.split(' ')[1]}</span>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-[0.95rem] mb-1">{item.title}</p>
                <p className="text-white/60 text-[0.88rem] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Notice that live trading does not begin until week four, and only with your coach's sign-off. We are not in a rush to get you placing trades. We are in a rush to get you placing <em>good</em> trades. The Time Machine practice system lets you analyze hundreds of historical setups before risking real money, building the pattern recognition and the discipline to pass on a trade that does not qualify.
      </p>

      <div className="border-t-2 border-[#1a1a1a] pt-6 my-8">
        <p className="text-[1rem] leading-[1.75] text-[#55534e] max-w-[64ch] mb-0">
          <strong className="text-[#1a1a1a]">If you want to see it.</strong> The live session
          walks through the method as it is actually taught: how a setup is found, where the line
          gets drawn, and how the protection is built into the trade. Pay nothing to attend.
        </p>
      </div>

      <div className="text-center mt-8">
        <a
          href="https://live.traderfoundation.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#c7ab77] text-[#1a1a1a] font-semibold text-[0.9375rem] transition-colors duration-200 hover:bg-[#b89a66]"
         
        >
          See the method taught live
          <ArrowRight size={18} />
        </a>
      </div>
    </>
  );
}

/* Map chapter IDs to their content components */
const CHAPTER_CONTENT: Record<string, React.FC> = {
  'what-are-options': ChapterWhatAreOptions,
  'calls-vs-puts': ChapterCallsVsPuts,
  'why-options-matter': ChapterWhyOptionsMatter,
  'safe-strategies': ChapterSafeStrategies,
  'reading-the-chain': ChapterReadingTheChain,
  'risk-management': ChapterRiskManagement,
  'psychology': ChapterPsychology,
  'getting-started': ChapterGettingStarted,
};

export default function OptionsTrading() {
  return (
    <ChapterLayout
      title={'Options Trading'}
      heading={'Options Trading'}
      deck={'What an option actually is, how calls and puts work, and how defined-risk selling lets you know your worst case before you place the trade.'}
      description={'What an option is, how calls and puts work, and how defined-risk option selling lets you know your worst case before you place the trade.'}
      path={'/options-trading'}
      chapters={CHAPTERS}
      content={CHAPTER_CONTENT}
    />
  );
}
