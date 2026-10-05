/*
 * Home Page, Trader Foundation Academy
 * Design: editorial, near-monochrome. Off-white ground, near-black ink, one
 * typeface, photographs as plain rectangles, brand gold reserved for the
 * single action. Sections flow: Nav → Hero → Trust band → Who is Vlad →
 * Reviews → What we teach → What you actually get → Results → Guarantee →
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

const RESULTS_IMG = '/images/results-roth-ira.png';
const RESULTS_IMG_HSA = '/images/results-hsa.png';

const methodFeatures = [
  {
    title: 'Defined risk',
    desc: 'You know your maximum loss before the trade is ever placed. No surprises, no margin calls.',
  },
  {
    title: 'Monthly income',
    desc: 'Collect premium on a predictable cycle. Like a paycheck, hence the name.',
  },
  {
    title: 'Bull or bear markets',
    desc: 'Premium gets paid regardless of direction. You profit from selling time, not from predicting where the market goes.',
  },
  {
    title: 'Buy discounts in downturns',
    desc: 'When markets drop, the system positions you to acquire quality stocks at discount prices, getting paid premium while you wait for your buy levels.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO path="/" />
      <Navigation />
      <HeroSection />
      <StatsSection />
      <MeetVladSection />

      {/* ─── What we teach ─── */}
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] max-w-[14ch]">
                How to build real wealth
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[62ch]">
                We don't teach a trade. We teach a discipline. The core method is the{' '}
                <strong className="font-semibold text-[#1a1a1a]">Paycheck Collector</strong>, selling
                options on liquid stocks and indices for a defined-risk premium every month.
                Around it, you'll learn the risk management, position sizing, and long-term
                discipline that turn a single strategy into a real, compounding portfolio.
              </p>

              <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                {methodFeatures.map(({ title, desc }) => (
                  <div key={title} className="border-t border-[#e3ded4] pt-5">
                    <dt className="text-[1.0625rem] font-semibold text-[#1a1a1a] tracking-[-0.01em]">
                      {title}
                    </dt>
                    <dd className="mt-2 text-[#55534e] text-[1rem] leading-[1.65]">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <FrameworkSection />

      {/* ─── Real results ─── */}
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] max-w-[14ch]">
                Real accounts, real results
              </h2>
              <p className="mt-6 text-[#3a3834] text-[1.0625rem] leading-[1.7] max-w-[46ch]">
                Actual Fidelity accounts. Roth IRA up{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">142%</strong>. HSA up{' '}
                <strong className="font-semibold text-[#1a1a1a] tf-nums">83%</strong>. Both over
                three years, both passively managed around a full-time career. This is what
                compounded growth looks like when you follow a system.
              </p>
              <p className="mt-6 text-[0.875rem] text-[#767269] leading-[1.6] max-w-[46ch]">
                Real Fidelity account results. Individual results vary; past performance does
                not guarantee future results.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
              <figure>
                <img
                  src={RESULTS_IMG}
                  alt="Trading results in a Fidelity Roth IRA account"
                  className="w-full h-auto border border-[#e3ded4]"
                />
                <figcaption className="mt-3 text-[0.875rem] text-[#55534e] tf-nums">
                  Roth IRA, +142%
                </figcaption>
              </figure>
              <figure>
                <img
                  src={RESULTS_IMG_HSA}
                  alt="Trading results in a Fidelity HSA account"
                  className="w-full h-auto border border-[#e3ded4]"
                />
                <figcaption className="mt-3 text-[0.875rem] text-[#55534e] tf-nums">
                  HSA, +83%
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Guarantee ─── */}
      <section className="bg-[#ffffff] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className="tf-display text-[#1a1a1a] text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] max-w-[14ch]">
                You do the work. We get you there.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[#3a3834] text-[1.0625rem] sm:text-[1.125rem] leading-[1.7] max-w-[56ch]">
                You follow the system. You show up to the coaching. And if you're not
                profitable, <strong className="font-semibold text-[#1a1a1a]">you don't pay</strong>, and we
                keep coaching you until you are.
              </p>
              <p className="mt-8 pt-6 border-t border-[#e3ded4] text-[1rem] text-[#55534e] leading-[1.7] max-w-[56ch]">
                90 days of one-on-one coaching. Pay when you're profitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BookCallCTA
        variant="light"
        headline="See how busy professionals are learning to trade"
        subtext="A live session with our team on how a proven swing trading strategy fits into a working week."
      />

      <PodcastSection />
      <Footer />
    </div>
  );
}
