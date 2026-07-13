import type { Notification, NotificationQueryOptions } from "./types";

export interface NotificationStore {
  addNotification(notification: Notification): Promise<void>;
  addNotifications(notifications: Notification[]): Promise<void>;
  getNotifications(userId: string, options?: NotificationQueryOptions): Promise<Notification[]>;
  getUnreadCount(userId: string): Promise<number>;
  markRead(userId: string, notificationId: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
  dismiss(userId: string, notificationId: string): Promise<void>;
  clearNotifications(userId: string): Promise<void>;
}
