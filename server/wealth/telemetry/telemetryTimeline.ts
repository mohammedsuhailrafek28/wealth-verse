import type { TelemetryEvent, TelemetryTimelineItem } from "./types";

export function buildTelemetryTimeline(
  events: TelemetryEvent[],
  limit = 25
): TelemetryTimelineItem[] {
  return events.slice(0, Math.max(0, limit)).map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    title: `${event.operation} ${event.success ? "completed" : "failed"}`,
    description: event.success
      ? `${event.category} operation finished in ${event.durationMs} ms.`
      : `${event.category} operation failed in ${event.durationMs} ms${event.errorCode ? ` (${event.errorCode})` : ""}.`,
    category: event.category,
    success: event.success,
    durationMs: event.durationMs,
    errorCode: event.errorCode,
  }));
}
