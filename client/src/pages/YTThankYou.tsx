/*
 * YT Thank You Page — faithful port of start.traderfoundation.co/yt-thank-you-page
 * The original is a GoHighLevel funnel page. Structure, copy, media and layout
 * are reproduced 1:1 from its source; only the builder chrome is dropped.
 *
 * NOTE: the original also loads GTM (GTM-MWWTB5DB), the Meta Pixel
 * (2170715166407053) and the Hyros universal script. Those are intentionally
 * NOT included here — add them deliberately if this page replaces the funnel
 * page for ad traffic.
 *
 * Fonts: Inter (headings + body), Oswald ("Watch This Video")
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const CDN = 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/vTzJCtKf0RZp1Tf6cIIp/media';
const MEDIA = 'https://assets.cdn.filesafe.space/vTzJCtKf0RZp1Tf6cIIp/media';

const img = (id: string) => `${CDN}/${id}`;

const BG_IMAGE = img('695e99c9153bbc8ebafb83cf.png');
const LOGO = img('698d19647213974f94a3ff69.png');
const FOOTER_LOGO = img('6841cd8538889687db63b4b2.png');
const FOOTER_BADGE = img('6a183fd3f58810f313ae785d.svg');

/* Wistia VSLs, in page order */
const WISTIA_INTRO = 'fpmxol1xnd';
const WISTIA_SCAMS = 'uydwzz366f';
const WISTIA_STRATEGY = 'gcnmksvf2n';
const WISTIA_COMPOUNDING = 'ezs3aymbma';
const WISTIA_CLIENTS = 'dfmchpoaj7';

/* Self-hosted client testimonials */
const TESTIMONIALS_4 = [
  { id: '6a194b5f5be84ad6402e71fb', poster: '6a75f64cdd9e4a3814296fab.png', name: 'Andrew Scott' },
  { id: '6a19530f5be84ad6402eebda', poster: '6a75f64cdd9e4a3814296fa7.png', name: 'Danny Musaev' },
  { id: '6a195310d293ded457ba197a', poster: '6a75f64de15da8bdd8f327db.png', name: 'Eugene Bell' },
  { id: '6a1953108c6ee94929c50b59', poster: '6a75f64c888087201926205c.png', name: 'Kunal Jani' },
];

const TESTIMONIALS_3 = [
  { id: '6a195310d293ded457ba1974', poster: '6a75f64c8880872019262052.png', name: 'Sabat Madina' },
  { id: '6a19530fd293ded457ba1972', poster: '6a75f64c9994d35aa0cdab34.png', name: 'Sarah Johnson' },
  { id: '6a19530f337267cd86eac96d', poster: '6a75f64e8880872019262083.png', name: 'Shawna' },
];

/* Vimeo testimonials, two rows of two */
const VIMEO_ROW_1 = ['936211466', '936212402'];
const VIMEO_ROW_2 = ['949813014', '936218776'];

/* Results screenshots */
const RESULTS_PAIR_1 = ['6a1831275be84ad6401b9b0e.png', '6a18313a054f002268c404c2.png'];
const RESULTS_PAIR_2 = ['6a1831635be84ad6401b9d18.png', '6a183163054f002268c4065c.png'];
const RESULTS_WIDE_1 = '6a183163054f002268c40666.png';
const RESULTS_PAIR_3 = ['6a1831623e043d8258eae342.png', '6a1831608c6ee94929b1ab4e.png'];
const RESULTS_PAIR_4 = ['6a183162c460f23b3a00a9ef.png', '6a183160054f002268c4064c.png'];
const RESULTS_WIDE_2 = '6a18316260904d91053b6f55.png';
const RESULTS_WIDE_3 = '6a183162fedd58e234b60fb9.png';
const RESULTS_PAIR_5 = ['6a1831603e043d8258eae317.png', '6a1831607b799e677779ee92.png'];
const RESULTS_WIDE_4 = '6a1831603e043d8258eae316.png';
const RESULTS_WIDE_5 = '6a183160054f002268c4064d.png';

const WISTIA_PLAYER_SRC = 'https://fast.wistia.com/player.js';

function useWistia(mediaIds: string[]) {
  useEffect(() => {
    const sources = [WISTIA_PLAYER_SRC, ...mediaIds.map((id) => `https://fast.wistia.com/embed/${id}.js`)];
    const added: HTMLScriptElement[] = [];

    sources.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      if (src !== WISTIA_PLAYER_SRC) script.type = 'module';
      document.body.appendChild(script);
      added.push(script);
    });

    return () => {
      added.forEach((script) => script.parentNode?.removeChild(script));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* The builder renders headings as gold banners with black text, 32px desktop / 17px mobile */
function GoldHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="my-8 bg-[#c7ab77] text-black text-center font-bold leading-[1.3em] text-[17px] sm:text-[32px]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </h2>
  );
}

function WistiaVideo({ mediaId, width = '75%' }: { mediaId: string; width?: string }) {
  return (
    <div className="mx-auto w-full py-2.5" style={{ maxWidth: width }}>
      {/* @ts-expect-error wistia-player is a custom element registered by the embed script */}
      <wistia-player media-id={mediaId} seo="false" aspect="1.7777777777777777" />
    </div>
  );
}

function HostedVideo({ id, poster, name }: { id: string; poster: string; name: string }) {
  return (
    <video
      className="w-full h-auto"
      controls
      playsInline
      preload="none"
      poster={img(poster)}
      aria-label={`${name} testimonial`}
    >
      <source src={`${MEDIA}/${id}.mov`} />
    </video>
  );
}

function VimeoVideo({ id }: { id: string }) {
  return (
    <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={`https://player.vimeo.com/video/${id}?app_id=122963&autoplay=0&controls=1`}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={`Trader Foundation testimonial ${id}`}
        loading="lazy"
      />
    </div>
  );
}

function ResultImage({ id, maxWidth }: { id: string; maxWidth: number }) {
  return (
    <div className="p-2.5 text-center">
      <img
        src={img(id)}
        alt=""
        loading="lazy"
        className="mx-auto max-w-full h-auto"
        style={{ width: maxWidth }}
      />
    </div>
  );
}

/* Rows collapse to a single column under 768px, matching the builder's mobile behaviour */
function Grid({ cols, children }: { cols: 2 | 3 | 4; children: React.ReactNode }) {
  const md = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[cols];
  return <div className={`grid grid-cols-1 ${md} gap-2.5 py-2.5`}>{children}</div>;
}

export default function YTThankYou() {
  useWistia([WISTIA_INTRO, WISTIA_SCAMS, WISTIA_STRATEGY, WISTIA_COMPOUNDING, WISTIA_CLIENTS]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black">
      <Helmet>
        <title>TF | Start Trading with Confidence</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="TF | Start Trading with Confidence" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={img('69ac8b9c7bdf384400d373d3.png')}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* Main section, fixed cover background */}
      <section
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE})`, backgroundAttachment: 'fixed' }}
      >
        <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-6">
          {/* Logo */}
          <div className="pt-2.5 text-center">
            <img
              src={LOGO}
              alt="Trader Foundation"
              className="mx-auto h-auto w-10 sm:w-[100px]"
            />
          </div>

          {/* Watch This Video */}
          <h1
            className="text-center font-bold text-white leading-[1.3em] text-[25px] sm:text-[38px] py-4"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Watch This Video
          </h1>

          <WistiaVideo mediaId={WISTIA_INTRO} />

          <GoldHeading>There Are A Lot Of Scams Out There, So...</GoldHeading>

          <WistiaVideo mediaId={WISTIA_SCAMS} />

          <GoldHeading>Want To See How I Teach Our Strategy?</GoldHeading>

          <WistiaVideo mediaId={WISTIA_STRATEGY} />

          <GoldHeading>Want To See The Power Of Compounding With Us?</GoldHeading>

          <WistiaVideo mediaId={WISTIA_COMPOUNDING} />

          <GoldHeading>Want To Hear From Our 1200+ Clients?</GoldHeading>

          <WistiaVideo mediaId={WISTIA_CLIENTS} width="100%" />

          {/* Client testimonials */}
          <Grid cols={4}>
            {TESTIMONIALS_4.map((video) => (
              <HostedVideo key={video.id} {...video} />
            ))}
          </Grid>

          <Grid cols={3}>
            {TESTIMONIALS_3.map((video) => (
              <HostedVideo key={video.id} {...video} />
            ))}
          </Grid>

          <Grid cols={2}>
            {VIMEO_ROW_1.map((id) => (
              <VimeoVideo key={id} id={id} />
            ))}
          </Grid>

          <Grid cols={2}>
            {VIMEO_ROW_2.map((id) => (
              <VimeoVideo key={id} id={id} />
            ))}
          </Grid>

          <GoldHeading>
            In No Way Are We
            <br />
            Making Claims This Will Be Your Results. But We Guarantee That If You Follow Our
            Blueprint You Have Better Odds At Succeeding Like The Ones That Committed To Learning
            The Skill Of Trading
          </GoldHeading>

          {/* Results screenshots */}
          <Grid cols={2}>
            {RESULTS_PAIR_1.map((id) => (
              <ResultImage key={id} id={id} maxWidth={500} />
            ))}
          </Grid>

          <Grid cols={2}>
            {RESULTS_PAIR_2.map((id) => (
              <ResultImage key={id} id={id} maxWidth={500} />
            ))}
          </Grid>

          <ResultImage id={RESULTS_WIDE_1} maxWidth={900} />

          <Grid cols={2}>
            <ResultImage id={RESULTS_PAIR_3[0]} maxWidth={500} />
            <ResultImage id={RESULTS_PAIR_3[1]} maxWidth={300} />
          </Grid>

          {/* This row is 82% wide in the original */}
          <div className="mx-auto w-full md:w-[82%]">
            <Grid cols={2}>
              {RESULTS_PAIR_4.map((id) => (
                <ResultImage key={id} id={id} maxWidth={350} />
              ))}
            </Grid>
            <ResultImage id={RESULTS_WIDE_2} maxWidth={900} />
          </div>

          <ResultImage id={RESULTS_WIDE_3} maxWidth={900} />

          <Grid cols={2}>
            {RESULTS_PAIR_5.map((id) => (
              <ResultImage key={id} id={id} maxWidth={350} />
            ))}
          </Grid>

          <ResultImage id={RESULTS_WIDE_4} maxWidth={900} />
          <ResultImage id={RESULTS_WIDE_5} maxWidth={900} />
        </div>
      </section>

      {/* Footer, black */}
      <section className="bg-black py-5">
        <div
          className="mx-auto w-full max-w-[1170px] px-4 sm:px-6 text-center text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="mx-auto w-full md:w-[46%]">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2.5 py-2.5">
              <div className="p-2.5">
                <img
                  src={FOOTER_LOGO}
                  alt="Trader Foundation"
                  loading="lazy"
                  className="mx-auto h-auto w-[150px] max-w-full"
                />
              </div>
              <div className="p-2.5">
                <img
                  src={FOOTER_BADGE}
                  alt=""
                  loading="lazy"
                  className="mx-auto h-auto w-[150px] max-w-full"
                />
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-[16px] font-normal leading-[1.3em]">
            © {new Date().getFullYear()} Trader Foundation | All Rights Reserved
          </h2>

          <p className="mb-4 text-[14px] font-medium leading-[1.3em]">
            The results shown on this page are real students and our own trades, shared with
            permission. They are not a promise of what you'll earn. What we've seen consistently:
            students who show up, follow the process, and trade the plan tend to see steady progress
            over months not overnight. Students who don't, don't. Trading involves real risk,
            including loss of capital.
          </p>

          <p className="mb-4 text-[14px] font-medium leading-[1.3em]">
            NOT FACEBOOK™: This site is not a part of the Facebook™ website or Facebook Inc.
            Additionally, This site is NOT endorsed by Facebook™ in any way. FACEBOOK™ is a
            trademark of FACEBOOK™, Inc. Hi! We use cookies, including third-party cookies, on this
            website to help operate our site and for analytics and advertising purposes. For more on
            how we use cookies and your cookie choices, go here for our cookie policy
          </p>

          <div className="text-[14px] leading-[1.3em]">
            <h2 className="font-normal">DISCLAIMER:</h2>
            <p>
              The trading results stated and shown are based on my personal experience and the
              experiences of my clients. Results will vary depending on individual starting points,
              financial goals, trading frequency, risk tolerance, and adherence to the program. The
              testimonials featured represent clients who have successfully implemented the
              strategies taught in the Trader Foundation program. Program lengths and results depend
              on individual participation, market conditions, and effort. Trading carries risk, and
              it is possible to lose money. The contents of our website and program are for
              informational and educational purposes only and should not be construed as financial
              advice, nor do they guarantee specific outcomes. Consult with a licensed financial
              advisor before making any investment decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
