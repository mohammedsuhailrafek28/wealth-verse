export type NotificationCategory =
  | "advisor"
  | "goal"
  | "recommendation"
  | "risk"
  | "alert"
  | "prediction"
  | "system";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationStatus = "unread" | "read" | "dismissed";

export type Notification = {
  id: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  actionLabel: string;
  actionRoute: string;
  relatedEventId: string | null;
  relatedMetric: string | null;
  createdAt: string;
  expiresAt: string | null;
  metadata: Record<string, unknown>;
};

export type NotificationQueryOptions = {
  limit?: number;
  status?: NotificationStatus;
  category?: NotificationCategory;
  includeExpired?: boolean;
};

export type NotificationDigest = {
  title: string;
  summary: string;
  highPriorityCount: number;
  unreadCount: number;
  topRisks: string[];
  topOpportunities: string[];
  recommendedFocus: string;
  generatedAt: string;
};
