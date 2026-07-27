// ============================================================
// Terminal Header — Trader Foundation branding + real-time market status
// Gold logo, screening window indicator, market pulse
// Connected to tRPC for real-time screening status
// ============================================================

import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

export function TerminalHeader() {
  const { data: status } = trpc.market.screeningStatus.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every minute
  });

  const daysLeft = status?.daysToMonthEnd ?? 0;
  const isMonthlyActive = status?.isMonthlyScreeningActive ?? false;
  const isDailyActive = status?.isDailyScreeningActive ?? true;

  const screeningLabel = isMonthlyActive
    ? "SCREENING ACTIVE"
    : daysLeft <= 10
    ? "APPROACHING"
    : "MONITORING";

  const screeningColor = isMonthlyActive
    ? "text-green-400"
    : daysLeft <= 10
    ? "text-yellow-400"
    : "text-[#888]";

  const screeningDesc = isMonthlyActive
    ? `Monthly screening window OPEN — ${daysLeft} days remaining`
    : `${daysLeft} days to monthly screening window`;

  return (
    <header className="border-b border-[#D4AF37]/20 bg-[#030303] shrink-0">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="text-[8px] sm:text-[10px] font-mono tracking-[0.3em] text-[#D4AF37]/70">
                TRADER
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-[0.15em] text-[#D4AF37]">
                FOUNDATION
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-[#D4AF37]/15 mx-1 sm:mx-2 hidden sm:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono tracking-wider text-[#888]">
              TF ELITE TERMINAL
            </span>
            <span className="text-[10px] font-mono text-[#555]">
              Exclusive to skool.com/tfelite
            </span>
          </div>
        </div>

        {/* Center: Screening Window Status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[#D4AF37]/20 rounded bg-[#0A0A0A]">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isMonthlyActive
                  ? "bg-green-400"
                  : daysLeft <= 10
                  ? "bg-yellow-400"
                  : "bg-[#555]"
              }`}
              animate={
                isMonthlyActive
                  ? { opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={`text-[11px] font-mono font-semibold tracking-wider ${screeningColor}`}>
              {screeningLabel}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#555] hidden lg:inline">
            {screeningDesc}
          </span>
        </div>

        {/* Right: Market Info */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono text-[#666]">MONTH END</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#D4AF37]">
                {daysLeft}D
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-mono text-[#444] hidden sm:inline">
              {isDailyActive ? "Daily screening active" : "Screening starts at T-5"}
            </span>
          </div>
          <div className="h-6 sm:h-8 w-px bg-[#D4AF37]/15" />
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[9px] sm:text-[10px] font-mono text-[#666]">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
