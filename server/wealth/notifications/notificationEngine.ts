import type { WealthEvent } from "../events";
import { inMemoryNotificationStore } from "./inMemoryNotificationStore";
import type { NotificationStore } from "./notificationStore";
import { buildNotificationsForEvent } from "./notificationRules";
import { logger } from "../../_core/logger";
import { measureAsync } from "../telemetry";

export const notificationStore = inMemoryNotificationStore;

export async function processEventForNotifications(
  event: WealthEvent,
  store: NotificationStore = notificationStore
): Promise<void> {
  try {
    await measureAsync(
      "notification.processEvent",
      "notification",
      event.userId,
      async () => {
        const notifications = buildNotificationsForEvent(event);
        if (notifications.length > 0) {
          await store.addNotifications(notifications);
        }
      },
      { eventType: event.type }
    );
  } catch (error) {
    logger.warn("[WealthNotifications] Failed to process event.", { error });
  }
}

export async function processEventsForNotifications(
  events: WealthEvent[],
  store: NotificationStore = notificationStore
): Promise<void> {
  for (const event of events) {
    await processEventForNotifications(event, store);
  }
}
