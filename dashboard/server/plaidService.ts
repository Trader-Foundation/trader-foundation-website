// ============================================================
// PLAID BROKERAGE INTEGRATION
// Connect to Fidelity, Schwab, TD Ameritrade, Robinhood, etc.
// ============================================================

import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";

// Plaid client setup — uses env vars for credentials
function getPlaidClient(): PlaidApi | null {
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;

  if (!clientId || !secret) {
    console.warn("[Plaid] Missing PLAID_CLIENT_ID or PLAID_SECRET — brokerage sync disabled");
    return null;
  }

  const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox, // Change to 'production' for live
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": clientId,
        "PLAID-SECRET": secret,
      },
    },
  });

  return new PlaidApi(configuration);
}

// Create a link token for the frontend Plaid Link widget
export async function createLinkToken(userId: string): Promise<{ linkToken: string } | null> {
  const client = getPlaidClient();
  if (!client) return null;

  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "TF Elite Terminal",
      products: [Products.Investments],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return { linkToken: response.data.link_token };
  } catch (err) {
    console.error("[Plaid] Failed to create link token:", err);
    return null;
  }
}

// Exchange public token for access token after user completes Plaid Link
export async function exchangePublicToken(publicToken: string): Promise<{ accessToken: string; itemId: string } | null> {
  const client = getPlaidClient();
  if (!client) return null;

  try {
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
    };
  } catch (err) {
    console.error("[Plaid] Failed to exchange public token:", err);
    return null;
  }
}

// Get investment holdings from connected brokerage
export async function getInvestmentHoldings(accessToken: string): Promise<{
  holdings: Array<{
    symbol: string;
    shares: number;
    costBasis: number;
    currentValue: number;
    institutionPrice: number;
  }>;
  accounts: Array<{
    name: string;
    type: string;
    balance: number;
  }>;
} | null> {
  const client = getPlaidClient();
  if (!client) return null;

  try {
    const response = await client.investmentsHoldingsGet({
      access_token: accessToken,
    });

    const holdings = response.data.holdings
      .map((h) => {
        const security = response.data.securities.find(
          (s) => s.security_id === h.security_id
        );
        if (!security?.ticker_symbol) return null;

        return {
          symbol: security.ticker_symbol,
          shares: h.quantity,
          costBasis: h.cost_basis || 0,
          currentValue: h.institution_value || 0,
          institutionPrice: h.institution_price || 0,
        };
      })
      .filter((h): h is NonNullable<typeof h> => h !== null);

    const accounts = response.data.accounts.map((a) => ({
      name: a.name || "Unknown",
      type: a.type || "unknown",
      balance: a.balances.current || 0,
    }));

    return { holdings, accounts };
  } catch (err) {
    console.error("[Plaid] Failed to get holdings:", err);
    return null;
  }
}

// Check if Plaid is configured
export function isPlaidConfigured(): boolean {
  return !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}
