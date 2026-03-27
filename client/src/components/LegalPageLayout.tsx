/*
 * LegalPageLayout — Shared layout for all legal/policy pages
 * Fonts: Sen (headings), DM Sans (body)
 * Colors: Black + Gold (#c7ab77) on warm ivory
 */

import { Link } from 'wouter';

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

interface LegalPageLayoutProps {
  title: string;
  breadcrumb: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, breadcrumb, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Navigation */}
      <nav className="bg-[#111] border-b border-[#c7ab77]/20">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={LOGO_URL} alt="Trader Foundation" className="h-9 w-9 object-contain" />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-[0.55rem] font-bold tracking-[0.35em] uppercase text-white/70"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Trader
                </span>
                <span
                  className="text-[0.95rem] font-extrabold tracking-[0.08em] uppercase text-white"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Foundation
                </span>
              </div>
            </div>
          </Link>
          <Link href="/">
            <span
              className="text-white/60 text-sm hover:text-[#c7ab77] transition-colors cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              &larr; Back to Home
            </span>
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-[900px] mx-auto px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Link href="/">
            <span className="text-[#c7ab77] hover:text-[#b89a66] transition-colors cursor-pointer">Home</span>
          </Link>
          <span className="text-[#999]">&rsaquo;</span>
          <span className="text-[#666]">{breadcrumb}</span>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-[900px] mx-auto px-6 lg:px-8 pt-6 pb-2">
        <div className="relative inline-block">
          <h1
            className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#111] leading-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            {title}
          </h1>
          <div className="absolute -bottom-2 left-0 w-16 h-[3px] bg-[#c7ab77]" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none text-[#444] leading-relaxed
            prose-headings:text-[#111] prose-headings:font-extrabold
            prose-h2:text-[1.5rem] prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-[1.15rem] prose-h3:mt-8 prose-h3:mb-3
            prose-p:mb-4 prose-p:text-[0.95rem]
            prose-li:text-[0.95rem] prose-li:text-[#555]
            prose-strong:text-[#222]
            prose-a:text-[#c7ab77] prose-a:no-underline hover:prose-a:text-[#b89a66]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111] text-white">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/50 to-transparent" />
        <div className="max-w-[900px] mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
    </div>
  );
}
