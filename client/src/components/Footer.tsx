/*
 * Footer — Trader Foundation
 * Design: Clean, institutional footer with gold accents
 */

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Top gold line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/50 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Trader Foundation" className="h-10 w-10 object-contain" />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[0.6rem] font-semibold tracking-[0.35em] uppercase text-white/70"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  Trader
                </span>
                <span
                  className="text-[1rem] font-medium tracking-[0.15em] text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                >
                  Foundation
                </span>
              </div>
            </div>
            <p
              className="text-white/50 text-sm leading-relaxed max-w-md"
              style={{ fontFamily: "'Libre Franklin', sans-serif", fontWeight: 300 }}
            >
              A premier trading education academy dedicated to building confident,
              independent traders through personalized mentorship and proven strategies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About', 'Programs', 'Results', 'Blog'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300"
                    style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#c7ab77] mb-6"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@trader.foundation"
                  className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  info@trader.foundation
                </a>
              </li>
              <li>
                <a
                  href="https://trader.foundation"
                  className="text-white/50 text-sm hover:text-[#c7ab77] transition-colors duration-300"
                  style={{ fontFamily: "'Libre Franklin', sans-serif" }}
                >
                  trader.foundation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "'Libre Franklin', sans-serif" }}
          >
            &copy; {new Date().getFullYear()} Trader Foundation Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Terms of Service
            </a>
            <a
              href="#disclaimer"
              className="text-white/30 text-xs hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'Libre Franklin', sans-serif" }}
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
