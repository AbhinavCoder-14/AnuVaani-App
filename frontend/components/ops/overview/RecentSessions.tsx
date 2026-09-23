"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { MessageSquareText, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 5000) return "Just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

const OUTCOME_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  failed: XCircle,
  in_progress: Clock,
  timeout: Clock,
};

const OUTCOME_COLOR: Record<string, string> = {
  completed: "text-ops-green",
  failed: "text-ops-red",
  in_progress: "text-ops-blue",
  timeout: "text-ops-amber",
};

export function RecentSessions() {
  const { recentSessions } = useOpsStore();

  return (
    <div className="ops-card flex-1 overflow-hidden">
      <div className="flex items-center justify-between border-b border-ops-border px-5 py-4">
        <h3 className="text-ops-h3 text-ops-text">Recent Sessions</h3>
        <Link href="/ops/sessions" className="text-ops-caption font-medium text-ops-teal hover:underline">
          View all →
        </Link>
      </div>
      <div className="divide-y divide-ops-border">
        {recentSessions.slice(0, 6).map((session) => {
          const Icon = OUTCOME_ICON[session.outcome] ?? Clock;
          const color = OUTCOME_COLOR[session.outcome] ?? "text-ops-text-secondary";
          const transcript = session.finalTranscript || session.currentPartial || "—";

          return (
            <Link
              key={session.id}
              href={`/ops/sessions/${session.id}`}
              className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-ops-bg/50"
            >
              <div className={`mt-0.5 shrink-0 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-ops-body font-medium text-ops-text">{session.deviceName}</p>
                  <span className="shrink-0 text-[11px] text-ops-text-secondary">
                    {formatRelativeTime(session.startTime)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-ops-caption text-ops-text-secondary">
                  {transcript.length > 60 ? transcript.substring(0, 60) + "…" : transcript}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-ops-text-secondary">
                  <span>{session.asrEngine}</span>
                  <span>·</span>
                  <span className={color}>
                    {session.outcome === "in_progress" ? "In progress" : session.outcome}
                  </span>
                  {session.durationMs && (
                    <>
                      <span>·</span>
                      <span>{(session.durationMs / 1000).toFixed(1)}s</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {recentSessions.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-10 text-ops-body text-ops-text-secondary">
          <MessageSquareText className="h-4 w-4" />
          No sessions yet
        </div>
      )}
    </div>
  );
}
