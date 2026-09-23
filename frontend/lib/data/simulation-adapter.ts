/* ── Simulation adapter for Anuvaani Operations ────────
 *
 * Generates a coherent labelled deployment of 6 devices at named
 * locations.  Events are sequenced so that charts and counts derive
 * from the same event stream — nothing is independently randomised.
 *
 * Demonstrates two scenarios:
 * 1. Normal flow: heartbeat → wake → session → partial → final → completed
 * 2. Failure flow: ASR endpoint goes unavailable → session fails → alert
 */

import type { DataAdapter, SessionFilter } from "./data-adapter";
import type { OpsDevice, OpsIssue, AsrEndpoint } from "@/types/ops-device";
import type { OpsEvent } from "@/types/events";
import type { Session, SessionEvent as SessEvent } from "@/types/session";

/* ── Seed data ───────────────────────────────────────── */

interface DeviceSeed {
  id: string;
  name: string;
  site: string;
  location: string;
  keyword: string;
  firmware: string;
  model: string;
  asr: AsrEndpoint;
  baseCpu: number;
  baseRam: number;
}

const DEVICE_SEEDS: DeviceSeed[] = [
  {
    id: "esp32-lab-01",
    name: "Bengaluru Integration Lab",
    site: "ISRO Bengaluru",
    location: "Lab A, Rack 3",
    keyword: "vikram",
    firmware: "v2.4.1",
    model: "kws-vikram-int8-v3",
    asr: { host: "pi-lab-01.local", model: "vosk-small-en-0.15", engine: "Vosk", status: "available" },
    baseCpu: 8.2,
    baseRam: 196,
  },
  {
    id: "esp32-sri-02",
    name: "Sriharikota Ground Rig",
    site: "SDSC Sriharikota",
    location: "Ground Station B",
    keyword: "sahayata",
    firmware: "v2.4.1",
    model: "kws-sahayata-int8-v2",
    asr: { host: "pi-sri-02.local", model: "vosk-small-hi-0.22", engine: "Vosk", status: "available" },
    baseCpu: 8.7,
    baseRam: 198,
  },
  {
    id: "esp32-ahm-03",
    name: "Ahmedabad Thermal Bench",
    site: "PRL Ahmedabad",
    location: "Thermal Chamber 1",
    keyword: "emergency",
    firmware: "v2.3.8",
    model: "kws-emergency-int8-v4",
    asr: { host: "pi-ahm-03.local", model: "vosk-small-en-0.15", engine: "Vosk", status: "available" },
    baseCpu: 7.9,
    baseRam: 194,
  },
  {
    id: "esp32-chn-04",
    name: "Chennai EMI Chamber",
    site: "URSC Chennai",
    location: "EMI Lab, Node 2",
    keyword: "unni padi",
    firmware: "v2.4.0",
    model: "kws-unnipadi-int8-v1",
    asr: { host: "pi-chn-04.local", model: "vosk-small-ta-0.1", engine: "Vosk", status: "available" },
    baseCpu: 8.9,
    baseRam: 199,
  },
  {
    id: "esp32-tvm-05",
    name: "Thiruvananthapuram VSSC Node",
    site: "VSSC Trivandrum",
    location: "Test Bay 4",
    keyword: "oka bata",
    firmware: "v2.4.1",
    model: "kws-okabata-int8-v2",
    asr: { host: "pi-tvm-05.local", model: "vosk-small-te-0.2", engine: "Vosk", status: "available" },
    baseCpu: 8.1,
    baseRam: 195,
  },
  {
    id: "esp32-mah-06",
    name: "Mahendragiri Endurance Node",
    site: "IPRC Mahendragiri",
    location: "Outdoor Pad C",
    keyword: "emergency",
    firmware: "v2.3.8",
    model: "kws-emergency-int8-v4",
    asr: { host: "pi-mah-06.local", model: "vosk-small-en-0.15", engine: "Vosk", status: "available" },
    baseCpu: 7.6,
    baseRam: 193,
  },
];

const SAMPLE_TRANSCRIPTS = [
  "Vikram status report temperature nominal",
  "Emergency check oxygen levels in bay four",
  "Sahayata please show latest telemetry data",
  "System activate recording mode now",
  "Report current humidity sensor readings",
  "Request permission to initiate test sequence",
  "Confirm alignment of antenna module three",
  "Standby for calibration of pressure sensor",
];

/* ── Helpers ──────────────────────────────────────────── */

let eventCounter = 0;
function nextEventId(): string {
  return `sim-${Date.now()}-${++eventCounter}`;
}

function jitter(base: number, range: number): number {
  return base + (Math.random() - 0.5) * 2 * range;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Simulation Engine ───────────────────────────────── */

type EventHandler = (event: OpsEvent) => void;

export class SimulationEngine implements DataAdapter {
  readonly type = "simulation" as const;

  private devices = new Map<string, OpsDevice>();
  private sessions = new Map<string, Session>();
  private handlers = new Set<EventHandler>();
  private intervals: ReturnType<typeof setInterval>[] = [];
  private tick = 0;
  private asrFailureDevice: string | null = null;
  private asrFailureTimer: ReturnType<typeof setTimeout> | null = null;

  /* ── Adapter interface ──────────────────────────────── */

  connect(): void {
    this.initDevices();
    this.seedHistoricalSessions();
    this.startHeartbeats();
    this.startTelemetry();
    this.startSessionGeneration();
    this.scheduleAsrFailure();
  }

  disconnect(): void {
    for (const id of this.intervals) clearInterval(id);
    this.intervals = [];
    if (this.asrFailureTimer) clearTimeout(this.asrFailureTimer);
  }

  getDevices(): OpsDevice[] {
    return Array.from(this.devices.values());
  }

  getDevice(id: string): OpsDevice | null {
    return this.devices.get(id) ?? null;
  }

  getSessions(filters?: SessionFilter): Session[] {
    let result = Array.from(this.sessions.values());
    if (filters?.deviceId) result = result.filter((s) => s.deviceId === filters.deviceId);
    if (filters?.location) result = result.filter((s) => s.location === filters.location);
    if (filters?.outcome) result = result.filter((s) => s.outcome === filters.outcome);
    if (filters?.asrEngine) result = result.filter((s) => s.asrEngine === filters.asrEngine);
    if (filters?.reviewStatus) result = result.filter((s) => s.reviewStatus === filters.reviewStatus);
    if (filters?.startAfter) result = result.filter((s) => s.startTime >= filters.startAfter!);
    if (filters?.startBefore) result = result.filter((s) => s.startTime <= filters.startBefore!);
    return result.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  getSession(id: string): Session | null {
    return this.sessions.get(id) ?? null;
  }

  onEvent(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /* ── Internals ──────────────────────────────────────── */

  private emit(event: OpsEvent): void {
    for (const handler of this.handlers) handler(event);
  }

  private initDevices(): void {
    const now = new Date();
    for (const seed of DEVICE_SEEDS) {
      const device: OpsDevice = {
        id: seed.id,
        name: seed.name,
        site: seed.site,
        location: seed.location,
        availability: "reporting",
        voiceState: "listening",
        asrEndpoint: { ...seed.asr },
        lastActivity: { event: "Device registered", timestamp: now },
        issues: [],
        firmware: seed.firmware,
        model: seed.model,
        cpu: seed.baseCpu,
        ramKb: seed.baseRam,
        modelMemoryKb: 42,
        wakeScore: 0,
        keyword: seed.keyword,
        lastSeen: now,
        registeredAt: new Date(now.getTime() - Math.random() * 30 * 24 * 3600_000),
        cpuHistory: [],
        ramHistory: [],
        wakeScoreHistory: [],
      };
      this.devices.set(seed.id, device);
    }
  }

  private seedHistoricalSessions(): void {
    const now = Date.now();
    const deviceArr = Array.from(this.devices.values());

    // Generate 20-40 historical sessions spread over the last hour
    const count = 20 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      const device = pickRandom(deviceArr);
      const startOffset = Math.random() * 3600_000; // up to 1 hour ago
      const startTime = new Date(now - startOffset);
      const durationMs = 2000 + Math.random() * 6000;
      const endTime = new Date(startTime.getTime() + durationMs);

      const isFailed = Math.random() < 0.1; // 10% failure rate
      const transcript = isFailed ? undefined : pickRandom(SAMPLE_TRANSCRIPTS);
      const sessionId = `sess-hist-${i}-${device.id}`;

      const events: SessEvent[] = [
        { id: `${sessionId}-e1`, type: "wake_confirmed", timestamp: startTime, detail: `Keyword "${device.keyword}" detected` },
        { id: `${sessionId}-e2`, type: "audio_first_received", timestamp: new Date(startTime.getTime() + 150) },
      ];

      if (!isFailed) {
        events.push(
          { id: `${sessionId}-e3`, type: "transcript_partial", timestamp: new Date(startTime.getTime() + durationMs * 0.4), detail: transcript!.split(" ").slice(0, 3).join(" ") + "..." },
          { id: `${sessionId}-e4`, type: "transcript_final", timestamp: endTime, detail: transcript },
          { id: `${sessionId}-e5`, type: "session_closed", timestamp: new Date(endTime.getTime() + 50) },
        );
      } else {
        events.push(
          { id: `${sessionId}-e3`, type: "error", timestamp: new Date(startTime.getTime() + durationMs * 0.6), detail: "ASR processing timeout" },
          { id: `${sessionId}-e4`, type: "session_closed", timestamp: endTime },
        );
      }

      const session: Session = {
        id: sessionId,
        deviceId: device.id,
        deviceName: device.name,
        location: device.location,
        startTime,
        endTime,
        asrEngine: device.asrEndpoint.engine,
        asrModel: device.asrEndpoint.model,
        currentPartial: undefined,
        partialHistory: transcript
          ? [{ text: transcript.split(" ").slice(0, 3).join(" ") + "...", timestamp: new Date(startTime.getTime() + durationMs * 0.4) }]
          : [],
        finalTranscript: transcript,
        outcome: isFailed ? "failed" : "completed",
        failureReason: isFailed ? "ASR processing timeout" : undefined,
        failureStage: isFailed ? "speech_processing" : undefined,
        durationMs: Math.round(durationMs),
        reviewStatus: "unreviewed",
        events,
      };
      this.sessions.set(sessionId, session);
    }
  }

  private startHeartbeats(): void {
    const id = setInterval(() => {
      const now = new Date();
      for (const device of this.devices.values()) {
        if (device.availability === "offline") continue;
        device.lastSeen = now;
        this.emit({
          id: nextEventId(),
          type: "device.heartbeat",
          deviceId: device.id,
          timestamp: now,
          version: 1,
          payload: { firmware: device.firmware, uptimeSeconds: this.tick * 5 },
        });
      }
      this.tick++;
    }, 5000);
    this.intervals.push(id);
  }

  private startTelemetry(): void {
    const id = setInterval(() => {
      const now = new Date();
      for (const device of this.devices.values()) {
        if (device.availability === "offline") continue;
        const seed = DEVICE_SEEDS.find((s) => s.id === device.id)!;

        device.cpu = clamp(jitter(seed.baseCpu, 0.8), 6, 10);
        device.ramKb = Math.round(clamp(jitter(seed.baseRam, 6), 180, 244));

        // Bound history to 60 samples (5 minutes at 5s intervals)
        device.cpuHistory.push({ value: device.cpu, timestamp: now });
        if (device.cpuHistory.length > 60) device.cpuHistory.shift();

        device.ramHistory.push({ value: device.ramKb, timestamp: now });
        if (device.ramHistory.length > 60) device.ramHistory.shift();

        this.emit({
          id: nextEventId(),
          type: "device.telemetry",
          deviceId: device.id,
          timestamp: now,
          version: 1,
          payload: {
            cpu: device.cpu,
            ramKb: device.ramKb,
            wakeScore: device.wakeScore,
            modelMemoryKb: device.modelMemoryKb,
            operatingState: device.voiceState,
          },
        });
      }
    }, 5000);
    this.intervals.push(id);
  }

  private startSessionGeneration(): void {
    // Generate a new session every 8-15 seconds on a random device
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 7000;
      const timeoutId = setTimeout(() => {
        this.generateSession();
        scheduleNext();
      }, delay);
      // Store as interval for cleanup (we cast to make TS happy)
      this.intervals.push(timeoutId as unknown as ReturnType<typeof setInterval>);
    };
    scheduleNext();
  }

  private generateSession(): void {
    const deviceArr = Array.from(this.devices.values()).filter(
      (d) => d.availability === "reporting" && d.voiceState === "listening",
    );
    if (deviceArr.length === 0) return;

    const device = pickRandom(deviceArr);
    const now = new Date();
    const sessionId = `sess-${now.getTime()}-${device.id}`;
    const isAsrDown = this.asrFailureDevice === device.id;

    // 1. Wake confirmed
    const confidence = 0.65 + Math.random() * 0.3;
    device.voiceState = "evaluating";
    device.wakeScore = confidence;
    device.lastActivity = { event: `Wake: "${device.keyword}"`, timestamp: now };

    device.wakeScoreHistory.push({ value: confidence, threshold: 0.5, confirmed: true, timestamp: now });
    if (device.wakeScoreHistory.length > 30) device.wakeScoreHistory.shift();

    this.emit({
      id: nextEventId(),
      type: "wake.confirmed",
      deviceId: device.id,
      sessionId,
      timestamp: now,
      version: 1,
      payload: { keyword: device.keyword, confidence },
    });

    const session: Session = {
      id: sessionId,
      deviceId: device.id,
      deviceName: device.name,
      location: device.location,
      startTime: now,
      asrEngine: device.asrEndpoint.engine,
      asrModel: device.asrEndpoint.model,
      currentPartial: undefined,
      partialHistory: [],
      outcome: "in_progress",
      reviewStatus: "unreviewed",
      events: [
        { id: `${sessionId}-e1`, type: "wake_confirmed", timestamp: now, detail: `Keyword "${device.keyword}" confidence ${confidence.toFixed(2)}` },
      ],
    };
    this.sessions.set(sessionId, session);

    // 2. Session started (after 200ms)
    setTimeout(() => {
      device.voiceState = "streaming";
      const t = new Date();
      session.events.push({ id: `${sessionId}-e2`, type: "audio_first_received", timestamp: t });

      this.emit({
        id: nextEventId(),
        type: "session.started",
        deviceId: device.id,
        sessionId,
        timestamp: t,
        version: 1,
        payload: { asrEngine: device.asrEndpoint.engine, asrModel: device.asrEndpoint.model, sampleRate: 16000 },
      });

      if (isAsrDown) {
        // Failure path
        setTimeout(() => {
          const ft = new Date();
          device.voiceState = "listening";
          device.wakeScore = 0;
          session.outcome = "failed";
          session.failureReason = "ASR endpoint unavailable";
          session.failureStage = "speech_processing";
          session.endTime = ft;
          session.durationMs = ft.getTime() - now.getTime();
          session.events.push({ id: `${sessionId}-e-err`, type: "error", timestamp: ft, detail: "ASR endpoint unavailable" });
          session.events.push({ id: `${sessionId}-e-close`, type: "session_closed", timestamp: ft });

          this.emit({
            id: nextEventId(),
            type: "session.failed",
            deviceId: device.id,
            sessionId,
            timestamp: ft,
            version: 1,
            payload: { reason: "ASR endpoint unavailable", stage: "speech_processing", durationMs: session.durationMs },
          });
        }, 1500);
        return;
      }

      // 3. Partial transcript (after 1.5s)
      setTimeout(() => {
        const transcript = pickRandom(SAMPLE_TRANSCRIPTS);
        const partialText = transcript.split(" ").slice(0, Math.ceil(transcript.split(" ").length * 0.5)).join(" ") + "...";
        const pt = new Date();
        session.currentPartial = partialText;
        session.partialHistory.push({ text: partialText, timestamp: pt });
        session.events.push({ id: `${sessionId}-e3`, type: "transcript_partial", timestamp: pt, detail: partialText });

        this.emit({
          id: nextEventId(),
          type: "transcript.partial",
          deviceId: device.id,
          sessionId,
          timestamp: pt,
          version: 1,
          payload: { text: partialText, sequenceNumber: 1 },
        });

        // 4. Final transcript (after another 2s)
        setTimeout(() => {
          const ft = new Date();
          device.voiceState = "listening";
          device.wakeScore = 0;
          session.finalTranscript = transcript;
          session.currentPartial = undefined;
          session.outcome = "completed";
          session.endTime = ft;
          session.durationMs = ft.getTime() - now.getTime();
          session.events.push({ id: `${sessionId}-e4`, type: "transcript_final", timestamp: ft, detail: transcript });
          session.events.push({ id: `${sessionId}-e5`, type: "session_closed", timestamp: new Date(ft.getTime() + 50) });
          device.lastActivity = { event: `Transcript: "${transcript.substring(0, 30)}..."`, timestamp: ft };

          this.emit({
            id: nextEventId(),
            type: "transcript.final",
            deviceId: device.id,
            sessionId,
            timestamp: ft,
            version: 1,
            payload: { text: transcript, durationMs: session.durationMs },
          });

          this.emit({
            id: nextEventId(),
            type: "session.completed",
            deviceId: device.id,
            sessionId,
            timestamp: new Date(ft.getTime() + 50),
            version: 1,
            payload: { durationMs: session.durationMs, transcriptLength: transcript.length },
          });
        }, 1500 + Math.random() * 1000);
      }, 1200 + Math.random() * 800);
    }, 150 + Math.random() * 100);
  }

  private scheduleAsrFailure(): void {
    // After 25-40s, simulate ASR failure on device 4 (Chennai EMI Chamber)
    this.asrFailureTimer = setTimeout(() => {
      const targetId = "esp32-chn-04";
      const device = this.devices.get(targetId);
      if (!device) return;

      this.asrFailureDevice = targetId;
      device.asrEndpoint.status = "unavailable";
      const now = new Date();

      const issue: OpsIssue = {
        id: `issue-asr-${now.getTime()}`,
        category: "asr_unavailable",
        severity: "error",
        message: `ASR endpoint ${device.asrEndpoint.host} is not responding`,
        raisedAt: now,
        resolved: false,
      };
      device.issues.push(issue);

      this.emit({
        id: nextEventId(),
        type: "alert.raised",
        deviceId: targetId,
        timestamp: now,
        version: 1,
        payload: { severity: "error", category: "asr_unavailable", message: issue.message },
      });

      // Recover after 30-45s
      this.asrFailureTimer = setTimeout(() => {
        this.asrFailureDevice = null;
        device.asrEndpoint.status = "available";
        issue.resolved = true;
        const resolveTime = new Date();

        this.emit({
          id: nextEventId(),
          type: "alert.resolved",
          deviceId: targetId,
          timestamp: resolveTime,
          version: 1,
          payload: { originalAlertId: issue.id, resolution: "ASR endpoint reconnected" },
        });
      }, 30000 + Math.random() * 15000);
    }, 25000 + Math.random() * 15000);
  }

  /* ── Aggregate helpers used by overview ─────────────── */

  getReportingDeviceCount(): number {
    return Array.from(this.devices.values()).filter((d) => d.availability === "reporting").length;
  }

  getTotalDeviceCount(): number {
    return this.devices.size;
  }

  getActiveSessionCount(): number {
    return Array.from(this.sessions.values()).filter((s) => s.outcome === "in_progress").length;
  }

  getTranscriptionCompletion(): number {
    const eligible = Array.from(this.sessions.values()).filter((s) => s.outcome !== "in_progress");
    if (eligible.length === 0) return 100;
    const completed = eligible.filter((s) => s.outcome === "completed").length;
    return Math.round((completed / eligible.length) * 100);
  }

  getOpenIssueCount(): number {
    return Array.from(this.devices.values()).reduce(
      (sum, d) => sum + d.issues.filter((i) => !i.resolved).length,
      0,
    );
  }

  getSessionOutcomeCounts(): { completed: number; noTranscript: number; failed: number } {
    const all = Array.from(this.sessions.values()).filter((s) => s.outcome !== "in_progress");
    return {
      completed: all.filter((s) => s.outcome === "completed").length,
      noTranscript: all.filter((s) => s.outcome === "timeout").length,
      failed: all.filter((s) => s.outcome === "failed").length,
    };
  }

  getAvailabilityBreakdown(): Record<string, number> {
    const result: Record<string, number> = { reporting: 0, stale: 0, offline: 0, unknown: 0 };
    for (const d of this.devices.values()) result[d.availability]++;
    return result;
  }

  getRecentSessions(count: number): Session[] {
    return Array.from(this.sessions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, count);
  }

  getOpenIssues(): Array<{ device: OpsDevice; issue: OpsIssue }> {
    const result: Array<{ device: OpsDevice; issue: OpsIssue }> = [];
    for (const device of this.devices.values()) {
      for (const issue of device.issues) {
        if (!issue.resolved) result.push({ device, issue });
      }
    }
    return result.sort((a, b) => b.issue.raisedAt.getTime() - a.issue.raisedAt.getTime());
  }
}
