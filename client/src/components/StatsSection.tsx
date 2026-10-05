/*
 * Trust band, Trader Foundation
 * The one dark band in the page's upper half: the figures and the third-party
 * marks, stated plainly. No counters, no accent colour, no card chrome.
 */

const stats = [
  { value: '1,200+', label: 'Students' },
  { value: '15+', label: 'Years experience' },
  { value: '6+', label: 'Years in business' },
];

/* BBB accredited business mark, A+ rating */
function BBBBadge() {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 bg-[#003366] rounded-full px-4 py-2">
        <svg className="h-6 w-4 shrink-0" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 2c-2 4-8 8-8 14 0 5 3 8 6 9-1-2-1.5-4-.5-7 1-3 4-7 6-9 1 4 0 8-1 10 3-2 5.5-6 5.5-10C28 5 23 2 20 2z" fill="#4A9FD9" />
          <path d="M20 6c-1 3-5 6-5 10 0 3 2 5 4 6-.5-1.5-1-3 0-5 .75-2 2.5-5 4-6.5.5 3 0 6-.5 7.5 2-1.5 3.5-4 3.5-7 0-3-3-6-6-5z" fill="#6BB8E8" />
          <rect x="14" y="27" width="12" height="2.5" rx="0.5" fill="#4A9FD9" />
          <rect x="16" y="29.5" width="8" height="2" rx="0.5" fill="#4A9FD9" />
          <rect x="13" y="31.5" width="14" height="2.5" rx="0.5" fill="#4A9FD9" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-white text-[0.5rem] font-bold tracking-wider">BETTER</span>
          <span className="text-white text-[0.5rem] font-bold tracking-wider">BUSINESS</span>
          <span className="text-white text-[0.5rem] font-bold tracking-wider">BUREAU</span>
          <span className="text-white/80 text-[0.3rem] mt-0.5">ACCREDITED BUSINESS</span>
        </div>
      </div>
      <div className="-ml-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#1a5ca8] border-2 border-white/20 z-10">
        <div className="text-center leading-none">
          <span className="text-white text-[0.95rem] font-extrabold">A+</span>
          <span className="block text-white/90 text-[0.3rem] font-bold tracking-wide">RATING</span>
        </div>
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#141414] py-14 sm:py-16" aria-label="Trader Foundation in numbers">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="tf-nums text-white text-[2.5rem] sm:text-[3rem] font-extrabold leading-none tracking-[-0.03em]">
                {stat.value}
              </p>
              <p className="mt-2 text-white/65 text-[0.9375rem]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#2c2c2c]">
          <BBBBadge />
        </div>
      </div>
    </section>
  );
}
