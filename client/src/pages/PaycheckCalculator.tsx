/*
 * Paycheck Collector Calculator, Trader Foundation Academy
 * Shows how an account grows when every Paycheck Collector premium is left in,
 * and what happens when a fixed amount is taken out each month.
 * Design: near-monochrome ivory page, Inter, brand gold as the rare accent.
 */

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const WEBINAR_URL = "https://live.traderfoundation.com/";
const GOLD = "#c7ab77";
const GOLD_TEXT = "#876b38";
const GREEN = "#3e7b58";
const MUTED = "#6b6658";
const LINE = "#e6e1d3";

/* ── Formatting ── */
const usd = (n: number, digits = 0) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const shortUsd = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e9) return `$${(n / 1e9).toFixed(a >= 1e10 ? 0 : 1)}B`;
  if (a >= 1e6) return `$${(n / 1e6).toFixed(a >= 1e7 ? 0 : 1)}M`;
  if (a >= 1e4) return `$${Math.round(n / 1e3)}K`;
  if (a >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${Math.round(n)}`;
};

const toNumber = (s: string) => {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

/* ── Math ── */
interface Inputs {
  start: number;
  rate: number; // monthly, as a fraction
  months: number;
  withdraw: number;
  withdrawFrom: number;
  deposit: number;
  fees: number;
}

interface MonthRow {
  month: number;
  start: number;
  premium: number;
  withdrawn: number;
  deposit: number;
  end: number;
  putIn: number;
}

function simulate(p: Inputs, takeOut: boolean) {
  let balance = p.start;
  let putIn = p.start;
  let tookHome = 0;
  let emptyMonth = 0;
  const rows: MonthRow[] = [];
  for (let m = 1; m <= p.months; m++) {
    const s = balance;
    const premium = s > 0 ? s * p.rate : 0;
    const available = Math.max(0, s + premium - p.fees + p.deposit);
    const withdrawn = takeOut && m >= p.withdrawFrom ? Math.min(p.withdraw, available) : 0;
    balance = available - withdrawn;
    putIn += p.deposit;
    tookHome += withdrawn;
    if (takeOut && balance <= 0 && s > 0 && !emptyMonth) emptyMonth = m;
    rows.push({ month: m, start: s, premium, withdrawn, deposit: p.deposit, end: balance, putIn });
  }
  return { rows, end: balance, tookHome, putIn, emptyMonth };
}

/* ── Small UI pieces ── */
function Chips({
  options,
  value,
  onPick,
}: {
  options: { label: string; value: number }[];
  value: number;
  onPick: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.label}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(o.value)}
            className={`rounded-full border px-3 py-1 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#876b38] ${
              on
                ? "border-[#111] bg-[#111] text-white"
                : "border-[#e6e1d3] bg-white text-[#111] hover:border-[#c7ab77]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  hint,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#6b6658]">
        {label}
      </label>
      <div className="relative">
        {!suffix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-[#6b6658]">
            $
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            const n = toNumber(value);
            onChange(suffix ? String(n) : n.toLocaleString("en-US", { maximumFractionDigits: 2 }));
          }}
          className={`w-full rounded-md border border-[#e6e1d3] bg-[#faf9f6] py-2.5 text-xl font-semibold tabular-nums text-[#111] focus:border-[#876b38] focus:outline-none focus:ring-2 focus:ring-[#c7ab77]/40 ${
            suffix ? "pl-3 pr-8" : "pl-7 pr-3"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-[#6b6658]">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[12.5px] text-[#6b6658]">{hint}</p>}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  dark,
}: {
  label: string;
  value: string;
  sub: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border p-5 ${
        dark ? "border-[#111] bg-[#111] text-white" : "border-[#e6e1d3] bg-white text-[#111]"
      }`}
    >
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
          dark ? "text-[#c7ab77]" : "text-[#6b6658]"
        }`}
      >
        {label}
      </p>
      <p className="mt-1.5 break-words text-3xl font-bold tabular-nums md:text-[2.1rem]">{value}</p>
      <p className={`mt-1 text-[13px] ${dark ? "text-white/65" : "text-[#6b6658]"}`}>{sub}</p>
    </div>
  );
}

/* ── Page ── */
export default function PaycheckCalculator() {
  const [start, setStart] = useState("10,000");
  const [rate, setRate] = useState("5");
  const [months, setMonths] = useState(36);
  const [withdraw, setWithdraw] = useState("1,000");
  const [withdrawFrom, setWithdrawFrom] = useState("19");
  const [deposit, setDeposit] = useState("0");
  const [fees, setFees] = useState("0");

  const p: Inputs = {
    start: toNumber(start),
    rate: toNumber(rate) / 100,
    months,
    withdraw: toNumber(withdraw),
    withdrawFrom: Math.max(1, Math.round(toNumber(withdrawFrom)) || 1),
    deposit: toNumber(deposit),
    fees: toNumber(fees),
  };

  const alone = useMemo(() => simulate(p, false), [p.start, p.rate, p.months, p.deposit, p.fees]);
  const withOut = useMemo(
    () => simulate(p, true),
    [p.start, p.rate, p.months, p.deposit, p.fees, p.withdraw, p.withdrawFrom],
  );

  const chartData = useMemo(
    () => [
      { month: 0, alone: p.start, withOut: p.start, putIn: p.start },
      ...alone.rows.map((r, i) => ({
        month: r.month,
        alone: r.end,
        withOut: withOut.rows[i].end,
        putIn: r.putIn,
      })),
    ],
    [alone, withOut, p.start],
  );

  const firstPremium = p.start * p.rate;
  const lastPremium = alone.rows[alone.rows.length - 1]?.premium ?? 0;
  const ratePct = Math.round(p.rate * 1000) / 10;
  const startRow = withOut.rows[Math.min(p.months, p.withdrawFrom) - 1];

  let warning = "";
  if (withOut.emptyMonth) {
    warning = `Taking ${usd(p.withdraw)} a month empties this account in month ${withOut.emptyMonth}. Try a smaller amount, or start taking it out later.`;
  } else if (p.withdraw > 0 && p.withdrawFrom <= p.months && startRow && startRow.premium < p.withdraw) {
    warning = `When you start, ${usd(p.withdraw)} is more than the account earns in a month (${usd(startRow.premium)}), so the balance shrinks. Start later or take out less to keep it growing.`;
  }

  const tickStep = months <= 24 ? 6 : months <= 60 ? 12 : 24;
  const ticks = Array.from({ length: Math.floor(months / tickStep) + 1 }, (_, i) => i * tickStep);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#111]">
      <SEO
        title="Paycheck Collector Calculator"
        description="See how an account can grow when every Paycheck Collector premium goes back to work, and what happens when you take money out each month."
        path="/paycheck-calculator"
      />
      <Navigation />

      <main className="mx-auto max-w-[1240px] px-5 pb-20 pt-32 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#e6e1d3] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#876b38]">
              The Paycheck Collector
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              What if you left it alone?
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[#6b6658]">
            Pick a starting amount and a monthly return. See what the account looks like when every
            paycheck goes back to work, and what happens when you take some out.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* Inputs */}
          <section
            aria-label="Your numbers"
            className="flex min-w-0 flex-col gap-5 self-start rounded-lg border border-[#e6e1d3] bg-white p-6"
          >
            <div className="flex flex-col gap-2">
              <MoneyField id="pc-start" label="Starting amount" value={start} onChange={setStart} />
              <Chips
                value={p.start}
                onPick={(v) => setStart(v.toLocaleString("en-US"))}
                options={[5000, 10000, 15000, 25000, 50000].map((v) => ({
                  label: `$${v / 1000}K`,
                  value: v,
                }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <MoneyField id="pc-rate" label="Monthly return" value={rate} onChange={setRate} suffix="%" />
              <Chips
                value={ratePct}
                onPick={(v) => setRate(String(v))}
                options={[2, 3, 5, 8, 10].map((v) => ({ label: `${v}%`, value: v }))}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="pc-months" className="text-[13px] font-semibold text-[#6b6658]">
                How long: {months} months{months % 12 === 0 ? ` (${months / 12} yr)` : ""}
              </label>
              <input
                id="pc-months"
                type="range"
                min={6}
                max={120}
                step={6}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-[#876b38]"
              />
              <Chips
                value={months}
                onPick={setMonths}
                options={[
                  { label: "1 yr", value: 12 },
                  { label: "2 yr", value: 24 },
                  { label: "3 yr", value: 36 },
                  { label: "5 yr", value: 60 },
                  { label: "10 yr", value: 120 },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-dashed border-[#e6e1d3] pt-5">
              <h2 className="text-lg font-bold">Taking money out</h2>
              <MoneyField
                id="pc-withdraw"
                label="Take out each month"
                value={withdraw}
                onChange={setWithdraw}
                hint="Set it to $0 to see the account untouched."
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pc-from" className="text-[13px] font-semibold text-[#6b6658]">
                  Starting in month
                </label>
                <input
                  id="pc-from"
                  type="number"
                  min={1}
                  max={120}
                  value={withdrawFrom}
                  onChange={(e) => setWithdrawFrom(e.target.value)}
                  className="w-full rounded-md border border-[#e6e1d3] bg-[#faf9f6] px-3 py-2.5 text-xl font-semibold tabular-nums focus:border-[#876b38] focus:outline-none focus:ring-2 focus:ring-[#c7ab77]/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-dashed border-[#e6e1d3] pt-5">
              <h2 className="text-lg font-bold">Optional</h2>
              <MoneyField id="pc-deposit" label="Add each month" value={deposit} onChange={setDeposit} />
              <MoneyField
                id="pc-fees"
                label="Commissions and fees each month"
                value={fees}
                onChange={setFees}
              />
            </div>
          </section>

          {/* Results */}
          <section aria-live="polite" className="flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat
                dark
                label="Left alone"
                value={usd(alone.end)}
                sub={`after ${months} months, from ${usd(alone.putIn)} put in`}
              />
              <Stat
                label="With money taken out"
                value={usd(withOut.end)}
                sub={
                  p.withdraw > 0
                    ? `taking ${usd(p.withdraw)} a month from month ${p.withdrawFrom}`
                    : "nothing taken out"
                }
              />
              <Stat
                label="You took home"
                value={usd(withOut.tookHome)}
                sub={p.withdraw > 0 ? "in your pocket, and the account is still working" : "set a monthly amount to see this"}
              />
            </div>

            <p className="text-lg leading-relaxed md:text-xl">
              Your first paycheck is about{" "}
              <strong className="text-[#876b38]">{usd(firstPremium)}</strong>. Leave every paycheck in,
              and by month {months} one month of premium is about{" "}
              <strong className="text-[#876b38]">{usd(lastPremium)}</strong>. That&rsquo;s like{" "}
              <strong className="text-[#876b38]">{usd(lastPremium / 160, 2)} an hour</strong> on a
              40-hour week, from money that was sitting in the bank.
            </p>

            {warning && (
              <div className="rounded-md border-l-4 border-[#b4473e] bg-[#b4473e]/10 px-4 py-3 text-[14px]">
                {warning}
              </div>
            )}

            <div className="rounded-lg border border-[#e6e1d3] bg-white p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap gap-4 text-[13px] text-[#6b6658]">
                <span className="inline-flex items-center gap-2">
                  <i className="inline-block h-[3px] w-5 rounded" style={{ background: GOLD }} /> Left alone
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="inline-block h-[3px] w-5 rounded" style={{ background: GREEN }} /> With money
                  taken out
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="inline-block h-[2px] w-5 rounded" style={{ background: MUTED }} /> What you put in
                </span>
              </div>
              <div className="h-[300px] w-full sm:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={LINE} vertical={false} />
                    <XAxis
                      dataKey="month"
                      type="number"
                      domain={[0, months]}
                      ticks={ticks}
                      tickFormatter={(m: number) => (m === 0 ? "Start" : m % 12 === 0 ? `Yr ${m / 12}` : `Mo ${m}`)}
                      tick={{ fill: MUTED, fontSize: 12 }}
                      axisLine={{ stroke: LINE }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={shortUsd}
                      tick={{ fill: MUTED, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      width={56}
                    />
                    <Tooltip
                      formatter={(v: number, name: string) => [
                        usd(v),
                        name === "alone" ? "Left alone" : name === "withOut" ? "With money out" : "Put in",
                      ]}
                      labelFormatter={(m: number) => (m === 0 ? "Start" : `Month ${m}`)}
                      contentStyle={{ borderRadius: 8, borderColor: LINE, fontSize: 13 }}
                    />
                    <Line type="monotone" dataKey="putIn" stroke={MUTED} strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="withOut" stroke={GREEN} strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="alone" stroke={GOLD} strokeWidth={3.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.2em] text-[#876b38]">
                Same money, different monthly returns
              </p>
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                {[3, 5, 8, 10].map((v) => {
                  const end = simulate({ ...p, rate: v / 100 }, false).end;
                  const on = v === ratePct;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setRate(String(v))}
                      className={`min-w-0 rounded-lg border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#876b38] ${
                        on ? "border-[#c7ab77] bg-[#c7ab77]/15" : "border-[#e6e1d3] bg-white hover:border-[#c7ab77]"
                      }`}
                    >
                      <span className="block text-[13px] font-bold text-[#876b38]">{v}% a month</span>
                      <span className="block break-words text-2xl font-bold tabular-nums">{shortUsd(end)}</span>
                      <span className="block text-[12px] text-[#6b6658]">left alone, {months} mo</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Table */}
        <section className="mt-12 flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-bold">Month by month</h2>
            <p className="text-[13px] text-[#6b6658]">
              Shaded rows mark each year. Per hour is that month&rsquo;s premium over a 160-hour work month.
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[#e6e1d3] bg-white">
            <table className="w-full min-w-[760px] border-collapse text-[14px] tabular-nums">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.12em] text-[#6b6658]">
                  {["Month", "Start", "Premium collected", "Taken out", "Added", "End of month", "Per hour", "Left alone"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`border-b border-[#e6e1d3] px-3 py-2.5 font-semibold ${i === 0 ? "text-left" : "text-right"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {withOut.rows.map((r, i) => {
                  const year = r.month % 12 === 0;
                  return (
                    <tr key={r.month} className={year ? "bg-[#c7ab77]/15 font-semibold" : ""}>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-left">
                        {year ? `Year ${r.month / 12}` : `Month ${r.month}`}
                      </td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right">{usd(r.start, 2)}</td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right text-[#3e7b58]">+{usd(r.premium, 2)}</td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right text-[#b4473e]">
                        {r.withdrawn ? `-${usd(r.withdrawn, 2)}` : "-"}
                      </td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right">
                        {r.deposit ? `+${usd(r.deposit, 2)}` : "-"}
                      </td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right font-semibold">{usd(r.end, 2)}</td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right">{usd(r.premium / 160, 2)}</td>
                      <td className="border-b border-[#e6e1d3] px-3 py-2 text-right">{usd(alone.rows[i].end, 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 flex flex-col items-start gap-4 rounded-lg bg-[#111] p-8 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">See how the Paycheck Collector works.</h2>
            <p className="mt-1 text-white/65">Watch the live webinar and see a real trade placed.</p>
          </div>
          <a
            href={WEBINAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-sm bg-[#c7ab77] px-7 py-3.5 text-[0.9rem] font-bold text-[#111] transition-colors hover:bg-[#b89a66]"
          >
            Live Webinar
          </a>
        </section>

        <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-[#6b6658]">
          This calculator uses the same return every month and assumes no losing months. Real trading has
          losing trades and losing months. Disclaimer: This material is for educational purposes only and
          does not constitute financial advice. All investments carry risk, including the potential loss of
          principal. Past performance does not guarantee future results. Always consult with a qualified
          financial advisor before making investment decisions. See our{" "}
          <a href="/earnings-disclaimer" className="underline">
            earnings disclaimer
          </a>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
