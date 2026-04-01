/*
 * Trading Tools Page — Trader Foundation
 * Chapter-based navigation: TOC on left, selected chapter content on right
 * Design: GOAT Academy style — clean, editorial, three-column layout
 */

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, ArrowLeft, ChevronRight, MonitorSmartphone, BarChart3, BookOpen, Wrench, Target, Shield, Clock, Briefcase } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Chapter data ── */
const CHAPTERS = [
  { id: 'right-platform', label: 'Choosing the Right Brokerage Platform', icon: MonitorSmartphone },
  { id: 'charting-software', label: 'Charting Software That Actually Matters', icon: BarChart3 },
  { id: 'stock-screeners', label: 'Stock Screeners: Finding Setups in Minutes', icon: Target },
  { id: 'options-chain', label: 'Reading an Options Chain Without the Confusion', icon: Wrench },
  { id: 'time-machine', label: 'The Time Machine: Practice Before You Risk', icon: Clock },
  { id: 'trading-journal', label: 'Your Trading Journal — The Most Underrated Tool', icon: BookOpen },
  { id: 'alerts-automation', label: 'Alerts & Automation for Busy Professionals', icon: Shield },
  { id: 'platform-comparison', label: 'Choosing Your Platform: What Actually Matters', icon: Briefcase },
];

/* ── Chapter Content Components ── */

function ChapterBrokerage() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Your brokerage is the gateway between you and the market. It is where you deposit capital, execute trades, and monitor your positions. Picking the wrong one does not just cost you in fees — it costs you in execution speed, available order types, and the quality of data you receive. For swing traders, the platform needs to handle options chains cleanly, support conditional orders, and provide reliable fills without slippage.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        At Trader Foundation, our students use a variety of platforms depending on their experience level and preferences. There is no single "best" brokerage — there is only the one that fits your workflow. That said, certain features are non-negotiable for the type of trading we teach.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>What to Look For</h3>

      <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 md:p-8 my-4 shadow-sm">
        <div className="space-y-5">
          {[
            { title: 'Commission-Free Options Trading', desc: 'Most major brokerages have eliminated stock commissions, but options contracts still carry per-contract fees at some platforms. Look for brokerages that charge $0.65 or less per contract — or nothing at all.' },
            { title: 'Reliable Order Execution', desc: 'When you place a limit order on an options spread, you need it filled at your price or not at all. Brokerages with poor execution quality will cost you more than any commission savings.' },
            { title: 'Clean Options Chain Interface', desc: 'You will be reading options chains regularly. The platform should display strike prices, bid/ask spreads, open interest, and implied volatility in a layout that does not require a decoder ring.' },
            { title: 'Conditional & Bracket Orders', desc: 'Swing trading means you are not glued to a screen. You need the ability to set automatic profit targets and stop losses that execute while you are at work or with your family.' },
            { title: 'Mobile App Quality', desc: 'Many of our students scan for setups during lunch breaks or after market hours. A mobile app that mirrors the desktop experience — including charting and order entry — is essential.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#c7ab77] text-xs font-bold">{i + 1}</span>
              </span>
              <div>
                <span className="font-semibold text-[#111] text-[0.95rem]">{item.title}</span>
                <p className="text-[#666] text-[0.9rem] mt-1 mb-0 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Some of the most popular brokerages our students explore include Charles Schwab (which includes the thinkorswim platform), Fidelity, Webull, Interactive Brokers, and Tastytrade. Each has strengths depending on whether you prioritize charting depth, options pricing, or mobile convenience. We do not endorse one over another — your 1-on-1 coach will help you evaluate which platform aligns with your trading style during onboarding, ensuring you start with the right foundation from day one.
      </p>
    </>
  );
}

function ChapterCharting() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        A chart is a visual record of what the market has done. It shows you price, volume, and time — the three ingredients you need to identify patterns and make informed decisions. But not all charting tools are created equal, and the difference between a good platform and a great one often comes down to how quickly you can find what you are looking for.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        For swing trading, you do not need the kind of millisecond-level data that day traders obsess over. What you need is clean daily and weekly charts with reliable indicators, the ability to draw trendlines and support/resistance zones, and enough historical data to identify recurring patterns. Anything beyond that is noise.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>The Indicators We Actually Use</h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Our curriculum focuses on a handful of proven technical indicators rather than overwhelming students with dozens of overlapping signals. The goal is clarity, not complexity.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Moving Averages (SMA & EMA)', use: 'Identify the overall trend direction and dynamic support/resistance levels. We focus on the 20, 50, and 200-day moving averages for swing trade timeframes.' },
            { name: 'Relative Strength Index (RSI)', use: 'Measure momentum and identify overbought or oversold conditions. Useful for timing entries when a stock has pulled back to a support zone.' },
            { name: 'Volume Profile', use: 'Confirm the strength of a price move. A breakout on heavy volume carries more conviction than one on thin volume — a principle our students learn to apply on every trade.' },
            { name: 'MACD (Moving Average Convergence Divergence)', use: 'Spot momentum shifts and potential trend reversals. Particularly useful when combined with support/resistance analysis for swing trade entry timing.' },
          ].map((ind, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-5">
              <h4 className="text-[#c7ab77] font-bold text-[0.9rem] mb-2" style={{ fontFamily: "'Sen', sans-serif" }}>{ind.name}</h4>
              <p className="text-white/60 text-[0.85rem] leading-relaxed mb-0">{ind.use}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Popular charting platforms include TradingView (browser-based, accessible from any device), StockCharts (known for clean technical analysis layouts), and the built-in charting tools that come with brokerages like thinkorswim or Fidelity Active Trader Pro. Some students prefer the simplicity of a standalone charting tool, while others like having everything integrated within their brokerage. Either approach works with our system — your coach will walk you through whichever platform fits your workflow best.
      </p>
    </>
  );
}

function ChapterScreeners() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        There are thousands of stocks trading on U.S. exchanges at any given moment. You cannot analyze all of them manually. A stock screener narrows the universe down to a manageable list of candidates that meet your specific criteria — saving you hours of work and keeping your process consistent.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        For swing trading, the filters that matter most are different from what a day trader or long-term investor would use. We are looking for stocks that are liquid enough to trade options on, showing a clear technical pattern, and sitting near a key support or resistance level where a high-probability setup is forming.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Filters Our Students Typically Apply</h3>

      <div className="bg-white rounded-lg border border-[#e8e4dc] overflow-hidden my-6 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#111]">
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Filter</th>
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Typical Setting</th>
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Why It Matters</th>
            </tr>
          </thead>
          <tbody className="text-[0.88rem] text-[#444]">
            {[
              { filter: 'Market Cap', setting: 'Over $2 Billion', why: 'Ensures sufficient liquidity and tighter options spreads' },
              { filter: 'Average Volume', setting: '500K+ shares/day', why: 'Confirms active trading interest and reliable fills' },
              { filter: 'Options Volume', setting: '1,000+ contracts/day', why: 'Tighter bid/ask spreads on the options you trade' },
              { filter: 'Price Range', setting: '$20–$500', why: 'Sweet spot for options premium collection' },
              { filter: 'RSI Range', setting: '30–45 or 55–70', why: 'Identifies stocks near oversold bounce or overbought reversal zones' },
              { filter: 'Near 50-Day MA', setting: 'Within 3%', why: 'Stocks testing a key moving average often produce swing setups' },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-[#faf9f6]' : 'bg-white'}>
                <td className="px-5 py-3 font-semibold text-[#111]">{row.filter}</td>
                <td className="px-5 py-3">{row.setting}</td>
                <td className="px-5 py-3">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Running a screener with these filters typically produces a watchlist of 10 to 20 stocks. From there, you pull up the chart on each one and look for the technical patterns our curriculum teaches — a process that takes most students about 10 minutes once they have it down. The screener does the heavy lifting; your job is to confirm the setup visually and decide whether the risk-to-reward ratio justifies the trade.
      </p>
    </>
  );
}

function ChapterOptionsChain() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        If you have ever opened an options chain for the first time, you know the feeling: rows and columns of numbers, Greek letters, and expiration dates that seem designed to intimidate. The good news is that you do not need to understand every cell in that table. For the strategies we teach, you need to focus on a handful of data points — and once you know where to look, the chain becomes one of your most powerful tools.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        An options chain is simply a table that shows every available option contract for a given stock, organized by expiration date and strike price. Calls are on one side, puts on the other. Each row represents a different strike price, and the columns show you the bid, ask, last price, volume, open interest, and implied volatility for that specific contract.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>The Five Numbers That Matter Most</h3>

      <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 md:p-8 my-4 shadow-sm">
        <div className="space-y-5">
          {[
            { title: 'Bid & Ask', desc: 'The bid is what buyers are willing to pay; the ask is what sellers want. The difference between them — the spread — tells you how liquid that contract is. Tighter spreads mean better fills.' },
            { title: 'Open Interest', desc: 'The total number of outstanding contracts at a given strike. Higher open interest means more participants and more liquidity. We generally avoid strikes with open interest below 100.' },
            { title: 'Implied Volatility (IV)', desc: 'A measure of how much the market expects the stock to move. Higher IV means higher premiums — which can be advantageous when you are selling options, as we often do in our credit spread strategies.' },
            { title: 'Delta', desc: 'Tells you the probability that the option will expire in the money. A delta of 0.30 means roughly a 30% chance. For our strategies, we typically look for deltas between 0.15 and 0.30 on the short leg — keeping the probability of profit firmly in our favor.' },
            { title: 'Days to Expiration (DTE)', desc: 'How many days until the contract expires. Swing traders and premium sellers tend to work in the 30 to 45 DTE range, where time decay accelerates and works in your favor.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#c7ab77] text-xs font-bold">{i + 1}</span>
              </span>
              <div>
                <span className="font-semibold text-[#111] text-[0.95rem]">{item.title}</span>
                <p className="text-[#666] text-[0.9rem] mt-1 mb-0 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Your coach will walk you through live options chains during your 1-on-1 sessions, showing you exactly how to select the right strike and expiration for each trade. It is one of those skills that feels overwhelming on paper but becomes second nature with guided practice.{' '}
        <a href="/options-trading" className="text-[#c7ab77] font-semibold hover:underline">Learn more about our options strategies →</a>
      </p>
    </>
  );
}

function ChapterTimeMachine() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        One of the most common reasons new traders lose money is that they jump into live markets before they have developed the pattern recognition and discipline required to execute consistently. Reading about a strategy is not the same as applying it under real conditions — and the gap between theory and execution is where most accounts get hurt.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        That is why we built the <strong>Time Machine</strong> into our curriculum. It is a structured review process where students analyze historical chart setups — real stocks, real price action, real market conditions — and practice identifying entries, exits, and risk management decisions without putting a single dollar at risk. Think of it as a flight simulator for traders.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>How the Time Machine Process Works</h3>
        <div className="space-y-4">
          {[
            { step: 'Step 1', title: 'Historical Setup Review', desc: 'Your coach presents you with a stock chart from a past date — stripped of the outcome. You analyze it using the technical framework you have learned and decide: would you enter this trade?' },
            { step: 'Step 2', title: 'Trade Plan Submission', desc: 'You document your entry price, stop loss, profit target, position size, and the reasoning behind each decision. This forces you to think through the trade systematically, not emotionally.' },
            { step: 'Step 3', title: 'Outcome Reveal & Coach Feedback', desc: 'Your coach reveals what actually happened and walks through your analysis. Where was your read accurate? Where did you miss something? What would you adjust next time?' },
            { step: 'Step 4', title: 'Pattern Library Building', desc: 'Over dozens of Time Machine sessions, you build a mental library of setups you have seen before. When a similar pattern appears in the live market, you recognize it — and you have the confidence to act because you have already practiced the decision.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-16 shrink-0">
                <span className="text-[#c7ab77] text-[0.75rem] font-bold uppercase tracking-wider">{item.step}</span>
              </div>
              <div>
                <span className="text-white font-semibold text-[0.95rem]">{item.title}</span>
                <p className="text-white/50 text-[0.88rem] mt-1 mb-0 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Students typically complete several dozen Time Machine reviews before placing their first live trade. By that point, reading a chart and constructing a trade plan feels familiar — not foreign. It is the difference between studying for a test and actually taking practice exams. Both matter, but the practice is what builds real competence.
      </p>
    </>
  );
}

function ChapterJournal() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Ask any consistently profitable trader what their most important tool is, and the answer is rarely a platform or indicator. It is their journal. A trading journal is a written record of every trade you take — why you entered, where your stop was, what the outcome was, and what you learned. It turns each trade into a data point you can analyze and improve from.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Without a journal, you are relying on memory — which is unreliable, especially when emotions are involved. You will remember the big wins vividly and forget the small losses that eroded your account. A journal forces honesty. It shows you patterns in your own behavior: maybe you consistently exit winners too early, or maybe you hold losers too long hoping for a reversal. Those insights are invisible without data.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>What to Record in Every Entry</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {[
          { field: 'Date & Time', detail: 'When you entered and exited the position' },
          { field: 'Ticker & Strategy', detail: 'Which stock and what type of trade (credit spread, swing long, etc.)' },
          { field: 'Entry Reasoning', detail: 'The technical setup that triggered your entry — be specific' },
          { field: 'Stop Loss & Target', detail: 'Where you placed your risk boundaries before entering' },
          { field: 'Outcome & P/L', detail: 'What happened and the dollar result' },
          { field: 'Emotional State', detail: 'Were you confident, anxious, impulsive? This reveals behavioral patterns' },
          { field: 'Lesson Learned', detail: 'One takeaway — even from winning trades' },
          { field: 'Screenshot', detail: 'A chart image at entry and exit for visual review later' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e8e4dc] p-4 shadow-sm">
            <span className="font-semibold text-[#111] text-[0.9rem]">{item.field}</span>
            <p className="text-[#666] text-[0.83rem] mt-1 mb-0 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        At Trader Foundation, your coach reviews your trading journal during 1-on-1 sessions. This is one of the most valuable parts of the program — an experienced trader looking at your actual decisions and helping you identify blind spots you cannot see on your own. The students who improve fastest are consistently the ones who journal every trade, without exception.
      </p>
    </>
  );
}

function ChapterAlerts() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        One of the biggest misconceptions about trading is that you need to watch the market all day. For day traders, that is true. For swing traders using the approach we teach, it is not. The entire system is designed around the reality that our students have careers, families, and responsibilities that come first. Trading fits into their schedule — not the other way around.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        The key is using alerts and automation to let the market come to you. Instead of staring at charts waiting for a stock to reach your target entry price, you set a price alert and go about your day. When the alert fires — usually as a push notification on your phone — you pull up the chart, confirm the setup still looks valid, and place your order. The entire process takes minutes.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Types of Automation Our Students Use</h3>

      <div className="bg-white rounded-lg border border-[#e8e4dc] p-6 md:p-8 my-4 shadow-sm">
        <div className="space-y-5">
          {[
            { title: 'Price Alerts', desc: 'Set through your charting platform (such as TradingView or StockCharts) or directly in your brokerage app. When a stock touches a key support level or breaks through resistance, you get a text or push notification. No screen time required until the alert fires.' },
            { title: 'Bracket Orders', desc: 'Once you enter a trade, set both your profit target and stop loss as conditional orders. If the stock hits either level, the position closes automatically. You can be in a meeting, at dinner, or asleep — the trade manages itself.' },
            { title: 'Watchlist Scanning', desc: 'Most charting platforms let you save custom screener filters. Run them once a day — typically after market close or before the open — to refresh your watchlist with new candidates that meet your criteria.' },
            { title: 'Calendar Reminders', desc: 'Set reminders for earnings dates, FOMC meetings, and expiration Fridays. These events can cause sudden volatility, and knowing they are coming lets you adjust positions or avoid entering new trades during high-risk windows.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#c7ab77] text-xs font-bold">{i + 1}</span>
              </span>
              <div>
                <span className="font-semibold text-[#111] text-[0.95rem]">{item.title}</span>
                <p className="text-[#666] text-[0.9rem] mt-1 mb-0 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The combination of alerts and conditional orders is what makes swing trading compatible with a full-time career. You do the analysis once, set your parameters, and let the system work. When your phone buzzes during a meeting, it usually means a trade has closed at your target — and you made money while doing your job. That is the workflow our students build toward from day one. When that consistent income starts compounding, the results can be life-changing — <a href="/calculator" className="text-[#c7ab77] font-semibold hover:underline">see for yourself with our Compound Interest Calculator</a>.
      </p>
    </>
  );
}

function ChapterPlatformChecklist() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        There is no shortage of brokerages and charting platforms available today — and every one of them will tell you they are the best. The truth is that the "best" platform is the one that fits your workflow, your experience level, and the type of trading you are doing. What matters is not the brand name on the screen. It is whether the platform gives you what you need to execute our system efficiently.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Rather than telling you which platform to use, here is what your platform needs to do well for the swing trading and options strategies we teach. Use this as a checklist when evaluating any brokerage or charting tool.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Your Platform Checklist</h3>

      <div className="bg-white rounded-lg border border-[#e8e4dc] overflow-hidden my-6 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#111]">
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Feature</th>
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Why It Matters for Our System</th>
              <th className="px-5 py-3 text-[#c7ab77] text-[0.82rem] font-bold uppercase tracking-wider text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>Must-Have?</th>
            </tr>
          </thead>
          <tbody className="text-[0.88rem] text-[#444]">
            {[
              { feature: 'Commission-Free Options', why: 'Keeps your cost per trade low, especially when scaling into multiple positions', must: true },
              { feature: 'Clean Options Chain', why: 'You need to read strike prices, IV, delta, and open interest quickly and clearly', must: true },
              { feature: 'Conditional / Bracket Orders', why: 'Set profit targets and stop losses that execute automatically while you work', must: true },
              { feature: 'Daily & Weekly Charts', why: 'Swing trading relies on multi-day timeframes — not tick-by-tick data', must: true },
              { feature: 'Custom Screener Filters', why: 'Narrow thousands of stocks to 10–20 candidates in minutes', must: true },
              { feature: 'Price Alerts', why: 'Get notified when a stock hits your target level — no screen-watching required', must: true },
              { feature: 'Paper Trading Mode', why: 'Practice the Time Machine process and test strategies without risking capital', must: false },
              { feature: 'Mobile App', why: 'Check setups and manage positions on the go — especially useful for busy professionals', must: false },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-[#faf9f6]' : 'bg-white'}>
                <td className="px-5 py-3 font-semibold text-[#111]">{row.feature}</td>
                <td className="px-5 py-3">{row.why}</td>
                <td className="px-5 py-3 text-center">
                  {row.must ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#c7ab77]/15 text-[#c7ab77] text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-[#999] text-xs">Nice to have</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#fdf8f0] border border-[#e8d5b0] rounded-lg p-6 my-6">
        <p className="text-[1.05rem] leading-relaxed text-[#444] mb-0">
          <strong>The Trader Foundation difference:</strong> Your platform is just a tool — what matters is how you use it. Every student gets a personal coach who helps them configure their chosen platform, set up their screeners, and optimize their workflow during onboarding. Regardless of which brokerage or charting software you prefer, we make sure you are set up for success from day one.{' '}
          <a href="/results" className="text-[#c7ab77] font-semibold hover:underline">See what our students have achieved →</a>
        </p>
      </div>
    </>
  );
}

/* Map chapter IDs to their content components */
const CHAPTER_CONTENT: Record<string, React.FC> = {
  'right-platform': ChapterBrokerage,
  'charting-software': ChapterCharting,
  'stock-screeners': ChapterScreeners,
  'options-chain': ChapterOptionsChain,
  'time-machine': ChapterTimeMachine,
  'trading-journal': ChapterJournal,
  'alerts-automation': ChapterAlerts,
  'platform-comparison': ChapterPlatformChecklist,
};

export default function TradingTools() {
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
            <span className="text-[#c7ab77]">Trading Tools</span>
          </div>
        </div>
      </div>

      {/* ── Page Title Banner ── */}
      <div className="bg-[#111] pb-12">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
            Trading <span className="text-[#c7ab77]">Tools</span>
          </h1>
          <p className="mt-3 text-white/60 text-lg max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            The platforms, software, and systems our students use to find, execute, and manage swing trades — all in under 10 minutes a day.
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

              {/* Quick Links */}
              <div className="mt-6 bg-white rounded-lg border border-[#e8e4dc] p-5 shadow-sm">
                <h4 className="text-[0.82rem] uppercase tracking-wider text-[#888] font-semibold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Continue Learning
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Investing 101', href: '/investing-101' },
                    { label: 'Stocks & Index Investing', href: '/stocks-and-index' },
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
