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
    <section className="relative overflow-hidden bg-white pt-8 md:pt-12">
      <div className="page-container grid min-h-[85dvh] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div className="relative z-10">
          <motion.span
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-teal"
          >
            ISRO PS 26172 · SIH 2026
          </motion.span>

          <Reveal>
            <TwoToneHeadline muted="Wake word on the edge." emphasis="Cloud-ready in 165 ms." />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[520px] text-base leading-relaxed text-brand-body md:text-lg">
              Ultra-lightweight keyword spotting on a low-power microcontroller. Detect your custom
              wake word locally, then stream audio to remote ASR with minimal latency and overhead.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary">
                Open Eval Console
              </Link>
              <Link href="#how-it-works" className="btn-ghost">
                How it works
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-0">
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
