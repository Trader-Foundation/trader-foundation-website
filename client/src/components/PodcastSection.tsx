/*
 * The Trader Foundation Podcast
 * Cover, platforms, and the shows Vlad has appeared on, set plainly on the
 * off-white ground. Platform marks keep their own brand colours; nothing else
 * carries colour here.
 */

const guestAppearances = [
  { name: 'The Unstoppable Podcast', url: 'https://www.youtube.com/watch?v=dAeLX72hHNE' },
  { name: 'Speaking Podcast', url: 'https://open.spotify.com/episode/5Umj8YBXDbEwOdjlcMFZnB' },
  { name: 'Social 333 Podcast', url: 'https://www.youtube.com/watch?v=iZ8fVeBRJBo' },
  { name: 'Freedom Nation', url: 'https://freedomnationpodcast.com/episode/predictable-paychecks-from-trading-vlad-taimanon-on-building-stress-free-monthly-income-with-options' },
  { name: 'Marathon Money', url: 'https://www.youtube.com/watch?v=Q6YjAlnc_HE' },
  { name: 'Thunder Stock Show', url: 'https://podcasts.apple.com/cm/podcast/unlocking-the-american-dream-vlad-taymans-journey/id1656717958?i=1000748955574' },
];

const platforms = [
  {
    name: 'Apple Podcasts',
    url: 'https://podcasts.apple.com/us/podcast/the-trader-foundation-podcast/id1871309774',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F452FF" />
            <stop offset="100%" stopColor="#832BC1" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="5.4" fill="url(#ap)" />
        <path d="M12 5.5a5.25 5.25 0 0 0-1.68 10.22c.1-.55.24-1.12.42-1.66a3.75 3.75 0 1 1 2.52 0c.18.54.32 1.11.42 1.66A5.25 5.25 0 0 0 12 5.5Zm0 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 6.75c-.15.6-.25 1.35-.25 2.25h2c0-.9-.1-1.65-.25-2.25a1 1 0 0 0-.75-.38 1 1 0 0 0-.75.38Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/show/6mSAc3Nuwvg8Jx2DkyeW2A',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="5.4" fill="#1DB954" />
        <path d="M16.05 11.1c-2.34-1.39-6.2-1.52-8.43-.84a.66.66 0 1 1-.38-1.27c2.56-.78 6.82-.63 9.51 .97a.66.66 0 0 1-.7 1.14Zm-.12 2.01a.55.55 0 0 1-.76.18c-1.95-1.2-4.93-1.55-7.24-.85a.55.55 0 1 1-.32-1.06c2.63-.8 5.9-.41 8.14.97a.55.55 0 0 1 .18.76Zm-.87 1.93a.44.44 0 0 1-.6.15c-1.7-1.04-3.84-1.27-6.36-.7a.44.44 0 1 1-.2-.86c2.76-.63 5.12-.36 7.02.81a.44.44 0 0 1 .14.6Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@TheTraderFoundation',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="5.4" fill="#FF0000" />
        <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#fff" />
      </svg>
    ),
  },
];

export default function PodcastSection() {
  return (
    <section className="bg-[#faf9f6] py-16 sm:py-20 border-t border-[#e3ded4]">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/tf-podcast-logo_d2a32a20.jpeg"
              alt="The Trader Foundation Podcast"
              className="w-40 h-40 sm:w-48 sm:h-48 object-cover"
            />
          </div>

          <div className="lg:col-span-8">
            <h2 className="tf-display text-[#1a1a1a] text-[1.875rem] sm:text-[2.25rem] max-w-[20ch]">
              The Trader Foundation Podcast
            </h2>
            <p className="mt-4 text-[#55534e] text-[1.0625rem] leading-[1.65] max-w-[56ch]">
              Hosted by Vlad Tayman. Real market insights, trading education, and the mindset
              behind consistent results.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {platforms.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.9375rem] text-[#1a1a1a] underline decoration-[#c9c4b8] hover:decoration-[#1a1a1a]"
                  >
                    {p.icon}
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-6 border-t border-[#e3ded4]">
              <p className="text-[0.875rem] text-[#767269]">Vlad has also appeared on</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {guestAppearances.map((show) => (
                  <li key={show.name}>
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.9375rem] text-[#55534e] underline decoration-[#d8d3c8] hover:text-[#1a1a1a] hover:decoration-[#1a1a1a]"
                    >
                      {show.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
