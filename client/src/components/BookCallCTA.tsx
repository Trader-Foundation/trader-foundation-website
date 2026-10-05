/*
 * Live Webinar call to action.
 * One gold action on an off-white ground, left-aligned, no card and no rules
 * beyond the hairline that separates it from the section above.
 */

interface BookCallCTAProps {
  variant?: 'dark' | 'light' | 'gold';
  headline?: string;
  subtext?: string;
}

const WEBINAR_URL = 'https://live.traderfoundation.com/';

export default function BookCallCTA({ variant = 'light', headline, subtext }: BookCallCTAProps) {
  const isDark = variant === 'dark';

  return (
    <section className={isDark ? 'bg-[#141414] py-16 sm:py-20' : 'bg-[#faf9f6] py-16 sm:py-20'}>
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="max-w-[46rem]">
          {headline && (
            <h2
              className={`tf-display text-[1.75rem] sm:text-[2.25rem] ${
                isDark ? 'text-white' : 'text-[#1a1a1a]'
              }`}
            >
              {headline}
            </h2>
          )}
          {subtext && (
            <p
              className={`mt-4 text-[1.0625rem] leading-[1.6] max-w-[52ch] ${
                isDark ? 'text-white/70' : 'text-[#55534e]'
              }`}
            >
              {subtext}
            </p>
          )}
          <div className="mt-8">
            <a
              href={WEBINAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-[#c7ab77] text-[#1a1a1a] text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
            >
              Join the live webinar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
