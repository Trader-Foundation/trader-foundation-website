/*
 * ContactSection — Contact form (SproutCloud embed) + Where to Find Us
 * Design: Dark bg, gold accents, two-column layout
 */

import { useEffect, useRef } from 'react';
import { MapPin, Mail, Youtube, Instagram } from 'lucide-react';

const SPROUTCLOUD_FORM_URL =
  'https://link.sproutcloud.co/widget/form/zNekBbMTW3PeN6o7IEY0';
const SPROUTCLOUD_SCRIPT_URL =
  'https://link.sproutcloud.co/js/form_embed.js';

export default function ContactSection() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    const existing = document.querySelector(
      `script[src="${SPROUTCLOUD_SCRIPT_URL}"]`
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src = SPROUTCLOUD_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
    scriptLoaded.current = true;
  }, []);

  return (
    <section className="py-20 bg-[#0e0e0e]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p
            className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Get In Touch
          </p>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-white leading-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Have a Question? <span className="text-[#c7ab77]">Reach Out.</span>
          </h2>
          <p
            className="text-white/40 text-sm mt-3 max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Whether you're curious about our programs, need help getting started,
            or just want to say hello — we'd love to hear from you.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left — Contact Form (SproutCloud embed) */}
          <div>
            <h3
              className="text-lg font-extrabold text-white mb-4"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Send Us a Message
            </h3>
            <div className="w-10 h-[2px] bg-[#c7ab77] mb-6" />

            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 sm:p-6">
              <iframe
                src={SPROUTCLOUD_FORM_URL}
                style={{
                  width: '100%',
                  height: '380px',
                  border: 'none',
                  borderRadius: '6px',
                }}
                id="contact-form-inline"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="erin new website form ebook signup"
                data-height="380"
                data-layout-iframe-id="contact-form-inline"
                data-form-id="zNekBbMTW3PeN6o7IEY0"
                title="Contact Form"
              />
            </div>
          </div>

          {/* Right — Where to Find Us */}
          <div>
            <h3
              className="text-lg font-extrabold text-white mb-4"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Where to Find Us
            </h3>
            <div className="w-10 h-[2px] bg-[#c7ab77] mb-6" />

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c7ab77]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-[#c7ab77]" />
                </div>
                <div>
                  <p
                    className="text-white font-semibold text-sm mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:support@traderfoundation.co"
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    support@traderfoundation.co
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c7ab77]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#c7ab77]" />
                </div>
                <div>
                  <p
                    className="text-white font-semibold text-sm mb-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Based In
                  </p>
                  <p
                    className="text-white/50 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    United States — Serving Students Worldwide
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-white/10 my-2" />

              {/* Social heading */}
              <p
                className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Follow Us
              </p>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@TheTraderFoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#c7ab77]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c7ab77]/20 transition-colors">
                  <Youtube size={18} className="text-[#c7ab77]" />
                </div>
                <div>
                  <p
                    className="text-white font-semibold text-sm mb-0.5 group-hover:text-[#c7ab77] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    YouTube
                  </p>
                  <p
                    className="text-white/40 text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    @TheTraderFoundation — Free education, market breakdowns & more
                  </p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/vladswingtrader/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#c7ab77]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c7ab77]/20 transition-colors">
                  <Instagram size={18} className="text-[#c7ab77]" />
                </div>
                <div>
                  <p
                    className="text-white font-semibold text-sm mb-0.5 group-hover:text-[#c7ab77] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Instagram
                  </p>
                  <p
                    className="text-white/40 text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    @vladswingtrader — Behind the scenes & daily insights
                  </p>
                </div>
              </a>

              {/* Skool community */}
              <div className="mt-6 bg-[#151515] border border-[#c7ab77]/20 rounded-xl p-5">
                <p
                  className="text-white font-bold text-sm mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Join Our Community
                </p>
                <p
                  className="text-white/40 text-xs mb-3 leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Connect with hundreds of traders in our Skool community — ask
                  questions, share wins, and learn together.
                </p>
                <a
                  href="https://www.skool.com/tfelite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#c7ab77] text-[#111] text-xs font-bold tracking-wide rounded-sm hover:bg-[#b89a66] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Visit Skool Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
