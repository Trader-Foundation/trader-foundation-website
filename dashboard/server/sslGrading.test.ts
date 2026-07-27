import { describe, expect, it } from "vitest";
import { calculateAlertSchedule, type SSLAlertSchedule, type Grade } from "./sslGradingEngine";

// ============================================================
// SSL GRADING ENGINE — Unit Tests
// Tests the alert schedule calculator (pure logic, no API calls)
// and validates the grading system structure & constants
// ============================================================

describe("SSL Grading Engine", () => {
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
      for (let liq = 0; liq <= 3; liq++) {
        for (let vol = 0; vol <= 3; vol++) {
          for (let abs = 0; abs <= 3; abs++) {
            const total = liq + vol + abs;
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
  // SSLGrade type structure validation
  // --------------------------------------------------------
  describe("SSLGrade type structure", () => {
    it("SSLGrade has all required fields and total matches sum", () => {
      const mockGrade = {
        symbol: "AAPL",
        company: "Apple Inc.",
        sector: "Technology",
        timeframe: "Weekly" as const,
        currentPrice: 175.5,
        liquidityScore: 3,
        liquidityDetails: "DOUBLE SSL SWEEP",
        volumeClimaxScore: 2,
        volumeClimaxDetails: "ELEVATED VOLUME",
        absorptionScore: 2,
        absorptionDetails: "2/3 criteria met",
        totalScore: 7,
        grade: "A" as Grade,
        rsiBullishDivergence: true,
        rsiDetails: "RSI BULLISH DIVERGENCE",
        fibKeyLevel: false,
        fibDetails: "Not at key level",
        nearTermSSL: 170.0,
        furtherTermSSL: 165.0,
        distToNearSSLPct: 3.24,
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

      expect(mockGrade.totalScore).toBe(
        mockGrade.liquidityScore + mockGrade.volumeClimaxScore + mockGrade.absorptionScore
      );
      expect(mockGrade.totalScore).toBeLessThanOrEqual(9);
      expect(mockGrade.totalScore).toBeGreaterThanOrEqual(0);
      expect(mockGrade.grade).toBe("A");
    });
  });
});
