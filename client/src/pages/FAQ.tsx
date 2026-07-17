/*
 * FAQ Page, Trader Foundation Academy
 * Design: Black & Gold Luxe style
 * Sections: Hero → FAQ Toggles → Book a Call CTA → Footer
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #0a0a0a (black), #c7ab77 (gold), white text
 */

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play, X } from 'lucide-react';

import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

/* ── Video testimonials (Google Drive, portrait/mobile-shot) ──
   Thumbnails served via lh3 proxy; clicking opens the video in a
   new tab. Files must be set to "Anyone with the link" on Drive. */
const videoTestimonials = [
  {
    id: '1dqb87PLU21iiLmNvieIUJCWI2hNsY9KT',
    name: 'Kunal Jani',
  },
  {
    id: '1eGC8oLbV8GZ6KuBKfyquPn1n19X8CKHb',
    name: 'Shawna Jones',
  },
  {
    id: '1ZANlOgAQLYjFqQfy0UPQq4Iz49I9CJWH',
    name: 'Danny Musaev',
  },
];

/* ── FAQ Data ── */
type Quote = { text: string; name: string; source: string };
type FaqItem = {
  question: string;
  answer: string;
  quotes?: Quote[];
};

const faqItems: FaqItem[] = [
  {
    question: 'Am I Capable of Learning This?',
    answer: 'Yes. Trading comes down to two things: pattern recognition and risk management. We\'ve trained over 1,100 students, including engineers, dentists, retirees, and people from every walk of life. You don\'t need to be a genius. You need to be coachable.',
    quotes: [
      {
        text: 'I have been learning a lot, and I have come a long way since I started my classes. Having access to a live person or persons has been incredibly encouraging.',
        name: 'Bobby Colucci',
        source: 'Verified Student Review',
      },
    ],
  },
  {
    question: 'I\'ve tried other trading methods and lost money. Why would this be different?',
    answer: 'Because we don\'t sell shortcuts. Our curriculum was built over a decade by our founder, Vlad Tayman, and is now delivered by Erin and our coaching team. AI bots, signals, and YouTube courses fail because they skip the foundation. We teach you the "why" behind the market, give you a proven system, and coach you 1-on-1 until you get it. We don\'t stop until you do.',
    quotes: [
      {
        text: 'My trading is completely turned around. I\'m more on the 10% side now, not the 90%. I\'ve won an overwhelming number of trades compared to my losers — maybe a few losses compared to nearly a hundred wins. It\'s made a huge difference to me.',
        name: 'Charles Brey',
        source: 'Student Testimonial',
      },
    ],
  },
  {
    question: 'I\'m worried I\'m not disciplined enough. What if I quit?',
    answer: 'That\'s exactly why accountability is built into this program. Your coach holds you accountable with weekly check-ins, homework reviews, and 1-on-1 sessions. Over 300 students renew with us every year because they know we won\'t let them quit.',
    quotes: [
      {
        text: 'I started trading during the pandemic. Got lucky on NIO, then lost a lot of money — at my worst, down 66% all time. After joining the program and clearing out my bad buys, I started this year with about $25k. I\'m up $16k, a little over 60% YTD. I have no doubt I\'ll make that $30k loss up this year.',
        name: 'Kelly Myers',
        source: 'Student Community',
      },
    ],
  },
  {
    question: 'Do you have any free courses I can watch?',
    answer: 'Yes. Our YouTube channel is packed with free trading education, market breakdowns, and lessons, so you can experience our teaching style firsthand before you ever join.',
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
    quotes: [
      {
        text: 'The company offers daily live sessions with coaches where stocks are reviewed in real time. Students are also encouraged to schedule one-on-one sessions with coaches for personalized guidance.',
        name: 'Jonas',
        source: 'Verified Student Review',
      },
    ],
  },
  {
    question: 'Why is this better than AI bots, signals, or YouTube education?',
    answer: 'AI bots and signals give you fish — we teach you how to fish. YouTube education is fragmented and lacks accountability. Our program gives you a proven system, a dedicated coach, and a structured path from beginner to confident trader. You build a real skill that lasts a lifetime.',
    quotes: [
      {
        text: 'The Skool platform they use is interactive and really breaks down trading concepts with tutorials and live examples. Vlad leads weekly calls to discuss the market, provide trading insight, and offer live trading opportunities to participate in that he is taking positions with himself in his own portfolio. If you are looking for a group that will not only provide you with a few fish but also teach you how to fish, this is the group!',
        name: 'Matt Couch',
        source: 'Student Community',
      },
      {
        text: 'I was calculating my Think or Swim account today. As of today, I\'m up just over 40% in this account. I am amazed at what I\'ve learned and how far I\'ve come from just joining this trading team. I\'m a seasoned options trader — 19 years — and the pieces I was missing from the puzzle were in the training.',
        name: 'Isaac Rorholm',
        source: 'Student Community',
      },
    ],
  },
  {
    question: 'What\'s your guarantee?',
    answer: 'If you\'re not winning at least 70% of your trades within 90 days, you get every penny back. The condition: you follow the system, do the homework, attend your coaching sessions, and follow the rules. You commit, we commit.',
    quotes: [
      {
        text: 'I\'ve won an overwhelming number of trades compared to my losers. The ones I\'ve lost, maybe a few — compared to nearly a hundred that I won. It\'s made a huge difference to me.',
        name: 'Charles Brey',
        source: 'Student Testimonial',
      },
    ],
  },
  {
    question: 'Do I need my own money to trade with?',
    answer: 'Yes. To get the most out of the program, we ask that you have at least $15,000+ in starting trading capital. This is the money you\'ll trade with in your own account, it\'s separate from the cost of the program itself. The Paycheck Collector method relies on selling defined-risk options, and $15,000+ gives you enough room to apply the strategy properly while keeping your risk controlled.',
  },
  {
    question: 'How much does this cost?',
    answer: 'This is a 4 to 5 figure investment. The exact price depends on the program level you choose and your specific situation. We\'ll discuss that on your call. We\'re looking for people who are serious and committed. Please note this program investment is separate from the trading capital you\'ll use in your own brokerage account.',
    quotes: [
      {
        text: 'Trader Foundation has enabled me to feel confident to dive into the deep end with strategies to succeed. The investment has paid off... big time!',
        name: 'Fred Nicora',
        source: 'Verified Student Review',
      },
    ],
  },
  {
    question: 'Do you offer payment plans or funding options?',
    answer: 'Yes. We have flexible funding options to help you invest in the program. We offer payment plans that work with your budget so you can get started without a large upfront cost. The goal is to remove financial barriers for people who are serious about learning.',
  },
  {
    question: 'What if I don\'t like the coaches?',
    answer: 'You keep trading, growing, and learning. Many students renew because they value the coaching and community. Some become self-sufficient and trade on their own. Either way, the door is always open. This is a family, and family is forever.',
    quotes: [
      {
        text: 'I absolutely love this program. The coaches are amazing and they genuinely care and want you to succeed. If you are looking to learn to trade I highly recommend them.',
        name: 'Bryton Lawrence',
        source: 'Student Community',
      },
    ],
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openVideoId, setOpenVideoId] = useState<string | null>(null);
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
      <SEO title="FAQ" description="Answers to the most common questions about Trader Foundation Academy's trading program." path="/faq" />
      <Navigation />

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="relative max-w-[900px] mx-auto px-6 lg:px-8 text-center">

          <h1
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            COMMON QUESTIONS{' '}
            <span className="text-[#c7ab77]">ANSWERED</span>
          </h1>

        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="pb-24 bg-[#0a0a0a]" ref={sectionRef}>
        <div className="max-w-[900px] mx-auto px-6 lg:px-8 pt-16">
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
                  style={{ maxHeight: openIndex === index ? '2000px' : '0px' }}
                >
                  <div className="pb-6">
                    <p
                      className="text-white/70 text-[0.95rem] leading-[1.8] max-w-[90%] font-bold italic"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.answer}
                    </p>
                    {item.quotes && item.quotes.map((q, qi) => (
                      <div key={qi} className="mt-5 max-w-[90%] border-l-2 border-[#c7ab77]/50 pl-4 py-1">
                        <p
                          className="text-white/85 text-[0.85rem] leading-relaxed italic"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          &ldquo;{q.text}&rdquo;
                        </p>
                        <p
                          className="mt-2 text-[#c7ab77] text-[0.7rem] font-semibold tracking-[0.15em] uppercase"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          — {q.name} · {q.source}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Testimonials — quick student reactions, portrait/mobile-shot */}
          <div className="mt-16">
            <p
              className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3 text-center"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Hear It From Them
            </p>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-white leading-tight text-center mb-10"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Quick Student Reactions
            </h2>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-[560px] mx-auto">
              {videoTestimonials.map((video) => (
                <div key={video.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setOpenVideoId(video.id)}
                    aria-label={`Play video testimonial from ${video.name}`}
                    className="group relative block bg-[#111] border border-[#c7ab77]/20 rounded-lg overflow-hidden hover:border-[#c7ab77]/60 transition-all duration-300"
                    style={{ aspectRatio: '9 / 16' }}
                  >
                    <img
                      src={`https://lh3.googleusercontent.com/d/${video.id}=s800`}
                      alt={video.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#c7ab77]/90 group-hover:bg-[#c7ab77] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <Play size={22} className="text-[#111] ml-1" fill="#111" />
                      </div>
                    </div>
                  </button>
                  <p
                    className="text-white text-xs sm:text-sm font-bold text-center mt-3"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {video.name}
                  </p>
                </div>
              ))}
            </div>
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
              href="https://start.traderfoundation.co/trade-yt"
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

      {/* ─── Video Player Modal ─── */}
      {openVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenVideoId(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpenVideoId(null)}
            aria-label="Close video"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div
            className="relative w-full max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: '9 / 16' }}
          >
            <iframe
              src={`https://drive.google.com/file/d/${openVideoId}/preview`}
              title="Student video testimonial"
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
