/*
 * Results Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Sections: Hero → Featured Video → Video Grid → Student Experiences → CTA → Footer
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold), #1a1a1a (near-black)
 */

import { useEffect, useRef, useState } from 'react';
import { Quote, Play, ChevronDown } from 'lucide-react';

import { TrustpilotLogoWhite, TrustpilotStars } from '@/components/TrustpilotAssets';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RESULTS_HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/results-hero-bg-CpFzyjQL6EaMaycvJfWQyx.webp';

/* ── Video data ── */
const featuredVideo = {
  vimeoId: '1171149705',
  title: 'What People Have to Say About Us',
  description:
    'Hear directly from our students about how Trader Foundation transformed their approach to the markets and their lives.',
  thumbnail:
    'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/thumb-featured-6YEkiyfZoKQy5PqapuiZX4.webp',
};

const videoTestimonials = [
  {
    vimeoId: '936212402',
    name: 'Zeke',
    tagline: 'From Stressed to Blessed',
    highlight: 'First day yielded $12,000, left retail to be a full-time dad',
    duration: '21:14',
    thumbnail:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/thumb-zeke-Z6iHpZk4D9Kx7v9h5SrdGH.webp',
  },
  {
    vimeoId: '936218776',
    name: 'Jason',
    tagline: 'From Beginner to Professional',
    highlight: 'Built a complete trading plan and now trades with confidence',
    duration: '30:51',
    thumbnail:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/thumb-jason-93NwmsCwnfyeuWHmLGXgu2.webp',
  },
  {
    vimeoId: '936211466',
    name: 'Shrey',
    tagline: 'Turning Doubt Into Confidence',
    highlight: 'Went from inconsistent trades to a reliable weekly income',
    duration: '16:05',
    thumbnail:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/thumb-shrey-kQvhCxm6ya6xyk8SrdfpLa.webp',
  },
  {
    vimeoId: '949813014',
    name: 'Lev',
    tagline: 'Simplifying Trading for Real Results',
    highlight: 'Found clarity after years of trying different approaches',
    duration: '2:24',
    thumbnail:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/thumb-lev-kjmSrQainqKDkYgUgkSsML.webp',
  },
];

/* ── Text testimonials (student experiences) - all real TrustPilot reviews ── */
const studentExperiences = [
  {
    quote:
      'The program provides an excellent foundation for understanding options, strategy and pattern recognition. The real value is the access to the coaches. Erin, Elliot and Leo all have different trading styles, and patterns that they personally follow. My trading has improved dramatically as a result.',
    name: 'Doug B.',
    role: 'CFO',
    initials: 'DB',
  },
  {
    quote:
      'My experience with Vlad and his team has been nothing short of incredible! This is a high level organization. Coaches Elliot, Erin, and Leo genuinely want to see you succeed and work with you one on one. It is the type of personal touch that you can only find with this group.',
    name: 'Matt Couch',
    role: 'Healthcare Sales Director',
    initials: 'MC',
  },
  {
    quote:
      'A whole new world is opened up to me! I was stuck in the 9-to-5 prison of wage slavery. Trader Foundation helped me to find success on my terms. TF helped to hone my talents to grow those blessings to better provide for my family and our future.',
    name: 'Chase Brey',
    role: 'IT Director',
    initials: 'CB',
  },
  {
    quote:
      'This course introduces you to the fundamentals before guiding you into real trading. The coaches really want you to succeed. They answer every question and meet with you as needed. They continually encourage you to practice until you feel comfortable trading with real money.',
    name: 'Lisa',
    role: 'IT Director',
    initials: 'LI',
  },
  {
    quote:
      'I joined Trader Foundation with no prior trading experience. Through the structured training, weekly coaching sessions, and daily live sessions, I gradually built both technical skills and confidence. By July 2025, I had grown my initial capital by three times.',
    name: 'Esther Kamau',
    role: 'Global Program Director',
    initials: 'EK',
  },
  {
    quote:
      'Coaching hours are not capped, community goes live daily to evaluate the market, and you get access to multiple, highly skilled coaches who trade profitably in their own ways. Between private coaching, the structured course, and the daily live streams, it\'s possible to get 15-20 hours of guidance every week.',
    name: 'Alick Yu',
    role: 'Engineer',
    initials: 'AY',
  },
];

/* ── Fade-in hook ── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Video Embed Component ── */
function VimeoEmbed({
  vimeoId,
  title,
  thumbnail,
  className = '',
}: {
  vimeoId: string;
  title: string;
  thumbnail?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative bg-[#0a0a0a] overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => setLoaded(true)}
            className="group flex items-center justify-center w-20 h-20 rounded-full bg-[#c7ab77]/90 hover:bg-[#c7ab77] transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label={`Play ${title}`}
          >
            <Play size={28} className="text-[#111] ml-1" fill="#111" />
          </button>
        </div>
      )}
      {!loaded && (
        <img
          src={thumbnail || `https://vumbnail.com/${vimeoId}.jpg`}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {loaded && (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  );
}

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

/* ── FAQ Accordion Item ── */
function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-[#c7ab77]/15 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span
          className="text-[#1a1a1a] font-bold text-[1rem] sm:text-[1.1rem] pr-8 group-hover:text-[#c7ab77] transition-colors duration-300"
          style={{ fontFamily: "'Sen', sans-serif" }}
        >
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#c7ab77] rotate-180' : 'bg-[#f0ece4] group-hover:bg-[#c7ab77]/20'
        }`}>
          <ChevronDown size={18} className={`transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#888]'}`} />
        </div>
      </button>
      <div
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-400 ease-in-out"
      >
        <div ref={contentRef} className="pb-6">
          <p
            className="text-[#555] text-[0.95rem] leading-[1.8] max-w-[90%]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQ Section (Black & Gold Luxe) ── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 sm:py-24 bg-[#0a0a0a]" ref={sectionRef}>
      <div className="max-w-[900px] mx-auto px-6 lg:px-8">
        {/* Vimeo Video Embed */}
        <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="relative w-full rounded-lg overflow-hidden border border-[#c7ab77]/20 shadow-2xl" style={{ paddingTop: '56.25%' }}>
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

        {/* FAQ Header */}
        <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c7ab77]" />
            <p
              className="text-[0.75rem] font-bold tracking-[0.3em] uppercase text-[#c7ab77]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Got Questions?
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c7ab77]" />
          </div>
          <h2
            className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.8rem] font-extrabold text-white leading-[1.15] mb-12 text-center tracking-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            COMMON QUESTIONS <span className="text-[#c7ab77]">ANSWERED</span>
          </h2>
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
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-[#c7ab77] rotate-180' : 'bg-white/10 group-hover:bg-[#c7ab77]/30'
                }`}>
                  <ChevronDown size={18} className={`transition-colors duration-300 ${openIndex === index ? 'text-black' : 'text-[#c7ab77]'}`} />
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
  );
}

/* ── Page ── */
export default function Results() {
  const featured = useFadeIn();
  const grid = useFadeIn();
  const experiences = useFadeIn();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${RESULTS_HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#111]/90 to-[#111]" />

        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Real Stories, Real Freedom
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Our Students&rsquo; <span className="text-[#c7ab77]">Results</span>
          </h1>
          <p
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Over 1,200 traders have transformed their financial future with
            Trader Foundation. Watch their stories and decide for yourself.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="flex items-center gap-3">
              <TrustpilotLogoWhite className="h-5" />
              <TrustpilotStars className="h-4" />
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-0">
              <div className="flex items-center gap-1.5 bg-[#003366] rounded-full px-3 py-1.5">
                <svg className="h-5 w-3.5 shrink-0" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2c-2 4-8 8-8 14 0 5 3 8 6 9-1-2-1.5-4-.5-7 1-3 4-7 6-9 1 4 0 8-1 10 3-2 5.5-6 5.5-10C28 5 23 2 20 2z" fill="#4A9FD9" />
                  <path d="M20 6c-1 3-5 6-5 10 0 3 2 5 4 6-.5-1.5-1-3 0-5 .75-2 2.5-5 4-6.5.5 3 0 6-.5 7.5 2-1.5 3.5-4 3.5-7 0-3-3-6-6-5z" fill="#6BB8E8" />
                  <rect x="14" y="27" width="12" height="2.5" rx="0.5" fill="#4A9FD9" />
                  <rect x="16" y="29.5" width="8" height="2" rx="0.5" fill="#4A9FD9" />
                  <rect x="13" y="31.5" width="14" height="2.5" rx="0.5" fill="#4A9FD9" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-white text-[0.4rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BETTER</span>
                  <span className="text-white text-[0.4rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BUSINESS</span>
                  <span className="text-white text-[0.4rem] font-bold tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>BUREAU</span>
                </div>
              </div>
              <div className="-ml-2.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#1a5ca8] border-2 border-white/20 z-10">
                <div className="text-center leading-none">
                  <span className="text-white text-[0.75rem] font-extrabold" style={{ fontFamily: "'Sen', sans-serif" }}>A+</span>
                </div>
              </div>
            </div>
            <span className="text-white/20">|</span>
            <span
              className="text-white/60 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              6+ Years in Business
            </span>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <FAQSection />

      {/* ─── Featured Video ─── */}
      <section className="py-20 bg-[#111]">
        <div
          ref={featured.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            featured.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Featured Testimonial
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              {featuredVideo.title}
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <VimeoEmbed
                vimeoId={featuredVideo.vimeoId}
                title={featuredVideo.title}
                thumbnail={featuredVideo.thumbnail}
                className="aspect-video"
              />
            </div>
            <p
              className="text-white/50 text-sm text-center mt-6 max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {featuredVideo.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Video Testimonials Grid ─── */}
      <section className="py-24 bg-[#faf9f6]">
        <div
          ref={grid.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            grid.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              In-Depth Interviews
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Hear Their Full Stories
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTestimonials.map((video, i) => (
              <div
                key={video.vimeoId}
                className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-[#c7ab77]/30"
                style={{
                  transitionDelay: `${i * 100}ms`,
                  opacity: grid.visible ? 1 : 0,
                  transform: grid.visible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.6s ease ${i * 100}ms`,
                }}
              >
                <VimeoEmbed
                  vimeoId={video.vimeoId}
                  title={`Interview with ${video.name}`}
                  thumbnail={video.thumbnail}
                  className="aspect-video"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {video.tagline}
                    </p>
                    <span
                      className="text-[#999] text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {video.duration}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-extrabold text-[#111] mb-2"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Interview with {video.name}
                  </h3>
                  <p
                    className="text-[#555] text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {video.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* YouTube CTA */}
          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com/@TheTraderFoundation/playlists"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#c7ab77] hover:text-[#dfc48a] transition-colors duration-300 group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-semibold tracking-wide">Watch more testimonials on our YouTube channel</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Student Experiences (Text Testimonials) ─── */}
      <section className="py-24 bg-[#111]">
        <div
          ref={experiences.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            experiences.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Student Experiences
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Professionals Who{' '}
              <span className="text-[#c7ab77]">Took the Leap</span>
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentExperiences.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group relative bg-[#1a1a1a] p-8 sm:p-10 border border-white/5 rounded-lg transition-all duration-500 hover:shadow-[0_8px_40px_rgba(199,171,119,0.08)] hover:border-[#c7ab77]/30"
                style={{
                  transitionDelay: `${300 + index * 150}ms`,
                  opacity: experiences.visible ? 1 : 0,
                  transform: experiences.visible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.6s ease ${300 + index * 150}ms`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c7ab77]" />

                <Quote
                  size={28}
                  className="text-[#c7ab77]/30 mb-6"
                  strokeWidth={1}
                />

                <p
                  className="text-white/70 text-[0.9rem] leading-[1.8] mb-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-[#c7ab77] text-[#111] text-xs font-bold tracking-wider rounded-sm"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p
                      className="text-white text-[0.85rem] font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-white/40 text-[0.75rem]"
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

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Ready to Write Your Own{' '}
            <span className="text-[#c7ab77]">Success Story</span>?
          </h2>
          <p
            className="text-[#555] text-base leading-relaxed mb-8 max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Join over 1,200 students who have transformed their trading and
            their lives with personalized coaching from our experienced team.
          </p>
          <a
            href="https://start.traderfoundation.co/trade"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Watch The Masterclass
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
