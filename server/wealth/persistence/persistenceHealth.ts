import { getActivePersistenceMode, getPersistenceProvider } from "./persistenceRegistry";
import type { PersistenceHealth } from "./types";

export async function getPersistenceHealth(): Promise<PersistenceHealth> {
  const provider = getPersistenceProvider();
  const health = await provider.health();
  return {
    ...health,
    mode: getActivePersistenceMode(),
  };
}
