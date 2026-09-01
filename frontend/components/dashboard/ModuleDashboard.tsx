"use client";

import Image from "next/image";

import { DeviceMirror } from "@/components/dashboard/DeviceMirror";
import { LiveStatusCard, OledPreview, QuotaMetrics, ResourceSyncStrip } from "@/components/dashboard/ModuleMetrics";
import { useDeviceScreen } from "@/hooks/useDeviceScreen";
import { demoDevice, deviceTelemetry, pipelineModules } from "@/lib/data/device-demo";

export function ModuleDashboard() {
  const { activeScreen, setActiveScreen } = useDeviceScreen("live");

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
          AnuVaani · Device Console
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-charcoal md:text-4xl">
          Module Telemetry
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          {demoDevice.board} · wake word &quot;{demoDevice.keyword}&quot;
        </p>
      </header>

      <ResourceSyncStrip telemetry={deviceTelemetry} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <DeviceMirror
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
        />
        <div className="space-y-6">
          <OledPreview telemetry={deviceTelemetry} />
          <div className="relative hidden overflow-hidden rounded-card border border-[#E5E7EB] md:block">
            <Image
              src="/images/device-modules/setup.jpg"
              alt="ESP32-S3 and Pi edge setup"
              width={800}
              height={500}
              className="h-40 w-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-3 left-4 text-xs font-medium text-white">
              ESP32-S3 edge node · Pi ASR on LAN
            </p>
          </div>
        </div>
      </div>

      <LiveStatusCard telemetry={deviceTelemetry} />
      <QuotaMetrics telemetry={deviceTelemetry} />

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
              className={`rounded-xl px-3 py-4 text-center ${
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

      <section className="dash-card p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">Module · ABOUT</p>
        <h2 className="mt-1 text-lg font-bold text-brand-charcoal">AnuVaani</h2>
        <div className="mt-4 space-y-2 text-sm leading-relaxed text-brand-body">
          <p>
            You say <strong className="text-brand-charcoal">{demoDevice.keyword}</strong>. The{" "}
            {demoDevice.board} decides. Audio leaves the chip only after that wake.
          </p>
          <p>
            This Pi is the ASR server on the LAN — not the cloud. No Alexa, no Hey Google, no commercial wake SDK.
          </p>
          <p>
            Trained on {demoDevice.trainers.toLocaleString()} real speakers. TFLM + ESP-NN.
          </p>
          <p className="font-mono text-xs text-brand-muted">
            {demoDevice.asrHost} · {demoDevice.asrModel}
          </p>
        </div>
      </section>
    </div>
  );
}
