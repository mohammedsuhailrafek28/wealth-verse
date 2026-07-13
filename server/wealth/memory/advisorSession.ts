import type { WealthContext } from "../types";
import { getConversationHistory } from "./conversationMemory";
import { inMemoryMemoryStore } from "./inMemoryMemoryStore";
import type { AdvisorSessionContext, MemoryOwner, MemoryStore } from "./types";

export async function buildAdvisorSessionContext(
  ownerId: MemoryOwner,
  wealthContext: WealthContext,
  store: MemoryStore = inMemoryMemoryStore
): Promise<AdvisorSessionContext> {
  const [conversationHistory, preferences] = await Promise.all([
    getConversationHistory(ownerId, store),
    store.getPreferences(ownerId),
  ]);

  return {
    wealthContext,
    conversationHistory,
    preferences,
  };
}

export { inMemoryMemoryStore };
export type { AdvisorSessionContext, MemoryStore, PreferenceProfile } from "./types";
