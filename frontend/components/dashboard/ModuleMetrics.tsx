"use client";

import type { DeviceTelemetry } from "@/lib/data/device-demo";
import { DEVICE_LIMITS } from "@/lib/data/device-demo";
import { Activity, Cpu, HardDrive, Mic, Timer } from "lucide-react";

function MetricBar({
  label,
  value,
  unit,
  limit,
  limitLabel,
}: {
  label: string;
  value: number;
  unit: string;
  limit?: number;
  limitLabel?: string;
}) {
  const pct = limit ? Math.min((value / limit) * 100, 100) : 0;

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <p className="text-xs font-medium text-brand-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-brand-charcoal">
        {value}
        <span className="ml-1 text-sm font-medium text-brand-muted">{unit}</span>
      </p>
      {limit !== undefined && (
        <>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-brand-teal"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-brand-muted">{limitLabel ?? `limit ${limit} ${unit}`}</p>
        </>
      )}
    </div>
  );
}

export function QuotaMetrics({ telemetry }: { telemetry: DeviceTelemetry }) {
  return (
    <section className="dash-card p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">Module · QUOTA</p>
          <h2 className="mt-1 text-lg font-bold text-brand-charcoal">What the bench scores</h2>
          <p className="text-sm text-brand-muted">On-device resource usage</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-mint/15 px-2.5 py-1 text-[11px] font-semibold text-brand-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
          Online
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricBar
          label="Idle CPU"
          value={telemetry.cpuPercent}
          unit="%"
          limit={DEVICE_LIMITS.cpuPercent}
          limitLabel={`limit ${DEVICE_LIMITS.cpuPercent}%`}
        />
        <MetricBar
          label="Listen RAM"
          value={telemetry.ramKb}
          unit="KB"
          limit={DEVICE_LIMITS.ramKb}
          limitLabel={`limit ${DEVICE_LIMITS.ramKb} KB`}
        />
        <MetricBar
          label="INT8 model"
          value={telemetry.modelKb}
          unit="KB"
          limit={DEVICE_LIMITS.modelKb}
          limitLabel="on the node"
        />
        <MetricBar label="Catch rate" value={telemetry.catchRate} unit="%" />
        <MetricBar label="False / h" value={telemetry.falsePerHour} unit="/h" />
        <MetricBar label="Word → Pi" value={telemetry.wordToPiMs} unit="ms" />
      </div>
    </section>
  );
}

export function LiveStatusCard({ telemetry }: { telemetry: DeviceTelemetry }) {
  return (
    <section className="dash-card p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">Module · LIVE</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
          <Mic className="h-4 w-4" />
          Listening
        </div>
        <div className="text-sm text-brand-muted">
          Waiting for <span className="font-semibold text-brand-charcoal">marvin</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-[#F3F4F6] p-4">
          <p className="text-xs text-brand-muted">Wake score</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-brand-charcoal">
            {telemetry.wakeScore.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl bg-[#F3F4F6] p-4">
          <p className="text-xs text-brand-muted">Last heard</p>
          <p className="mt-1 text-sm font-semibold text-brand-charcoal">{telemetry.lastHeard}</p>
        </div>
        <div className="rounded-xl bg-[#F3F4F6] p-4">
          <p className="text-xs text-brand-muted">Audio streamed</p>
          <p className="mt-1 text-sm font-semibold text-brand-charcoal">
            {telemetry.audioBytes > 0 ? `${(telemetry.audioBytes / 1024).toFixed(0)} KB` : "0 KB"}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ResourceSyncStrip({ telemetry }: { telemetry: DeviceTelemetry }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { icon: Cpu, label: "CPU", value: `${telemetry.cpuPercent}%`, sub: `under ${DEVICE_LIMITS.cpuPercent}%` },
        { icon: HardDrive, label: "RAM", value: `${telemetry.ramKb} KB`, sub: `under ${DEVICE_LIMITS.ramKb} KB` },
        { icon: Timer, label: "Latency", value: `${telemetry.wordToPiMs} ms`, sub: "word → Pi" },
        { icon: Activity, label: "OLED", value: `C ${telemetry.oledCpu}%`, sub: `K ${telemetry.oledKeyword.toFixed(2)}` },
      ].map(({ icon: Icon, label, value, sub }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-brand-muted">{label}</p>
            <p className="text-lg font-bold tabular-nums text-brand-charcoal">{value}</p>
            <p className="text-[11px] text-brand-muted">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OledPreview({ telemetry }: { telemetry: DeviceTelemetry }) {
  return (
    <article className="dash-card overflow-hidden">
      <div className="border-b border-[#E5E7EB] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">OLED · 128×64</p>
        <p className="text-sm font-semibold text-brand-charcoal">On-device display</p>
      </div>
      <div className="relative aspect-[4/3] bg-black">
        <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono text-[#5eb8ff]">
          <div className="flex items-start justify-between">
            <div className="text-2xl leading-none">:)</div>
            <div className="text-right text-[10px] font-bold tracking-widest">ANUVAANI</div>
          </div>
          <div className="space-y-1 text-sm">
            <p>SPEECH</p>
            <p className="tabular-nums">K {telemetry.oledKeyword.toFixed(2)}</p>
            <p className="tabular-nums">C {telemetry.oledCpu}%</p>
            <p className="tabular-nums text-[11px] text-[#5eb8ff]/70">
              R {(telemetry.ramKb / DEVICE_LIMITS.ramKb).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
