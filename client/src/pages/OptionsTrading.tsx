/**
 * Options Trading Page - Trader Foundation
 * Chapter-based navigation: TOC on left, selected chapter content on right
 * Design: GOAT Academy style - clean, editorial, three-column layout
 * Content: 100% original - focused on Trader Foundation's safe options approach
 */

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, ChevronRight, Shield, BookOpen, BarChart3, Target, Zap, Scale, Brain, TrendingUp } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Chapter data ── */
const CHAPTERS = [
  {
    id: 'what-are-options',
    label: 'What Are Options and Why Should You Care',
    icon: BookOpen,
  },
  {
    id: 'calls-vs-puts',
    label: 'Calls vs. Puts: The Two Building Blocks',
    icon: Scale,
  },
  {
    id: 'why-options-matter',
    label: 'Why Options Give You an Unfair Advantage',
    icon: Zap,
  },
  {
    id: 'safe-strategies',
    label: 'Safe Options Strategies for Steady Income',
    icon: Shield,
  },
  {
    id: 'reading-the-chain',
    label: 'How to Read an Options Chain Like a Pro',
    icon: BarChart3,
  },
  {
    id: 'risk-management',
    label: 'Risk Management: Protecting Your Capital',
    icon: Target,
  },
  {
    id: 'psychology',
    label: 'The Mental Game Most Traders Lose',
    icon: Brain,
  },
  {
    id: 'getting-started',
    label: 'Your First 30 Days with Options',
    icon: TrendingUp,
  },
];

/* ── Chapter Content Components ── */
function ChapterWhatAreOptions() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        An option is a contract. That is all it is. It gives you the right, but not the obligation, to buy or sell a stock at a specific price before a specific date. You are not buying the stock itself. You are buying the <em>opportunity</em> to act on it.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Think of it like putting a deposit on a house. You pay a small amount to lock in the purchase price for a set period. If the market moves in your favor, you exercise that right and profit from the difference. If it does not, you walk away and your loss is limited to the deposit you paid. That deposit is called the <strong>premium</strong>.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Options exist on virtually every major stock and index. They were originally created as hedging instruments, tools for large institutions to protect their portfolios against sudden drops. Over time, individual traders discovered that options could also be used to generate consistent income, amplify returns on smaller accounts, and define risk with precision.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
          Options vs. Stocks at a Glance:
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 text-[#c7ab77] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Factor</th>
                <th className="text-left py-3 pr-4 text-white/70 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Stocks</th>
                <th className="text-left py-3 text-white/70 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Options</th>
              </tr>
            </thead>
            <tbody className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The reason options matter for busy professionals is simple: they let you do more with less. A stock that costs $150 per share might require $15,000 to buy 100 shares. An options contract on that same stock might cost $300 to $500, and if the stock moves in your direction, the percentage return on that contract can be many times greater than owning the shares outright. That is the power of <strong>leverage with defined risk</strong>.
      </p>
    </>
  );
}

function ChapterCallsVsPuts() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Every option falls into one of two categories. Understanding the difference between them is the single most important concept you will learn on this page.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-800" style={{ fontFamily: "'Sen', sans-serif" }}>Call Options</h3>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-emerald-900/70 mb-3">
            A call gives you the right to <strong>buy</strong> a stock at a set price (the strike price) before the contract expires. You buy a call when you believe the stock will go <strong>up</strong>.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-emerald-900/70">
            <strong>Example:</strong> A stock trades at $100. You buy a $105 call for $2.50 per share ($250 total). If the stock rises to $115, your contract is worth at least $10 per share ($1,000). Your profit: $750 on a $250 investment, a 300% return. If the stock stays below $105, you lose the $250 premium. That is your maximum risk.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-red-600 rotate-180" />
            </div>
            <h3 className="text-lg font-bold text-red-800" style={{ fontFamily: "'Sen', sans-serif" }}>Put Options</h3>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-red-900/70 mb-3">
            A put gives you the right to <strong>sell</strong> a stock at a set price before expiration. You buy a put when you believe the stock will go <strong>down</strong>, or when you want to protect shares you already own.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-red-900/70">
            <strong>Example:</strong> You own 100 shares of a stock at $100. You buy a $95 put for $1.50 ($150 total). If the stock drops to $80, your put lets you sell at $95, saving you $1,500 in losses for a $150 insurance cost. Puts are the seatbelt of your portfolio.
          </p>
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        At Trader Foundation, we use both calls and puts depending on market conditions. Our swing trading system identifies setups that typically play out over days to weeks. When we spot a bullish setup, we buy calls. When the market shows weakness or we want to protect gains, we use puts. The key difference from gambling is that every position has a <strong>defined entry, a defined exit, and a defined maximum loss</strong> before the trade is placed.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        One critical detail beginners overlook: we buy options with <strong>longer expiration dates</strong>, typically 30 to 60 days out. This gives the trade room to develop. Cheap weekly options are tempting because they cost less, but they decay rapidly and leave almost no margin for error. Buying time is buying safety.
      </p>
    </>
  );
}

function ChapterWhyOptionsMatter() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        If stocks are the highway, options are the express lane. They are not inherently risky, they are inherently <em>efficient</em>. The risk comes from how people use them, not from the instrument itself. A kitchen knife is dangerous in the wrong hands and indispensable in the right ones. Options work the same way.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        The Leverage Advantage
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Consider this scenario: you have $5,000 to invest. With stocks, you might buy 50 shares of a $100 stock. If it rises 5% to $105, you make $250, a 5% return on your capital. With options, that same $5,000 could control the equivalent of 500 or more shares through contracts. A 5% move in the stock could translate to a 20%, 30%, or even 50% return on your options position, depending on the strike and expiration you chose.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        This is not magic. It is mathematics. Each options contract represents 100 shares, so your capital stretches further. The tradeoff is time, options expire, stocks do not. That is why selecting the right expiration date is a skill we drill into every student from day one.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        Income Generation Without Owning Shares
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Most people think of options as something you buy. But you can also <strong>sell</strong> options, and that is where consistent income enters the picture. When you sell a contract, you collect the premium upfront. If the stock stays within your predicted range, you keep that premium as profit. Strategies like covered calls and credit spreads are built on this principle, and they form the backbone of what we teach at Trader Foundation.
      </p>

      <div className="bg-[#fdf6e9] border border-[#e8d5a8] rounded-lg p-6 my-8">
        <p className="text-[0.95rem] leading-relaxed text-[#6b5a2e] mb-0">
          <strong>The Two-Pillar Principle:</strong> At Trader Foundation, we teach that trading generates supplemental income while investing builds lasting wealth. Options are the bridge between the two, they let you generate income through trading <em>and</em> protect your long-term investment portfolio. Our coach Erin used this exact approach to reach Coast FIRE, combining swing trading income with disciplined long-term investing.{' '}
          <a href="/stocks-and-index" className="text-[#c7ab77] font-semibold hover:underline">Read more about the Two-Pillar approach →</a>
        </p>
      </div>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        Defined Risk: Know Your Worst Case Before You Enter
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        When you buy an option, the most you can lose is the premium you paid. Period. There is no margin call, no surprise debt, no waking up to find your account negative. Compare that to shorting a stock, where losses are theoretically unlimited, or even holding shares through a 40% crash. Options let you participate in the market's upside while placing a hard floor under your downside. That is not gambling, that is <strong>risk engineering</strong>.
      </p>
    </>
  );
}

function ChapterSafeStrategies() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        The word "safe" and "options" rarely appear in the same sentence online. That is because most content about options focuses on high-risk, high-reward plays, buying cheap contracts that expire worthless 80% of the time. We take the opposite approach. Our strategies are designed to produce <strong>consistent, repeatable income</strong> with clearly defined risk on every trade.
      </p>

      <div className="space-y-6 my-8">
        <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
          <h4 className="text-lg font-bold text-[#111] mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>
            Covered Calls, Earning Rent on Stocks You Own
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#555] mb-3">
            If you own 100 shares of a stock, you can sell a call option against those shares and collect the premium. If the stock stays below the strike price, you keep the premium and your shares. If it rises above the strike, you sell your shares at a profit and still keep the premium.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-[#555] mb-3">
            Think of it as renting out a property you own. The stock is the property, and the premium is the rent check. Whether the tenant stays or moves out, you collected the rent. This strategy works best on stable, blue-chip stocks that you are comfortable holding long-term.
          </p>
          <div className="bg-[#faf8f4] border-l-4 border-[#c7ab77] rounded-r-lg p-5 mt-4">
            <h5 className="text-[0.95rem] font-bold text-[#111] mb-2" style={{ fontFamily: "'Sen', sans-serif" }}>Where We Take It Further: Charting Your Covered Calls</h5>
            <p className="text-[0.88rem] leading-relaxed text-[#555]">
              Most programs teach covered calls as a mechanical strategy, own 100 shares, sell a call, collect the premium, repeat. At Trader Foundation, we take it to another level by layering <strong>technical analysis and charting</strong> into every covered call decision. Before selling a call, our coaches teach you to read the chart: identify support and resistance levels, analyze the trend direction, and evaluate where the stock is within its current range. This means you are not blindly picking strike prices, you are selecting strikes based on where the chart tells you the stock is likely to stall or reverse. The result is higher-quality premium collection, better strike selection, and fewer situations where your shares get called away at the wrong time. Charting transforms covered calls from a passive income strategy into a <strong>precision income engine</strong>.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
          <h4 className="text-lg font-bold text-[#111] mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>
            Credit Spreads, Collecting Premium with a Safety Net
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#555] mb-3">
            A credit spread involves selling one option and buying another at a different strike price. The premium you collect from the sold option is greater than the cost of the bought option, so you receive a net credit. Your maximum loss is the difference between the two strikes minus the credit received.
          </p>
          <p className="text-[0.95rem] leading-relaxed text-[#555]">
            This is one of the most popular strategies among our students because it requires less capital than covered calls, defines your maximum risk upfront, and profits when the stock stays within a predictable range. You do not need the stock to make a big move, you just need it to <em>not</em> move against you past your short strike.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
          <h4 className="text-lg font-bold text-[#111] mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>
            Protective Puts, Insurance for Your Portfolio
          </h4>
          <p className="text-[0.95rem] leading-relaxed text-[#555]">
            If you hold a stock position and want to guard against a sudden drop, buying a put option acts as an insurance policy. You pay a small premium, and if the stock falls below your strike price, the put increases in value to offset your losses. This is how institutional investors protect billion-dollar portfolios, and you can use the exact same tool on a personal account.
          </p>
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Notice the pattern: every strategy above has a <strong>defined maximum loss</strong>. There are no open-ended risks, no hoping and praying. Each trade is structured before you enter it, with a clear plan for what happens if the market moves against you. That is the foundation of what we mean by "safe options", not that you cannot lose, but that you always know exactly how much you can lose before you commit a single dollar.
      </p>
    </>
  );
}

function ChapterReadingTheChain() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        An options chain is the menu of available contracts for a given stock. When you first look at one, it can feel like staring at a spreadsheet written in a foreign language. Rows of numbers, Greek letters, and abbreviations that seem designed to confuse. But once you understand the five key columns, the entire chain becomes readable in seconds.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
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
              <span className="text-[#c7ab77] font-bold text-[0.85rem] shrink-0 w-6 text-right" style={{ fontFamily: "'DM Sans', sans-serif" }}>{i + 1}.</span>
              <div>
                <p className="text-white font-semibold text-[0.95rem] mb-1" style={{ fontFamily: "'Sen', sans-serif" }}>{item.term}</p>
                <p className="text-white/60 text-[0.88rem] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        In the Money, At the Money, Out of the Money
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        These three terms describe where the strike price sits relative to the current stock price. For a call option: if the stock trades at $100 and your strike is $95, you are <strong>in the money (ITM)</strong>, the option already has intrinsic value. If your strike is $100, you are <strong>at the money (ATM)</strong>. If your strike is $105, you are <strong>out of the money (OTM)</strong>, the stock needs to rise for your option to gain intrinsic value.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        At Trader Foundation, your coach will walk you through exactly which strike and expiration to select based on the specific setup. This is not a one-size-fits-all formula, it depends on the stock, the volatility environment, and your account size. That is why 1-on-1 coaching matters. A YouTube video cannot adjust its advice to your situation. Your coach can.{' '}
        <a href="/trading-tools" className="text-[#c7ab77] font-semibold hover:underline">See how our Trading Tools chapter covers options chains in more detail →</a>
      </p>
    </>
  );
}

function ChapterRiskManagement() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Risk management is not a chapter you read once and forget. It is the operating system that runs underneath every single trade you place. The best setup in the world means nothing if you size the position wrong, ignore your stop, or let a small loss turn into a catastrophic one.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        Position Sizing: The Rule That Saves Accounts
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Never risk more than you can afford to lose on a single trade. That sounds obvious, but the temptation to "go big" on a high-conviction setup has wiped out more accounts than bad analysis ever has. At Trader Foundation, we teach a tiered approach to position sizing based on your total account value. Smaller accounts allocate a higher percentage per trade to generate meaningful returns, while larger accounts reduce that percentage to prioritize capital preservation.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
          Position Sizing Guidelines:
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.88rem]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 text-[#c7ab77] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Account Size</th>
                <th className="text-left py-3 pr-4 text-white/70 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Max Per Trade</th>
                <th className="text-left py-3 text-white/70 font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Rationale</th>
              </tr>
            </thead>
            <tbody className="text-white/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        The Exit Plan: Decided Before You Enter
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Every trade at Trader Foundation has three numbers defined before the order is placed: the entry price, the profit target, and the stop loss. If the trade hits your target, you take the profit. If it hits your stop, you take the loss. There is no negotiating with the market, no "let me hold a little longer," no hoping it comes back. The plan is the plan.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Your coach reviews every trade plan with you, not after the fact, but before you place it. This accountability loop is what separates our students from self-taught traders who develop bad habits in isolation. When someone is watching, you follow the rules. When you follow the rules, you protect your capital. When you protect your capital, you stay in the game long enough for compounding to work. <a href="/calculator" className="text-[#c7ab77] font-semibold hover:underline">See how compounding transforms your trading income over time →</a>
      </p>
    </>
  );
}

function ChapterPsychology() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        You can have the best strategy, the best tools, and the best coach, and still lose money if your emotions are running the show. Trading psychology is not a soft skill. It is the hardest part of this entire discipline, and it is the reason most self-taught traders eventually quit.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
        Fear and Greed: The Two Forces That Destroy Accounts
      </h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Fear makes you exit winning trades too early and avoid perfectly good setups because the last trade was a loss. Greed makes you hold losing trades too long, add to positions that are going against you, and risk more than your plan allows because "this one is a sure thing." Neither emotion has a place in your trading process.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        The antidote is not willpower, it is <strong>process</strong>. When your entry, exit, and position size are predetermined, there is nothing left for emotion to influence. You are executing a plan, not making decisions in the heat of the moment. That is why we insist on trade plans being written down and reviewed by your coach before execution.
      </p>

      <div className="space-y-4 my-8">
        {[
          { trap: 'Revenge trading after a loss', solution: 'Step away for 24 hours. Review the loss with your coach. The market will be there tomorrow.' },
          { trap: 'Moving your stop loss to avoid taking a loss', solution: 'If the trade hit your stop, the setup was wrong. Accept it. A small loss is a business expense, not a personal failure.' },
          { trap: 'Overtrading because you feel like you should "be doing something"', solution: 'The best traders spend most of their time waiting. If there is no setup that meets your criteria, the correct trade is no trade.' },
          { trap: 'Comparing your results to others in the community', solution: 'Everyone has a different account size, risk tolerance, and timeline. Focus on your own process and your own progress.' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
            <p className="font-semibold text-[#111] text-[0.95rem] mb-2 flex items-start gap-2">
              <span className="text-red-400 shrink-0">✕</span>
              {item.trap}
            </p>
            <p className="text-[#666] text-[0.9rem] leading-relaxed mb-0 ml-6">
              <span className="text-emerald-600 font-semibold">Instead:</span> {item.solution}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The reason 1-on-1 coaching works so well for psychology is accountability. When you know your coach will see every trade, you think twice before making an impulsive decision. Over time, that external accountability becomes internal discipline, and that is when trading stops being stressful and starts being systematic.
      </p>
    </>
  );
}

function ChapterGettingStarted() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Reading about options is useful. Practicing them is essential. The gap between theory and execution is where most beginners get stuck, and it is exactly where our program is designed to bridge the distance. Here is what your first 30 days look like when you join Trader Foundation.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
          Your First 30 Days:
        </h3>
        <div className="space-y-6">
          {[
            { week: 'Week 1', title: 'Foundation & Setup', desc: 'Meet your personal coach. Set up your brokerage account. Learn the basics of reading charts and identifying swing trade setups. Begin paper trading with the Time Machine, our structured practice system that uses real historical data.' },
            { week: 'Week 2', title: 'Options Fundamentals', desc: 'Understand calls, puts, strike selection, and expiration timing. Practice reading options chains. Submit your first paper trade plans to your coach for review. Learn position sizing based on your account.' },
            { week: 'Week 3', title: 'Strategy Application', desc: 'Apply covered calls or credit spreads in paper trading. Review your trade journal with your coach. Identify patterns in your decision-making. Begin to develop your personal trading rules.' },
            { week: 'Week 4', title: 'Transition to Live Trading', desc: 'With your coach\'s approval, place your first live trade with real capital, small position, defined risk, full trade plan reviewed beforehand. Continue daily practice with the Time Machine alongside live positions.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-lg bg-[#c7ab77]/10 flex flex-col items-center justify-center">
                  <span className="text-[0.65rem] text-[#c7ab77]/60 uppercase tracking-wider font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.week.split(' ')[0]}</span>
                  <span className="text-xl font-bold text-[#c7ab77]" style={{ fontFamily: "'Sen', sans-serif" }}>{item.week.split(' ')[1]}</span>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-[0.95rem] mb-1" style={{ fontFamily: "'Sen', sans-serif" }}>{item.title}</p>
                <p className="text-white/60 text-[0.88rem] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Notice that live trading does not begin until week four, and only with your coach's sign-off. We are not in a rush to get you placing trades. We are in a rush to get you placing <em>good</em> trades. The Time Machine practice system lets you analyze hundreds of historical setups before risking real money, building the pattern recognition and discipline that separate profitable traders from everyone else.
      </p>

      <div className="bg-[#fdf6e9] border border-[#e8d5a8] rounded-lg p-6 my-8">
        <p className="text-[0.95rem] leading-relaxed text-[#6b5a2e] mb-0">
          <strong>Ready to start?</strong> Our free masterclass walks you through the complete swing trading system, how we find setups, how we use options for leverage, and how our students are building real wealth while keeping their day jobs. No fluff, no hype, just the strategy.
        </p>
      </div>

      <div className="text-center mt-8">
        <a
          href="https://start.traderfoundation.co/trade"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] font-bold text-[0.95rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          WATCH THE FREE MASTERCLASS
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
      <SEO title="Options Trading" description="Learn options trading strategies from Trader Foundation Academy." path="/options-trading" />
      <Navigation />

      {/* ── Breadcrumb ── */}
      <div className="pt-[130px] pb-4 bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[0.78rem] text-white/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <a href="/" className="hover:text-[#c7ab77] transition-colors">Home</a>
            <span>/</span>
            <span className="text-[#c7ab77]">Options Trading</span>
          </div>
        </div>
      </div>

      {/* ── Page Title Banner ── */}
      <div className="bg-[#111] pb-12">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
            Options <span className="text-[#c7ab77]">Trading</span>
          </h1>
          <p className="mt-3 text-white/60 text-lg max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A clear-headed guide to using options for leverage, income, and portfolio protection, without the gambling.
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

          {/* ── MOBILE: Chapter selector dropdown ── */}
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

              {/* Continue Learning */}
              <div className="mt-6 bg-white rounded-lg border border-[#e8e4dc] p-5 shadow-sm">
                <p className="text-[0.78rem] font-bold text-[#333] uppercase tracking-wider mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Continue Learning
                </p>
                <ul className="space-y-2">
                  {[
                    { label: 'Investing 101', href: '/investing-101' },
                    { label: 'Stocks & Index Investing', href: '/stocks-and-index' },
                    { label: 'Trading Tools', href: '/trading-tools' },
                    { label: 'Compound Interest Calculator', href: '/calculator' },
                    { label: 'Student Results', href: '/results' },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="flex items-center gap-2 text-[0.85rem] text-[#555] hover:text-[#c7ab77] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <ChevronRight size={14} className="text-[#c7ab77]" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
