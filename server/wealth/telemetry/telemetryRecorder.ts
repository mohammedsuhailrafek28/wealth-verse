import { randomUUID } from "node:crypto";
import { logger } from "../../_core/logger";
import { inMemoryTelemetryStore, telemetryUserKey } from "./inMemoryTelemetryStore";
import type { TelemetryStore } from "./telemetryStore";
import type { TelemetryCategory, TelemetryEvent } from "./types";

const nowMs = () => Date.now();

const errorCodeFor = (error: unknown) => {
  if (error instanceof Error && error.name) return error.name;
  if (typeof error === "object" && error && "code" in error) {
    return String((error as { code?: unknown }).code ?? "UnknownError");
  }
  return "UnknownError";
};

export async function recordOperation(
  event: Omit<TelemetryEvent, "id" | "timestamp" | "userId" | "durationMs"> & {
    userId?: string | number | null;
    durationMs?: number;
  },
  store: TelemetryStore = inMemoryTelemetryStore
): Promise<void> {
  try {
    await store.record({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      userId: telemetryUserKey(event.userId),
      durationMs: Math.max(0, Math.round(event.durationMs ?? 0)),
      operation: event.operation,
      category: event.category,
      success: event.success,
      errorCode: event.errorCode,
      metadata: event.metadata ?? {},
    });
  } catch (error) {
    logger.debug("[Telemetry] Failed to record operation.", { error });
  }
}

export async function measureAsync<T>(
  operation: string,
  category: TelemetryCategory,
  userId: string | number | null | undefined,
  callback: () => Promise<T>,
  metadata: Record<string, unknown> = {},
  store: TelemetryStore = inMemoryTelemetryStore
): Promise<T> {
  const startedAt = nowMs();
  try {
    const result = await callback();
    await recordOperation(
      {
        operation,
        category,
        userId,
        durationMs: nowMs() - startedAt,
        success: true,
        metadata,
      },
      store
    );
    return result;
  } catch (error) {
    await recordOperation(
      {
        operation,
        category,
        userId,
        durationMs: nowMs() - startedAt,
        success: false,
        errorCode: errorCodeFor(error),
        metadata,
      },
      store
    );
    throw error;
  }
}

export function measureSync<T>(
  operation: string,
  category: TelemetryCategory,
  userId: string | number | null | undefined,
  callback: () => T,
  metadata: Record<string, unknown> = {},
  store: TelemetryStore = inMemoryTelemetryStore
): T {
  const startedAt = nowMs();
  try {
    const result = callback();
    void recordOperation(
      {
        operation,
        category,
        userId,
        durationMs: nowMs() - startedAt,
        success: true,
        metadata,
      },
      store
    );
    return result;
  } catch (error) {
    void recordOperation(
      {
        operation,
        category,
        userId,
        durationMs: nowMs() - startedAt,
        success: false,
        errorCode: errorCodeFor(error),
        metadata,
      },
      store
    );
    throw error;
  }
}
