"use client";

import { SectionShell } from "@/components/shared/SectionShell";
import { pipelineStages } from "@/lib/data/features";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const STAGE_DELAYS = [0.15, 0.35, 0.55];

function SegmentedDivider({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="mt-10 flex w-full gap-3 md:mt-12 md:gap-4"
      aria-hidden
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-px flex-1 bg-[#E5E7EB]"
          initial={reduce ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.35,
            ease: easeOut,
          }}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
}

function StageBlock({
  stage,
  index,
}: {
  stage: (typeof pipelineStages)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  const delay = STAGE_DELAYS[index] ?? 0.15 + index * 0.2;
  const isLast = index === pipelineStages.length - 1;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay, duration: 0.5, ease: easeOut }}
      className={isLast ? "" : "mb-16 md:mb-20"}
    >
      <h3 className="text-lg font-semibold leading-snug text-brand-charcoal md:text-xl">
        {stage.title}
      </h3>
      <p className="mt-2 text-sm font-medium leading-snug text-brand-teal md:text-[15px]">
        {stage.subtitle}
      </p>
      <p className="mt-4 max-w-[680px] text-sm leading-[1.65] text-brand-body md:text-[15px]">
        {stage.description}
      </p>
      {!isLast && <SegmentedDivider delay={delay + 0.15} />}
    </motion.article>
  );
}

export function HowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="how-it-works" background="white">
      <div className="mx-auto w-full max-w-[1200px]">
        <header className="mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-[40px] leading-[1.08] tracking-[-0.02em] md:text-5xl lg:text-[56px]">
            <motion.span
              className="block font-normal text-brand-faint"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              How it
            </motion.span>
            <motion.span
              className="block font-bold text-brand-charcoal"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.08, duration: 0.45, ease: easeOut }}
            >
              actually works.
            </motion.span>
          </h2>
        </header>

        <div>
          {pipelineStages.map((stage, i) => (
            <StageBlock key={stage.title} stage={stage} index={i} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
