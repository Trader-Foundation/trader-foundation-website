/*
 * Stats Section, Trader Foundation
 * Fonts: Sen (numbers), DM Sans (labels), bold and punchy
 * Animated counting numbers with gold accents
 */

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 1200, suffix: '+', label: 'Students' },
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
          className="text-[3rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-none"
          style={{ fontFamily: "'Sen', sans-serif" }}
        >
          {formattedCount}
        </span>
        <span
          className="text-[2rem] sm:text-[2.5rem] text-[#c7ab77] font-extrabold"
          style={{ fontFamily: "'Sen', sans-serif" }}
        >
          {stat.suffix}
        </span>
      </div>
      <span
        className="text-white/60 text-[0.85rem] font-medium mt-2 block"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
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
      className="relative bg-[#111111] py-16 sm:py-20 overflow-hidden"
    >
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
