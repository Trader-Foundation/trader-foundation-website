/*
 * Hero Section, Trader Foundation
 * Fonts: Sen (bold headline), DM Sans (body)
 * Photo: "Vlad hero photo" (Vlad teaching at a projected stock chart; Vlad on the left third,
 * student seated on the right). Desktop: full-bleed photo anchored left with a dark gradient
 * from the right, headline column on the right. Mobile/tablet: photo band under the nav cropped
 * to Vlad and his pointing arm, copy below on dark.
 * Copy: "Take Control of Your Financial Future" headline, Live Webinar CTA.
 */

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Picture from '@/components/Picture';

const HERO_PHOTO = '/images/vlad-hero.jpg';
const HERO_PHOTO_WIDTH = 1600;
const HERO_PHOTO_HEIGHT = 926;

/* BBB Official Badge - dark blue pill with torch + A+ circle */
function BBBBadge() {
  return (
    <div className="flex items-center gap-0">
      <div className="flex items-center gap-2 bg-[#003366] rounded-full px-4 py-2">
        <svg className="h-6 w-4 shrink-0" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2c-2 4-8 8-8 14 0 5 3 8 6 9-1-2-1.5-4-.5-7 1-3 4-7 6-9 1 4 0 8-1 10 3-2 5.5-6 5.5-10C28 5 23 2 20 2z" fill="#4A9FD9" />
          <path d="M20 6c-1 3-5 6-5 10 0 3 2 5 4 6-.5-1.5-1-3 0-5 .75-2 2.5-5 4-6.5.5 3 0 6-.5 7.5 2-1.5 3.5-4 3.5-7 0-3-3-6-6-5z" fill="#6BB8E8" />
          <rect x="14" y="27" width="12" height="2.5" rx="0.5" fill="#4A9FD9" />
          <rect x="16" y="29.5" width="8" height="2" rx="0.5" fill="#4A9FD9" />
          <rect x="13" y="31.5" width="14" height="2.5" rx="0.5" fill="#4A9FD9" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-white text-[0.5rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BETTER</span>
          <span className="text-white text-[0.5rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BUSINESS</span>
          <span className="text-white text-[0.5rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BUREAU</span>
          <span className="text-white/70 text-[0.3rem] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>ACCREDITED BUSINESS</span>
        </div>
      </div>
      <div className="-ml-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#1a5ca8] border-2 border-white/20 z-10">
        <div className="text-center leading-none">
          <span className="text-white text-[0.95rem] font-extrabold" style={{ fontFamily: "'Sen', sans-serif" }}>A+</span>
          <span className="block text-white/90 text-[0.3rem] font-bold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>RATING</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex flex-col lg:flex-row lg:items-center lg:min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Vlad's photo: top band on mobile/tablet (below the nav), full-bleed on desktop */}
      <div className="relative w-full h-[62svh] min-h-[360px] lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
        <div className="absolute inset-x-0 bottom-0 top-20 lg:top-0">
          <Picture
            src={HERO_PHOTO}
            alt="Vlad Tayman teaching a student how to read a stock chart"
            width={HERO_PHOTO_WIDTH}
            height={HERO_PHOTO_HEIGHT}
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-[8%_center] lg:object-left"
          />
          {/* Tone the bright room down to sit with the dark brand palette */}
          <div className="absolute inset-0 bg-[#0a0a0a]/20" />
          {/* Desktop: darken the right side (chart and student) under the headline, keep Vlad clear on the left */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-l from-[#0a0a0a]/95 from-0% via-[#0a0a0a]/80 via-45% to-transparent to-65%" />
          {/* Mobile/tablet: fade the photo's bottom edge into the copy below */}
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
      </div>
      {/* Keep the transparent nav legible over the bright photo */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0a0a0a]/85 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />

      {/* Content */}
      {/* lg:pt-48 clears the two-row desktop nav when the narrower column wraps the headline to five lines (1024px) */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8 w-full -mt-24 pb-40 lg:mt-0 lg:pt-48 lg:pb-24">
        <div className="max-w-2xl lg:max-w-[48%] lg:ml-auto">
          {/* Main Headline */}
          <h1
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span
              className="block text-white text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.12] font-extrabold"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Take Control of Your Financial Future With Trader Foundation{' '}
            </span>
            <span
              className="relative inline-block text-[#c7ab77] text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.12] font-extrabold"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Academy
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 5.5C40 2 80 3 100 4.5C120 6 160 3 198 5"
                  stroke="#c7ab77"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </span>
          </h1>

          {/* CTA Button */}
          <div
            className={`mt-10 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <a
              href="https://live.traderfoundation.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Live Webinar
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <p
              className="mt-3 text-white/55 text-xs sm:text-[0.78rem]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              For professionals ready to trade with $15,000+. Application required.
            </p>
          </div>

          {/* BBB Badge */}
          <div
            className={`mt-8 flex items-center gap-4 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <BBBBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
