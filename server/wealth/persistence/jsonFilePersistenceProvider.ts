import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  PERSISTENCE_DOMAINS,
  persistenceUserKey,
  type PersistenceDomain,
  type PersistenceHealth,
  type PersistenceProvider,
  type PersistenceReadOptions,
  type PersistenceWriteOptions,
} from "./types";

type PersistedData = Partial<Record<PersistenceDomain, Record<string, Record<string, unknown>>>>;

export class JsonFilePersistenceProvider implements PersistenceProvider {
  private readonly filePath: string;
  private warnings = [
    "JSON persistence is intended only for local development/demo usage.",
    "Do not store secrets in WealthVerse persistence payloads.",
  ];

  constructor(baseDir = path.join(process.cwd(), ".runtime", "wealthverse-data")) {
    this.filePath = path.join(baseDir, "persistence.json");
  }

  async get<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string
  ): Promise<T | null> {
    const data = await this.readData();
    return (data[domain]?.[persistenceUserKey(userId)]?.[key] as T | undefined) ?? null;
  }

  async set<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    value: T
  ): Promise<void> {
    const data = await this.readData();
    const domainData = (data[domain] ??= {});
    const userData = (domainData[persistenceUserKey(userId)] ??= {});
    userData[key] = value;
    await this.writeData(data);
  }

  async append<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    value: T,
    options: PersistenceWriteOptions = {}
  ): Promise<void> {
    const current = await this.list<T>(domain, userId, key);
    const next = options.newestFirst === false ? [...current, value] : [value, ...current];
    await this.set(domain, userId, key, options.maxItems ? next.slice(0, options.maxItems) : next);
  }

  async list<T>(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string,
    options: PersistenceReadOptions = {}
  ): Promise<T[]> {
    const value = await this.get<unknown>(domain, userId, key);
    const list = Array.isArray(value) ? (value as T[]) : [];
    return typeof options.limit === "number" ? list.slice(0, Math.max(0, options.limit)) : list;
  }

  async remove(
    domain: PersistenceDomain,
    userId: string | number | null | undefined,
    key: string
  ): Promise<void> {
    const data = await this.readData();
    delete data[domain]?.[persistenceUserKey(userId)]?.[key];
    await this.writeData(data);
  }

  async clearDomain(domain: PersistenceDomain, userId: string | number | null | undefined): Promise<void> {
    const data = await this.readData();
    delete data[domain]?.[persistenceUserKey(userId)];
    await this.writeData(data);
  }

  async health(): Promise<PersistenceHealth> {
    return {
      mode: "json",
      status: "healthy",
      domains: PERSISTENCE_DOMAINS,
      warnings: this.warnings,
      volatile: false,
    };
  }

  private async readData(): Promise<PersistedData> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      return JSON.parse(raw) as PersistedData;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        this.warnings = [
          ...this.warnings.filter((warning) => !warning.startsWith("Corrupt JSON")),
          "Corrupt JSON persistence file was ignored and will be replaced on next write.",
        ];
      }
      return {};
    }
  }

  private async writeData(data: PersistedData): Promise<void> {
    try {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      const tmpPath = `${this.filePath}.tmp`;
      await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf8");
      await rename(tmpPath, this.filePath);
    } catch (error) {
      this.warnings = [
        ...this.warnings.filter((warning) => !warning.startsWith("JSON write failed")),
        `JSON write failed: ${(error as Error).message}`,
      ];
    }
  }
}
