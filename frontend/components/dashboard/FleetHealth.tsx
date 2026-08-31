"use client";

import { devices, fleetHealth } from "@/lib/data/deployments";
import { Check } from "lucide-react";

function Meter({
  value,
  max,
  invert = false,
}: {
  value: number;
  max: number;
  invert?: boolean;
}) {
  const ratio = Math.min(value / max, 1);
  const fill = invert ? Math.min(value / max, 1) : ratio;
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
      <div
        className={`h-full rounded-full ${invert && value > max * 0.8 ? "bg-brand-warning" : "bg-brand-teal"}`}
        style={{ width: `${fill * 100}%` }}
      />
    </div>
  );
}

export function FleetHealth() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <article className="dash-card p-6">
        <h2 className="text-sm font-semibold text-brand-charcoal">Operational Readiness</h2>
        <p className="mt-5 text-4xl font-bold tracking-tight text-brand-charcoal">
          {fleetHealth.devicesOnline} / {fleetHealth.devicesTotal}
        </p>
        <p className="mt-1 text-sm text-brand-muted">devices online</p>
        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Device status">
          {devices.map((device) => (
            <span
              key={device.id}
              title={`${device.name} (${device.status})`}
              className={`h-3 w-3 rounded-full ${
                device.status === "active" ? "bg-brand-teal" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-brand-muted">
          {devices.slice(0, 5).map((device) => (
            <span key={device.id}>
              {device.status === "active" ? "●" : "○"} {device.city}
            </span>
          ))}
        </div>
        <p className="mt-5 text-sm text-brand-body">Avg uptime: {fleetHealth.avgUptime}% (14d)</p>
        <p className="text-sm text-brand-muted">Last outage: {fleetHealth.lastOutage}</p>
      </article>

      <article className="dash-card p-6">
        <h2 className="text-sm font-semibold text-brand-charcoal">Detection Performance</h2>
        <div className="mt-5 space-y-5">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-brand-muted">True Positive Rate</p>
              <p className="text-2xl font-bold text-brand-charcoal">{fleetHealth.tpr}%</p>
            </div>
            <Meter value={fleetHealth.tpr} max={100} />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-brand-muted">False Accept Rate</p>
              <p className="text-2xl font-bold text-brand-charcoal">{fleetHealth.far}%</p>
            </div>
            <Meter value={fleetHealth.far} max={5} invert />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-brand-muted">Avg Latency</p>
              <p className="text-2xl font-bold text-brand-charcoal">{fleetHealth.avgLatencyMs} ms</p>
            </div>
            <Meter value={fleetHealth.avgLatencyMs} max={fleetHealth.latencyTargetMs} />
            <p className="mt-1 text-xs text-brand-muted">Target: {fleetHealth.latencyTargetMs} ms</p>
          </div>
        </div>
        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-mint/15 px-3 py-1 text-xs font-semibold text-brand-teal">
          <Check className="h-3.5 w-3.5" />
          PS 26172 Compliance: Pass
        </p>
      </article>

      <article className="dash-card p-6">
        <h2 className="text-sm font-semibold text-brand-charcoal">Cost and Efficiency</h2>
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-sm text-brand-muted">Bandwidth saved</p>
            <p className="text-3xl font-bold tracking-tight text-brand-charcoal">
              {fleetHealth.bandwidthSavedGb} GB
            </p>
            <p className="text-xs text-brand-muted">vs cloud streaming (14d)</p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">Estimated cost saved</p>
            <p className="text-3xl font-bold tracking-tight text-brand-charcoal">
              ₹{fleetHealth.costSavedInr.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-brand-muted">vs commercial SDK (14d)</p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-[#F3F4F6] pt-4">
            <div>
              <p className="text-xs text-brand-muted">Power efficiency</p>
              <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                Avg {fleetHealth.cpuIdleAvg}% CPU idle
              </p>
              <p className="text-xs text-brand-muted">{fleetHealth.solarDevices} devices solar-powered</p>
            </div>
            <div>
              <p className="text-xs text-brand-muted">Cost per activation</p>
              <p className="mt-1 text-sm font-semibold text-brand-charcoal">
                ₹{fleetHealth.costPerActivation.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
