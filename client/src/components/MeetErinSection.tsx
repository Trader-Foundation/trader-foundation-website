/*
 * Meet Erin Section - Homepage (v2)
 * Design: Two-column layout (text left, photo right)
 * Erin Chawla is the face of the brand; Vlad Tayman credited as founder.
 * Followed by TrustPilot reviews strip for social proof.
 */

import { useEffect, useRef, useState } from 'react';
import { TrustpilotLogo, TrustpilotStars } from './TrustpilotAssets';

/* TODO[v2]: Replace with final Erin portrait. Currently a Google Drive proxy URL —
   if it stops rendering, re-host on Imgur or commit to /public. */
const ERIN_PHOTO = 'https://lh3.googleusercontent.com/d/1kK5lJiwskHwnx_pFDURtqfTIuusO27Uk=s2000';

const trustpilotReviews = [
  {
    name: 'Bobby Colucci',
    rating: 5,
    title: 'I Have Been Learning a Lot',
    text: 'I have been learning a lot, and I have come a long way since I started my classes. Having access to a live person or persons has been incredibly encouraging. Elliot, Leo, and Erin have been great. Vlad is very smart, so pay attention.',
  },
  {
    name: 'Jonas',
    rating: 5,
    title: 'Well-Structured Training with Excellent Coaching Support',
    text: 'The learning flow is clear and logical, which makes it much easier to understand concepts that are usually complex and intimidating for beginners. The company offers daily live sessions with coaches where stocks are reviewed in real time. Students are also encouraged to schedule one-on-one sessions with coaches for personalized guidance.',
  },
  {
    name: 'Fred Nicora',
    rating: 5,
    title: 'A Great Experience from Ground Zero',
    text: 'Starting at ground zero with my options trading journey, I examined several programs ranging from group chats to educational programs. Trader Foundation has enabled me to feel confident to dive into the deep end with strategies to succeed. The investment has paid off... big time!',
  },
  {
    name: 'Pranjul Srivastava',
    rating: 5,
    title: 'Exceeded Expectations!',
    text: 'I\'ve been trading options for quite some time and thought I knew a lot. Vlad and Elliot\'s knowledge and mentorship far exceeded anything I had imagined. Their strategies, especially the paycheck collector, is a game changer. I\'m less stressed about finances than I have ever been in my life.',
  },
];

export default function MeetErinSection() {
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
      {/* Meet Erin Section — compact intro card. Full bio lives on /about. */}
      <section
        ref={sectionRef}
        className="relative py-20 sm:py-24 bg-white"
      >
        <div className="max-w-[720px] mx-auto px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <p
            className={`text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Meet Your Coach
          </p>

          {/* Photo */}
          <div
            className={`relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="absolute -inset-2 border border-[#c7ab77]/30 rounded-full" />
            <div className="w-full h-full rounded-full overflow-hidden shadow-xl">
              <img
                src={ERIN_PHOTO}
                alt="Erin Chawla, Partner at Trader Foundation Academy"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'center 22%',
                  transform: 'scale(1.25)',
                  transformOrigin: 'center 38%',
                }}
              />
            </div>
          </div>

          {/* Name + title */}
          <h2
            className={`text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-2 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Erin Chawla
          </h2>
          <p
            className={`text-[#c7ab77] font-semibold text-sm mb-6 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Partner, Trader Foundation
          </p>

          {/* Short pitch */}
          <p
            className={`text-[#444] text-base sm:text-lg leading-relaxed mb-4 max-w-xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            From corporate finance at <strong>GE</strong>, reading P&amp;Ls and analyzing
            risk for a living, to teaching what I wish I'd had when I was starting out.
            I've personally coached hundreds of students; our broader team has mentored{' '}
            <strong>over a thousand</strong>.
          </p>

          {/* Founder bridge line */}
          <p
            className={`text-[#888] text-sm mb-6 max-w-xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Built on the foundation created by founder Vlad Tayman, taught by coaches who've lived it.
          </p>

          {/* Signature pull-quote */}
          <blockquote
            className={`mt-2 mb-8 italic text-[#555] text-[1.05rem] leading-relaxed transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            "Trading is like dating, you choose the best."
            <span className="block mt-2 not-italic text-xs uppercase tracking-[0.18em] text-[#c7ab77]">
              — Erin Chawla
            </span>
          </blockquote>

          {/* CTA link to About */}
          <a
            href="/about"
            className={`inline-flex items-center gap-2 px-6 py-3 border border-[#c7ab77]/40 text-[#c7ab77] text-sm font-semibold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#c7ab77] hover:text-[#111] ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Read Erin's Full Story
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* TrustPilot Reviews Strip */}
      <section className="relative bg-[#f5f3ee] py-16 sm:py-20 overflow-hidden">
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />

        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          {/* TrustPilot Header */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <TrustpilotLogo className="h-7" />
            <div className="flex items-center gap-3">
              <TrustpilotStars className="h-6" />
              <span
                className="text-[#555] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Rated Excellent
              </span>
            </div>
          </div>

          {/* Founder bridge note */}
          <p
            className="text-center text-[#888] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-12"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            These reviews span our six years in business. Some mention our founder,
            Vlad Tayman &mdash; today Erin is joined by coaches Elliot and Leo,
            carrying the same system forward.
          </p>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustpilotReviews.map((review, index) => (
              <div
                key={review.name}
                className="bg-white rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  <TrustpilotStars className="h-4" />
                </div>
                {/* Review Title */}
                <p
                  className="text-[#1a1a1a] font-bold text-[0.85rem] mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {review.title}
                </p>
                {/* Review Text */}
                <p
                  className="text-[#555] text-[0.8rem] leading-relaxed mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  "{review.text}"
                </p>
                {/* Reviewer Name */}
                <p
                  className="text-[#888] font-semibold text-xs uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Link to more reviews */}
          <div className="text-center mt-10 space-y-3">
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
            <div>
              <a
                href="https://www.trustpilot.com/review/traderfoundation.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#888] text-xs hover:text-[#00b67a] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <TrustpilotStars className="h-3" />
                Verify our 111 reviews on Trustpilot
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />
      </section>
    </>
  );
}
