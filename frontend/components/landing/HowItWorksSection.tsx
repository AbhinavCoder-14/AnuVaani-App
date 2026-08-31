"use client";

import Image from "next/image";

import { SectionShell } from "@/components/shared/SectionShell";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headlineLine1 = ["Edge", "wakes", "first."];
const headlineLine2 = ["Cloud", "transcribes", "later."];

const figmaFade =
  "linear-gradient(320deg, #F9F9F9 50%, rgba(249, 249, 249, 0) 82.43%)";

function HeadlineWord({ children }: { children: string }) {
  return (
    <span className="font-medium leading-[1.1] tracking-[-0.576px] text-[#1a1a1a] text-[clamp(1.75rem,3.74vw,3.59rem)]">
      {children}
    </span>
  );
}

export function HowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="how-it-works" background="white" className="overflow-hidden !py-0">
      <div className="mx-auto w-full max-w-[1536px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: easeOut }}
          className="flex flex-col items-start overflow-hidden rounded-[clamp(2rem,7.5vw,7.2rem)] bg-[#f9f9f9] px-[clamp(1.25rem,5vw,4.8rem)] py-[clamp(3rem,8.75vw,8.4rem)]"
        >
          {/* Header — Figma: 1382.4 × 126, space-between */}
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <h2 className="w-full max-w-[629px] shrink-0">
              <span className="flex flex-wrap items-start gap-x-[clamp(0.5rem,1vw,0.96rem)] gap-y-0">
                {headlineLine1.map((word) => (
                  <HeadlineWord key={word}>{word}</HeadlineWord>
                ))}
              </span>
              <span className="mt-0 flex flex-wrap items-start gap-x-[clamp(0.5rem,1vw,0.96rem)] gap-y-0">
                {headlineLine2.map((word) => (
                  <HeadlineWord key={word}>{word}</HeadlineWord>
                ))}
              </span>
            </h2>

            <div className="relative w-full max-w-[375px] shrink-0 pt-[clamp(0.5rem,1vw,0.96rem)] lg:pt-[15.36px]">
              <p className="font-light leading-[1.5] text-[#1a1a1a] text-[clamp(0.95rem,1.62vw,1.55rem)]">
                Three-stage pipeline: always-on listening, on-device keyword detection, optional
                cloud ASR. Works offline in villages with no internet.
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden h-full w-[min(862px,60vw)] lg:block"
                style={{ background: figmaFade }}
              />
            </div>
          </div>

          {/* Cards — Figma: pt 80.48px, pb 65.12px, 796 + 567 */}
          <div className="flex w-full min-w-0 flex-col gap-4 pt-[clamp(2rem,5.24vw,5.03rem)] pb-[clamp(1.5rem,4.24vw,4.07rem)] lg:flex-row lg:items-start lg:justify-between lg:gap-[19px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.1, duration: 0.6, ease: easeOut }}
              className="min-w-0 w-full lg:w-[57.58%]"
            >
              <div className="-rotate-[0.06deg]">
                <Image
                  src="/images/how-it-works/figma-left-card.png"
                  alt="Always-on keyword spotting pipeline — mic to DS-CNN classifier on Pico"
                  width={796}
                  height={459}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.18, duration: 0.6, ease: easeOut }}
              className="min-w-0 w-full lg:w-[41.02%]"
            >
              <div className="rotate-[0.09deg]">
                <Image
                  src="/images/how-it-works/figma-right-card.png"
                  alt="Post-wake ASR handoff — edge detection to cloud transcription flow"
                  width={567}
                  height={459}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Footer — Figma: gap 37.63px, Up to 30.72px, 45% at 142.08px */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}
            className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-center lg:gap-[clamp(1.25rem,2.45vw,2.35rem)]"
          >
            <div className="relative shrink-0">
              <div className="flex items-end justify-end">
                <span className="pb-[0.35em] font-medium leading-[1.1] text-[#1a1a1a] text-[clamp(1.1rem,2vw,1.92rem)]">
                  Under
                </span>
                <span className="font-medium leading-[0.73] text-[#1a1a1a] text-[clamp(3.5rem,9.26vw,8.88rem)]">
                  165
                </span>
                <span className="pb-[0.35em] font-medium leading-[1.1] text-[#1a1a1a] text-[clamp(1.1rem,2vw,1.92rem)]">
                  ms
                </span>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden h-full w-[min(777px,55vw)] lg:block"
                style={{ background: figmaFade }}
              />
            </div>

            <div className="relative w-full max-w-[522px]">
              <p className="font-light leading-[1.51] text-[#1a1a1a] text-[clamp(0.9rem,1.25vw,1.2rem)]">
                From keyword detection to local action in under 165 ms. Compare that to 2–5 second
                full-cloud round trips — the difference between a timely flood alert and a missed
                evacuation window.
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden h-full w-[min(1201px,85vw)] lg:block"
                style={{ background: figmaFade }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
