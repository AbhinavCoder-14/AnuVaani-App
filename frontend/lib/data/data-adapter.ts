/* ── Data adapter interface for Anuvaani Operations ──── */

import type { OpsDevice } from "@/types/ops-device";
import type { OpsEvent } from "@/types/events";
import type { Session, SessionOutcome, ReviewStatus } from "@/types/session";

export type DataSourceType = "simulation" | "live" | "recorded";

export interface SessionFilter {
  deviceId?: string;
  location?: string;
  startAfter?: Date;
  startBefore?: Date;
  asrEngine?: string;
  outcome?: SessionOutcome;
  reviewStatus?: ReviewStatus;
}

export interface DataAdapter {
  type: DataSourceType;
  connect(): void;
  disconnect(): void;
  getDevices(): OpsDevice[];
  getDevice(id: string): OpsDevice | null;
  getSessions(filters?: SessionFilter): Session[];
  getSession(id: string): Session | null;
  onEvent(handler: (event: OpsEvent) => void): () => void;
}
