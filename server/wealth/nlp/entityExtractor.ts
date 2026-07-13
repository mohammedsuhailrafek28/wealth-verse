import type { NLPEntities } from "./types";

const GOAL_NAMES = ["emergency fund", "vacation", "car", "laptop", "home", "education", "retirement"];
const SPENDING_CATEGORIES = ["food", "dining", "entertainment", "shopping", "transport", "travel", "rent", "utilities"];
const RISK_WORDS = ["high", "safe", "conservative", "balanced", "growth", "risky", "moderate"];
const TIME_PATTERNS = [
  "today",
  "this month",
  "next month",
  "this week",
  "next week",
  "90 days",
  "30 days",
  "3 months",
  "6 months",
  "year",
];

export function extractEntities(question: string): NLPEntities {
  const moneyValues = Array.from(question.matchAll(/(?:₹|rs\.?|inr)?\s*([0-9][0-9,]*(?:\.\d+)?)/gi))
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));

  const includes = (term: string) => question.includes(term);

  return {
    moneyValues,
    timeReferences: TIME_PATTERNS.filter(includes),
    goalNames: GOAL_NAMES.filter(includes),
    spendingCategories: SPENDING_CATEGORIES.filter(includes),
    riskWords: RISK_WORDS.filter(includes),
  };
}
