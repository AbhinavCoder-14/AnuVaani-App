"use client";

import { fleetHealth, getActiveAlerts } from "@/lib/data/deployments";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function StatusBar() {
  const alerts = getActiveAlerts();
  const hasIssue = alerts.length > 0;
  const [updated, setUpdated] = useState("2 minutes ago");

  const border = hasIssue ? "border-l-brand-warning" : "border-l-brand-mint";
  const headline = hasIssue
    ? `${alerts.length} alert${alerts.length === 1 ? "" : "s"} active`
    : "All systems nominal";

  return (
    <div className={`dash-card flex flex-col gap-3 border-l-4 ${border} px-5 py-4 md:flex-row md:items-center md:justify-between`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
          <span
            className={`h-2 w-2 rounded-full ${hasIssue ? "bg-brand-warning" : "bg-brand-mint"}`}
            aria-hidden
          />
          {headline}
        </p>
        {hasIssue && (
          <p className="text-sm text-brand-body">
            {alerts[0].device.city} node offline ({alerts[0].device.offlineDuration})
          </p>
        )}
        <p className="text-sm text-brand-muted">
          {fleetHealth.devicesOnline}/{fleetHealth.devicesTotal} online
        </p>
        <p className="text-sm text-brand-muted">Uptime: {fleetHealth.avgUptime}%</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs text-brand-muted">Last updated: {updated}</p>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 text-xs font-semibold text-brand-charcoal hover:bg-gray-50"
          onClick={() => setUpdated("just now")}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>
    </div>
  );
}
