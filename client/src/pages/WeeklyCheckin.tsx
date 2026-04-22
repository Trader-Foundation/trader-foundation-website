/*
 * Weekly Trading Log - Standalone client-only page
 * Unlisted: not linked from site nav, disallowed in robots.txt, noindex/nofollow.
 */

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const LOGO_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

const FORM_EMBED_SRC = 'https://link.sproutcloud.co/js/form_embed.js';

export default function WeeklyCheckin() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${FORM_EMBED_SRC}"]`,
    );
    if (existing) return;

    const script = document.createElement('script');
    script.src = FORM_EMBED_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#111] text-white">
      <Helmet>
        <title>Weekly Check-in form | Trader Foundation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="pt-16 pb-10 flex justify-center px-4">
        <img
          src={LOGO_URL}
          alt="Trader Foundation"
          className="h-14 md:h-16 w-auto"
        />
      </header>

      <main className="flex-1 px-4">
        <div
          className="max-w-[720px] mx-auto text-center mb-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <h1
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Weekly Check-in form
          </h1>
          <p className="mt-3 text-white/60 text-sm md:text-base">
            Submit your weekly check-in so we can review your trades and
            progress.
          </p>
        </div>

        <div
          className="max-w-[720px] mx-auto rounded-xl border border-[#c7ab77]/20 bg-black/40 p-2.5"
          style={{
            boxShadow: '0 0 60px -20px rgba(199,171,119,0.35)',
          }}
        >
          <iframe
            src="https://link.sproutcloud.co/widget/form/7NTqxdQUOo8mxouljRFE"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 3,
              minHeight: '1229px',
            }}
            id="inline-7NTqxdQUOo8mxouljRFE"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Weekly Trading Log"
            data-height="1229"
            data-layout-iframe-id="inline-7NTqxdQUOo8mxouljRFE"
            data-form-id="7NTqxdQUOo8mxouljRFE"
            title="Weekly Trading Log"
          />
        </div>
      </main>

      <footer className="py-10 mt-16 border-t border-white/5 flex flex-col items-center gap-3">
        <img
          src={LOGO_URL}
          alt="Trader Foundation"
          className="h-8 w-auto opacity-80"
        />
        <p
          className="text-white/40 text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          © {new Date().getFullYear()} Trader Foundation | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
