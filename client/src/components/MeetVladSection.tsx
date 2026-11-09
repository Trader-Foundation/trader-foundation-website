/*
 * Who is Vlad Tayman, Trader Foundation
 * Editorial two-column: the founder's account at a readable measure, the
 * family photograph as a plain rectangle with its caption beneath. Followed by
 * the Trustpilot quotes, set as a row of quotations rather than cards.
 */

import { TrustpilotLogo, TrustpilotStars } from './TrustpilotAssets';

const VLAD_FAMILY = '/images/vlad-family.jpg';

/* Two reviews, both five stars, both checked word for word against Trustpilot
 * on 2026-11-09.
 * Pranjul Srivastava: 5 stars, 12 Apr 2024. Trimmed at the end and otherwise
 *   verbatim, including his own spelling of Vlad's name.
 * Ronnie Peaches: 5 stars, 3 Jun 2026. A contiguous excerpt from the second
 *   sentence on; the opening line about teaching the basics was left out as it
 *   speaks to a beginner.
 * Removed: a quote attributed to "Jonas", which appears on none of the six
 *   pages of the listing, and a Bobby Colucci quote that is real but four stars.
 * Never publish a quote here that has not been read at source. */
const trustpilotReviews = [
  {
    name: 'Pranjul Srivastava',
    text: "I've been trading options for quite some time now and thought I knew a lot regarding the stock market. So when I joined Trader Foundation, I didn't know what to expect...in short Vald and Elliot's knowledge and mentorship far exceeded anything I had imagined. Their strategies, especially the paycheck collector is a game changer.",
  },
  {
    name: 'Ronnie Peaches',
    text: 'The staff is there every step of the way whenever I need help. The experience is second to none, unlike several trading programs that didn\'t fulfill their promise. I would recommend this fine program if you are serious about trading.',
  },
];

export default function MeetVladSection() {
  return (
    <>
      <section className="bg-[#faf9f6] py-16 sm:py-20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <h2 className="tf-display text-[#1a1a1a] text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] max-w-[18ch]">
            Who is Vlad Tayman?
          </h2>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="text-[#3a3834] text-[1.0625rem] leading-[1.75] space-y-6 max-w-[62ch]">
                <p>
                  I came to America from Ukraine with nothing but a work ethic. I built my career the hard way,
                  the degree, the corporate ladder, the six-figure salary. And I still remember the moment
                  everything clicked. I was sitting at my desk after another 14-hour day, watching my 401(k)
                  statement show the same mediocre returns year after year. I had done everything "right", but
                  I realized <strong className="font-semibold text-[#1a1a1a]">nobody had ever taught me how to put my own capital to work</strong>.
                </p>
                <p>
                  What changed was learning the other side of the trade. Instead of buying an option
                  and hoping the market moved my way, I learned to{' '}
                  <strong className="font-semibold text-[#1a1a1a]">sell the option and collect the premium up front</strong>, with
                  protection on the position and my worst case known before I committed a dollar. Not
                  overnight, and not through a magic formula. Through discipline, a process, and
                  someone holding me to it.
                </p>
                <p>
                  That's why I built <strong className="font-semibold text-[#1a1a1a]">Trader Foundation</strong>. Not as another course you
                  watch and forget. As a place where professionals with capital get{' '}
                  <strong className="font-semibold text-[#1a1a1a]">truly individual 1-on-1 coaching</strong>, one strategy taught start to
                  finish, and the skills to manage their own money on their own terms.
                </p>
                <p>
                  Over <strong className="font-semibold text-[#1a1a1a]">1,200 students</strong> and <strong className="font-semibold text-[#1a1a1a]">6+ years</strong> later, with a{' '}
                  <strong className="font-semibold text-[#1a1a1a]">BBB A+ accreditation</strong>, I can tell you this: the people who succeed here
                  aren't the ones looking for shortcuts. They're the ones who are{' '}
                  <strong className="font-semibold text-[#1a1a1a]">ready to learn</strong>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <img
                src={VLAD_FAMILY}
                alt="Vlad Tayman with his family"
                className="w-full h-auto"
              />
              <p className="mt-4 text-[0.9375rem] font-semibold text-[#1a1a1a]">Vlad Tayman</p>
              <p className="mt-1 text-[0.9375rem] text-[#55534e]">Founder, Trader Foundation Academy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot, as quotations rather than cards */}
      <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <TrustpilotLogo className="h-6" />
            <TrustpilotStars className="h-5" />
            <span className="text-[#55534e] text-[0.9375rem]">
              <span className="font-semibold text-[#1a1a1a] tf-nums">4.6</span> out of 5, rated excellent
            </span>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-10">
            {trustpilotReviews.map((review) => (
              <figure key={review.name} className="border-t border-[#1a1a1a] pt-6">
                <blockquote className="text-[#3a3834] text-[1.0625rem] leading-[1.7]">
                  {review.text}
                </blockquote>
                <figcaption className="mt-4 text-[0.875rem] text-[#767269]">
                  {review.name}, on Trustpilot
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-x-8 gap-y-3">
            <a
              href="/results"
              className="text-[0.9375rem] font-semibold text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
            >
              More student reviews and results
            </a>
            <a
              href="https://www.trustpilot.com/review/traderfoundation.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.9375rem] text-[#55534e] underline decoration-[#c9c4b8] hover:text-[#1a1a1a] hover:decoration-[#1a1a1a]"
            >
              Read all of our reviews on Trustpilot
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
