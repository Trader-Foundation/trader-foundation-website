/*
 * Book a Call Page, Trader Foundation Academy
 * Redirects to the Fillout booking form
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold)
 */

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const FILLOUT_URL = 'https://traderfoundation.fillout.com/t/w1vozRAz1uus?utm_source=Website';

export default function BookACall() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#111]">
      <SEO title="Book a Strategy Call" description="Book a free strategy call with the Trader Foundation Academy team." path="/book-a-call" />
      <Navigation />

      {/* Hero */}
      <section className="pt-36 pb-20 bg-[#111]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Schedule Your Strategy Call
          </p>
          <h1
            className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Let's Talk About Your Trading Goals
          </h1>
          <p
            className="text-white/60 text-base leading-relaxed max-w-xl mx-auto mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a free strategy call with one of our experienced team members. No pressure, no sales pitch, just a transparent conversation to see if Trader Foundation is the right fit for you.
          </p>
          <a
            href={FILLOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.9rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
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
