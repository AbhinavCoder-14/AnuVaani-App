"use client";

import { DeviceTable } from "@/components/ops/overview/DeviceTable";

export default function DevicesPage() {
  return (
    <div className="mx-auto max-w-ops space-y-6">
      <div>
        <h1 className="text-ops-h1 text-ops-text">Devices</h1>
        <p className="mt-1 text-ops-body text-ops-text-secondary">
          Which node or ASR endpoint needs attention?
        </p>
      </div>
      <DeviceTable />
    </div>
  );
}
