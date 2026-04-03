/*
 * Navigation Component - Trader Foundation
 * Two-tier header: top utility bar + sub-navigation bar (GOAT Academy style)
 * Fonts: Sen (bold headings), DM Sans (body/nav links)
 */

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOGO_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

/* ── Top utility links (right side) ── */
const utilityLinks = [
  { label: 'About', href: '/about' },
  { label: 'Results', href: '/results' },
];

/* ── Sub-navigation educational categories ── */
const subNavLinks = [
  { label: 'Investing 101', href: '/investing-101' },
  { label: 'Stocks & Index', href: '/stocks-and-index' },
  { label: 'Trading Tools', href: '/trading-tools' },
  { label: 'Options Trading', href: '/options-trading' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Determine current path for active link styling */
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ═══════════ TOP BAR ═══════════ */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-[#111]/98 backdrop-blur-md shadow-[0_1px_0_0_rgba(199,171,119,0.15)]'
            : 'bg-[#111]/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={LOGO_URL}
                alt="Trader Foundation"
                className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[0.6rem] font-bold tracking-[0.35em] uppercase text-white/80"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Trader
                </span>
                <span
                  className="text-[1.1rem] font-extrabold tracking-[0.08em] uppercase text-white"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Foundation
                </span>
              </div>
            </a>

            {/* Desktop: utility links + CTA */}
            <div className="hidden md:flex items-center gap-8">
              {utilityLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-[0.8rem] font-medium transition-colors duration-300 ${
                    currentPath === link.href
                      ? 'text-[#c7ab77]'
                      : 'text-white/75 hover:text-white'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </a>
              ))}

              <a
                href="https://start.traderfoundation.co/trade"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#c7ab77] text-[#111] text-[0.78rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Watch The Masterclass
              </a>


              <a
                href="https://www.skool.com/tfelite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.8rem] font-medium text-white/75 hover:text-white transition-colors duration-300"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Login
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ SUB-NAVIGATION BAR ═══════════ */}
      <div
        className={`hidden md:block transition-all duration-500 border-t border-white/[0.06] ${
          scrolled
            ? 'bg-[#1a1a1a]/98 backdrop-blur-md'
            : 'bg-[#1a1a1a]/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-12 h-[46px]">
            {subNavLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300 ${
                    isActive
                      ? 'text-[#c7ab77]'
                      : 'text-white/65 hover:text-white'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[12px] left-0 right-0 h-[2px] bg-[#c7ab77]" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════ MOBILE MENU ═══════════ */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#111]/98 backdrop-blur-md border-t border-white/10 px-6 py-5 space-y-1">
          {/* Utility links */}
          {utilityLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-[0.85rem] font-medium text-white/80 hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </a>
          ))}

          {/* Expandable sub-nav section */}
          <div className="border-t border-white/10 pt-3 mt-3">
            <button
              onClick={() => setMobileSubOpen(!mobileSubOpen)}
              className="flex items-center justify-between w-full py-2.5 text-[0.85rem] font-semibold text-[#c7ab77] tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span>Learn</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  mobileSubOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileSubOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-4 space-y-1 pb-2">
                {subNavLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2 text-[0.82rem] font-medium transition-colors ${
                      currentPath === link.href
                        ? 'text-[#c7ab77]'
                        : 'text-white/60 hover:text-white'
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Login + CTA */}
          <div className="border-t border-white/10 pt-3 mt-2 space-y-3">
            <a
              href="https://www.skool.com/tfelite"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-[0.85rem] font-medium text-white/80 hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Login
            </a>
            <a
              href="https://start.traderfoundation.co/trade"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-6 py-3 bg-[#c7ab77] text-[#111] text-[0.8rem] font-bold tracking-wide rounded-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Watch The Masterclass
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}
