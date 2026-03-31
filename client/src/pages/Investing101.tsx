/*
 * Investing 101 Page — Trader Foundation
 * Two-column educational article layout with sticky sidebar CTA
 * Design: dark/gold premium aesthetic, long-form SEO-rich content
 */

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, TrendingUp, Shield, DollarSign, BarChart3, BookOpen, Target } from 'lucide-react';

const SIDEBAR_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/investing101-sidebar-C8V9kWAFyEQ4Vd9xJTZg4F.webp';

export default function Investing101() {
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
            <a href="/" className="hover:text-[#c7ab77] transition-colors">
              Home
            </a>
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
            Everything you need to know to start building wealth through smart,
            disciplined investing.
          </p>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Article Content (Left Column) ── */}
          <article className="flex-1 min-w-0">
            <div
              className="prose prose-lg max-w-none text-[#2c2c2c]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Section 1 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Why Should You Start Investing?
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Investing is one of the most powerful tools available for
                  building long-term wealth. While keeping money in a savings
                  account provides security, it rarely keeps pace with
                  inflation—meaning your purchasing power actually decreases over
                  time. Whether your goal is financial independence, early
                  retirement, or simply a more comfortable future, investing
                  provides the growth engine that savings alone cannot deliver.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  At Trader Foundation, we believe that everyone deserves access
                  to the knowledge and strategies that professional investors
                  use. Our approach strips away the complexity and focuses on
                  what actually works—disciplined, research-backed investing that
                  compounds over time.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <DollarSign size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    The Power of Compounding
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Albert Einstein reportedly called compound interest the
                  "eighth wonder of the world." Whether or not the attribution
                  is accurate, the principle is undeniable. Compounding occurs
                  when your investment returns generate their own returns,
                  creating an exponential growth curve that accelerates over
                  time.
                </p>

                {/* Compounding steps */}
                <div className="bg-[#111] rounded-lg p-8 my-8">
                  <h3
                    className="text-lg font-bold text-white mb-6"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    How Compounding Works:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: '01',
                        title: 'Initial Investment',
                        desc: 'You allocate capital into stocks, index funds, or other appreciating assets.',
                      },
                      {
                        step: '02',
                        title: 'Returns Accumulate',
                        desc: 'Your investment generates returns through dividends, interest, or capital appreciation.',
                      },
                      {
                        step: '03',
                        title: 'Reinvestment',
                        desc: 'Instead of withdrawing, you reinvest those earnings back into the market.',
                      },
                      {
                        step: '04',
                        title: 'Exponential Growth',
                        desc: 'Your reinvested returns generate their own returns, creating a snowball effect.',
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start gap-4 p-4 rounded-md bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="text-[#c7ab77] font-bold text-sm shrink-0 mt-0.5">
                          {item.step}
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
                    <strong>Example:</strong> If you invest $10,000 at an annual
                    return of 8% and let it compound for 30 years, your
                    investment would grow to over{' '}
                    <strong className="text-[#111]">$100,626</strong>—without
                    adding a single additional dollar. Start earlier, and the
                    numbers become even more remarkable.{' '}
                    <a
                      href="/calculator"
                      className="text-[#c7ab77] font-semibold hover:underline"
                    >
                      Try our Compound Interest Calculator →
                    </a>
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Shield size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Outpacing Inflation
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Inflation silently erodes the purchasing power of your money
                  every year. A dollar today buys less than a dollar five years
                  ago. If your savings sit in a traditional bank account earning
                  0.5% while inflation runs at 3%, you are effectively losing
                  2.5% of your wealth annually.
                </p>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Strategic investing in assets that appreciate over time is the
                  most reliable way to not just preserve your wealth, but grow
                  it. Historically, the stock market has delivered average annual
                  returns of 7–10%, significantly outpacing inflation and
                  providing real wealth growth for disciplined investors.
                </p>

                {/* Inflation comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                  {[
                    {
                      label: 'Savings Account',
                      rate: '~0.5%',
                      verdict: 'Loses to inflation',
                      color: 'text-red-500',
                    },
                    {
                      label: 'Bonds',
                      rate: '~3–5%',
                      verdict: 'Keeps pace',
                      color: 'text-yellow-600',
                    },
                    {
                      label: 'Stock Market',
                      rate: '~7–10%',
                      verdict: 'Beats inflation',
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
                        {item.verdict}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <Target size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Building Financial Freedom
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Financial freedom means having enough wealth and passive
                  income to support your lifestyle without relying on a
                  traditional paycheck. Investing is the primary vehicle for
                  achieving this goal, allowing you to build wealth
                  systematically and create multiple income streams.
                </p>

                <div className="bg-white rounded-lg border border-[#e8e4dc] p-8 my-8 shadow-sm">
                  <h3
                    className="text-lg font-bold text-[#111] mb-5"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Steps to Build Long-Term Wealth:
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Start Early',
                        desc: 'The sooner you begin, the more time compounding has to work in your favor.',
                      },
                      {
                        title: 'Diversify Your Portfolio',
                        desc: 'Spread investments across stocks, index funds, and other assets to manage risk.',
                      },
                      {
                        title: 'Stay Consistent',
                        desc: 'Regular contributions—even small ones—create powerful momentum over time.',
                      },
                      {
                        title: 'Reinvest Earnings',
                        desc: 'Let dividends and gains compound instead of withdrawing them.',
                      },
                      {
                        title: 'Think Long-Term',
                        desc: 'Avoid short-term speculation. Patience and discipline are the real edge.',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <span className="w-7 h-7 rounded-full bg-[#c7ab77]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#c7ab77] text-xs font-bold">
                            {i + 1}
                          </span>
                        </span>
                        <div>
                          <span className="font-semibold text-[#111] text-[0.95rem]">
                            {item.title}
                          </span>
                          <p className="text-[#666] text-[0.9rem] mt-0.5 mb-0">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Understanding Your Investment Options
                  </h2>
                </div>

                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  The investment landscape can feel overwhelming, but it
                  ultimately comes down to a few core asset classes. Understanding
                  each one helps you make informed decisions about where to
                  allocate your capital.
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Stocks, Index Funds & ETFs
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  <strong>Stocks</strong> represent ownership in individual
                  companies. They offer the highest growth potential but come
                  with greater volatility.{' '}
                  <strong>Index funds</strong> track a broad market index like
                  the S&P 500, providing instant diversification at low cost.{' '}
                  <strong>ETFs</strong> (Exchange-Traded Funds) combine the
                  diversification of index funds with the trading flexibility of
                  individual stocks. For most beginners, index funds and ETFs
                  offer the best risk-adjusted starting point.{' '}
                  <a
                    href="/stocks-and-index"
                    className="text-[#c7ab77] font-semibold hover:underline"
                  >
                    Learn more about Stocks & Index investing →
                  </a>
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Options & Advanced Strategies
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Options contracts give you the right—but not the
                  obligation—to buy or sell an asset at a predetermined price.
                  They can be used for hedging, income generation, or
                  leveraged speculation. While powerful, options require a
                  deeper understanding of market mechanics and risk management.{' '}
                  <a
                    href="/options-trading"
                    className="text-[#c7ab77] font-semibold hover:underline"
                  >
                    Explore our Options Trading guide →
                  </a>
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Risk Tolerance: Finding Your Balance
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Every investor has a different risk tolerance based on their
                  age, income, goals, and temperament. A well-constructed
                  portfolio balances higher-risk, higher-reward investments
                  (like growth stocks) with more stable assets (like bonds or
                  dividend-paying blue chips). The key is to build a portfolio
                  you can stick with through market cycles without panic selling.
                </p>
              </section>

              {/* Section 6 */}
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
                    <BookOpen size={20} className="text-[#c7ab77]" />
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-[#111] m-0"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Getting Started: Your First Steps
                  </h2>
                </div>

                <h3
                  className="text-xl font-bold text-[#111] mt-6 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  1. Define Your Financial Goals
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  Before investing a single dollar, clarify what you are
                  investing for. Short-term goals (1–5 years) might include an
                  emergency fund or a down payment. Long-term goals (10+ years)
                  typically involve retirement or generational wealth. Your
                  timeline determines your strategy.
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  2. Choose the Right Account
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  <strong>401(k):</strong> Employer-sponsored retirement account
                  with tax advantages and potential employer matching.{' '}
                  <strong>IRA (Traditional/Roth):</strong> Individual retirement
                  accounts offering tax-deferred or tax-free growth.{' '}
                  <strong>Brokerage Account:</strong> A flexible, taxable
                  account for investing without withdrawal restrictions—ideal
                  for goals beyond retirement.
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  3. Start Small, Stay Consistent
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  You do not need thousands of dollars to begin. Many platforms
                  allow you to start with as little as $1. What matters most is
                  consistency—setting up automatic contributions and letting
                  time do the heavy lifting. Dollar-cost averaging (investing a
                  fixed amount at regular intervals) removes the guesswork of
                  market timing and reduces the impact of volatility.
                </p>

                <h3
                  className="text-xl font-bold text-[#111] mt-8 mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  4. Educate Yourself Continuously
                </h3>
                <p className="text-[1.05rem] leading-relaxed text-[#444]">
                  The best investors never stop learning. Markets evolve,
                  strategies adapt, and new opportunities emerge. Trader
                  Foundation provides the structured education and mentorship
                  you need to stay ahead—from foundational concepts to advanced
                  trading strategies.{' '}
                  <a
                    href="/trading-tools"
                    className="text-[#c7ab77] font-semibold hover:underline"
                  >
                    Explore our Trading Tools →
                  </a>
                </p>
              </section>

              {/* Bottom CTA */}
              <section className="bg-[#111] rounded-lg p-8 md:p-10">
                <h2
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Ready to Take the Next Step?
                </h2>
                <p className="text-white/60 text-[1rem] mb-6">
                  Join over 1,200 students who have transformed their financial
                  future with Trader Foundation's proven education system.
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
                  alt="Vlad Tayman teaching investing at Trader Foundation"
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
                    Wall Street Secrets
                    <br />
                    for Financial Freedom
                  </h3>
                  <p
                    className="text-white/50 text-[0.85rem] mb-5 leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    This proven trading system can help beginners, busy
                    professionals, retirees, and students achieve the financial
                    freedom they deserve.
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
                    { label: 'Stocks & Index Investing', href: '/stocks-and-index' },
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
