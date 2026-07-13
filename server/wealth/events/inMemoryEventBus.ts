import type { EventBus } from "./eventBus";
import type { EventCategory, WealthEvent } from "./types";
import {
  getPersistenceProvider,
  InMemoryPersistenceProvider,
  type PersistenceProvider,
} from "../persistence";

const MAX_EVENTS_PER_USER = 100;
const EVENT_KEY = "items";

export const eventUserKey = (userId: string | number | null | undefined) => {
  if (userId === null || userId === undefined || String(userId).trim() === "") {
    return "demo-user";
  }
  return String(userId);
};

export class InMemoryEventBus implements EventBus {
  constructor(private readonly provider: PersistenceProvider = new InMemoryPersistenceProvider()) {}

  async publish(event: WealthEvent): Promise<void> {
    const userId = eventUserKey(event.userId);
    const normalizedEvent = { ...event, userId };
    await this.provider.append("events", userId, EVENT_KEY, normalizedEvent, {
      maxItems: MAX_EVENTS_PER_USER,
      newestFirst: true,
    });
  }

  async publishMany(events: WealthEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  async getRecentEvents(userId: string, limit = 20): Promise<WealthEvent[]> {
    return this.provider.list<WealthEvent>("events", userId, EVENT_KEY, { limit });
  }

  async getEventsByCategory(
    userId: string,
    category: EventCategory,
    limit = 20
  ): Promise<WealthEvent[]> {
    return (await this.provider.list<WealthEvent>("events", userId, EVENT_KEY, {
      limit: MAX_EVENTS_PER_USER,
    }))
      .filter((event) => event.category === category)
      .slice(0, Math.max(0, limit));
  }

  async clearEvents(userId: string): Promise<void> {
    await this.provider.clearDomain("events", userId);
  }
}

export const inMemoryEventBus = new InMemoryEventBus(getPersistenceProvider());
