/*
 * Navigation Component — Trader Foundation
 * Fonts: Sen (bold headings), DM Sans (body/nav links) — matching GOAT Academy style
 */

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Results', href: '#results' },
  { label: 'Blog', href: '#blog' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(199,171,119,0.2)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src={LOGO_URL}
              alt="Trader Foundation"
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span
                className={`text-[0.65rem] font-bold tracking-[0.35em] uppercase transition-colors duration-500 ${
                  scrolled ? 'text-[#1a1a1a]' : 'text-white'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Trader
              </span>
              <span
                className={`text-[1.15rem] font-extrabold tracking-[0.08em] uppercase transition-colors duration-500 ${
                  scrolled ? 'text-[#1a1a1a]' : 'text-white'
                }`}
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                Foundation
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative text-[0.85rem] font-medium transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#c7ab77] after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled
                    ? 'text-[#2c2c2c] hover:text-[#c7ab77]'
                    : 'text-white/90 hover:text-white'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://start.traderfoundation.co/trade"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c7ab77] text-[#111] text-[0.8rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Watch The Masterclass
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-[#1a1a1a]' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/98 backdrop-blur-md border-t border-[#c7ab77]/20 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-[0.85rem] font-medium text-[#2c2c2c] hover:text-[#c7ab77] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#masterclass"
            onClick={() => setMobileOpen(false)}
            className="block text-center px-6 py-3 bg-[#c7ab77] text-[#111] text-[0.8rem] font-bold tracking-wide rounded-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Watch The Masterclass
          </a>
        </div>
      </div>
    </nav>
  );
}
