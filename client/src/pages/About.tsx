/*
 * About Page, Trader Foundation
 * Sections: the founder's story, who we are, the philosophy, the coaches, the
 * team, footer.
 *
 * Visual system per DESIGN.md; register and claims per vladt83's brief of
 * 2026-11-09. No dollar figures, no percentages, no income claims, including
 * inside a coach's own quote: a bio promising "consistent income, every single
 * week" publishes that promise whoever is credited with saying it.
 */

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import Picture from '@/components/Picture';

import { Quote } from 'lucide-react';

/* ── Photo URLs ── */
/* All photos now local /images/ with webp siblings. */
const VLAD_PHOTO = '/images/vlad-founder.jpg';
const ELLIOT_PHOTO = '/images/elliot.jpg';
const ERIN_PHOTO = '/images/erin.jpg';
const LEO_PHOTO = '/images/leo.jpg';
const STEVE_PHOTO = '/images/steve.jpg';
const ARIANA_PHOTO = '/images/ariana.jpg';

/* ── Leadership team data ── */
const leadership = [
  {
    name: 'Steve Lapa',
    title: 'Vice President',
    subtitle: '15+ Years of Experience',
    photo: STEVE_PHOTO,
    bio: '15+ years of leadership across finance, investments, and business development. Steve brings a consultative approach to every conversation, helping prospective students understand exactly how Trader Foundation can fit into their financial goals.',
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
    photoAlt: 'Elliot, trading coach at Trader Foundation',
    photoWidth: 900,
    photoHeight: 1200,
    photoIsLocal: true,
    philosophy: '"I love the markets. Taking something complex and making it simple enough for anyone to understand, that\'s what gets me going."',
    cardQuote: '"Options don\'t have to be complicated. Once you see the pattern, you can\'t unsee it."',
    bio: 'Options used to feel like a foreign language to me. After a decade in the markets, I became the person I wish I had when I was starting out. I specialise in breaking complex options strategies down into plain English. As Lead Mentor I built the curriculum our students work through, and I host the daily market meetups where we go through setups together. But honestly, the reason I show up every day isn\'t the market, it\'s the people. Watching someone go from confused to confident is the most rewarding thing I\'ve ever done.',
  },
  {
    name: 'Erin Chawla',
    title: 'Senior Coach · Head of YouTube Education',
    experience: '11+ Years of Experience',
    photo: ERIN_PHOTO,
    photoAlt: 'Erin Chawla, trading coach at Trader Foundation',
    photoWidth: 960,
    photoHeight: 1200,
    photoIsLocal: true,
    philosophy: '"Trading is like dating, choose the best and leave the rest."',
    cardQuote: '"Patience is not boring. I only need a few good setups a month."',
    bio: 'After years in corporate finance at GE, I made the leap to full-time trading and coaching. My approach is different from most. I only trade off Weekly and Monthly charts. No noise. No chasing. Just patience and precision. What drives me isn\'t just the trades, it\'s the people behind them. What I care about is helping people manage their own capital with some discipline behind it. Every video I put out and every question I answer comes from the same place: I remember figuring this out alone, and I would not wish it on anyone.',
  },
  {
    name: 'Leo Gonzalez',
    title: 'Senior Coach',
    experience: '13+ Years of Experience',
    photo: LEO_PHOTO,
    photoAlt: 'Leo, trading coach at Trader Foundation',
    photoWidth: 959,
    photoHeight: 1200,
    photoIsLocal: true,
    philosophy: '"I do this genuinely because I can\'t wait for that moment when someone says, I got this."',
    cardQuote: '"Treat it like a business and it behaves like one. That starts with refusing the trades that pay too well."',
    bio: 'For years I watched traders blow up their accounts chasing the next big move, while I was quietly doing the unglamorous version: getting paid up front, capping the downside, and passing on anything that did not qualify. That is how I ended up with the nickname "The Paycheck Collector," which is now the name of what we teach. Thirteen years in, what keeps me here is not the trading. It is that every student I work with is one more person who is not relying on somebody else to make their financial decisions for them.',
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
  const philosophy = useFadeIn();
  const team = useFadeIn();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO title="About" description="Who teaches at Trader Foundation, where they came from, and what the program is built to do." path="/about" />
      <Navigation />

      {/* ─── Vlad's Story ─── */}
      <section className="pt-32 pb-20 bg-[#faf9f6]">
        <div
          ref={story.ref}
          className={`max-w-[1100px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            story.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Vlad's headshot, centered above the story */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-3 border border-[#c7ab77]/20" />
              <Picture
                src={VLAD_PHOTO}
                alt="Vlad Tayman, founder of Trader Foundation"
                width={1600}
                height={1091}
                loading="eager"
                className="w-full h-auto object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-[#1a1a1a] mt-6" >
              Vlad Tayman
            </h3>
            <p className="text-[#c7ab77] text-sm font-medium">Founder &amp; CEO</p>
          </div>

          {/* Story text, centered under the photo */}
          <div className="max-w-[720px] mx-auto">
            <h2 className="tf-display text-[#1a1a1a] text-[1.875rem] md:text-[2.5rem] mb-6 text-center mx-auto max-w-[24ch]">
              The founder
            </h2>
              <p className="text-[#3a3834] text-base leading-relaxed mb-4">
                Vlad came to America from Ukraine with nothing but a work ethic. He built his career the hard way, spending 20 years as a Director of Training at a Fortune 500 company. He had the salary and the title, and he was burned out, away from his family, and running out of reasons to stay. Then came the part he tells every new student about: he lost a serious amount of money, fast, trading penny stocks.
              </p>
              <p className="text-[#3a3834] text-base leading-relaxed mb-4">
                That is where the method came from. Vlad worked through approach after approach until he had one he would actually run with his own money. What makes him unusual is not the trading: it is <strong>two decades spent teaching Fortune 500 executives</strong>. Good traders are not automatically good teachers. He publishes a great deal of his teaching at no charge, because he thinks the information itself should not be the expensive part.
              </p>
              <p className="text-[#3a3834] text-base leading-relaxed mb-4">
                That mission runs deeper than one person. The coaches on this team aren't people who came here because they had no other options. They're <strong>smart, successful professionals</strong>. <strong>Elliot</strong> spent a decade in the options markets. <strong>Erin</strong> built her career in corporate finance at GE, reading P&amp;Ls and analyzing risk for a living. <strong>Leo</strong> tried every trading method out there and lost a lot of money before he figured out why nothing worked. He found Trader Foundation, stuck with the Paycheck Collector, and eventually earned the nickname for himself. And even they needed people. Each of them joined Trader Foundation as a student, because being smart isn't the same as having a system, and being successful isn't the same as having a team. They learned the method, then came back to teach it. Not one of them arrived here already knowing it, which is rather the point: being capable is not the same as having a system, and being successful is not the same as having a team.
              </p>
              <p className="text-[#55534e] text-sm leading-relaxed italic border-l-2 border-[#c7ab77]/40 pl-4">
                "Everyone deserves to understand how money really works. Not just the theory, but the real skills to grow wealth on your own terms. The best moment is when a student stops relying on someone else and starts making confident financial decisions on their own. That's the transformation we're building here."
              </p>
            </div>
        </div>
      </section>

      {/* ─── Our Academy ─── */}
      <section className="py-14 bg-[#faf9f6]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          <h2 className="tf-display text-[#1a1a1a] text-[1.875rem] md:text-[2.5rem] mb-6 text-center mx-auto max-w-[24ch]">
            Built for professionals
          </h2>
          <p className="text-[#3a3834] text-base leading-relaxed mb-4 text-center">
            We teach people with careers and capital how to manage that capital themselves, using one strategy that fits around a full working week. The aim is that a student leaves able to make their own decisions rather than needing ours.
          </p>
          <p className="text-[#3a3834] text-base leading-relaxed mb-4 text-center">
            Our coaches are not hired instructors. Every one of them came through this course as a student first, learned the method, and came back to teach it. They have sat where you are sitting, with the same doubts, which is why they are difficult to impress and easy to talk to.
          </p>
          <p className="text-[#3a3834] text-base leading-relaxed text-center">
            We are deliberately small. Every student gets their own coach and live sessions where the people running them know your name. You are not joining a mailing list.
          </p>
        </div>
      </section>

      {/* ─── Our Philosophy ─── */}
      <section className="py-16 bg-[#141414]">
        <div
          ref={philosophy.ref}
          className={`max-w-[900px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            philosophy.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-10">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              What We Believe
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight mb-4" >
              Building Wealth Doesn't Need to Be Scary
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-2xl mx-auto">
              It can be exciting. It can be fun. And we welcome the process. Each of us brings something different to the table, but at the end of the day we all share the same goal, helping everyone build generational wealth. We genuinely love what we do, and that's what makes this community different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {coaches.map((coach) => (
              <div
                key={coach.name}
                className="px-5 py-5 text-center"
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
          <div className="text-center mb-14">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              Your Coaching Team
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight" >
              Meet the Coaches
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {coaches.map((coach, i) => (
              <div
                key={coach.name}
                className="group bg-white border border-[#e3ded4] overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/40"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <Picture
                    src={coach.photo}
                    alt={coach.photoAlt}
                    width={coach.photoWidth}
                    height={coach.photoHeight}
                    webp={coach.photoIsLocal ? undefined : null}
                    className="w-full aspect-[4/5] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div className="px-6 pb-6 -mt-4 relative">
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-1" >
                    {coach.name}
                  </h3>
                  <p className="text-[#55534e] text-sm font-semibold mb-1">
                    {coach.title}
                  </p>
                  <p className="text-[#767269] text-xs font-medium tracking-wide mb-4">
                    {coach.experience}
                  </p>

                  <div
                    className="rounded px-4 py-3 mb-4"
                    style={{ backgroundColor: 'rgba(199, 171, 119, 0.06)', border: '1px solid rgba(199, 171, 119, 0.12)' }}
                  >
                    <p className="text-[#55534e] text-[0.78rem] leading-relaxed italic">
                      {coach.cardQuote}
                    </p>
                  </div>

                  <div className="w-10 h-[1.5px] bg-[#c7ab77]/40 mb-4" />

                  <p className="text-[#55534e] text-[0.8rem] leading-relaxed">
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
            <h2 className="tf-display text-[#1a1a1a] text-[1.875rem] md:text-[2.5rem]">
              The team
            </h2>
            <div className="w-20 h-[2px] bg-[#1a1a1a] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 max-w-[720px] mx-auto">
            {leadership.map((member, i) => (
              <div
                key={member.name}
                className="group bg-white border border-[#e3ded4] overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/40"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  {member.photo ? (
                    <Picture
                      src={member.photo}
                      alt={member.name}
                      width={960}
                      height={1200}
                      className="w-full aspect-[4/5] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-5xl font-semibold text-[#c7ab77]/60" >
                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="px-6 pb-6 -mt-4 relative">
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-1" >
                    {member.name}
                  </h3>
                  <p className="text-[#55534e] text-sm font-semibold mb-1">
                    {member.title}
                  </p>
                  {'subtitle' in member && member.subtitle && (
                    <p className="text-[#767269] text-xs font-medium tracking-wide mb-3">
                      {member.subtitle}
                    </p>
                  )}
                  {member.bio && (
                    <>
                      <div className="w-10 h-[1.5px] bg-[#c7ab77]/40 mb-4 mt-3" />
                      <p className="text-[#55534e] text-[0.8rem] leading-relaxed">
                        {member.bio}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Live Webinar CTA after leadership team */}
          <div className="text-center mt-14">
            <p
              className="text-[#55534e] text-[0.9rem] leading-relaxed mb-5"

            >
Want to see how it actually works? The live session walks through the method as it is taught. Pay nothing to attend.
            </p>
            <a
              href="https://live.traderfoundation.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#1a1a1a] text-[0.85rem] font-bold tracking-wide transition-all duration-300 hover:bg-[#b89a66]"

            >
              See the method taught live
            </a>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
