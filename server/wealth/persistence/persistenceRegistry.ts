import { InMemoryPersistenceProvider, inMemoryPersistenceProvider } from "./inMemoryPersistenceProvider";
import { JsonFilePersistenceProvider } from "./jsonFilePersistenceProvider";
import type { PersistenceMode, PersistenceProvider } from "./types";

let activeProvider: PersistenceProvider | null = null;
let activeMode: PersistenceMode | null = null;

export function getActivePersistenceMode(): PersistenceMode {
  return process.env.WEALTHVERSE_PERSISTENCE === "json" ? "json" : "memory";
}

export function getPersistenceProvider(): PersistenceProvider {
  const mode = getActivePersistenceMode();
  if (activeProvider && activeMode === mode) return activeProvider;

  activeMode = mode;
  activeProvider = mode === "json" ? new JsonFilePersistenceProvider() : inMemoryPersistenceProvider;
  return activeProvider;
}

export function resetPersistenceProviderForTests(provider?: PersistenceProvider) {
  activeMode = null;
  activeProvider = provider ?? new InMemoryPersistenceProvider();
}
