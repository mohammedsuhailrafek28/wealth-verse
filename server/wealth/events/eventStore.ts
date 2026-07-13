import type { EventBus } from "./eventBus";
import { inMemoryEventBus } from "./inMemoryEventBus";
import type { EventCategory, WealthEvent } from "./types";
import { processEventForNotifications, processEventsForNotifications } from "../notifications/notificationEngine";
import { logger } from "../../_core/logger";
import { measureAsync } from "../telemetry";

export const eventStore = inMemoryEventBus;

export async function publishEventSafely(
  event: WealthEvent,
  bus: EventBus = eventStore
): Promise<void> {
  try {
    await measureAsync("event.publish", "event", event.userId, () => bus.publish(event), {
      eventType: event.type,
      category: event.category,
    });
    await processEventForNotifications(event);
  } catch (error) {
    logger.warn("[WealthEvents] Failed to publish event.", { error });
  }
}

export async function publishEventsSafely(
  events: WealthEvent[],
  bus: EventBus = eventStore
): Promise<void> {
  try {
    await measureAsync(
      "event.publishMany",
      "event",
      events[0]?.userId,
      () => bus.publishMany(events),
      { count: events.length }
    );
    await processEventsForNotifications(events);
  } catch (error) {
    logger.warn("[WealthEvents] Failed to publish events.", { error });
  }
}

export async function getRecentEvents(
  userId: string,
  limit?: number,
  bus: EventBus = eventStore
) {
  return bus.getRecentEvents(userId, limit);
}

export async function getEventsByCategory(
  userId: string,
  category: EventCategory,
  limit?: number,
  bus: EventBus = eventStore
) {
  return bus.getEventsByCategory(userId, category, limit);
}
