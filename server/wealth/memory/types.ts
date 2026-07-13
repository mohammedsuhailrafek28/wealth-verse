import type { AdvisorIntent, WealthContext } from "../types";

export type { AdvisorIntent };

export type MemoryEntry = {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  intent: AdvisorIntent;
  keyInsights: string[];
  suggestedNextActions: string[];
};

export type PreferenceProfile = {
  riskTolerance: "conservative" | "balanced" | "growth";
  investmentInterest: "low" | "moderate" | "high";
  preferredLanguage: "english";
  voiceEnabled: boolean;
  goalPriority: "emergencyFund" | "debt" | "investing" | "savings";
};

export const DEFAULT_PREFERENCES: PreferenceProfile = {
  riskTolerance: "balanced",
  investmentInterest: "moderate",
  preferredLanguage: "english",
  voiceEnabled: true,
  goalPriority: "emergencyFund",
};

export type AdvisorSessionContext = {
  wealthContext: WealthContext;
  conversationHistory: MemoryEntry[];
  preferences: PreferenceProfile;
};

export type MemoryOwner = string | number | null | undefined;

export interface MemoryStore {
  addMemory(ownerId: MemoryOwner, entry: MemoryEntry): Promise<void>;
  getRecentMemories(ownerId: MemoryOwner, limit?: number): Promise<MemoryEntry[]>;
  clearMemories(ownerId: MemoryOwner): Promise<void>;
  updatePreferences(ownerId: MemoryOwner, preferences: Partial<PreferenceProfile>): Promise<PreferenceProfile>;
  getPreferences(ownerId: MemoryOwner): Promise<PreferenceProfile>;
}
