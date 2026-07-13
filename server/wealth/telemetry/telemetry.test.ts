import { describe, expect, it } from "vitest";
import { appRouter } from "../../routers";
import type { TrpcContext } from "../../_core/context";
import { InMemoryTelemetryStore } from "./inMemoryTelemetryStore";
import { buildTelemetryHealth } from "./telemetryHealth";
import { buildTelemetryMetrics } from "./telemetryMetrics";
import { measureAsync, measureSync, recordOperation } from "./telemetryRecorder";
import type { TelemetryEvent } from "./types";
import type { TelemetryStore } from "./telemetryStore";

const userId = "telemetry-test-user";

function createEvent(index: number, success = true): TelemetryEvent {
  return {
    id: `telemetry-${index}`,
    timestamp: new Date(Date.now() + index).toISOString(),
    operation: index % 2 === 0 ? "advisor.ask" : "persistence.get",
    category: index % 2 === 0 ? "advisor" : "persistence",
    durationMs: 10 + index,
    success,
    errorCode: success ? undefined : "TestError",
    userId,
    metadata: { index },
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

describe("telemetry store", () => {
  it("records operations newest-first with a rolling limit", async () => {
    const store = new InMemoryTelemetryStore();
    for (let i = 0; i < 505; i++) {
      await store.record(createEvent(i));
    }

    const events = await store.getRecentEvents(userId, { limit: 600 });
    expect(events).toHaveLength(500);
    expect(events[0]?.id).toBe("telemetry-504");
    expect(events.at(-1)?.id).toBe("telemetry-5");
  });

  it("returns an empty state and supports demo-user fallback", async () => {
    const store = new InMemoryTelemetryStore();
    expect(await store.getRecentEvents(userId)).toEqual([]);

    await store.record({ ...createEvent(1), userId: "demo-user" });
    expect(await store.getRecentEvents(undefined)).toHaveLength(1);
  });
});

describe("telemetry recorder", () => {
  it("measures successful async and sync operations", async () => {
    const store = new InMemoryTelemetryStore();
    const asyncResult = await measureAsync(
      "test.async",
      "system",
      userId,
      async () => "ok",
      {},
      store
    );
    const syncResult = measureSync("test.sync", "system", userId, () => 42, {}, store);
    await Promise.resolve();

    const events = await store.getRecentEvents(userId);
    expect(asyncResult).toBe("ok");
    expect(syncResult).toBe(42);
    expect(events.map((event) => event.operation)).toEqual(["test.sync", "test.async"]);
    expect(events.every((event) => event.success)).toBe(true);
  });

  it("records failures and still rethrows business errors", async () => {
    const store = new InMemoryTelemetryStore();
    await expect(
      measureAsync(
        "test.failure",
        "system",
        userId,
        async () => {
          throw new TypeError("boom");
        },
        {},
        store
      )
    ).rejects.toThrow("boom");

    const events = await store.getRecentEvents(userId);
    expect(events[0]?.success).toBe(false);
    expect(events[0]?.errorCode).toBe("TypeError");
  });

  it("ignores telemetry store failures safely", async () => {
    const failingStore: TelemetryStore = {
      record: async () => {
        throw new Error("telemetry unavailable");
      },
      getRecentEvents: async () => [],
      clear: async () => undefined,
    };

    await expect(
      recordOperation(
        {
          operation: "test.safeFailure",
          category: "system",
          success: true,
          metadata: {},
        },
        failingStore
      )
    ).resolves.toBeUndefined();
  });
});

describe("telemetry aggregation", () => {
  it("builds metrics and health from recorded events", () => {
    const events = [createEvent(1), createEvent(2), createEvent(3, false)];
    const metrics = buildTelemetryMetrics(events);
    const health = buildTelemetryHealth(events);

    expect(metrics.operationCount).toBe(3);
    expect(metrics.failureCount).toBe(1);
    expect(metrics.successRate).toBe(66.7);
    expect(metrics.slowestOperation?.id).toBe("telemetry-3");
    expect(metrics.mostFrequentOperation?.operation).toBe("persistence.get");
    expect(health.status).toBe("unhealthy");
    expect(health.errorRate).toBe(33.3);
    expect(health.warnings.length).toBeGreaterThan(0);
  });
});

describe("telemetry route integration", () => {
  it("records advisor route telemetry without changing the response", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await caller.wealth.clearTelemetry();

    const response = await caller.wealth.askAdvisor({
      question: "What should I focus on next month?",
    });
    const metrics = await caller.wealth.getTelemetryMetrics({ limit: 50 });
    const health = await caller.wealth.getTelemetryHealth({ limit: 50 });
    const timeline = await caller.wealth.getTelemetryTimeline({ limit: 10 });

    expect(response.answer).toEqual(expect.any(String));
    expect(metrics.operationCount).toBeGreaterThan(0);
    expect(health.status).toMatch(/healthy|degraded|unhealthy/);
    expect(timeline.length).toBeGreaterThan(0);
  });
});
