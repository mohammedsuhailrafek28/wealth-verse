import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { JsonFilePersistenceProvider } from "./jsonFilePersistenceProvider";
import { InMemoryPersistenceProvider } from "./inMemoryPersistenceProvider";
import { getActivePersistenceMode, getPersistenceProvider, resetPersistenceProviderForTests } from "./persistenceRegistry";

const originalMode = process.env.WEALTHVERSE_PERSISTENCE;

afterEach(() => {
  if (originalMode === undefined) {
    delete process.env.WEALTHVERSE_PERSISTENCE;
  } else {
    process.env.WEALTHVERSE_PERSISTENCE = originalMode;
  }
  resetPersistenceProviderForTests();
});

describe("in-memory persistence provider", () => {
  it("supports set/get", async () => {
    const provider = new InMemoryPersistenceProvider();

    await provider.set("memory", "user-a", "profile", { value: 1 });

    await expect(provider.get("memory", "user-a", "profile")).resolves.toEqual({ value: 1 });
  });

  it("supports append/list with limits", async () => {
    const provider = new InMemoryPersistenceProvider();

    await provider.append("events", "user-a", "items", { id: 1 });
    await provider.append("events", "user-a", "items", { id: 2 });

    await expect(provider.list("events", "user-a", "items", { limit: 1 })).resolves.toEqual([{ id: 2 }]);
  });

  it("isolates users and domains", async () => {
    const provider = new InMemoryPersistenceProvider();

    await provider.set("memory", "user-a", "item", "memory-a");
    await provider.set("memory", "user-b", "item", "memory-b");
    await provider.set("events", "user-a", "item", "event-a");

    await expect(provider.get("memory", "user-a", "item")).resolves.toBe("memory-a");
    await expect(provider.get("memory", "user-b", "item")).resolves.toBe("memory-b");
    await expect(provider.get("events", "user-a", "item")).resolves.toBe("event-a");
  });

  it("clears a domain for one user", async () => {
    const provider = new InMemoryPersistenceProvider();

    await provider.set("notifications", "user-a", "items", [{ id: 1 }]);
    await provider.clearDomain("notifications", "user-a");

    await expect(provider.list("notifications", "user-a", "items")).resolves.toEqual([]);
  });

  it("uses demo-user fallback", async () => {
    const provider = new InMemoryPersistenceProvider();

    await provider.set("preferences", undefined, "profile", { risk: "balanced" });

    await expect(provider.get("preferences", "demo-user", "profile")).resolves.toEqual({
      risk: "balanced",
    });
  });

  it("returns healthy volatile status", async () => {
    const provider = new InMemoryPersistenceProvider();

    await expect(provider.health()).resolves.toMatchObject({
      mode: "memory",
      status: "healthy",
      volatile: true,
    });
  });
});

describe("persistence registry", () => {
  it("defaults to in-memory mode", () => {
    delete process.env.WEALTHVERSE_PERSISTENCE;
    resetPersistenceProviderForTests();

    expect(getActivePersistenceMode()).toBe("memory");
    expect(getPersistenceProvider()).toBeTruthy();
  });

  it("keeps json provider disabled by default and enables it only by env", () => {
    delete process.env.WEALTHVERSE_PERSISTENCE;
    expect(getActivePersistenceMode()).toBe("memory");

    process.env.WEALTHVERSE_PERSISTENCE = "json";
    expect(getActivePersistenceMode()).toBe("json");
  });
});

describe("json file persistence provider", () => {
  it("can persist local dev data when explicitly used", async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), "wealthverse-persistence-"));
    try {
      const first = new JsonFilePersistenceProvider(tempDir);
      await first.set("memory", "user-a", "profile", { value: 42 });

      const second = new JsonFilePersistenceProvider(tempDir);
      await expect(second.get("memory", "user-a", "profile")).resolves.toEqual({ value: 42 });
      await expect(second.health()).resolves.toMatchObject({
        mode: "json",
        volatile: false,
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
