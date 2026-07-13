import { describe, expect, it } from "vitest";
import { appRouter } from "../../routers";
import type { TrpcContext } from "../../_core/context";
import {
  createAdvisorAnswerGeneratedEvent,
  createAdvisorQuestionAskedEvent,
  createPredictionBundleGeneratedEvent,
  createSystemDemoModeUsedEvent,
} from "./eventFactory";
import { buildEventTimeline } from "./eventTimeline";
import { InMemoryEventBus } from "./inMemoryEventBus";
import type { WealthEvent } from "./types";

const userId = "event-test-user";

function createEvent(index: number, category: WealthEvent["category"] = "system"): WealthEvent {
  return {
    id: `event-${index}`,
    type: category === "advisor" ? "advisor.questionAsked" : "system.demoModeUsed",
    category,
    timestamp: new Date(Date.now() + index).toISOString(),
    userId,
    source: "system",
    severity: "info",
    title: `Event ${index}`,
    description: `Description ${index}`,
    payload: { index },
    metadata: {},
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

describe("in-memory event bus", () => {
  it("publishes a single event", async () => {
    const bus = new InMemoryEventBus();
    await bus.publish(createEvent(1));

    const events = await bus.getRecentEvents(userId);
    expect(events).toHaveLength(1);
    expect(events[0]?.title).toBe("Event 1");
  });

  it("publishes many events newest-first", async () => {
    const bus = new InMemoryEventBus();
    await bus.publishMany([createEvent(1), createEvent(2)]);

    const events = await bus.getRecentEvents(userId);
    expect(events.map((event) => event.id)).toEqual(["event-2", "event-1"]);
  });

  it("keeps a rolling limit of 100 events", async () => {
    const bus = new InMemoryEventBus();
    for (let i = 0; i < 105; i++) {
      await bus.publish(createEvent(i));
    }

    const events = await bus.getRecentEvents(userId, 150);
    expect(events).toHaveLength(100);
    expect(events[0]?.id).toBe("event-104");
    expect(events.at(-1)?.id).toBe("event-5");
  });

  it("filters by category and clears events", async () => {
    const bus = new InMemoryEventBus();
    await bus.publishMany([createEvent(1, "advisor"), createEvent(2, "system")]);

    const advisorEvents = await bus.getEventsByCategory(userId, "advisor");
    expect(advisorEvents).toHaveLength(1);
    expect(advisorEvents[0]?.category).toBe("advisor");

    await bus.clearEvents(userId);
    await expect(bus.getRecentEvents(userId)).resolves.toEqual([]);
  });
});

describe("event factories and timeline", () => {
  it("creates properly shaped advisor events", () => {
    const questionEvent = createAdvisorQuestionAskedEvent(userId, "Can I start investing?");
    const answerEvent = createAdvisorAnswerGeneratedEvent(userId, {
      answer: "Protect emergency reserves first.",
      summary: "Investment readiness needs caution.",
      keyInsights: ["Emergency fund matters."],
      suggestedNextActions: ["Review emergency fund."],
      followUpQuestions: ["What about goals?"],
      relatedMetrics: [],
      confidenceLevel: "medium",
      mode: "fallback",
      disclaimer: "This is educational demo guidance, not licensed financial advice.",
    });

    expect(questionEvent).toMatchObject({
      type: "advisor.questionAsked",
      category: "advisor",
      userId,
      payload: { question: "Can I start investing?" },
    });
    expect(answerEvent.type).toBe("advisor.answerGenerated");
    expect(answerEvent.severity).toBe("success");
  });

  it("creates prediction events and maps timeline items", () => {
    const event = createPredictionBundleGeneratedEvent(userId, {
      generatedAt: new Date().toISOString(),
      healthForecast: {
        currentScore: 70,
        projected30DayScore: 72,
        projected90DayScore: 75,
        direction: "improving",
        drivers: [],
        assumptions: [],
        confidence: "high",
      },
      goalForecasts: [],
      spendingForecasts: [],
      monthlyOutlook: {
        monthLabel: "July 2026",
        expectedSurplus: 25000,
        expectedSavingsRate: 25,
        topRisk: "No major risk detected",
        topOpportunity: "Keep surplus consistent",
        recommendedFocus: "Keep surplus consistent",
        forecastSummary: "Forecast summary",
        confidence: "medium",
      },
    });

    const timeline = buildEventTimeline([event]);
    expect(event.type).toBe("prediction.bundleGenerated");
    expect(timeline[0]).toMatchObject({
      title: "Prediction bundle generated",
      category: "prediction",
      iconHint: "chart-line",
      actionLabel: "View forecast",
    });
  });

  it("creates system demo-mode events", () => {
    const event = createSystemDemoModeUsedEvent(undefined);
    expect(event.userId).toBe("demo-user");
    expect(event.type).toBe("system.demoModeUsed");
  });
});

describe("event route integration", () => {
  it("advisor event publish does not break advisor response", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await caller.wealth.clearEvents();

    const response = await caller.advisor.ask({ question: "Can I start investing?" });
    const advisorEvents = await caller.wealth.getEvents({ category: "advisor", limit: 10 });

    expect(response.answer).toEqual(expect.any(String));
    expect(advisorEvents.some((event) => event.type === "advisor.questionAsked")).toBe(true);
    expect(advisorEvents.some((event) => event.type === "advisor.answerGenerated")).toBe(true);
  });

  it("prediction generation publishes prediction events", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await caller.wealth.clearEvents();

    const predictions = await caller.wealth.getPredictions();
    const events = await caller.wealth.getEvents({ category: "prediction", limit: 10 });
    const timeline = await caller.wealth.getEventTimeline({ limit: 5 });

    expect(predictions?.monthlyOutlook.forecastSummary).toEqual(expect.any(String));
    expect(events.some((event) => event.type === "prediction.bundleGenerated")).toBe(true);
    expect(timeline.length).toBeGreaterThan(0);
  });
});
