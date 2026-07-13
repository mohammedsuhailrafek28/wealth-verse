import type { TelemetryEvent } from "./types";

export type TelemetryQueryOptions = {
  limit?: number;
};

export interface TelemetryStore {
  record(event: TelemetryEvent): Promise<void>;
  getRecentEvents(userId: string | number | null | undefined, options?: TelemetryQueryOptions): Promise<TelemetryEvent[]>;
  clear(userId: string | number | null | undefined): Promise<void>;
}
