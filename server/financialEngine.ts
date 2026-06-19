import { getDemoProfileById, getTransactionsByProfile } from "./db";

export interface FinancialMetrics {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  investmentBalance: number;
  emergencyFundBalance: number;
  creditCardDebt: number;
  riskProfile: "conservative" | "moderate" | "aggressive";
}

export interface HealthScore {
  overallScore: number;
  savingsScore: number;
  investmentScore: number;
  debtScore: number;
  emergencyFundScore: number;
  category: "poor" | "fair" | "good" | "excellent";
}

export interface Recommendation {
  recommendation: string;
  expectedBenefit: string;
  riskLevel: "low" | "moderate" | "high";
  confidenceScore: number;
  reasons: string[];
  category: "savings" | "investment" | "debt_management" | "emergency_fund" | "spending";
}

/**
 * Calculate financial health score (0-100) based on multiple factors
 */
export function calculateHealthScore(metrics: FinancialMetrics): HealthScore {
  // Savings Score (0-25 points)
  const savingsScore = Math.min(25, Math.max(0, metrics.savingsRate * 0.25));

  // Investment Score (0-25 points)
  const investmentRatio = metrics.investmentBalance / Math.max(1, metrics.monthlyIncome);
  const investmentScore = Math.min(
    25,
    Math.max(0, Math.min(investmentRatio * 10, 25))
  );

  // Debt Score (0-25 points) - lower debt is better
  const debtRatio = metrics.creditCardDebt / Math.max(1, metrics.monthlyIncome);
  const debtScore = Math.max(0, 25 - Math.min(debtRatio * 25, 25));

  // Emergency Fund Score (0-25 points)
  const monthsOfExpenses = metrics.emergencyFundBalance / Math.max(1, metrics.monthlyExpenses);
  const emergencyFundScore = Math.min(25, Math.max(0, monthsOfExpenses * 4.17)); // 6 months = 25 points

  const overallScore = Math.round(
    savingsScore + investmentScore + debtScore + emergencyFundScore
  );

  let category: "poor" | "fair" | "good" | "excellent";
  if (overallScore >= 80) category = "excellent";
  else if (overallScore >= 60) category = "good";
  else if (overallScore >= 40) category = "fair";
  else category = "poor";

  return {
    overallScore,
    savingsScore: Math.round(savingsScore),
    investmentScore: Math.round(investmentScore),
    debtScore: Math.round(debtScore),
    emergencyFundScore: Math.round(emergencyFundScore),
    category,
  };
}

/**
 * Generate personalized recommendations based on financial metrics
 */
export function generateRecommendations(metrics: FinancialMetrics): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Rule 1: Low emergency fund
  if (metrics.emergencyFundBalance < metrics.monthlyExpenses * 3) {
    recommendations.push({
      recommendation: `Build your emergency fund to ₹${(metrics.monthlyExpenses * 3).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      expectedBenefit:
        "Protect yourself against unexpected financial hardships with 3-6 months of expenses saved",
      riskLevel: "low",
      confidenceScore: 95,
      reasons: [
        `Current emergency fund covers only ${(metrics.emergencyFundBalance / metrics.monthlyExpenses).toFixed(1)} months of expenses`,
        "Industry standard recommends 3-6 months of expenses",
        "Provides financial security and peace of mind",
      ],
      category: "emergency_fund",
    });
  }

  // Rule 2: High savings rate - increase SIP
  if (metrics.savingsRate > 25) {
    recommendations.push({
      recommendation: `Increase your SIP by ₹${Math.round(metrics.monthlyIncome * 0.05).toLocaleString("en-IN")}`,
      expectedBenefit:
        "Accelerate wealth creation through systematic investment with your improved savings capacity",
      riskLevel: "moderate",
      confidenceScore: 88,
      reasons: [
        `Your savings rate is ${metrics.savingsRate.toFixed(1)}% - above average`,
        "Consistent monthly investments benefit from rupee cost averaging",
        "Align with your risk profile for optimal returns",
      ],
      category: "investment",
    });
  }

  // Rule 3: High credit card debt
  if (metrics.creditCardDebt > metrics.monthlyIncome * 0.5) {
    recommendations.push({
      recommendation: `Prioritize paying down ₹${Math.round(metrics.creditCardDebt * 0.3).toLocaleString("en-IN")} of credit card debt`,
      expectedBenefit:
        "Reduce high-interest debt burden and improve your credit score and financial flexibility",
      riskLevel: "high",
      confidenceScore: 92,
      reasons: [
        `Your credit card debt is ${(metrics.creditCardDebt / metrics.monthlyIncome).toFixed(1)}x your monthly income`,
        "Credit card interest rates typically exceed 18% annually",
        "Debt repayment provides guaranteed returns",
      ],
      category: "debt_management",
    });
  }

  // Rule 4: Low investment balance
  if (metrics.investmentBalance < metrics.monthlyIncome * 6) {
    recommendations.push({
      recommendation: `Start investing in diversified mutual funds or stocks`,
      expectedBenefit:
        "Build long-term wealth through market-linked investments aligned with your risk tolerance",
      riskLevel: metrics.riskProfile === "conservative" ? "low" : "moderate",
      confidenceScore: 85,
      reasons: [
        "Your investment balance is below recommended levels for your income",
        `Your risk profile is ${metrics.riskProfile} - choose investments accordingly`,
        "Long-term investing benefits from compound growth",
      ],
      category: "investment",
    });
  }

  // Rule 5: Reduce unnecessary spending
  if (metrics.savingsRate < 15) {
    recommendations.push({
      recommendation: `Review and reduce discretionary spending by ₹${Math.round(metrics.monthlyExpenses * 0.1).toLocaleString("en-IN")}`,
      expectedBenefit:
        "Increase your savings rate and free up capital for investments and financial goals",
      riskLevel: "low",
      confidenceScore: 80,
      reasons: [
        `Your savings rate is ${metrics.savingsRate.toFixed(1)}% - below recommended 20-30%`,
        "Identify subscriptions, dining, and entertainment expenses to optimize",
        "Small reductions compound into significant savings over time",
      ],
      category: "spending",
    });
  }

  return recommendations;
}

/**
 * Get financial metrics for a demo profile
 */
export async function getProfileMetrics(demoProfileId: number): Promise<FinancialMetrics | null> {
  const p = await getDemoProfileById(demoProfileId);
  if (!p) return null;

  return {
    monthlyIncome: parseFloat(p.monthlyIncome.toString()),
    monthlyExpenses: parseFloat(p.monthlyExpenses.toString()),
    savingsRate: parseFloat(p.savingsRate.toString()),
    investmentBalance: parseFloat(p.investmentBalance.toString()),
    emergencyFundBalance: parseFloat(p.emergencyFundBalance.toString()),
    creditCardDebt: parseFloat(p.creditCardDebt.toString()),
    riskProfile: p.riskProfile,
  };
}

/**
 * Calculate spending breakdown by category
 */
export async function getSpendingBreakdown(demoProfileId: number) {
  const txns = await getTransactionsByProfile(demoProfileId);

  const breakdown: Record<string, number> = {};

  txns.forEach((t) => {
    if (t.type === "expense") {
      const category = t.category;
      const amount = parseFloat(t.amount.toString());
      breakdown[category] = (breakdown[category] || 0) + amount;
    }
  });

  return breakdown;
}

/**
 * Identify unusual expenses (outliers)
 */
export async function getUnusualExpenses(demoProfileId: number) {
  const txns = await getTransactionsByProfile(demoProfileId);

  const expenses = txns.filter((t) => t.type === "expense");
  if (expenses.length < 3) return [];

  const amounts = expenses.map((e) => parseFloat(e.amount.toString()));
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length
  );

  // Expenses > avg + 2*stdDev are considered unusual
  return expenses
    .filter((e) => {
      const amount = parseFloat(e.amount.toString());
      return amount > avg + 2 * stdDev;
    })
    .slice(0, 5);
}

/**
 * Identify savings opportunities
 */
export async function getSavingsOpportunities(demoProfileId: number) {
  const breakdown = await getSpendingBreakdown(demoProfileId);
  const opportunities: Array<{ category: string; amount: number; suggestion: string }> = [];

  // Subscriptions: suggest reducing by 20%
  if (breakdown["subscription"]) {
    const reduction = breakdown["subscription"] * 0.2;
    opportunities.push({
      category: "subscription",
      amount: reduction,
      suggestion: `Cancel unused subscriptions and save ₹${Math.round(reduction)}`,
    });
  }

  // Entertainment: suggest reducing by 15%
  if (breakdown["entertainment"]) {
    const reduction = breakdown["entertainment"] * 0.15;
    opportunities.push({
      category: "entertainment",
      amount: reduction,
      suggestion: `Reduce entertainment spending and save ₹${Math.round(reduction)}`,
    });
  }

  // Food: suggest reducing by 10%
  if (breakdown["food"]) {
    const reduction = breakdown["food"] * 0.1;
    opportunities.push({
      category: "food",
      amount: reduction,
      suggestion: `Optimize food spending through meal planning and save ₹${Math.round(reduction)}`,
    });
  }

  return opportunities.sort((a, b) => b.amount - a.amount);
}
