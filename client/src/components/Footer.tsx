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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
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

          {/* Quick Links */}
          <div>
            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Results', href: '/results' },

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
              <li>
                <Link href="/calculator">
                  <span
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Compound Interest Calculator
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy">
                  <span
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use">
                  <span
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Terms of Use
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/earnings-disclaimer">
                  <span
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Earnings Disclaimer
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/trading-disclaimer">
                  <span
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300 cursor-pointer"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Trading Disclaimer
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p
            className="text-white/30 text-xs leading-relaxed max-w-5xl"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            This website and content are for informational purposes only. Trader Foundation LLC and
            any subsidiaries (herein also referred to as Trader Foundation) are NOT registered as a
            securities broker-dealer nor an investment advisor. No sponsorship of any company,
            security, or trading platform/investment, nor accounting, legal, or tax advice, or
            guarantee the adequacy, suitability, or completeness of any information. Always seek the
            advice of a qualified securities professional before making any investment, and
            investments and your understanding and ability to bear risk. Trader Foundation is not
            liable for any damages. This site is not a part of the Facebook™ website or Facebook Inc.
            Additionally, this site is NOT endorsed by Facebook™ in any way. FACEBOOK™ is a trademark
            of FACEBOOK™, Inc.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            &copy; {new Date().getFullYear()} Trader Foundation Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy">
              <span className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Privacy Policy
              </span>
            </Link>
            <Link href="/terms-of-use">
              <span className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Terms of Use
              </span>
            </Link>
            <Link href="/earnings-disclaimer">
              <span className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Earnings Disclaimer
              </span>
            </Link>
            <Link href="/trading-disclaimer">
              <span className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Trading Disclaimer
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
