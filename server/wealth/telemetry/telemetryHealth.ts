import { buildTelemetryMetrics } from "./telemetryMetrics";
import type { TelemetryEvent, TelemetryHealth } from "./types";

export function buildTelemetryHealth(events: TelemetryEvent[]): TelemetryHealth {
  const metrics = buildTelemetryMetrics(events);
  const errorRate = Number((100 - metrics.successRate).toFixed(1));
  const warnings: string[] = [];

  if (metrics.operationCount === 0) {
    warnings.push("No telemetry has been recorded for this user yet.");
  }
  if (metrics.averageDurationMs > 1000) {
    warnings.push("Average operation latency is above 1000 ms.");
  }
  if (errorRate > 10) {
    warnings.push("Telemetry shows an elevated operation failure rate.");
  }

  const status =
    errorRate > 25 || metrics.averageDurationMs > 2000
      ? "unhealthy"
      : errorRate > 10 || metrics.averageDurationMs > 1000
        ? "degraded"
        : "healthy";

  return {
    status,
    averageLatencyMs: metrics.averageDurationMs,
    errorRate,
    warnings,
  };
}
