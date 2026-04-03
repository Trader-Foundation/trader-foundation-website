/*
 * FAQ Page, Trader Foundation Academy
 * Design: Black & Gold Luxe style
 * Sections: Hero → Vimeo Video → FAQ Toggles → Book a Call CTA → Footer
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #0a0a0a (black), #c7ab77 (gold), white text
 */

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/* ── FAQ Data ── */
const faqItems = [
  {
    question: 'Am I Capable of Learning This?',
    answer: 'Yes. Trading comes down to two things: pattern recognition and risk management. We\'ve trained over 1,100 students, including engineers, dentists, retirees, and people from every walk of life. You don\'t need to be a genius. You need to be coachable.',
  },
  {
    question: 'I\'ve tried other trading methods and lost money. Why would this be different?',
    answer: 'Because we don\'t sell shortcuts. AI bots, signals, and YouTube courses fail because they skip the foundation. We teach you the "why" behind the market, give you a proven system, and coach you 1-on-1 until you get it. We don\'t stop until you do.',
  },
  {
    question: 'I\'m worried I\'m not disciplined enough. What if I quit?',
    answer: 'That\'s exactly why accountability is built into this program. Your coach holds you accountable with weekly check-ins, homework reviews, and 1-on-1 sessions. Over 300 students renew with us every year because they know we won\'t let them quit.',
  },
  {
    question: 'Do you have any free courses I can watch?',
    answer: 'Yes. We offer the Stock Predator Course for free. It covers foundational trading concepts so you can experience our teaching style firsthand.',
  },
  {
    question: 'How much time do I need to commit?',
    answer: 'About 2 hours per week. That could be 30 minutes a few days a week, an hour on the weekend, or however you want to break it up. This is designed for busy professionals. You don\'t have to trade during market hours.',
  },
  {
    question: 'How often will I talk to my coach?',
    answer: 'You\'ll have regular 1-on-1 sessions with your dedicated coach, plus access to daily live market sessions. The frequency is tailored to your learning pace and schedule — most students connect with their coach multiple times per week.',
  },
  {
    question: 'Is this group coaching or 1-on-1?',
    answer: 'This is genuine 1-on-1 coaching. You get a dedicated coach who works with you individually. We also offer daily group live sessions for real-time market analysis, but your core learning experience is completely personalized.',
  },
  {
    question: 'Why is this better than AI bots, signals, or YouTube education?',
    answer: 'AI bots and signals give you fish — we teach you how to fish. YouTube education is fragmented and lacks accountability. Our program gives you a proven system, a dedicated coach, and a structured path from beginner to confident trader. You build a real skill that lasts a lifetime.',
  },
  {
    question: 'What\'s your guarantee?',
    answer: 'If you\'re not winning at least 70% of your trades within 90 days, you get every penny back. The condition: you follow the system, do the homework, attend your coaching sessions, and follow the rules. You commit, we commit.',
  },
  {
    question: 'How much does this cost?',
    answer: 'This is a 4 to 5 figure investment. The exact price depends on the program level you choose and your specific situation. We\'ll discuss that on your call. We\'re looking for people who are serious and committed.',
  },
  {
    question: 'Do you offer payment plans or funding options?',
    answer: 'Yes. We have flexible funding options to help you invest in the program. We offer payment plans that work with your budget so you can get started without a large upfront cost. The goal is to remove financial barriers for people who are serious about learning.',
  },
  {
    question: 'What if I don\'t like the coaches?',
    answer: 'You keep trading, growing, and learning. Many students renew because they value the coaching and community. Some become self-sufficient and trade on their own. Either way, the door is always open. This is a family, and family is forever.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="relative max-w-[900px] mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c7ab77]" />
            <p
              className="text-[0.7rem] font-bold tracking-[0.35em] uppercase text-[#c7ab77]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Got Questions? We've Got Answers.
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c7ab77]" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            COMMON QUESTIONS{' '}
            <span className="text-[#c7ab77]">ANSWERED</span>
          </h1>
          <p
            className="text-white/50 text-base max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Watch Vlad answer the most common questions, then explore each one below.
          </p>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="pb-24 bg-[#0a0a0a]" ref={sectionRef}>
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          {/* Vimeo Video Embed */}
          <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div
              className="relative w-full rounded-lg overflow-hidden border border-[#c7ab77]/20 shadow-2xl"
              style={{ paddingTop: '56.25%' }}
            >
              <iframe
                src="https://player.vimeo.com/video/850662205?h=&badge=0&autopause=0&player_id=0&app_id=58479"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Answering FAQs"
              />
            </div>
          </div>

          {/* FAQ Items */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-[#c7ab77]/15 last:border-b-0">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span
                    className="text-white font-bold text-[1rem] sm:text-[1.1rem] pr-8 group-hover:text-[#c7ab77] transition-colors duration-300 italic"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index
                        ? 'bg-[#c7ab77] rotate-180'
                        : 'bg-white/10 group-hover:bg-[#c7ab77]/30'
                    }`}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-colors duration-300 ${
                        openIndex === index ? 'text-black' : 'text-[#c7ab77]'
                      }`}
                    />
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{ maxHeight: openIndex === index ? '500px' : '0px' }}
                >
                  <div className="pb-6">
                    <p
                      className="text-white/70 text-[0.95rem] leading-[1.8] max-w-[90%] font-bold italic"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book a Call CTA */}
          <div className={`mt-16 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p
              className="text-white/50 text-sm mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Still have questions? Let's talk.
            </p>
            <a
              href="https://traderfoundation.fillout.com/t/w1vozRAz1uus?utm_source=Website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-[#c7ab77] text-black font-bold text-sm tracking-wide uppercase hover:bg-[#d4bc8e] transition-all duration-300"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
