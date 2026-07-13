import type { AdvisorIntent } from "../types";
import type { NLPEntities } from "./types";

const hasAny = (question: string, terms: string[]) =>
  terms.some((term) => question.includes(term));

export function classifyIntent(
  normalizedQuestion: string,
  entities: NLPEntities
): { intent: AdvisorIntent; confidence: number } {
  if (hasAny(normalizedQuestion, ["notification", "unread", "inbox"])) {
    return { intent: "notificationReview", confidence: 0.86 };
  }
  if (hasAny(normalizedQuestion, ["event history", "timeline", "activity", "what happened"])) {
    return { intent: "eventHistory", confidence: 0.84 };
  }
  if (
    hasAny(normalizedQuestion, ["when will", "reach my", "completion date", "complete my"]) ||
    (hasAny(normalizedQuestion, ["forecast", "prediction", "project"]) && entities.goalNames.length > 0)
  ) {
    return { intent: "goalForecast", confidence: 0.92 };
  }
  if (
    hasAny(normalizedQuestion, ["keep spending", "spending like this", "what will happen if"]) ||
    (hasAny(normalizedQuestion, ["forecast", "prediction", "project"]) && entities.spendingCategories.length > 0)
  ) {
    return { intent: "spendingForecast", confidence: 0.9 };
  }
  if (hasAny(normalizedQuestion, ["forecast", "prediction", "project", "next 90 days", "90 days"])) {
    return { intent: "forecast", confidence: 0.82 };
  }
  if (hasAny(normalizedQuestion, ["financial health score", "improve my score", "improve score"])) {
    return { intent: "improveScore", confidence: 0.93 };
  }
  if (hasAny(normalizedQuestion, ["reduce spending", "spending", "category", "cut", "save the most"])) {
    return { intent: "reduceSpending", confidence: 0.84 };
  }
  if (hasAny(normalizedQuestion, ["goal", "on track", "behind", "target"])) {
    return { intent: "goalProgress", confidence: 0.82 };
  }
  if (hasAny(normalizedQuestion, ["investment", "start investment", "can i investment"])) {
    return { intent: "investmentReadiness", confidence: 0.91 };
  }
  if (hasAny(normalizedQuestion, ["biggest risk", "risk review", "risk", "unsafe"])) {
    return { intent: "riskReview", confidence: 0.86 };
  }
  if (hasAny(normalizedQuestion, ["this month", "next month", "monthly plan", "focus", "do now"])) {
    return { intent: "monthlyPlan", confidence: 0.84 };
  }
  if (hasAny(normalizedQuestion, ["emergency fund", "emergency", "buffer"])) {
    return { intent: "emergencyFund", confidence: 0.87 };
  }
  if (hasAny(normalizedQuestion, ["debt", "credit card", "loan"])) {
    return { intent: "debt", confidence: 0.88 };
  }
  return { intent: "general", confidence: 0.55 };
}
