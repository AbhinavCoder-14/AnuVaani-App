"use client";

import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { SectionShell } from "@/components/shared/SectionShell";
import { aggregateMetrics } from "@/lib/data/deployments";
import { secondaryFeatures } from "@/lib/data/features";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cpu, Plus, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headlineWords = {
  line1: ["Monitor", "every", "node", "across"],
  line2: ["kiosks,", "fields,", "and", "alerts."],
};

const insightItems = [
  {
    id: "resource-bounded",
    title: secondaryFeatures[1].title,
    headline: secondaryFeatures[1].subtitle,
    description: secondaryFeatures[1].description,
    metricLabel: "RAM usage",
    metricValue: "198 KB",
    icon: Cpu,
    iconBg: "bg-brand-teal",
    chartPoints: [175, 180, 185, 188, 190, 193, 195, 196, 198, 198],
  },
  {
    id: "privacy-preserving",
    title: secondaryFeatures[2].title,
    headline: secondaryFeatures[2].subtitle,
    description: secondaryFeatures[2].description,
    metricLabel: "On-device discard",
    metricValue: "99.2%",
    icon: Shield,
    iconBg: "bg-brand-mint",
    chartPoints: [94, 95, 96, 97, 97.5, 98, 98.5, 99, 99.1, 99.2],
  },
] as const;

function HeadlineWord({
  children,
  muted = false,
  delay = 0,
}: {
  children: string;
  muted?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={`inline-block shrink-0 font-medium leading-[1.1] tracking-[-0.03em] ${
        muted ? "text-[#ccc]" : "text-brand-charcoal"
      } text-[clamp(2.25rem,7.5vw,3.6rem)]`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 0.55, ease: easeOut }}
    >
      {children}
    </motion.span>
  );
}

function MiniChart({ points, highlightIndex = 5 }: { points: number[]; highlightIndex?: number }) {
  const max = Math.max(...points, 1);
  const width = 120;
  const height = 48;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (v / max) * (height - 8) - 4;
    return { x, y };
  });
  const linePath = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-[120px]" aria-hidden>
      <path d={linePath} fill="none" stroke="#02C39A" strokeWidth="2" strokeLinecap="round" />
      {coords.map((p, i) =>
        i === highlightIndex ? (
          <g key={i}>
            <line
              x1={p.x}
              y1={p.y}
              x2={p.x}
              y2={height}
              stroke="#D1D5DB"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={p.x} cy={p.y} r="4" fill="#02C39A" />
          </g>
        ) : i === highlightIndex - 2 ? (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#F97316" />
        ) : null,
      )}
    </svg>
  );
}

function InsightHoverPill({
  item,
  isOpen,
  onHoverStart,
  onHoverEnd,
}: {
  item: (typeof insightItems)[number];
  isOpen: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const Icon = item.icon;

  return (
    <div
      className="relative"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      <div
        className={`overflow-hidden rounded-[34px] border border-[#f2f2f2] bg-white shadow-[0px_20px_36px_rgba(0,0,0,0.12)] transition-shadow ${
          isOpen
            ? "shadow-[0px_24px_48px_rgba(0,0,0,0.14)]"
            : "hover:shadow-[0px_24px_40px_rgba(0,0,0,0.16)]"
        }`}
      >
        <div className="flex w-full items-center justify-between px-6 py-5 text-left">
          <span className="text-xl font-normal tracking-[-0.02em] text-[#1a1a1a] md:text-2xl">
            {item.title}
          </span>
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#f2f2f2]">
            <Plus
              className={`h-5 w-5 text-brand-charcoal transition-transform duration-200 ${
                isOpen ? "rotate-45" : ""
              }`}
            />
          </span>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100 px-6 pb-6 pt-5">
                <p className="text-base font-semibold text-brand-charcoal">{item.headline}</p>
                <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-brand-muted">
                  {item.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3 rounded-full bg-[#f2f2f2] px-4 py-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-brand-muted">{item.metricLabel}</p>
                      <p className="text-lg font-bold text-brand-charcoal">{item.metricValue}</p>
                    </div>
                  </div>
                  <MiniChart points={[...item.chartPoints]} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function DashboardShowcaseSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <SectionShell id="intelligence" background="white" className="overflow-hidden">
      <div className="mx-auto w-full max-w-[1382px]">
        <header className="mb-[clamp(2.5rem,5vw,5rem)]">
          <h2 className="flex flex-col gap-0">
            <span className="flex flex-wrap items-start gap-x-[clamp(0.6rem,1.2vw,1rem)] gap-y-0">
              {headlineWords.line1.map((word, i) => (
                <HeadlineWord key={word} delay={i * 0.06}>
                  {word}
                </HeadlineWord>
              ))}
            </span>
            <span className="mt-0 flex flex-wrap items-start gap-x-[clamp(0.6rem,1.2vw,1rem)] gap-y-0">
              {headlineWords.line2.map((word, i) => (
                <HeadlineWord key={word} delay={0.24 + i * 0.06}>
                  {word}
                </HeadlineWord>
              ))}
            </span>
          </h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5, ease: easeOut }}
            className="mt-5 max-w-xl text-base text-brand-body"
          >
            Real-time telemetry from deployed edge nodes — village kiosks, flood sensors,
            and field stations. RAM, CPU, latency, and false-activation rates in one view.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-12 xl:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2, duration: 0.6, ease: easeOut }}
            className="flex flex-col gap-[30px]"
          >
            {insightItems.map((item) => (
              <InsightHoverPill
                key={item.id}
                item={item}
                isOpen={hoveredId === item.id}
                onHoverStart={() => setHoveredId(item.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.3, duration: 0.7, ease: easeOut }}
            className="relative min-h-[420px] pt-4 lg:min-h-[580px] lg:pt-8"
          >
            <div
              className="relative mx-auto w-full max-w-[720px] lg:ml-auto lg:mr-0 lg:max-w-none"
              style={{ perspective: "1400px" }}
            >
              <div
                className="relative shadow-[0_30px_45px_rgba(0,0,0,0.22)]"
                style={{
                  transform: "rotateY(-5deg) rotateX(3deg) rotateZ(1deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <DashboardPreview />
              </div>

              <div
                className="absolute -bottom-4 left-0 z-10 hidden w-[38%] max-w-[220px] overflow-hidden rounded-[40px] border-[11px] border-black bg-white shadow-[0_30px_45px_rgba(0,0,0,0.45)] md:block lg:-bottom-8 lg:left-[-4%]"
                style={{ transform: "rotateY(8deg) rotateZ(-3deg)" }}
              >
                <div className="bg-brand-charcoal px-4 py-2.5">
                  <p className="text-[11px] font-semibold text-white">AnuVaani Mobile</p>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="text-[10px] text-brand-muted">Activations today</p>
                    <p className="text-xl font-bold text-brand-charcoal">
                      {aggregateMetrics.activationsToday.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex h-20 items-end gap-1 px-1">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-brand-teal"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-brand-surface-cool p-2.5">
                      <p className="text-[9px] text-brand-muted">Latency</p>
                      <p className="text-sm font-bold">{aggregateMetrics.avgLatencyMs} ms</p>
                    </div>
                    <div className="rounded-lg bg-brand-surface-cool p-2.5">
                      <p className="text-[9px] text-brand-muted">Online</p>
                      <p className="text-sm font-bold">
                        {aggregateMetrics.devicesOnline}/{aggregateMetrics.devicesTotal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-14 text-center lg:mt-16"
        >
          <Link href="/dashboard" className="btn-primary">
            Open Full Dashboard
          </Link>
        </motion.div>
      </div>
    </SectionShell>
  );
}
