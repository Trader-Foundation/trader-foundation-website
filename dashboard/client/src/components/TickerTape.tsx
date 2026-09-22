// ============================================================
// Ticker Tape — Real-time scrolling market data bar
// Connected to tRPC for live prices
// Smooth infinite scroll animation
// ============================================================

import { trpc } from "@/lib/trpc";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  down: boolean;
}

// Fallback static data while loading
const FALLBACK_TICKERS: TickerItem[] = [
  { symbol: "SPY", price: "---", change: "---%", down: false },
  { symbol: "QQQ", price: "---", change: "---%", down: false },
  { symbol: "DIA", price: "---", change: "---%", down: false },
  { symbol: "IWM", price: "---", change: "---%", down: false },
  { symbol: "AAPL", price: "---", change: "---%", down: false },
  { symbol: "MSFT", price: "---", change: "---%", down: false },
  { symbol: "GOOGL", price: "---", change: "---%", down: false },
  { symbol: "META", price: "---", change: "---%", down: false },
  { symbol: "NVDA", price: "---", change: "---%", down: false },
  { symbol: "AMZN", price: "---", change: "---%", down: false },
  { symbol: "TSLA", price: "---", change: "---%", down: false },
];

export function TickerTape() {
  const { data: quotes } = trpc.market.tickerTapeQuotes.useQuery(undefined, {
    refetchInterval: 30_000, // refresh every 30 seconds
  });

  // Backend already returns { symbol, price (string), change (string), down (boolean) }
  const tickers: TickerItem[] = quotes && quotes.length > 0
    ? (quotes as TickerItem[])
    : FALLBACK_TICKERS;

  const tickerContent = tickers.map((t: TickerItem, i: number) => (
    <span key={i} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 whitespace-nowrap">
      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#D4AF37]">
        {t.symbol}
      </span>
      <span className="text-[10px] sm:text-[11px] font-mono text-[#888] tabular-nums">
        {t.price}
      </span>
      <span
        className={`text-[10px] sm:text-[11px] font-mono font-semibold tabular-nums ${
          t.down ? "text-red-400" : "text-green-400"
        }`}
      >
        {t.down ? "▼" : "▲"} {t.change}
      </span>
      <span className="text-[#1A1A1A] mx-0.5">│</span>
    </span>
  ));

  return (
    <div className="border-b border-[#D4AF37]/10 bg-[#020202] overflow-hidden py-1.5 shrink-0">
      <div className="ticker-tape inline-flex" style={{ width: "max-content" }}>
        {tickerContent}
        {tickerContent}
      </div>
    </div>
  );
}
