/*
 * Home Page, Trader Foundation Academy (v2)
 * Design: "The Academy", Ivy League Digital Campus
 * Sections flow: Nav → Hero → Stats → Who This Is For → CTA → Meet Erin → Method → Book Call → CTA → Guarantee → Podcast → CTA → Footer
 * CTA frequency modeled after GOAT Academy - after every major section
 */

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import MeetErinSection from '@/components/MeetErinSection';
import MasterclassCTA from '@/components/MasterclassCTA';
import PodcastSection from '@/components/PodcastSection';
import Footer from '@/components/Footer';

import SEO from '@/components/SEO';

import {
  Briefcase,
  Cpu,
  Stethoscope,
  Presentation,
  Building2,
  Shield,
  Calendar,
  TrendingUp,
  Tag,
  ShieldCheck,
} from 'lucide-react';

const audience = [
  { Icon: Briefcase, label: 'Corporate Finance' },
  { Icon: Cpu, label: 'Engineering' },
  { Icon: Stethoscope, label: 'Medicine' },
  { Icon: Presentation, label: 'Consulting' },
  { Icon: Building2, label: 'Business Owners' },
];

const methodFeatures = [
  {
    Icon: Shield,
    title: 'Defined Risk',
    desc: 'You know your maximum loss before the trade is ever placed. No surprises, no margin calls.',
  },
  {
    Icon: Calendar,
    title: 'Monthly Income',
    desc: 'Collect premium on a predictable cycle. Like a paycheck — hence the name.',
  },
  {
    Icon: TrendingUp,
    title: 'Bull or Bear Markets',
    desc: "Premium gets paid regardless of direction. You profit from selling time, not from predicting where the market goes.",
  },
  {
    Icon: Tag,
    title: 'Buy Discounts in Downturns',
    desc: 'When markets drop, the system positions you to acquire quality stocks at discount prices, getting paid premium while you wait for your buy levels.',
  },
];


export default function Home() {
  return (
    <div className="min-h-screen">
      <SEO path="/" />
      <Navigation />
      <HeroSection />
      <StatsSection />

      {/* ─── Who This Is For ─── */}
      <section className="py-20 sm:py-24 bg-[#faf9f6]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Who This Is For
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-5"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              You've Excelled at Your Career.<br className="hidden sm:block" />
              {' '}Now Level Up Your Wealth.
            </h2>
            <p
              className="text-[#444] text-base leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              If you're already winning at what you do but you've quietly realized
              you don't have a Plan B you actually own, you're in the right place.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-[900px] mx-auto">
            {audience.map(({ Icon, label }) => (
              <div
                key={label}
                className="bg-white border border-[#e8e4dc] rounded-lg p-5 text-center transition-colors duration-300 hover:border-[#c7ab77]/40"
              >
                <Icon className="h-7 w-7 text-[#c7ab77] mx-auto mb-3" strokeWidth={1.5} />
                <p
                  className="text-[#111] font-semibold text-sm leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA after Stats, dark variant, no text, just the button */}
      <MasterclassCTA
        variant="dark"
        headline="See How Busy Professionals Are Learning to Trade"
        subtext="Watch our free masterclass and discover a proven swing trading strategy that fits into your schedule."
      />

      <MeetErinSection />

      {/* ─── The Method: Paycheck Collector ─── */}
      <section className="py-20 sm:py-24 bg-[#111]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              What We Teach
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              How to Build <span className="text-[#c7ab77]">Real Wealth</span>
            </h2>
            <p
              className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              We don't teach a trade. We teach a discipline. The core method is the{' '}
              <span className="text-white font-semibold">Paycheck Collector</span>, selling
              options on liquid stocks and indices for a defined-risk premium every month.
              Around it, you'll learn the risk management, position sizing, and long-term
              discipline that turn a single strategy into a real, compounding portfolio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {methodFeatures.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.03] border border-[#c7ab77]/15 rounded-lg p-6 transition-colors duration-300 hover:border-[#c7ab77]/40"
              >
                <Icon className="h-8 w-8 text-[#c7ab77] mb-4" strokeWidth={1.5} />
                <h3
                  className="text-white text-lg font-bold mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {title}
                </h3>
                <p
                  className="text-white/60 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Book a Call CTA after Meet the Team */}
      <section className="py-10 bg-[#f5f3ee]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <p
            className="text-[#555] text-[0.9rem] leading-relaxed mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Interested in learning more? Have a conversation with our team.
          </p>
          <a
            href="https://traderfoundation.fillout.com/t/w1vozRAz1uus?utm_source=Website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 border border-[#c7ab77]/40 text-[#c7ab77] text-[0.82rem] font-semibold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#c7ab77] hover:text-[#111]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a Call
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* CTA after Meet Erin + TrustPilot reviews, light variant to contrast */}
      <MasterclassCTA
        variant="light"
        headline="Ready to Start Your Trading Journey?"
        subtext="Join 1,200+ professionals who chose mentorship over shortcuts."
      />

      {/* ─── 90-Day Guarantee ─── */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-[#faf9f6] to-[#f5f3ee]">
        <div className="max-w-[850px] mx-auto px-6 lg:px-8 text-center">
          <ShieldCheck className="h-12 w-12 text-[#c7ab77] mx-auto mb-5" strokeWidth={1.5} />
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Our Guarantee
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-5"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            You Do the Work.<br className="hidden sm:block" />{' '}
            We Get You There.
          </h2>
          <p
            className="text-[#333] text-base sm:text-lg leading-relaxed mb-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            You follow the system. You show up to the coaching. And if you're not
            profitable, <strong>you don't pay</strong>, and we keep coaching you
            until you are.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 py-3 bg-white border border-[#c7ab77]/30 rounded-full">
            <span
              className="text-[#c7ab77] text-sm font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              90 Days of One-on-One Coaching
            </span>
            <span className="text-[#c7ab77]/50">·</span>
            <span
              className="text-[#c7ab77] text-sm font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Pay When You're Profitable
            </span>
          </div>
        </div>
      </section>

      <PodcastSection />

      {/* Final CTA - Book a Call */}
      <section className="py-16 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Your Next Step
          </p>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Ready to Talk? Book a Strategy Call
          </h2>
          <p
            className="text-white/60 text-base leading-relaxed mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No pressure, no sales pitch. Just a transparent conversation with one of our team members to see if Trader Foundation is the right fit for you.
          </p>
          <a
            href="https://traderfoundation.fillout.com/t/w1vozRAz1uus?utm_source=Website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a Free Strategy Call
          </a>
        </div>
      </section>

      <Footer />

    </div>
  );
}
