"use client";

import Image from "next/image";

import { SectionShell } from "@/components/shared/SectionShell";
import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headlineLine1 = ["Your", "key", "to", "strategic"];
const headlineLine2 = ["success", "through", "analytics"];

export function HowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <SectionShell id="how-it-works" background="white" className="overflow-hidden">
      <div className="mx-auto w-full max-w-[1536px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: easeOut }}
          className="overflow-hidden rounded-[clamp(2.5rem,7.5vw,7.2rem)] bg-[#f9f9f9] px-[clamp(1.25rem,5vw,4.8rem)] py-[clamp(3rem,8.75vw,8.4rem)]"
        >
          {/* Header */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <h2 className="max-w-[629px]">
              <span className="flex flex-wrap gap-x-[clamp(0.75rem,1vw,0.96rem)]">
                {headlineLine1.map((word) => (
                  <span
                    key={word}
                    className="font-medium leading-[1.1] tracking-[-0.01em] text-[#1a1a1a] text-[clamp(2rem,4.5vw,3.6rem)]"
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="mt-0 flex flex-wrap gap-x-[clamp(0.75rem,1vw,0.96rem)]">
                {headlineLine2.map((word) => (
                  <span
                    key={word}
                    className="font-medium leading-[1.1] tracking-[-0.01em] text-[#1a1a1a] text-[clamp(2rem,4.5vw,3.6rem)]"
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h2>

            <div className="relative max-w-[375px] lg:pt-[0.96rem]">
              <p className="font-light leading-[1.5] text-[#1a1a1a] text-[clamp(1rem,1.55vw,1.55rem)]">
                Ready for exciting, instantaneous, all-accessible insights in real time?
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden w-[862px] bg-gradient-to-l from-[#f9f9f9] from-50% to-transparent lg:block"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="mt-[clamp(2rem,5vw,5rem)] flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-[19px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.1, duration: 0.6, ease: easeOut }}
              className="w-full lg:max-w-[796px] lg:flex-[796]"
            >
              <div className="-rotate-[0.06deg]">
                <Image
                  src="/images/how-it-works/figma-left-card.png"
                  alt="Fast and easy access to analytics dashboard preview"
                  width={797}
                  height={489}
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
              className="w-full lg:max-w-[567px] lg:flex-[567]"
            >
              <div className="rotate-[0.09deg]">
                <Image
                  src="/images/how-it-works/figma-right-card.png"
                  alt="Widget control dashboard preview"
                  width={609}
                  height={512}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Footer stat */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.25, duration: 0.6, ease: easeOut }}
            className="mt-[clamp(2.5rem,6vw,5rem)] flex flex-col items-center gap-8 lg:flex-row lg:items-end lg:justify-center lg:gap-[clamp(1.5rem,2.45vw,2.35rem)]"
          >
            <div className="relative shrink-0">
              <div className="flex items-end justify-end">
                <span className="pb-[0.35em] font-medium leading-none text-[#1a1a1a] text-[clamp(1.25rem,2vw,1.92rem)]">
                  Up to
                </span>
                <span className="font-medium leading-[0.73] text-[#1a1a1a] text-[clamp(4.5rem,9vw,8.88rem)]">
                  45
                </span>
                <span className="font-medium leading-[0.73] text-[#1a1a1a] text-[clamp(4.5rem,9vw,8.88rem)]">
                  %
                </span>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden w-[777px] bg-gradient-to-l from-[#f9f9f9] from-50% to-transparent lg:block"
              />
            </div>

            <div className="relative max-w-[522px]">
              <p className="font-light leading-[1.5] text-[#1a1a1a] text-[clamp(0.95rem,1.25vw,1.2rem)]">
                Increase your analytics efficiency by up to 45%. Unique algorithms provide
                insights from data, reduce time for analysis and save time for making important,
                informed decisions
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[92%] hidden w-[1201px] bg-gradient-to-l from-[#f9f9f9] from-50% to-transparent lg:block"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
