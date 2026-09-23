"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import type { OpsDevice } from "@/types/ops-device";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const AVAILABILITY_BADGE: Record<string, string> = {
  reporting: "ops-badge-reporting",
  stale: "ops-badge-stale",
  offline: "ops-badge-offline",
  unknown: "ops-badge-unknown",
};

const VOICE_STATE_LABELS: Record<string, string> = {
  listening: "Listening",
  evaluating: "Evaluating",
  streaming: "Streaming",
  idle: "Idle",
};

type SortKey = "name" | "availability" | "voiceState" | "lastSeen" | "issues";

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 5000) return "Just now";
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

export function DeviceTable() {
  const { devices } = useOpsStore();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = devices;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.site.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q),
      );
    }

    const compare = (a: OpsDevice, b: OpsDevice): number => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name);
        case "availability":
          return a.availability.localeCompare(b.availability);
        case "voiceState":
          return a.voiceState.localeCompare(b.voiceState);
        case "lastSeen":
          return a.lastSeen.getTime() - b.lastSeen.getTime();
        case "issues":
          return a.issues.filter((i) => !i.resolved).length - b.issues.filter((i) => !i.resolved).length;
        default:
          return 0;
      }
    };

    return [...result].sort((a, b) => (sortAsc ? compare(a, b) : -compare(a, b)));
  }, [devices, search, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      onClick={() => handleSort(field)}
      className="cursor-pointer select-none hover:text-ops-text"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === field && <span className="text-[10px]">{sortAsc ? "▲" : "▼"}</span>}
      </span>
    </th>
  );

  return (
    <div className="ops-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-ops-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-ops-h3 text-ops-text">Device Fleet</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ops-text-secondary" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-lg border border-ops-border bg-ops-bg pl-9 pr-3 text-ops-body text-ops-text placeholder:text-ops-text-secondary/60 focus:border-ops-teal focus:outline-none focus:ring-1 focus:ring-ops-teal"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="ops-table w-full text-left">
          <thead>
            <tr>
              <SortHeader label="Device / Deployment" field="name" />
              <th>Location</th>
              <SortHeader label="Availability" field="availability" />
              <SortHeader label="Voice State" field="voiceState" />
              <th>ASR Endpoint</th>
              <SortHeader label="Last Activity" field="lastSeen" />
              <SortHeader label="Issues" field="issues" />
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((device) => {
              const openIssues = device.issues.filter((i) => !i.resolved).length;
              return (
                <tr key={device.id}>
                  <td>
                    <p className="font-medium text-ops-text">{device.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-ops-text-secondary">{device.id}</p>
                  </td>
                  <td>
                    <p className="text-ops-text">{device.site}</p>
                    <p className="mt-0.5 text-[11px] text-ops-text-secondary">{device.location}</p>
                  </td>
                  <td>
                    <span className={AVAILABILITY_BADGE[device.availability]}>
                      {device.availability.charAt(0).toUpperCase() + device.availability.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          device.voiceState === "streaming" || device.voiceState === "evaluating"
                            ? "animate-pulse bg-ops-teal"
                            : "bg-ops-text-secondary/40"
                        }`}
                      />
                      {VOICE_STATE_LABELS[device.voiceState]}
                    </span>
                  </td>
                  <td>
                    <p className="font-mono text-[11px]">{device.asrEndpoint.host}</p>
                    <span
                      className={`mt-0.5 text-[11px] ${
                        device.asrEndpoint.status === "available"
                          ? "text-ops-green"
                          : device.asrEndpoint.status === "unavailable"
                            ? "text-ops-red"
                            : "text-ops-text-secondary"
                      }`}
                    >
                      {device.asrEndpoint.status}
                    </span>
                  </td>
                  <td>
                    <p className="max-w-[180px] truncate text-[12px]">{device.lastActivity.event}</p>
                    <p className="mt-0.5 text-[11px] text-ops-text-secondary">
                      {formatRelativeTime(device.lastActivity.timestamp)}
                    </p>
                  </td>
                  <td>
                    {openIssues > 0 ? (
                      <span className="ops-badge bg-ops-red-light text-ops-red">{openIssues}</span>
                    ) : (
                      <span className="text-ops-caption text-ops-text-secondary">—</span>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/ops/devices/${device.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-ops-text-secondary transition-colors hover:bg-ops-bg hover:text-ops-teal"
                      aria-label={`View ${device.name} details`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-10 text-center text-ops-body text-ops-text-secondary">
          {search ? "No devices match your search." : "No devices registered."}
        </div>
      )}
    </div>
  );
}
