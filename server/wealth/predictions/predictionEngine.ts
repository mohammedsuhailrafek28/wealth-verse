import type { AdvisorSessionContext } from "../memory/types";
import type { WealthContext } from "../types";
import { buildGoalForecasts } from "./goalForecast";
import { buildHealthForecast } from "./healthForecast";
import { buildMonthlyOutlook } from "./monthlyOutlook";
import { buildSpendingForecasts } from "./spendingForecast";
import type { PredictionBundle } from "./types";
import { measureSync } from "../telemetry";

export function buildPredictionBundle(
  wealthContext: WealthContext,
  advisorSessionContext?: AdvisorSessionContext
): PredictionBundle {
  return measureSync("prediction.bundleGenerated", "prediction", undefined, () => {
    const session = advisorSessionContext ?? {
      wealthContext,
      conversationHistory: [],
      preferences: {
        riskTolerance: "balanced" as const,
        investmentInterest: "moderate" as const,
        preferredLanguage: "english" as const,
        voiceEnabled: true,
        goalPriority: "emergencyFund" as const,
      },
    };
    const healthForecast = buildHealthForecast(wealthContext);
    const goalForecasts = buildGoalForecasts(wealthContext, session);
    const spendingForecasts = buildSpendingForecasts(wealthContext);
    const monthlyOutlook = buildMonthlyOutlook(
      wealthContext,
      healthForecast,
      goalForecasts,
      spendingForecasts
    );

    return {
      healthForecast,
      goalForecasts,
      spendingForecasts,
      monthlyOutlook,
      generatedAt: new Date().toISOString(),
    };
  });
}
