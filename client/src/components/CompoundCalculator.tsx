/*
 * CompoundCalculator - Reusable compound interest calculator widget
 * Can be embedded on any page (homepage, Investing 101, etc.)
 * Design: Dark panel with gold accents, matching Trader Foundation brand
 */

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, Info } from 'lucide-react';

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
      const monthsInPeriod = 12 / periodsPerYear;
      balance += monthlyContribution * monthsInPeriod;
      totalContributions += monthlyContribution * monthsInPeriod;
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

/* ── Mini Chart ── */
function MiniChart({ data }: { data: YearData[] }) {
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 35, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxBalance = Math.max(...data.map((d) => d.balance), 1);
  const yMax = maxBalance * 1.1;

  const getX = (i: number) =>
    padding.left + (i / (data.length - 1 || 1)) * innerWidth;
  const getY = (val: number) =>
    padding.top + innerHeight - (val / yMax) * innerHeight;

  const balancePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.balance)}`)
    .join(' ');
  const contributionsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.totalContributions)}`)
    .join(' ');
  const balanceArea =
    balancePath +
    ` L ${getX(data.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => (yMax / yTicks) * i);

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
      {yTickValues.map((val, i) => (
        <g key={i}>
          <line
            x1={padding.left} y1={getY(val)}
            x2={chartWidth - padding.right} y2={getY(val)}
            stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4"
          />
          <text x={padding.left - 8} y={getY(val) + 4} textAnchor="end"
            fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'DM Sans', sans-serif">
            {formatCurrency(val)}
          </text>
        </g>
      ))}
      {data.filter((_, i) => i === 0 || i === data.length - 1 || (i + 1) % Math.ceil(data.length / 6) === 0)
        .map((d) => {
          const i = data.indexOf(d);
          return (
            <text key={d.year} x={getX(i)} y={chartHeight - 6} textAnchor="middle"
              fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="'DM Sans', sans-serif">
              Yr {d.year}
            </text>
          );
        })}
      <defs>
        <linearGradient id="miniBalanceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c7ab77" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#c7ab77" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={balanceArea} fill="url(#miniBalanceGrad)" />
      <path d={contributionsPath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5 3" />
      <path d={balancePath} fill="none" stroke="#c7ab77" strokeWidth="2" strokeLinecap="round" />
      {/* End dot */}
      <circle cx={getX(data.length - 1)} cy={getY(data[data.length - 1].balance)} r="4" fill="#c7ab77" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

/* ── Input Component ── */
function CalcInput({
  label, value, onChange, prefix, suffix, icon: Icon, min = 0, max, step = 1, helpText,
}: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; icon: React.ElementType;
  min?: number; max?: number; step?: number; helpText?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-white/70"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Icon size={12} className="text-[#c7ab77]" />
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>{prefix}</span>
        )}
        <input
          type="number" value={value}
          onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(v); }}
          min={min} max={max} step={step}
          className={`w-full bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-xs py-2.5 focus:outline-none focus:border-[#c7ab77]/50 focus:ring-1 focus:ring-[#c7ab77]/20 transition-all ${prefix ? 'pl-7 pr-3' : 'pl-3 pr-3'} ${suffix ? 'pr-9' : ''}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>{suffix}</span>
        )}
      </div>
      {helpText && (
        <p className="text-white/25 text-[0.65rem] flex items-center gap-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Info size={8} />{helpText}
        </p>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(20);
  const [compounding, setCompounding] = useState(12);

  const data = useMemo(
    () => calculateCompoundInterest(principal, monthlyContribution, annualRate, years, compounding),
    [principal, monthlyContribution, annualRate, years, compounding]
  );

  const finalData = data[data.length - 1];
  const totalContributed = finalData?.totalContributions ?? principal;
  const totalInterest = finalData?.totalInterest ?? 0;
  const finalBalance = finalData?.balance ?? principal;

  return (
    <section className="py-16 bg-[#111]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-[#c7ab77] mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Financial Tools
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight"
            style={{ fontFamily: "'Sen', sans-serif" }}>
            Calculate Your <span className="text-[#c7ab77]">Compound Growth</span>
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            See how consistent investing can grow your wealth exponentially over time.
          </p>
        </div>

        {/* Calculator grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Inputs */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-white mb-1"
              style={{ fontFamily: "'Sen', sans-serif" }}>
              Your Investment Details
            </h3>
            <div className="w-8 h-[2px] bg-[#c7ab77] mb-3" />

            <CalcInput label="Initial Investment" value={principal} onChange={setPrincipal}
              prefix="$" icon={DollarSign} min={0} step={1000} helpText="The amount you start with" />
            <CalcInput label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution}
              prefix="$" icon={DollarSign} min={0} step={100} helpText="Amount added each month" />
            <CalcInput label="Annual Interest Rate" value={annualRate} onChange={setAnnualRate}
              suffix="%" icon={Percent} min={0} max={50} step={0.5} helpText="Expected yearly return" />
            <CalcInput label="Time Period" value={years} onChange={setYears}
              suffix="yrs" icon={Calendar} min={1} max={50} step={1} helpText="How long you plan to invest" />

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-white/70"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <TrendingUp size={12} className="text-[#c7ab77]" />
                Compounding Frequency
              </label>
              <select value={compounding} onChange={(e) => setCompounding(parseInt(e.target.value))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-xs py-2.5 px-3 focus:outline-none focus:border-[#c7ab77]/50 focus:ring-1 focus:ring-[#c7ab77]/20 transition-all appearance-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <option value={1}>Annually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={365}>Daily</option>
              </select>
            </div>
          </div>

          {/* Right - Results + Chart */}
          <div className="space-y-5">
            {/* Results */}
            <div className="bg-[#151515] border border-[#c7ab77]/20 rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-extrabold text-white mb-3"
                style={{ fontFamily: "'Sen', sans-serif" }}>
                Projected Results
              </h3>
              <div className="w-8 h-[2px] bg-[#c7ab77] mb-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Final Balance</span>
                  <span className="text-[#c7ab77] text-lg font-extrabold" style={{ fontFamily: "'Sen', sans-serif" }}>
                    {formatFullCurrency(finalBalance)}
                  </span>
                </div>
                <div className="h-[1px] bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total Contributed</span>
                  <span className="text-white text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatFullCurrency(totalContributed)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Interest Earned</span>
                  <span className="text-emerald-400 text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {formatFullCurrency(totalInterest)}
                  </span>
                </div>
                <div className="h-[1px] bg-white/5" />
                {/* Bar */}
                <div>
                  <div className="flex justify-between text-[0.6rem] text-white/40 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span>{((totalContributed / finalBalance) * 100).toFixed(1)}% contributed</span>
                    <span>{((totalInterest / finalBalance) * 100).toFixed(1)}% interest</span>
                  </div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden flex">
                    <div className="h-full bg-white/20 transition-all duration-700"
                      style={{ width: `${(totalContributed / finalBalance) * 100}%` }} />
                    <div className="h-full bg-[#c7ab77] transition-all duration-700"
                      style={{ width: `${(totalInterest / finalBalance) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#151515] border border-white/5 rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-extrabold text-white mb-1"
                style={{ fontFamily: "'Sen', sans-serif" }}>
                Growth Over Time
              </h3>
              <MiniChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
