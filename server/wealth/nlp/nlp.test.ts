import { describe, expect, it } from "vitest";
import { appRouter } from "../../routers";
import type { TrpcContext } from "../../_core/context";
import { analyzeQuestion } from "./nlpEngine";
import { extractEntities } from "./entityExtractor";
import { normalizeQuestion } from "./questionNormalizer";

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

describe("question normalization", () => {
  it("handles capitalization, extra spaces, spelling corrections, and synonyms", () => {
    const normalized = normalizeQuestion("  Can I start INVESTNG for my emerjency fund?  ");

    expect(normalized.question).toContain("investment");
    expect(normalized.question).toContain("emergency fund");
    expect(normalized.synonymsMatched).toEqual(
      expect.arrayContaining(["investing->investment", "emerjency fund->emergency fund"])
    );
  });
});

describe("entity extraction", () => {
  it("extracts money values, time references, goals, categories, and risk words", () => {
    const entities = extractEntities(
      "can i save ₹5000 on dining next month for emergency fund with conservative risk"
    );

    expect(entities.moneyValues).toContain(5000);
    expect(entities.timeReferences).toContain("next month");
    expect(entities.goalNames).toContain("emergency fund");
    expect(entities.spendingCategories).toContain("dining");
    expect(entities.riskWords).toContain("conservative");
  });
});

describe("nlp engine", () => {
  it("classifies common advisor intents", () => {
    expect(analyzeQuestion("Can I start investing?").intent).toBe("investmentReadiness");
    expect(analyzeQuestion("How can I improve my score?").intent).toBe("improveScore");
    expect(analyzeQuestion("What should I focus on next month?").intent).toBe("monthlyPlan");
  });

  it("classifies forecast questions", () => {
    expect(analyzeQuestion("When will I reach my emergency fund?").intent).toBe("goalForecast");
    expect(analyzeQuestion("What will happen if I keep spending like this?").intent).toBe("spendingForecast");
  });

  it("returns confidence and context hints", () => {
    const analysis = analyzeQuestion("When will I reach my emergency fund in 90 days?");

    expect(analysis.confidence).toBeGreaterThan(0.8);
    expect(analysis.contextHints).toEqual(expect.arrayContaining(["goal:emergency fund", "time:90 days"]));
  });

  it("keeps advisor routes backward compatible while exposing NLP analysis", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const advisor = await caller.advisor.ask({ question: "What will happen if I keep spending like this?" });
    const analysis = await caller.wealth.analyzeQuestion({
      question: "What will happen if I keep spending like this?",
    });

    expect(advisor.answer).toEqual(expect.any(String));
    expect(analysis.intent).toBe("spendingForecast");
    expect(analysis.normalizedQuestion).toEqual(expect.any(String));
  });
});
