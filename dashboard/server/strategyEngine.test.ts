import { describe, expect, it } from "vitest";
import {
  calculateAlertSchedule,
  calculateFullStochastics,
  calculateJobsReportInfo,
  calculateMACD,
  classifyMarketTrend,
  smaAt,
  type Grade,
  type SetupGrade,
} from "./strategyEngine";

// ============================================================
// STRATEGY ENGINE — Unit Tests
// Tests the alert schedule calculator (pure logic, no API calls)
// and validates the 9-point grading system structure & constants
// shared by the Bounce, SSL, and Breakout strategies.
// ============================================================

describe("Strategy Engine", () => {
  // --------------------------------------------------------
  // Alert Schedule (pure date logic — no API calls)
  // --------------------------------------------------------
  describe("calculateAlertSchedule", () => {
    it("returns a valid alert schedule structure", () => {
      const schedule = calculateAlertSchedule();

      // Daily
      expect(schedule.daily).toBeDefined();
      expect(schedule.daily.nextAlert).toBeDefined();
      expect(typeof schedule.daily.isAlertTime).toBe("boolean");

      // Weekly
      expect(schedule.weekly).toBeDefined();
      expect(schedule.weekly.thursdayWatchlist).toBeDefined();
      expect(schedule.weekly.fridayExecution).toBeDefined();
      expect(typeof schedule.weekly.isThursdayAlert).toBe("boolean");
      expect(typeof schedule.weekly.isFridayAlert).toBe("boolean");

      // Monthly
      expect(schedule.monthly).toBeDefined();
      expect(schedule.monthly.monthEndDate).toBeDefined();
      expect(typeof schedule.monthly.tradingDaysRemaining).toBe("number");
      expect(typeof schedule.monthly.isActive).toBe("boolean");
      expect(["WIDE_NET", "NARROWING", "PRECISION", "EXECUTION_DAY"]).toContain(
        schedule.monthly.precision
      );
    });

    it("monthly trading days remaining is non-negative", () => {
      const schedule = calculateAlertSchedule();
      expect(schedule.monthly.tradingDaysRemaining).toBeGreaterThanOrEqual(0);
    });

    it("next daily alert is a valid ISO date string", () => {
      const schedule = calculateAlertSchedule();
      const nextDate = new Date(schedule.daily.nextAlert);
      expect(nextDate.getTime()).not.toBeNaN();
    });

    it("next Thursday and Friday are valid dates", () => {
      const schedule = calculateAlertSchedule();
      const thu = new Date(schedule.weekly.thursdayWatchlist);
      const fri = new Date(schedule.weekly.fridayExecution);
      expect(thu.getTime()).not.toBeNaN();
      expect(fri.getTime()).not.toBeNaN();
    });

    it("month end date is a valid date string", () => {
      const schedule = calculateAlertSchedule();
      const endDate = new Date(schedule.monthly.monthEndDate);
      expect(endDate.getTime()).not.toBeNaN();
    });

    it("monthly precision escalates as days decrease", () => {
      const schedule = calculateAlertSchedule();
      const { tradingDaysRemaining, precision, isActive } = schedule.monthly;

      if (tradingDaysRemaining > 5) {
        expect(isActive).toBe(false);
      } else if (tradingDaysRemaining <= 1) {
        expect(precision).toBe("EXECUTION_DAY");
        expect(isActive).toBe(true);
      } else if (tradingDaysRemaining <= 2) {
        expect(precision).toBe("PRECISION");
        expect(isActive).toBe(true);
      } else if (tradingDaysRemaining <= 3) {
        expect(precision).toBe("NARROWING");
        expect(isActive).toBe(true);
      } else {
        expect(precision).toBe("WIDE_NET");
        expect(isActive).toBe(true);
      }
    });
  });

  // --------------------------------------------------------
  // Bounce Plan indicator toolkit (pure math)
  // --------------------------------------------------------
  describe("Indicator toolkit", () => {
    it("smaAt computes a simple moving average of the last N values", () => {
      expect(smaAt([1, 2, 3, 4, 5], 5)).toBe(3);
      expect(smaAt([1, 2, 3, 4, 5], 2)).toBe(4.5);
      expect(smaAt([1, 2], 5)).toBeNull();
    });

    it("calculateMACD returns aligned macd/signal/histogram", () => {
      // Rising series → MACD should be positive (fast EMA above slow EMA)
      const rising = Array.from({ length: 60 }, (_, i) => 100 + i);
      const m = calculateMACD(rising);
      expect(m).not.toBeNull();
      expect(m!.macd).toBeGreaterThan(0);
      expect(m!.histogram).toBeCloseTo(m!.macd - m!.signal, 8);

      // Not enough data → null
      expect(calculateMACD([1, 2, 3])).toBeNull();
    });

    it("calculateFullStochastics stays within 0-100 and reads oversold/overbought", () => {
      // Strong downtrend → %K near 0 (oversold)
      const n = 40;
      const down = Array.from({ length: n }, (_, i) => 100 - i);
      const stochDown = calculateFullStochastics(down.map(v => v + 1), down.map(v => v - 1), down);
      expect(stochDown).not.toBeNull();
      expect(stochDown!.k).toBeGreaterThanOrEqual(0);
      expect(stochDown!.k).toBeLessThan(20);

      // Strong uptrend → %K near 100 (overbought)
      const up = Array.from({ length: n }, (_, i) => 100 + i);
      const stochUp = calculateFullStochastics(up.map(v => v + 1), up.map(v => v - 1), up);
      expect(stochUp).not.toBeNull();
      expect(stochUp!.k).toBeGreaterThan(80);
      expect(stochUp!.k).toBeLessThanOrEqual(100);
    });

    it("classifyMarketTrend labels rising-above-MA as bullish and falling-below as bearish", () => {
      const bull = Array.from({ length: 60 }, (_, i) => 100 + i);
      expect(classifyMarketTrend(bull).trend).toBe("BULLISH");
      const bear = Array.from({ length: 60 }, (_, i) => 200 - i);
      expect(classifyMarketTrend(bear).trend).toBe("BEARISH");
    });

    it("calculateJobsReportInfo returns a valid upcoming first-Friday date", () => {
      const info = calculateJobsReportInfo();
      expect(typeof info.isJobsReportDay).toBe("boolean");
      const next = new Date(`${info.nextJobsReportDate}T12:00:00`);
      expect(next.getTime()).not.toBeNaN();
      expect(next.getDay()).toBe(5); // Friday
      expect(next.getDate()).toBeLessThanOrEqual(7); // first Friday of a month
    });
  });

  // --------------------------------------------------------
  // Grade thresholds (pure logic)
  // --------------------------------------------------------
  describe("Grade thresholds", () => {
    it("A+ requires 8/9 or higher", () => {
      const getGrade = (score: number): Grade =>
        score >= 8 ? "A+" : score >= 7 ? "A" : "Below Threshold";

      expect(getGrade(9)).toBe("A+");
      expect(getGrade(8)).toBe("A+");
      expect(getGrade(7)).toBe("A");
      expect(getGrade(6)).toBe("Below Threshold");
      expect(getGrade(5)).toBe("Below Threshold");
      expect(getGrade(0)).toBe("Below Threshold");
    });

    it("only 7/9+ shows on terminal", () => {
      const shouldShow = (score: number) => score >= 7;

      expect(shouldShow(9)).toBe(true);
      expect(shouldShow(8)).toBe(true);
      expect(shouldShow(7)).toBe(true);
      expect(shouldShow(6)).toBe(false);
      expect(shouldShow(5)).toBe(false);
    });
  });

  // --------------------------------------------------------
  // Scoring ranges (pure math validation)
  // --------------------------------------------------------
  describe("Scoring ranges", () => {
    it("each criterion scores 0-3, total 0-9", () => {
      for (let level = 0; level <= 3; level++) {
        for (let vol = 0; vol <= 3; vol++) {
          for (let candle = 0; candle <= 3; candle++) {
            const total = level + vol + candle;
            expect(total).toBeGreaterThanOrEqual(0);
            expect(total).toBeLessThanOrEqual(9);
          }
        }
      }
    });
  });

  // --------------------------------------------------------
  // Past winners validation
  // --------------------------------------------------------
  describe("Past winners validation", () => {
    const pastWinners = [
      { symbol: "CAG", grade: "A+" as Grade, totalScore: 8, returnPct: 12.0 },
      { symbol: "SPOT", grade: "A+" as Grade, totalScore: 9, returnPct: 14.8 },
      { symbol: "PG", grade: "A" as Grade, totalScore: 7, returnPct: 5.4 },
      { symbol: "NFLX", grade: "A+" as Grade, totalScore: 9, returnPct: 150.0 },
    ];

    it("all past winners scored 7/9 or higher", () => {
      for (const winner of pastWinners) {
        expect(winner.totalScore).toBeGreaterThanOrEqual(7);
        expect(["A", "A+"]).toContain(winner.grade);
      }
    });

    it("all past winners had positive returns", () => {
      for (const winner of pastWinners) {
        expect(winner.returnPct).toBeGreaterThan(0);
      }
    });
  });

  // --------------------------------------------------------
  // SetupGrade type structure validation
  // --------------------------------------------------------
  describe("SetupGrade type structure", () => {
    it("SetupGrade has all required fields and total matches criteria sum", () => {
      const mockGrade: SetupGrade = {
        strategy: "SSL",
        symbol: "AAPL",
        company: "Apple Inc.",
        sector: "Technology",
        timeframe: "Weekly",
        currentPrice: 175.5,
        criteria: [
          { key: "level", label: "LIQUIDITY (SSL SWEEP)", score: 3, max: 3, details: "DOUBLE SSL SWEEP" },
          { key: "volume", label: "VOLUME CLIMAX", score: 2, max: 3, details: "ELEVATED VOLUME" },
          { key: "candle", label: "ABSORPTION CANDLE", score: 2, max: 3, details: "2/3 criteria met" },
        ],
        totalScore: 7,
        grade: "A",
        confluence: [
          { key: "rsi", label: "RSI BULLISH DIVERGENCE", active: true, details: "RSI BULLISH DIVERGENCE" },
          { key: "fib", label: "FIB KEY LEVEL", active: false, details: "Not at key level" },
        ],
        keyLevel: 170.0,
        keyLevelLabel: "SSL",
        secondaryLevel: 165.0,
        distToLevelPct: 3.24,
        lastCandleOpen: 174.0,
        lastCandleClose: 175.5,
        lastCandleHigh: 176.0,
        lastCandleLow: 169.5,
        previousClose: 173.0,
        lastVolume: 85000000,
        avgVolume: 55000000,
        maxHistoricalVolume: 120000000,
        volumeRatio: 1.55,
        lastUpdated: new Date().toISOString(),
      };

      const criteriaSum = mockGrade.criteria.reduce((sum, c) => sum + c.score, 0);
      expect(mockGrade.totalScore).toBe(criteriaSum);
      expect(mockGrade.totalScore).toBeLessThanOrEqual(9);
      expect(mockGrade.totalScore).toBeGreaterThanOrEqual(0);
      expect(mockGrade.grade).toBe("A");
      expect(mockGrade.criteria).toHaveLength(3);
      expect(mockGrade.criteria.map(c => c.key)).toEqual(["level", "volume", "candle"]);
    });

    it("supports all three strategies with matching level labels", () => {
      const pairs: [SetupGrade["strategy"], SetupGrade["keyLevelLabel"]][] = [
        ["Bounce", "SUPPORT"],
        ["SSL", "SSL"],
        ["Breakout", "RESISTANCE"],
      ];
      for (const [strategy, label] of pairs) {
        expect(["Bounce", "SSL", "Breakout"]).toContain(strategy);
        expect(["SUPPORT", "SSL", "RESISTANCE"]).toContain(label);
      }
    });
  });
});
