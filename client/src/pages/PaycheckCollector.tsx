/*
 * The Paycheck Collector, Trader Foundation
 * The mechanism page. Content follows the Masterclass Talk Track (Vlad's own
 * words) and the taught mechanics: credit spreads, a line drawn well below the
 * stock, protection on every trade, odds visible at setup.
 *
 * Claims discipline, agreed with vladt83 on 2026-10-26:
 * - The 80 to 93 figure is the probability shown at setup, never a record of
 *   results. It is labelled as such everywhere it appears.
 * - No rate of return, no per-trade dollar figures, no compounding projection.
 * - "Defined risk", never "safe".
 * - $15,000 is the capital the method calls for, not an entry requirement.
 */

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const WEBINAR_URL = 'https://live.traderfoundation.com/';

const steps = [
  {
    title: 'You get paid first',
    body: 'The money is in your account the moment you place the trade, not when it closes. That is the paycheck, and it is why the method has the name it does.',
  },
  {
    title: 'It works like insurance',
    body: 'An insurance company is paid up front, and most months nothing happens. It stays safe by being picky about who it covers. You do the same thing: you only take the trades where the odds sit on your side.',
  },
  {
    title: 'You draw a line',
    body: 'You pick a stock and draw a line well below where it trades today. As long as the stock stays above that line, you keep the paycheck. That is the whole idea.',
  },
  {
    title: 'Two pieces: one pays, one protects',
    body: 'Every trade has protection built into it. One piece pays you, the other caps what can go wrong, so your worst case is known before you click. It is also why this needs less capital than the wheel, which ties up a lot of money and leaves you stuck in a crash.',
  },
  {
    title: 'The odds are on the screen before you commit',
    body: 'Trades are set up with roughly 80 to 93 percent odds in your favour at the moment you place them. You see that number before you click. The farther away your line, the better the odds and the smaller the paycheck, and that trade-off is a choice you make deliberately.',
  },
  {
    title: 'Time works for you',
    body: 'Most traders are racing the clock. Here, every day that passes hands you a little more of the paycheck you were already paid.',
  },
];

const threeWays = [
  'The stock goes up',
  'The stock sits still',
  'The stock dips, but stays above your line',
];

export default function PaycheckCollector() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO
        title="The Paycheck Collector"
        description="How the Paycheck Collector works: you are paid when you place the trade, every trade has protection built in, and you see the odds before you commit."
        path="/paycheck-collector"
      />
      <Navigation />

      {/* Hero */}
      <section className="bg-[#faf9f6] pt-[72px]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start pt-12 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
            <div className="lg:col-span-7 tf-rise">
              <h1 className="tf-display text-[#1a1a1a] text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem]">
                The Paycheck
                <br />
                Collector
              </h1>
              <p className="mt-7 text-[#3a3834] text-[1.375rem] sm:text-[1.5rem] leading-[1.45] tracking-[-0.015em] max-w-[30ch]">
                You are paid the moment you place the trade. Every trade has protection built
                into it. One to three trades a month.
              </p>
              <div className="mt-9">
                <a
                  href={WEBINAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-[#c7ab77] text-[#1a1a1a] text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
                >
                  Watch a real trade placed
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="pt-6 border-t border-[#e3ded4] text-[1.0625rem] leading-[1.7] text-[#55534e] max-w-[46ch]">
                Most trading asks you to be right, far and fast: right about the direction, far
                enough that the stock really moves, and fast, before time runs out. Miss one of
                the three and you lose, which is how people are right about a stock and still
                lose money on the option. This needs one thing instead. The stock stays above
                your line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[14ch]">
            How it works
          </h2>
          <ol className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-[#ece8e0] py-6"
              >
                <span className="tf-nums text-[0.9375rem] text-[#767269] pt-1" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[1.25rem] font-semibold text-[#1a1a1a] tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[#55534e] text-[1rem] leading-[1.65] max-w-[52ch]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[0.875rem] text-[#767269] leading-[1.6] max-w-[72ch]">
            The 80 to 93 percent figure is the probability of profit shown by the broker at the
            moment a trade is set up. It describes how the trade is structured, not results any
            student achieved, and it is not a prediction of your outcome.
          </p>
        </div>
      </section>

      {/* Three ways to get paid */}
      <section className="bg-[#141414] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h2 className="tf-display text-white text-[2.25rem] sm:text-[2.75rem] max-w-[18ch]">
            Three ways the trade pays
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-6">
            {threeWays.map((way) => (
              <p
                key={way}
                className="border-t border-[#2c2c2c] pt-5 text-white text-[1.25rem] font-semibold tracking-[-0.015em] leading-[1.35]"
              >
                {way}
              </p>
            ))}
          </div>
          <p className="mt-10 text-white/65 text-[1.0625rem] leading-[1.7] max-w-[60ch]">
            Only one thing has to be true. Most strategies need the market to do something
            specific; this one needs it not to fall through your line.
          </p>
        </div>
      </section>

      {/* What it asks of you */}
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[12ch]">
                What it asks of you
              </h2>
            </div>
            <div className="lg:col-span-7">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                <div className="border-t border-[#e3ded4] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    About <span className="tf-nums">$15,000</span> in trading capital
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">
                    That is what the method calls for to run properly, with the protection in
                    place and the risk controlled. It is your money in your own brokerage
                    account, separate from the cost of the programme. You can start learning
                    with less.
                  </dd>
                </div>
                <div className="border-t border-[#e3ded4] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    One to three trades a month
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">
                    Sessions of about thirty minutes. This is swing trading, not day trading,
                    and not the same-day options that blow accounts up.
                  </dd>
                </div>
                <div className="border-t border-[#e3ded4] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    The patience to take the smaller paycheck
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">
                    A bigger payout means your line sits close to the stock, which is close to a
                    coin flip. The discipline is refusing the trades that pay too well.
                  </dd>
                </div>
                <div className="border-t border-[#e3ded4] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    A foundation first
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">
                    You learn to read a chart before you sell anything. The Paycheck Collector
                    sits at the end of the road, not the start of it.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Honest risk */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[12ch]">
                What it is not
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[60ch]">
                It is not safe. It is <strong className="font-semibold text-[#1a1a1a]">defined
                risk</strong>, which is a different claim and the true one: you know the most a
                trade can cost you before you place it, and that amount can still be lost.
              </p>
              <p className="mt-6 text-[#55534e] text-[1.0625rem] leading-[1.7] max-w-[60ch]">
                Trades go against you. When one does, you close it and take a loss up to that
                known maximum. Nobody wins every trade, and any month can be a losing month. The
                method is a way of putting the odds and the clock on your side, not a way of
                removing risk from trading.
              </p>
              <p className="mt-6 text-[#55534e] text-[1.0625rem] leading-[1.7] max-w-[60ch]">
                It is also not a rate of return. We do not publish one, and you should be wary
                of anyone who does.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Where it sits */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[14ch]">
                One of three, not one trick
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[60ch]">
                You do not get to choose which market shows up, so you learn three strategies and
                when each one applies.
              </p>
              <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-8">
                <div className="border-t border-[#1a1a1a] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">Bounce Profit</dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.6]">
                    For a market that is trending.
                  </dd>
                </div>
                <div className="border-t border-[#1a1a1a] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    The Paycheck Collector
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.6]">
                    For a market going sideways and nowhere.
                  </dd>
                </div>
                <div className="border-t border-[#1a1a1a] pt-5">
                  <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a]">
                    Ready, Set, Explode
                  </dt>
                  <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.6]">
                    For when things get volatile.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="max-w-[46rem]">
            <h2 className="tf-display text-[#1a1a1a] text-[1.75rem] sm:text-[2.25rem]">
              See a trade placed, live
            </h2>
            <p className="mt-4 text-[#55534e] text-[1.0625rem] leading-[1.6] max-w-[52ch]">
              Vlad places a real Paycheck Collector trade on the webinar and talks through the
              line, the protection and the odds before he clicks.
            </p>
            <div className="mt-8">
              <a
                href={WEBINAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#c7ab77] text-[#1a1a1a] text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
              >
                Join the live webinar
              </a>
            </div>
            <p className="mt-10 pt-6 border-t border-[#ece8e0] text-[0.875rem] text-[#767269] leading-[1.6] max-w-[72ch]">
              Educational content only, not financial advice. Options trading involves risk,
              including the loss of the capital you put at risk. Trader Foundation does not
              promise any income or return. See our{' '}
              <a href="/earnings-disclaimer" className="underline decoration-[#c9c4b8] hover:text-[#1a1a1a]">
                earnings disclaimer
              </a>{' '}
              and{' '}
              <a href="/trading-disclaimer" className="underline decoration-[#c9c4b8] hover:text-[#1a1a1a]">
                trading disclaimer
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
