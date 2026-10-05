/*
 * Hero, Trader Foundation
 * Editorial two-column opening: the academy name at display scale and the
 * single gold action on the left, Vlad teaching as a plain rectangle on the
 * right. No overlay, no gradient, nothing centred.
 */

import Picture from '@/components/Picture';

const HERO_PHOTO = '/images/vlad-hero.jpg';
const HERO_PHOTO_WIDTH = 1600;
const HERO_PHOTO_HEIGHT = 926;
const WEBINAR_URL = 'https://live.traderfoundation.com/';

export default function HeroSection() {
  return (
    <section className="bg-[#faf9f6] pt-[72px]">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          {/* Copy */}
          <div className="lg:col-span-6 tf-rise">
            <h1 className="tf-display text-[#1a1a1a] text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem]">
              Trader
              <br />
              Foundation
              <br />
              Academy
            </h1>

            <p className="mt-7 text-[#3a3834] text-[1.375rem] sm:text-[1.5rem] leading-[1.45] tracking-[-0.015em] max-w-[26ch]">
              An online school for stock and options trading, taught from the beginning.
              Founded by Vlad Tayman. Every student gets their own coach.
            </p>

            <div className="mt-9">
              <a
                href={WEBINAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#c7ab77] text-[#1a1a1a] text-[0.9375rem] font-semibold transition-colors duration-200 hover:bg-[#b89a66]"
              >
                Join the live webinar
              </a>
            </div>

            <div className="mt-12 pt-6 border-t border-[#e3ded4] max-w-[34rem]">
              <p className="text-[0.9375rem] font-semibold text-[#1a1a1a]">Vlad Tayman</p>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.6] text-[#55534e]">
                Founder. Came to America from Ukraine, built a corporate career, then
                learned to trade. He teaches the method he wishes he had been taught.
              </p>
            </div>
          </div>

          {/* Photograph */}
          <div className="lg:col-span-6">
            <Picture
              src={HERO_PHOTO}
              alt="Vlad Tayman teaching a student how to read a stock chart"
              width={HERO_PHOTO_WIDTH}
              height={HERO_PHOTO_HEIGHT}
              loading="eager"
              fetchPriority="high"
              className="w-full h-[18rem] sm:h-[24rem] lg:h-[34rem] object-cover object-[12%_center]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
