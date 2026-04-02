/*
 * Contact Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold)
 */

import { useState } from 'react';
import { Send, Mail, MapPin, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/vTzJCtKf0RZp1Tf6cIIp/webhook-trigger/ee416ece-c9e7-4937-8cda-a392c3db9229';

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          source: 'Trader Foundation Website - Contact Page',
        }),
      });
      setStatus('sent');
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

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

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-[#e8e4dc] rounded-lg p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                {status === 'sent' ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#c7ab77]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send size={24} className="text-[#c7ab77]" />
                    </div>
                    <h3
                      className="text-2xl font-extrabold text-[#111] mb-3"
                      style={{ fontFamily: "'Sen', sans-serif" }}
                    >
                      Message Sent
                    </h3>
                    <p
                      className="text-[#555] text-sm leading-relaxed max-w-sm mx-auto mb-6"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Thank you for reaching out. Our team will get back to you shortly.
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
                  <form onSubmit={handleSubmit} className="space-y-5">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block text-[#333] text-xs font-semibold tracking-wide uppercase mb-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#faf9f6] border border-[#e8e4dc] rounded text-[#111] text-sm focus:outline-none focus:border-[#c7ab77] transition-colors"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-[#333] text-xs font-semibold tracking-wide uppercase mb-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#faf9f6] border border-[#e8e4dc] rounded text-[#111] text-sm focus:outline-none focus:border-[#c7ab77] transition-colors"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[#333] text-xs font-semibold tracking-wide uppercase mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#e8e4dc] rounded text-[#111] text-sm focus:outline-none focus:border-[#c7ab77] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[#333] text-xs font-semibold tracking-wide uppercase mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#e8e4dc] rounded text-[#111] text-sm focus:outline-none focus:border-[#c7ab77] transition-colors"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[#333] text-xs font-semibold tracking-wide uppercase mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#e8e4dc] rounded text-[#111] text-sm focus:outline-none focus:border-[#c7ab77] transition-colors resize-none"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        placeholder="How can we help you?"
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-red-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {status === 'sending' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#111]/30 border-t-[#111] rounded-full animate-spin" />
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
                        href="mailto:support@traderfoundation.com"
                        className="text-[#c7ab77] text-sm hover:underline"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        support@traderfoundation.com
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
                      <MapPin size={18} className="text-[#c7ab77]" />
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
