/*
 * Book a Call Page, Trader Foundation Academy
 * Embeds the SproutCloud organic booking form
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold)
 */

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function BookACall() {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Load SproutCloud form embed script
    const script = document.createElement('script');
    script.src = 'https://link.sproutcloud.co/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111]">
      <Navigation />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-[#111]">
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
            className="text-white/60 text-base leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Book a free strategy call with one of our experienced team members. No pressure, no sales pitch, just a transparent conversation to see if Trader Foundation is the right fit for you.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="pb-20 bg-[#111]">
        <div className="max-w-[700px] mx-auto px-6 lg:px-8">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'rgba(199, 171, 119, 0.04)',
              border: '1px solid rgba(199, 171, 119, 0.15)',
            }}
          >
            <iframe
              src="https://link.sproutcloud.co/widget/form/DloSNqFvQ1ITZJRbgr3H"
              style={{ width: '100%', height: '550px', border: 'none', borderRadius: '3px' }}
              id="inline-DloSNqFvQ1ITZJRbgr3H"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Booking Form ORGANIC VLAD"
              data-height="487"
              data-layout-iframe-id="inline-DloSNqFvQ1ITZJRbgr3H"
              data-form-id="DloSNqFvQ1ITZJRbgr3H"
              title="Booking Form ORGANIC VLAD"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
