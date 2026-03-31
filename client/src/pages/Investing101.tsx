/*
 * Investing 101 Page — Trader Foundation
 * Completely original content with Table of Contents
 * Design: dark/gold premium aesthetic, two-column layout with sticky sidebar
 * Voice: Trader Foundation philosophy — swing trading, 1-on-1 coaching, safe options, technical analysis
 */

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronRight, Landmark, Layers, LineChart, PiggyBank, Compass, GraduationCap } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Table of Contents data ── */
const TOC = [
  { id: 'why-invest', label: 'Why Investing Matters for Your Future' },
  { id: 'how-money-grows', label: 'How Your Money Actually Grows' },
  { id: 'inflation-trap', label: 'The Inflation Trap Most People Ignore' },
  { id: 'asset-classes', label: 'Breaking Down the Major Asset Classes' },
  { id: 'your-roadmap', label: 'Your Personal Investing Roadmap' },
  { id: 'common-mistakes', label: 'Mistakes That Cost New Investors Thousands' },
];

export default function Investing101() {
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
            <span className="text-[#c7ab77]">Investing 101</span>
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
            Investing <span className="text-[#c7ab77]">101</span>
          </h1>
          <p
            className="mt-3 text-white/60 text-lg max-w-2xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A practical, no-nonsense introduction to growing your wealth — written by traders, for future traders.
          </p>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Sidebar: Table of Contents (Pamphlet Style) ── */}
          <nav className="hidden lg:block w-[200px] shrink-0">
            <div className="lg:sticky lg:top-[140px] max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
              <h2
                className="text-xs font-bold text-[#999] mb-4 flex items-center gap-2 uppercase tracking-[0.15em]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className="w-1 h-4 bg-[#c7ab77] rounded-full inline-block" />
                In This Guide
              </h2>
              <ol className="space-y-0.5 border-l-2 border-[#e8e4dc] pl-0">
                {TOC.map(({ id, label }, i) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className={`flex items-center gap-2 text-left w-full py-2 pl-4 pr-2 transition-all duration-200 border-l-2 -ml-[2px] ${
                        activeSection === id
                          ? 'border-[#c7ab77] text-[#c7ab77] bg-[#c7ab77]/5'
                          : 'border-transparent text-[#777] hover:text-[#c7ab77] hover:border-[#c7ab77]/40'
                      }`}
                    >
                      <span className="text-[0.7rem] font-bold w-4 text-right shrink-0 opacity-50">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[0.75rem] font-medium leading-snug">{label}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {/* Sidebar CTA - below TOC */}
              <div className="mt-8 bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={SIDEBAR_IMG}
                  alt="Vlad Tayman teaching at Trader Foundation"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 text-center">
                  <p className="text-[#c7ab77] font-bold text-[0.7rem] uppercase tracking-wider mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free Masterclass</p>
                  <h3 className="text-sm font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Sen', sans-serif" }}>Learn the Swing Trading System That Works</h3>
                  <a
                    href="https://start.traderfoundation.co/trade"
                    className="block w-full py-2.5 bg-[#c7ab77] text-[#111] font-bold text-[0.78rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Sign Me Up Now →
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-5 border-t border-[#e8e4dc] pt-5">
                <h4 className="text-[0.7rem] uppercase tracking-[0.15em] text-[#999] font-semibold mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Continue Learning</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Stocks & Index', href: '/stocks-and-index' },
                    { label: 'Trading Tools', href: '/trading-tools' },
                    { label: 'Options Trading', href: '/options-trading' },
                    { label: 'Calculator', href: '/calculator' },
                    { label: 'Results', href: '/results' },
                  ].map((link) => (
                    <a key={link.label} href={link.href} className="flex items-center gap-1.5 text-[0.78rem] text-[#666] hover:text-[#c7ab77] transition-colors font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <ArrowRight size={12} className="text-[#c7ab77] shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* ── Mobile TOC (visible on small screens only) ── */}
          <nav className="lg:hidden bg-white rounded-lg border border-[#e8e4dc] p-6 mb-8 shadow-sm">
            <h2
              className="text-sm font-bold text-[#111] mb-4 flex items-center gap-2 uppercase tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="w-1 h-5 bg-[#c7ab77] rounded-full inline-block" />
              In This Guide
            </h2>
            <ol className="space-y-2">
              {TOC.map(({ id, label }, i) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className={`flex items-center gap-2 text-left w-full group transition-colors duration-200 ${
                      activeSection === id ? 'text-[#c7ab77]' : 'text-[#555] hover:text-[#c7ab77]'
                    }`}
                  >
                    <span className="text-[0.7rem] font-bold w-4 text-right shrink-0 opacity-50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ChevronRight size={12} className={`shrink-0 transition-transform duration-200 ${
                      activeSection === id ? 'translate-x-0.5 text-[#c7ab77]' : 'text-[#ccc]'
                    }`} />
                    <span className="text-[0.88rem] font-medium">{label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* ── Article Content (Right / Main Column) ── */}
          <article className="flex-1 min-w-0">
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

              {/* ── Section 1: Why Investing Matters ── */}
              <section id="why-invest" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Landmark size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Why Investing Matters for Your Future
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Most people spend decades trading their time for a paycheck. The money comes in, covers expenses, and whatever is left sits in a checking account earning next to nothing. That cycle works until it does not — a job loss, an unexpected expense, or retirement arrives and the safety net is thinner than expected.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Investing breaks that cycle. When you put capital into assets that appreciate — whether stocks, index funds, or options — your money starts working on your behalf, even while you sleep. The goal is not to get rich overnight. The goal is to build a financial foundation that gives you choices: the choice to retire when you want, to weather emergencies without panic, or to leave something meaningful for the next generation.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  At Trader Foundation, we teach a specific approach: <strong>swing trading combined with safe options strategies</strong>. It is designed for people with full-time jobs, families, and limited screen time. You do not need to quit your day job or stare at charts for eight hours. You need a system, discipline, and the willingness to learn.
                </p>
              </section>

              {/* ── Section 2: How Your Money Actually Grows ── */}
              <section id="how-money-grows" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <PiggyBank size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    How Your Money Actually Grows
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  There is a reason experienced investors talk about "letting your money work for you." When you invest, your returns can generate their own returns — a process called compounding. It is not magic, but over a long enough timeline, the results can feel like it.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Think of it this way: you plant a tree. In year one, it produces a handful of seeds. You plant those seeds too. By year ten, you do not have one tree — you have a small forest. That is compounding in action. The earlier you start, the larger that forest becomes.
                </p>

                {/* Compounding visual */}
                <div className="bg-[#111] rounded-lg p-8 my-8">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    The Compounding Timeline:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        year: 'Year 1–5',
                        title: 'The Foundation Phase',
                        desc: 'Growth feels slow. Your contributions matter more than your returns. This is where most people give up — and where the disciplined separate themselves.',
                      },
                      {
                        year: 'Year 5–15',
                        title: 'The Momentum Phase',
                        desc: 'Returns start compounding noticeably. Your portfolio begins growing faster than your contributions alone could achieve.',
                      },
                      {
                        year: 'Year 15–25',
                        title: 'The Acceleration Phase',
                        desc: 'This is where patience pays off. Your gains are now generating significant gains of their own. The snowball is rolling.',
                      },
                      {
                        year: 'Year 25+',
                        title: 'The Harvest Phase',
                        desc: 'Your portfolio can potentially sustain your lifestyle. The choices you made decades ago are now funding your freedom.',
                      },
                    ].map((item) => (
                      <div
                        key={item.year}
                        className="flex items-start gap-4 p-4 rounded-md bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="text-[#c7ab77] font-bold text-[0.78rem] shrink-0 mt-0.5 w-16">
                          {item.year}
                        </span>
                        <div>
                          <span className="font-semibold text-white text-[0.95rem]">
                            {item.title}
                          </span>
                          <p className="text-white/60 text-[0.88rem] mt-1 mb-0">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#c7ab77]/[0.08] border-l-4 border-[#c7ab77] p-6 rounded-r-lg my-8">
                  <p className="text-[1rem] leading-relaxed text-[#333] m-0">
                    <strong>Run the numbers yourself:</strong> Plug in your own starting amount, monthly contribution, and expected return rate to see exactly how your wealth could grow over time.{' '}
                    <a
                      href="/calculator"
                      className="text-[#c7ab77] font-semibold hover:underline"
                    >
                      Open the Compound Interest Calculator →
                    </a>
                  </p>
                </div>
              </section>

              {/* ── Section 3: The Inflation Trap ── */}
              <section id="inflation-trap" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Layers size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    The Inflation Trap Most People Ignore
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Here is an uncomfortable truth: if your money is sitting in a standard savings account, you are losing purchasing power every single year. Inflation — the gradual increase in the cost of goods and services — quietly eats away at the value of every dollar you hold.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  A cup of coffee that cost $2.00 a decade ago might cost $3.50 today. Your salary may have increased, but has it kept up? For most people, the answer is no. The only reliable way to stay ahead of inflation is to put your capital into assets that grow faster than prices rise.
                </p>

                {/* Comparison cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                  {[
                    {
                      label: 'Cash in Savings',
                      rate: '0.01–0.5%',
                      note: 'Falling behind every year',
                      color: 'text-red-500',
                    },
                    {
                      label: 'Government Bonds',
                      rate: '3–5%',
                      note: 'Roughly keeps pace',
                      color: 'text-yellow-600',
                    },
                    {
                      label: 'Equity Markets',
                      rate: '7–10%',
                      note: 'Historically outperforms',
                      color: 'text-emerald-600',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white rounded-lg border border-[#e8e4dc] p-5 text-center shadow-sm"
                    >
                      <p className="text-[0.78rem] uppercase tracking-wider text-[#888] font-medium mb-1">
                        {item.label}
                      </p>
                      <p
                        className="text-2xl font-bold text-[#111]"
                        style={{ fontFamily: "'Sen', sans-serif" }}
                      >
                        {item.rate}
                      </p>
                      <p className={`text-[0.82rem] font-semibold ${item.color} mt-1`}>
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  This does not mean you should throw every dollar into the stock market tomorrow. It means that <strong>doing nothing with your money is itself a decision</strong> — and it is one that costs you more each year. A thoughtful, diversified investment approach is how you protect what you have earned and give it room to grow.
                </p>
              </section>

              {/* ── Section 4: Asset Classes ── */}
              <section id="asset-classes" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <LineChart size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Breaking Down the Major Asset Classes
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
                  Before you allocate a single dollar, it helps to understand what you are actually buying. Here are the primary categories most investors work with:
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Individual Stocks
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  When you buy a share of stock, you own a small piece of that company. If the company grows and becomes more profitable, the value of your share typically increases. Stocks carry more risk than some other assets because individual companies can underperform, but they also offer the highest potential for long-term growth. At Trader Foundation, our swing trading approach focuses on identifying high-probability stock setups using technical analysis — not guesswork.
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Index Funds & ETFs
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Rather than picking individual companies, index funds let you invest in a broad basket of stocks at once. An S&P 500 index fund, for example, gives you exposure to 500 of the largest U.S. companies in a single purchase. ETFs (Exchange-Traded Funds) work similarly but trade throughout the day like individual stocks. Both are excellent for building a diversified foundation without needing to research hundreds of companies.{' '}
                  <a href="/stocks-and-index" className="text-[#c7ab77] font-semibold hover:underline">
                    Dive deeper into Stocks & Index strategies →
                  </a>
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Options Contracts
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
                  Options give you the right to buy or sell a stock at a specific price within a set timeframe. They can be used conservatively — to protect your portfolio or generate income — or more aggressively for leveraged bets. Our program emphasizes <strong>safe options strategies</strong> that are designed to manage risk, not amplify it. If you are curious about how options fit into a disciplined trading plan, we cover that extensively in our curriculum.{' '}
                  <a href="/options-trading" className="text-[#c7ab77] font-semibold hover:underline">
                    Read our Options Trading overview →
                  </a>
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Bonds & Fixed Income
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Bonds are essentially loans you make to a government or corporation in exchange for regular interest payments. They are generally lower risk and lower return than stocks, making them useful for balancing a portfolio — especially as you get closer to retirement or want to reduce volatility. They are not the focus of what we teach, but understanding where they fit helps you see the full picture.
                </p>
              </section>

              {/* ── Section 5: Your Roadmap ── */}
              <section id="your-roadmap" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Compass size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Your Personal Investing Roadmap
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
                  Knowing what to invest in is only half the equation. The other half is building a process you can actually follow. Here is a practical framework:
                </p>

                <div className="bg-white rounded-lg border border-[#e8e4dc] p-8 my-4 shadow-sm">
                  <div className="space-y-5">
                    {[
                      {
                        title: 'Get Clear on Your Timeline',
                        desc: 'Are you investing for a goal five years away or thirty? Short timelines call for more conservative allocations. Longer timelines give you room to ride out market dips and benefit from growth.',
                      },
                      {
                        title: 'Open the Right Account',
                        desc: 'A 401(k) or IRA offers tax advantages for retirement savings. A standard brokerage account gives you flexibility to invest and withdraw on your own schedule. Many people use both.',
                      },
                      {
                        title: 'Automate Your Contributions',
                        desc: 'Set up recurring transfers so investing happens automatically. Removing the decision from each paycheck eliminates the temptation to skip months or time the market.',
                      },
                      {
                        title: 'Learn Before You Leverage',
                        desc: 'Paper trade or start with small positions before committing significant capital. At Trader Foundation, every student practices with our Time Machine review process before risking real money.',
                      },
                      {
                        title: 'Review, Do Not React',
                        desc: 'Check your portfolio periodically — monthly or quarterly — but resist the urge to make changes based on daily headlines. Emotional decisions are the number one wealth destroyer for individual investors.',
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
              </section>

              {/* ── Section 6: Common Mistakes ── */}
              <section id="common-mistakes" className="mb-16 scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <GraduationCap size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Mistakes That Cost New Investors Thousands
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
                  We have coached over 1,200 students, and we see the same patterns repeat. Avoiding these pitfalls will put you ahead of most beginners before you even place your first trade:
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      mistake: 'Chasing hot tips from social media',
                      fix: 'By the time a stock is trending on Twitter or TikTok, the move has usually already happened. A disciplined system based on technical analysis beats hype every time.',
                    },
                    {
                      mistake: 'Investing money you cannot afford to lose',
                      fix: 'Build an emergency fund first — three to six months of expenses in cash. Only invest capital you will not need in the near term.',
                    },
                    {
                      mistake: 'Trying to time the market perfectly',
                      fix: 'Nobody consistently buys at the bottom and sells at the top. Consistent contributions over time outperform market timing in virtually every study.',
                    },
                    {
                      mistake: 'Ignoring risk management',
                      fix: 'Every trade should have a plan for what happens if it goes wrong. Position sizing, stop losses, and defined-risk options strategies are not optional — they are essential.',
                    },
                    {
                      mistake: 'Going it alone without a mentor',
                      fix: 'Self-taught traders often develop bad habits that take years to unlearn. A structured program with 1-on-1 coaching accelerates your learning curve dramatically.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm"
                    >
                      <p className="font-semibold text-[#111] text-[0.95rem] mb-2 flex items-start gap-2">
                        <span className="text-red-400 shrink-0">✕</span>
                        {item.mistake}
                      </p>
                      <p className="text-[#666] text-[0.9rem] leading-relaxed mb-0 ml-6">
                        <span className="text-emerald-600 font-semibold">Instead:</span>{' '}
                        {item.fix}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  The common thread in all of these mistakes? <strong>Lack of education and lack of accountability.</strong> That is exactly what Trader Foundation was built to solve. Our program pairs you with a personal coach who reviews your trades, corrects your approach in real time, and keeps you on track when emotions run high.{' '}
                  <a href="/trading-tools" className="text-[#c7ab77] font-semibold hover:underline">
                    See the tools our students use →
                  </a>
                </p>
              </section>

              {/* ── Bottom CTA ── */}
              <section className="bg-[#111] rounded-lg p-8 md:p-10">
                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Start Your Trading Education Today
                </h2>
                <p className="text-white/60 text-[1rem] mb-6 leading-relaxed">
                  Over 1,200 students have gone through our program. Watch the free masterclass to see how our swing trading system works — and decide if it is the right fit for you.
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
