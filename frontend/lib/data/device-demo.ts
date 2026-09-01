export type DeviceScreen = "live" | "quota" | "path" | "about";

export const DEVICE_LIMITS = {
  cpuPercent: 10,
  ramKb: 256,
  modelKb: 64,
} as const;

export const demoDevice = {
  id: "esp32-s3-01",
  name: "ESP32-S3 Node",
  keyword: "marvin",
  board: "ESP32-S3",
  asrHost: "Pi 10.50.97.202",
  asrModel: "vosk-model-small-en-us-0.15",
  sampleRate: "16 kHz",
  trainers: 2237,
} as const;

export const deviceScreens: Record<
  DeviceScreen,
  { label: string; title: string; subtitle: string; image: string }
> = {
  live: {
    label: "LIVE",
    title: "Listening",
    subtitle: "Waiting for marvin",
    image: "/images/device-modules/live.jpg",
  },
  quota: {
    label: "QUOTA",
    title: "What the PS scores",
    subtitle: "Last bench on this Pi",
    image: "/images/device-modules/quota.jpg",
  },
  path: {
    label: "PATH",
    title: "On the device, then the Pi",
    subtitle: "Radio stays off until the word is local",
    image: "/images/device-modules/path.jpg",
  },
  about: {
    label: "ABOUT",
    title: "AnuVaani",
    subtitle: "Custom wake word · edge hardware",
    image: "/images/device-modules/about.jpg",
  },
};

export const pipelineModules: Array<{
  id: string;
  label: string;
  value: string;
  active?: boolean;
}> = [
  { id: "mic", label: "Mic", value: "16 kHz" },
  { id: "gate", label: "Gate", value: "CNN off" },
  { id: "mfcc", label: "MFCC", value: "49×10", active: true },
  { id: "wake", label: "Wake", value: "on S3" },
  { id: "stream", label: "Stream", value: "after" },
  { id: "asr", label: "ASR", value: "Vosk" },
];

export const screenOrder: DeviceScreen[] = ["live", "quota", "path", "about"];

export interface DeviceTelemetry {
  cpuPercent: number;
  ramKb: number;
  modelKb: number;
  catchRate: number;
  falsePerHour: number;
  wordToPiMs: number;
  wakeScore: number;
  oledCpu: number;
  oledKeyword: number;
  lastHeard: string;
  audioBytes: number;
}

/** Bench readings from the ESP32-S3 module (matches on-device QUOTA / LIVE screens). */
export const deviceTelemetry: DeviceTelemetry = {
  cpuPercent: 8.7,
  ramKb: 186,
  modelKb: 42,
  catchRate: 78,
  falsePerHour: 0,
  wordToPiMs: 44,
  wakeScore: 0,
  oledCpu: 10,
  oledKeyword: 0,
  lastHeard: "node quiet",
  audioBytes: 0,
};
