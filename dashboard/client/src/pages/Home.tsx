import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { TerminalHeader } from "@/components/TerminalHeader";
import { TickerTape } from "@/components/TickerTape";
import { LeapScreener } from "@/components/LeapScreener";
import { InvestmentRadar } from "@/components/InvestmentRadar";
import { PortfolioBuilder } from "@/components/PortfolioBuilder";
import { StressTest } from "@/components/StressTest";
import { PlaidConnect } from "@/components/PlaidConnect";
import { ResearchTool } from "@/components/ResearchTool";
import { WallStreetGrid } from "@/components/WallStreetGrid";
import { EliteDeepDive } from "@/components/EliteDeepDive";
import { FreedomCalculator } from "@/components/FreedomCalculator";
import { TerminalChatbot } from "@/components/TerminalChatbot";
import { motion, AnimatePresence } from "framer-motion";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-[10px] font-mono text-[#555] tabular-nums">
      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })} ET
    </span>
  );
}

type TabId = "screener" | "exchange" | "deepdive" | "radar" | "portfolio" | "freedom" | "research";

const tabs: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: "screener",
    label: "SETUP SCREENER",
    shortLabel: "SCREENER",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "exchange",
    label: "WALL STREET EXCHANGE",
    shortLabel: "EXCHANGE",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "deepdive",
    label: "ELITE DEEP DIVE",
    shortLabel: "DEEP DIVE",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: "radar",
    label: "INVESTMENT RADAR — DEPLOY CAPITAL",
    shortLabel: "DEPLOY",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="6" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "PORTFOLIO SIMULATOR",
    shortLabel: "PORTFOLIO",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: "freedom",
    label: "FREEDOM CALCULATOR",
    shortLabel: "FREEDOM",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "research",
    label: "RESEARCH TERMINAL",
    shortLabel: "RESEARCH",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("screener");
  const [deepDiveSymbol, setDeepDiveSymbol] = useState<string | null>(null);
  const [portfolioSubTab, setPortfolioSubTab] = useState<"simulator" | "stress" | "brokerage">("simulator");

  // Navigate to Deep Dive with a specific symbol — callable from any tab
  const navigateToDeepDive = useCallback((symbol: string) => {
    setDeepDiveSymbol(symbol);
    setActiveTab("deepdive");
  }, []);

  // Loading state — terminal boot animation
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-[#D4AF37] font-mono text-sm animate-pulse">INITIALIZING TERMINAL...</div>
          <div className="w-48 h-1 bg-[#111] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#D4AF37] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  // Login gate — exclusive to TF Elite Skool members
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative">
        {/* Grid background */}
        <div
          className="fixed inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 text-center space-y-8 max-w-lg">
          {/* Logo / Brand */}
          <div className="space-y-2">
            <div className="text-[#D4AF37] font-mono text-3xl font-bold tracking-[0.3em]">TF ELITE</div>
            <div className="text-[#D4AF37]/60 font-mono text-xs tracking-[0.5em]">TERMINAL</div>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-[#D4AF37]/30 mx-auto" />

          {/* Access message */}
          <div className="space-y-3">
            <p className="text-[#E8E0D0] font-mono text-sm">
              EXCLUSIVE ACCESS — TF ELITE SKOOL MEMBERS ONLY
            </p>
            <p className="text-[#666] font-mono text-xs leading-relaxed">
              This terminal is restricted to verified members of the Trader Foundation Elite community.
              Sign in with your account to access the Setup Screener (Bounce, SSL & Breakout), Deep Dive Research,
              Investment Radar, Freedom Calculator, and all premium tools.
            </p>
          </div>

          {/* Login button */}
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded font-mono text-sm text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-300 tracking-wider"
          >
            SIGN IN TO ACCESS TERMINAL
          </a>

          {/* Footer */}
          <div className="space-y-1">
            <p className="text-[#444] font-mono text-[10px]">
              Not a member? Join at <span className="text-[#D4AF37]/60">skool.com/tfelite</span>
            </p>
            <p className="text-[#333] font-mono text-[10px]">
              TRADER FOUNDATION ACADEMY — NOT FINANCIAL ADVICE
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#E8E0D0] overflow-hidden relative">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        <div className="scanline" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        <TerminalHeader />
        <TickerTape />

        {/* Tab Navigation */}
        <div className="border-b border-[#D4AF37]/20 bg-[#050505]">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 sm:px-5 py-3 font-mono text-[10px] sm:text-xs tracking-wider transition-all duration-300 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#D4AF37] border-[#D4AF37] bg-[#D4AF37]/5"
                      : "text-[#666] border-transparent hover:text-[#999] hover:border-[#333]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="hidden sm:block">{tab.icon}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                    <span className="md:hidden">{tab.shortLabel}</span>
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                    />
                  )}
                </button>
              ))}
              <div className="ml-auto hidden lg:flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#444]">
                  TRADER FOUNDATION TERMINAL v4.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "screener" && <LeapScreener onDeepDive={navigateToDeepDive} />}
              {activeTab === "exchange" && <WallStreetGrid onDeepDive={navigateToDeepDive} />}
              {activeTab === "deepdive" && <EliteDeepDive initialSymbol={deepDiveSymbol} />}
              {activeTab === "radar" && <InvestmentRadar onDeepDive={navigateToDeepDive} />}
              {activeTab === "portfolio" && (
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-6 space-y-6">
                  {/* Portfolio Sub-Navigation */}
                  <div className="flex items-center gap-2 p-1.5 bg-[#080808] rounded-lg border border-[#D4AF37]/10 w-fit">
                    <button
                      onClick={() => setPortfolioSubTab("simulator")}
                      className={`px-4 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all ${
                        portfolioSubTab === "simulator"
                          ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                          : "text-[#666] hover:text-[#999] border border-transparent"
                      }`}
                    >
                      SIMULATOR
                    </button>
                    <button
                      onClick={() => setPortfolioSubTab("stress")}
                      className={`px-4 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all ${
                        portfolioSubTab === "stress"
                          ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                          : "text-[#666] hover:text-[#999] border border-transparent"
                      }`}
                    >
                      STRESS TEST
                    </button>
                    <button
                      onClick={() => setPortfolioSubTab("brokerage")}
                      className={`px-4 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all ${
                        portfolioSubTab === "brokerage"
                          ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                          : "text-[#666] hover:text-[#999] border border-transparent"
                      }`}
                    >
                      BROKERAGE SYNC
                    </button>
                  </div>
                  {portfolioSubTab === "simulator" && <PortfolioBuilder />}
                  {portfolioSubTab === "stress" && <StressTest />}
                  {portfolioSubTab === "brokerage" && <PlaidConnect />}
                </div>
              )}
              {activeTab === "freedom" && <FreedomCalculator />}
              {activeTab === "research" && <ResearchTool onDeepDive={navigateToDeepDive} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Status Bar */}
        <div className="border-t border-[#D4AF37]/10 bg-[#030303] px-4 sm:px-6 py-1.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <span className="text-[10px] font-mono text-[#444] whitespace-nowrap">
              ◆ TF ELITE — EXCLUSIVE TO SKOOL.COM/TFELITE MEMBERS
            </span>
            <span className="text-[10px] font-mono text-[#333] hidden sm:inline">|</span>
            <span className="text-[10px] font-mono text-[#444] hidden sm:inline whitespace-nowrap">
              NOT FINANCIAL ADVICE — FOR EDUCATIONAL PURPOSES ONLY
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="text-[10px] font-mono text-[#555] hidden sm:inline">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </span>
            <LiveClock />
          </div>
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <TerminalChatbot />
    </div>
  );
}
