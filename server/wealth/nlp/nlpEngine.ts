import type { AdvisorSessionContext } from "../memory/types";
import type { PredictionBundle } from "../predictions";
import type { WealthEvent } from "../events";
import type { Notification } from "../notifications";
import { extractEntities } from "./entityExtractor";
import { classifyIntent } from "./intentClassifier";
import { normalizeQuestion } from "./questionNormalizer";
import { resolveQuestionContext } from "./contextResolver";
import type { NLPAnalysis } from "./types";

export function analyzeQuestion(
  question: string,
  context: {
    session?: AdvisorSessionContext;
    predictions?: PredictionBundle | null;
    events?: WealthEvent[];
    notifications?: Notification[];
  } = {}
): NLPAnalysis {
  const normalized = normalizeQuestion(question);
  const entities = extractEntities(normalized.question);
  const classification = classifyIntent(normalized.question, entities);
  const resolved = resolveQuestionContext({
    intent: classification.intent,
    entities,
    session: context.session,
    predictions: context.predictions,
    events: context.events,
    notifications: context.notifications,
  });

  const contextHints = [
    resolved.timeFrame ? `time:${resolved.timeFrame}` : "",
    resolved.goalReference ? `goal:${resolved.goalReference}` : "",
    resolved.categoryReference ? `category:${resolved.categoryReference}` : "",
    resolved.riskPreference ? `risk:${resolved.riskPreference}` : "",
    ...resolved.memoryHints,
  ].filter(Boolean);

  return {
    normalizedQuestion: normalized.question,
    intent: resolved.intent,
    confidence: classification.confidence,
    entities,
    synonymsMatched: normalized.synonymsMatched,
    contextHints,
  };
}
