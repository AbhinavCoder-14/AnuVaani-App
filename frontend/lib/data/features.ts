export const marqueeItems = [
  "Custom Keyword",
  "TensorFlow Lite Micro",
  "DS-CNN",
  "Pico SDK",
  "Open Source",
  "Hybrid Edge-Cloud",
] as const;

export const pipelineStages = [
  {
    title: "Always-On Stage",
    subtitle: "Continuous listening under solar power budget",
    description:
      "INMP441 mic feeds audio through MFCC extraction into a DS-CNN classifier. Under 10% CPU. Under 256 KB RAM. Runs 24/7 on solar-powered kiosks, field nodes, and disaster monitoring stations.",
  },
  {
    title: "Keyword Detection",
    subtitle: "The moment of decision — on device",
    description:
      "When confidence exceeds threshold, the system acts in under 165 ms. Wake-word logic stays local. Train Hindi, Tamil, Telugu, or Marathi keywords. No Alexa. No Google. No proprietary SDK.",
  },
  {
    title: "Post-Wake Stream",
    subtitle: "Cloud ASR only when connectivity allows",
    description:
      "Subsequent audio streams to remote ASR only after a true positive. 99% of audio never leaves the device. Works fully offline — cloud is optional, not required.",
  },
] as const;

export const primaryFeature = {
  title: "Custom Keyword Training",
  subtitle: "Your wake word. Not a global assistant keyword.",
  command: '$ AnuVaani train --keyword "Jaagroo"',
  progress: 80,
  body: "One CLI command turns 50 voice samples into a deployable INT8 model. No pre-trained generic keywords. No proprietary voice SDKs.",
  detail:
    "Train wake words in Hindi, Tamil, Telugu, or Marathi for village kiosks, flood alert nodes, or agricultural field stations. Same DS-CNN pipeline, different training data.",
  comparison: "Proprietary SDK → Rs 0 open source",
} as const;

export const secondaryFeatures = [
  {
    title: "Hybrid Edge-Cloud Pipeline",
    subtitle: "Edge wakes. Cloud transcribes.",
    description:
      "The microcontroller handles keyword spotting locally. ASR runs remotely only after a true positive. 165 ms handoff vs 2–5 second full-cloud round trips — critical for disaster alerts and civic kiosks.",
  },
  {
    title: "Resource-Bounded Runtime",
    subtitle: "Built for ₹600 microcontrollers",
    description:
      "198 KB RAM, 8.7% idle CPU, 38.6 KB flash model. Stays under 256 KB RAM and under 10% CPU — runs weeks on solar in remote fields and mountain monitoring stations.",
  },
  {
    title: "Privacy-Preserving Design",
    subtitle: "Indian data stays on Indian hardware",
    description:
      "99.2% of captured audio is discarded on-device. No continuous cloud upload. Citizens asking for land records, welfare benefits, or health info — audio never leaves the kiosk until they speak the wake word.",
  },
] as const;

export const featureFloatingBadges = [
  { value: "Rs 0", label: "proprietary SDKs", className: "right-[8%] top-[6%] rotate-[2deg]" },
  { value: "< 200 ms", label: "KWS to ASR", className: "left-[2%] top-[38%] -rotate-[1deg]" },
  { value: "256 KB", label: "RAM ceiling", className: "right-[18%] top-[42%] rotate-[1.5deg]" },
] as const;

export const heroFloatingMetrics: Array<{
  value: string;
  label: string;
  delta?: string;
  className: string;
}> = [
  { value: "98.2%", label: "true positive rate", className: "left-[-12%] top-[8%] -rotate-[1.5deg]" },
  { value: "0.8%", label: "false activations", delta: "near-zero", className: "right-[-4%] top-[4%] rotate-[2deg]" },
  { value: "Rs 1,150", label: "edge node BOM", className: "left-[-8%] bottom-[22%] rotate-[1deg]" },
  {
    value: "165 ms",
    label: "keyword-to-ASR",
    delta: "<200ms",
    className: "right-[-6%] bottom-[18%] -rotate-[1.5deg]",
  },
];

export const performanceMetrics = [
  {
    label: "RAM Usage",
    value: "198 KB",
    used: 198,
    limit: 256,
    unit: "of 256 KB",
    headroom: "22% room",
  },
  {
    label: "CPU Idle",
    value: "8.7%",
    used: 8.7,
    limit: 10,
    unit: "of 10% max",
    headroom: "13% room",
  },
  {
    label: "Latency",
    value: "165 ms",
    used: 165,
    limit: 200,
    unit: "of 200 ms",
    headroom: "17% room",
  },
  {
    label: "FAR",
    value: "0.8%",
    used: 0.8,
    limit: 5,
    unit: "near-zero",
    headroom: "Within spec",
  },
] as const;

export const certificateMeta = {
  hash: "0x8a2f4c9e1d3b7f2a8e5c1d9b4f6a2e7c",
  generated: "Aug 30, 2026",
  devices: 8,
  keywords: 5,
  days: 14,
} as const;
