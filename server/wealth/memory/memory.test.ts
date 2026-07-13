import { describe, expect, it } from "vitest";
import { appRouter } from "../../routers";
import type { TrpcContext } from "../../_core/context";
import { buildFallbackAdvisorResponse } from "../advisorEngine";
import type { WealthContext } from "../types";
import { buildAdvisorSessionContext } from "./advisorSession";
import { rememberAdvisorExchange } from "./conversationMemory";
import { InMemoryMemoryStore } from "./inMemoryMemoryStore";

const ownerId = "memory-test-user";

function createWealthContext(): WealthContext {
  return {
    activeProfile: {
      id: 1,
      name: "Memory Demo",
      age: 31,
      occupation: "Engineer",
      riskProfile: "moderate",
    },
    monthlyIncome: 100000,
    monthlyExpenses: 70000,
    monthlySurplus: 30000,
    savingsRate: 30,
    financialHealthScore: {
      overallScore: 68,
      savingsScore: 14,
      investmentScore: 20,
      debtScore: 18,
      emergencyFundScore: 16,
      category: "good",
    },
    spendingBreakdown: {
      shopping: 25000,
      food: 12000,
    },
    goals: [
      {
        id: 1,
        goalType: "emergency_fund",
        targetAmount: 300000,
        currentAmount: 150000,
        timelineMonths: 12,
        priority: "high",
        monthlyContribution: 25000,
        progressPercent: 50,
      },
    ],
    recommendations: [
      {
        id: "test-rec",
        category: "investment",
        title: "Evaluate SIP readiness",
        summary: "You may have room for a small SIP review.",
        reasoning: ["Savings rate is healthy"],
        expectedImpact: "Builds long-term habit",
        effort: "low",
        riskLevel: "moderate",
        priority: "medium",
        nextAction: "Confirm emergency fund before increasing SIP.",
        educationalDisclaimer: "This is educational demo guidance, not licensed financial advice.",
        legacy: {
          recommendation: "Increase your SIP",
          expectedBenefit: "Builds long-term habit",
          riskLevel: "moderate",
          confidenceScore: 80,
          reasons: ["Savings rate is healthy"],
          category: "investment",
        },
      },
    ],
    alerts: [
      {
        id: "emergency-alert",
        type: "emergencyFund",
        severity: "medium",
        title: "Emergency Fund Watch",
        message: "Emergency fund should stay protected.",
        suggestedAction: "Do not invest emergency reserves.",
        relatedMetric: "emergencyFundBalance",
      },
    ],
    recentTransactions: [],
    unusualExpenses: [],
    opportunities: [],
    riskProfile: {
      profile: "balanced",
      score: 68,
      explanation: "Balanced capacity.",
      constraints: ["Emergency reserves should remain protected."],
      suitableActions: ["Moderate SIP review"],
      unsuitableActions: ["Investing emergency reserves"],
    },
    insights: [
      {
        id: "insight-savings",
        type: "win",
        title: "Healthy savings",
        summary: "Savings rate is healthy.",
        severity: "info",
        evidence: ["30% savings rate"],
        suggestedAction: "Keep savings consistent.",
        confidence: 90,
      },
    ],
    metrics: {
      monthlyIncome: 100000,
      monthlyExpenses: 70000,
      savingsRate: 30,
      investmentBalance: 200000,
      emergencyFundBalance: 150000,
      creditCardDebt: 10000,
      riskProfile: "moderate",
    },
  };
}

function createAuthContext(): TrpcContext {
  return {
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
  };
}

describe("memory store", () => {
  it("returns empty state safely", async () => {
    const store = new InMemoryMemoryStore();

    await expect(store.getRecentMemories(ownerId)).resolves.toEqual([]);
    await expect(store.getPreferences(ownerId)).resolves.toMatchObject({
      riskTolerance: "balanced",
      voiceEnabled: true,
    });
  });

  it("keeps a rolling window of 20 entries", async () => {
    const store = new InMemoryMemoryStore();

    for (let i = 0; i < 25; i++) {
      await store.addMemory(ownerId, {
        id: `memory-${i}`,
        timestamp: new Date().toISOString(),
        question: `Question ${i}`,
        answer: `Answer ${i}`,
        intent: "general",
        keyInsights: [],
        suggestedNextActions: [],
      });
    }

    const entries = await store.getRecentMemories(ownerId);
    expect(entries).toHaveLength(20);
    expect(entries[0]?.question).toBe("Question 5");
    expect(entries[19]?.question).toBe("Question 24");
  });

  it("updates preferences within process lifetime", async () => {
    const store = new InMemoryMemoryStore();

    const updated = await store.updatePreferences(ownerId, {
      riskTolerance: "conservative",
      voiceEnabled: false,
    });

    expect(updated.riskTolerance).toBe("conservative");
    expect(updated.voiceEnabled).toBe(false);
    await expect(store.getPreferences(ownerId)).resolves.toMatchObject(updated);
  });

  it("falls back to demo-user for missing owner ids", async () => {
    const store = new InMemoryMemoryStore();

    await store.addMemory(undefined, {
      id: "demo-memory",
      timestamp: new Date().toISOString(),
      question: "Can I start investing?",
      answer: "Protect emergency reserves first.",
      intent: "investmentReadiness",
      keyInsights: ["Emergency fund matters."],
      suggestedNextActions: ["Review emergency fund."],
    });

    await expect(store.getRecentMemories("demo-user")).resolves.toHaveLength(1);
  });
});

describe("advisor session memory", () => {
  it("builds AdvisorSessionContext from wealth context, history, and preferences", async () => {
    const store = new InMemoryMemoryStore();
    const wealthContext = createWealthContext();

    await rememberAdvisorExchange(
      ownerId,
      "Can I start investing?",
      buildFallbackAdvisorResponse("Can I start investing?", wealthContext),
      "investmentReadiness",
      store
    );
    await store.updatePreferences(ownerId, { riskTolerance: "conservative" });

    const session = await buildAdvisorSessionContext(ownerId, wealthContext, store);

    expect(session.wealthContext.activeProfile.name).toBe("Memory Demo");
    expect(session.conversationHistory).toHaveLength(1);
    expect(session.preferences.riskTolerance).toBe("conservative");
  });

  it("uses prior conversation for follow-up emergency-fund questions", async () => {
    const store = new InMemoryMemoryStore();
    const wealthContext = createWealthContext();
    const firstResponse = buildFallbackAdvisorResponse("Can I start investing?", wealthContext);

    await rememberAdvisorExchange(
      ownerId,
      "Can I start investing?",
      firstResponse,
      "investmentReadiness",
      store
    );

    const session = await buildAdvisorSessionContext(ownerId, wealthContext, store);
    const followUp = buildFallbackAdvisorResponse("What about the emergency fund you mentioned?", session);

    expect(followUp.summary.toLowerCase()).toContain("emergency fund");
    expect(followUp.answer.toLowerCase()).toContain("following up");
  });

  it("keeps advisor.ask backward compatible while storing memory", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await caller.wealth.clearMemory();
    const first = await caller.advisor.ask({ question: "Can I start investing?" });
    const second = await caller.advisor.ask({
      question: "What about the emergency fund you mentioned?",
    });
    const memory = await caller.wealth.getMemory({ limit: 10 });

    expect(first.answer).toEqual(expect.any(String));
    expect(second.answer.toLowerCase()).toContain("emergency fund");
    expect(second.keyInsights.length).toBeGreaterThan(0);
    expect(second.suggestedNextActions.length).toBeGreaterThan(0);
    expect(memory).toHaveLength(2);
    expect(memory[0]?.timestamp).toEqual(expect.any(String));
    expect(memory[1]?.intent).toBe("emergencyFund");
  });

  it("exposes minimal memory and preference routes", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await caller.wealth.clearMemory();
    await expect(caller.wealth.getMemory()).resolves.toEqual([]);

    const defaults = await caller.wealth.getPreferences();
    expect(defaults).toMatchObject({
      riskTolerance: "balanced",
      investmentInterest: "moderate",
      goalPriority: "emergencyFund",
    });

    const updated = await caller.wealth.updatePreferences({
      riskTolerance: "growth",
      goalPriority: "investing",
    });
    expect(updated.riskTolerance).toBe("growth");
    expect(updated.goalPriority).toBe("investing");
  });
});
