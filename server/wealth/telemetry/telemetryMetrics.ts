import type { TelemetryEvent, TelemetryMetrics } from "./types";

export function buildTelemetryMetrics(events: TelemetryEvent[]): TelemetryMetrics {
  const operationCount = events.length;
  const failureCount = events.filter((event) => !event.success).length;
  const totalDuration = events.reduce((sum, event) => sum + event.durationMs, 0);
  const operationCounts = events.reduce<Record<string, number>>((counts, event) => {
    counts[event.operation] = (counts[event.operation] ?? 0) + 1;
    return counts;
  }, {});
  const mostFrequent = Object.entries(operationCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    operationCount,
    averageDurationMs: operationCount > 0 ? Math.round(totalDuration / operationCount) : 0,
    failureCount,
    successRate: operationCount > 0 ? Number((((operationCount - failureCount) / operationCount) * 100).toFixed(1)) : 100,
    slowestOperation:
      events.length > 0
        ? [...events].sort((a, b) => b.durationMs - a.durationMs)[0]
        : null,
    mostFrequentOperation: mostFrequent
      ? { operation: mostFrequent[0], count: mostFrequent[1] }
      : null,
  };
}
