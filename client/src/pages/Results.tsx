/*
 * Results Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Sections: Hero → Featured Video → Video Grid → Student Experiences → CTA → Footer
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold), #1a1a1a (near-black)
 */

import { useEffect, useRef, useState } from 'react';
import { Quote, Play, Star } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const RESULTS_HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/results-hero-bg-CpFzyjQL6EaMaycvJfWQyx.webp';

/* ── Video data ── */
const featuredVideo = {
  vimeoId: '1171149705',
  title: 'What People Have to Say About Us',
  description:
    'Hear directly from our students about how Trader Foundation transformed their approach to the markets and their lives.',
};

const videoTestimonials = [
  {
    vimeoId: '936212402',
    name: 'Zeke',
    tagline: 'From Stressed to Blessed',
    highlight: 'First day yielded $12,000 — left retail to be a full-time dad',
    duration: '21:14',
  },
  {
    vimeoId: '936218776',
    name: 'Jason',
    tagline: 'From Beginner to Professional',
    highlight: 'Built a complete trading plan and now trades with confidence',
    duration: '30:51',
  },
  {
    vimeoId: '936211466',
    name: 'Shrey',
    tagline: 'Turning Doubt Into Confidence',
    highlight: 'Went from inconsistent trades to a reliable weekly income',
    duration: '16:05',
  },
  {
    vimeoId: '949813014',
    name: 'Lev',
    tagline: 'Simplifying Trading for Real Results',
    highlight: 'Found clarity after years of trying different approaches',
    duration: '2:24',
  },
];

/* ── Text testimonials (student experiences) ── */
const studentExperiences = [
  {
    quote:
      "I was skeptical after losing money on other programs. The 1-on-1 coaching here changed everything. My coach reviewed every single trade until I truly understood.",
    name: 'Recent Graduate',
    role: 'IT Professional',
    initials: 'RG',
  },
  {
    quote:
      "As an engineer working 60-hour weeks, I needed something that didn't require staring at charts all day. The swing trading approach fits perfectly into my lunch break.",
    name: 'Active Student',
    role: 'Software Engineer',
    initials: 'AS',
  },
  {
    quote:
      "The daily mastermind sessions are invaluable. Being surrounded by serious traders who are all learning and growing together — it's like having a graduate cohort.",
    name: 'Community Member',
    role: 'Project Manager',
    initials: 'CM',
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

/* ── Video Embed Component ── */
function VimeoEmbed({
  vimeoId,
  title,
  className = '',
}: {
  vimeoId: string;
  title: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative bg-[#0a0a0a] overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={() => setLoaded(true)}
            className="group flex items-center justify-center w-20 h-20 rounded-full bg-[#c7ab77]/90 hover:bg-[#c7ab77] transition-all duration-300 hover:scale-110 shadow-2xl"
            aria-label={`Play ${title}`}
          >
            <Play size={28} className="text-[#111] ml-1" fill="#111" />
          </button>
        </div>
      )}
      {!loaded && (
        <img
          src={`https://vumbnail.com/${vimeoId}.jpg`}
          alt={title}
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
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
      <Navigation />

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${RESULTS_HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#111]/90 to-[#111]" />

        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Real Stories, Real Freedom
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Our Students&rsquo; <span className="text-[#c7ab77]">Results</span>
          </h1>
          <p
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Over 1,200 traders have transformed their financial future with
            Trader Foundation. Watch their stories and decide for yourself.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-[#c7ab77]"
                    fill="#c7ab77"
                  />
                ))}
              </div>
              <span
                className="text-white/60 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                TrustPilot Rated
              </span>
            </div>
            <span className="text-white/20">|</span>
            <span
              className="text-white/60 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              BBB A+ Accredited
            </span>
            <span className="text-white/20">|</span>
            <span
              className="text-white/60 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              6+ Years in Business
            </span>
          </div>
        </div>
      </section>

      {/* ─── Featured Video ─── */}
      <section className="py-20 bg-[#111]">
        <div
          ref={featured.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            featured.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Featured Testimonial
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              {featuredVideo.title}
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <VimeoEmbed
                vimeoId={featuredVideo.vimeoId}
                title={featuredVideo.title}
                className="aspect-video"
              />
            </div>
            <p
              className="text-white/50 text-sm text-center mt-6 max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
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
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              In-Depth Interviews
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Hear Their Full Stories
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTestimonials.map((video, i) => (
              <div
                key={video.vimeoId}
                className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-[#c7ab77]/30"
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
                  className="aspect-video"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#c7ab77]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {video.tagline}
                    </p>
                    <span
                      className="text-[#999] text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {video.duration}
                    </span>
                  </div>
                  <h3
                    className="text-xl font-extrabold text-[#111] mb-2"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    Interview with {video.name}
                  </h3>
                  <p
                    className="text-[#555] text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {video.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Student Experiences (Text Testimonials) ─── */}
      <section className="py-24 bg-[#111]">
        <div
          ref={experiences.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            experiences.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p
              className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Student Experiences
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "'Sen', sans-serif" }}
            >
              Hear From Those Who{' '}
              <span className="text-[#c7ab77]">Made the Commitment</span>
            </h2>
            <div className="w-20 h-[2px] bg-[#c7ab77] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studentExperiences.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group relative bg-[#1a1a1a] p-8 sm:p-10 border border-white/5 rounded-lg transition-all duration-500 hover:shadow-[0_8px_40px_rgba(199,171,119,0.08)] hover:border-[#c7ab77]/30"
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
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div
                    className="w-10 h-10 flex items-center justify-center bg-[#c7ab77] text-[#111] text-xs font-bold tracking-wider rounded-sm"
                    style={{ fontFamily: "'Sen', sans-serif" }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p
                      className="text-white text-[0.85rem] font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-white/40 text-[0.75rem]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {testimonial.role}
                    </p>
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
            className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight mb-4"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Ready to Write Your Own{' '}
            <span className="text-[#c7ab77]">Success Story</span>?
          </h2>
          <p
            className="text-[#555] text-base leading-relaxed mb-8 max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Join over 1,200 students who have transformed their trading and
            their lives with personalized coaching from our experienced team.
          </p>
          <a
            href="https://start.traderfoundation.co/trade"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Watch The Masterclass
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
