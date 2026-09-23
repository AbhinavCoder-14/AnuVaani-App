"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { MessageSquareText, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SessionOutcome } from "@/types/session";

const OUTCOME_STYLES: Record<string, { cls: string; label: string }> = {
  completed: { cls: "bg-ops-green-light text-ops-green", label: "Completed" },
  failed: { cls: "bg-ops-red-light text-ops-red", label: "Failed" },
  timeout: { cls: "bg-ops-amber-light text-ops-amber", label: "Timeout" },
  in_progress: { cls: "bg-ops-blue/10 text-ops-blue", label: "In progress" },
};

export default function SessionsPage() {
  const { getSessions } = useOpsStore();
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<SessionOutcome | "all">("all");

  const sessions = useMemo(() => {
    let result = getSessions();
    if (outcomeFilter !== "all") {
      result = result.filter((s) => s.outcome === outcomeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.deviceName.toLowerCase().includes(q) ||
          s.finalTranscript?.toLowerCase().includes(q) ||
          s.currentPartial?.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [getSessions, search, outcomeFilter]);

  return (
    <div className="mx-auto max-w-ops space-y-6">
      <div>
        <h1 className="text-ops-h1 text-ops-text">Sessions</h1>
        <p className="mt-1 text-ops-body text-ops-text-secondary">
          What happened during each voice interaction?
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ops-text-secondary" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border border-ops-border bg-ops-card pl-9 pr-3 text-ops-body text-ops-text placeholder:text-ops-text-secondary/60 focus:border-ops-teal focus:outline-none focus:ring-1 focus:ring-ops-teal"
          />
        </div>
        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value as SessionOutcome | "all")}
          className="ops-btn h-9 cursor-pointer py-0 text-ops-caption"
          aria-label="Filter by outcome"
        >
          <option value="all">All outcomes</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="timeout">Timeout</option>
          <option value="in_progress">In progress</option>
        </select>
      </div>

      {/* Session table */}
      <div className="ops-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ops-table w-full text-left">
            <thead>
              <tr>
                <th>Time</th>
                <th>Device</th>
                <th>Transcript</th>
                <th>ASR Engine</th>
                <th>Outcome</th>
                <th>Duration</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => {
                const style = OUTCOME_STYLES[s.outcome] ?? OUTCOME_STYLES.in_progress;
                return (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap text-ops-caption">
                      {s.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td>
                      <Link href={`/ops/devices/${s.deviceId}`} className="text-ops-body font-medium text-ops-teal hover:underline">
                        {s.deviceName}
                      </Link>
                    </td>
                    <td className="max-w-[300px] truncate">
                      <Link href={`/ops/sessions/${s.id}`} className="hover:text-ops-teal hover:underline">
                        {s.finalTranscript || s.currentPartial || "—"}
                      </Link>
                    </td>
                    <td className="text-ops-caption">{s.asrEngine}</td>
                    <td>
                      <span className={`ops-badge ${style.cls}`}>{style.label}</span>
                    </td>
                    <td className="tabular-nums text-ops-caption">
                      {s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="text-ops-caption text-ops-text-secondary">{s.reviewStatus}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sessions.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-10 text-ops-body text-ops-text-secondary">
            <MessageSquareText className="h-4 w-4" />
            {search || outcomeFilter !== "all" ? "No sessions match your filters." : "No sessions yet."}
          </div>
        )}
      </div>
    </div>
  );
}
