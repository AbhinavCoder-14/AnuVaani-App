"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DEVICE_LIMITS, type DeviceTelemetry } from "@/lib/data/device-demo";

export type DeviceLifecycle = "listening" | "wake_detected" | "streaming" | "processing";

export interface LiveDeviceTelemetry extends DeviceTelemetry {
  lifecycle: DeviceLifecycle;
  lastUpdated: Date;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitter(base: number, range: number, tick: number, seed: number) {
  return base + Math.sin((tick + seed) * 0.7) * range;
}

function buildTelemetry(tick: number, lifecycle: DeviceLifecycle): LiveDeviceTelemetry {
  const cpuPercent = clamp(
    jitter(8.7, 0.9, tick, 1),
    7.2,
    DEVICE_LIMITS.cpuPercent - 0.2,
  );
  const ramKb = Math.round(clamp(jitter(186, 8, tick, 2), 178, DEVICE_LIMITS.ramKb - 12));

  const wakeScore =
    lifecycle === "listening"
      ? clamp(jitter(0.04, 0.03, tick, 3), 0, 0.12)
      : lifecycle === "wake_detected"
        ? clamp(jitter(0.72, 0.08, tick, 4), 0.55, 0.95)
        : lifecycle === "streaming"
          ? clamp(jitter(0.85, 0.05, tick, 5), 0.7, 0.98)
          : 0;

  return {
    cpuPercent: Number(cpuPercent.toFixed(1)),
    ramKb,
    modelKb: 42,
    catchRate: 78,
    falsePerHour: 0,
    wordToPiMs: Math.round(jitter(44, 3, tick, 6)),
    wakeScore: Number(wakeScore.toFixed(2)),
    oledCpu: Math.round(cpuPercent),
    oledKeyword:
      lifecycle === "listening"
        ? 0
        : Number(jitter(0.72, 0.15, tick, 7).toFixed(2)),
    lastHeard: lifecycle === "listening" ? "node quiet" : "marvin · just now",
    audioBytes:
      lifecycle === "streaming" || lifecycle === "processing"
        ? Math.round(jitter(92000, 12000, tick, 8))
        : 0,
    lifecycle,
    lastUpdated: new Date(),
  };
}

export function useDeviceTelemetry() {
  const [tick, setTick] = useState(0);
  const [lifecycle, setLifecycle] = useState<DeviceLifecycle>("listening");

  const telemetry = useMemo(() => buildTelemetry(tick, lifecycle), [tick, lifecycle]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerWake = useCallback(() => {
    if (lifecycle !== "listening") return;
    setLifecycle("wake_detected");
    window.setTimeout(() => setLifecycle("streaming"), 1200);
    window.setTimeout(() => setLifecycle("processing"), 3800);
    window.setTimeout(() => setLifecycle("listening"), 6500);
  }, [lifecycle]);

  return { telemetry, lifecycle, triggerWake };
}
