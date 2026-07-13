import type { AdvisorSessionContext } from "../memory/types";
import type { PredictionBundle } from "../predictions";
import type { WealthEvent } from "../events";
import type { Notification } from "../notifications";
import type { AdvisorIntent } from "../types";
import type { NLPEntities, ResolvedQuestionContext } from "./types";

export function resolveQuestionContext(input: {
  intent: AdvisorIntent;
  entities: NLPEntities;
  session?: AdvisorSessionContext;
  predictions?: PredictionBundle | null;
  events?: WealthEvent[];
  notifications?: Notification[];
}): ResolvedQuestionContext {
  const lastMemory = input.session?.conversationHistory.at(-1);
  const memoryHints =
    lastMemory && ["that", "it", "you mentioned", "what about"].some((term) => lastMemory.question.toLowerCase().includes(term))
      ? [lastMemory.intent]
      : lastMemory
        ? [`previous:${lastMemory.intent}`]
        : [];

  return {
    intent: input.intent,
    entities: input.entities,
    timeFrame: input.entities.timeReferences[0],
    goalReference: input.entities.goalNames[0],
    categoryReference: input.entities.spendingCategories[0],
    riskPreference: input.entities.riskWords[0] ?? input.session?.preferences.riskTolerance,
    memoryHints,
  };
}
