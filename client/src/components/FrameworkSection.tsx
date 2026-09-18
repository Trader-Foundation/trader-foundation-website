/*
 * Framework Section, Trader Foundation
 * The program's logic: the road students walk, what runs alongside it the
 * whole time, and where it leaves them.
 * Fonts: Sen (headings), DM Sans (body). Copy is Vlad's framework document,
 * kept close to verbatim.
 */

import { Check } from 'lucide-react';

const road = [
  {
    title: 'Onboarding',
    desc: 'Clarity on the whole road, and a person beside you from day one.',
  },
  {
    title: 'Foundation & Psychology',
    desc: 'Chapter one, not chapter nine. Built to hold up in any market.',
  },
  {
    title: 'The Tools',
    desc: 'What each indicator actually does, and why none of them work alone.',
  },
  {
    title: 'Stocks',
    desc: 'Real charts, real setups. The foundation everything sits on.',
  },
  {
    title: 'Options',
    desc: 'The same read, a smaller commitment, more control.',
  },
  {
    title: 'The Paycheck Collector',
    desc: 'For a market going nowhere. Time works for you, not against you.',
  },
];

const running = [
  'Your own coach, who knows your name',
  'Weekly one-on-one check-ins',
  'Homework reviewed and handed back',
  'Assessments, so you know what you know',
  'An accountability partner from day one',
  'The room, live five days a week',
  'A community to ask anything, any time',
  'Stocks To Buy And Why, wins and losses',
  'Trade ideas, once you have the foundation',
  'A financial professional for the wider picture',
];

const outcomes = [
  'Swing trading on your own schedule',
  'A plan you wrote, that you can run alone',
  'Something to do in every kind of market',
];

const HEADING = "'Sen', sans-serif";
const BODY = "'DM Sans', sans-serif";

export default function FrameworkSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#0a0a0a] border-t border-[#c7ab77]/20">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: BODY }}
          >
            The Program
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
            style={{ fontFamily: HEADING }}
          >
            What You <span className="text-[#c7ab77]">Actually Get</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14">
          {/* The road */}
          <div>
            <h3
              className="text-[0.8rem] font-bold tracking-[0.2em] uppercase text-white/60 pb-4 mb-8 border-b border-white/15"
              style={{ fontFamily: BODY }}
            >
              The Road
            </h3>
            <ol className="relative">
              {road.map((step, i) => (
                <li key={step.title} className="relative pl-14 sm:pl-16 pb-8 last:pb-0">
                  {i < road.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[19px] top-11 bottom-0 w-px bg-[#c7ab77]/30"
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#c7ab77]/60 bg-[#0a0a0a] text-[#c7ab77] text-sm font-bold"
                    style={{ fontFamily: BODY }}
                  >
                    {i + 1}
                  </span>
                  <h4
                    className="text-white text-lg font-bold mb-1.5 pt-1.5"
                    style={{ fontFamily: HEADING }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="text-white/65 text-[0.95rem] leading-relaxed"
                    style={{ fontFamily: BODY }}
                  >
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Running the whole time */}
          <div className="flex flex-col">
            <h3
              className="text-[0.8rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] pb-4 mb-8 border-b border-[#c7ab77]/25"
              style={{ fontFamily: BODY }}
            >
              Running the Whole Time
            </h3>
            <ul className="flex-1 flex flex-col justify-between gap-4 rounded-xl border border-[#c7ab77]/25 bg-white/[0.03] p-6 sm:p-8">
              {running.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.5}
                    className="h-5 w-5 shrink-0 mt-0.5 text-[#7ee0a8]"
                  />
                  <span
                    className="text-white/85 text-[0.95rem] leading-snug"
                    style={{ fontFamily: BODY }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Where it leaves you */}
        <div className="mt-16 pt-12 border-t border-[#c7ab77]/25">
          <h3
            className="text-[0.8rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] text-center mb-8"
            style={{ fontFamily: BODY }}
          >
            Where It Leaves You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {outcomes.map((outcome) => (
              <p
                key={outcome}
                className="rounded-lg border border-white/12 bg-white/[0.04] px-6 py-6 text-center text-white text-base font-bold leading-snug"
                style={{ fontFamily: HEADING }}
              >
                {outcome}
              </p>
            ))}
          </div>
          <p
            className="mt-8 text-center text-white/60 text-sm leading-relaxed"
            style={{ fontFamily: BODY }}
          >
            Sixteen students a month, because every one of them gets a coach.
            <span className="mx-2 text-[#c7ab77]" aria-hidden="true">
              ·
            </span>
            Conditional 90-day guarantee.
          </p>
        </div>
      </div>
    </section>
  );
}
