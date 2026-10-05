/*
 * Navigation, Trader Foundation
 * One row on an off-white ground: wordmark left, links and the single gold
 * action right. The four course pages sit behind one "Learn" disclosure so the
 * header stays a single line at every width.
 */

import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const LOGO_URL = '/images/logo.png';
const WEBINAR_URL = 'https://live.traderfoundation.com/';
const LOGIN_URL = 'https://www.skool.com/tfelite';

const utilityLinks = [
  { label: 'About', href: '/about' },
  { label: 'Results', href: '/results' },
  { label: 'FAQ', href: '/faq' },
];

const learnLinks = [
  { label: 'Investing 101', href: '/investing-101' },
  { label: 'Stocks & Index', href: '/stocks-and-index' },
  { label: 'Trading Tools', href: '/trading-tools' },
  { label: 'Options Trading', href: '/options-trading' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const learnRef = useRef<HTMLDivElement>(null);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const learnActive = learnLinks.some((l) => l.href === currentPath);

  /* Close the disclosure on outside click or Escape */
  useEffect(() => {
    if (!learnOpen) return;
    const onClick = (e: MouseEvent) => {
      if (learnRef.current && !learnRef.current.contains(e.target as Node)) setLearnOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLearnOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [learnOpen]);

  const linkClass = (active: boolean) =>
    `text-[0.875rem] transition-colors duration-200 ${
      active ? 'text-[#1a1a1a] font-semibold' : 'text-[#55534e] hover:text-[#1a1a1a]'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6] border-b border-[#e3ded4]">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Wordmark */}
          <a href="/" className="flex items-center gap-3 shrink-0">
            <img src={LOGO_URL} alt="" aria-hidden="true" className="h-9 w-auto object-contain" />
            <span className="text-[1.05rem] tracking-[-0.02em] text-[#1a1a1a] leading-none">
              <span className="font-medium">Trader</span>
              <span className="font-extrabold">Foundation</span>
            </span>
            <span className="sr-only">Trader Foundation, home</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main">
            <div className="relative" ref={learnRef}>
              <button
                type="button"
                onClick={() => setLearnOpen((v) => !v)}
                aria-expanded={learnOpen}
                aria-controls="learn-menu"
                className={`${linkClass(learnActive)} inline-flex items-center gap-1.5`}
              >
                Learn
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${learnOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {learnOpen && (
                <div
                  id="learn-menu"
                  className="absolute left-0 top-[calc(100%+1.25rem)] min-w-[13rem] bg-[#faf9f6] border border-[#e3ded4] py-2"
                >
                  {learnLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-[0.875rem] ${
                        currentPath === link.href
                          ? 'text-[#1a1a1a] font-semibold'
                          : 'text-[#55534e] hover:text-[#1a1a1a]'
                      }`}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {utilityLinks.map((link) => (
              <a key={link.href} href={link.href} className={linkClass(currentPath === link.href)}>
                {link.label}
              </a>
            ))}

            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass(false)}
            >
              Login
            </a>

            <a
              href={WEBINAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-[#c7ab77] text-[#1a1a1a] text-[0.8125rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
            >
              Live Webinar
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 text-[#1a1a1a]"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="md:hidden bg-[#faf9f6] border-t border-[#e3ded4] px-6 py-4"
        >
          <button
            type="button"
            onClick={() => setMobileLearnOpen((v) => !v)}
            aria-expanded={mobileLearnOpen}
            className="flex items-center justify-between w-full py-2.5 text-[0.9375rem] font-semibold text-[#1a1a1a]"
          >
            Learn
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-200 ${mobileLearnOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {mobileLearnOpen && (
            <div className="pl-4 pb-1">
              {learnLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-[0.875rem] text-[#55534e]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {utilityLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-[0.9375rem] text-[#1a1a1a]"
            >
              {link.label}
            </a>
          ))}

          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="block py-2.5 text-[0.9375rem] text-[#1a1a1a]"
          >
            Login
          </a>

          <a
            href={WEBINAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center px-6 py-3 bg-[#c7ab77] text-[#1a1a1a] text-[0.875rem] font-semibold"
          >
            Live Webinar
          </a>
        </nav>
      )}
    </header>
  );
}
