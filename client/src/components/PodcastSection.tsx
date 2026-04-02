/*
 * Podcast Section (Compact, No Embed), Trader Foundation
 * Podcast cover + info + platform links + guest appearances
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import { Mic, ExternalLink } from 'lucide-react';

const guestAppearances = [
  { name: 'The Unstoppable Podcast', url: 'https://www.youtube.com/watch?v=dAeLX72hHNE' },
  { name: 'Speaking Podcast', url: 'https://open.spotify.com/episode/5Umj8YBXDbEwOdjlcMFZnB' },
  { name: 'Social 333 Podcast', url: 'https://www.youtube.com/watch?v=iZ8fVeBRJBo' },
  { name: 'Freedom Nation', url: 'https://freedomnationpodcast.com/episode/predictable-paychecks-from-trading-vlad-taimanon-on-building-stress-free-monthly-income-with-options' },
  { name: 'Marathon Money', url: 'https://www.youtube.com/watch?v=Q6YjAlnc_HE' },
  { name: 'Thunder Stock Show', url: 'https://podcasts.apple.com/cm/podcast/unlocking-the-american-dream-vlad-taymans-journey/id1656717958?i=1000748955574' },
];

export default function PodcastSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 sm:py-16 bg-[#111] overflow-hidden"
    >
      <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">

          {/* Left: Podcast Cover */}
          <div
            className={`flex-shrink-0 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-[#1a1a1a] border border-white/10 flex flex-col items-center justify-center shadow-xl">
              <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center mb-3">
                <Mic size={20} className="text-[#c7ab77]" />
              </div>
              <span
                className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77] mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Trader
              </span>
              <span
                className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Foundation
              </span>
              <span
                className="text-[0.5rem] font-bold tracking-[0.15em] uppercase text-white/40 mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Podcast
              </span>
            </div>
          </div>

          {/* Right: Info + Links */}
          <div
            className={`flex-1 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2
              className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              The Trader Foundation Podcast
            </h2>

            <p
              className="text-[#999] text-sm leading-relaxed mb-5 max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Hosted by Vlad Tayman - real market insights, trading education, and the mindset behind consistent results.
            </p>

            {/* Platform Links */}
            <div className="flex flex-wrap gap-2.5 mb-5">
              {/* Apple Podcasts */}
              <a
                href="https://podcasts.apple.com/us/podcast/the-trader-foundation-podcast/id1871309774"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <defs>
                    <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F452FF" />
                      <stop offset="100%" stopColor="#832BC1" />
                    </linearGradient>
                  </defs>
                  <rect width="24" height="24" rx="5.4" fill="url(#ap)" />
                  <path d="M12 5.5a5.25 5.25 0 0 0-1.68 10.22c.1-.55.24-1.12.42-1.66a3.75 3.75 0 1 1 2.52 0c.18.54.32 1.11.42 1.66A5.25 5.25 0 0 0 12 5.5Zm0 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 6.75c-.15.6-.25 1.35-.25 2.25h2c0-.9-.1-1.65-.25-2.25a1 1 0 0 0-.75-.38 1 1 0 0 0-.75.38Z" fill="#fff" />
                </svg>
                <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Apple
                </span>
              </a>

              {/* Spotify */}
              <a
                href="https://open.spotify.com/show/6mSAc3Nuwvg8Jx2DkyeW2A"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <rect width="24" height="24" rx="5.4" fill="#1DB954" />
                  <path d="M16.05 11.1c-2.34-1.39-6.2-1.52-8.43-.84a.66.66 0 1 1-.38-1.27c2.56-.78 6.82-.63 9.51 .97a.66.66 0 0 1-.7 1.14Zm-.12 2.01a.55.55 0 0 1-.76.18c-1.95-1.2-4.93-1.55-7.24-.85a.55.55 0 1 1-.32-1.06c2.63-.8 5.9-.41 8.14.97a.55.55 0 0 1 .18.76Zm-.87 1.93a.44.44 0 0 1-.6.15c-1.7-1.04-3.84-1.27-6.36-.7a.44.44 0 1 1-.2-.86c2.76-.63 5.12-.36 7.02.81a.44.44 0 0 1 .14.6Z" fill="#fff" />
                </svg>
                <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Spotify
                </span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@TheTraderFoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <rect width="24" height="24" rx="5.4" fill="#FF0000" />
                  <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#fff" />
                </svg>
                <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  YouTube
                </span>
              </a>
            </div>

            {/* Guest Appearances - inline */}
            <div>
              <span
                className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] block mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                As heard on:
              </span>
              <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
                {guestAppearances.map((show, i) => (
                  <span key={show.name} className="flex items-center">
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 text-xs hover:text-[#c7ab77] transition-colors inline-flex items-center gap-1"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {show.name}
                      <ExternalLink size={9} className="opacity-40" />
                    </a>
                    {i < guestAppearances.length - 1 && (
                      <span className="text-white/20 mx-1.5">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
