import {
  PERSISTENCE_DOMAINS,
  persistenceUserKey,
  type PersistenceDomain,
  type PersistenceHealth,
  type PersistenceProvider,
  type PersistenceReadOptions,
  type PersistenceWriteOptions,
} from "./types";
import { measureAsync } from "../telemetry";

type UserStore = Map<string, unknown>;
type DomainStore = Map<string, UserStore>;

export class InMemoryPersistenceProvider implements PersistenceProvider {
  private domains = new Map<PersistenceDomain, DomainStore>();

  async get<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string
  ): Promise<T | null> {
    return measureAsync("persistence.get", "persistence", userId, async () => {
      return (this.getUserStore(domain, userId).get(key) as T | undefined) ?? null;
    }, { domain, key });
  }

  async set<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    value: T
  ): Promise<void> {
    await measureAsync("persistence.set", "persistence", userId, async () => {
      this.getUserStore(domain, userId).set(key, value);
    }, { domain, key });
  }

  async append<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    value: T,
    options: PersistenceWriteOptions = {}
  ): Promise<void> {
    await measureAsync("persistence.append", "persistence", userId, async () => {
      const current = (await this.list<T>(domain, userId, key)) ?? [];
      const next = options.newestFirst === false ? [...current, value] : [value, ...current];
      await this.set(domain, userId, key, options.maxItems ? next.slice(0, options.maxItems) : next);
    }, { domain, key });
  }

  async list<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    options: PersistenceReadOptions = {}
  ): Promise<T[]> {
    return measureAsync("persistence.list", "persistence", userId, async () => {
      const value = this.getUserStore(domain, userId).get(key);
      const list = Array.isArray(value) ? (value as T[]) : [];
      return typeof options.limit === "number" ? list.slice(0, Math.max(0, options.limit)) : [...list];
    }, { domain, key });
  }

  async remove(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string
  ): Promise<void> {
    await measureAsync("persistence.remove", "persistence", userId, async () => {
      this.getUserStore(domain, userId).delete(key);
    }, { domain, key });
  }

  async clearDomain(domain: PersistenceDomain, userId: string | number | null | undefined): Promise<void> {
    await measureAsync("persistence.clearDomain", "persistence", userId, async () => {
      this.getDomainStore(domain).delete(persistenceUserKey(userId));
    }, { domain });
  }

  async health(): Promise<PersistenceHealth> {
    return measureAsync("persistence.health", "persistence", undefined, async () => ({
      mode: "memory",
      status: "healthy",
      domains: PERSISTENCE_DOMAINS,
      warnings: ["In-memory persistence is volatile and resets when the server restarts."],
      volatile: true,
    }));
  }

  private getDomainStore(domain: PersistenceDomain) {
    const existing = this.domains.get(domain);
    if (existing) return existing;
    const created: DomainStore = new Map();
    this.domains.set(domain, created);
    return created;
  }

  private getUserStore(domain: PersistenceDomain, userId: string | number | null | undefined) {
    const domainStore = this.getDomainStore(domain);
    const key = persistenceUserKey(userId);
    const existing = domainStore.get(key);
    if (existing) return existing;
    const created: UserStore = new Map();
    domainStore.set(key, created);
    return created;
  }
}

export const inMemoryPersistenceProvider = new InMemoryPersistenceProvider();
