interface MetricCardProps {
  value: string;
  label: string;
  delta?: string;
  compact?: boolean;
}

export function MetricCard({ value, label, delta, compact }: MetricCardProps) {
  return (
    <div className={`card-surface p-6 ${compact ? "" : "hover:-translate-y-1"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight text-brand-charcoal md:text-4xl">{value}</p>
        {delta && <span className="delta-badge">{delta}</span>}
      </div>
      <p className="mt-2 text-sm text-brand-muted">{label}</p>
    </div>
  );
}
