/*
 * About Page, Trader Foundation Academy
 * Sections: eBook Signup → Condensed Vlad Story → Erin Spotlight → Meet the Coaches → Footer
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

import { BookOpen, ArrowRight, Quote } from 'lucide-react';

/* ── Photo URLs ── */
const VLAD_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad_processed_v2_9073b39a.jpg';
const ELLIOT_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/elliot-no-beard_50222be5.png';
const ERIN_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/erin_93b42a5c.jpg';
const LEO_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/leo_professional_b52839af.png';
const JHALIL_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/jhalil-team_380dedda.png';
const STEVE_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/steve-lapa-team_baeaf108.png';
const ARIANA_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/ariana-tayman-team_e13d7ff2.png';

/* ── Leadership team data ── */
const leadership = [
  {
    name: 'Jhalil Timazee',
    title: 'Enrollment Specialist',
    subtitle: '20+ Years of Leadership Experience',
    photo: JHALIL_PHOTO,
    bio: 'Two decades of leadership experience across multiple industries taught Jhalil one thing: people come first. He brings that same philosophy to Trader Foundation, taking the time to understand where each person is in their financial journey and helping them take the next step with confidence. His track record of driving record-breaking results comes from one simple approach, genuinely caring about the people he works with.',
  },
  {
    name: 'Steve Lapa',
    title: 'Head of Sales Development, Vice President',
    subtitle: '15+ Years of Experience',
    photo: STEVE_PHOTO,
    bio: '15+ years of leadership across finance, investments, and business development. Steve brings a consultative approach to every conversation, helping prospective students understand exactly how Trader Foundation can fit into their financial goals.',
  },
  {
    name: 'Jake Glass',
    title: 'Enrollment Specialist',
    subtitle: '11+ Years of Sales Experience',
    photo: '',
    bio: 'With over a decade of experience in high-level sales and relationship management, Jake knows that the best results come from genuinely caring about the person on the other end. He takes the time to understand each individual\'s financial goals and helps them see exactly how Trader Foundation can transform their future.',
  },
  {
    name: 'Ariana Tayman',
    title: 'Head of Customer Support',
    subtitle: '7+ Years of Experience',
    photo: ARIANA_PHOTO,
    bio: 'Ariana is the first person you\'ll hear from and the one who makes sure no question goes unanswered. She genuinely cares about every student\'s experience, from the moment they join to every milestone along the way. Her mission is simple: make sure everyone in the Trader Foundation community feels supported, valued, and never alone on their journey.',
  },
];

/* ── Coach data with philosophies ── */
const coaches = [
  {
    name: 'Elliot Gumbs',
    title: 'Lead Mentor',
    experience: '10+ Years of Market Experience',
    photo: ELLIOT_PHOTO,
    philosophy: '"I love the markets. Taking something complex and making it simple enough for anyone to understand, that\'s what gets me going."',
    cardQuote: '"Options don\'t have to be complicated. Once you see the pattern, you can\'t unsee it."',
    bio: 'Options used to feel like a foreign language to me. After a decade in the markets, I became the person I wish I had when I was starting out. I specialize in breaking down complex options strategies into plain English so that anyone can trade with confidence. As Lead Mentor, I built the curriculum thousands of students use every day and host daily market meetups where we analyze setups together in real time. But honestly, the reason I show up every day isn\'t the market, it\'s the people. Watching someone go from confused to confident is the most rewarding thing I\'ve ever done.',
  },
  {
    name: 'Erin Chawla',
    title: 'Senior Coach \u00b7 Head of YouTube Education',
    experience: '11+ Years of Experience',
    photo: ERIN_PHOTO,
    philosophy: '"Trading is like dating, choose the best and leave the rest."',
    cardQuote: '"Patience isn\'t boring, it\'s profitable. I only need a few great setups a month."',
    bio: 'My approach is different from most. I only trade off Weekly and Monthly charts. No noise. No chasing. Just patience and precision. What drives me isn\'t just the trades, it\'s the people behind them. I genuinely love helping others build real, lasting wealth through disciplined swing trading. Every free video I create, every question I answer, comes from the same place: I remember what it felt like to figure this out alone, and I don\'t want anyone else to go through that.',
  },
  {
    name: 'Leo Gonzalez',
    title: 'Senior Coach',
    experience: '13+ Years of Experience',
    photo: LEO_PHOTO,
    philosophy: '"I do this genuinely because I can\'t wait for that moment when someone says, I got this."',
    cardQuote: '"The market pays you like a business when you treat it like one. Consistent income, every single week."',
    bio: 'For years, I watched traders blow up their accounts chasing the next big move. Meanwhile, I was quietly collecting consistent income from the market like clockwork, that\'s how I earned the nickname "The Paycheck Collector." With 13 years of experience, I specialize in building trades designed to pay week after week. But what gets me out of bed isn\'t the income, it\'s knowing that every student I help is one more person who doesn\'t have to depend on a boss, a company, or a paycheck they can\'t control.',
  },
];

/* ── Fade-in hook ── */
function useFadeIn(threshold = 0.15) {
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

/* ── SproutCloud form script loader ── */
function useFormScript() {
  useEffect(() => {
    const existing = document.querySelector('script[src="https://link.sproutcloud.co/js/form_embed.js"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://link.sproutcloud.co/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
}

/* ── Page ── */
export default function About() {
  const story = useFadeIn();
  const erinRef = useFadeIn();
  const team = useFadeIn();
  useFormScript();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ─── eBook Signup Hero ─── */}
      <section className="relative pt-24 pb-10 bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#111]" />
        <div className="relative max-w-[900px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Copy */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded"
                  style={{ backgroundColor: 'rgba(199, 171, 119, 0.12)' }}
                >
                  <BookOpen className="h-3 w-3 text-[#c7ab77]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7ab77]">
                  Free Download
                </span>
              </div>
              <h1
                className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3"
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                Get Your Free<br />
                <span className="text-[#c7ab77]">Stock Predator E-Book</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
                Learn what separates the 10% who profit from the 90% who lose.
                Vlad Tayman's complete guide to pattern recognition, candlestick
                charts, and options, <strong className="text-white/85">absolutely free.</strong>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {['5 Modules', '64 Pages', 'Beginner Friendly'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <ArrowRight className="h-3 w-3 text-[#c7ab77]" />
                    <span className="text-xs text-white/50">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: SproutCloud Form */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(199, 171, 119, 0.15)',
              }}
            >
              <iframe
                src="https://link.sproutcloud.co/widget/form/zNekBbMTW3PeN6o7IEY0"
                style={{ width: '100%', height: '340px', border: 'none', borderRadius: '3px' }}
                id="about-form-zNekBbMTW3PeN6o7IEY0"
                data-layout='{"id":"INLINE"}'
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="erin new website form ebook signup"
                data-height="340"
                data-layout-iframe-id="about-form-zNekBbMTW3PeN6o7IEY0"
                data-form-id="zNekBbMTW3PeN6o7IEY0"
                title="erin new website form ebook signup"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vlad's Story (Condensed) ─── */}
      <section className="py-20 bg-[#faf9f6]">
        <div
          ref={story.ref}
          className={`max-w-[1100px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            story.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
            {/* Vlad's photo (2 cols) */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute -inset-3 border border-[#c7ab77]/20 rounded-lg" />
                <img
                  src={VLAD_PHOTO}
                  alt="Vlad Tayman, Founder & CEO of Trader Foundation"
                  className="w-full aspect-[4/5] object-cover rounded-lg shadow-xl"
                  style={{ filter: 'brightness(1.1)' }}
                />
              </div>
              <h3 className="text-xl font-extrabold text-[#111] mt-5" style={{ fontFamily: "'Sen', sans-serif" }}>
                Vlad Tayman
              </h3>
              <p className="text-[#c7ab77] text-sm font-medium">Founder & CEO</p>
            </div>

            {/* Story text (3 cols), condensed */}
            <div className="lg:col-span-3">
              <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
                The Founder
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
                From $150K in Losses to Building a Trading Academy
              </h2>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                After 20 years as a Director of Training at a Fortune 500 company, Vlad had the six-figure salary and the corner office, but he was burned out, missing his family, and dying inside. Then came the wake-up call: he lost $29,000 in 29 days trading penny stocks.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                That failure became fuel. Vlad tried every trading method until he discovered the approach that actually works. But here's what makes him different from every other trading educator: he spent two decades teaching Fortune 500 executives. Great traders don't always make great teachers. Vlad mastered both.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                But what truly drives Vlad isn't profit, it's people. He gives away more free education than most programs charge for because he genuinely believes everyone deserves access to real financial knowledge. From free YouTube content to the Stock Predator E-Book, Vlad's mission has always been the same: help as many people as possible take control of their financial future.
              </p>
              <p className="text-[#555] text-sm leading-relaxed italic border-l-2 border-[#c7ab77]/40 pl-4">
                "Everyone deserves to understand how money really works. Not just the theory, but the real skills to grow wealth on your own terms. The best moment is when a student stops relying on someone else and starts making confident financial decisions on their own. That's the transformation we're building here."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Philosophy ─── */}
      <section className="py-16 bg-[#111]">
        <div
          ref={erinRef.ref}
          className={`max-w-[900px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            erinRef.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-10">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              What We Believe
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
              Building Wealth Doesn't Need to Be Scary
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto">
              It can be exciting. It can be fun. And we welcome the process. Each of us brings something different to the table, but at the end of the day we all share the same goal, helping everyone build generational wealth. We genuinely love what we do, and that's what makes this community different.
            </p>
          </div>

          {/* Coach philosophy quotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {coaches.map((coach) => (
              <div
                key={coach.name}
                className="rounded-lg px-5 py-5 text-center"
                style={{
                  backgroundColor: 'rgba(199, 171, 119, 0.04)',
                  border: '1px solid rgba(199, 171, 119, 0.1)',
                }}
              >
                <Quote className="h-4 w-4 text-[#c7ab77]/40 mx-auto mb-3" />
                <p className="text-white/70 text-sm leading-relaxed italic mb-3">
                  {coach.philosophy}
                </p>
                <div className="w-8 h-[1px] bg-[#c7ab77]/20 mx-auto mb-2" />
                <p className="text-white text-sm font-semibold">{coach.name}</p>
                <p className="text-[#c7ab77] text-xs">{coach.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Meet the Coaches ─── */}
      <section className="py-20 bg-[#faf9f6]">
        <div
          ref={team.ref}
          className={`max-w-[1100px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            team.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section label */}
          <div className="text-center mb-14">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              Your Coaching Team
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
              Meet the Coaches
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          {/* Coach cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {coaches.map((coach, i) => (
              <div
                key={coach.name}
                className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/40 hover:shadow-[0_8px_40px_rgba(199,171,119,0.1)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Photo, brightened */}
                <div className="relative overflow-hidden">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(1.35) contrast(1.05)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Info */}
                <div className="px-6 pb-6 -mt-4 relative">
                  <h3 className="text-xl font-extrabold text-[#111] mb-1" style={{ fontFamily: "'Sen', sans-serif" }}>
                    {coach.name}
                  </h3>
                  <p className="text-[#c7ab77] text-sm font-semibold mb-1">
                    {coach.title}
                  </p>
                  <p className="text-[#888] text-xs font-medium tracking-wide mb-4">
                    {coach.experience}
                  </p>

                  {/* Philosophy */}
                  <div
                    className="rounded px-4 py-3 mb-4"
                    style={{ backgroundColor: 'rgba(199, 171, 119, 0.06)', border: '1px solid rgba(199, 171, 119, 0.12)' }}
                  >
                    <p className="text-[#555] text-[0.78rem] leading-relaxed italic">
                      {coach.cardQuote}
                    </p>
                  </div>

                  <div className="w-10 h-[1.5px] bg-[#c7ab77]/40 mb-4" />

                  <p className="text-[#555] text-[0.8rem] leading-relaxed">
                    {coach.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Team ─── */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              The Team Behind the Mission
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
              Meet the Team
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {leadership.map((member, i) => (
              <div
                key={member.name}
                className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/40 hover:shadow-[0_8px_40px_rgba(199,171,119,0.1)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full aspect-[4/5] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      style={{ filter: 'brightness(1.15) contrast(1.05)' }}
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-5xl font-extrabold text-[#c7ab77]/60" style={{ fontFamily: "'Sen', sans-serif" }}>
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="px-6 pb-6 -mt-4 relative">
                  <h3 className="text-xl font-extrabold text-[#111] mb-1" style={{ fontFamily: "'Sen', sans-serif" }}>
                    {member.name}
                  </h3>
                  <p className="text-[#c7ab77] text-sm font-semibold mb-1">
                    {member.title}
                  </p>
                  {'subtitle' in member && member.subtitle && (
                    <p className="text-[#888] text-xs font-medium tracking-wide mb-3">
                      {member.subtitle}
                    </p>
                  )}
                  {member.bio && (
                    <>
                      <div className="w-10 h-[1.5px] bg-[#c7ab77]/40 mb-4 mt-3" />
                      <p className="text-[#555] text-[0.8rem] leading-relaxed">
                        {member.bio}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
