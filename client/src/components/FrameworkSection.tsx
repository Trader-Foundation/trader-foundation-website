/*
 * What you actually get, Trader Foundation
 * Vlad's framework document: the road in order, what runs alongside it the
 * whole time, and where it leaves students. Set as an editorial table rather
 * than cards; the numbers stay because the sequence is the information.
 */

const road = [
  { title: 'Onboarding', desc: 'Clarity on the whole road, and a person beside you from day one.' },
  { title: 'Foundation & Psychology', desc: 'Chapter one, not chapter nine. Built to hold up in any market.' },
  { title: 'The Tools', desc: 'What each indicator actually does, and why none of them work alone.' },
  { title: 'Stocks', desc: 'Real charts, real setups. The foundation everything sits on.' },
  { title: 'Options', desc: 'The same read, a smaller commitment, more control.' },
  { title: 'The Paycheck Collector', desc: 'For a market going nowhere. Time works for you, not against you.' },
];

const running = [
  'Your own coach, who knows your name',
  'Weekly one-on-one check-ins',
  'Homework reviewed and handed back',
  'Assessments, so you know what you know',
  'An accountability partner from day one',
  'A live trading room, open five days a week',
  'A community to ask anything, any time',
  'Stocks To Buy And Why, daily, losses included',
  'Trade ideas, once you have the foundation',
];

const outcomes = [
  'Swing trading on your own schedule',
  'A plan you wrote, that you can run alone',
  'Something to do in every kind of market',
];

export default function FrameworkSection() {
  return (
    <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[16ch]">
          What you actually get
        </h2>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* The road */}
          <div className="lg:col-span-7">
            <h3 className="text-[1.0625rem] font-semibold text-[#1a1a1a] pb-3 border-b-2 border-[#1a1a1a]">The road</h3>
            <ol className="mt-6">
              {road.map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[#ece8e0] py-5"
                >
                  <span className="tf-nums text-[0.9375rem] text-[#767269] pt-0.5" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-[1.125rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-[#55534e] text-[1rem] leading-[1.65] max-w-[48ch]">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Running the whole time */}
          <div className="lg:col-span-5">
            <h3 className="text-[1.0625rem] font-semibold text-[#1a1a1a] pb-3 border-b-2 border-[#1a1a1a]">Running the whole time</h3>
            <ul className="mt-6">
              {running.map((item) => (
                <li
                  key={item}
                  className="border-t border-[#ece8e0] py-3 text-[#55534e] text-[0.9375rem] leading-[1.5]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Where it leaves you */}
        <div className="mt-14 sm:mt-16 pt-9 border-t border-[#1a1a1a]">
          <h3 className="text-[1.0625rem] font-semibold text-[#1a1a1a]">Where it leaves you</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-6">
            {outcomes.map((outcome) => (
              <p
                key={outcome}
                className="text-[1.25rem] sm:text-[1.375rem] font-semibold text-[#1a1a1a] tracking-[-0.02em] leading-[1.3]"
              >
                {outcome}
              </p>
            ))}
          </div>
          <p className="mt-10 text-[0.9375rem] text-[#767269] max-w-[60ch]">
            Sixteen students a month, because every one of them gets a coach. Conditional
            90-day guarantee.
          </p>
        </div>
      </div>
    </section>
  );
}
