/* ── Operational device model for Anuvaani Operations ── */

export type DeviceAvailability = "reporting" | "stale" | "offline" | "unknown";
export type VoiceState = "listening" | "evaluating" | "streaming" | "idle";

export interface AsrEndpoint {
  host: string;
  model: string;
  engine: string;
  status: "available" | "unavailable" | "unknown";
}

export interface OpsIssue {
  id: string;
  category: "asr_unavailable" | "telemetry_stale" | "session_timeout" | "memory_warning" | "device_offline";
  severity: "warning" | "error";
  message: string;
  raisedAt: Date;
  affectedSessionId?: string;
  resolved: boolean;
}

export interface OpsDevice {
  id: string;
  name: string;
  site: string;
  location: string;
  availability: DeviceAvailability;
  voiceState: VoiceState;
  asrEndpoint: AsrEndpoint;
  lastActivity: { event: string; timestamp: Date };
  issues: OpsIssue[];
  firmware: string;
  model: string;
  cpu: number;
  ramKb: number;
  modelMemoryKb: number;
  wakeScore: number;
  keyword: string;
  lastSeen: Date;
  registeredAt: Date;
  /** Time-series for CPU trend chart (last N samples). */
  cpuHistory: Array<{ value: number; timestamp: Date }>;
  /** Time-series for RAM trend chart. */
  ramHistory: Array<{ value: number; timestamp: Date }>;
  /** Wake-score samples with threshold markers. */
  wakeScoreHistory: Array<{ value: number; threshold: number; confirmed: boolean; timestamp: Date }>;
}
