/* ── Session entity for Anuvaani Operations ──────────── */

export type SessionOutcome = "completed" | "failed" | "timeout" | "in_progress";
export type ReviewStatus = "unreviewed" | "expected" | "false_activation" | "uncertain";

export interface SessionEvent {
  id: string;
  type:
    | "wake_confirmed"
    | "audio_first_received"
    | "transcript_partial"
    | "transcript_final"
    | "session_closed"
    | "error";
  timestamp: Date;
  detail?: string;
}

export interface Session {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  asrEngine: string;
  asrModel: string;
  /** Most recent partial transcript hypothesis (replaces, not appends). */
  currentPartial?: string;
  /** All partial snapshots for timeline display. */
  partialHistory: Array<{ text: string; timestamp: Date }>;
  finalTranscript?: string;
  outcome: SessionOutcome;
  failureReason?: string;
  failureStage?: "detection" | "audio_transport" | "speech_processing" | "connection";
  durationMs?: number;
  reviewStatus: ReviewStatus;
  events: SessionEvent[];
}
