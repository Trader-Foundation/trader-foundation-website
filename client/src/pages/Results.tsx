/*
 * Results Page, Trader Foundation
 * Sections: Hero, featured video, video grid, accounts, community, written
 * experiences, CTA, footer.
 *
 * Visual system per DESIGN.md: one ground (#faf9f6), the dark band (#141414),
 * Inter only, graded rules in place of cards, brand gold once per viewport on
 * the single action.
 *
 * Claims discipline per vladt83's brief of 2026-11-09: no dollar figures, no
 * percentages, no win rates and no income claims, including inside quotes. A
 * testimonial that carries a performance claim publishes that claim, so such
 * quotes are removed rather than reworded. Nothing here is called easy or free.
 */

import { useEffect, useRef, useState } from 'react';
import { Quote, Play } from 'lucide-react';

import { TrustpilotLogoWhite, TrustpilotStars } from '@/components/TrustpilotAssets';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const RESULTS_HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/results-hero-bg-CpFzyjQL6EaMaycvJfWQyx.webp';

/* ── Real Accounts & Wins ──
   3 equal tiles in a single row: Erin, Kelly, Doug.
   Files must be set to "Anyone with the link" on Drive. */
const accountTiles = [
  {
    id: '189us7YtGk2Vz65NlOUkKnoPme8-pe-fc',
    name: 'Erin Chawla',
    role: 'Coach',
    caption: 'Realized profit and loss from Erin\'s personal trading account',
  },
  {
    id: '1Tbc4f26qRvGhjUU4pfn51Xh782SMz9AY',
    name: 'Kelly Myers',
    role: 'Student · Robinhood',
    caption: 'Kelly\'s own brokerage account',
  },
  {
    id: '120XYWJJNE-dllOMQ3gLFc_0dfnTnCdPe',
    name: 'Doug Birnie',
    role: 'Student',
    caption: 'Doug, posting from his own account',
  },
];

/* ── Skool posts (community section, wider format) ── */
const skoolPosts = [
  {
    id: '1xLMnLvJirbHJr569Xe3CBA3jmUZNVgq-',
    name: 'Elliot Gumbs',
    source: 'Skool Post',
    caption: 'Elliot posting a trade from his own account',
  },
  {
    id: '1KVy8Lj3VTwNb8-E6OzXniT9O16xcuAcI',
    name: 'Mark Cunningham',
    source: 'Skool Post',
    caption: 'Student update from the community',
  },
  {
    id: '18KjlalRZfxEyDpbdLdcN6lya8smzx-Mj',
    name: 'Isaac Rorholm',
    source: 'Skool Post',
    caption: '19-year seasoned options trader',
  },
];

/* ── Video data ── */
/* Thumbnails omitted so the VimeoEmbed component falls back to
   vumbnail.com/{vimeoId}.jpg, which pulls the video's own poster
   frame directly from Vimeo. */
const featuredVideo = {
  vimeoId: '1171149705',
  title: 'What People Have to Say About Us',
  description:
    'Students on what the program is actually like, in their own words.',
};

const videoTestimonials = [
  {
    vimeoId: '936212402',
    name: 'Zeke',
    tagline: 'Leaving retail behind',
    highlight: 'Left a retail job to be at home with his kids',
    duration: '21:14',
  },
  {
    vimeoId: '936218776',
    name: 'Jason',
    tagline: 'Working to a written plan',
    highlight: 'Built a complete trading plan and works to it',
    duration: '30:51',
  },
  {
    vimeoId: '936211466',
    name: 'Shrey',
    tagline: 'From guesswork to a process',
    highlight: 'Replaced ad hoc trades with a process he follows',
    duration: '16:05',
  },
  {
    vimeoId: '949813014',
    name: 'Lev',
    tagline: 'After years of trying other things',
    highlight: 'Found clarity after years of different approaches',
    duration: '2:24',
  },
];

/* ── Written experiences ──
   Taken from the public Trustpilot profile at traderfoundation.net. Reviewer
   names appear as Trustpilot shows them. Trustpilot display names carry no
   employer or job title, so no role is attributed here: the "CFO",
   "IT Director" and similar lines that used to sit under these names were not
   supported by the source. Quotes carrying a performance or income claim are
   removed rather than reworded, because quoting a claim still publishes it. */
const studentExperiences = [
  {
    quote:
      'The program provides an excellent foundation for understanding options, strategy and pattern recognition. The real value is the access to the coaches. Erin, Elliot and Leo all have different trading styles, and patterns that they personally follow. My trading has improved dramatically as a result.',
    name: 'Doug B.',
    initials: 'DB',
  },
  {
    quote:
      'My experience with Vlad and his team has been nothing short of incredible! This is a high level organization. Coaches Elliot, Erin, and Leo genuinely want to see you succeed and work with you one on one. It is the type of personal touch that you can only find with this group.',
    name: 'Matt Couch',
    initials: 'MC',
  },
  {
    quote:
      'This course introduces you to the fundamentals before guiding you into real trading. The coaches really want you to succeed. They answer every question and meet with you as needed. They continually encourage you to practice until you feel comfortable trading with real money.',
    name: 'Lisa',
    initials: 'LI',
  },
];

/* ── Fade-in hook ── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── Video Embed Component ──
   Poster art is rendered locally (black + gold brand) instead of pulling
   Vimeo's default poster frames, which carry older blue branding. */
function VimeoEmbed({
  vimeoId,
  title,
  posterName,
  posterEyebrow,
  className = '',
}: {
  vimeoId: string;
  title: string;
  posterName?: string;
  posterEyebrow?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, #1a1a1a 0%, #0a0a0a 55%, #050505 100%)',
          }}
        >
          {/* subtle gold corner glow */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(199,171,119,0.18) 0%, transparent 65%)',
            }}
          />
          {/* faded TF wordmark, subtle */}
          <span
            className="absolute right-4 bottom-3 text-[0.65rem] font-bold tracking-[0.3em] text-[#c7ab77]/40 uppercase"
          >
            Trader Foundation
          </span>

          <div className="relative flex flex-col items-center text-center px-6">
            {posterEyebrow && (
              <p
                className="text-[0.6rem] sm:text-[0.7rem] font-bold tracking-[0.35em] uppercase text-[#c7ab77] mb-4"
              >
                {posterEyebrow}
              </p>
            )}
            {posterName && (
              <p
                className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6 max-w-[80%]"
              >
                {posterName}
              </p>
            )}
            <button
              onClick={() => setLoaded(true)}
              className="group flex items-center justify-center w-20 h-20 rounded-full bg-[#c7ab77]/90 hover:bg-[#c7ab77] transition-colors duration-200"
              aria-label={`Play ${title}`}
            >
              <Play size={28} className="text-[#1a1a1a] ml-1" fill="#1a1a1a" />
            </button>
          </div>
        </div>
      )}
      {loaded && (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  );
}

/* ── Page ── */
export default function Results() {
  const featured = useFadeIn();
  const grid = useFadeIn();
  const experiences = useFadeIn();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SEO title="Results" description="Students and coaches of Trader Foundation on what the program is actually like, in their own words and their own accounts." path="/results" />
      <Navigation />

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${RESULTS_HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#141414]/90 to-[#111]" />

        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <h1 className="tf-display text-white text-[2.5rem] sm:text-[3.25rem] lg:text-[4rem] mb-6 mx-auto max-w-[20ch]">
            In their own words
          </h1>
          <p className="text-white/60 text-[1.0625rem] md:text-[1.125rem] max-w-[52ch] mx-auto leading-[1.7]">
            We have coached over 1,200 students. These are their accounts of what the program
            is like, alongside screens from their own brokerages. Individual results vary, and
            nothing here is a guide to what any student will earn.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="flex items-center gap-3">
              <TrustpilotLogoWhite className="h-5" />
              <TrustpilotStars className="h-4" />
              <span
                className="text-white/80 text-sm"
              >
                <strong className="text-white">4.6</strong>/5
              </span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-0">
              <div className="flex items-center gap-1.5 bg-[#003366] rounded-full px-3 py-1.5">
                <svg className="h-5 w-3.5 shrink-0" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2c-2 4-8 8-8 14 0 5 3 8 6 9-1-2-1.5-4-.5-7 1-3 4-7 6-9 1 4 0 8-1 10 3-2 5.5-6 5.5-10C28 5 23 2 20 2z" fill="#4A9FD9" />
                  <path d="M20 6c-1 3-5 6-5 10 0 3 2 5 4 6-.5-1.5-1-3 0-5 .75-2 2.5-5 4-6.5.5 3 0 6-.5 7.5 2-1.5 3.5-4 3.5-7 0-3-3-6-6-5z" fill="#6BB8E8" />
                  <rect x="14" y="27" width="12" height="2.5" rx="0.5" fill="#4A9FD9" />
                  <rect x="16" y="29.5" width="8" height="2" rx="0.5" fill="#4A9FD9" />
                  <rect x="13" y="31.5" width="14" height="2.5" rx="0.5" fill="#4A9FD9" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-white text-[0.4rem] font-bold tracking-wider">BETTER</span>
                  <span className="text-white text-[0.4rem] font-bold tracking-wider">BUSINESS</span>
                  <span className="text-white text-[0.4rem] font-bold tracking-wider">BUREAU</span>
                </div>
              </div>
              <div className="-ml-2.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#1a5ca8] border-2 border-white/20 z-10">
                <div className="text-center leading-none">
                  <span className="text-white text-[0.75rem] font-semibold">A+</span>
                </div>
              </div>
            </div>
            <span className="text-white/20">|</span>
            <span
              className="text-white/60 text-sm"
            >
              6+ Years in Business
            </span>
          </div>
        </div>
      </section>

      {/* ─── Founder Bridge Intro ─── */}
      <section className="pt-12 pb-2 bg-[#141414]">
        <div className="max-w-[760px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-white/55 text-sm sm:text-base leading-relaxed"
          >
            Trader Foundation has been teaching this for over six years, led by our founder{' '}
            <strong className="text-white/80">Vlad Tayman</strong>, alongside coaches{' '}
            <strong className="text-white/80">Elliot, Erin, and Leo</strong>. Every one of them works the same method they teach.
          </p>
        </div>
      </section>

      {/* ─── Featured Video ─── */}
      <section className="py-20 bg-[#141414]">
        <div
          ref={featured.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            featured.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">

            <h2
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
            >
              {featuredVideo.title}
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden border border-white/10">
              <VimeoEmbed
                vimeoId={featuredVideo.vimeoId}
                title={featuredVideo.title}
                posterName={featuredVideo.title}
                className="aspect-video"
              />
            </div>
            <p
              className="text-white/50 text-sm text-center mt-6 max-w-xl mx-auto leading-relaxed"
            >
              {featuredVideo.description}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Video Testimonials Grid ─── */}
      <section className="py-24 bg-[#faf9f6]">
        <div
          ref={grid.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            grid.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">

            <h2
              className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight"
            >
              Hear Their Full Stories
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTestimonials.map((video, i) => (
              <div
                key={video.vimeoId}
                className="group bg-white border border-[#e3ded4] overflow-hidden transition-all duration-500  hover:border-[#c7ab77]/30"
                style={{
                  transitionDelay: `${i * 100}ms`,
                  opacity: grid.visible ? 1 : 0,
                  transform: grid.visible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.6s ease ${i * 100}ms`,
                }}
              >
                <VimeoEmbed
                  vimeoId={video.vimeoId}
                  title={`Interview with ${video.name}`}
                  posterEyebrow={video.duration}
                  posterName={video.name}
                  className="aspect-video"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77]"
                    >
                      {video.tagline}
                    </p>
                    <span
                      className="text-[#767269] text-xs"
                    >
                      {video.duration}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-semibold text-[#1a1a1a] mb-2"
                  >
                    Interview with {video.name}
                  </h3>
                  <p
                    className="text-[#55534e] text-sm leading-relaxed"
                  >
                    {video.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* YouTube CTA */}
          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com/playlist?list=PLD1J5z-iFMHWO6DfOr8SmyfQZLBeoHMvh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-[#c7ab77] hover:text-[#dfc48a] transition-colors duration-300 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-semibold tracking-wide">Watch more testimonials on our YouTube channel</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Real Accounts & Wins (hero + phone tiles) ─── */}
      <section className="py-24 bg-white border-t border-[#e3ded4]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
              Screens from their own accounts
            </h2>
            <p className="text-[#55534e] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-5">
              Most people share individual trades rather than whole accounts, because balances are private. Here's a mix of both, shared with permission.
            </p>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          {/* All 3 tiles in a single equal row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {accountTiles.map((shot) => (
              <div
                key={shot.id}
                className="bg-[#faf9f6] border border-[#e3ded4] overflow-hidden  hover:border-[#c7ab77]/40 transition-all duration-300"
              >
                <div className="p-4 bg-white flex items-center justify-center min-h-[420px]">
                  <img
                    src={`https://lh3.googleusercontent.com/d/${shot.id}=s1600`}
                    alt={`${shot.name}, ${shot.role}`}
                    className="max-h-[520px] w-auto h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="px-5 py-4 border-t border-[#e3ded4]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#1a1a1a] text-sm font-bold">
                      {shot.name}
                    </p>
                    <p className="text-[#55534e] text-[0.75rem]">
                      {shot.role}
                    </p>
                  </div>
                  <p className="text-[#55534e] text-xs leading-relaxed">
                    {shot.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[#767269] text-[11px] leading-relaxed max-w-2xl mx-auto mt-10">
            Individual accounts and messages, shared with permission. Personal results are not typical, are not a guarantee of future performance, and do not represent what any student will earn. Trading involves risk of loss.
          </p>
        </div>
      </section>

      {/* ─── Straight from the Community (Skool posts) ─── */}
      <section className="py-24 bg-[#faf9f6]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight">
              Posted inside the community
            </h2>
            <p className="text-[#55534e] text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-5">
              Posts from inside the community, where students and coaches share trades and what they learned from them.
            </p>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-10">
            {skoolPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-[#e3ded4] overflow-hidden  hover:border-[#c7ab77]/30 transition-all duration-300 w-full sm:w-[calc(50%-1.25rem)] max-w-[560px]"
              >
                <div className="p-4">
                  <img
                    src={`https://lh3.googleusercontent.com/d/${post.id}=s2000`}
                    alt={`${post.name}, ${post.source}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="px-5 py-4 border-t border-[#e3ded4]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#1a1a1a] text-sm font-bold">
                      {post.name}
                    </p>
                    <p className="text-[#55534e] text-[0.75rem]">
                      {post.source}
                    </p>
                  </div>
                  <p className="text-[#55534e] text-xs leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Student Experiences (Text Testimonials) ─── */}
      <section className="py-24 bg-[#141414]">
        <div
          ref={experiences.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            experiences.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">

            <h2
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
            >
              Professionals Who{' '}
              <span className="text-[#c7ab77]">Took the Leap</span>
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentExperiences.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group relative bg-[#1a1a1a] p-8 sm:p-10 border border-white/5 transition-all duration-500  hover:border-[#c7ab77]/30"
                style={{
                  transitionDelay: `${300 + index * 150}ms`,
                  opacity: experiences.visible ? 1 : 0,
                  transform: experiences.visible
                    ? 'translateY(0)'
                    : 'translateY(20px)',
                  transition: `all 0.6s ease ${300 + index * 150}ms`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#c7ab77]" />

                <Quote
                  size={28}
                  className="text-[#c7ab77]/30 mb-6"
                  strokeWidth={1}
                />

                <p
                  className="text-white/70 text-[0.9rem] leading-[1.8] mb-8"
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-[#c7ab77] text-[#1a1a1a] text-xs font-bold tracking-wider"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p
                      className="text-white text-[0.85rem] font-bold"
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-white/40 text-[0.75rem]">on Trustpilot</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight mb-4"
          >
            See the method taught live
          </h2>
          <p
            className="text-[#55534e] text-base leading-relaxed mb-8 max-w-lg mx-auto"
          >
            Join over 1,200 students who have transformed their trading and
            their lives with personalized coaching from our experienced team.
          </p>
          <a
            href="https://live.traderfoundation.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#1a1a1a] text-[0.85rem] font-bold tracking-wide transition-all duration-300 hover:bg-[#b89a66]"
          >
            Live Webinar
          </a>
          <p
            className="mt-4 text-[#767269] text-xs sm:text-[0.78rem]"
          >
            For professionals putting capital they have already built to work. Application required.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
