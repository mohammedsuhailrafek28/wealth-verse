import type { EventCategory, WealthEvent } from "./types";

export interface EventBus {
  publish(event: WealthEvent): Promise<void>;
  publishMany(events: WealthEvent[]): Promise<void>;
  getRecentEvents(userId: string, limit?: number): Promise<WealthEvent[]>;
  getEventsByCategory(
    userId: string,
    category: EventCategory,
    limit?: number
  ): Promise<WealthEvent[]>;
  clearEvents(userId: string): Promise<void>;
}
