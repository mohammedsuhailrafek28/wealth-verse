import { inMemoryMemoryStore } from "./inMemoryMemoryStore";
import { DEFAULT_PREFERENCES, type MemoryOwner, type MemoryStore, type PreferenceProfile } from "./types";
import { measureAsync } from "../telemetry";

export function mergePreferences(
  current: PreferenceProfile = DEFAULT_PREFERENCES,
  updates: Partial<PreferenceProfile>
): PreferenceProfile {
  return {
    ...current,
    ...updates,
  };
}

export async function getPreferenceProfile(
  ownerId: MemoryOwner,
  store: MemoryStore = inMemoryMemoryStore
): Promise<PreferenceProfile> {
  return measureAsync("memory.getPreferences", "memory", ownerId, () =>
    store.getPreferences(ownerId)
  );
}

export async function updatePreferenceProfile(
  ownerId: MemoryOwner,
  updates: Partial<PreferenceProfile>,
  store: MemoryStore = inMemoryMemoryStore
): Promise<PreferenceProfile> {
  return measureAsync("memory.updatePreferences", "memory", ownerId, () =>
    store.updatePreferences(ownerId, updates)
  );
}
