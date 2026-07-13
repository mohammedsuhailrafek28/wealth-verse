export type PersistenceDomain =
  | "memory"
  | "events"
  | "notifications"
  | "preferences"
  | "predictions";

export type PersistenceHealthStatus = "healthy" | "degraded" | "unavailable";
export type PersistenceMode = "memory" | "json";

export type PersistenceReadOptions = {
  limit?: number;
};

export type PersistenceWriteOptions = {
  maxItems?: number;
  newestFirst?: boolean;
};

export type PersistenceHealth = {
  mode: PersistenceMode;
  status: PersistenceHealthStatus;
  domains: PersistenceDomain[];
  warnings: string[];
  volatile: boolean;
};

export interface PersistenceProvider {
  get<T>(domain: PersistenceDomain, userId: string | number | null | undefined, key: string): Promise<T | null>;
  set<T>(domain: PersistenceDomain, userId: string | number | null | undefined, key: string, value: T): Promise<void>;
  append<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    value: T,
    options?: PersistenceWriteOptions
  ): Promise<void>;
  list<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    options?: PersistenceReadOptions
  ): Promise<T[]>;
  remove(domain: PersistenceDomain, userId: string | number | null | undefined, key: string): Promise<void>;
  clearDomain(domain: PersistenceDomain, userId: string | number | null | undefined): Promise<void>;
  health(): Promise<PersistenceHealth>;
}

export const PERSISTENCE_DOMAINS: PersistenceDomain[] = [
  "memory",
  "events",
  "notifications",
  "preferences",
  "predictions",
];

export const persistenceUserKey = (userId: string | number | null | undefined) => {
  if (userId === null || userId === undefined || String(userId).trim() === "") {
    return "demo-user";
  }
  return String(userId);
};
