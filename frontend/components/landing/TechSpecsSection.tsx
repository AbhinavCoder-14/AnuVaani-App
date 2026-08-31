"use client";

import { ProgressMetricCard } from "@/components/shared/ProgressMetricCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { certificateMeta, performanceMetrics } from "@/lib/data/features";

const cardOffsets = [
  "md:ml-0",
  "md:ml-12",
  "md:ml-6",
  "md:ml-16",
];

export function TechSpecsSection() {
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
              environments. Published results from controlled bench testing.
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
    </SectionShell>
  );
}
