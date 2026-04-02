/*
 * Investing 101 Page - Trader Foundation
 * Chapter-based navigation: TOC on left, selected chapter content on right
 * Design: GOAT Academy style - clean, editorial, three-column layout
 */

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { ArrowRight, ArrowLeft, ChevronRight, Landmark, Layers, LineChart, PiggyBank, Compass, GraduationCap } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

/* ── Chapter data ── */
const CHAPTERS = [
  {
    id: 'why-invest',
    label: 'Why Investing Matters for Your Future',
    icon: Landmark,
  },
  {
    id: 'how-money-grows',
    label: 'How Your Money Actually Grows',
    icon: PiggyBank,
  },
  {
    id: 'inflation-trap',
    label: 'The Inflation Trap Most People Ignore',
    icon: Layers,
  },
  {
    id: 'asset-classes',
    label: 'Breaking Down the Major Asset Classes',
    icon: LineChart,
  },
  {
    id: 'your-roadmap',
    label: 'Your Personal Investing Roadmap',
    icon: Compass,
  },
  {
    id: 'common-mistakes',
    label: 'Mistakes That Cost New Investors Thousands',
    icon: GraduationCap,
  },
];

/* ── Chapter Content Components ── */
function ChapterWhyInvest() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Most people spend decades trading their time for a paycheck. The money comes in, covers expenses, and whatever is left sits in a checking account earning next to nothing. That cycle works until it does not - a job loss, an unexpected expense, or retirement arrives and the safety net is thinner than expected.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Investing breaks that cycle. When you put capital into assets that appreciate - whether stocks, index funds, or options - your money starts working on your behalf, even while you sleep. The goal is not to get rich overnight. The goal is to build a financial foundation that gives you choices: the choice to retire when you want, to weather emergencies without panic, or to leave something meaningful for the next generation.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        At Trader Foundation, we teach a specific approach: <strong>swing trading combined with safe options strategies</strong>. It is designed for people with full-time jobs, families, and limited screen time. You do not need to quit your day job or stare at charts for eight hours. You need a system, discipline, and the willingness to learn.
      </p>
    </>
  );
}

function ChapterHowMoneyGrows() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        There is a reason experienced investors talk about "letting your money work for you." When you invest, your returns can generate their own returns - a process called compounding. It is not magic, but over a long enough timeline, the results can feel like it.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Think of it this way: you plant a tree. In year one, it produces a handful of seeds. You plant those seeds too. By year ten, you do not have one tree - you have a small forest. That is compounding in action. The earlier you start, the larger that forest becomes.
      </p>

      <div className="bg-[#111] rounded-lg p-8 my-8">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
          The Compounding Timeline:
        </h3>
        <div className="space-y-4">
          {[
            { year: 'Year 1–5', title: 'The Foundation Phase', desc: 'Growth feels slow. Your contributions matter more than your returns. This is where most people give up - and where the disciplined separate themselves.' },
            { year: 'Year 5–15', title: 'The Momentum Phase', desc: 'Returns start compounding noticeably. Your portfolio begins growing faster than your contributions alone could achieve.' },
            { year: 'Year 15–25', title: 'The Acceleration Phase', desc: 'This is where patience pays off. Your gains are now generating significant gains of their own. The snowball is rolling.' },
            { year: 'Year 25+', title: 'The Harvest Phase', desc: 'Your portfolio can potentially sustain your lifestyle. The choices you made decades ago are now funding your freedom.' },
          ].map((item) => (
            <div key={item.year} className="flex items-start gap-4 p-4 rounded-md bg-white/[0.04] border border-white/[0.06]">
              <span className="text-[#c7ab77] font-bold text-[0.78rem] shrink-0 mt-0.5 w-16">{item.year}</span>
              <div>
                <span className="font-semibold text-white text-[0.95rem]">{item.title}</span>
                <p className="text-white/60 text-[0.88rem] mt-1 mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#c7ab77]/[0.08] border-l-4 border-[#c7ab77] p-6 rounded-r-lg my-8">
        <p className="text-[1rem] leading-relaxed text-[#333] m-0">
          <strong>Run the numbers yourself:</strong> Plug in your own starting amount, monthly contribution, and expected return rate to see exactly how your wealth could grow over time.{' '}
          <a href="/calculator" className="text-[#c7ab77] font-semibold hover:underline">
            Open the Compound Interest Calculator →
          </a>
        </p>
      </div>
    </>
  );
}

function ChapterInflationTrap() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Here is an uncomfortable truth: if your money is sitting in a standard savings account, you are losing purchasing power every single year. Inflation - the gradual increase in the cost of goods and services - quietly eats away at the value of every dollar you hold.
      </p>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        A cup of coffee that cost $2.00 a decade ago might cost $3.50 today. Your salary may have increased, but has it kept up? For most people, the answer is no. The only reliable way to stay ahead of inflation is to put your capital into assets that grow faster than prices rise.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        {[
          { label: 'Cash in Savings', rate: '0.01–0.5%', note: 'Falling behind every year', color: 'text-red-500' },
          { label: 'Government Bonds', rate: '3–5%', note: 'Roughly keeps pace', color: 'text-yellow-600' },
          { label: 'Equity Markets', rate: '7–10%', note: 'Historically outperforms', color: 'text-emerald-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg border border-[#e8e4dc] p-5 text-center shadow-sm">
            <p className="text-[0.78rem] uppercase tracking-wider text-[#888] font-medium mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-[#111]" style={{ fontFamily: "'Sen', sans-serif" }}>{item.rate}</p>
            <p className={`text-[0.82rem] font-semibold ${item.color} mt-1`}>{item.note}</p>
          </div>
        ))}
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        This does not mean you should throw every dollar into the stock market tomorrow. It means that <strong>doing nothing with your money is itself a decision</strong> - and it is one that costs you more each year. A thoughtful, diversified investment approach is how you protect what you have earned and give it room to grow.
      </p>
    </>
  );
}

function ChapterAssetClasses() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
        Before you allocate a single dollar, it helps to understand what you are actually buying. Here are the primary categories most investors work with:
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Individual Stocks</h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        When you buy a share of stock, you own a small piece of that company. If the company grows and becomes more profitable, the value of your share typically increases. Stocks carry more risk than some other assets because individual companies can underperform, but they also offer the highest potential for long-term growth. At Trader Foundation, our swing trading approach focuses on identifying high-probability stock setups using technical analysis - not guesswork.
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Index Funds & ETFs</h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Rather than picking individual companies, index funds let you invest in a broad basket of stocks at once. An S&P 500 index fund, for example, gives you exposure to 500 of the largest U.S. companies in a single purchase. ETFs (Exchange-Traded Funds) work similarly but trade throughout the day like individual stocks. Both are excellent for building a diversified foundation without needing to research hundreds of companies.{' '}
        <a href="/stocks-and-index" className="text-[#c7ab77] font-semibold hover:underline">Dive deeper into Stocks & Index strategies →</a>
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Options Contracts</h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-4">
        Options give you the right to buy or sell a stock at a specific price within a set timeframe. They can be used conservatively - to protect your portfolio or generate income - or more aggressively for leveraged bets. Our program emphasizes <strong>safe options strategies</strong> that are designed to manage risk, not amplify it. If you are curious about how options fit into a disciplined trading plan, we cover that extensively in our curriculum.{' '}
        <a href="/options-trading" className="text-[#c7ab77] font-semibold hover:underline">Read our Options Trading overview →</a>
      </p>

      <h3 className="text-xl font-bold text-[#111] mt-8 mb-3" style={{ fontFamily: "'Sen', sans-serif" }}>Bonds & Fixed Income</h3>
      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        Bonds are essentially loans you make to a government or corporation in exchange for regular interest payments. They are generally lower risk and lower return than stocks, making them useful for balancing a portfolio - especially as you get closer to retirement or want to reduce volatility. They are not the focus of what we teach, but understanding where they fit helps you see the full picture.
      </p>
    </>
  );
}

function ChapterRoadmap() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
        Knowing what to invest in is only half the equation. The other half is building a process you can actually follow. Here is a practical framework:
      </p>

      <div className="bg-white rounded-lg border border-[#e8e4dc] p-8 my-4 shadow-sm">
        <div className="space-y-5">
          {[
            { title: 'Get Clear on Your Timeline', desc: 'Are you investing for a goal five years away or thirty? Short timelines call for more conservative allocations. Longer timelines give you room to ride out market dips and benefit from growth.' },
            { title: 'Open the Right Account', desc: 'A 401(k) or IRA offers tax advantages for retirement savings. A standard brokerage account gives you flexibility to invest and withdraw on your own schedule. Many people use both.' },
            { title: 'Automate Your Contributions', desc: 'Set up recurring transfers so investing happens automatically. Removing the decision from each paycheck eliminates the temptation to skip months or time the market.' },
            { title: 'Learn Before You Leverage', desc: 'Paper trade or start with small positions before committing significant capital. At Trader Foundation, every student practices with our Time Machine review process before risking real money.' },
            { title: 'Review, Do Not React', desc: 'Check your portfolio periodically - monthly or quarterly - but resist the urge to make changes based on daily headlines. Emotional decisions are the number one wealth destroyer for individual investors.' },
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
    </>
  );
}

function ChapterMistakes() {
  return (
    <>
      <p className="text-[1.05rem] leading-relaxed text-[#444] mb-6">
        We have coached over 1,200 students, and we see the same patterns repeat. Avoiding these pitfalls will put you ahead of most beginners before you even place your first trade:
      </p>

      <div className="space-y-4 mb-8">
        {[
          { mistake: 'Chasing hot tips from social media', fix: 'By the time a stock is trending on Twitter or TikTok, the move has usually already happened. A disciplined system based on technical analysis beats hype every time.' },
          { mistake: 'Investing money you cannot afford to lose', fix: 'Build an emergency fund first - three to six months of expenses in cash. Only invest capital you will not need in the near term.' },
          { mistake: 'Trying to time the market perfectly', fix: 'Nobody consistently buys at the bottom and sells at the top. Consistent contributions over time outperform market timing in virtually every study.' },
          { mistake: 'Ignoring risk management', fix: 'Every trade should have a plan for what happens if it goes wrong. Position sizing, stop losses, and defined-risk options strategies are not optional - they are essential.' },
          { mistake: 'Going it alone without a mentor', fix: 'Self-taught traders often develop bad habits that take years to unlearn. A structured program with 1-on-1 coaching accelerates your learning curve dramatically.' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-[#e8e4dc] p-6 shadow-sm">
            <p className="font-semibold text-[#111] text-[0.95rem] mb-2 flex items-start gap-2">
              <span className="text-red-400 shrink-0">✕</span>
              {item.mistake}
            </p>
            <p className="text-[#666] text-[0.9rem] leading-relaxed mb-0 ml-6">
              <span className="text-emerald-600 font-semibold">Instead:</span> {item.fix}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[1.05rem] leading-relaxed text-[#444]">
        The common thread in all of these mistakes? <strong>Lack of education and lack of accountability.</strong> That is exactly what Trader Foundation was built to solve. Our program pairs you with a personal coach who reviews your trades, corrects your approach in real time, and keeps you on track when emotions run high.{' '}
        <a href="/trading-tools" className="text-[#c7ab77] font-semibold hover:underline">See the tools our students use →</a>
      </p>
    </>
  );
}

/* Map chapter IDs to their content components */
const CHAPTER_CONTENT: Record<string, React.FC> = {
  'why-invest': ChapterWhyInvest,
  'how-money-grows': ChapterHowMoneyGrows,
  'inflation-trap': ChapterInflationTrap,
  'asset-classes': ChapterAssetClasses,
  'your-roadmap': ChapterRoadmap,
  'common-mistakes': ChapterMistakes,
};

export default function Investing101() {
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
            <span className="text-[#c7ab77]">Investing 101</span>
          </div>
        </div>
      </div>

      {/* ── Page Title Banner ── */}
      <div className="bg-[#111] pb-12">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
            Investing <span className="text-[#c7ab77]">101</span>
          </h1>
          <p className="mt-3 text-white/60 text-lg max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A practical, no-nonsense introduction to growing your wealth - written by traders, for future traders.
          </p>
        </div>
      </div>

      {/* ── Main Content: TOC Left | Chapter Right | CTA Far Right ── */}
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
                    Wall Street Secrets for Financial Freedom
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
