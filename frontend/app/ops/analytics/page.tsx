import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-ops space-y-6">
      <div>
        <h1 className="text-ops-h1 text-ops-text">Analytics</h1>
        <p className="mt-1 text-ops-body text-ops-text-secondary">
          What patterns and evaluation results are emerging?
        </p>
      </div>
      <div className="ops-card flex flex-col items-center justify-center py-20 text-center">
        <BarChart3 className="h-10 w-10 text-ops-text-secondary/40" />
        <p className="mt-4 text-ops-h3 text-ops-text-secondary">Analytics coming soon</p>
        <p className="mt-2 max-w-sm text-ops-body text-ops-text-secondary">
          This section will include latency comparisons, evaluation results, and model-version analysis
          once sufficient session data is available.
        </p>
      </div>
    </div>
  );
}
