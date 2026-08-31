"use client";

import { aggregateMetrics, devices } from "@/lib/data/deployments";
import { Activity, Check, Lock, Radio, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (v / max) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#00A896"
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

export function DashboardPreview({ compact = false }: { compact?: boolean }) {
  const activeDevices = devices.filter((d) => d.status === "active").slice(0, 2);
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {!compact && (
        <>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute -left-4 top-8 z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-brand-teal text-white shadow-float md:flex"
          >
            <Radio className="h-4 w-4" />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="absolute -right-2 top-24 z-20 hidden rounded-full bg-brand-mint px-3 py-1 text-xs font-semibold text-white shadow-float md:block"
          >
            &lt; 200 ms
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="absolute bottom-16 -right-6 z-20 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-brand-charcoal shadow-float md:flex"
          >
            <Lock className="h-4 w-4" />
          </motion.div>
        </>
      )}

      <div
        className={`overflow-hidden rounded-2xl border border-gray-800 bg-brand-charcoal p-2 shadow-float ${
          compact ? "" : "rotate-1 md:rotate-[1deg]"
        }`}
      >
        <div className="rounded-xl bg-white p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Deployment Dashboard
              </p>
              <h3 className="text-sm font-bold text-brand-charcoal md:text-base">
                AnuVaani Dashboard
              </h3>
            </div>
            <span className="rounded-full bg-brand-mint/15 px-2.5 py-1 text-xs font-semibold text-brand-teal">
              {aggregateMetrics.devicesOnline}/{aggregateMetrics.devicesTotal} online
            </span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { v: aggregateMetrics.activationsToday.toLocaleString(), l: "Activations" },
              { v: `${aggregateMetrics.avgLatencyMs} ms`, l: "Latency" },
              { v: `${aggregateMetrics.farPercent}%`, l: "FAR" },
              { v: `${aggregateMetrics.devicesOnline}/${aggregateMetrics.devicesTotal}`, l: "Online" },
            ].map((m) => (
              <div key={m.l} className="rounded-lg bg-brand-surface-cool p-3">
                <p className="text-lg font-bold text-brand-charcoal">{m.v}</p>
                <p className="text-xs text-brand-muted">{m.l}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 rounded-lg border border-gray-100 bg-brand-surface p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Fleet Map
            </p>
            <div className="relative h-28 rounded-lg bg-gradient-to-br from-brand-teal/5 to-brand-mint/10">
              {devices.map((d) => (
                <span
                  key={d.id}
                  className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    d.status === "active" ? "bg-brand-teal" : "bg-brand-critical"
                  }`}
                  style={{
                    left: `${((d.lng - 68) / 28) * 100}%`,
                    top: `${100 - ((d.lat - 8) / 28) * 100}%`,
                  }}
                  title={`${d.city} (${d.language})`}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-brand-muted">
              {devices.slice(0, 4).map((d) => (
                <span key={d.id}>
                  {d.status === "active" ? "●" : "○"} {d.city} ({d.language})
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {activeDevices.map((d) => (
              <div key={d.id} className="rounded-lg border border-gray-100 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-charcoal">{d.name}</p>
                  <span className="flex items-center gap-1 text-xs text-brand-teal">
                    <Check className="h-3 w-3" /> Active
                  </span>
                </div>
                <p className="text-xs text-brand-muted">
                  {d.activationsToday} activations · {d.avgLatencyMs}ms · {d.farPercent}% FAR
                </p>
                <Sparkline data={d.trend} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {!compact && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="absolute -bottom-6 -left-4 z-30 hidden w-44 rounded-card border border-gray-200 bg-white p-3 shadow-float md:block"
        >
          <p className="text-xs text-brand-muted">Battery</p>
          <p className="text-sm font-bold text-brand-charcoal">94% Solar</p>
        </motion.div>
      )}

      {!compact && (
        <Link
          href="/dashboard"
          className="absolute -bottom-4 right-0 z-30 hidden rounded-card border border-gray-200 bg-white px-4 py-3 shadow-float transition-transform hover:-translate-y-0.5 md:block"
        >
          <p className="text-xs text-brand-muted">Language</p>
          <p className="text-sm font-bold text-brand-charcoal">Marathi · Sahayata · 98% TPR</p>
        </Link>
      )}
    </div>
  );
}

export function FloatingBadges() {
  const reduce = useReducedMotion();
  const badges = [
    { icon: Activity, color: "bg-brand-teal", label: "Voice" },
    { icon: Zap, color: "bg-gray-100 text-brand-charcoal", label: "Edge" },
    { icon: Check, color: "bg-brand-mint", label: "Verified" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {badges.map((b, i) => (
        <motion.div
          key={b.label}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
          className={`absolute flex h-11 w-11 items-center justify-center rounded-full text-white shadow-float ${b.color}`}
          style={{
            top: `${20 + i * 25}%`,
            right: `${5 + i * 8}%`,
          }}
        >
          <b.icon className="h-5 w-5" />
        </motion.div>
      ))}
    </div>
  );
}
