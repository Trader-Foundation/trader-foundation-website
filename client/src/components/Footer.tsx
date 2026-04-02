/*
 * Footer, Trader Foundation
 * Fonts: Sen (headings), DM Sans (body)
 */

import { Link } from 'wouter';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/50 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-3 mb-6 cursor-pointer">
                <img src={LOGO_URL} alt="Trader Foundation" className="h-10 w-10 object-contain" />
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-[0.6rem] font-bold tracking-[0.35em] uppercase text-white/70"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Trader
                  </span>
                  <span
                    className="text-[1.05rem] font-extrabold tracking-[0.08em] uppercase text-white"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Foundation
                  </span>
                </div>
              </div>
            </Link>
            <p
              className="text-white/50 text-sm leading-relaxed max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              A trading education academy dedicated to building confident,
              independent traders through personalized mentorship.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Results', href: '/results' },
                { label: 'Contact', href: '/contact' },
                { label: 'Calculator', href: '/calculator' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span
                      className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.skool.com/tf-membership/classroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Free Skool Community
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@TheTraderFoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  YouTube Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Follow */}
          <div>
            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact Us
            </h4>
            <a
              href="mailto:support@traderfoundation.net"
              className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors block mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              support@traderfoundation.net
            </a>

            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Follow Us
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@TheTraderFoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-[#c7ab77] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://www.instagram.com/vladswingtrader/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-[#c7ab77] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a
                href="https://www.skool.com/tf-membership/classroom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-[#c7ab77] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p
            className="text-white/20 text-[10px] leading-relaxed max-w-5xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            This website and content are for informational purposes only. Trader Foundation LLC and
            any subsidiaries (herein also referred to as Trader Foundation) are NOT registered as a
            securities broker-dealer nor an investment advisor. No sponsorship of any company,
            security, or trading platform/investment, nor accounting, legal, or tax advice, or
            guarantee the adequacy, suitability, or completeness of any information. Always seek the
            advice of a qualified securities professional before making any investment, and
            investments and your understanding and ability to bear risk. Trader Foundation is not
            liable for any damages. This site is not a part of the FACEBOOK™ website or FACEBOOK™
            Inc.
          </p>
        </div>

        {/* Bottom Bar — copyright + tiny legal links */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-white/20 text-[10px]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            &copy; {new Date().getFullYear()} Trader Foundation Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-white/15 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Link href="/privacy-policy">
              <span className="hover:text-white/30 transition-colors cursor-pointer">Privacy Policy</span>
            </Link>
            <span>&middot;</span>
            <Link href="/terms-of-use">
              <span className="hover:text-white/30 transition-colors cursor-pointer">Terms of Use</span>
            </Link>
            <span>&middot;</span>
            <Link href="/earnings-disclaimer">
              <span className="hover:text-white/30 transition-colors cursor-pointer">Earnings Disclaimer</span>
            </Link>
            <span>&middot;</span>
            <Link href="/trading-disclaimer">
              <span className="hover:text-white/30 transition-colors cursor-pointer">Trading Disclaimer</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
