"use client";

import { marqueeItems } from "@/lib/data/features";

function MarqueeItems() {
  return (
    <>
      {marqueeItems.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex shrink-0 items-center gap-10 md:gap-12">
          <span className="whitespace-nowrap text-[15px] font-semibold leading-none tracking-[-0.01em] text-brand-charcoal md:text-[17px]">
            {item}
          </span>
          <span
            className="h-1 w-1 shrink-0 rounded-full bg-brand-faint"
            aria-hidden
          />
        </span>
      ))}
    </>
  );
}

function MarqueeStrip({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center px-10 md:px-14"
      aria-hidden={hidden}
    >
      <MarqueeItems />
    </div>
  );
}

export function LanguageMarquee() {
  return (
    <div className="group relative overflow-hidden border-y border-gray-100 bg-white py-6 md:py-7">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/90 to-transparent md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/90 to-transparent md:w-32"
        aria-hidden
      />

      <div className="marquee-track flex w-max items-center">
        <MarqueeStrip />
        <MarqueeStrip hidden />
      </div>
    </div>
  );
}
