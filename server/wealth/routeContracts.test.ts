import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

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

describe("wealth route contracts", () => {
  it("keeps core wealth routes callable in demo mode", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const context = await caller.wealth.getContext();
    const insights = await caller.wealth.getInsights();
    const riskProfile = await caller.wealth.getRiskProfile();
    const advisor = await caller.wealth.askAdvisor({ question: "What should I focus on next month?" });
    const advisorCompat = await caller.advisor.ask({ question: "Can I start investing?" });
    const predictions = await caller.wealth.getPredictions();
    const events = await caller.wealth.getEvents({ limit: 5 });
    const notifications = await caller.wealth.getNotifications({ limit: 5 });
    const persistenceHealth = await caller.wealth.getPersistenceHealth();
    const systemHealth = await caller.wealth.getSystemHealth();
    const telemetryMetrics = await caller.wealth.getTelemetryMetrics({ limit: 20 });
    const telemetryHealth = await caller.wealth.getTelemetryHealth({ limit: 20 });
    const telemetryTimeline = await caller.wealth.getTelemetryTimeline({ limit: 5 });
    const nlpAnalysis = await caller.wealth.analyzeQuestion({ question: "Can I start investing?" });

    expect(context?.activeProfile.name).toEqual(expect.any(String));
    expect(insights.length).toBeGreaterThan(0);
    expect(riskProfile?.profile).toEqual(expect.any(String));
    expect(advisor.answer).toEqual(expect.any(String));
    expect(advisorCompat.answer).toEqual(expect.any(String));
    expect(predictions?.monthlyOutlook.forecastSummary).toEqual(expect.any(String));
    expect(Array.isArray(events)).toBe(true);
    expect(Array.isArray(notifications)).toBe(true);
    expect(persistenceHealth.status).toBe("healthy");
    expect(systemHealth.timestamp).toEqual(expect.any(String));
    expect(telemetryMetrics.operationCount).toBeGreaterThan(0);
    expect(telemetryHealth.status).toEqual(expect.any(String));
    expect(Array.isArray(telemetryTimeline)).toBe(true);
    expect(nlpAnalysis.intent).toBe("investmentReadiness");
  });
});
