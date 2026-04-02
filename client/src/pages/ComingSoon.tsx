/*
 * Coming Soon Placeholder Page - Trader Foundation
 * Reusable for sub-nav pages not yet built
 */

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  subtitle: string;
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-[130px] pb-4 bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div
            className="flex items-center gap-2 text-[0.78rem] text-white/50"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <a href="/" className="hover:text-[#c7ab77] transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-[#c7ab77]">{title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#111] pb-20 pt-8">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#c7ab77]/10 flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-[#c7ab77]" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            {title}
          </h1>
          <p
            className="text-white/50 text-lg max-w-xl mx-auto mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://start.traderfoundation.co/trade"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#c7ab77] text-[#111] font-bold text-[0.88rem] tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Watch The Masterclass
              <ArrowRight size={16} />
            </a>
            <a
              href="/investing-101"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white font-medium text-[0.88rem] tracking-wide rounded-sm transition-all duration-300 hover:border-[#c7ab77] hover:text-[#c7ab77]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Start with Investing 101
            </a>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p
            className="text-[#888] text-[0.95rem] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            This section is currently being developed. In the meantime, explore
            our{' '}
            <a href="/investing-101" className="text-[#c7ab77] font-semibold hover:underline">
              Investing 101
            </a>{' '}
            guide or check out our{' '}
            <a href="/results" className="text-[#c7ab77] font-semibold hover:underline">
              student results
            </a>{' '}
            to see what's possible.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
