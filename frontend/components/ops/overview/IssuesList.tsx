"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { AlertTriangle, Wifi, Clock, MemoryStick, MonitorOff } from "lucide-react";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, typeof AlertTriangle> = {
  asr_unavailable: Wifi,
  telemetry_stale: Clock,
  session_timeout: Clock,
  memory_warning: MemoryStick,
  device_offline: MonitorOff,
};

const CATEGORY_LABELS: Record<string, string> = {
  asr_unavailable: "ASR endpoint unavailable",
  telemetry_stale: "Device telemetry stale",
  session_timeout: "Audio session timed out",
  memory_warning: "Runtime-memory warning",
  device_offline: "Device offline",
};

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

export function IssuesList() {
  const { openIssues } = useOpsStore();

  return (
    <div className="ops-card w-full overflow-hidden lg:w-80">
      <div className="flex items-center justify-between border-b border-ops-border px-5 py-4">
        <h3 className="text-ops-h3 text-ops-text">Attention Required</h3>
        {openIssues.length > 0 && (
          <span className="ops-badge bg-ops-red-light text-ops-red">
            {openIssues.length}
          </span>
        )}
      </div>
      <div className="divide-y divide-ops-border">
        {openIssues.map(({ device, issue }) => {
          const Icon = CATEGORY_ICONS[issue.category] ?? AlertTriangle;
          const label = CATEGORY_LABELS[issue.category] ?? issue.category;

          return (
            <Link
              key={issue.id}
              href={`/ops/devices/${device.id}`}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-ops-bg/50"
            >
              <div className={`mt-0.5 shrink-0 ${issue.severity === "error" ? "text-ops-red" : "text-ops-amber"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-ops-body font-medium text-ops-text">{label}</p>
                <p className="mt-0.5 truncate text-ops-caption text-ops-text-secondary">
                  {device.name}
                </p>
                <p className="mt-0.5 text-[11px] text-ops-text-secondary">
                  {formatRelativeTime(issue.raisedAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      {openIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-ops-body text-ops-text-secondary">
          <AlertTriangle className="h-5 w-5 text-ops-green" />
          <p>No issues</p>
          <p className="text-ops-caption">All systems operating normally</p>
        </div>
      )}
    </div>
  );
}
