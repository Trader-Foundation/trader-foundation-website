/*
 * CTA Section — Trader Foundation
 * Design: Dark background with centered CTA, gold accents
 * Purpose: Final conversion push — watch the masterclass / book a call
 */

import { useEffect, useRef, useState } from 'react';
import { Play, ArrowRight } from 'lucide-react';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/hero-bg-CkKJ3vTSq2YDiMHhh77VL2.webp';

export default function CTASection() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="masterclass"
      ref={sectionRef}
      className="relative py-28 sm:py-36 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 lg:px-8 text-center">
        {/* Gold line */}
        <div
          className={`w-16 h-[2px] bg-[#c7ab77] mx-auto mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        />

        <span
          className={`text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-[#c7ab77] transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: "'Libre Franklin', sans-serif" }}
        >
          Your Next Step
        </span>

        <h2
          className={`mt-6 text-[2rem] sm:text-[2.8rem] lg:text-[3.5rem] font-light text-white leading-[1.15] transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Ready to Build a Skill
          <br />
          That Lasts a{' '}
          <span className="font-semibold italic text-[#c7ab77]">Lifetime</span>?
        </h2>

        <p
          className={`mt-6 text-white/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: "'Libre Franklin', sans-serif", fontWeight: 300 }}
        >
          Watch our masterclass to discover how hardworking professionals are learning
          to trade confidently in just 10 minutes a day — without quitting their careers.
        </p>

        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.8rem] font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            <Play size={16} />
            Watch The Masterclass
          </a>
          <a
            href="#"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-white text-[0.8rem] font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:border-[#c7ab77]/50 hover:text-[#c7ab77]"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            Book a Call
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
