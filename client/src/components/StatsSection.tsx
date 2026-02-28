/*
 * Stats Section — Trader Foundation
 * Design: Dark band with animated counting numbers, gold accents
 * Modeled after GOAT Academy's stats bar: 1200+ Students, 15+ Years, 6+ Years in Business
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const stats: StatItem[] = [
  { value: 1200, suffix: '+', label: 'Students Trained' },
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 6, suffix: '+', label: 'Years in Business' },
];

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, start]);

  return count;
}

function StatCounter({ stat, isVisible, delay }: { stat: StatItem; isVisible: boolean; delay: number }) {
  const [shouldStart, setShouldStart] = useState(false);
  const count = useCountUp(stat.value, 2200, shouldStart);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldStart(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const formattedCount = stat.value >= 1000
    ? count.toLocaleString()
    : count.toString();

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline justify-center gap-1">
        <span
          className="text-[3rem] sm:text-[3.5rem] lg:text-[4rem] font-light text-white leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {stat.prefix}{formattedCount}
        </span>
        <span
          className="text-[2rem] sm:text-[2.5rem] text-[#c7ab77] font-light"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {stat.suffix}
        </span>
      </div>
      {/* Gold divider */}
      <div className="w-8 h-[1.5px] bg-[#c7ab77]/50 mx-auto mt-3 mb-3" />
      <span
        className="text-white/60 text-[0.7rem] font-medium tracking-[0.2em] uppercase"
        style={{ fontFamily: "'Libre Franklin', sans-serif" }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsSection() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#111111] py-20 sm:py-24 overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/40 to-transparent" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {stats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
              delay={index * 200}
            />
          ))}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/40 to-transparent" />
    </section>
  );
}
