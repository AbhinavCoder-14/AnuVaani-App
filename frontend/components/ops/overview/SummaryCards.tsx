"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { Monitor, MessageSquareText, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardDef {
  label: string;
  icon: typeof Monitor;
  getValue: (s: ReturnType<typeof useOpsStore>) => string;
  getSub: (s: ReturnType<typeof useOpsStore>) => string;
  color: string;
  iconBg: string;
  href?: string;
}

const CARDS: CardDef[] = [
  {
    label: "Reporting Devices",
    icon: Monitor,
    getValue: (s) => `${s.reportingDevices} / ${s.totalDevices}`,
    getSub: () => "With heartbeat in last 30s",
    color: "text-ops-teal",
    iconBg: "bg-ops-teal/10",
    href: "/ops/devices",
  },
  {
    label: "Active Voice Sessions",
    icon: MessageSquareText,
    getValue: (s) => `${s.activeSessions}`,
    getSub: () => "Currently receiving or processing",
    color: "text-ops-blue",
    iconBg: "bg-ops-blue/10",
    href: "/ops/sessions",
  },
  {
    label: "Transcription Completion",
    icon: CheckCircle2,
    getValue: (s) => `${s.transcriptionCompletion}%`,
    getSub: (s) => {
      const total = s.sessionOutcomes.completed + s.sessionOutcomes.failed + s.sessionOutcomes.noTranscript;
      return `${s.sessionOutcomes.completed} of ${total} sessions`;
    },
    color: "text-ops-green",
    iconBg: "bg-ops-green/10",
  },
  {
    label: "Open Issues",
    icon: AlertTriangle,
    getValue: (s) => `${s.openIssueCount}`,
    getSub: (s) => s.openIssueCount === 0 ? "No unresolved issues" : "Requires attention",
    color: (undefined as unknown as string), // computed below
    iconBg: (undefined as unknown as string),
  },
];

export function SummaryCards() {
  const store = useOpsStore();
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card, i) => {
        // Open Issues card color is dynamic
        const hasIssues = store.openIssueCount > 0;
        const color = i === 3 ? (hasIssues ? "text-ops-amber" : "text-ops-green") : card.color;
        const iconBg = i === 3 ? (hasIssues ? "bg-ops-amber/10" : "bg-ops-green/10") : card.iconBg;
        const Icon = card.icon;

        return (
          <button
            key={card.label}
            type="button"
            onClick={() => card.href && router.push(card.href)}
            className="ops-card-interactive p-5 text-left"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ops-caption font-medium text-ops-text-secondary">{card.label}</p>
                <p className={`mt-2 text-ops-metric tabular-nums ${color}`}>
                  {card.getValue(store)}
                </p>
                <p className="mt-1 text-ops-caption text-ops-text-secondary">{card.getSub(store)}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
