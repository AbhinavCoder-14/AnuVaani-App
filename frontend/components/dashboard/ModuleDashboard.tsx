"use client";

import { LiveStatusCard, QuotaMetrics, ResourceSyncStrip } from "@/components/dashboard/ModuleMetrics";
import { useDeviceTelemetry } from "@/hooks/useDeviceTelemetry";
import { demoDevice, pipelineModules } from "@/lib/data/device-demo";
import { Mic } from "lucide-react";

export function ModuleDashboard() {
  const { telemetry, lifecycle, triggerWake } = useDeviceTelemetry();

  const updatedLabel = telemetry.lastUpdated.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
            AnuVaani · Device Console
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-charcoal md:text-4xl">
            Module Telemetry
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {demoDevice.board} · wake word &quot;{demoDevice.keyword}&quot; · updated {updatedLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={triggerWake}
          disabled={lifecycle !== "listening"}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-brand-charcoal transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Mic className="h-4 w-4 text-brand-teal" />
          Test wake word
        </button>
      </header>

      <ResourceSyncStrip telemetry={telemetry} />
      <LiveStatusCard telemetry={telemetry} />
      <QuotaMetrics telemetry={telemetry} />

      <section className="dash-card p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">Module · PATH</p>
        <h2 className="mt-1 text-lg font-bold text-brand-charcoal">Edge pipeline stages</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Radio stays off until wake word is detected locally on {demoDevice.board}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pipelineModules.map((mod) => (
            <div
              key={mod.id}
              className={`rounded-xl px-3 py-4 text-center transition-colors ${
                mod.active
                  ? "bg-[#f5d547] text-[#0a1f4d]"
                  : "border border-[#E5E7EB] bg-[#F9FAFB] text-brand-charcoal"
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{mod.label}</p>
              <p className="mt-2 text-lg font-bold">{mod.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
