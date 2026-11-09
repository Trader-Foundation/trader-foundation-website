import React from 'react';
import ChapterLayout, { type Chapter } from '@/components/ChapterLayout';

/*
 * Investing 101, Trader Foundation
 *
 * Register, per vladt83's brief of 2026-11-09: the reader is a successful
 * professional in their 40s to 60s with capital they earned and want to manage
 * themselves, not a beginner with nothing saved. No dollar figures, no
 * percentages, no win rates, no income claims. Nothing is called easy, nothing
 * is called free, and no sentence promises a result the market decides.
 */

/* Chapter data. Labels double as the contents list and each chapter's h2. */
const CHAPTERS: Chapter[] = [
  { id: 'why-invest', label: 'Why This Matters Once You Have Capital' },
  { id: 'how-money-grows', label: 'How Capital Actually Compounds' },
  { id: 'inflation-trap', label: 'What Inflation Quietly Takes' },
  { id: 'asset-classes', label: 'The Major Asset Classes, Plainly' },
  { id: 'your-roadmap', label: 'Building a Process You Will Follow' },
  { id: 'common-mistakes', label: 'The Mistakes We See Most Often' },
];

/* ── Chapter Content Components ── */
function ChapterWhyInvest() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        You have already done the hard part. You built a career, you earned the money, and you
        have capital that should be doing something other than sitting in a checking account.
        The question is no longer whether to invest. It is who decides.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        For most people the answer is somebody else. A fund, an advisor, a model portfolio
        picked years ago and never revisited since. That is a legitimate choice. But it means
        the person with the most at stake is the one furthest from the decision, and closing
        that gap is what this page is about.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        Trader Foundation teaches one strategy, start to finish:{' '}
        <a
          href="/paycheck-collector"
          className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
        >
          the Paycheck Collector
        </a>
        . You sell options, you are paid the premium when you place the trade, and every
        position has protection built into it so your worst case is known before you click. It
        is built to be run around a career, not instead of one. Every student gets their own
        coach.
      </p>
    </>
  );
}

function ChapterHowMoneyGrows() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Compounding is the one piece of this that needs no persuasion. When returns are left in
        place, they generate returns of their own. It is arithmetic rather than a strategy, and
        the variable that matters most is the one you cannot buy back: time already spent.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        What follows is how that arithmetic tends to feel from the inside, not a projection. The
        early years look like nothing is happening, because at that stage what you add matters
        more than what the account earns. That is the stretch where most people stop.
      </p>

      <div className="bg-[#141414] p-8 my-10">
        <h3 className="text-[1.125rem] font-semibold text-white tracking-[-0.015em] mb-2">
          How the stretches tend to feel
        </h3>
        <p className="text-white/50 text-[0.9375rem] mb-7 max-w-[56ch]">
          A description of the arithmetic, not a forecast. What any particular account does
          depends on the market and on what you put into it.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
          {[
            {
              year: 'The first stretch',
              title: 'Contributions do the work',
              desc: 'Growth feels slow because it is. What you put in matters more than what the account earns. Discipline is the only thing separating people here.',
            },
            {
              year: 'The middle stretch',
              title: 'Returns start to show',
              desc: 'The account begins moving on its own rather than only on what you add. Nothing dramatic happens; the arithmetic simply becomes visible.',
            },
            {
              year: 'The long stretch',
              title: 'Gains compound on gains',
              desc: 'Earlier returns are now generating returns themselves. This is the part people picture at the start, and the part that requires having stayed.',
            },
            {
              year: 'Later',
              title: 'Capital you can draw on',
              desc: 'Decisions made decades earlier are what give you options now. Which options, and how many, is not something anyone can promise you in advance.',
            },
          ].map((item, i) => (
            <div key={item.year} className="border-t border-white/15 py-5">
              <dt className="font-semibold text-white text-[1rem]">
                <span className="tf-nums text-white/40 font-normal mr-2.5" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item.title}
              </dt>
              <dd className="text-white/60 text-[0.9375rem] mt-2 leading-[1.6]">
                {item.year}. {item.desc}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        <strong>Run it with your own numbers.</strong> Put in your own starting capital,
        contribution and assumed rate, and see what the arithmetic does with them. The
        assumptions are yours, and so is what you conclude from them.{' '}
        <a
          href="/calculator"
          className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
        >
          Open the compound interest calculator
        </a>
      </p>
    </>
  );
}

function ChapterInflationTrap() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Capital held in cash loses purchasing power. Not dramatically, and not in a way that
        shows up on a statement, which is exactly why it goes unnoticed. The balance stays the
        same while what it buys shrinks.
      </p>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        You have watched this happen across a working lifetime. The things you bought early in
        your career cost more now. Your income probably kept pace. The cash you set aside did
        not, and the gap between those two is quiet, steady and permanent.
      </p>

      <div className="border-t-2 border-[#1a1a1a] pt-6 my-8">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-0">
          {[
            {
              label: 'Cash and savings',
              note: 'Nominally safe. Loses purchasing power whenever prices rise faster than the rate it pays, which is most of the time.',
            },
            {
              label: 'Government bonds',
              note: 'Lower risk and lower return than equities. Usually discussed as the thing that roughly keeps pace with prices.',
            },
            {
              label: 'Equities',
              note: 'Carry a real risk of loss, and historically the asset class that has outpaced prices over long periods.',
            },
          ].map((item) => (
            <div key={item.label} className="border-t border-[#ece8e0] py-5 sm:border-t-0 sm:pt-0">
              <dt className="text-[1rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
                {item.label}
              </dt>
              <dd className="text-[#55534e] text-[0.9375rem] leading-[1.6] mt-2">{item.note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        None of that is an argument for moving everything into the market tomorrow. It is an
        argument that <strong>leaving capital where it is, is itself a decision</strong>, and
        one worth making deliberately rather than by default. How any asset class has behaved
        before is not a guide to what it will do next.
      </p>
    </>
  );
}

function ChapterAssetClasses() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-6">
        Before you put capital anywhere it is worth being precise about what you are actually
        buying. These are the categories most of the decision lives in.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">
        Individual stocks
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        A share is a piece of a business. If the business becomes more valuable, so does the
        share; if it struggles, the share follows it down. Single companies carry more risk than
        a basket of them, which is the trade you make in exchange for the chance of more. What
        we teach uses stocks as the thing an option is written against, chosen on technical
        criteria rather than on a view about the company.
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">
        Index funds and ETFs
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        Instead of choosing companies, you buy the whole basket. An S&amp;P 500 fund gives you a
        position in 500 of the largest US companies in one purchase. ETFs work much the same way
        but trade through the day like a share. Both are ordinary ways to hold a long-term core
        without researching hundreds of businesses.{' '}
        <a
          href="/stocks-and-index"
          className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
        >
          More on stocks and index funds
        </a>
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">
        Options
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-5">
        An option is a contract giving the right to buy or sell at a set price before a set
        date. Used one way it is a leveraged bet. Used another it is a way to be paid for taking
        on a defined, capped obligation. What we teach is the second kind,{' '}
        <strong>defined-risk option selling</strong>, where the most a position can cost you is
        known before you place it. Defined risk is not the same thing as safe, and these pages
        say so wherever it matters.{' '}
        <a
          href="/options-trading"
          className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
        >
          How options actually work
        </a>
      </p>

      <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em] mt-12 mb-3 pt-5 border-t border-[#e3ded4]">
        Bonds and fixed income
      </h3>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        A bond is a loan to a government or a company in exchange for interest. Lower risk and
        lower return than equities, which makes it the usual counterweight in a portfolio as a
        timeline shortens. It is not what we teach, but knowing where it sits is part of seeing
        the whole picture.
      </p>
    </>
  );
}

function ChapterRoadmap() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-6">
        Knowing what to buy is the smaller half. The larger half is a process you will still be
        following in a year, once it has stopped being interesting.
      </p>

      <div className="border-t-2 border-[#1a1a1a] pt-2 my-8">
        <ol>
          {[
            {
              title: 'Be honest about the timeline',
              desc: 'Capital you need in five years and capital you need in thirty are not the same capital, and should not be treated as though they are.',
            },
            {
              title: 'Put it in the right account',
              desc: 'A 401(k) or IRA carries tax advantages for retirement. A brokerage account gives you control over when you act and when you take money out. Most people in this position use both.',
            },
            {
              title: 'Make the contributions automatic',
              desc: 'Recurring transfers remove the monthly decision, and with it the temptation to wait for a better moment. There is rarely an obviously better moment.',
            },
            {
              title: 'Practise before you commit capital',
              desc: 'Paper trade the full process first. Every student here places paper trades and reviews them with a coach before any real money is at risk.',
            },
            {
              title: 'Review on a schedule, not on the news',
              desc: 'Look at it monthly or quarterly. Reacting to headlines is the most expensive habit an individual investor can have, and the hardest one to notice in yourself.',
            },
          ].map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-[#ece8e0] py-5"
            >
              <span className="tf-nums text-[0.9375rem] text-[#767269] pt-0.5" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] text-[1.0625rem] tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-[#55534e] text-[0.9375rem] mt-1.5 mb-0 leading-[1.6] max-w-[58ch]">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function ChapterMistakes() {
  return (
    <>
      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch] mb-6">
        We have coached over 1,200 students. The same handful of mistakes comes up again and
        again, and none of them are about intelligence.
      </p>

      <div className="mb-8">
        {[
          {
            mistake: 'Acting on something you read on social media',
            fix: 'By the time a ticker is trending, the move it is trending for has usually already happened. A rule you wrote down beforehand is worth more than a reason you found afterwards.',
          },
          {
            mistake: 'Putting in capital you actually need',
            fix: 'Cash for several months of expenses sits outside all of this. What you trade with is money whose absence would not change any decision you have to make this year.',
          },
          {
            mistake: 'Waiting for the right moment to start',
            fix: 'Nobody buys the bottom twice. Contributing on a schedule has held up better than timing in study after study, and it asks far less of you.',
          },
          {
            mistake: 'Treating risk management as the optional part',
            fix: 'Every position needs an answer to what happens if it goes against you, decided before you place it. Position sizing and defined risk are the method, not an add-on to it.',
          },
          {
            mistake: 'Learning it alone',
            fix: 'Self-taught traders tend to build habits that take years to notice and longer to unlearn. Having someone review your actual trades shortens that considerably.',
          },
        ].map((item) => (
          <div key={item.mistake} className="border-t border-[#1a1a1a] pt-5 pb-6">
            <h3 className="font-semibold text-[#1a1a1a] text-[1.0625rem] tracking-[-0.01em] mb-2">
              {item.mistake}
            </h3>
            <p className="text-[#55534e] text-[0.9375rem] leading-[1.65] mb-0 max-w-[62ch]">
              <span className="font-semibold text-[#3a3834]">Instead.</span> {item.fix}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[1.0625rem] leading-[1.7] text-[#3a3834] max-w-[68ch]">
        What these have in common is not a knowledge gap. It is that nobody was watching. That
        is what the coaching is for: someone who sees your actual trades, tells you when your
        approach has drifted, and is there in the stretch where you would otherwise talk
        yourself into something.{' '}
        <a
          href="/trading-tools"
          className="font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
        >
          The tools our students use
        </a>
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
  return (
    <ChapterLayout
      title={'Investing 101'}
      heading={'Investing 101'}
      deck={
        'The groundwork, written for someone who already has capital to put to work. What compounding does over time, what inflation quietly takes, and where the major asset classes actually differ.'
      }
      description={
        'Investing fundamentals for people with capital to manage: how compounding works, what inflation costs you, and how the major asset classes differ.'
      }
      path={'/investing-101'}
      chapters={CHAPTERS}
      content={CHAPTER_CONTENT}
    />
  );
}
