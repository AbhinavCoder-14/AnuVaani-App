"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wifi, WifiOff, Radio } from "lucide-react";

const AVAILABILITY_BADGE: Record<string, string> = {
  reporting: "ops-badge-reporting",
  stale: "ops-badge-stale",
  offline: "ops-badge-offline",
  unknown: "ops-badge-unknown",
};

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 5000) return "Just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

/* ── Pipeline indicator ──────────────────────────────── */

const PIPELINE_STAGES = [
  { key: "listening", label: "Listening" },
  { key: "evaluating", label: "Wake confirmed" },
  { key: "streaming", label: "Audio receiving" },
  { key: "transcribing", label: "Transcribing" },
  { key: "idle", label: "Final transcript" },
] as const;

function PipelineIndicator({ currentState }: { currentState: string }) {
  const stateOrder = ["listening", "evaluating", "streaming", "transcribing", "idle"];
  const activeIdx = stateOrder.indexOf(currentState);

  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STAGES.map((stage, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div key={stage.key} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors ${
                  isActive
                    ? "border-ops-teal bg-ops-teal text-white"
                    : isPast
                      ? "border-ops-teal/40 bg-ops-teal/10 text-ops-teal"
                      : "border-ops-border bg-ops-bg text-ops-text-secondary"
                }`}
              >
                {i + 1}
              </div>
              <span className={`mt-1.5 text-[10px] ${isActive ? "font-semibold text-ops-teal" : "text-ops-text-secondary"}`}>
                {stage.label}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={`mb-4 h-0.5 w-6 ${isPast || isActive ? "bg-ops-teal/40" : "bg-ops-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Sparkline for trend data ────────────────────────── */

function TrendChart({ data, color, label, unit }: { data: Array<{ value: number; timestamp: Date }>; color: string; label: string; unit: string }) {
  if (data.length < 2) {
    return (
      <div className="ops-card p-4">
        <p className="text-ops-caption font-medium text-ops-text-secondary">{label}</p>
        <p className="mt-2 text-ops-body text-ops-text-secondary">Waiting for data…</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const latest = values[values.length - 1];

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ") + " L 100 100 L 0 100 Z";

  return (
    <div className="ops-card p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-ops-caption font-medium text-ops-text-secondary">{label}</p>
        <p className="text-ops-body font-semibold tabular-nums text-ops-text">
          {typeof latest === "number" ? latest.toFixed(1) : latest} {unit}
        </p>
      </div>
      <svg viewBox="0 0 100 100" className="mt-3 h-20 w-full" preserveAspectRatio="none">
        <path d={areaPath} fill={`${color}15`} />
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ── Main Device Detail Page ─────────────────────────── */

export default function DeviceDetailPage() {
  const params = useParams<{ deviceId: string }>();
  const { getDevice, getSessions } = useOpsStore();
  const device = getDevice(params.deviceId);

  if (!device) {
    return (
      <div className="mx-auto max-w-ops space-y-4 py-10 text-center">
        <p className="text-ops-h2 text-ops-text">Device not found</p>
        <p className="text-ops-body text-ops-text-secondary">
          No device registered with ID <code className="font-mono text-ops-teal">{params.deviceId}</code>
        </p>
        <Link href="/ops/devices" className="ops-btn mt-4 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to devices
        </Link>
      </div>
    );
  }

  const deviceSessions = getSessions({ deviceId: device.id }).slice(0, 10);
  const openIssues = device.issues.filter((i) => !i.resolved);

  return (
    <div className="mx-auto max-w-ops space-y-6">
      {/* Back link */}
      <Link href="/ops/devices" className="inline-flex items-center gap-1.5 text-ops-body text-ops-text-secondary hover:text-ops-teal">
        <ArrowLeft className="h-4 w-4" /> Back to devices
      </Link>

      {/* Device header */}
      <div className="ops-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-ops-h1 text-ops-text">{device.name}</h1>
            <p className="mt-1 text-ops-body text-ops-text-secondary">
              {device.site} · {device.location}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-ops-caption text-ops-text-secondary">
              <span className={AVAILABILITY_BADGE[device.availability]}>
                {device.availability.charAt(0).toUpperCase() + device.availability.slice(1)}
              </span>
              <span>Last seen: {formatRelativeTime(device.lastSeen)}</span>
              <span>Firmware: {device.firmware}</span>
              <span>Model: {device.model}</span>
            </div>
          </div>
          <div className="font-mono text-ops-caption text-ops-text-secondary">{device.id}</div>
        </div>
      </div>

      {/* Pipeline indicator */}
      <div className="ops-card p-5">
        <h2 className="mb-4 text-ops-h3 text-ops-text">Live Pipeline</h2>
        <PipelineIndicator currentState={device.voiceState} />
      </div>

      {/* Two-column: Listener Panel + Speech Processing Panel */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Listener Panel (ESP32) */}
        <div className="ops-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Radio className="h-4 w-4 text-ops-teal" />
            <h2 className="text-ops-h3 text-ops-text">ESP32 Listener</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Operating State</p>
              <p className="mt-1 text-ops-body font-semibold text-ops-text">
                {device.voiceState.charAt(0).toUpperCase() + device.voiceState.slice(1)}
              </p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">CPU Usage</p>
              <p className="mt-1 text-ops-body font-semibold tabular-nums text-ops-text">{device.cpu.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Resource Usage (RAM)</p>
              <p className="mt-1 text-ops-body font-semibold tabular-nums text-ops-text">{device.ramKb} KB</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ops-border">
                <div className="h-full rounded-full bg-ops-teal" style={{ width: `${Math.min((device.ramKb / 256) * 100, 100)}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-ops-text-secondary">of 256 KB limit</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Wake-word Score</p>
              <p className="mt-1 text-ops-body font-semibold tabular-nums text-ops-text">{device.wakeScore.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Configured Keyword</p>
              <p className="mt-1 text-ops-body font-semibold text-ops-text">&ldquo;{device.keyword}&rdquo;</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Model Working Memory</p>
              <p className="mt-1 text-ops-body font-semibold tabular-nums text-ops-text">{device.modelMemoryKb} KB</p>
              <p className="mt-1 text-[10px] text-ops-text-secondary" title="TensorFlow Lite for Microcontrollers execution workspace">
                TFLM arena
              </p>
            </div>
          </div>
        </div>

        {/* Speech Processing Panel (Raspberry Pi) */}
        <div className="ops-card p-5">
          <div className="mb-4 flex items-center gap-2">
            {device.asrEndpoint.status === "available" ? (
              <Wifi className="h-4 w-4 text-ops-green" />
            ) : (
              <WifiOff className="h-4 w-4 text-ops-red" />
            )}
            <h2 className="text-ops-h3 text-ops-text">Speech Processing</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">ASR Engine</p>
              <p className="mt-1 text-ops-body font-semibold text-ops-text">{device.asrEndpoint.engine}</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Model</p>
              <p className="mt-1 font-mono text-[11px] font-semibold text-ops-text">{device.asrEndpoint.model}</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Endpoint</p>
              <p className="mt-1 font-mono text-[11px] text-ops-text">{device.asrEndpoint.host}</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Availability</p>
              <p className={`mt-1 text-ops-body font-semibold ${
                device.asrEndpoint.status === "available" ? "text-ops-green" : device.asrEndpoint.status === "unavailable" ? "text-ops-red" : "text-ops-text-secondary"
              }`}>
                {device.asrEndpoint.status.charAt(0).toUpperCase() + device.asrEndpoint.status.slice(1)}
              </p>
            </div>
          </div>

          {openIssues.length > 0 && (
            <div className="mt-4 rounded-lg border border-ops-red/20 bg-ops-red-light p-3">
              <p className="text-ops-caption font-semibold text-ops-red">Active Issues</p>
              {openIssues.map((issue) => (
                <p key={issue.id} className="mt-1 text-ops-caption text-ops-text">
                  {issue.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trend charts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TrendChart data={device.cpuHistory} color="#0F766E" label="CPU Trend" unit="%" />
        <TrendChart data={device.ramHistory} color="#2563EB" label="RAM Trend" unit="KB" />
        <TrendChart data={device.wakeScoreHistory.map((d) => ({ value: d.value, timestamp: d.timestamp }))} color="#7C3AED" label="Wake-score Timeline" unit="" />
      </div>

      {/* Recent sessions for this device */}
      <div className="ops-card overflow-hidden">
        <div className="border-b border-ops-border px-5 py-4">
          <h2 className="text-ops-h3 text-ops-text">Recent Sessions</h2>
          <p className="text-ops-caption text-ops-text-secondary">Last 10 sessions on this device</p>
        </div>
        <div className="overflow-x-auto">
          <table className="ops-table w-full text-left">
            <thead>
              <tr>
                <th>Time</th>
                <th>Transcript</th>
                <th>Engine</th>
                <th>Outcome</th>
                <th>Duration</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {deviceSessions.map((s) => (
                <tr key={s.id}>
                  <td className="whitespace-nowrap text-ops-caption">
                    {s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="max-w-[250px] truncate">
                    <Link href={`/ops/sessions/${s.id}`} className="text-ops-teal hover:underline">
                      {s.finalTranscript || s.currentPartial || "—"}
                    </Link>
                  </td>
                  <td className="text-ops-caption">{s.asrEngine}</td>
                  <td>
                    <span className={`ops-badge ${
                      s.outcome === "completed" ? "bg-ops-green-light text-ops-green"
                        : s.outcome === "failed" ? "bg-ops-red-light text-ops-red"
                        : s.outcome === "in_progress" ? "bg-ops-blue/10 text-ops-blue"
                        : "bg-ops-amber-light text-ops-amber"
                    }`}>
                      {s.outcome === "in_progress" ? "In progress" : s.outcome}
                    </span>
                  </td>
                  <td className="tabular-nums text-ops-caption">
                    {s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : "—"}
                  </td>
                  <td className="text-ops-caption text-ops-text-secondary">{s.reviewStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deviceSessions.length === 0 && (
          <p className="px-5 py-8 text-center text-ops-body text-ops-text-secondary">No sessions recorded for this device.</p>
        )}
      </div>

      {/* Diagnostics (collapsed) */}
      <details className="ops-card">
        <summary className="cursor-pointer px-5 py-4 text-ops-h3 text-ops-text hover:bg-ops-bg/50">
          Diagnostics &amp; Configuration
        </summary>
        <div className="border-t border-ops-border px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Hardware</p>
              <p className="mt-1 font-mono text-[11px] text-ops-text">ESP32-S3 + INMP441 + SSD1306</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Sample Rate</p>
              <p className="mt-1 font-mono text-[11px] text-ops-text">16 kHz PCM16 Mono</p>
            </div>
            <div className="rounded-lg bg-ops-bg p-3">
              <p className="text-ops-caption text-ops-text-secondary">Registered</p>
              <p className="mt-1 text-ops-body text-ops-text">{device.registeredAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
