/*
 * Who is Vlad Tayman, Trader Foundation
 * Editorial two-column: the founder's account at a readable measure, the
 * family photograph as a plain rectangle with its caption beneath. Followed by
 * the Trustpilot quotes, set as a row of quotations rather than cards.
 */

import { TrustpilotLogo, TrustpilotStars } from './TrustpilotAssets';

const VLAD_FAMILY = '/images/vlad-family.jpg';

const trustpilotReviews = [
  {
    name: 'Bobby Colucci',
    title: 'I Have Been Learning a Lot',
    text: 'I have been learning a lot, and I have come a long way since I started my classes. Having access to a live person or persons has been incredibly encouraging. Elliot, Leo, and Erin have been great. Vlad is very smart, so pay attention.',
  },
  {
    name: 'Pranjul Srivastava',
    title: 'Exceeded Expectations!',
    text: 'I\'ve been trading options for quite some time and thought I knew a lot. Vlad and Elliot\'s knowledge and mentorship far exceeded anything I had imagined. Their strategies, especially the paycheck collector, is a game changer. I\'m less stressed about finances than I have ever been in my life.',
  },
  {
    name: 'Jonas',
    title: 'Well-Structured Training with Excellent Coaching Support',
    text: 'The learning flow is clear and logical, which makes it much easier to understand concepts that are usually complex and intimidating for beginners. The company offers daily live sessions with coaches where stocks are reviewed in real time. Students are also encouraged to schedule one-on-one sessions with coaches for personalized guidance.',
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

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {trustpilotReviews.map((review) => (
              <figure key={review.name} className="border-t border-[#ece8e0] pt-6">
                <figcaption className="text-[0.9375rem] font-semibold text-[#1a1a1a]">
                  {review.title}
                </figcaption>
                <blockquote className="mt-3 text-[#55534e] text-[0.9375rem] leading-[1.65]">
                  {review.text}
                </blockquote>
                <p className="mt-4 text-[0.8125rem] text-[#767269]">{review.name}</p>
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
              Verify our 111 reviews on Trustpilot
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
