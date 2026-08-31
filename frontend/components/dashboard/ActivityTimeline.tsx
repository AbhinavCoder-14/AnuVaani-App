"use client";

import { activationVolume, type TimeRange } from "@/lib/data/deployments";
import { useMemo, useState } from "react";

const ranges: { id: TimeRange; label: string }[] = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All Time" },
];

export function ActivityTimeline() {
  const [range, setRange] = useState<TimeRange>("7d");
  const data = activationVolume[range];

  const path = useMemo(() => {
    const max = Math.max(...data.values, 1);
    return data.values
      .map((value, i) => {
        const x = (i / (data.values.length - 1)) * 100;
        const y = 100 - (value / max) * 82 - 8;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [data]);

  const area = `${path} L 100 100 L 0 100 Z`;

  return (
    <section className="dash-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-brand-charcoal">Activation Volume</h2>
        <div className="flex rounded-lg border border-[#E5E7EB] p-0.5">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRange(item.id)}
              className={`h-8 rounded-md px-3 text-xs font-semibold ${
                range === item.id ? "bg-brand-teal text-white" : "text-brand-muted hover:text-brand-charcoal"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 100 100" className="mt-6 h-48 w-full" preserveAspectRatio="none" aria-hidden>
        <path d={area} fill="rgba(0,168,150,0.08)" />
        <path d={path} fill="none" stroke="#00A896" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-brand-muted">
        {data.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#F3F4F6] pt-4 text-sm text-brand-body">
        <p>
          Total: <strong className="text-brand-charcoal">{data.total24h.toLocaleString()}</strong> (24h)
        </p>
        <p>
          Peak: <strong className="text-brand-charcoal">{data.peak.value.toLocaleString()}</strong> ({data.peak.date})
        </p>
        <p>
          Trend:{" "}
          <strong className="text-brand-teal">+{data.trend}%</strong>
        </p>
      </div>
    </section>
  );
}
