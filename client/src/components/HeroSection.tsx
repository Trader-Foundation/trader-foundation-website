/*
 * Hero Section, Trader Foundation
 * Fonts: Sen (bold headline), DM Sans (body), punchy like GOAT Academy
 * Copy: Short, direct, no fluff. "Academy" emphasized.
 */

import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad-teaching-clean2_08a2b1d6.png';
/* BBB Official Blue Torch - inline SVG */
function BBBTorch({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Torch flame */}
      <path d="M40 4c-4 8-16 16-16 28 0 10 6 16 12 18-2-4-3-8-1-14 2-6 8-14 12-18 2 8 0 16-2 20 6-4 11-12 11-20C56 10 46 4 40 4z" fill="#0072B1" />
      <path d="M40 12c-2 6-10 12-10 20 0 6 4 10 8 12-1-3-2-6 0-10 1.5-4 5-10 8-13 1 6 0 12-1 15 4-3 7-8 7-14 0-6-6-12-12-10z" fill="#0089D0" />
      {/* Torch base */}
      <rect x="30" y="52" width="20" height="4" rx="1" fill="#0072B1" />
      <rect x="33" y="56" width="14" height="3" rx="1" fill="#0072B1" />
      <rect x="28" y="59" width="24" height="4" rx="1" fill="#0072B1" />
      {/* BBB Text */}
      <text x="40" y="78" textAnchor="middle" fill="#0072B1" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="14">BBB</text>
    </svg>
  );
}

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
              <BBBTorch className="h-10 w-10" />
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
