import { aggregateMetrics } from "@/lib/data/deployments";
import { MetricCard } from "@/components/shared/MetricCard";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";

export function MetricsStrip() {
  return (
    <SectionShell background="surface" className="!py-16 md:!py-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <MetricCard
            value={aggregateMetrics.activationsToday.toLocaleString()}
            label="Activations Today"
            delta={`+${aggregateMetrics.activationsDelta}%`}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <MetricCard
            value={`${aggregateMetrics.avgLatencyMs} ms`}
            label="Avg Latency KWS to ASR"
            delta={`${aggregateMetrics.latencyDelta} ms`}
          />
        </Reveal>
        <Reveal delay={0.2}>
          <MetricCard
            value={`${aggregateMetrics.farPercent}%`}
            label="False Accept Rate"
            delta={`${aggregateMetrics.farDelta}%`}
          />
        </Reveal>
        <Reveal delay={0.3}>
          <MetricCard
            value={`Rs ${aggregateMetrics.costPerDevice.toLocaleString("en-IN")}`}
            label="Cost Per Device"
          />
        </Reveal>
      </div>
      <Reveal delay={0.4}>
        <p className="mt-10 text-center text-sm italic text-brand-muted">
          Measured across 8 physical devices, 5 custom keywords, 14 days continuous evaluation.
        </p>
      </Reveal>
    </SectionShell>
  );
}
