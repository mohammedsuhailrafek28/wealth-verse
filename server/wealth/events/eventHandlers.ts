import type { PredictionBundle } from "../predictions";
import type { WealthContext } from "../types";
import {
  createAlertGeneratedEvent,
  createGoalForecastGeneratedEvent,
  createPredictionBundleGeneratedEvent,
  createProfileContextBuiltEvent,
  createRecommendationGeneratedEvent,
  createRiskProfileChangedEvent,
  createSystemDemoModeUsedEvent,
} from "./eventFactory";
import { publishEventsSafely } from "./eventStore";

export async function publishWealthContextEvents(
  userId: string | number,
  context: WealthContext
): Promise<void> {
  const events = [
    createProfileContextBuiltEvent(
      userId,
      context.activeProfile.name,
      context.financialHealthScore.overallScore
    ),
    createRiskProfileChangedEvent(userId, context.riskProfile),
    createSystemDemoModeUsedEvent(userId),
    ...context.recommendations
      .filter((recommendation) => recommendation.priority === "high")
      .slice(0, 2)
      .map((recommendation) => createRecommendationGeneratedEvent(userId, recommendation)),
    ...context.alerts
      .filter((alert) => alert.severity === "high" || alert.severity === "medium")
      .slice(0, 3)
      .map((alert) => createAlertGeneratedEvent(userId, alert)),
  ];

  await publishEventsSafely(events);
}

export async function publishPredictionEvents(
  userId: string | number,
  bundle: PredictionBundle
): Promise<void> {
  await publishEventsSafely([
    createPredictionBundleGeneratedEvent(userId, bundle),
    ...bundle.goalForecasts
      .filter((forecast) => forecast.status === "behind" || forecast.status === "stalled")
      .slice(0, 3)
      .map((forecast) => createGoalForecastGeneratedEvent(userId, forecast)),
  ]);
}
