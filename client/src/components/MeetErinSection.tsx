/*
 * Meet Erin Section - Homepage (v2)
 * Design: Two-column layout (text left, photo right)
 * Erin Chawla is the face of the brand; Vlad Tayman credited as founder.
 * Followed by TrustPilot reviews strip for social proof.
 */

import { useEffect, useRef, useState } from 'react';
import { TrustpilotLogo, TrustpilotStars } from './TrustpilotAssets';

/* TODO[v2]: Replace with final Erin portrait for the "Who is Erin?" section. Using existing Erin headshot as placeholder. */
const ERIN_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/erin_93b42a5c.jpg';

const trustpilotReviews = [
  {
    name: 'Bobby Colucci',
    rating: 5,
    title: 'I Have Been Learning a Lot',
    text: 'I have been learning a lot, and I have come a long way since I started my classes. Having access to a live person or persons has been incredibly encouraging. Elliot, Leo, and Erin have been great. Vlad is very smart, so pay attention.',
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
  {
    name: 'Jonas',
    rating: 5,
    title: 'Well-Structured Training with Excellent Coaching Support',
    text: 'The learning flow is clear and logical, which makes it much easier to understand concepts that are usually complex and intimidating for beginners. The company offers daily live sessions with coaches where stocks are reviewed in real time. Students are also encouraged to schedule one-on-one sessions with coaches for personalized guidance.',
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
      {/* Meet Erin Section */}
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
            Who is <span className="text-[#c7ab77]">Erin Chawla</span>?
          </h2>

          {/* Two-column: Story left, Photo right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Story Column */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              {/* TODO[v2]: Replace the five paragraphs below with Erin's final origin story copy.
                  Placeholder copy written in her voice, based on her existing coach bio. */}
              <div
                className="text-[#333] text-base sm:text-[1.05rem] leading-[1.85] space-y-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <p>
                  I didn't grow up around the markets. Like a lot of people, I taught myself,
                  alone, late at night, after work, making every mistake there is to make. I
                  remember exactly what it felt like to <strong>figure this out with no one in
                  my corner</strong>, and that feeling is the reason I do what I do today.
                </p>
                <p>
                  Early on I chased everything: day trading, hot tips, every alert and indicator
                  I could find. It was exhausting, and it didn't work. The turning point came
                  when I stopped trying to be in every trade and started being{' '}
                  <strong>patient and selective</strong>. Trading is like dating, choose the
                  best and leave the rest.
                </p>
                <p>
                  Now I trade almost entirely off the <strong>Weekly and Monthly charts</strong>.
                  No noise. No chasing. Just a few high-quality setups a month, managed with
                  discipline. It's calmer, it fits around a real life, and it's far more
                  consistent than the chaos I started with.
                </p>
                <p>
                  As Head of YouTube Education for <em><strong>Trader Foundation</strong></em>, I
                  put as much of this as I can out into the world for free, because I never want
                  someone to feel as alone in this as I once did. Every video, every answered
                  question, comes from that same place.
                </p>
                <p>
                  Trader Foundation was built by <strong>Vlad Tayman</strong> as a real academy,
                  not another course you watch and forget, where busy professionals get genuine
                  1-on-1 coaching and a proven swing trading strategy. With over{' '}
                  <strong>1,200 students</strong>, <strong>6+ years</strong>, and a{' '}
                  <strong>BBB A+ accreditation</strong> behind us, I'm proud to help carry that
                  mission forward.
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
                  src={ERIN_PHOTO}
                  alt="Erin Chawla, Lead Trading Coach at Trader Foundation Academy"
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
                    Erin Chawla
                  </p>
                  {/* TODO[v2]: Confirm Erin's official title. */}
                  <p
                    className="text-[#888] text-sm mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Lead Trading Coach, Trader Foundation Academy
                  </p>
                  <p
                    className="text-[#aaa] text-xs mt-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Trader Foundation founded by Vlad Tayman
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
