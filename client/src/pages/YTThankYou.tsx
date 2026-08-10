/*
 * YouTube Funnel Thank You Page, Trader Foundation
 * Mirrors start.traderfoundation.co/yt-thank-you-page — the confirmation page
 * shown after someone books a strategy call from the YouTube funnel (/trade-yt).
 * Unlisted funnel page: minimal header (no nav, to avoid leaking the funnel),
 * noindex/nofollow, disallowed in robots.txt.
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #c7ab77 (gold)
 */

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Inbox,
  Mail,
  MonitorPlay,
  NotebookPen,
  Youtube,
} from 'lucide-react';
import Footer from '@/components/Footer';

const LOGO_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';
const BOOKING_URL = 'https://start.traderfoundation.co/trade-yt';
const SUPPORT_EMAIL = 'support@traderfoundation.com';
const YOUTUBE_URL = 'https://www.youtube.com/@TheTraderFoundation';
const SKOOL_URL = 'https://www.skool.com/tf-membership/classroom';

const NEXT_STEPS = [
  {
    icon: Inbox,
    step: '01',
    title: 'Check your inbox',
    body: `Your confirmation and the meeting link are on their way from ${SUPPORT_EMAIL}. If you do not see it in a few minutes, check spam or promotions and mark it as safe.`,
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Add it to your calendar',
    body: 'Accept the calendar invite so the time is locked in and you get the reminder. If something changes, use the reschedule link in that email rather than no-showing.',
  },
  {
    icon: MonitorPlay,
    step: '03',
    title: 'Show up ready',
    body: 'Join from a computer somewhere quiet where you can talk openly about your finances. Calls run about 30 to 45 minutes and we go through the numbers together.',
  },
];

const PREP_ITEMS = [
  'Know roughly what you have available to trade with, and what you want it to earn.',
  'Have a number in mind for the monthly income you are working toward.',
  'Be honest about your experience level, beginners are welcome and it changes what we recommend.',
  'Bring your questions about the Paycheck Collector strategy, the coaching, and the time it takes.',
];

const RESOURCES = [
  {
    icon: Youtube,
    title: 'Watch on YouTube',
    body: 'More strategy breakdowns and student interviews on the channel that brought you here.',
    href: YOUTUBE_URL,
    external: true,
  },
  {
    icon: NotebookPen,
    title: 'Join the free Skool community',
    body: 'Free classroom, market discussion, and a place to ask questions between calls.',
    href: SKOOL_URL,
    external: true,
  },
  {
    icon: CheckCircle2,
    title: 'See real student results',
    body: 'Verified reviews and account screenshots from people who started exactly where you are.',
    href: '/results',
    external: false,
  },
  {
    icon: Clock,
    title: 'Run the numbers',
    body: 'Use the compound wealth calculator to see what consistent monthly returns look like over time.',
    href: '/calculator',
    external: false,
  },
];

export default function YTThankYou() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#111]">
      <Helmet>
        <title>You're Booked | Trader Foundation Academy</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Your Trader Foundation strategy call is confirmed. Here is what happens next and how to prepare."
        />
      </Helmet>

      {/* Minimal header, logo only */}
      <header className="pt-10 pb-2 flex justify-center px-6">
        <a href="/" aria-label="Trader Foundation home">
          <img src={LOGO_URL} alt="Trader Foundation" className="h-12 md:h-14 w-auto" />
        </a>
      </header>

      {/* Hero, confirmation */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div
          className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(199,171,119,0.16), transparent 70%)',
          }}
        />

        <div
          className={`relative z-10 max-w-[820px] mx-auto px-6 lg:px-8 text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#c7ab77]/40 bg-[#c7ab77]/10">
            <CheckCircle2 size={30} className="text-[#c7ab77]" />
          </div>

          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Your Spot Is Reserved
          </p>

          <h1
            className="text-[2rem] sm:text-[2.6rem] lg:text-[3.1rem] font-extrabold text-white leading-[1.12]"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Thank You. Your Strategy Call Is{' '}
            <span className="text-[#c7ab77]">Confirmed</span>.
          </h1>

          <p
            className="mt-6 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            You have taken the step most people never take. Watch for the confirmation email with
            your meeting link, then read the three steps below so you get everything possible out of
            the call.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Mail size={16} />
              Email Our Team
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-3.5 border border-white/15 text-white/80 text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:border-[#c7ab77]/50 hover:text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Youtube size={16} className="text-[#c7ab77]" />
              Watch While You Wait
            </a>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-[0.72rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              What Happens Next
            </p>
            <h2
              className="text-[1.6rem] sm:text-[2.1rem] font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Three Things To Do Right Now
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEXT_STEPS.map(({ icon: Icon, step, title, body }) => (
              <div
                key={step}
                className="relative rounded-sm border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[#c7ab77]/40"
              >
                <span
                  className="absolute right-6 top-6 text-[2rem] font-extrabold text-white/5"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {step}
                </span>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm border border-[#c7ab77]/30 bg-[#c7ab77]/10">
                  <Icon size={19} className="text-[#c7ab77]" />
                </div>
                <h3
                  className="text-white text-[1.05rem] font-bold mb-3"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  {title}
                </h3>
                <p
                  className="text-white/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prep checklist */}
      <section className="py-20 sm:py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p
              className="text-[0.72rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Come Prepared
            </p>
            <h2
              className="text-[1.6rem] sm:text-[2.1rem] font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              How To Get The Most Out Of Your Call
            </h2>
            <p
              className="mt-5 text-white/50 text-base leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              This is not a sales pitch. It is a straight conversation about where you are and
              whether our coaching is the right fit. A little prep makes it far more useful.
            </p>
          </div>

          <ul className="space-y-4 max-w-2xl mx-auto">
            {PREP_ITEMS.map((item) => (
              <li key={item} className="flex gap-4">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#c7ab77]" />
                <span
                  className="text-white/70 text-[0.95rem] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* While you wait */}
      <section className="py-20 sm:py-24">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-[0.72rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              While You Wait
            </p>
            <h2
              className="text-[1.6rem] sm:text-[2.1rem] font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Get A Head Start
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RESOURCES.map(({ icon: Icon, title, body, href, external }) => (
              <a
                key={title}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex gap-5 rounded-sm border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-[#c7ab77]/40 hover:bg-white/[0.05]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#c7ab77]/30 bg-[#c7ab77]/10">
                  <Icon size={19} className="text-[#c7ab77]" />
                </div>
                <div>
                  <h3
                    className="flex items-center gap-2 text-white text-[1rem] font-bold mb-2"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {title}
                    <ArrowRight
                      size={14}
                      className="text-[#c7ab77] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </h3>
                  <p
                    className="text-white/50 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {body}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Fallback, in case they landed here without booking */}
      <section className="pb-24">
        <div className="max-w-[820px] mx-auto px-6 lg:px-8">
          <div className="rounded-sm border border-[#c7ab77]/20 bg-[#c7ab77]/[0.04] px-8 py-10 text-center">
            <h2
              className="text-white text-[1.25rem] sm:text-[1.5rem] font-extrabold leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Did not get a confirmation email?
            </h2>
            <p
              className="mt-4 text-white/55 text-[0.95rem] leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              If your booking did not go through, grab a time below. If it did and the email is
              missing, write to us at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[#c7ab77] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{' '}
              and we will sort it out.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-3 px-9 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Book Your Call
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
