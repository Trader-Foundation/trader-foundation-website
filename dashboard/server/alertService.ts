// ============================================================
// Alert Service — Monitors market data and sends notifications
// Uses built-in notifyOwner for email/in-app alerts
// Tracks: SSL breaches, volume anomalies, DCA zone triggers
// ============================================================

// import { notifyOwner } from "./_core/notification"; // Notifications disabled
import { fetchStockQuote, INVESTMENT_UNIVERSE, findSupportLevels, fetchMonthlyData, fetchWeeklyData } from "./marketData";

// Track which alerts have been sent to avoid duplicates
const sentAlerts = new Map<string, number>(); // key -> timestamp
const ALERT_COOLDOWN = 4 * 60 * 60 * 1000; // 4 hours between duplicate alerts

function shouldSendAlert(key: string): boolean {
  const lastSent = sentAlerts.get(key);
  if (!lastSent) return true;
  return Date.now() - lastSent > ALERT_COOLDOWN;
}

function markAlertSent(key: string): void {
  sentAlerts.set(key, Date.now());
  // Clean old entries
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  Array.from(sentAlerts.entries()).forEach(([k, v]) => {
    if (v < cutoff) sentAlerts.delete(k);
  });
}

export interface AlertEvent {
  type: "ssl_breach" | "volume_anomaly" | "dca_zone";
  symbol: string;
  company: string;
  message: string;
  severity: "high" | "medium" | "low";
  price: number;
  timestamp: string;
  details: Record<string, any>;
}

// In-memory log of recent alerts for the UI
const recentAlerts: AlertEvent[] = [];
const MAX_RECENT_ALERTS = 50;

export function getRecentAlerts(): AlertEvent[] {
  return [...recentAlerts];
}

function addAlert(alert: AlertEvent): void {
  recentAlerts.unshift(alert);
  if (recentAlerts.length > MAX_RECENT_ALERTS) {
    recentAlerts.pop();
  }
}

// ============================================================
// Volume Anomaly Detection — Institutional Order Flow
// ============================================================
export interface VolumeAnomaly {
  symbol: string;
  company: string;
  currentVolume: number;
  avgVolume: number;
  volumeRatio: number;
  interpretation: string;
  severity: "high" | "medium" | "low";
}

export async function detectVolumeAnomalies(): Promise<VolumeAnomaly[]> {
  const anomalies: VolumeAnomaly[] = [];

  for (const stock of INVESTMENT_UNIVERSE) {
    try {
      const quote = await fetchStockQuote(stock.symbol);
      if (!quote || quote.avgVolume <= 0) continue;

      const ratio = quote.volume / quote.avgVolume;

      if (ratio >= 1.5) {
        let severity: "high" | "medium" | "low" = "low";
        let interpretation = "";

        if (ratio >= 3.0) {
          severity = "high";
          interpretation = `MASSIVE INSTITUTIONAL FLOW — ${stock.symbol} trading at ${ratio.toFixed(1)}x average volume. Wall Street is loading up. This is the kind of activity that precedes major moves.`;
        } else if (ratio >= 2.0) {
          severity = "medium";
          interpretation = `UNUSUAL VOLUME — ${stock.symbol} at ${ratio.toFixed(1)}x average. Institutional order flow detected. Smart money is positioning.`;
        } else {
          severity = "low";
          interpretation = `ELEVATED VOLUME — ${stock.symbol} at ${ratio.toFixed(1)}x average. Above-normal activity — worth monitoring.`;
        }

        anomalies.push({
          symbol: stock.symbol,
          company: stock.company,
          currentVolume: quote.volume,
          avgVolume: quote.avgVolume,
          volumeRatio: Math.round(ratio * 100) / 100,
          interpretation,
          severity,
        });
      }
    } catch {}
  }

  // Sort by volume ratio descending
  anomalies.sort((a, b) => b.volumeRatio - a.volumeRatio);
  return anomalies;
}

// ============================================================
// SSL Breach Detection & Alerts
// ============================================================
export async function checkSSLBreachAlerts(): Promise<AlertEvent[]> {
  const alerts: AlertEvent[] = [];

  for (const stock of INVESTMENT_UNIVERSE) {
    try {
      const [quote, monthly] = await Promise.all([
        fetchStockQuote(stock.symbol),
        fetchMonthlyData(stock.symbol),
      ]);

      if (!quote || !monthly) continue;

      const sslLevels = findSupportLevels(monthly.lows);
      const nearestSSL = sslLevels.filter(l => l < quote.currentPrice * 1.02).pop();

      if (!nearestSSL) continue;

      const distPct = ((quote.currentPrice - nearestSSL) / nearestSSL) * 100;

      // SSL Breached
      if (quote.currentPrice <= nearestSSL) {
        const alertKey = `ssl_breach_${stock.symbol}_${nearestSSL.toFixed(2)}`;
        if (shouldSendAlert(alertKey)) {
          const alert: AlertEvent = {
            type: "ssl_breach",
            symbol: stock.symbol,
            company: stock.company,
            message: `SSL BREACHED — ${stock.symbol} broke below $${nearestSSL.toFixed(2)}. Current: $${quote.currentPrice.toFixed(2)}. Institutional liquidity sweep confirmed.`,
            severity: "high",
            price: quote.currentPrice,
            timestamp: new Date().toISOString(),
            details: { sslLevel: nearestSSL, distPct: Math.round(distPct * 10) / 10 },
          };
          alerts.push(alert);
          addAlert(alert);
          markAlertSent(alertKey);

          // notifyOwner disabled
        }
      }
      // Approaching SSL
      else if (distPct <= 2) {
        const alertKey = `ssl_approach_${stock.symbol}_${nearestSSL.toFixed(2)}`;
        if (shouldSendAlert(alertKey)) {
          const alert: AlertEvent = {
            type: "ssl_breach",
            symbol: stock.symbol,
            company: stock.company,
            message: `APPROACHING SSL — ${stock.symbol} is ${distPct.toFixed(1)}% from SSL at $${nearestSSL.toFixed(2)}. Get ready.`,
            severity: "medium",
            price: quote.currentPrice,
            timestamp: new Date().toISOString(),
            details: { sslLevel: nearestSSL, distPct: Math.round(distPct * 10) / 10 },
          };
          alerts.push(alert);
          addAlert(alert);
          markAlertSent(alertKey);

          // notifyOwner disabled
        }
      }
    } catch (err) {
      console.error(`[Alert] Error checking ${stock.symbol}:`, err);
    }
  }

  return alerts;
}

// ============================================================
// Volume Anomaly Alerts
// ============================================================
export async function checkVolumeAlerts(): Promise<AlertEvent[]> {
  const alerts: AlertEvent[] = [];
  const anomalies = await detectVolumeAnomalies();

  for (const a of anomalies) {
    if (a.volumeRatio < 2.0) continue; // Only alert on 2x+

    const alertKey = `volume_${a.symbol}_${Math.floor(a.volumeRatio)}x`;
    if (!shouldSendAlert(alertKey)) continue;

    const alert: AlertEvent = {
      type: "volume_anomaly",
      symbol: a.symbol,
      company: a.company,
      message: a.interpretation,
      severity: a.severity,
      price: 0,
      timestamp: new Date().toISOString(),
      details: {
        currentVolume: a.currentVolume,
        avgVolume: a.avgVolume,
        volumeRatio: a.volumeRatio,
      },
    };
    alerts.push(alert);
    addAlert(alert);
    markAlertSent(alertKey);

    // notifyOwner disabled
  }

  return alerts;
}

// ============================================================
// Run All Alert Checks
// ============================================================
export async function runAlertScan(): Promise<AlertEvent[]> {
  console.log("[AlertService] Running alert scan...");
  const allAlerts: AlertEvent[] = [];

  try {
    const sslAlerts = await checkSSLBreachAlerts();
    allAlerts.push(...sslAlerts);
  } catch (err) {
    console.error("[AlertService] SSL check error:", err);
  }

  try {
    const volumeAlerts = await checkVolumeAlerts();
    allAlerts.push(...volumeAlerts);
  } catch (err) {
    console.error("[AlertService] Volume check error:", err);
  }

  if (allAlerts.length > 0) {
    console.log(`[AlertService] ${allAlerts.length} alerts triggered`);
  } else {
    console.log("[AlertService] No new alerts");
  }

  return allAlerts;
}

// ============================================================
// Auto-scan interval (runs every 5 minutes)
// ============================================================
let scanInterval: ReturnType<typeof setInterval> | null = null;

export function startAlertScanner(): void {
  if (scanInterval) return;
  console.log("[AlertService] Starting alert scanner (every 5 minutes)");

  // Run immediately on start
  runAlertScan().catch(err => console.error("[AlertService] Initial scan error:", err));

  // Then every 5 minutes
  scanInterval = setInterval(() => {
    runAlertScan().catch(err => console.error("[AlertService] Scan error:", err));
  }, 5 * 60 * 1000);
}

export function stopAlertScanner(): void {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
    console.log("[AlertService] Alert scanner stopped");
  }
}
