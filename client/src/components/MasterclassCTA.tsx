/*
 * Reusable Masterclass CTA Strip
 * Placed between major sections to drive conversions
 * Matches GOAT Academy's aggressive CTA frequency
 */

import { Play } from 'lucide-react';

interface MasterclassCTAProps {
  /** Visual variant */
  variant?: 'dark' | 'light' | 'gold';
  /** Optional headline override */
  headline?: string;
  /** Optional subtext override */
  subtext?: string;
}

export default function MasterclassCTA({
  variant = 'dark',
  headline,
  subtext,
}: MasterclassCTAProps) {
  const isDark = variant === 'dark';
  const isGold = variant === 'gold';
  const isLight = variant === 'light';

  return (
    <section
      className={`relative py-14 sm:py-16 overflow-hidden ${
        isDark
          ? 'bg-[#0e0e0e]'
          : isGold
          ? 'bg-gradient-to-r from-[#c7ab77]/10 via-[#c7ab77]/5 to-[#c7ab77]/10'
          : 'bg-[#f5f3ee]'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />

      <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
        {headline && (
          <h3
            className={`text-[1.4rem] sm:text-[1.75rem] font-extrabold leading-tight mb-3 ${
              isDark ? 'text-white' : 'text-[#1a1a1a]'
            }`}
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            {headline}
          </h3>
        )}

        {subtext && (
          <p
            className={`text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto ${
              isDark ? 'text-white/50' : 'text-[#555]'
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {subtext}
          </p>
        )}

        {!headline && !subtext && <div className="mb-0" />}

        <a
          href="https://start.traderfoundation.co/trade"
          className={`group inline-flex items-center gap-3 px-10 py-4 text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 ${
            isDark || isGold
              ? 'bg-[#c7ab77] text-[#111] hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]'
              : 'bg-[#1a1a1a] text-white hover:bg-[#333] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]'
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Play size={16} className="transition-transform duration-300 group-hover:scale-110" />
          Watch The Masterclass
        </a>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />
    </section>
  );
}
