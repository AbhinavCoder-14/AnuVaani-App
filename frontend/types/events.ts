/* ── Unified event type system for Anuvaani Operations ──
 *
 * These types define the contract between data adapters (simulation or
 * live WebSocket) and the frontend state/components.  Every event carries
 * a stable device identifier, a timestamp and a versioned payload so the
 * UI can deduplicate replayed events and detect gaps.
 */

export type EventType =
  | "device.heartbeat"
  | "device.telemetry"
  | "wake.confirmed"
  | "session.started"
  | "transcript.partial"
  | "transcript.final"
  | "session.completed"
  | "session.failed"
  | "alert.raised"
  | "alert.resolved";

export interface OpsEvent {
  /** Unique event ID — used for deduplication on replay/reconnect. */
  id: string;
  type: EventType;
  deviceId: string;
  sessionId?: string;
  timestamp: Date;
  version: number;
  payload: Record<string, unknown>;
}

/* ── Heartbeat ────────────────────────────────────────── */
export interface HeartbeatPayload {
  firmware: string;
  uptimeSeconds: number;
}

/* ── Telemetry ────────────────────────────────────────── */
export interface TelemetryPayload {
  cpu: number;
  ramKb: number;
  wakeScore: number;
  modelMemoryKb: number;
  operatingState: "listening" | "evaluating" | "streaming" | "idle";
}

/* ── Wake ──────────────────────────────────────────────── */
export interface WakeConfirmedPayload {
  keyword: string;
  confidence: number;
}

/* ── Session ──────────────────────────────────────────── */
export interface SessionStartedPayload {
  asrEngine: string;
  asrModel: string;
  sampleRate: number;
}

export interface TranscriptPartialPayload {
  text: string;
  sequenceNumber: number;
}

export interface TranscriptFinalPayload {
  text: string;
  durationMs: number;
}

export interface SessionCompletedPayload {
  durationMs: number;
  transcriptLength: number;
}

export interface SessionFailedPayload {
  reason: string;
  stage: "detection" | "audio_transport" | "speech_processing" | "connection";
  durationMs: number;
}

/* ── Alert ─────────────────────────────────────────────── */
export type AlertSeverity = "warning" | "error";
export type AlertCategory =
  | "asr_unavailable"
  | "telemetry_stale"
  | "session_timeout"
  | "memory_warning"
  | "device_offline";

export interface AlertRaisedPayload {
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  affectedSessionId?: string;
}

export interface AlertResolvedPayload {
  originalAlertId: string;
  resolution: string;
}
