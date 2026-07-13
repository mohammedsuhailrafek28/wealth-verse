import type { NotificationStore } from "./notificationStore";
import type { Notification, NotificationQueryOptions } from "./types";
import {
  getPersistenceProvider,
  InMemoryPersistenceProvider,
  type PersistenceProvider,
} from "../persistence";

const MAX_NOTIFICATIONS_PER_USER = 100;
const NOTIFICATION_KEY = "items";

export const notificationUserKey = (userId: string | number | null | undefined) => {
  if (userId === null || userId === undefined || String(userId).trim() === "") {
    return "demo-user";
  }
  return String(userId);
};

const isExpired = (notification: Notification) =>
  Boolean(notification.expiresAt && new Date(notification.expiresAt).getTime() < Date.now());

export class InMemoryNotificationStore implements NotificationStore {
  constructor(private readonly provider: PersistenceProvider = new InMemoryPersistenceProvider()) {}

  async addNotification(notification: Notification): Promise<void> {
    const userId = notificationUserKey(notification.userId);
    const normalized = { ...notification, userId };
    const current = await this.getAll(userId);
    const dedupeKey = normalized.metadata.dedupeKey;
    const deduped =
      typeof dedupeKey === "string"
        ? current.filter((item) => item.metadata.dedupeKey !== dedupeKey)
        : current;
    await this.provider.set(
      "notifications",
      userId,
      NOTIFICATION_KEY,
      [normalized, ...deduped].slice(0, MAX_NOTIFICATIONS_PER_USER)
    );
  }

  async addNotifications(notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
      await this.addNotification(notification);
    }
  }

  async getNotifications(userId: string, options: NotificationQueryOptions = {}): Promise<Notification[]> {
    const limit = options.limit ?? 20;
    return (await this.getAll(userId))
      .filter((notification) => options.includeExpired || !isExpired(notification))
      .filter((notification) => !options.status || notification.status === options.status)
      .filter((notification) => !options.category || notification.category === options.category)
      .slice(0, Math.max(0, limit));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return (await this.getNotifications(userId, { status: "unread", limit: MAX_NOTIFICATIONS_PER_USER })).length;
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    await this.updateStatus(userId, notificationId, "read");
  }

  async markAllRead(userId: string): Promise<void> {
    const key = notificationUserKey(userId);
    await this.provider.set(
      "notifications",
      key,
      NOTIFICATION_KEY,
      (await this.getAll(key)).map((notification) =>
        notification.status === "dismissed" ? notification : { ...notification, status: "read" }
      )
    );
  }

  async dismiss(userId: string, notificationId: string): Promise<void> {
    await this.updateStatus(userId, notificationId, "dismissed");
  }

  async clearNotifications(userId: string): Promise<void> {
    await this.provider.clearDomain("notifications", userId);
  }

  private async updateStatus(userId: string, notificationId: string, status: Notification["status"]) {
    const key = notificationUserKey(userId);
    await this.provider.set(
      "notifications",
      key,
      NOTIFICATION_KEY,
      (await this.getAll(key)).map((notification) =>
        notification.id === notificationId ? { ...notification, status } : notification
      )
    );
  }

  private async getAll(userId: string | number | null | undefined) {
    return this.provider.list<Notification>(
      "notifications",
      userId,
      NOTIFICATION_KEY,
      { limit: MAX_NOTIFICATIONS_PER_USER }
    );
  }
}

export const inMemoryNotificationStore = new InMemoryNotificationStore(getPersistenceProvider());
