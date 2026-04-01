/*
 * About Page, Trader Foundation Academy
 * Sections: eBook Signup → Condensed Vlad Story → Erin Spotlight → Meet the Coaches → Footer
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LiveChatWidget from '@/components/LiveChatWidget';
import { BookOpen, ArrowRight, Quote } from 'lucide-react';

/* ── Photo URLs ── */
const VLAD_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad_processed_v2_9073b39a.jpg';
const ELLIOT_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/elliot_7d09de2a.jpg';
const ERIN_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/erin_93b42a5c.jpg';
const LEO_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/leo_professional_b52839af.png';

/* ── Coach data with philosophies ── */
const coaches = [
  {
    name: 'Elliot Gumbs',
    title: 'Lead Mentor',
    experience: '10+ Years of Market Experience',
    photo: ELLIOT_PHOTO,
    philosophy: '"I genuinely love the markets. Taking something complex and making it simple enough for anyone to understand — that\'s what gets me going."',
    bio: 'Options used to feel like a foreign language to me. After a decade in the markets, I became the person I wish I had when I was starting out. I specialize in breaking down complex options strategies into plain English so that anyone can trade with confidence. As Lead Mentor, I built the curriculum thousands of students use every day and host daily market meetups where we analyze setups together in real time. But honestly, the reason I show up every day isn\'t the market — it\'s the people. Watching someone go from confused to confident is the most rewarding thing I\'ve ever done.',
  },
  {
    name: 'Erin Chawla',
    title: 'Senior Coach \u00b7 Head of YouTube Education',
    experience: '11+ Years of Experience',
    photo: ERIN_PHOTO,
    philosophy: '"Trading is like dating — choose the best and leave the rest."',
    bio: 'My approach is different from most. I only trade off Weekly and Monthly charts. No noise. No chasing. Just patience and precision. What drives me isn\'t just the trades — it\'s the people behind them. I genuinely love helping others build real, lasting wealth through disciplined swing trading. Every free video I create, every question I answer, comes from the same place: I remember what it felt like to figure this out alone, and I don\'t want anyone else to go through that.',
  },
  {
    name: 'Leo Gonzalez',
    title: 'Senior Coach',
    experience: '13+ Years of Experience',
    photo: LEO_PHOTO,
    philosophy: '"I do this genuinely because I can\'t wait for that moment when someone says — I got this."',
    bio: 'For years, I watched traders blow up their accounts chasing the next big move. Meanwhile, I was quietly collecting consistent income from the market like clockwork \u2014 that\'s how I earned the nickname "The Paycheck Collector." With 13 years of experience, I specialize in building trades designed to pay week after week. But what gets me out of bed isn\'t the income \u2014 it\'s knowing that every student I help is one more person who doesn\'t have to depend on a boss, a company, or a paycheck they can\'t control.',
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
                charts, and options &mdash; <strong className="text-white/85">absolutely free.</strong>
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

            {/* Story text (3 cols) — condensed */}
            <div className="lg:col-span-3">
              <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
                The Founder
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
                From $150K in Losses to Building a Trading Academy
              </h2>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                After 20 years as a Director of Training at a Fortune 500 company, Vlad had the six-figure salary and the corner office &mdash; but he was burned out, missing his family, and dying inside. Then came the wake-up call: he lost $29,000 in 29 days trading penny stocks.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                That failure became fuel. Vlad tried every trading method until he discovered the approach that actually works. But here's what makes him different from every other trading educator: he spent two decades teaching Fortune 500 executives. Great traders don't always make great teachers &mdash; Vlad mastered both.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                But what truly drives Vlad isn't profit &mdash; it's people. He gives away more free education than most programs charge for because he genuinely believes everyone deserves access to real financial knowledge. From free YouTube content to the Stock Predator E-Book, Vlad's mission has always been the same: help as many people as possible take control of their financial future.
              </p>
              <p className="text-[#555] text-sm leading-relaxed italic border-l-2 border-[#c7ab77]/40 pl-4">
                "I don't do this for the money. I do this because I remember what it felt like to have no one in my corner. If I can be that person for someone else &mdash; that's everything."
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
              It can be exciting. It can be fun. And we welcome the process. Each of us brings something different to the table, but at the end of the day we all share the same goal &mdash; helping everyone build generational wealth. We genuinely love what we do, and that's what makes this community different.
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
                {/* Photo — brightened */}
                <div className="relative overflow-hidden">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(1.15) contrast(1.05)' }}
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
                      {coach.philosophy}
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

      <Footer />
      <LiveChatWidget />
    </div>
  );
}
