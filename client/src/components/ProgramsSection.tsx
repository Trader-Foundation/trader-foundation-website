/*
 * Programs Section, Trader Foundation
 * Fonts: Sen (headings), DM Sans (body), bold, clean
 * Copy: Direct, no fluff
 */

import { useEffect, useRef, useState } from 'react';
import { BookOpen, LineChart, Clock, TrendingUp, Headphones, Award } from 'lucide-react';

const CHARTS_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/trading-charts-Dipx2itNMPTFiQmsEP9fyH.webp';

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Curriculum',
    description: 'From options basics to advanced swing trading, structured learning that builds on itself.',
  },
  {
    icon: LineChart,
    title: 'Live Trading Rooms',
    description: 'Watch real trades unfold in real time alongside experienced coaches.',
  },
  {
    icon: Clock,
    title: '10-Minute Strategy',
    description: 'Screen stocks, set your play, and let the market work. Fits into your lunch break.',
  },
  {
    icon: TrendingUp,
    title: 'Time Machine Review',
    description: 'Practice trades reviewed before you risk real capital. Learn before you earn.',
  },
  {
    icon: Headphones,
    title: 'Direct Coach Access',
    description: 'Real 1-on-1 sessions with your personal coach. Your questions, your trades.',
  },
  {
    icon: Award,
    title: 'Lifetime Community',
    description: 'Daily mastermind meetings, shared insights, and ongoing support from serious traders.',
  },
];

export default function ProgramsSection() {
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
    <section
      id="programs"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#1a1a1a] overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 opacity-[0.06]">
        <img src={CHARTS_IMG} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span
            className={`text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            What We Offer
          </span>
          <h2
            className={`mt-4 text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-extrabold text-white leading-[1.15] transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Everything You Need to{' '}
            <span className="text-[#c7ab77]">Trade With Confidence</span>
          </h2>
          <p
            className={`mt-6 text-white/50 text-base sm:text-lg leading-relaxed transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            The Trading Clarity System takes you from wherever you are now
            to confident, independent trader, step by step.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-8 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm rounded-sm transition-all duration-500 hover:border-[#c7ab77]/30 hover:bg-white/[0.04] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c7ab77] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <feature.icon size={28} className="text-[#c7ab77] mb-5" strokeWidth={1.2} />
              <h3
                className="text-[1.1rem] font-bold text-white mb-3"
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-white/45 text-[0.85rem] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href="#masterclass"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.25)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Start Your Journey
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />
    </section>
  );
}
