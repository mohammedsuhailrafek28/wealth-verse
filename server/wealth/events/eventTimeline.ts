import type { EventCategory, TimelineItem, WealthEvent } from "./types";

const iconByCategory: Record<EventCategory, string> = {
  advisor: "bot",
  goal: "target",
  recommendation: "lightbulb",
  risk: "shield-alert",
  alert: "bell",
  prediction: "chart-line",
  profile: "user",
  system: "settings",
};

const actionByCategory: Record<EventCategory, string> = {
  advisor: "Open advisor",
  goal: "Review goal",
  recommendation: "Review recommendation",
  risk: "Review risk",
  alert: "Review alert",
  prediction: "View forecast",
  profile: "View dashboard",
  system: "View details",
};

export function mapEventToTimelineItem(event: WealthEvent): TimelineItem {
  const relatedMetric =
    typeof event.metadata.relatedMetric === "string"
      ? event.metadata.relatedMetric
      : typeof event.payload.relatedMetric === "string"
        ? event.payload.relatedMetric
        : null;

  return {
    id: event.id,
    timestamp: event.timestamp,
    title: event.title,
    description: event.description,
    category: event.category,
    severity: event.severity,
    iconHint: iconByCategory[event.category],
    actionLabel: actionByCategory[event.category],
    relatedMetric,
  };
}

export function buildEventTimeline(events: WealthEvent[], limit = 20): TimelineItem[] {
  return events.slice(0, limit).map(mapEventToTimelineItem);
}
