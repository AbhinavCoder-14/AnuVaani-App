"use client";

import { motion, useReducedMotion } from "motion/react";

interface FloatingProofCardProps {
  value: string;
  label: string;
  delta?: string;
  className?: string;
  delay?: number;
}

export function FloatingProofCard({
  value,
  label,
  delta,
  className = "",
  delay = 0,
}: FloatingProofCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.45, type: "spring", stiffness: 120, damping: 18 }}
      className={`pointer-events-none absolute z-20 w-[120px] rounded-card border border-gray-100 bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-xl font-bold leading-none tracking-tight text-brand-charcoal">{value}</p>
        {delta && <span className="delta-badge text-[10px]">{delta}</span>}
      </div>
      <p className="mt-1.5 text-[11px] leading-tight text-brand-muted">{label}</p>
    </motion.div>
  );
}
