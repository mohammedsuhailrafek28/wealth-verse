import { describe, expect, it } from "vitest";
import { buildFallbackAdvisorResponse, classifyAdvisorIntent } from "./advisorEngine";
import { generateWealthAlerts } from "./alertEngine";
import { generateInsights } from "./insightEngine";
import { generateWealthRecommendations } from "./recommendationEngine";
import { profileWealthRisk } from "./riskProfiler";
import type { WealthContext, WealthContextDraft } from "./types";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

const baseDraft: WealthContextDraft = {
  activeProfile: {
    id: 1,
    name: "Demo Profile",
    age: 30,
    occupation: "Engineer",
    riskProfile: "moderate",
  },
  monthlyIncome: 100000,
  monthlyExpenses: 70000,
  monthlySurplus: 30000,
  savingsRate: 30,
  financialHealthScore: {
    overallScore: 72,
    savingsScore: 18,
    investmentScore: 20,
    debtScore: 19,
    emergencyFundScore: 15,
    category: "good",
  },
  spendingBreakdown: {
    food: 12000,
    shopping: 26000,
    subscription: 3000,
  },
  goals: [
    {
      id: 1,
      goalType: "emergency_fund",
      targetAmount: 300000,
      currentAmount: 70000,
      timelineMonths: 18,
      priority: "high",
      monthlyContribution: 16667,
      progressPercent: 23.3,
    },
  ],
  recentTransactions: [
    {
      id: 1,
      date: new Date("2026-06-10"),
      category: "shopping",
      amount: 26000,
      type: "expense",
      description: "Lifestyle purchase",
    },
  ],
  unusualExpenses: [],
  opportunities: [
    {
      category: "subscription",
      amount: 600,
      suggestion: "Cancel unused subscriptions and save ₹600",
    },
  ],
  metrics: {
    monthlyIncome: 100000,
    monthlyExpenses: 70000,
    savingsRate: 30,
    investmentBalance: 250000,
    emergencyFundBalance: 70000,
    creditCardDebt: 60000,
    riskProfile: "moderate",
  },
};

function completeContext(): WealthContext {
  const recommendations = generateWealthRecommendations(baseDraft);
  const riskProfile = profileWealthRisk({ ...baseDraft, recommendations });
  const insights = generateInsights({ ...baseDraft, recommendations, riskProfile });
  const alerts = generateWealthAlerts({
    ...baseDraft,
    recommendations,
    riskProfile,
    insights,
  });

  return {
    ...baseDraft,
    recommendations,
    riskProfile,
    insights,
    alerts,
  };
}

describe("wealth insight engine", () => {
  it("generates structured insights without crashing", () => {
    const insights = generateInsights(baseDraft);

    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        type: expect.any(String),
        severity: expect.any(String),
        suggestedAction: expect.any(String),
        confidence: expect.any(Number),
      })
    );
  });
});

describe("wealth recommendation engine", () => {
  it("includes educational disclaimers on every recommendation", () => {
    const recommendations = generateWealthRecommendations(baseDraft);

    expect(recommendations.length).toBeGreaterThan(0);
    recommendations.forEach((recommendation) => {
      expect(recommendation.educationalDisclaimer).toContain("not licensed financial advice");
      expect(recommendation.nextAction).toEqual(expect.any(String));
    });
  });
});

describe("wealth risk profiler", () => {
  it("returns a stable risk profile with actions and constraints", () => {
    const riskProfile = profileWealthRisk(baseDraft);

    expect(["conservative", "balanced", "growth"]).toContain(riskProfile.profile);
    expect(riskProfile.score).toBeGreaterThanOrEqual(0);
    expect(riskProfile.score).toBeLessThanOrEqual(100);
    expect(riskProfile.suitableActions.length).toBeGreaterThan(0);
    expect(riskProfile.unsuitableActions.length).toBeGreaterThan(0);
  });
});

describe("wealth alert engine", () => {
  it("generates alerts with severity and suggested actions", () => {
    const alerts = generateWealthAlerts(baseDraft);

    expect(alerts.length).toBeGreaterThan(0);
    alerts.forEach((alert) => {
      expect(["info", "medium", "high"]).toContain(alert.severity);
      expect(alert.suggestedAction.length).toBeGreaterThan(0);
      expect(alert.relatedMetric.length).toBeGreaterThan(0);
    });
  });
});

describe("wealth advisor engine", () => {
  it("produces useful deterministic answers from WealthContext", () => {
    const response = buildFallbackAdvisorResponse(
      "What is my biggest financial risk?",
      completeContext()
    );

    expect(response.mode).toBe("fallback");
    expect(response.answer.length).toBeGreaterThan(20);
    expect(response.keyInsights.length).toBeGreaterThan(0);
    expect(response.suggestedNextActions.length).toBeGreaterThan(0);
    expect(response.disclaimer).toContain("not licensed financial advice");
  });

  it("classifies supported question intents", () => {
    expect(classifyAdvisorIntent("How can I improve my score?")).toBe("improveScore");
    expect(classifyAdvisorIntent("Can I start investing?")).toBe("investmentReadiness");
    expect(classifyAdvisorIntent("What should I do this month?")).toBe("monthlyPlan");
    expect(classifyAdvisorIntent("What is my biggest financial risk?")).toBe("riskReview");
  });

  it("returns follow-up questions and investment readiness context", () => {
    const response = buildFallbackAdvisorResponse("Can I start investing?", completeContext());

    expect(response.summary.length).toBeGreaterThan(0);
    expect(response.followUpQuestions.length).toBeGreaterThan(0);
    expect(response.relatedMetrics.some((metric) => metric.label === "Emergency fund")).toBe(true);
    expect(response.answer.toLowerCase()).toContain("invest");
  });

  it("returns top actions for monthly plan questions", () => {
    const response = buildFallbackAdvisorResponse("What should I do this month?", completeContext());

    expect(response.answer.toLowerCase()).toContain("this month");
    expect(response.suggestedNextActions.length).toBeGreaterThanOrEqual(1);
  });

  it("returns an actual risk for biggest risk questions", () => {
    const response = buildFallbackAdvisorResponse("What is my biggest financial risk?", completeContext());

    expect(response.answer.toLowerCase()).toContain("risk");
    expect(response.answer.toLowerCase()).not.toContain("strong savings rate");
  });
});

describe("advisor route compatibility", () => {
  it("keeps advisor.ask backward compatible while adding P1B fields", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: 0,
        openId: "local-demo-user",
        email: "demo@wealthverse.local",
        name: "Demo User",
        loginMethod: "local-demo",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "http", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
    });

    const response = await caller.advisor.ask({ question: "Can I start investing?" });

    expect(response.answer).toEqual(expect.any(String));
    expect(response.keyInsights.length).toBeGreaterThan(0);
    expect(response.suggestedNextActions.length).toBeGreaterThan(0);
    expect(response.followUpQuestions.length).toBeGreaterThan(0);
    expect(response.relatedMetrics.length).toBeGreaterThan(0);
    expect(response.disclaimer).toContain("not licensed financial advice");
  });
});
