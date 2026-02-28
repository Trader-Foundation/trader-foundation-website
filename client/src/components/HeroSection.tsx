/*
 * Hero Section — Trader Foundation
 * Design: Full-viewport with dark overlay image (video placeholder), left-aligned text
 * Features: Academy-emphasizing headline, CTA button, BBB A+ badge
 * The hero image will be replaced with a video background once the user provides one
 */

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/hero-bg-CkKJ3vTSq2YDiMHhh77VL2.webp';
const BBB_BADGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/bbb-badge-na8f3oFNHTxq7SUh5kdEVr.webp';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image (will be replaced with video) */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay — heavier on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/60 to-[#0a0a0a]/40" />
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8 w-full pt-32 pb-24">
        <div className="max-w-2xl">
          {/* Subtle gold line above headline */}
          <div
            className={`w-16 h-[2px] bg-[#c7ab77] mb-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          />

          {/* Main Headline */}
          <h1
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span
              className="block text-white text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Build Your Financial Future
            </span>
            <span
              className="block text-white text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-light mt-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              With Trader Foundation{' '}
            </span>
            <span
              className="relative inline-block text-[#c7ab77] text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-semibold italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Academy
              {/* Gold underline accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 5.5C40 2 80 3 100 4.5C120 6 160 3 198 5"
                  stroke="#c7ab77"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`mt-8 text-white/75 text-base sm:text-lg leading-relaxed max-w-lg transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Libre Franklin', sans-serif", fontWeight: 300 }}
          >
            A premier trading education institution dedicated to transforming
            hardworking professionals into confident, independent traders through
            personalized 1-on-1 mentorship.
          </p>

          {/* CTA Button */}
          <div
            className={`mt-10 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <a
              href="#masterclass"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#c7ab77] text-[#111] text-[0.8rem] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              <Play size={16} className="transition-transform duration-300 group-hover:scale-110" />
              Watch The Masterclass
            </a>
          </div>

          {/* BBB Badge */}
          <div
            className={`mt-10 flex items-center gap-4 transition-all duration-1000 delay-800 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-sm border border-white/10">
              <img
                src={BBB_BADGE}
                alt="BBB A+ Accredited"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span
                  className="text-white text-[0.65rem] font-semibold tracking-[0.15em] uppercase"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  BBB Accredited
                </span>
                <span
                  className="text-[#c7ab77] text-[0.9rem] font-bold tracking-wide"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
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
