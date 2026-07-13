export type TelemetryCategory =
  | "advisor"
  | "prediction"
  | "notification"
  | "memory"
  | "event"
  | "persistence"
  | "route"
  | "system";

export type TelemetryEvent = {
  id: string;
  timestamp: string;
  operation: string;
  category: TelemetryCategory;
  durationMs: number;
  success: boolean;
  errorCode?: string;
  userId: string;
  metadata: Record<string, unknown>;
};

export type TelemetryMetrics = {
  operationCount: number;
  averageDurationMs: number;
  failureCount: number;
  successRate: number;
  slowestOperation: TelemetryEvent | null;
  mostFrequentOperation: { operation: string; count: number } | null;
};

export type TelemetryHealthStatus = "healthy" | "degraded" | "unhealthy";

export type TelemetryHealth = {
  status: TelemetryHealthStatus;
  averageLatencyMs: number;
  errorRate: number;
  warnings: string[];
};

export type TelemetryTimelineItem = {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: TelemetryCategory;
  success: boolean;
  durationMs: number;
  errorCode?: string;
};
