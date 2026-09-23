"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { useMemo } from "react";

const COLORS: Record<string, string> = {
  reporting: "#0F766E",
  stale: "#B45309",
  offline: "#B91C1C",
  unknown: "#94A3B8",
};

const LABELS: Record<string, string> = {
  reporting: "Reporting",
  stale: "Stale",
  offline: "Offline",
  unknown: "Unknown",
};

/**
 * Compact donut chart for device availability breakdown.
 * Categories are mutually exclusive and sum to the selected device total.
 */
export function AvailabilityDonut() {
  const { availabilityBreakdown, totalDevices } = useOpsStore();

  const segments = useMemo(() => {
    const entries = Object.entries(availabilityBreakdown).filter(([, v]) => v > 0);
    const total = Math.max(totalDevices, 1);
    let cumulativeAngle = -90; // start at top

    return entries.map(([key, value]) => {
      const angle = (value / total) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;

      // Calculate SVG arc
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = ((startAngle + angle) * Math.PI) / 180;
      const r = 38;
      const cx = 50;
      const cy = 50;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = angle > 180 ? 1 : 0;

      // If only one segment and it's 100%, draw a full circle
      const d =
        entries.length === 1
          ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`
          : `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;

      return { key, value, color: COLORS[key], d };
    });
  }, [availabilityBreakdown, totalDevices]);

  return (
    <div className="ops-card w-full p-5 lg:w-56">
      <h3 className="text-ops-h3 text-ops-text">Availability</h3>
      <p className="text-ops-caption text-ops-text-secondary">Device status breakdown</p>

      <div className="mx-auto mt-4 flex w-28 items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-28 w-28" aria-label="Availability donut chart">
          {segments.map((seg) => (
            <path
              key={seg.key}
              d={seg.d}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeLinecap="round"
            />
          ))}
          <text x="50" y="46" textAnchor="middle" className="fill-ops-text text-[14px] font-bold">
            {totalDevices}
          </text>
          <text x="50" y="58" textAnchor="middle" className="fill-ops-text-secondary text-[8px]">
            devices
          </text>
        </svg>
      </div>

      <div className="mt-4 space-y-2">
        {Object.entries(availabilityBreakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-ops-caption">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[key] }} />
              <span className="text-ops-text-secondary">{LABELS[key]}</span>
            </span>
            <span className="font-semibold tabular-nums text-ops-text">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
