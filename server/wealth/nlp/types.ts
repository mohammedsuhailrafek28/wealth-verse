import type { AdvisorIntent } from "../types";

export type NLPEntities = {
  moneyValues: number[];
  timeReferences: string[];
  goalNames: string[];
  spendingCategories: string[];
  riskWords: string[];
};

export type ResolvedQuestionContext = {
  intent: AdvisorIntent;
  entities: NLPEntities;
  timeFrame?: string;
  goalReference?: string;
  categoryReference?: string;
  riskPreference?: string;
  memoryHints: string[];
};

export type NLPAnalysis = {
  normalizedQuestion: string;
  intent: AdvisorIntent;
  confidence: number;
  entities: NLPEntities;
  synonymsMatched: string[];
  contextHints: string[];
};
