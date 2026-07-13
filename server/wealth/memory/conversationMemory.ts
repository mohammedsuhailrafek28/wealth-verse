import type { AdvisorIntent, AdvisorResponse } from "../types";
import { inMemoryMemoryStore } from "./inMemoryMemoryStore";
import type { MemoryEntry, MemoryOwner, MemoryStore } from "./types";
import { measureAsync } from "../telemetry";

const createMemoryId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `memory-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export async function rememberAdvisorExchange(
  ownerId: MemoryOwner,
  question: string,
  response: AdvisorResponse,
  intent: AdvisorIntent,
  store: MemoryStore = inMemoryMemoryStore
): Promise<MemoryEntry> {
  const entry: MemoryEntry = {
    id: createMemoryId(),
    timestamp: new Date().toISOString(),
    question,
    answer: response.answer,
    intent,
    keyInsights: response.keyInsights,
    suggestedNextActions: response.suggestedNextActions,
  };

  await measureAsync("memory.recordAdvisorExchange", "memory", ownerId, () => store.addMemory(ownerId, entry), {
    intent,
  });
  return entry;
}

export async function getConversationHistory(
  ownerId: MemoryOwner,
  store: MemoryStore = inMemoryMemoryStore,
  limit = 20
): Promise<MemoryEntry[]> {
  return measureAsync("memory.getConversationHistory", "memory", ownerId, () =>
    store.getRecentMemories(ownerId, limit)
  );
}

export async function clearConversationHistory(
  ownerId: MemoryOwner,
  store: MemoryStore = inMemoryMemoryStore
): Promise<void> {
  await measureAsync("memory.clearConversationHistory", "memory", ownerId, () =>
    store.clearMemories(ownerId)
  );
}
