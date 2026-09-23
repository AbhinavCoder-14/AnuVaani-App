"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { useMemo } from "react";

/**
 * Stacked column chart showing session outcomes over time intervals.
 * Uses custom SVG — no chart library needed.
 */
export function ActivityChart() {
  const { getSessions } = useOpsStore();

  const { buckets, labels, maxVal } = useMemo(() => {
    const sessions = getSessions();
    const now = Date.now();
    const bucketCount = 12;
    const intervalMs = 5 * 60_000; // 5-minute buckets over the last hour

    const bkts = Array.from({ length: bucketCount }, () => ({
      completed: 0,
      failed: 0,
      noTranscript: 0,
    }));

    for (const s of sessions) {
      if (s.outcome === "in_progress") continue;
      const age = now - s.startTime.getTime();
      const idx = bucketCount - 1 - Math.min(Math.floor(age / intervalMs), bucketCount - 1);
      if (idx < 0 || idx >= bucketCount) continue;
      if (s.outcome === "completed") bkts[idx].completed++;
      else if (s.outcome === "failed") bkts[idx].failed++;
      else bkts[idx].noTranscript++;
    }

    const max = Math.max(...bkts.map((b) => b.completed + b.failed + b.noTranscript), 1);
    const lbls = Array.from({ length: bucketCount }, (_, i) => {
      const minsAgo = (bucketCount - 1 - i) * 5;
      return minsAgo === 0 ? "Now" : `-${minsAgo}m`;
    });

    return { buckets: bkts, labels: lbls, maxVal: max };
  }, [getSessions]);

  const barWidth = 100 / buckets.length;
  const barGap = barWidth * 0.25;
  const effectiveBarWidth = barWidth - barGap;

  return (
    <div className="ops-card flex-1 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-ops-h3 text-ops-text">Session Activity</h3>
          <p className="text-ops-caption text-ops-text-secondary">Sessions by outcome over the last hour</p>
        </div>
        <div className="flex items-center gap-4 text-ops-caption">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-ops-teal" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-ops-amber" /> No transcript
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-ops-red" /> Failed
          </span>
        </div>
      </div>

      <svg viewBox="0 0 100 60" className="h-44 w-full" preserveAspectRatio="none" aria-label="Session activity chart">
        {buckets.map((bucket, i) => {
          const total = bucket.completed + bucket.failed + bucket.noTranscript;
          const x = i * barWidth + barGap / 2;
          const completedH = (bucket.completed / maxVal) * 50;
          const failedH = (bucket.failed / maxVal) * 50;
          const noTranscriptH = (bucket.noTranscript / maxVal) * 50;

          let y = 55;
          const bars = [];

          if (bucket.completed > 0) {
            bars.push(
              <rect key={`c-${i}`} x={x} y={y - completedH} width={effectiveBarWidth} height={completedH} fill="#0F766E" rx={0.8} />
            );
            y -= completedH;
          }
          if (bucket.noTranscript > 0) {
            bars.push(
              <rect key={`n-${i}`} x={x} y={y - noTranscriptH} width={effectiveBarWidth} height={noTranscriptH} fill="#B45309" rx={0.8} />
            );
            y -= noTranscriptH;
          }
          if (bucket.failed > 0) {
            bars.push(
              <rect key={`f-${i}`} x={x} y={y - failedH} width={effectiveBarWidth} height={failedH} fill="#B91C1C" rx={0.8} />
            );
          }

          return <g key={i}>{total > 0 ? bars : <rect x={x} y={54} width={effectiveBarWidth} height={1} fill="#E2E8F0" rx={0.5} />}</g>;
        })}
        {/* Baseline */}
        <line x1="0" y1="55" x2="100" y2="55" stroke="#E2E8F0" strokeWidth="0.3" />
      </svg>
      <div className="flex justify-between text-[10px] text-ops-text-secondary">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}
