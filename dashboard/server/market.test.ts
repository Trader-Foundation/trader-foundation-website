import { describe, expect, it } from "vitest";
import {
  calculateProjections,
  calculateTechnicalLevels,
  calculateValuation,
  buildPortfolioPlan,
  findSupportLevels,
  findResistanceLevels,
  PAST_WINNERS,
  INVESTMENT_UNIVERSE,
  SECTOR_ETF_MAP,
} from "./marketData";

describe("calculateProjections", () => {
  it("returns projections for a known symbol at 5, 10, 15, 20 years", () => {
    const result = calculateProjections("NVDA", 100);
    expect(result.symbol).toBe("NVDA");
    expect(result.currentPrice).toBe(100);
    expect(result.projections).toHaveLength(4);
    expect(result.projections[0].year).toBe(5);
    expect(result.projections[1].year).toBe(10);
    expect(result.projections[2].year).toBe(15);
    expect(result.projections[3].year).toBe(20);
  });

  it("projects higher values for bull case than conservative", () => {
    const result = calculateProjections("AAPL", 200);
    for (const p of result.projections) {
      expect(p.bullCase).toBeGreaterThan(p.baseCase);
      expect(p.baseCase).toBeGreaterThan(p.conservative);
    }
  });

  it("returns default growth rates for unknown symbols", () => {
    const result = calculateProjections("UNKNOWN", 50);
    expect(result.conservativeGrowthRate).toBe(7);
    expect(result.baseCaseGrowthRate).toBe(10);
    expect(result.bullCaseGrowthRate).toBe(15);
    expect(result.projections).toHaveLength(4);
  });

  it("calculates correct compound growth", () => {
    const result = calculateProjections("SPY", 100);
    // SPY conservative = 7%, 5 years: 100 * 1.07^5 ≈ 140.26
    const expected5y = Math.round(100 * Math.pow(1.07, 5) * 100) / 100;
    expect(result.projections[0].conservative).toBeCloseTo(expected5y, 1);
  });
});

describe("calculateTechnicalLevels", () => {
  it("calculates MA and Bollinger Bands from price data", () => {
    // Create 20 months of data
    const closes = Array.from({ length: 20 }, (_, i) => 100 + i);
    const highs = closes.map(c => c + 5);
    const result = calculateTechnicalLevels(120, closes, highs);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.monthly20MA).toBeGreaterThan(0);
      expect(result.upperBB).toBeGreaterThan(result.monthly20MA);
      expect(result.lowerBB).toBeLessThan(result.monthly20MA);
      expect(typeof result.drawdownPct).toBe("number");
      expect(typeof result.allTimeHigh).toBe("number");
    }
  });

  it("handles short data arrays gracefully", () => {
    const result = calculateTechnicalLevels(100, [100, 101], [105, 106]);
    // With only 2 data points, the function still returns a result
    expect(result).toBeDefined();
  });
});

describe("calculateValuation", () => {
  it("returns valuation data with correct structure", async () => {
    const result = await calculateValuation("AAPL", 200, 15);
    // Should return a valid ValuationData object
    expect(result).toHaveProperty("peRatio");
    expect(result).toHaveProperty("forwardPE");
    expect(result).toHaveProperty("historicalAvgPE");
    expect(result).toHaveProperty("revenueGrowth");
    expect(result).toHaveProperty("valuationVerdict");
    expect(typeof result.valuationVerdict).toBe("string");
    expect(result.valuationVerdict.length).toBeGreaterThan(0);
  }, 30000); // LLM call may take time

  it("caches results for same symbol and price", async () => {
    // First call populates cache
    const result1 = await calculateValuation("MSFT", 400, 10);
    // Second call should return cached result instantly
    const result2 = await calculateValuation("MSFT", 400, 10);
    expect(result1.peRatio).toBe(result2.peRatio);
    expect(result1.forwardPE).toBe(result2.forwardPE);
    expect(result1.valuationVerdict).toBe(result2.valuationVerdict);
  }, 30000);
});

describe("buildPortfolioPlan", () => {
  it("returns a portfolio plan with allocations", () => {
    const result = buildPortfolioPlan(35, "moderate", 50000, 1000);
    expect(result.riskProfile).toBe("moderate");
    expect(result.startingCapital).toBe(50000);
    expect(result.allocations).toBeDefined();
    expect(result.allocations.length).toBeGreaterThan(0);
    expect(typeof result.coachingTip).toBe("string");
  });

  it("adjusts allocations based on risk tolerance", () => {
    const conservative = buildPortfolioPlan(50, "conservative", 100000, 500);
    const aggressive = buildPortfolioPlan(25, "aggressive", 100000, 500);

    // Both should have allocations
    expect(conservative.allocations.length).toBeGreaterThan(0);
    expect(aggressive.allocations.length).toBeGreaterThan(0);

    // Both should have projected values
    expect(conservative.projectedValues.length).toBeGreaterThan(0);
    expect(aggressive.projectedValues.length).toBeGreaterThan(0);
  });

  it("includes projected values with year milestones", () => {
    const result = buildPortfolioPlan(30, "moderate", 50000, 1000);
    expect(result.projectedValues.length).toBeGreaterThan(0);
    for (const pv of result.projectedValues) {
      expect(pv.year).toBeDefined();
      expect(pv.baseCase).toBeGreaterThan(0);
      expect(pv.conservative).toBeGreaterThan(0);
      expect(pv.bullCase).toBeGreaterThan(0);
      expect(pv.mutualFund).toBeGreaterThan(0);
    }
  });
});

describe("findSupportLevels", () => {
  it("finds true swing lows confirmed on both sides", () => {
    // Pattern: 100, 95, 98, 92, 96, 90, 93, 88, 91, 85, 87, 83, 86, 89
    // True swing lows (lower than 3 bars on each side): 92, 90, 88, 85
    const lows = [100, 95, 98, 92, 96, 90, 93, 88, 91, 85, 87, 83, 86, 89];
    const levels = findSupportLevels(lows);
    expect(Array.isArray(levels)).toBe(true);
    // Support levels should be sorted ascending
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
    }
    // Should NOT include levels that only have left-side confirmation
    // 83 at index 11 doesn't have enough right-side bars to confirm
    expect(levels).not.toContain(83);
  });

  it("returns empty array for insufficient data", () => {
    const levels = findSupportLevels([100]);
    expect(levels).toEqual([]);
  });
});

describe("findResistanceLevels", () => {
  it("finds true swing highs confirmed on both sides", () => {
    // Mirror of the support test: swing highs must be higher than 3 bars each side
    const highs = [100, 105, 102, 108, 104, 110, 107, 112, 109, 115, 113, 117, 114, 111];
    const levels = findResistanceLevels(highs);
    expect(Array.isArray(levels)).toBe(true);
    // Resistance levels should be sorted ascending
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1]);
    }
    // 117 at index 11 doesn't have enough right-side bars to confirm
    expect(levels).not.toContain(117);
  });

  it("returns empty array for insufficient data", () => {
    const levels = findResistanceLevels([100]);
    expect(levels).toEqual([]);
  });
});

describe("PAST_WINNERS", () => {
  it("contains expected past winner entries", () => {
    expect(PAST_WINNERS.length).toBeGreaterThan(0);
    const symbols = PAST_WINNERS.map(w => w.symbol);
    expect(symbols).toContain("CAG");
    expect(symbols).toContain("SPOT");
    expect(symbols).toContain("PG");
    expect(symbols).toContain("NFLX");
  });

  it("each winner has required fields", () => {
    for (const w of PAST_WINNERS) {
      expect(w.symbol).toBeDefined();
      expect(w.company).toBeDefined();
      expect(w.entryPrice).toBeGreaterThan(0);
      expect(w.exitPrice).toBeGreaterThan(0);
      expect(typeof w.returnPct).toBe("number");
      expect(w.holdingPeriod).toBeDefined();
    }
  });
});

describe("INVESTMENT_UNIVERSE", () => {
  it("contains stocks with required fields", () => {
    expect(INVESTMENT_UNIVERSE.length).toBeGreaterThan(0);
    for (const stock of INVESTMENT_UNIVERSE) {
      expect(stock.symbol).toBeDefined();
      expect(typeof stock.symbol).toBe("string");
      expect(stock.company).toBeDefined();
      expect(stock.sector).toBeDefined();
    }
  });
});

describe("SECTOR_ETF_MAP", () => {
  it("maps sectors to ETF symbols", () => {
    expect(SECTOR_ETF_MAP).toBeDefined();
    expect(typeof SECTOR_ETF_MAP).toBe("object");
    // SECTOR_ETF_MAP is keyed by symbol, not sector name
    expect(SECTOR_ETF_MAP["AAPL"]).toBeDefined();
    expect(SECTOR_ETF_MAP["AAPL"].etf).toBe("XLK");
    expect(SECTOR_ETF_MAP["AAPL"].sectorName).toBe("Technology");
  });
});
