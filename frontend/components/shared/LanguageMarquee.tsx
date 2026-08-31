"use client";

import { marqueeItems } from "@/lib/data/features";

const marqueeText = [...marqueeItems, ...marqueeItems].join("  ·  ");

export function LanguageMarquee() {
  return (
    <div className="group relative overflow-hidden border-y border-gray-100 py-5">
      <div className="marquee-track flex w-max gap-0">
        <span className="marquee-content px-8 text-base font-medium text-brand-muted">
          {marqueeText}
        </span>
        <span className="marquee-content px-8 text-base font-medium text-brand-muted" aria-hidden>
          {marqueeText}
        </span>
      </div>
    </div>
  );
}
