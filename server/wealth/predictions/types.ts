export type ForecastDirection = "improving" | "stable" | "declining";
export type SpendingDirection = "increasing" | "stable" | "decreasing";
export type GoalForecastStatus = "ahead" | "onTrack" | "behind" | "stalled";
export type ForecastConfidence = "low" | "medium" | "high";

export type HealthForecast = {
  currentScore: number;
  projected30DayScore: number;
  projected90DayScore: number;
  direction: ForecastDirection;
  drivers: string[];
  assumptions: string[];
  confidence: ForecastConfidence;
};

export type GoalForecast = {
  goalId: number | string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContributionEstimate: number;
  projectedCompletionDate: string | null;
  monthsRemaining: number | null;
  status: GoalForecastStatus;
  suggestedMonthlyContribution: number;
  assumptions: string[];
  confidence: ForecastConfidence;
};

export type SpendingForecast = {
  category: string;
  currentMonthlySpend: number;
  projectedMonthlySpend: number;
  direction: SpendingDirection;
  changePercent: number;
  reason: string;
  suggestedAction: string;
  confidence: ForecastConfidence;
};

export type MonthlyOutlook = {
  monthLabel: string;
  expectedSurplus: number;
  expectedSavingsRate: number;
  topRisk: string;
  topOpportunity: string;
  recommendedFocus: string;
  forecastSummary: string;
  confidence: ForecastConfidence;
};

export type PredictionBundle = {
  healthForecast: HealthForecast;
  goalForecasts: GoalForecast[];
  spendingForecasts: SpendingForecast[];
  monthlyOutlook: MonthlyOutlook;
  generatedAt: string;
};
