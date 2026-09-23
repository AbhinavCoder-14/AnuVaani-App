import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-ops space-y-6">
      <div>
        <h1 className="text-ops-h1 text-ops-text">Settings</h1>
        <p className="mt-1 text-ops-body text-ops-text-secondary">
          Deployment metadata, integration configuration and permissions.
        </p>
      </div>
      <div className="ops-card flex flex-col items-center justify-center py-20 text-center">
        <Settings className="h-10 w-10 text-ops-text-secondary/40" />
        <p className="mt-4 text-ops-h3 text-ops-text-secondary">Settings coming soon</p>
        <p className="mt-2 max-w-sm text-ops-body text-ops-text-secondary">
          Configure deployment metadata, data source connections, alert thresholds,
          and user permissions.
        </p>
      </div>
    </div>
  );
}
