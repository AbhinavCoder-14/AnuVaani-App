"use client";

import { SummaryCards } from "@/components/ops/overview/SummaryCards";
import { ActivityChart } from "@/components/ops/overview/ActivityChart";
import { AvailabilityDonut } from "@/components/ops/overview/AvailabilityDonut";
import { DeviceTable } from "@/components/ops/overview/DeviceTable";
import { RecentSessions } from "@/components/ops/overview/RecentSessions";
import { IssuesList } from "@/components/ops/overview/IssuesList";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-ops space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-ops-h1 text-ops-text">Deployment Overview</h1>
        <p className="mt-1 text-ops-body text-ops-text-secondary">
          Monitor voice nodes, speech sessions and service health.
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Activity chart + Availability donut */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <ActivityChart />
        <AvailabilityDonut />
      </div>

      {/* Device table */}
      <DeviceTable />

      {/* Recent sessions + Issues */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <RecentSessions />
        <IssuesList />
      </div>
    </div>
  );
}
