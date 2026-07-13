import type { WealthContext } from "../types";
import type { SpendingForecast } from "./types";

export function buildSpendingForecasts(context: WealthContext): SpendingForecast[] {
  const opportunitiesByCategory = new Map(
    context.opportunities.map((opportunity) => [opportunity.category.toLowerCase(), opportunity])
  );
  const unusualCategories = new Set(context.unusualExpenses.map((expense) => expense.category.toLowerCase()));
  const totalSpend = Object.values(context.spendingBreakdown).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(context.spendingBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, spend]) => {
      const normalized = category.toLowerCase();
      const opportunity = opportunitiesByCategory.get(normalized);
      const isUnusual = unusualCategories.has(normalized);
      const share = totalSpend > 0 ? spend / totalSpend : 0;

      if (isUnusual) {
        const projectedMonthlySpend = Math.round(spend * 1.12);
        return {
          category,
          currentMonthlySpend: spend,
          projectedMonthlySpend,
          direction: "increasing",
          changePercent: 12,
          reason: "Recent unusual expense activity suggests this category may stay elevated next month.",
          suggestedAction: "Review recent transactions and separate one-time expenses from recurring habits.",
          confidence: "medium",
        };
      }

      if (opportunity) {
        const projectedMonthlySpend = Math.max(0, Math.round(spend - opportunity.amount));
        const changePercent = spend > 0 ? Math.round(((projectedMonthlySpend - spend) / spend) * 100) : 0;
        return {
          category,
          currentMonthlySpend: spend,
          projectedMonthlySpend,
          direction: projectedMonthlySpend < spend ? "decreasing" : "stable",
          changePercent,
          reason: opportunity.suggestion,
          suggestedAction: opportunity.suggestion,
          confidence: "high",
        };
      }

      if (share > 0.4) {
        return {
          category,
          currentMonthlySpend: spend,
          projectedMonthlySpend: Math.round(spend * 1.03),
          direction: "increasing",
          changePercent: 3,
          reason: "This is a dominant spending category, so small behavior drift can affect the whole month.",
          suggestedAction: "Set a category cap and review it weekly.",
          confidence: "medium",
        };
      }

      return {
        category,
        currentMonthlySpend: spend,
        projectedMonthlySpend: spend,
        direction: "stable",
        changePercent: 0,
        reason: "No unusual activity or savings opportunity was detected for this category.",
        suggestedAction: "Keep monitoring this category for recurring increases.",
        confidence: context.recentTransactions.length > 0 ? "medium" : "low",
      };
    });
}
