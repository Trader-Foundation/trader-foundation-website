/*
 * ChapterLayout, Trader Foundation
 *
 * The shared shell for the four long-form course pages (/investing-101,
 * /stocks-and-index, /trading-tools, /options-trading). Before this existed,
 * each page carried its own copy of the same chrome in the pre-restyle visual
 * system: Sen and DM Sans inline, rounded cards, drop shadows, gold on every
 * other element, and a dark banner at the top of every page.
 *
 * It follows DESIGN.md: one ground (#faf9f6), graded rules instead of cards,
 * Inter only, and brand gold once per viewport on the single action. The dark
 * band appears once, on the CTA panel in the right rail.
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const WEBINAR_URL = 'https://live.traderfoundation.com/';
const SIDEBAR_IMG = '/images/vlad-teaching-card.jpg';

export type Chapter = { id: string; label: string };

/* Internal links shown in the right rail, minus whichever page is current.
 * These carried real SEO value in the pre-restyle shell, so they survive. */
const LIBRARY = [
  { label: 'The Paycheck Collector', href: '/paycheck-collector' },
  { label: 'Investing 101', href: '/investing-101' },
  { label: 'Stocks & Index Funds', href: '/stocks-and-index' },
  { label: 'Options Trading', href: '/options-trading' },
  { label: 'Trading Tools', href: '/trading-tools' },
  { label: 'Compound Interest Calculator', href: '/calculator' },
  { label: 'Results', href: '/results' },
];

type Props = {
  /** Page title as it reads in the breadcrumb and the browser tab. */
  title: string;
  /** The h1. Falls back to the title. */
  heading?: string;
  /** One or two plain sentences under the h1. */
  deck: string;
  /** Meta description for this route. */
  description: string;
  /** Route, for canonical and og:url. */
  path: string;
  chapters: Chapter[];
  /** Chapter id to its body component. */
  content: Record<string, React.FC>;
};

export default function ChapterLayout({
  title,
  heading,
  deck,
  description,
  path,
  chapters,
  content,
}: Props) {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  const currentIndex = chapters.findIndex((c) => c.id === activeChapter);
  const ActiveContent = content[activeChapter];
  const activeData = chapters[currentIndex];

  const goTo = (id: string) => {
    setActiveChapter(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const num = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO title={title} description={description} path={path} />
      <Navigation />

      {/* ── Page head ── */}
      <section className="bg-[#faf9f6] pt-[72px]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="pt-10">
            <ol className="flex items-center gap-2 text-[0.875rem] text-[#767269]">
              <li>
                <a
                  href="/"
                  className="underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a] hover:text-[#1a1a1a]"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#3a3834]">
                {title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pt-8 pb-12 sm:pb-14">
            <div className="lg:col-span-7 tf-rise">
              <h1 className="tf-display text-[#1a1a1a] text-[2.25rem] sm:text-[2.875rem] lg:text-[3.5rem] max-w-[18ch]">
                {heading ?? title}
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="pt-6 border-t border-[#e3ded4] text-[#3a3834] text-[1.0625rem] leading-[1.7] max-w-[48ch]">
                {deck}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contents | chapter | action ── */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8 pb-20 border-t-2 border-[#1a1a1a] pt-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Contents, desktop */}
          <nav aria-label="Contents" className="hidden lg:block w-[228px] shrink-0">
            <div className="sticky top-[96px]">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[#767269] pb-3 border-b border-[#e3ded4]">
                Contents
              </h2>
              <ul>
                {chapters.map(({ id, label }, i) => {
                  const on = activeChapter === id;
                  return (
                    <li key={id} className="border-b border-[#ece8e0]">
                      <button
                        type="button"
                        onClick={() => goTo(id)}
                        aria-current={on ? 'true' : undefined}
                        className={`grid grid-cols-[1.75rem_1fr] gap-x-2 text-left w-full py-3 text-[0.875rem] leading-[1.45] transition-colors ${
                          on
                            ? 'text-[#1a1a1a] font-semibold'
                            : 'text-[#55534e] hover:text-[#1a1a1a]'
                        }`}
                      >
                        <span className="tf-nums text-[#767269] font-normal" aria-hidden="true">
                          {num(i)}
                        </span>
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Contents, mobile */}
          <nav aria-label="Contents" className="lg:hidden">
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[#767269] pb-3 border-b border-[#e3ded4]">
              Contents
            </h2>
            <ul>
              {chapters.map(({ id, label }, i) => {
                const on = activeChapter === id;
                return (
                  <li key={id} className="border-b border-[#ece8e0]">
                    <button
                      type="button"
                      onClick={() => goTo(id)}
                      aria-current={on ? 'true' : undefined}
                      className={`grid grid-cols-[1.75rem_1fr] gap-x-2 text-left w-full py-3 text-[0.9375rem] leading-[1.45] ${
                        on ? 'text-[#1a1a1a] font-semibold' : 'text-[#55534e]'
                      }`}
                    >
                      <span className="tf-nums text-[#767269] font-normal" aria-hidden="true">
                        {num(i)}
                      </span>
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Chapter */}
          <article className="flex-1 min-w-0">
            <p className="tf-nums text-[0.875rem] text-[#767269]">
              {num(currentIndex)} of {num(chapters.length - 1)}
            </p>
            <h2 className="tf-display mt-2 text-[#1a1a1a] text-[1.875rem] sm:text-[2.25rem] max-w-[24ch]">
              {activeData.label}
            </h2>

            <div className="mt-8 pt-8 border-t border-[#e3ded4]">
              <ActiveContent />
            </div>

            {/* Prev / next */}
            <div className="flex items-start justify-between gap-6 mt-14 pt-6 border-t-2 border-[#1a1a1a]">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(chapters[currentIndex - 1].id)}
                  className="group flex items-center gap-2 text-left text-[0.9375rem] text-[#55534e] hover:text-[#1a1a1a] max-w-[22ch]"
                >
                  <ArrowLeft size={16} className="shrink-0" aria-hidden="true" />
                  <span className="underline decoration-[#c9c4b8] group-hover:decoration-[#1a1a1a]">
                    {chapters[currentIndex - 1].label}
                  </span>
                </button>
              ) : (
                <div />
              )}
              {currentIndex < chapters.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goTo(chapters[currentIndex + 1].id)}
                  className="group flex items-center gap-2 text-right text-[0.9375rem] font-semibold text-[#1a1a1a] ml-auto max-w-[22ch]"
                >
                  <span className="underline decoration-[#c9c4b8] group-hover:decoration-[#1a1a1a]">
                    {chapters[currentIndex + 1].label}
                  </span>
                  <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
                </button>
              ) : (
                <a
                  href={WEBINAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-right text-[0.9375rem] font-semibold text-[#1a1a1a] ml-auto"
                >
                  <span className="underline decoration-[#c9c4b8] group-hover:decoration-[#1a1a1a]">
                    See the method taught live
                  </span>
                  <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          </article>

          {/* Action */}
          <aside className="lg:w-[272px] shrink-0">
            <div className="lg:sticky lg:top-[96px]">
            <div className="bg-[#141414]">
              <img
                src={SIDEBAR_IMG}
                alt="Vlad Tayman teaching the method at Trader Foundation"
                width={272}
                height={176}
                className="w-full h-44 object-cover object-top"
              />
              <div className="p-6">
                <h2 className="text-[1.25rem] font-semibold text-white leading-[1.3] tracking-[-0.015em]">
                  See the method taught live
                </h2>
                <p className="mt-3 text-white/60 text-[0.9375rem] leading-[1.6]">
                  A live session on how the Paycheck Collector works, and how students fit it
                  around a career. Pay nothing to attend.
                </p>
                <a
                  href={WEBINAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center w-full px-6 py-3.5 bg-[#c7ab77] text-[#1a1a1a] text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
                >
                  Save my seat
                </a>
              </div>
            </div>

            <nav aria-label="More from Trader Foundation" className="mt-8">
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[#767269] pb-3 border-b border-[#e3ded4]">
                Keep reading
              </h2>
              <ul>
                {LIBRARY.filter((l) => l.href !== path).map((l) => (
                  <li key={l.href} className="border-b border-[#ece8e0]">
                    <a
                      href={l.href}
                      className="block py-3 text-[0.9375rem] text-[#55534e] hover:text-[#1a1a1a]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
