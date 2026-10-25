// ============================================================
// PLAID BROKERAGE INTEGRATION
// Connect Fidelity, Schwab, Robinhood, etc. to auto-import holdings
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

interface ImportedHolding {
  symbol: string;
  shares: number;
  costBasis: number;
  currentValue: number;
  institutionPrice: number;
}

interface PlaidAccount {
  name: string;
  type: string;
  balance: number;
}

interface PlaidConnectProps {
  onImport?: (holdings: { symbol: string; shares: number; avgCost: number }[]) => void;
}

const SUPPORTED_BROKERAGES = [
  { name: "Fidelity", icon: "🏦" },
  { name: "Charles Schwab", icon: "🏛️" },
  { name: "Robinhood", icon: "🪶" },
  { name: "TD Ameritrade", icon: "📊" },
  { name: "E*TRADE", icon: "💹" },
  { name: "Interactive Brokers", icon: "🌐" },
  { name: "Vanguard", icon: "⚓" },
  { name: "Webull", icon: "📈" },
];

export function PlaidConnect({ onImport }: PlaidConnectProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<ImportedHolding[]>([]);
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plaidLoaded, setPlaidLoaded] = useState(false);

  // Check if Plaid is configured
  const { data: plaidStatus } = trpc.plaid.status.useQuery();
  const createLinkToken = trpc.plaid.createLinkToken.useMutation();
  const exchangeToken = trpc.plaid.exchangeToken.useMutation();

  // Load Plaid Link SDK
  useEffect(() => {
    if (plaidLoaded) return;
    const script = document.createElement("script");
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = () => setPlaidLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [plaidLoaded]);

  // Open Plaid Link
  const openPlaidLink = useCallback(async () => {
    if (!plaidLoaded) {
      setError("Plaid Link is still loading. Please try again.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const { linkToken } = await createLinkToken.mutateAsync();

      const handler = (window as any).Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken: string, metadata: any) => {
          try {
            const result = await exchangeToken.mutateAsync({ publicToken });
            setAccessToken(result.accessToken);
            setIsConnected(true);
          } catch (err) {
            setError("Failed to connect brokerage. Please try again.");
          }
          setIsConnecting(false);
        },
        onExit: (err: any) => {
          if (err) {
            setError("Connection was cancelled or failed.");
          }
          setIsConnecting(false);
        },
        onEvent: (eventName: string) => {
          console.log("[Plaid Event]", eventName);
        },
      });

      handler.open();
    } catch (err) {
      setError("Failed to initialize Plaid Link. Please try again.");
      setIsConnecting(false);
    }
  }, [plaidLoaded, createLinkToken, exchangeToken]);

  // Fetch holdings after connection
  const { data: holdingsData, isLoading: holdingsLoading } = trpc.plaid.getHoldings.useQuery(
    { accessToken: accessToken! },
    { enabled: !!accessToken }
  );

  useEffect(() => {
    if (holdingsData) {
      setHoldings(holdingsData.holdings);
      setAccounts(holdingsData.accounts);
    }
  }, [holdingsData]);

  // Import holdings to portfolio
  const handleImport = () => {
    if (onImport && holdings.length > 0) {
      onImport(holdings.map(h => ({
        symbol: h.symbol,
        shares: h.shares,
        avgCost: h.shares > 0 ? h.costBasis / h.shares : 0,
      })));
    }
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalGain = totalValue - totalCost;

  // Not configured state
  if (plaidStatus && !plaidStatus.configured) {
    return (
      <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-lg">🔗</div>
          <div>
            <h3 className="text-sm font-mono font-bold text-[#D4AF37]">BROKERAGE SYNC</h3>
            <p className="text-[10px] font-mono text-[#666]">Connect your brokerage to auto-import holdings</p>
          </div>
        </div>
        <div className="bg-[#111] rounded-lg border border-[#333] p-4 text-center">
          <p className="text-xs font-mono text-[#888] mb-2">Plaid integration is not yet configured.</p>
          <p className="text-[10px] font-mono text-[#555]">
            Contact the admin to add PLAID_CLIENT_ID and PLAID_SECRET to enable brokerage connections.
          </p>
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-mono text-[#555] mb-2">SUPPORTED BROKERAGES:</p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_BROKERAGES.map(b => (
              <span key={b.name} className="px-2 py-1 bg-[#111] border border-[#1A1A1A] rounded text-[9px] font-mono text-[#666]">
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-lg">🔗</div>
            <div>
              <h3 className="text-sm font-mono font-bold text-[#D4AF37]">BROKERAGE SYNC</h3>
              <p className="text-[10px] font-mono text-[#666]">
                {isConnected ? "Connected — holdings synced" : "Connect your brokerage to auto-import"}
              </p>
            </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-green-400">CONNECTED</span>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            {/* Supported Brokerages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_BROKERAGES.map(b => (
                <div key={b.name} className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#1A1A1A] rounded">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-[10px] font-mono text-[#888]">{b.name}</span>
                </div>
              ))}
            </div>

            {/* Connect Button */}
            <button
              onClick={openPlaidLink}
              disabled={isConnecting || !plaidLoaded}
              className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg font-mono text-sm text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wider font-semibold"
            >
              {isConnecting ? "CONNECTING..." : !plaidLoaded ? "LOADING PLAID..." : "CONNECT BROKERAGE"}
            </button>

            <p className="text-[9px] font-mono text-[#444] text-center">
              Secured by Plaid — bank-level encryption. We never see your login credentials.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Account Summary */}
            {accounts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {accounts.map((a, i) => (
                  <div key={i} className="bg-[#111] rounded border border-[#1A1A1A] p-3">
                    <span className="text-[9px] font-mono text-[#555]">{a.type.toUpperCase()}</span>
                    <p className="text-xs font-mono text-[#CCC] font-medium">{a.name}</p>
                    <p className="text-sm font-mono font-bold text-[#D4AF37] mt-1">${a.balance.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Portfolio Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111] rounded border border-[#1A1A1A] p-3">
                <span className="text-[9px] font-mono text-[#555]">TOTAL VALUE</span>
                <p className="text-lg font-mono font-bold text-[#E8E0D0]">${totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-[#111] rounded border border-[#1A1A1A] p-3">
                <span className="text-[9px] font-mono text-[#555]">COST BASIS</span>
                <p className="text-lg font-mono font-bold text-[#CCC]">${totalCost.toLocaleString()}</p>
              </div>
              <div className="bg-[#111] rounded border border-[#1A1A1A] p-3">
                <span className="text-[9px] font-mono text-[#555]">TOTAL P&L</span>
                <p className={`text-lg font-mono font-bold ${totalGain >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-950/30 rounded border border-red-500/20">
            <p className="text-[11px] font-mono text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Holdings Table */}
      {holdingsLoading && (
        <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 p-6 text-center">
          <div className="text-[#D4AF37] font-mono text-sm animate-pulse">SYNCING HOLDINGS...</div>
        </div>
      )}

      {holdings.length > 0 && (
        <div className="bg-[#0A0A0A] rounded-lg border border-[#D4AF37]/15 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1A1A1A] flex items-center justify-between">
            <h3 className="text-[11px] font-mono tracking-wider text-[#D4AF37] font-semibold">SYNCED HOLDINGS</h3>
            <span className="text-[10px] font-mono text-[#555]">{holdings.length} POSITIONS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="text-left px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">SYMBOL</th>
                  <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">SHARES</th>
                  <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">PRICE</th>
                  <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">VALUE</th>
                  <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">COST BASIS</th>
                  <th className="text-right px-4 py-2 text-[9px] font-mono text-[#555] font-semibold">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const gain = h.currentValue - h.costBasis;
                  const gainPct = h.costBasis > 0 ? (gain / h.costBasis) * 100 : 0;
                  return (
                    <tr key={i} className="border-b border-[#0D0D0D] hover:bg-[#111] transition-colors">
                      <td className="px-4 py-2.5">
                        <span className="text-xs font-mono font-bold text-[#D4AF37]">{h.symbol}</span>
                      </td>
                      <td className="text-right px-4 py-2.5 text-xs font-mono text-[#CCC]">{h.shares.toFixed(2)}</td>
                      <td className="text-right px-4 py-2.5 text-xs font-mono text-[#CCC]">${h.institutionPrice.toFixed(2)}</td>
                      <td className="text-right px-4 py-2.5 text-xs font-mono text-[#CCC]">${h.currentValue.toLocaleString()}</td>
                      <td className="text-right px-4 py-2.5 text-xs font-mono text-[#888]">${h.costBasis.toLocaleString()}</td>
                      <td className="text-right px-4 py-2.5">
                        <span className={`text-xs font-mono font-bold ${gain >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {gain >= 0 ? "+" : ""}${gain.toLocaleString()} ({gainPct.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Import Button */}
          {onImport && (
            <div className="px-4 py-3 border-t border-[#1A1A1A]">
              <button
                onClick={handleImport}
                className="w-full py-2.5 bg-green-500/10 border border-green-500/30 rounded-lg font-mono text-xs text-green-400 hover:bg-green-500/20 transition-all tracking-wider font-semibold"
              >
                IMPORT {holdings.length} HOLDINGS TO PORTFOLIO SIMULATOR
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
