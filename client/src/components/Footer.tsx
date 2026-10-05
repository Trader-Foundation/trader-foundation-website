/*
 * Footer, Trader Foundation
 * The page's closing dark band. Plain headings, no accent colour, the
 * disclaimer kept verbatim and legible.
 */

import { Link } from 'wouter';

const LOGO_URL = '/images/logo.png';

const exploreLinks = [
  { label: 'About', href: '/about' },
  { label: 'Results', href: '/results' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Use', href: '/terms-of-use' },
  { label: 'Earnings Disclaimer', href: '/earnings-disclaimer' },
  { label: 'Trading Disclaimer', href: '/trading-disclaimer' },
];

const socials = [
  {
    label: 'Trader Foundation on YouTube',
    href: 'https://www.youtube.com/@TheTraderFoundation',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Trader Foundation on Instagram',
    href: 'https://www.instagram.com/tftradingacademy/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
  {
    label: 'Trader Foundation on Facebook',
    href: 'https://www.facebook.com/TraderFoundationLLC',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Trader Foundation community on Skool',
    href: 'https://www.skool.com/tf-membership/classroom',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  },
];

const headingClass = 'text-[0.9375rem] font-semibold text-white mb-5';
const linkClass = 'text-white/65 text-[0.9375rem] hover:text-white transition-colors duration-200';

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/">
              <span className="flex items-center gap-3 mb-5 cursor-pointer">
                <img src={LOGO_URL} alt="" aria-hidden="true" className="h-10 w-auto object-contain" />
                <span className="text-[1.05rem] tracking-[-0.02em] text-white leading-none">
                  <span className="font-medium">Trader</span>
                  <span className="font-extrabold">Foundation</span>
                </span>
              </span>
            </Link>
            <p className="text-white/65 text-[0.9375rem] leading-[1.65] max-w-[36ch]">
              A trading education academy dedicated to building confident, independent traders
              through personalized mentorship.
            </p>
          </div>

          <div>
            <h2 className={headingClass}>Explore</h2>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className={`${linkClass} cursor-pointer`}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Resources</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.skool.com/tf-membership/classroom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Free Skool Community
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@TheTraderFoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <a href="/calculator" className={linkClass}>
                  Compound Wealth Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Contact</h2>
            <a href="mailto:support@traderfoundation.com" className={`${linkClass} block mb-8`}>
              support@traderfoundation.com
            </a>

            <h2 className={headingClass}>Follow</h2>
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/65 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-[#2c2c2c]">
          <p className="text-white/65 text-[0.8125rem] leading-[1.7] max-w-[90ch]">
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

        <div className="mt-8 pt-6 border-t border-[#2c2c2c] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-white/65 text-[0.8125rem]">
            &copy; {new Date().getFullYear()} Trader Foundation Academy. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span className="text-white/65 text-[0.8125rem] hover:text-white transition-colors duration-200 cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
