"use client";

import {
  devices,
  exportFleetCsv,
  type DeploymentDevice,
  type DeviceTab,
} from "@/lib/data/deployments";
import { ChevronDown, Download } from "lucide-react";
import { useMemo, useState } from "react";

type FleetFilter = "all" | "active" | "offline";

const tabs: { id: DeviceTab; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "hardware", label: "Hardware" },
  { id: "alerts", label: "Alerts" },
  { id: "confusion", label: "Confusion Matrix" },
];

function downloadCsv() {
  const blob = new Blob([exportFleetCsv()], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "edge-voice-node-fleet.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
      <polyline fill="none" stroke="#00A896" strokeWidth="2" points={points} />
    </svg>
  );
}

function ResourceBar({ used, max, label }: { used: number; max: number; label: string }) {
  const pct = max === 0 ? 0 : Math.min((used / max) * 100, 100);
  return (
    <div className="rounded-xl bg-[#F3F4F6] p-4">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-brand-charcoal">
        {used} <span className="text-sm font-medium text-brand-muted">/ {max}</span>
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-brand-teal" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-brand-muted">{pct.toFixed(1)}% used</p>
    </div>
  );
}

function PerformanceTab({ device }: { device: DeploymentDevice }) {
  const maxHist = Math.max(...device.latencyHistogram, 1);
  const bins = ["100ms", "150ms", "200ms", "250ms", "300ms"];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Detection Metrics (24h)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total triggers", value: device.activations24h || "—" },
            { label: `True pos (${device.tprPercent || 0}%)`, value: device.truePositives || "—" },
            { label: `False (${device.farPercent || 0}%)`, value: device.falseActivations || "—" },
            { label: "Avg latency", value: device.status === "active" ? `${device.avgLatencyMs} ms` : `${device.lastLatencyMs} ms` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-[#F3F4F6] p-4">
              <p className="text-2xl font-bold text-brand-charcoal">{item.value}</p>
              <p className="mt-1 text-xs text-brand-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Activation Trend (7d)</p>
        <Sparkline data={device.trend} />
        <div className="mt-1 flex justify-between text-xs text-brand-muted">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Latency Distribution</p>
        <div className="mt-4 flex h-32 items-end gap-2">
          {device.latencyHistogram.map((count, i) => (
            <div key={bins[i]} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-brand-teal/80"
                style={{ height: `${Math.max((count / maxHist) * 100, count ? 8 : 2)}%` }}
              />
              <span className="text-[10px] text-brand-muted">{bins[i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-brand-muted">
          Median: {device.medianLatencyMs} ms · P95: {device.p95LatencyMs} ms
        </p>
      </div>
    </div>
  );
}

function HardwareTab({ device }: { device: DeploymentDevice }) {
  const checks = [
    { label: "RAM < 256 KB", value: device.status === "active" ? `${device.ramKb} KB` : "n/a", pass: device.status !== "active" || device.ramKb < 256 },
    { label: "CPU idle < 10%", value: device.status === "active" ? `${device.cpuIdlePercent}%` : "n/a", pass: device.status !== "active" || device.cpuIdlePercent < 10 },
    { label: "Open-source only", value: "TFLite", pass: true },
    { label: "Custom keyword", value: device.keyword, pass: true },
    { label: "No pretrained global KW", value: "—", pass: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Resource Usage</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <ResourceBar used={device.ramKb} max={256} label="RAM" />
          <ResourceBar used={device.cpuIdlePercent} max={10} label="CPU (idle)" />
          <ResourceBar used={device.flashKb} max={2048} label="Flash (KB)" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Power</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-[#F3F4F6] p-4">
            <p className="text-xs text-brand-muted">Battery</p>
            <p className="mt-1 text-lg font-bold text-brand-charcoal">{device.batteryPercent}%</p>
            <p className="text-xs text-brand-muted">{device.charging ? "Charging" : "Not charging"}</p>
          </div>
          <div className="rounded-xl bg-[#F3F4F6] p-4">
            <p className="text-xs text-brand-muted">Solar input</p>
            <p className="mt-1 text-lg font-bold text-brand-charcoal">
              {device.solarActive ? "Active" : "Inactive"}
            </p>
            <p className="text-xs text-brand-muted">{device.solarWatts}W avg</p>
          </div>
          <div className="rounded-xl bg-[#F3F4F6] p-4">
            <p className="text-xs text-brand-muted">Est. runtime</p>
            <p className="mt-1 text-lg font-bold text-brand-charcoal">{device.estRuntimeDays} days</p>
            <p className="text-xs text-brand-muted">at current draw</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-charcoal">Network</p>
        <p className="mt-2 text-sm text-brand-body">Status: Offline (as designed)</p>
        <p className="text-sm text-brand-muted">Last sync: {device.lastSync}</p>
        <p className="text-sm text-brand-muted">Sync method: {device.syncMethod}</p>
        <p className="text-sm text-brand-muted">Data queued for upload: {device.queuedMb} MB</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-brand-charcoal">PS 26172 Compliance</p>
        <ul className="mt-3 divide-y divide-[#F3F4F6] rounded-xl border border-[#E5E7EB]">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="text-brand-body">
                {check.pass ? "Pass" : "Fail"} · {check.label}
              </span>
              <span className="font-mono text-xs text-brand-muted">{check.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AlertsTab({ device }: { device: DeploymentDevice }) {
  const active = device.status === "offline" ? device.alerts.filter((a) => a.severity === "critical").length : 0;

  return (
    <div>
      <p className="text-sm font-semibold text-brand-charcoal">Active alerts: {active}</p>
      {device.alerts.length === 0 ? (
        <p className="mt-4 text-sm text-brand-muted">No alerts in the last 14 days.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {device.alerts.map((alert) => (
            <li key={alert.date} className="rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">
                {alert.severity} · {alert.date}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand-charcoal">{alert.title}</p>
              <p className="mt-2 text-sm text-brand-body">{alert.impact}</p>
              <p className="mt-1 text-sm text-brand-muted">{alert.resolution}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ConfusionTab({ device }: { device: DeploymentDevice }) {
  const max = Math.max(...device.confusion.map((row) => row.count), 1);

  if (device.confusion.length === 0) {
    return <p className="text-sm text-brand-muted">No confusion data while this node is offline.</p>;
  }

  return (
    <div>
      <p className="text-sm font-semibold text-brand-charcoal">What the model confuses (last 14 days)</p>
      <p className="mt-1 text-sm text-brand-muted">Predicted: {device.keyword}</p>
      <ul className="mt-4 space-y-3">
        {device.confusion.map((row) => (
          <li key={row.actual}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-brand-body">{row.actual}</span>
              <span className="font-medium text-brand-charcoal">{row.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className={`h-full rounded-full ${row.kind === "correct" ? "bg-brand-teal" : "bg-brand-warning"}`}
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {device.confusionPair && (
        <p className="mt-5 text-sm text-brand-body">Top confusion pair: {device.confusionPair}</p>
      )}
      <p className="mt-1 text-sm text-brand-muted">Noise environment: avg {device.noiseDb} dB</p>
      {device.confusionRecommendation && (
        <p className="mt-2 text-sm text-brand-body">{device.confusionRecommendation}</p>
      )}
    </div>
  );
}

function DeviceRow({ device }: { device: DeploymentDevice }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DeviceTab>("performance");
  const online = device.status === "active";

  return (
    <article className="border-b border-[#F3F4F6] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col gap-3 px-5 py-4 text-left hover:bg-[#FAFAF8] md:flex-row md:items-center md:justify-between"
      >
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
            <span className={`h-2 w-2 rounded-full ${online ? "bg-brand-teal" : "bg-gray-400"}`} />
            {device.id} {device.name}
          </p>
          <p className="mt-1 text-sm text-brand-muted">
            {device.language} · {device.keyword} ·{" "}
            {online
              ? `${device.activations24h} activations · ${device.avgLatencyMs}ms · ${device.farPercent}% FAR`
              : `offline ${device.offlineDuration} · last ${device.lastLatencyMs}ms`}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full rounded-full bg-brand-teal" style={{ width: `${device.uptimePercent}%` }} />
            </div>
            <span className="text-xs text-brand-muted">{device.uptimePercent}% uptime</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal">
          {open ? "Collapse" : "Expand"}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="border-t border-[#F3F4F6] bg-white px-5 pb-6 pt-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-brand-muted">
                {device.city}, {device.state} · {device.language} · Keyword: {device.keyword}
              </p>
              <p className="text-sm text-brand-muted">
                Deployed: {device.deployedAt} · Uptime: {device.uptime}
              </p>
              <p className="font-mono text-xs text-brand-muted">Hardware: Pico 2 W + INMP441 + SSD1306</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                online ? "bg-brand-mint/15 text-brand-teal" : "bg-red-50 text-brand-critical"
              }`}
            >
              {online ? "Healthy" : "Offline"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`h-9 rounded-lg px-3 text-xs font-semibold ${
                  tab === item.id ? "bg-brand-teal text-white" : "border border-[#E5E7EB] text-brand-body"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "performance" && <PerformanceTab device={device} />}
            {tab === "hardware" && <HardwareTab device={device} />}
            {tab === "alerts" && <AlertsTab device={device} />}
            {tab === "confusion" && <ConfusionTab device={device} />}
          </div>
        </div>
      )}
    </article>
  );
}

export function DeviceFleet() {
  const [filter, setFilter] = useState<FleetFilter>("all");
  const filtered = useMemo(
    () => devices.filter((d) => (filter === "all" ? true : d.status === filter)),
    [filter],
  );

  return (
    <section className="dash-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#F3F4F6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-brand-charcoal">Device Fleet</h2>
        <div className="flex flex-wrap gap-2">
          {(["all", "active", "offline"] as FleetFilter[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`h-9 rounded-lg px-3 text-xs font-semibold capitalize ${
                filter === id ? "bg-brand-teal text-white" : "border border-[#E5E7EB] text-brand-body"
              }`}
            >
              {id === "active" ? "Online" : id}
            </button>
          ))}
          <button
            type="button"
            onClick={downloadCsv}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 text-xs font-semibold text-brand-charcoal hover:bg-gray-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>
      {filtered.map((device) => (
        <DeviceRow key={device.id} device={device} />
      ))}
    </section>
  );
}
