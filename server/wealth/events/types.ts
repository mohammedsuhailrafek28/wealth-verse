export type EventCategory =
  | "advisor"
  | "goal"
  | "recommendation"
  | "risk"
  | "alert"
  | "prediction"
  | "profile"
  | "system";

export type EventType =
  | "advisor.questionAsked"
  | "advisor.answerGenerated"
  | "goal.forecastGenerated"
  | "recommendation.generated"
  | "recommendation.viewed"
  | "recommendation.acted"
  | "risk.profileChanged"
  | "alert.generated"
  | "prediction.bundleGenerated"
  | "profile.contextBuilt"
  | "system.demoModeUsed";

export type EventSeverity = "info" | "success" | "warning" | "critical";

export type EventSource =
  | "advisorEngine"
  | "predictionEngine"
  | "recommendationEngine"
  | "dashboard"
  | "avatar"
  | "system"
  | string;

export type WealthEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  type: EventType;
  category: EventCategory;
  timestamp: string;
  userId: string;
  source: EventSource;
  severity: EventSeverity;
  title: string;
  description: string;
  payload: TPayload;
  metadata: Record<string, unknown>;
};

export type TimelineItem = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  iconHint: string;
  actionLabel: string;
  relatedMetric: string | null;
};
