/*
 * ContactSection — Custom contact form (webhook to SproutCloud) + Where to Find Us
 * Design: Dark bg, gold accents, two-column layout
 */

import { useState } from 'react';
import { MapPin, Mail, Youtube, Instagram, Send, CheckCircle, Loader2 } from 'lucide-react';

const WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/vTzJCtKf0RZp1Tf6cIIp/webhook-trigger/ee416ece-c9e7-4937-8cda-a392c3db9229';

export default function ContactSection() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName) return;

    setStatus('sending');
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source: 'Trader Foundation Website - Contact Form',
        }),
      });
      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputBase =
    'w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#c7ab77]/50 focus:ring-1 focus:ring-[#c7ab77]/30 transition-colors';

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
          {/* Left — Custom Contact Form */}
          <div>
            <h3
              className="text-lg font-extrabold text-white mb-4"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Send Us a Message
            </h3>
            <div className="w-10 h-[2px] bg-[#c7ab77] mb-6" />

            {status === 'success' ? (
              <div className="bg-[#151515] border border-[#c7ab77]/20 rounded-xl p-8 text-center">
                <CheckCircle size={40} className="text-[#c7ab77] mx-auto mb-4" />
                <p
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Message Sent!
                </p>
                <p
                  className="text-white/40 text-sm mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-[#c7ab77] text-sm font-semibold hover:underline"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className={inputBase}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={inputBase}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className={inputBase}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className={inputBase}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wide uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={4}
                    className={`${inputBase} resize-none`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#c7ab77] text-[#111] text-sm font-bold tracking-wide rounded-lg hover:bg-[#b89a66] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
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
                    href="mailto:support@traderfoundation.com"
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    support@traderfoundation.com
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
                  href="https://www.skool.com/tf-membership/classroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#c7ab77] text-[#111] text-xs font-bold tracking-wide rounded-sm hover:bg-[#b89a66] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Join Free Skool Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
