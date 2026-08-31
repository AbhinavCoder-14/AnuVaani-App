"use client";

import { Cpu, Download, MapPin, Mic, Puzzle, Check } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";

const steps = [
  {
    title: "Assemble Hardware",
    description: "Connect 3 components. No soldering. Snap-fit connectors.",
    time: "30 min",
    icon: Puzzle,
    detail: ["Raspberry Pi Pico 2 W", "INMP441 I2S Microphone", "SSD1306 OLED Display", "4 jumper wires", "Total cost: Rs 1,150", "No soldering required"],
  },
  {
    title: "Flash Firmware",
    description: "One command. Pre-built binary. Plug USB, run, done.",
    time: "15 min",
    icon: Download,
    detail: ["picotool load firmware.uf2", "Pre-built INT8 DS-CNN binary", "USB mass-storage mode", "No compiler required"],
  },
  {
    title: "Train Your Word",
    description: "Say your keyword 50 times. Any language. The CLI handles the rest.",
    time: "20 min",
    icon: Mic,
    detail: ["Any language or dialect", "50 spoken samples", "Negative samples collected automatically", "CLI trains on-device"],
  },
  {
    title: "Mount on Bench",
    description: "Secure to rack or test fixture. Connect bench power. Ready for evaluation.",
    time: "10 min",
    icon: MapPin,
    detail: ["19-inch rack or bench mount", "Bench power supply", "Optional EMI enclosure", "USB tether for sync"],
  },
  {
    title: "Run Evaluation",
    description: "Metrics flow to the eval console. PS 26172 criteria tracked live.",
    time: "Instant",
    icon: Cpu,
    detail: ["Always-on keyword spotting", "RAM and CPU telemetry", "Latency histograms", "Certificate-ready exports"],
  },
];

function BackgroundSchematic() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-[0.05] lg:block"
      viewBox="0 0 1200 520"
      aria-hidden
    >
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 40 + (i % 6) * 190;
        const y = 60 + Math.floor(i / 6) * 150;
        return <circle key={i} cx={x} cy={y} r={18} fill="none" stroke="#1A1A1A" strokeWidth="1.5" />;
      })}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`l-${i}`}
          x1={58 + (i % 5) * 190}
          y1={60 + Math.floor(i / 5) * 150}
          x2={230 + (i % 5) * 190}
          y2={210 + Math.floor(i / 5) * 40}
          stroke="#1A1A1A"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function Connector({ delay, reduce, started }: { delay: number; reduce: boolean | null; started: boolean }) {
  const visible = reduce || started;
  return (
    <svg viewBox="0 0 88 40" className="hidden h-10 w-[72px] shrink-0 lg:block xl:w-24" aria-hidden>
      <path d="M 4 20 C 28 6, 60 34, 84 20" stroke="#E5E7EB" strokeWidth="2" fill="none" strokeDasharray="6 6" />
      <motion.path
        d="M 4 20 C 28 6, 60 34, 84 20"
        stroke="#00A896"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, delay, ease: "easeInOut" }}
      />
      {!reduce && started && (
        <motion.circle
          r="3.5"
          fill="#00A896"
          initial={{ cx: 4, cy: 20, opacity: 0 }}
          animate={{ cx: [4, 28, 60, 84], cy: [20, 8, 32, 20], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.4, delay, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

function StepNode({
  step,
  index,
  started,
  reduce,
}: {
  step: (typeof steps)[number];
  index: number;
  started: boolean;
  reduce: boolean | null;
}) {
  const [hover, setHover] = useState(false);
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const Icon = step.icon as ComponentType<{ className?: string }>;
  const delayMs = (0.6 + index * 0.4) * 1000;

  useEffect(() => {
    if (reduce) {
      setPhase("done");
      return;
    }
    if (!started) return;
    const activate = window.setTimeout(() => setPhase("active"), delayMs);
    const complete = window.setTimeout(() => setPhase("done"), 3000);
    return () => {
      window.clearTimeout(activate);
      window.clearTimeout(complete);
    };
  }, [started, reduce, delayMs]);

  const filled = phase !== "idle";

  return (
    <div
      className="relative flex flex-1 flex-col items-start gap-3 lg:items-center lg:text-center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px]"
        initial={{ scale: 0.8, opacity: 0, backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
        animate={
          started || reduce
            ? {
                scale: phase === "done" && !reduce ? [1, 1.08, 1] : 1,
                opacity: 1,
                backgroundColor: filled ? "#00A896" : "#FFFFFF",
                borderColor: filled ? "#00A896" : "#E5E7EB",
                boxShadow: filled ? "0 0 20px rgba(0,168,150,0.3)" : "none",
              }
            : { opacity: started ? 1 : 0 }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: { delay: 3, duration: 0.3 },
                backgroundColor: { delay: delayMs / 1000, duration: 0.3 },
                borderColor: { delay: delayMs / 1000, duration: 0.3 },
                opacity: { delay: 0.6, duration: 0.3 },
              }
        }
      >
        {phase === "done" ? (
          <Check className="h-5 w-5 text-white" />
        ) : (
          <Icon className={`h-5 w-5 ${filled ? "text-white" : "text-[#C5C5C5]"}`} />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={started || reduce ? { opacity: 1, y: 0 } : {}}
        transition={reduce ? { duration: 0 } : { delay: 0.6 + index * 0.4 + 0.15, duration: 0.2 }}
      >
        <p className="text-sm font-semibold text-brand-charcoal">{step.title}</p>
        <p className="mt-1 max-w-[200px] text-sm leading-relaxed text-brand-body">{step.description}</p>
        <span className="mt-2 inline-flex rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs font-semibold text-brand-teal">
          {step.time}
        </span>
      </motion.div>

      {hover && (
        <div className="absolute bottom-[calc(100%+12px)] left-0 z-20 hidden w-56 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-card lg:block">
          <p className="text-sm font-semibold text-brand-charcoal">{step.title}</p>
          <ul className="mt-2 space-y-1 text-xs text-brand-body">
            {step.detail.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DeploymentJourney() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const started = Boolean(inView);

  return (
    <section id="deploy" ref={ref} className="relative bg-white py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BackgroundSchematic />
      </div>
      <div className="page-container relative">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={started || reduce ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            <span className="block text-brand-faint">The engineering is complex.</span>
            <span className="block text-brand-charcoal">Deploying it isn&apos;t.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-brand-muted">
            From unboxing a Pico 2 W to a PS 26172-ready evaluation bench. Five steps. Under two
            hours. No proprietary voice SDK required.
          </p>
        </motion.div>

        <div className="mt-16 hidden items-start justify-center lg:flex">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start">
              <StepNode step={step} index={i} started={started} reduce={reduce} />
              {i < steps.length - 1 && (
                <div className="pt-1">
                  <Connector delay={1 + i * 0.4} reduce={reduce} started={started} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-0 lg:hidden">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  {i < steps.length - 1 && <div className="my-1 w-px flex-1 bg-brand-teal" />}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-semibold text-brand-charcoal">{step.title}</p>
                  <p className="mt-1 text-sm text-brand-body">{step.description}</p>
                  <span className="mt-2 inline-flex rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs font-semibold text-brand-teal">
                    {step.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={started || reduce ? { opacity: 1, y: 0 } : {}}
          transition={reduce ? { duration: 0 } : { delay: 3.2, duration: 0.4 }}
        >
          <p className="text-2xl font-semibold text-brand-charcoal">Total: under 2 hours</p>
          <p className="mt-1 text-base text-brand-muted">from hardware to evaluation-ready bench</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-primary">
              Open Eval Console
            </Link>
            <Link href="https://github.com" className="btn-ghost">
              Read the Docs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
