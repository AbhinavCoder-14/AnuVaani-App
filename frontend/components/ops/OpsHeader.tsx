"use client";

import { useOpsStore } from "@/hooks/useOpsStore";
import { Clock } from "lucide-react";

export function OpsHeader() {
  const { lastUpdate } = useOpsStore();

  const formattedTime = lastUpdate
    ? lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-ops-border bg-ops-card/95 px-6 backdrop-blur-sm">
      {/* Left: filters */}
      <div className="flex items-center gap-3">
        <select
          className="ops-btn h-8 cursor-pointer py-0 text-ops-caption"
          defaultValue="all-sites"
          aria-label="Site filter"
        >
          <option value="all-sites">All sites</option>
          <option value="isro-bengaluru">ISRO Bengaluru</option>
          <option value="sdsc-sriharikota">SDSC Sriharikota</option>
          <option value="prl-ahmedabad">PRL Ahmedabad</option>
          <option value="ursc-chennai">URSC Chennai</option>
          <option value="vssc-trivandrum">VSSC Trivandrum</option>
          <option value="iprc-mahendragiri">IPRC Mahendragiri</option>
        </select>
        <select
          className="ops-btn h-8 cursor-pointer py-0 text-ops-caption"
          defaultValue="all-devices"
          aria-label="Device filter"
        >
          <option value="all-devices">All devices</option>
        </select>
        <select
          className="ops-btn h-8 cursor-pointer py-0 text-ops-caption"
          defaultValue="1h"
          aria-label="Time range"
        >
          <option value="15m">Last 15 min</option>
          <option value="1h">Last hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>

      {/* Right: source status + last update */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="ops-badge-live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ops-green" />
            Live telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-ops-caption text-ops-text-secondary">
          <Clock className="h-3.5 w-3.5" />
          <span>Last update: {formattedTime}</span>
        </div>
      </div>
    </header>
  );
}
