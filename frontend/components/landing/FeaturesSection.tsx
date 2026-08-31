"use client";

import { FloatingProofCard } from "@/components/shared/FloatingProofCard";
import { LanguageMarquee } from "@/components/shared/LanguageMarquee";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { TwoToneHeadline } from "@/components/shared/TwoToneHeadline";
import {
  featureFloatingBadges,
  primaryFeature,
  secondaryFeatures,
} from "@/lib/data/features";
import { motion, useReducedMotion } from "motion/react";

export function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="features" background="white">
      <div className="relative mb-10 md:mb-14">
        <Reveal>
          <TwoToneHeadline muted="Engineered for the edge." emphasis="Built to last." />
        </Reveal>

        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {featureFloatingBadges.map((badge, i) => (
            <FloatingProofCard
              key={badge.label}
              value={badge.value}
              label={badge.label}
              className={badge.className}
              delay={0.2 + i * 0.12}
            />
          ))}
        </div>
      </div>

      <Reveal delay={0.15}>
        <LanguageMarquee />
      </Reveal>

      <div className="mt-16 md:mt-20">
        <Reveal>
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-brand-charcoal md:text-2xl">
              {primaryFeature.title}
            </h3>
            <p className="mt-1 text-sm text-brand-teal">{primaryFeature.subtitle}</p>
          </div>
        </Reveal>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid gap-8 lg:grid-cols-[minmax(240px,320px)_1fr] lg:items-center lg:gap-12"
        >
          <div className="rounded-card border border-gray-200 bg-brand-charcoal p-5 shadow-card">
            <p className="font-mono text-xs text-brand-mint">terminal</p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-white md:text-base">
              {primaryFeature.command}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-gray-400">
                <span>Training progress</span>
                <span>{primaryFeature.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                <motion.div
                  className="h-full rounded-full bg-brand-teal"
                  initial={reduce ? { width: `${primaryFeature.progress}%` } : { width: 0 }}
                  whileInView={{ width: `${primaryFeature.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
            <p className="mt-4 font-mono text-xs text-brand-mint">{primaryFeature.comparison}</p>
          </div>

          <div className="max-w-[560px]">
            <p className="text-base leading-relaxed text-brand-body">{primaryFeature.body}</p>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">{primaryFeature.detail}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-16 border-t border-gray-200 md:mt-20">
        {secondaryFeatures.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-gray-200 py-8 md:py-10"
          >
            <h4 className="text-lg font-semibold text-brand-charcoal md:text-xl">{feature.title}</h4>
            <p className="mt-1 text-sm font-medium text-brand-teal">{feature.subtitle}</p>
            <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-brand-body">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}
