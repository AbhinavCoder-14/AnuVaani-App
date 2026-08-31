"use client";

import { ProgressMetricCard } from "@/components/shared/ProgressMetricCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import {
  certificateMeta,
  hardwareCard,
  performanceMetrics,
  softwareCard,
} from "@/lib/data/features";
import { ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const cardOffsets = [
  "md:ml-0",
  "md:ml-12",
  "md:ml-6",
  "md:ml-16",
];

export function TechSpecsSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="performance" background="white">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-balance md:text-5xl lg:text-6xl">
              <span className="block text-brand-faint">Every metric</span>
              <span className="block text-brand-charcoal">measured.</span>
              <span className="block text-brand-faint">Every claim</span>
              <span className="block text-brand-charcoal">verified.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[480px] text-base leading-relaxed text-brand-body">
              Tested on {certificateMeta.devices} physical devices, {certificateMeta.keywords}{" "}
              custom keywords, over {certificateMeta.days} continuous days. Bench hardware. Controlled
              environments. Published results aligned to PS 26172 evaluation criteria.
            </p>
          </Reveal>
        </div>

        <div className="relative hidden min-h-[420px] md:block">
          {performanceMetrics.map((metric, i) => (
            <ProgressMetricCard
              key={metric.label}
              {...metric}
              delay={0.15 + i * 0.15}
              className={`absolute ${cardOffsets[i]} ${i === 0 ? "top-0" : i === 1 ? "top-[88px]" : i === 2 ? "top-[200px]" : "top-[300px]"}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:hidden">
        {performanceMetrics.map((metric, i) => (
          <ProgressMetricCard key={metric.label} {...metric} delay={i * 0.08} className="w-full" />
        ))}
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.2, duration: 0.55 }}
        className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8"
      >
        <div className="rounded-card border border-gray-200 bg-brand-surface p-6 md:p-8">
          <h3 className="text-lg font-semibold text-brand-charcoal">{hardwareCard.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-body">{hardwareCard.intro}</p>
          <ul className="mt-5 space-y-2 font-mono text-sm text-brand-body">
            {hardwareCard.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-semibold text-brand-teal">{hardwareCard.footer}</p>
        </div>

        <div className="rounded-card border border-gray-200 bg-brand-surface p-6 md:p-8">
          <h3 className="text-lg font-semibold text-brand-charcoal">{softwareCard.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-body">{softwareCard.intro}</p>
          <ul className="mt-5 space-y-2 font-mono text-sm text-brand-body">
            {softwareCard.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-semibold text-brand-teal">{softwareCard.footer}</p>
        </div>
      </motion.div>

      <Reveal delay={0.25}>
        <div className="mt-10 rounded-card border border-gray-200 bg-white p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                <ShieldCheck className="h-4 w-4 text-brand-teal" />
                Cryptographically Signed
              </p>
              <p className="mt-2 font-mono text-xs text-brand-muted">
                SHA-256: {certificateMeta.hash}
              </p>
              <p className="mt-1 text-xs text-brand-muted">
                Generated: {certificateMeta.generated} · {certificateMeta.devices} devices ·{" "}
                {certificateMeta.keywords} keywords · {certificateMeta.days}d
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn-primary text-sm">
                Download Certificate PDF
              </button>
              <button type="button" className="btn-ghost text-sm">
                Verify on GitHub
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
