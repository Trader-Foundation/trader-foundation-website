/*
 * Footer — Trader Foundation
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
              {['About', 'Programs', 'Results', 'Blog'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
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
            The content in this website is for informational and educational purposes only. It does
            not constitute and should not be construed as financial or investment advice or an offer
            to purchase or sell securities. The content is not personalized or tailored to a specific
            person or group of persons, nor to their personal investment or financial needs. You
            should consult a financial adviser or other investment professional authorized to provide
            investment advice. Investing comes with risks, including the risk of loss. Presentations
            of trades made by Trader Foundation or its personnel are not a guarantee that any
            investment decision made by a student will be successful. Past performance is not a
            guarantee of future performance.
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
