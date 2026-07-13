import type { AdvisorResponse, WealthAlert, WealthRecommendation, WealthRiskProfile } from "../types";
import type { GoalForecast, PredictionBundle } from "../predictions";
import type { EventCategory, EventSeverity, EventSource, EventType, WealthEvent } from "./types";
import { eventUserKey } from "./inMemoryEventBus";

const createEventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;

type EventInput<TPayload extends Record<string, unknown>> = {
  type: EventType;
  category: EventCategory;
  userId: string | number | null | undefined;
  source: EventSource;
  severity?: EventSeverity;
  title: string;
  description: string;
  payload?: TPayload;
  metadata?: Record<string, unknown>;
};

export function createWealthEvent<TPayload extends Record<string, unknown>>(
  input: EventInput<TPayload>
): WealthEvent<TPayload> {
  return {
    id: createEventId(),
    type: input.type,
    category: input.category,
    timestamp: new Date().toISOString(),
    userId: eventUserKey(input.userId),
    source: input.source,
    severity: input.severity ?? "info",
    title: input.title,
    description: input.description,
    payload: input.payload ?? ({} as TPayload),
    metadata: input.metadata ?? {},
  };
}

export const createAdvisorQuestionAskedEvent = (
  userId: string | number | null | undefined,
  question: string,
  source: EventSource = "avatar"
) =>
  createWealthEvent({
    type: "advisor.questionAsked",
    category: "advisor",
    userId,
    source,
    title: "Advisor question asked",
    description: question,
    payload: { question },
  });

export const createAdvisorAnswerGeneratedEvent = (
  userId: string | number | null | undefined,
  response: AdvisorResponse,
  source: EventSource = "advisorEngine"
) =>
  createWealthEvent({
    type: "advisor.answerGenerated",
    category: "advisor",
    userId,
    source,
    severity: response.confidenceLevel === "low" ? "warning" : "success",
    title: "Advisor answer generated",
    description: response.summary,
    payload: {
      summary: response.summary,
      confidenceLevel: response.confidenceLevel,
      mode: response.mode,
      suggestedNextActions: response.suggestedNextActions,
    },
  });

export const createPredictionBundleGeneratedEvent = (
  userId: string | number | null | undefined,
  bundle: PredictionBundle
) =>
  createWealthEvent({
    type: "prediction.bundleGenerated",
    category: "prediction",
    userId,
    source: "predictionEngine",
    title: "Prediction bundle generated",
    description: bundle.monthlyOutlook.forecastSummary,
    payload: {
      generatedAt: bundle.generatedAt,
      healthDirection: bundle.healthForecast.direction,
      goalForecastCount: bundle.goalForecasts.length,
      spendingForecastCount: bundle.spendingForecasts.length,
      expectedSurplus: bundle.monthlyOutlook.expectedSurplus,
    },
  });

export const createGoalForecastGeneratedEvent = (
  userId: string | number | null | undefined,
  forecast: GoalForecast
) =>
  createWealthEvent({
    type: "goal.forecastGenerated",
    category: "goal",
    userId,
    source: "predictionEngine",
    severity: forecast.status === "behind" || forecast.status === "stalled" ? "warning" : "success",
    title: `${forecast.goalName} forecast generated`,
    description:
      forecast.monthsRemaining === null
        ? "Goal completion cannot be projected from current contribution data."
        : `Projected completion in ${forecast.monthsRemaining} month${forecast.monthsRemaining === 1 ? "" : "s"}.`,
    payload: { ...forecast },
    metadata: { relatedMetric: "goalForecast" },
  });

export const createRecommendationGeneratedEvent = (
  userId: string | number | null | undefined,
  recommendation: WealthRecommendation
) =>
  createWealthEvent({
    type: "recommendation.generated",
    category: "recommendation",
    userId,
    source: "recommendationEngine",
    severity: recommendation.priority === "high" ? "warning" : "info",
    title: recommendation.title,
    description: recommendation.summary,
    payload: {
      category: recommendation.category,
      priority: recommendation.priority,
      riskLevel: recommendation.riskLevel,
      nextAction: recommendation.nextAction,
    },
  });

export const createAlertGeneratedEvent = (
  userId: string | number | null | undefined,
  alert: WealthAlert
) =>
  createWealthEvent({
    type: "alert.generated",
    category: "alert",
    userId,
    source: "system",
    severity: alert.severity === "high" ? "critical" : alert.severity === "medium" ? "warning" : "info",
    title: alert.title,
    description: alert.message,
    payload: {
      type: alert.type,
      suggestedAction: alert.suggestedAction,
      relatedMetric: alert.relatedMetric,
    },
    metadata: { relatedMetric: alert.relatedMetric },
  });

export const createRiskProfileChangedEvent = (
  userId: string | number | null | undefined,
  riskProfile: WealthRiskProfile
) =>
  createWealthEvent({
    type: "risk.profileChanged",
    category: "risk",
    userId,
    source: "system",
    title: "Risk profile evaluated",
    description: riskProfile.explanation,
    payload: {
      profile: riskProfile.profile,
      score: riskProfile.score,
      constraints: riskProfile.constraints,
    },
    metadata: { relatedMetric: "riskProfile" },
  });

export const createSystemDemoModeUsedEvent = (
  userId: string | number | null | undefined,
  description = "Local demo mode data was used."
) =>
  createWealthEvent({
    type: "system.demoModeUsed",
    category: "system",
    userId,
    source: "system",
    title: "Demo mode used",
    description,
    payload: { demoMode: true },
  });

export const createProfileContextBuiltEvent = (
  userId: string | number | null | undefined,
  profileName: string,
  healthScore: number
) =>
  createWealthEvent({
    type: "profile.contextBuilt",
    category: "profile",
    userId,
    source: "system",
    title: "Wealth context built",
    description: `${profileName} context built with health score ${healthScore}/100.`,
    payload: { profileName, healthScore },
    metadata: { relatedMetric: "financialHealthScore" },
  });
