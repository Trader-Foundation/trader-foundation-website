/*
 * Podcast Section, Trader Foundation
 * Showcases The Trader Foundation Podcast + Vlad's guest appearances
 * Fonts: Sen (headings), DM Sans (body)
 */

import { useEffect, useRef, useState } from 'react';
import { Mic, ExternalLink } from 'lucide-react';

const guestAppearances = [
  {
    podcast: 'The Unstoppable Podcast',
    host: 'Harry Sardinas',
    title: 'How Professionals Make Their First Million',
    url: 'https://www.youtube.com/watch?v=dAeLX72hHNE',
  },
  {
    podcast: 'Speaking Podcast',
    host: 'Speaking Podcast',
    title: 'Simple Trading — Vlad Tayman',
    url: 'https://open.spotify.com/episode/5Umj8YBXDbEwOdjlcMFZnB',
  },
  {
    podcast: 'Social 333 Podcast',
    host: 'Chris Bentley',
    title: 'The Truth About Trading Stocks',
    url: 'https://www.youtube.com/watch?v=iZ8fVeBRJBo',
  },
  {
    podcast: 'Freedom Nation Podcast',
    host: 'Jeff Kikel',
    title: 'Predictable Paychecks from Trading',
    url: 'https://freedomnationpodcast.com/episode/predictable-paychecks-from-trading-vlad-taimanon-on-building-stress-free-monthly-income-with-options',
  },
  {
    podcast: 'Marathon Money Podcast',
    host: 'Marathon Money Team',
    title: 'The Paycheck Collector Strategy for Trading',
    url: 'https://www.youtube.com/watch?v=Q6YjAlnc_HE',
  },
  {
    podcast: 'Thunder Stock Show',
    host: 'Ross Stockdale',
    title: 'Unlocking the American Dream',
    url: 'https://podcasts.apple.com/cm/podcast/unlocking-the-american-dream-vlad-taymans-journey/id1656717958?i=1000748955574',
  },
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#111] overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#c7ab77]/10 flex items-center justify-center">
              <Mic size={20} className="text-[#c7ab77]" />
            </div>
            <span
              className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-[#c7ab77]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Podcast
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            The Trader Foundation Podcast
          </h2>
          <p
            className="text-[#999] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Real market insights, trading education, and conversations with experienced traders.
            Hosted by Vlad Tayman — from corporate burnout to professional trader.
          </p>
        </div>

        {/* Main Content: Embed + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">

          {/* Left: Spotify Embed */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30">
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

            {/* Platform Links */}
            <div className="mt-6">
              <p
                className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77] mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Available on:
              </p>
              <div className="flex flex-wrap gap-3">
                {/* Apple Podcasts */}
                <a
                  href="https://podcasts.apple.com/us/podcast/the-trader-foundation-podcast/id1871309774"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <defs>
                      <linearGradient id="apple-pod-dark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F452FF" />
                        <stop offset="100%" stopColor="#832BC1" />
                      </linearGradient>
                    </defs>
                    <rect width="24" height="24" rx="5.4" fill="url(#apple-pod-dark)" />
                    <path
                      d="M12 5.5a5.25 5.25 0 0 0-1.68 10.22c.1-.55.24-1.12.42-1.66a3.75 3.75 0 1 1 2.52 0c.18.54.32 1.11.42 1.66A5.25 5.25 0 0 0 12 5.5Zm0 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 6.75c-.15.6-.25 1.35-.25 2.25h2c0-.9-.1-1.65-.25-2.25a1 1 0 0 0-.75-.38 1 1 0 0 0-.75.38Z"
                      fill="#fff"
                    />
                  </svg>
                  <span
                    className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Apple Podcasts
                  </span>
                </a>

                {/* Spotify */}
                <a
                  href="https://open.spotify.com/show/6mSAc3Nuwvg8Jx2DkyeW2A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <rect width="24" height="24" rx="5.4" fill="#1DB954" />
                    <path
                      d="M16.05 11.1c-2.34-1.39-6.2-1.52-8.43-.84a.66.66 0 1 1-.38-1.27c2.56-.78 6.82-.63 9.51 .97a.66.66 0 0 1-.7 1.14Zm-.12 2.01a.55.55 0 0 1-.76.18c-1.95-1.2-4.93-1.55-7.24-.85a.55.55 0 1 1-.32-1.06c2.63-.8 5.9-.41 8.14.97a.55.55 0 0 1 .18.76Zm-.87 1.93a.44.44 0 0 1-.6.15c-1.7-1.04-3.84-1.27-6.36-.7a.44.44 0 1 1-.2-.86c2.76-.63 5.12-.36 7.02.81a.44.44 0 0 1 .14.6Z"
                      fill="#fff"
                    />
                  </svg>
                  <span
                    className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Spotify
                  </span>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@TheTraderFoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg transition-all duration-300 hover:border-[#c7ab77]/50 hover:bg-white/10"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <rect width="24" height="24" rx="5.4" fill="#FF0000" />
                    <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#fff" />
                  </svg>
                  <span
                    className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    YouTube
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Vlad Bio + About the Podcast */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-12 h-[2px] bg-[#c7ab77] mb-6" />

            <h3
              className="text-xl sm:text-2xl font-extrabold text-white mb-4"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Your Host: Vlad Tayman
            </h3>

            <div
              className="text-[#bbb] text-[0.9rem] leading-[1.8] space-y-4 mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <p>
                After spending 20 years climbing the corporate ladder — ending as a director at a
                Fortune 500 company — Vlad hit a breaking point. The burnout landed him in a hospital.
                He knew something had to change.
              </p>
              <p>
                He lost <strong className="text-white">$150,000</strong> trying every shortcut: stock signals,
                AI bots, day trading. It wasn't until he discovered swing trading and built a real
                foundation that everything changed.
              </p>
              <p>
                Today, Vlad is the founder of <strong className="text-[#c7ab77]">Trader Foundation</strong>,
                a BBB A+ accredited academy that has helped over 1,200 students build the skills to
                manage their own wealth. On the podcast, he pulls back the curtain on the strategies,
                mindset, and discipline that separate the top 10% of traders.
              </p>
            </div>

            <p
              className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              New episodes weekly
            </p>
          </div>
        </div>

        {/* Guest Appearances Section */}
        <div
          className={`transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="border-t border-white/10 pt-12">
            <h3
              className="text-lg sm:text-xl font-extrabold text-white mb-2 text-center"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Vlad's Podcast Appearances
            </h3>
            <p
              className="text-[#888] text-sm text-center mb-10 max-w-lg mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Hear Vlad share his story and trading insights on some of the top podcasts in finance and entrepreneurship.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guestAppearances.map((appearance, index) => (
                <a
                  key={appearance.title}
                  href={appearance.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col p-5 bg-white/[0.03] border border-white/[0.06] rounded-lg transition-all duration-300 hover:bg-white/[0.06] hover:border-[#c7ab77]/30"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="text-[#c7ab77] text-[0.7rem] font-bold tracking-wider uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {appearance.podcast}
                    </span>
                    <ExternalLink size={12} className="text-white/20 group-hover:text-[#c7ab77] transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <p
                    className="text-white text-sm font-semibold leading-snug mb-2 group-hover:text-[#c7ab77] transition-colors"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {appearance.title}
                  </p>
                  <p
                    className="text-[#777] text-xs mt-auto"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    with {appearance.host}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
