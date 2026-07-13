import type { TelemetryStore, TelemetryQueryOptions } from "./telemetryStore";
import type { TelemetryEvent } from "./types";

const MAX_TELEMETRY_EVENTS = 500;

export const telemetryUserKey = (userId: string | number | null | undefined) => {
  if (userId === null || userId === undefined || String(userId).trim() === "") {
    return "demo-user";
  }
  return String(userId);
};

export class InMemoryTelemetryStore implements TelemetryStore {
  private readonly eventsByUser = new Map<string, TelemetryEvent[]>();

  async record(event: TelemetryEvent): Promise<void> {
    const userId = telemetryUserKey(event.userId);
    const current = this.eventsByUser.get(userId) ?? [];
    this.eventsByUser.set(userId, [{ ...event, userId }, ...current].slice(0, MAX_TELEMETRY_EVENTS));
  }

  async getRecentEvents(
    userId: string | number | null | undefined,
    options: TelemetryQueryOptions = {}
  ): Promise<TelemetryEvent[]> {
    const limit = options.limit ?? 100;
    return [...(this.eventsByUser.get(telemetryUserKey(userId)) ?? [])].slice(0, Math.max(0, limit));
  }

  async clear(userId: string | number | null | undefined): Promise<void> {
    this.eventsByUser.delete(telemetryUserKey(userId));
  }
}

export const inMemoryTelemetryStore = new InMemoryTelemetryStore();
