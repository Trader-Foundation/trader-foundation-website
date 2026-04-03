/*
 * Hero Section, Trader Foundation
 * Fonts: Sen (bold headline), DM Sans (body), punchy like GOAT Academy
 * Copy: Short, direct, no fluff. "Academy" emphasized.
 */

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad-teaching-clean2_08a2b1d6.png';
const BBB_BADGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/bbb-badge-na8f3oFNHTxq7SUh5kdEVr.webp';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image (will be replaced with video) */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/65 to-[#0a0a0a]/40" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8 w-full pt-32 pb-24">
        <div className="max-w-2xl">
          {/* Main Headline, bold, punchy, GOAT-style */}
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
              {/* Underline accent */}
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
              href="https://start.traderfoundation.co/trade"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Play size={16} className="transition-transform duration-300 group-hover:scale-110" />
              Watch The Masterclass
            </a>
          </div>

          {/* BBB Badge */}
          <div
            className={`mt-8 flex items-center gap-4 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-sm border border-white/10">
              <img
                src={BBB_BADGE}
                alt="BBB A+ Accredited"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span
                  className="text-white text-[0.7rem] font-bold tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  BBB Accredited
                </span>
                <span
                  className="text-[#c7ab77] text-[0.95rem] font-extrabold tracking-wide"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  A+ Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
