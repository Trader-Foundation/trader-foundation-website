/*
 * Results Section, Trader Foundation
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "I was skeptical after losing money on other programs. The 1-on-1 coaching here changed everything. My coach reviewed every single trade until I truly understood.",
    name: 'Recent Graduate',
    role: 'IT Professional',
    initials: 'RG',
  },
  {
    quote: "As an engineer working 60-hour weeks, I needed something that didn't require staring at charts all day. The swing trading approach fits perfectly into my lunch break.",
    name: 'Active Student',
    role: 'Software Engineer',
    initials: 'AS',
  },
  {
    quote: "The daily mastermind sessions are invaluable. Being surrounded by serious traders who are all learning and growing together, it's like having a graduate cohort.",
    name: 'Community Member',
    role: 'Project Manager',
    initials: 'CM',
  },
];

export default function ResultsSection() {
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
      id="results"
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
            Student Experiences
          </span>
          <h2
            className={`mt-4 text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-extrabold text-[#1a1a1a] leading-[1.15] transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Hear From Those Who{' '}
            <span className="text-[#c7ab77]">Made the Commitment</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`group relative bg-white p-8 sm:p-10 border border-[#e8e4dc] rounded-sm transition-all duration-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:border-[#c7ab77]/30 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c7ab77]" />

              <Quote size={28} className="text-[#c7ab77]/30 mb-6" strokeWidth={1} />

              <p
                className="text-[#444] text-[0.9rem] leading-[1.8] mb-8"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[#e8e4dc]">
                <div
                  className="w-10 h-10 flex items-center justify-center bg-[#111] text-[#c7ab77] text-xs font-bold tracking-wider rounded-sm"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p
                    className="text-[#1a1a1a] text-[0.85rem] font-bold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-[#999] text-[0.75rem]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
