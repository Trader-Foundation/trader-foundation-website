/*
 * About Section, Trader Foundation
 * Fonts: Sen (headings), DM Sans (body), bold, clean, punchy
 * Copy: Direct, no fluff
 */

import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Users, Target, ShieldCheck } from 'lucide-react';

const CLASSROOM_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/academy-classroom-AfSgXaFD9PDtKQLTYn7PEK.webp';

const pillars = [
  {
    icon: GraduationCap,
    title: '1-on-1 Mentorship',
    description: 'Real individual coaching, not group calls disguised as personal attention.',
  },
  {
    icon: Target,
    title: 'Proven Strategy',
    description: 'A swing trading system designed for busy professionals. Ten minutes a day.',
  },
  {
    icon: Users,
    title: 'Active Community',
    description: 'Daily mastermind sessions, live trading rooms, and a private network of serious traders.',
  },
  {
    icon: ShieldCheck,
    title: 'Accountability',
    description: 'We review your trades, track your progress, and hold you to the standard.',
  },
];

export default function AboutSection() {
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#FAF9F6]"
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span
            className={`text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            About The Academy
          </span>
          <h2
            className={`mt-4 text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-extrabold text-[#1a1a1a] leading-[1.15] transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Not Another Trading Course.
            <br />
            <span className="text-[#c7ab77]">A Real Education.</span>
          </h2>
          <p
            className={`mt-6 text-[#555] text-base sm:text-lg leading-relaxed transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Built for hardworking professionals who are tired of courses that over-promise
            and under-deliver. We teach a real, repeatable skill,  not shortcuts.
          </p>
        </div>

        {/* Two-column: Image + Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={CLASSROOM_IMG}
                alt="Trader Foundation Academy classroom"
                className="w-full h-auto object-cover"
              />
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#c7ab77]" />
                <div className="absolute top-0 left-0 h-full w-[2px] bg-[#c7ab77]" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#c7ab77]" />
                <div className="absolute bottom-0 right-0 h-full w-[2px] bg-[#c7ab77]" />
              </div>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className={`group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-[#c7ab77]/30 rounded-sm transition-all duration-300 group-hover:border-[#c7ab77] group-hover:bg-[#c7ab77]/5">
                    <pillar.icon size={22} className="text-[#c7ab77]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3
                  className="text-[1.1rem] font-bold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="text-[#666] text-[0.85rem] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
