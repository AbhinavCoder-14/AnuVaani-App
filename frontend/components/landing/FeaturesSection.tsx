"use client";

import Image from "next/image";

import { FloatingProofCard } from "@/components/shared/FloatingProofCard";
import { LanguageMarquee } from "@/components/shared/LanguageMarquee";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import {
  featureFloatingBadges,
  primaryFeature,
  secondaryFeatures,
} from "@/lib/data/features";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headlineWords = {
  line1: ["Engineered", "for", "rural", "India."],
  line2: [
    { text: "Built", muted: true },
    { text: "to", muted: false },
    { text: "last.", muted: false },
  ],
};

const featureCards = [
  {
    title: primaryFeature.title,
    subtitle: primaryFeature.subtitle,
    description: `${primaryFeature.body} ${primaryFeature.detail}`,
    gridBg: "/images/how-it-works/left-grid-bg.png",
    visual: "terminal" as const,
  },
  {
    title: secondaryFeatures[0].title,
    subtitle: secondaryFeatures[0].subtitle,
    description: secondaryFeatures[0].description,
    gridBg: "/images/how-it-works/right-grid-bg.png",
    visual: "insights" as const,
  },
];

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
      } text-[clamp(2.75rem,8.8vw,8.88rem)]`}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay, duration: 0.55, ease: easeOut }}
    >
      {children}
    </motion.span>
  );
}

function TerminalVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="w-full max-w-[340px] rounded-[20px] border border-gray-200 bg-brand-charcoal p-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
      <p className="font-mono text-xs text-brand-mint">terminal</p>
      <p className="mt-3 font-mono text-sm leading-relaxed text-white md:text-[15px]">
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
            transition={{ delay: 0.35, duration: 0.8, ease: easeOut }}
          />
        </div>
      </div>
      <p className="mt-4 font-mono text-xs text-brand-mint">{primaryFeature.comparison}</p>
    </div>
  );
}

function InsightsVisual() {
  return (
    <div className="relative mx-auto h-[255px] w-full max-w-[476px]">
      <Image
        src="/images/how-it-works/right-finance-card.png"
        alt=""
        width={388}
        height={237}
        className="absolute left-[12%] top-[4%] z-10 h-auto w-[54%] max-w-[388px] drop-shadow-[0_20px_30px_rgba(205,204,204,0.5)]"
      />
      <Image
        src="/images/how-it-works/right-insights-card.png"
        alt=""
        width={449}
        height={270}
        className="absolute left-[18%] top-[18%] z-20 h-auto w-[66%] max-w-[449px] drop-shadow-[0_20px_30px_rgba(205,204,204,0.5)]"
      />
    </div>
  );
}

function FeatureCard({
  title,
  subtitle,
  description,
  gridBg,
  visual,
  index,
}: {
  title: string;
  subtitle: string;
  description: string;
  gridBg: string;
  visual: "terminal" | "insights";
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: easeOut }}
      className="relative overflow-hidden rounded-[38px] border border-[#e6e6e6] bg-[#f9f9f9] shadow-[0_46px_36px_-46px_rgba(205,204,204,0.6)]"
    >
      <div className="relative min-h-[411px] overflow-hidden">
        <Image
          src={gridBg}
          alt=""
          width={679}
          height={411}
          className="pointer-events-none absolute inset-x-0 top-0 h-[411px] w-full object-cover"
          aria-hidden
        />

        <div className="relative flex min-h-[344px] items-center justify-center px-6 pb-11 pt-14 md:px-10 md:pt-16">
          {visual === "terminal" ? <TerminalVisual /> : <InsightsVisual />}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[123px] bg-gradient-to-t from-[#f9f9f9] from-[35%] to-transparent"
          aria-hidden
        />
      </div>

      <div className="flex flex-col items-center gap-3 px-8 pb-12 pt-2 text-center md:px-12">
        <h3 className="max-w-[324px] text-[clamp(1.5rem,2.4vw,1.95rem)] font-bold leading-[1.3] tracking-[-0.02em] text-brand-charcoal">
          {title}
        </h3>
        <p className="text-xs font-medium text-brand-teal">{subtitle}</p>
        <p className="max-w-[445px] text-[clamp(0.9375rem,1.25vw,1.0625rem)] font-light leading-[1.5] text-brand-charcoal">
          {description}
        </p>
      </div>
    </motion.article>
  );
}

export function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="features" background="white" className="relative overflow-hidden">
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

      <Reveal delay={0.1}>
        <LanguageMarquee />
      </Reveal>

      <div className="section-stack mx-auto w-full max-w-[1382px]">
        <header className="mb-[clamp(3rem,5.6vw,5.375rem)]">
          <h2 className="flex flex-col gap-0">
            <span className="flex flex-wrap items-start gap-x-[clamp(0.75rem,1.5vw,1.44rem)] gap-y-0">
              {headlineWords.line1.map((word, i) => (
                <HeadlineWord key={word} delay={i * 0.06}>
                  {word}
                </HeadlineWord>
              ))}
            </span>
            <span className="mt-0 flex flex-wrap items-start gap-x-[clamp(0.75rem,1.5vw,1.44rem)] gap-y-0">
              {headlineWords.line2.map((word, i) => (
                <HeadlineWord
                  key={word.text}
                  muted={word.muted}
                  delay={0.24 + i * 0.06}
                >
                  {word.text}
                </HeadlineWord>
              ))}
            </span>
          </h2>
        </header>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: 0.35, duration: 0.6, ease: easeOut }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-[21px]"
        >
          {featureCards.map((card, index) => (
            <FeatureCard key={card.title} {...card} index={index} />
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}
