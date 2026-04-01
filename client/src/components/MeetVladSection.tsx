/*
 * Meet Vlad Section — Homepage
 * Design: Two-column layout (text left, family photo right)
 * Modeled after GOAT Academy's "Who are Felix & Winston?" intro
 * Followed by TrustPilot reviews strip for social proof
 */

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const VLAD_FAMILY = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad-family_860d678c.jpg';

const trustpilotReviews = [
  {
    name: 'Michael R.',
    rating: 5,
    text: 'Vlad and his team genuinely care about your success. The 1-on-1 coaching changed everything for me. I finally understand how to read charts and manage risk properly.',
  },
  {
    name: 'Sarah K.',
    rating: 5,
    text: 'After losing money with day trading signals, I was skeptical. But the swing trading approach here actually fits my schedule as a nurse. Six months in and I\'m consistently profitable.',
  },
  {
    name: 'David L.',
    rating: 5,
    text: 'The accountability and structure are what set this apart. My coach reviews every trade I make. You can\'t get that anywhere else at this level.',
  },
  {
    name: 'Jennifer M.',
    rating: 5,
    text: 'I joined as a complete beginner. The foundation they build is incredible — I went from knowing nothing to confidently placing my own trades in under 3 months.',
  },
];

export default function MeetVladSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Meet Vlad Section */}
      <section
        ref={sectionRef}
        className="relative py-24 sm:py-32 bg-white"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          {/* Section Title */}
          <h2
            className={`text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-extrabold text-[#1a1a1a] leading-[1.15] mb-16 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Who is <span className="text-[#c7ab77]">Vlad Tayman</span>?
          </h2>

          {/* Two-column: Story left, Photo right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Story Column */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <div
                className="text-[#333] text-base sm:text-[1.05rem] leading-[1.85] space-y-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <p>
                  I still remember the moment everything clicked. I was sitting at my desk after another
                  14-hour day, watching my 401(k) statement show the same mediocre returns year after year.
                  I had done everything "right" — the degree, the career, the savings — but I realized{' '}
                  <strong>nobody had ever taught me how to actually grow my wealth</strong>.
                </p>
                <p>
                  That frustration led me down a path most professionals know too well. I tried the stock
                  signals. I tried the AI bots. I even tried day trading for a while — waking up at 4 AM,
                  staring at candles, losing money I couldn't afford to lose. Every shortcut led to the
                  same place: <strong>back to square one</strong>.
                </p>
                <p>
                  It wasn't until I discovered swing trading — and more importantly, learned to{' '}
                  <strong>build a real foundation</strong> — that things changed. Not overnight. Not through
                  some magic formula. Through discipline, proper education, and having someone hold me
                  accountable every step of the way.
                </p>
                <p>
                  That's why I built <em><strong>Trader Foundation</strong></em>. Not as another course you
                  watch and forget. As a real academy where busy professionals get{' '}
                  <strong>truly individual 1-on-1 coaching</strong>, learn a proven swing trading strategy,
                  and build the skills to manage their own wealth — on their own terms.
                </p>
                <p>
                  Over <strong>1,000 students</strong> and <strong>6+ years</strong> later, with a{' '}
                  <strong>BBB A+ accreditation</strong>, I can tell you this: the people who succeed here
                  aren't the ones looking for shortcuts. They're the ones who are{' '}
                  <strong>ready to learn</strong>.
                </p>
              </div>
            </div>

            {/* Photo Column */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <div className="relative">
                <img
                  src={VLAD_FAMILY}
                  alt="Vlad Tayman with his family"
                  className="w-full h-auto rounded-sm shadow-xl"
                />
                {/* Gold corner accents */}
                <div className="absolute -top-3 -left-3 w-20 h-20">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#c7ab77]" />
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-[#c7ab77]" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-20 h-20">
                  <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#c7ab77]" />
                  <div className="absolute bottom-0 right-0 h-full w-[2px] bg-[#c7ab77]" />
                </div>
                {/* Caption */}
                <div className="mt-6 text-center">
                  <p
                    className="text-[#1a1a1a] font-bold text-lg"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Vlad Tayman
                  </p>
                  <p
                    className="text-[#888] text-sm mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Founder, Trader Foundation Academy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TrustPilot Reviews Strip */}
      <section className="relative bg-[#f5f3ee] py-16 sm:py-20 overflow-hidden">
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />

        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          {/* TrustPilot Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#00b67a]" fill="currentColor">
                <path d="M12 0L15.09 7.36L23.18 8.18L17.09 13.64L18.82 21.82L12 17.77L5.18 21.82L6.91 13.64L0.82 8.18L8.91 7.36L12 0Z" />
              </svg>
              <span
                className="text-[#1a1a1a] font-bold text-xl"
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                Trustpilot
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-[#00b67a] fill-[#00b67a]" />
              ))}
              <span
                className="ml-2 text-[#555] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Rated Excellent
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustpilotReviews.map((review, index) => (
              <div
                key={review.name}
                className="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-[#00b67a] fill-[#00b67a]" />
                  ))}
                </div>
                {/* Review Text */}
                <p
                  className="text-[#333] text-[0.85rem] leading-relaxed mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  "{review.text}"
                </p>
                {/* Reviewer Name */}
                <p
                  className="text-[#1a1a1a] font-bold text-sm"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Link to more reviews */}
          <div className="text-center mt-10">
            <a
              href="/results"
              className="inline-flex items-center gap-2 text-[#c7ab77] font-semibold text-sm hover:text-[#b09a6a] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Click here for more Student Reviews on Trader Foundation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />
      </section>
    </>
  );
}
