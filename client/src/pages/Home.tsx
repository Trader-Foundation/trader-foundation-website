/*
 * Home Page, Trader Foundation Academy
 * Design: editorial, near-monochrome. Off-white ground, near-black ink, one
 * typeface, photographs as plain rectangles, brand gold reserved for the
 * single action. Sections flow: Nav → Hero → Trust band → Who is Vlad →
 * Reviews → The Paycheck Collector → What you actually get → Results → Guarantee →
 * Webinar → Podcast → Footer.
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MeetVladSection from '@/components/MeetVladSection';
import FrameworkSection from '@/components/FrameworkSection';
import BookCallCTA from '@/components/BookCallCTA';
import PodcastSection from '@/components/PodcastSection';
import Footer from '@/components/Footer';

import SEO from '@/components/SEO';

/* Display crops of the two Fidelity captures, framed on the balance and the
 * three-year curve. The originals (results-roth-ira.png, results-hsa.png) stay
 * in the repo untouched as the record; they are never cropped or re-edited in
 * place. The crops exist because the full captures end mid-row and carry a
 * redaction bar and a stray "Text" artifact that are conspicuous at full size. */
const RESULTS_IMG = '/images/results-roth-ira-display.png';
const RESULTS_IMG_HSA = '/images/results-hsa-display.png';

const mechanism = [
  {
    title: 'You get paid first',
    desc: 'The money is in your account the moment you place the trade, not when it closes. That is the paycheck.',
  },
  {
    title: 'You draw a line',
    desc: 'You pick a stock and draw a line well below where it trades today. While it stays above that line, you keep the paycheck.',
  },
  {
    title: 'Protection is built in',
    desc: 'One piece of the trade pays you, the other caps what can go wrong, so your worst case is known before you click.',
  },
  {
    title: 'The odds are on screen',
    desc: 'Trades are set up with roughly 80 to 93 percent odds in your favour, shown by the broker before you commit. That describes the trade, not anyone\'s results.',
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO path="/" />
      <Navigation />
      <HeroSection />
      <StatsSection />
      {/* ─── Real results ─── */}
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[14ch]">
                Real accounts, real results
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-[#3a3834] text-[1.0625rem] leading-[1.7] max-w-[46ch]">
                Two Fidelity accounts. Roth IRA up{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">142%</strong>, HSA up{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">83%</strong>, both over
                three years, both run around a full-time job.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 items-start">
            <figure>
              <img
                src={RESULTS_IMG}
                alt="Fidelity Roth IRA balance of $83,587.33, up 142.54% over three years"
                width={507}
                height={500}
                className="w-full max-w-[507px] h-auto border border-[#e3ded4]"
              />
              <figcaption className="mt-3 text-[0.875rem] text-[#55534e] tf-nums">
                Figure 1. Roth IRA, +142% over three years
              </figcaption>
            </figure>

            <figure>
              <img
                src={RESULTS_IMG_HSA}
                alt="Fidelity HSA balance of $32,025.42, up 83.61% over three years"
                width={478}
                height={450}
                className="w-full max-w-[478px] h-auto border border-[#e3ded4]"
              />
              <figcaption className="mt-3 text-[0.875rem] text-[#55534e] tf-nums">
                Figure 2. HSA, +83% over three years
              </figcaption>
            </figure>
          </div>

          <p className="mt-10 pt-6 border-t border-[#ece8e0] text-[0.875rem] text-[#767269] leading-[1.6] max-w-[64ch]">
            Real Fidelity account results, shown as captured from the accounts and cropped only
            to the balance and performance panels. Individual results vary; past performance
            does not guarantee future results.
          </p>
        </div>
      </section>

      <MeetVladSection />

      {/* ─── The mechanism ─── */}
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[12ch]">
                The Paycheck Collector
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[62ch]">
                Most trading asks you to be right, far and fast: right about the direction, far
                enough that the stock really moves, and fast, before time runs out. Miss one and
                you lose, which is how people are right about a stock and still lose money on the
                option. The Paycheck Collector needs one thing instead. The stock stays above
                your line. It works the way an insurer does: paid up front, and picky about what
                it covers.
              </p>

              <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                {mechanism.map(({ title, desc }) => (
                  <div key={title} className="border-t border-[#e3ded4] pt-5">
                    <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
                      {title}
                    </dt>
                    <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">{desc}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-10 pt-6 border-t border-[#ece8e0] text-[1rem] text-[#55534e] leading-[1.7] max-w-[62ch]">
                The method calls for about{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">$15,000</strong> in
                trading capital to run properly, in your own brokerage account and separate from
                the cost of the programme. You can start learning with less. It is one of three
                strategies you learn: Bounce Profit for trending markets, the Paycheck Collector
                for markets going sideways, Ready, Set, Explode for volatile ones.
              </p>

              <p className="mt-8">
                <a
                  href="/paycheck-collector"
                  className="text-[1.0625rem] font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
                >
                  How the Paycheck Collector works
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <FrameworkSection />

      {/* ─── Guarantee ─── */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[14ch]">
                You do the work. We get you there.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[56ch]">
                You follow the system, do the homework, and show up to your coaching sessions.
                If you are not winning at least{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">70%</strong> of your trades
                within 90 days, you get{' '}
                <strong className="font-semibold text-[#1a1a1a]">every penny back</strong>. And we
                keep coaching you until you are profitable.
              </p>
              <p className="mt-8 pt-6 border-t border-[#e3ded4] text-[1rem] text-[#55534e] leading-[1.7] max-w-[56ch]">
                90 days of one-on-one coaching. The conditions are the ones above: commit to the
                work, and we commit to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookCallCTA
        variant="light"
        headline="See the method taught live"
        subtext="A live session on how the method works, and how students fit it around a job."
      />

      <PodcastSection />
      <Footer />
    </div>
  );
}
