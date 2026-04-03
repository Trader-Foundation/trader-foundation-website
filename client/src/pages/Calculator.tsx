/*
 * Compound Interest Calculator Page, Trader Foundation Academy
 * Design: "The Academy", Ivy League Digital Campus
 * Features: Interactive calculator with chart, Vlad teaching image, educational content
 * Fonts: Sen (headings), DM Sans (body)
 * Palette: #111 (dark), #faf9f6 (ivory), #c7ab77 (gold), #1a1a1a (near-black)
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, Info } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const VLAD_TEACHING =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/vlad-classroom-teaching-htYQHLLE6LXPsyrVmmpoZv.webp';
const CALCULATOR_HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/calculator-hero-bg-f3Rq9By3EDjXhzwTJdmpaq.webp';

/* ── Formatting helpers ── */
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function formatFullCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/* ── Compound interest calculation ── */
interface YearData {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number
): YearData[] {
  const data: YearData[] = [];
  let balance = principal;
  let totalContributions = principal;
  const ratePerPeriod = annualRate / 100 / compoundingFrequency;
  const periodsPerYear = compoundingFrequency;

  for (let y = 1; y <= years; y++) {
    for (let p = 0; p < periodsPerYear; p++) {
      // Add monthly contributions proportionally
      const monthsInPeriod = 12 / periodsPerYear;
      balance += monthlyContribution * monthsInPeriod;
      totalContributions += monthlyContribution * monthsInPeriod;
      // Apply interest
      balance *= 1 + ratePerPeriod;
    }
    data.push({
      year: y,
      balance,
      totalContributions,
      totalInterest: balance - totalContributions,
    });
  }
  return data;
}

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

/* ── Chart Component ── */
function GrowthChart({ data }: { data: YearData[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartWidth = 700;
  const chartHeight = 320;
  const padding = { top: 30, right: 30, bottom: 50, left: 70 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxBalance = Math.max(...data.map((d) => d.balance), 1);
  const maxContributions = Math.max(
    ...data.map((d) => d.totalContributions),
    1
  );
  const yMax = Math.max(maxBalance, maxContributions) * 1.1;

  const getX = (i: number) =>
    padding.left + (i / (data.length - 1 || 1)) * innerWidth;
  const getY = (val: number) =>
    padding.top + innerHeight - (val / yMax) * innerHeight;

  // Build paths
  const balancePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.balance)}`)
    .join(' ');
  const contributionsPath = data
    .map(
      (d, i) =>
        `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.totalContributions)}`
    )
    .join(' ');

  // Area fill for balance
  const balanceArea =
    balancePath +
    ` L ${getX(data.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from(
    { length: yTicks + 1 },
    (_, i) => (yMax / yTicks) * i
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto min-w-[500px]"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Grid lines */}
        {yTickValues.map((val, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={getY(val)}
              x2={chartWidth - padding.right}
              y2={getY(val)}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 10}
              y={getY(val) + 4}
              textAnchor="end"
              fill="rgba(255,255,255,0.35)"
              fontSize="10"
              fontFamily="'DM Sans', sans-serif"
            >
              {formatCurrency(val)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {data
          .filter(
            (_, i) =>
              i === 0 ||
              i === data.length - 1 ||
              (i + 1) % Math.ceil(data.length / 8) === 0
          )
          .map((d, _, arr) => {
            const i = data.indexOf(d);
            return (
              <text
                key={d.year}
                x={getX(i)}
                y={chartHeight - 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize="10"
                fontFamily="'DM Sans', sans-serif"
              >
                Year {d.year}
              </text>
            );
          })}

        {/* Area fill */}
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c7ab77" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c7ab77" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={balanceArea} fill="url(#balanceGrad)" />

        {/* Contributions line */}
        <path
          d={contributionsPath}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Balance line */}
        <path
          d={balancePath}
          fill="none"
          stroke="#c7ab77"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Hover areas */}
        {data.map((d, i) => (
          <g key={i}>
            <rect
              x={getX(i) - innerWidth / data.length / 2}
              y={padding.top}
              width={innerWidth / data.length}
              height={innerHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
            />
            {hoveredIndex === i && (
              <>
                <line
                  x1={getX(i)}
                  y1={padding.top}
                  x2={getX(i)}
                  y2={padding.top + innerHeight}
                  stroke="rgba(199,171,119,0.3)"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={getX(i)}
                  cy={getY(d.balance)}
                  r="5"
                  fill="#c7ab77"
                  stroke="#111"
                  strokeWidth="2"
                />
                <circle
                  cx={getX(i)}
                  cy={getY(d.totalContributions)}
                  r="4"
                  fill="rgba(255,255,255,0.5)"
                  stroke="#111"
                  strokeWidth="2"
                />
                {/* Tooltip */}
                <foreignObject
                  x={Math.min(getX(i) - 80, chartWidth - 180)}
                  y={Math.max(getY(d.balance) - 80, 5)}
                  width="160"
                  height="72"
                >
                  <div
                    style={{
                      background: 'rgba(26,26,26,0.95)',
                      border: '1px solid rgba(199,171,119,0.3)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      color: 'white',
                    }}
                  >
                    <div style={{ color: '#c7ab77', fontWeight: 700 }}>
                      Year {d.year}
                    </div>
                    <div>Balance: {formatFullCurrency(d.balance)}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Contributed: {formatFullCurrency(d.totalContributions)}
                    </div>
                  </div>
                </foreignObject>
              </>
            )}
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${padding.left + 10}, ${padding.top + 10})`}>
          <line x1="0" y1="0" x2="20" y2="0" stroke="#c7ab77" strokeWidth="2.5" />
          <text
            x="26"
            y="4"
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            fontFamily="'DM Sans', sans-serif"
          >
            Total Balance
          </text>
          <line
            x1="120"
            y1="0"
            x2="140"
            y2="0"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text
            x="146"
            y="4"
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            fontFamily="'DM Sans', sans-serif"
          >
            Contributions
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ── Input Component ── */
function CalcInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  icon: Icon,
  min = 0,
  max,
  step = 1,
  helpText,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  icon: React.ElementType;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        className="flex items-center gap-2 text-[0.8rem] font-semibold text-white/70"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <Icon size={14} className="text-[#c7ab77]" />
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          min={min}
          max={max}
          step={step}
          className={`w-full bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm py-3 focus:outline-none focus:border-[#c7ab77]/50 focus:ring-1 focus:ring-[#c7ab77]/20 transition-all ${
            prefix ? 'pl-8 pr-4' : 'pl-4 pr-4'
          } ${suffix ? 'pr-10' : ''}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {suffix && (
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p
          className="text-white/30 text-xs flex items-center gap-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <Info size={10} />
          {helpText}
        </p>
      )}
    </div>
  );
}

/* ── Page ── */
export default function Calculator() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(20);
  const [compounding, setCompounding] = useState(12);

  const educationSection = useFadeIn();

  const data = useMemo(
    () =>
      calculateCompoundInterest(
        principal,
        monthlyContribution,
        annualRate,
        years,
        compounding
      ),
    [principal, monthlyContribution, annualRate, years, compounding]
  );

  const finalData = data[data.length - 1];
  const totalContributed = finalData?.totalContributions ?? principal;
  const totalInterest = finalData?.totalInterest ?? 0;
  const finalBalance = finalData?.balance ?? principal;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navigation />

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${CALCULATOR_HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#111]/90 to-[#111]" />

        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Financial Tools
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Compound Wealth{' '}
            <span className="text-[#c7ab77]">Calculator</span>
          </h1>
          <p
            className="text-white/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            See how your investments can grow exponentially over time. Albert
            Einstein called compound interest &ldquo;the eighth wonder of the
            world.&rdquo;
          </p>
        </div>
      </section>

      {/* ─── Calculator Section ─── */}
      <section className="py-16 bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Inputs (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#151515] border border-white/5 rounded-xl p-6 sm:p-8 space-y-6">
                <h3
                  className="text-lg font-extrabold text-white mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Your Investment Details
                </h3>
                <div className="w-10 h-[2px] bg-[#c7ab77] mb-4" />

                <CalcInput
                  label="Initial Investment"
                  value={principal}
                  onChange={setPrincipal}
                  prefix="$"
                  icon={DollarSign}
                  min={0}
                  step={1000}
                  helpText="The amount you start with"
                />

                <CalcInput
                  label="Monthly Contribution"
                  value={monthlyContribution}
                  onChange={setMonthlyContribution}
                  prefix="$"
                  icon={DollarSign}
                  min={0}
                  step={100}
                  helpText="Amount added each month"
                />

                <CalcInput
                  label="Annual Interest Rate"
                  value={annualRate}
                  onChange={setAnnualRate}
                  suffix="%"
                  icon={Percent}
                  min={0}
                  max={50}
                  step={0.5}
                  helpText="Expected yearly return"
                />

                <CalcInput
                  label="Time Period"
                  value={years}
                  onChange={setYears}
                  suffix="yrs"
                  icon={Calendar}
                  min={1}
                  max={50}
                  step={1}
                  helpText="How long you plan to invest"
                />

                <div className="space-y-2">
                  <label
                    className="flex items-center gap-2 text-[0.8rem] font-semibold text-white/70"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <TrendingUp size={14} className="text-[#c7ab77]" />
                    Compounding Frequency
                  </label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(parseInt(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm py-3 px-4 focus:outline-none focus:border-[#c7ab77]/50 focus:ring-1 focus:ring-[#c7ab77]/20 transition-all appearance-none"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <option value={1}>Annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
              </div>

              {/* Results summary */}
              <div className="bg-[#151515] border border-[#c7ab77]/20 rounded-xl p-6 sm:p-8">
                <h3
                  className="text-lg font-extrabold text-white mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Your Projected Results
                </h3>
                <div className="w-10 h-[2px] bg-[#c7ab77] mb-6" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/50 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Final Balance
                    </span>
                    <span
                      className="text-[#c7ab77] text-xl font-extrabold"
                      style={{ fontFamily: "'Sen', sans-serif" }}
                    >
                      {formatFullCurrency(finalBalance)}
                    </span>
                  </div>

                  <div className="h-[1px] bg-white/5" />

                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/50 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Total Contributed
                    </span>
                    <span
                      className="text-white text-base font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {formatFullCurrency(totalContributed)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/50 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Total Interest Earned
                    </span>
                    <span
                      className="text-emerald-400 text-base font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {formatFullCurrency(totalInterest)}
                    </span>
                  </div>

                  <div className="h-[1px] bg-white/5" />

                  {/* Visual bar */}
                  <div>
                    <div className="flex justify-between text-xs text-white/40 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span>Contributions vs Interest</span>
                      <span>
                        {((totalInterest / finalBalance) * 100).toFixed(1)}%
                        interest
                      </span>
                    </div>
                    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-white/20 transition-all duration-700"
                        style={{
                          width: `${(totalContributed / finalBalance) * 100}%`,
                        }}
                      />
                      <div
                        className="h-full bg-[#c7ab77] transition-all duration-700"
                        style={{
                          width: `${(totalInterest / finalBalance) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <span className="text-white/30">Contributions</span>
                      <span className="text-[#c7ab77]/60">Interest</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart (3 cols) */}
            <div className="lg:col-span-3">
              <div className="bg-[#151515] border border-white/5 rounded-xl p-6 sm:p-8">
                <h3
                  className="text-lg font-extrabold text-white mb-2"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Growth Over Time
                </h3>
                <p
                  className="text-white/40 text-sm mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Hover over the chart to see yearly breakdowns
                </p>
                <GrowthChart data={data} />
              </div>

              {/* Year-by-year table */}
              <div className="bg-[#151515] border border-white/5 rounded-xl p-6 sm:p-8 mt-6">
                <h3
                  className="text-lg font-extrabold text-white mb-4"
                  style={{ fontFamily: "'Sen', sans-serif" }}
                >
                  Year-by-Year Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-white/40 font-medium py-3 pr-4">
                          Year
                        </th>
                        <th className="text-right text-white/40 font-medium py-3 px-4">
                          Balance
                        </th>
                        <th className="text-right text-white/40 font-medium py-3 px-4">
                          Contributions
                        </th>
                        <th className="text-right text-white/40 font-medium py-3 pl-4">
                          Interest
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((d) => (
                        <tr
                          key={d.year}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="text-white/60 py-3 pr-4">{d.year}</td>
                          <td className="text-right text-[#c7ab77] font-semibold py-3 px-4">
                            {formatFullCurrency(d.balance)}
                          </td>
                          <td className="text-right text-white/50 py-3 px-4">
                            {formatFullCurrency(d.totalContributions)}
                          </td>
                          <td className="text-right text-emerald-400/80 py-3 pl-4">
                            {formatFullCurrency(d.totalInterest)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vlad Teaching Section ─── */}
      <section className="py-24 bg-[#faf9f6]">
        <div
          ref={educationSection.ref}
          className={`max-w-[1320px] mx-auto px-6 lg:px-8 transition-all duration-700 ${
            educationSection.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 border border-[#c7ab77]/20 rounded-xl" />
              <img
                src={VLAD_TEACHING}
                alt="Vlad Tayman teaching compound interest growth in a wealth management classroom"
                className="w-full rounded-xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#111]/90 backdrop-blur-sm rounded-lg p-4 border border-[#c7ab77]/20">
                <p
                  className="text-[#c7ab77] text-xs font-bold tracking-wide uppercase mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Vlad Tayman
                </p>
                <p
                  className="text-white/70 text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Founder & CEO, Trader Foundation
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p
                className="text-[0.75rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Why Compound Interest Matters
              </p>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-[#111] leading-tight"
                style={{ fontFamily: "'Sen', sans-serif" }}
              >
                The Power of{' '}
                <span className="text-[#c7ab77]">Patience & Discipline</span>
              </h2>
              <div className="w-16 h-[2px] bg-[#c7ab77]" />

              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                &ldquo;Most people underestimate what consistent, disciplined
                investing can do over time. They chase quick wins and miss the
                real wealth-building engine: compound interest. When your returns
                start earning returns, that is when everything changes.&rdquo;
              </p>
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                At Trader Foundation, we teach you how to combine the power of
                compound growth with smart options strategies. Our students learn
                to generate consistent income from the market, then reinvest
                those gains to accelerate their wealth-building journey.
              </p>
              <p
                className="text-[#444] text-base leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Use the calculator above to see what your financial future could
                look like. Then take the next step and learn the strategies that
                can help you get there.
              </p>

              <a
                href="https://start.traderfoundation.co/trade"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#c7ab77] text-[#111] text-[0.85rem] font-bold tracking-wide rounded-sm transition-all duration-300 hover:bg-[#b89a66] hover:shadow-[0_8px_30px_rgba(199,171,119,0.3)]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Watch The Masterclass
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
