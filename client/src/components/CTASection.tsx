/*
 * CTA Section — Trader Foundation
 * Fonts: Sen (headings), DM Sans (body)
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
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0a0a]/80" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 lg:px-8 text-center">
        <span
          className={`text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Your Next Step
        </span>

        <h2
          className={`mt-6 text-[2rem] sm:text-[2.5rem] lg:text-[3.2rem] font-extrabold text-white leading-[1.15] transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: "'Sen', sans-serif" }}
        >
          Ready to Build a Skill
          <br />
          That Lasts a{' '}
          <span className="text-[#c7ab77]">Lifetime</span>?
        </h2>

        <p
          className={`mt-6 text-white/50 text-base sm:text-lg leading-relaxed max-w-xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Watch our masterclass to see how busy professionals are learning
          to trade confidently in just 10 minutes a day.
        </p>

        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="https://start.traderfoundation.co/trade"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Play size={16} />
            Watch The Masterclass
          </a>
          <a
            href="https://start.traderfoundation.co/trade"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-white/20 text-white text-[0.85rem] font-medium tracking-wide rounded-sm transition-all duration-300 hover:border-[#c7ab77]/50 hover:text-[#c7ab77]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a Call
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
