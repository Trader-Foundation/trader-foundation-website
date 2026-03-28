/*
 * Podcast Section, Trader Foundation
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';

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

  const platforms = [
    {
      name: 'Apple Podcasts',
      url: 'https://podcasts.apple.com/us/podcast/the-trader-foundation-podcast/id1871309774',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <defs>
            <linearGradient id="apple-pod" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F452FF" />
              <stop offset="100%" stopColor="#832BC1" />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="5.4" fill="url(#apple-pod)" />
          <path
            d="M12 5.5a5.25 5.25 0 0 0-1.68 10.22c.1-.55.24-1.12.42-1.66a3.75 3.75 0 1 1 2.52 0c.18.54.32 1.11.42 1.66A5.25 5.25 0 0 0 12 5.5Zm0 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 6.75c-.15.6-.25 1.35-.25 2.25h2c0-.9-.1-1.65-.25-2.25a1 1 0 0 0-.75-.38 1 1 0 0 0-.75.38Z"
            fill="#fff"
          />
        </svg>
      ),
    },
    {
      name: 'Spotify',
      url: 'https://open.spotify.com/show/6mSAc3Nuwvg8Jx2DkyeW2A',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
          <rect width="24" height="24" rx="5.4" fill="#1DB954" />
          <path
            d="M16.05 11.1c-2.34-1.39-6.2-1.52-8.43-.84a.66.66 0 1 1-.38-1.27c2.56-.78 6.82-.63 9.51 .97a.66.66 0 0 1-.7 1.14Zm-.12 2.01a.55.55 0 0 1-.76.18c-1.95-1.2-4.93-1.55-7.24-.85a.55.55 0 1 1-.32-1.06c2.63-.8 5.9-.41 8.14.97a.55.55 0 0 1 .18.76Zm-.87 1.93a.44.44 0 0 1-.6.15c-1.7-1.04-3.84-1.27-6.36-.7a.44.44 0 1 1-.2-.86c2.76-.63 5.12-.36 7.02.81a.44.44 0 0 1 .14.6Z"
            fill="#fff"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-[#f7f5f0] overflow-hidden"
    >
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c7ab77]/30 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Spotify Embed */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/10">
              <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/show/6mSAc3Nuwvg8Jx2DkyeW2A?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="The Trader Foundation Podcast on Spotify"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Gold accent line */}
            <div className="w-12 h-[2px] bg-[#c7ab77] mb-6" />

            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-4"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              The Trader Foundation Podcast
            </h2>

            <p
              className="text-[#555] text-base leading-relaxed mb-8 max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Tune in for real market insights, trading education, and conversations
              with experienced traders. Whether you are just getting started or looking
              to sharpen your edge, each episode is designed to help you become a more
              confident, independent trader.
            </p>

            <p
              className="text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Listen on:
            </p>

            <div className="flex flex-wrap gap-4">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 bg-white border border-[#e5e0d5] rounded-lg transition-all duration-300 hover:border-[#c7ab77] hover:shadow-md"
                >
                  {platform.icon}
                  <div className="flex flex-col">
                    <span
                      className="text-[0.65rem] text-[#999] leading-tight"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Listen on
                    </span>
                    <span
                      className="text-sm font-bold text-[#111] group-hover:text-[#c7ab77] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {platform.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
