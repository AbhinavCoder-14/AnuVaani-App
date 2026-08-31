"use client";

import { motion, useReducedMotion } from "motion/react";

interface ProgressMetricCardProps {
  label: string;
  value: string;
  used: number;
  limit: number;
  unit: string;
  headroom: string;
  delay?: number;
  className?: string;
}

export function ProgressMetricCard({
  label,
  value,
  used,
  limit,
  unit,
  headroom,
  delay = 0,
  className = "",
}: ProgressMetricCardProps) {
  const reduce = useReducedMotion();
  const percent = Math.min(100, Math.round((used / limit) * 100));

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`w-[200px] rounded-card border border-gray-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <p className="text-xs font-medium text-brand-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-brand-charcoal">{value}</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-surface-cool">
        <motion.div
          className="h-full rounded-full bg-brand-teal"
          initial={reduce ? { width: `${percent}%` } : { width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] text-brand-muted">{unit}</p>
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.55, type: "spring", stiffness: 200 }}
          className="text-[10px] font-semibold text-brand-teal"
        >
          {headroom}
        </motion.span>
      </div>
    </motion.div>
  );
}
