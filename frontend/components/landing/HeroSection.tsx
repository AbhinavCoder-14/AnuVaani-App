"use client";

import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { FloatingProofCard } from "@/components/shared/FloatingProofCard";
import { Reveal } from "@/components/shared/Reveal";
import { TwoToneHeadline } from "@/components/shared/TwoToneHeadline";
import { heroFloatingMetrics } from "@/lib/data/features";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-pad-hero relative overflow-x-hidden bg-white">
      <div className="page-container grid min-h-[85dvh] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="relative z-10">
          <motion.span
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-teal"
          >
            ISRO PS 26172 · Open Source
          </motion.span>

          <Reveal>
            <TwoToneHeadline muted="Voice for rural India." emphasis="Sovereign on the edge." />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[520px] text-base leading-relaxed text-brand-body md:text-lg">
              Open-source keyword spotting for government kiosks, disaster alert nodes, and
              agricultural IoT. Detect custom wake words in Hindi, Tamil, or Marathi locally — then
              stream to ASR only when needed. Under 256 KB RAM. Under 165 ms latency.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary">
                Open Dashboard
              </Link>
              <Link href="#how-it-works" className="btn-ghost">
                How it works
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative hidden overflow-visible py-8 pl-2 pr-6 md:block md:py-10 md:pl-4 md:pr-8">
          <div className="pointer-events-none absolute inset-0 overflow-visible">
            {heroFloatingMetrics.map((metric, i) => (
              <FloatingProofCard
                key={metric.label}
                value={metric.value}
                label={metric.label}
                delta={metric.delta}
                className={metric.className}
                delay={0.5 + i * 0.12}
              />
            ))}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 80 }}
            className="mx-auto w-[92%] max-w-[500px] origin-center scale-[0.92] md:w-[94%] md:max-w-[520px] md:scale-[0.94]"
          >
            <DashboardPreview />
          </motion.div>
        </div>

        <div className="relative md:hidden">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <DashboardPreview compact />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
