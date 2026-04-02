/*
 * Contact Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Uses SproutCloud form embed for reliable contact capture
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold)
 */

import { useEffect } from 'react';
import { Mail, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Contact() {
  useEffect(() => {
    // Load SproutCloud form embed script
    const existing = document.querySelector('script[src="https://link.sproutcloud.co/js/form_embed.js"]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://link.sproutcloud.co/js/form_embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-16 bg-[#111] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(199,171,119,0.08),transparent_70%)]" />
        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get In Touch
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Contact <span className="text-[#c7ab77]">Us</span>
          </h1>
          <p
            className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Have a question about our programs or want to learn more? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ─── Contact Form + Info ─── */}
      <section className="py-20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* SproutCloud Form Embed */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-[#e8e4dc] rounded-lg p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <h3
                  className="text-xl font-extrabold text-[#111] mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Send Us a Message
                </h3>
                <p
                  className="text-[#777] text-sm mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <iframe
                  src="https://link.sproutcloud.co/widget/form/zNekBbMTW3PeN6o7IEY0"
                  style={{ width: '100%', height: '400px', border: 'none', borderRadius: '3px' }}
                  id="contact-inline-zNekBbMTW3PeN6o7IEY0"
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="erin new website form ebook signup"
                  data-height="400"
                  data-layout-iframe-id="contact-inline-zNekBbMTW3PeN6o7IEY0"
                  data-form-id="zNekBbMTW3PeN6o7IEY0"
                  title="Contact Form"
                />
              </div>
            </div>

            {/* Info Side */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3
                  className="text-lg font-extrabold text-[#111] mb-6"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Other Ways to Reach Us
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-[#c7ab77]/10 rounded flex items-center justify-center">
                      <Mail size={18} className="text-[#c7ab77]" />
                    </div>
                    <div>
                      <p
                        className="text-[#111] text-sm font-semibold mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Email
                      </p>
                      <a
                        href="mailto:support@traderfoundation.net"
                        className="text-[#c7ab77] text-sm hover:underline"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        support@traderfoundation.net
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-[#c7ab77]/10 rounded flex items-center justify-center">
                      <Clock size={18} className="text-[#c7ab77]" />
                    </div>
                    <div>
                      <p
                        className="text-[#111] text-sm font-semibold mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Response Time
                      </p>
                      <p
                        className="text-[#777] text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-[#c7ab77]/10 rounded flex items-center justify-center">
                      <svg className="w-[18px] h-[18px] text-[#c7ab77]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                    <div>
                      <p
                        className="text-[#111] text-sm font-semibold mb-1"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Community
                      </p>
                      <a
                        href="https://www.skool.com/tf-membership/classroom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#c7ab77] text-sm hover:underline"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Join our free Skool community
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-[#e8e4dc]">
                <p
                  className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#999] mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Follow Us
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.youtube.com/@TheTraderFoundation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#111] rounded hover:bg-[#c7ab77] transition-colors duration-300 group"
                  >
                    <svg className="w-4 h-4 text-white group-hover:text-[#111] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a
                    href="https://www.instagram.com/vladswingtrader/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-[#111] rounded hover:bg-[#c7ab77] transition-colors duration-300 group"
                  >
                    <svg className="w-4 h-4 text-white group-hover:text-[#111] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
