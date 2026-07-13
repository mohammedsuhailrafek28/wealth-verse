import type { WealthContext } from "../types";
import type { HealthForecast } from "./types";

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function buildHealthForecast(context: WealthContext): HealthForecast {
  const currentScore = clampScore(context.financialHealthScore.overallScore);
  const drivers: string[] = [];
  const assumptions = [
    "Projection assumes income, recurring spending, and goal contributions stay close to current demo values.",
    "Forecast is deterministic and educational; it is not a guaranteed financial outcome.",
  ];

  const highAlerts = context.alerts.filter((alert) => alert.severity === "high").length;
  const mediumAlerts = context.alerts.filter((alert) => alert.severity === "medium").length;
  let delta30 = 0;

  if (context.monthlySurplus < 0) {
    delta30 -= 5;
    drivers.push("Negative monthly surplus creates pressure on the health score.");
  } else if (context.savingsRate >= 30) {
    delta30 += 3;
    drivers.push(`Savings rate is strong at ${context.savingsRate.toFixed(1)}%.`);
  } else if (context.savingsRate >= 15) {
    delta30 += 1;
    drivers.push(`Savings rate is stable at ${context.savingsRate.toFixed(1)}%.`);
  } else {
    delta30 -= 2;
    drivers.push(`Savings rate is below target at ${context.savingsRate.toFixed(1)}%.`);
  }

  if (highAlerts > 0) {
    delta30 -= highAlerts * 3;
    drivers.push(`${highAlerts} high-severity alert${highAlerts === 1 ? "" : "s"} may reduce score momentum.`);
  }

  if (mediumAlerts > 0) {
    delta30 -= mediumAlerts;
    drivers.push(`${mediumAlerts} medium-severity alert${mediumAlerts === 1 ? "" : "s"} need attention.`);
  }

  if (context.unusualExpenses.length > 0) {
    delta30 -= Math.min(3, context.unusualExpenses.length);
    drivers.push("Unusual expenses add short-term volatility.");
  }

  if (context.riskProfile.profile === "growth" && context.alerts.length > 0) {
    delta30 -= 1;
    drivers.push("Growth risk posture should stay constrained while alerts are open.");
  }

  if (context.recommendations.some((rec) => rec.priority === "high")) {
    delta30 += 1;
    drivers.push("High-priority recommendations create clear improvement actions.");
  }

  if (drivers.length === 0) {
    drivers.push("No major positive or negative movement drivers were detected.");
  }

  const projected30DayScore = clampScore(currentScore + delta30);
  const projected90DayScore = clampScore(currentScore + delta30 * 2);
  const direction =
    projected90DayScore > currentScore + 2
      ? "improving"
      : projected90DayScore < currentScore - 2
        ? "declining"
        : "stable";

  return {
    currentScore,
    projected30DayScore,
    projected90DayScore,
    direction,
    drivers,
    assumptions,
    confidence: context.insights.length > 0 || context.alerts.length > 0 ? "high" : "medium",
  };
}
