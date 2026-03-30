/*
 * About Page, Trader Foundation Academy
 * Sections: Hero banner, Vlad's Story, Meet the Coaches, CTA
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/* ── Photo URLs ── */
const VLAD_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad_88bac4e2.jpg';
const ELLIOT_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/elliot_7d09de2a.jpg';
const ERIN_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/erin_93b42a5c.jpg';
const LEO_PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="#1a1a1a"/><circle cx="200" cy="175" r="65" fill="#c7ab77" opacity="0.3"/><ellipse cx="200" cy="380" rx="100" ry="80" fill="#c7ab77" opacity="0.2"/><text x="200" y="470" text-anchor="middle" fill="#c7ab77" font-family="sans-serif" font-size="14" opacity="0.6">Photo Coming Soon</text></svg>`);

/* ── Coach data ── */
const coaches = [
  {
    name: 'Elliot Gumbs',
    title: 'Lead Mentor',
    experience: '10+ Years of Market Experience',
    photo: ELLIOT_PHOTO,
    specialties: [
      'Options Trading Specialist: Expert in demystifying complex derivative strategies for retail traders.',
      'Lead Mentor at Trader Foundation: Instrumental in developing the "foundational" curriculum used by thousands of students.',
      'Technical Analysis Pro: Specialized in price action and market structure to identify high-probability setups.',
      'Community Pillar: Known for daily market meetups and real-time analysis that "lifts the fog" for developing traders.',
    ],
  },
  {
    name: 'Erin Chawla',
    title: 'Senior Coach',
    experience: '11+ Years of Experience',
    photo: ERIN_PHOTO,
    specialties: [
      'Correction Opportunity Specialist: Expert in identifying high-probability entry points during market pullbacks and structural corrections.',
      'High-Timeframe Precision: Focused exclusively on Weekly and Monthly charts to filter out market noise and capture major trend shifts.',
      'Strategic "Trigger" Execution: Known for disciplined execution, waiting for the exact technical alignment before deploying capital.',
      'Wealth Generation Architect: Dedicated to long-term portfolio growth through swing trading methodologies and macro-cycle awareness.',
    ],
  },
  {
    name: 'Leo Gonzalez',
    title: 'Senior Coach',
    experience: '13+ Years of Experience',
    photo: LEO_PLACEHOLDER,
    specialties: [
      'Reversal Market Specialist: Expert in identifying trend exhaustion and pinpointing high-probability pivots before the broader market reacts.',
      'The "Paycheck Collector": Focused on generating consistent, repeatable cash flow through disciplined income-trading mechanics rather than speculative "moonshots."',
      'Systematic Income Mentor: Dedicated to helping traders transition from gambling to a "business mindset," treating the markets as a reliable source of weekly or monthly income.',
    ],
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

/* ── Page ── */
export default function About() {
  const story = useFadeIn();
  const team = useFadeIn();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-32 pb-20 bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#111]" />
        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our Story
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            The People Behind<br />
            <span className="text-[#c7ab77]">Trader Foundation</span>
          </h1>
          <p
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A team of experienced traders and educators dedicated to helping you
            build real, lasting skills in the market.
          </p>
        </div>
      </section>

      {/* ─── Vlad's Story ─── */}
      <section className="py-24 bg-[#faf9f6]">
        <div
          ref={story.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            story.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section label */}
          <div className="text-center mb-16">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              From Corporate Burnout to Trading Freedom
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              The Story That Changed Everything
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Story text (3 cols) */}
            <div className="lg:col-span-3 space-y-6">
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                "I was living the corporate nightmare you know all too well.
                Twenty years as a Director of Training at a Fortune 500
                telecommunications company. Six-figure salary. Corner office. All
                the external markers of success. But I was dying inside. Constant
                travel meant I was a stranger to my own family. Burnout hit so
                hard I couldn't even work. I was successful on paper but broke in
                every way that mattered.
              </p>
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Then came the wake-up call that changed everything: I lost
                $29,000 in 29 days trading penny stocks. At age 29. The perfect
                storm of failure.
              </p>
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                That's when I went on the ultimate search. I tried every trading
                method, failed at most of them, until I finally discovered the one
                approach that actually works for professionals like us.
                But here's what makes me different from every other trading
                educator: I spent 20 years teaching Fortune 500 executives.
                Great traders don't always make great teachers. I just happened
                to master both.
              </p>
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                That's why I've been able to help over 1,000 professionals escape
                the same corporate prison I was trapped in. Trading isn't just my
                business, it's my vehicle for creating fulfillment, not just success.
                And now, it's your path to freedom."
              </p>
            </div>

            {/* Vlad's photo + name (2 cols) */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="relative w-full max-w-[340px]">
                <div className="absolute -inset-3 border border-[#c7ab77]/20 rounded-lg" />
                <img
                  src={VLAD_PHOTO}
                  alt="Vlad Tayman, Founder & CEO of Trader Foundation"
                  className="w-full aspect-[4/5] object-cover rounded-lg shadow-xl"
                />
              </div>
              <h3
                className="text-xl font-extrabold text-[#111] mt-6"
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                Vlad Tayman
              </h3>
              <p
                className="text-[#c7ab77] text-sm font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Founder & CEO of Trader Foundation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Meet the Coaches ─── */}
      <section className="py-24 bg-[#111]">
        <div
          ref={team.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            team.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section label */}
          <div className="text-center mb-16">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Your Coaching Team
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Meet the Coaches
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          {/* Coach cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {coaches.map((coach, i) => (
              <div
                key={coach.name}
                className="group bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/30 hover:shadow-[0_8px_40px_rgba(199,171,119,0.08)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Photo */}
                <div className="relative overflow-hidden">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                </div>

                {/* Info */}
                <div className="px-6 pb-6 -mt-4 relative">
                  <h3
                    className="text-xl font-extrabold text-white mb-1"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {coach.name}
                  </h3>
                  <p
                    className="text-[#c7ab77] text-sm font-semibold mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {coach.title}
                  </p>
                  <p
                    className="text-white/40 text-xs font-medium tracking-wide mb-5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {coach.experience}
                  </p>

                  <div className="w-10 h-[1.5px] bg-[#c7ab77]/40 mb-5" />

                  <ul className="space-y-3">
                    {coach.specialties.map((s, j) => {
                      const [label, ...rest] = s.split(':');
                      const description = rest.join(':');
                      return (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-[#c7ab77] mt-1.5 text-[0.5rem]">&#9670;</span>
                          <p
                            className="text-white/60 text-[0.8rem] leading-relaxed"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            <span className="text-white/90 font-semibold">{label}:</span>
                            {description}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
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
            Ready to Learn From Our Team?
          </h2>
          <p
            className="text-[#555] text-base leading-relaxed mb-8 max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Join over 1,200 students who are building real trading skills with
            personalized coaching from our experienced team.
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
