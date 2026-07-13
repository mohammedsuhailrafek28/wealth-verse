import { DEFAULT_PREFERENCES, type MemoryEntry, type MemoryOwner, type MemoryStore, type PreferenceProfile } from "./types";
import {
  getPersistenceProvider,
  InMemoryPersistenceProvider,
  type PersistenceProvider,
} from "../persistence";

const MAX_MEMORY_ENTRIES = 20;
const MEMORY_KEY = "items";
const PREFERENCES_KEY = "profile";

const ownerKey = (ownerId: MemoryOwner) => {
  if (ownerId === null || ownerId === undefined || String(ownerId).trim() === "") {
    return "demo-user";
  }
  return String(ownerId);
};

export class InMemoryMemoryStore implements MemoryStore {
  constructor(private readonly provider: PersistenceProvider = new InMemoryPersistenceProvider()) {}

  async addMemory(ownerId: MemoryOwner, entry: MemoryEntry): Promise<void> {
    const key = ownerKey(ownerId);
    const current = await this.getRecentMemories(key, MAX_MEMORY_ENTRIES);
    const next = [...current, entry].slice(-MAX_MEMORY_ENTRIES);
    await this.provider.set("memory", key, MEMORY_KEY, next);
  }

  async getRecentMemories(ownerId: MemoryOwner, limit = MAX_MEMORY_ENTRIES): Promise<MemoryEntry[]> {
    const key = ownerKey(ownerId);
    const entries = await this.provider.list<MemoryEntry>("memory", key, MEMORY_KEY, {
      limit: MAX_MEMORY_ENTRIES,
    });
    return entries.slice(-Math.max(0, limit));
  }

  async clearMemories(ownerId: MemoryOwner): Promise<void> {
    await this.provider.clearDomain("memory", ownerId);
  }

  async updatePreferences(
    ownerId: MemoryOwner,
    preferences: Partial<PreferenceProfile>
  ): Promise<PreferenceProfile> {
    const key = ownerKey(ownerId);
    const next = {
      ...(await this.getPreferences(ownerId)),
      ...preferences,
    };
    await this.provider.set("preferences", key, PREFERENCES_KEY, next);
    return next;
  }

  async getPreferences(ownerId: MemoryOwner): Promise<PreferenceProfile> {
    const preferences = await this.provider.get<PreferenceProfile>(
      "preferences",
      ownerKey(ownerId),
      PREFERENCES_KEY
    );
    return { ...(preferences ?? DEFAULT_PREFERENCES) };
  }
}

export const inMemoryMemoryStore = new InMemoryMemoryStore(getPersistenceProvider());
