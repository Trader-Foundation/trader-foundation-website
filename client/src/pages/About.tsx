/*
 * About Page, Trader Foundation Academy
 * Sections: Vlad Story → Our Academy → Our Philosophy → Meet the Coaches → Meet the Team → Footer
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

import { Quote } from 'lucide-react';

/* ── Photo URLs ── */
const VLAD_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad_processed_v2_9073b39a.jpg';
const ELLIOT_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/elliot-clean_38e2878f.png';
const ERIN_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/erin_93b42a5c.jpg';
const LEO_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/leo_professional_b52839af.png';
const JHALIL_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/jhalil-new_9cefdb48.png';
const STEVE_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/steve-lapa-new_ac25bb0c.png';
const ARIANA_PHOTO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/ariana-white-bg_56fc0ce2.png';

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
  {
    name: 'Jhalil Timazee',
    title: 'Enrollment Specialist',
    subtitle: '20+ Years of Leadership Experience',
    photo: JHALIL_PHOTO,
    bio: 'Two decades of leadership experience across multiple industries taught Jhalil one thing: people come first. He brings that same philosophy to Trader Foundation, taking the time to understand where each person is in their financial journey and helping them take the next step with confidence. His track record of driving record-breaking results comes from one simple approach, genuinely caring about the people he works with.',
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
    title: 'Senior Coach · Head of YouTube Education',
    experience: '11+ Years of Experience',
    photo: ERIN_PHOTO,
    philosophy: '"Trading is like dating, choose the best and leave the rest."',
    cardQuote: '"Patience isn\'t boring, it\'s profitable. I only need a few great setups a month."',
    bio: 'After years in corporate finance at GE, I made the leap to full-time trading and coaching. My approach is different from most. I only trade off Weekly and Monthly charts. No noise. No chasing. Just patience and precision. What drives me isn\'t just the trades, it\'s the people behind them. I genuinely love helping others build real, lasting wealth through disciplined swing trading. Every free video I create, every question I answer, comes from the same place: I remember what it felt like to figure this out alone, and I don\'t want anyone else to go through that.',
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

/* ── Page ── */
export default function About() {
  const story = useFadeIn();
  const philosophy = useFadeIn();
  const team = useFadeIn();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO title="About Us" description="Meet the Trader Foundation Academy team — Vlad Tayman, Steve Lapa, Ariana Tayman, and Jhalil Timazee. Learn about our mission to help traders succeed." path="/about" />
      <Navigation />

      {/* ─── Vlad's Story ─── */}
      <section className="pt-32 pb-20 bg-[#faf9f6]">
        <div
          ref={story.ref}
          className={`max-w-[1100px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            story.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-center">
            {/* Vlad's photo */}
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

            {/* Story text */}
            <div className="lg:col-span-3">
              <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
                The Founder
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight mb-6" style={{ fontFamily: "'Sen', sans-serif" }}>
                From $150K in Losses to Building a Trading Academy
              </h2>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                Vlad came to America from Ukraine with nothing but a work ethic. He built his career the hard way, spending 20 years as a Director of Training at a Fortune 500 company. He had the six-figure salary and the corner office, but he was burned out, missing his family, and dying inside. Then came the wake-up call: he lost $29,000 in 29 days trading penny stocks.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                That failure became fuel. Vlad tried every method until he found what actually works. And here's what makes him different from every other trading educator: <strong>two decades teaching Fortune 500 executives</strong>. Great traders don't always make great teachers. Vlad mastered both, and gives away more free education than most programs charge for because he believes everyone deserves access to real financial knowledge.
              </p>
              <p className="text-[#444] text-base leading-relaxed mb-4">
                That mission runs deeper than one person. The coaches on this team aren't people who came here because they had no other options. They're <strong>smart, successful professionals</strong>. <strong>Elliot</strong> spent a decade in the options markets. <strong>Erin</strong> built her career in corporate finance at GE, reading P&amp;Ls and analyzing risk for a living. <strong>Leo</strong> tried every trading method out there and lost a lot of money before he figured out why nothing worked. He found Trader Foundation, stuck with the Paycheck Collector, and eventually earned the nickname for himself. And even they needed people. Each of them joined Trader Foundation as a student, because being smart isn't the same as having a system, and being successful isn't the same as having a team. They mastered the system, then came back to teach it. Every coach on this team is living proof that what we teach works, and that even the sharpest people don't have to do it alone.
              </p>
              <p className="text-[#555] text-sm leading-relaxed italic border-l-2 border-[#c7ab77]/40 pl-4">
                "Everyone deserves to understand how money really works. Not just the theory, but the real skills to grow wealth on your own terms. The best moment is when a student stops relying on someone else and starts making confident financial decisions on their own. That's the transformation we're building here."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Academy ─── */}
      <section className="py-14 bg-[#faf9f6]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3 text-center">Our Academy</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a1a] leading-tight mb-6 text-center" style={{ fontFamily: "'Sen', sans-serif" }}>
            A Boutique Trading Academy Built for Professionals
          </h2>
          <p className="text-[#444] text-base leading-relaxed mb-4 text-center">
            We teach busy professionals how to trade stocks and options with confidence, using proven strategies that fit around a full-time career. Our mission is to make real financial education accessible to everyone, and to build a community where students don't just learn to trade, they learn to build lasting wealth.
          </p>
          <p className="text-[#444] text-base leading-relaxed mb-4 text-center">
            Our coaches aren't hired instructors. They're former students who took the same course you're about to take, mastered the strategies, and came back to help others do the same. They are proof that it works. They've been exactly where you are. They know the challenges, the doubts, and the breakthroughs because they lived them.
          </p>
          <p className="text-[#444] text-base leading-relaxed text-center">
            We're a boutique academy by design. Every student gets 1:1 coaching, plus small live sessions where mentors know your name. Direct access to coaches who genuinely care. When you join Trader Foundation, you're not joining a program. You're joining a family.
          </p>
        </div>
      </section>

      {/* ─── Our Philosophy ─── */}
      <section className="py-16 bg-[#111]">
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'Sen', sans-serif" }}>
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
          <div className="text-center mb-14">
            <p className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3">
              Your Coaching Team
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight" style={{ fontFamily: "'Sen', sans-serif" }}>
              Meet the Coaches
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {coaches.map((coach, i) => (
              <div
                key={coach.name}
                className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden transition-all duration-500 hover:border-[#c7ab77]/40 hover:shadow-[0_8px_40px_rgba(199,171,119,0.1)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(1.35) contrast(1.05)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
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

          {/* Book a Call CTA after leadership team */}
          <div className="text-center mt-14">
            <p
              className="text-[#555] text-[0.9rem] leading-relaxed mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Interested in learning more? Have a conversation with our team.
            </p>
            <a
              href="https://start.traderfoundation.co/trade-yt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
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
