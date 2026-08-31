import { comparisonRows } from "@/lib/data/deployments";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { TwoToneHeadline } from "@/components/shared/TwoToneHeadline";
import { Check, Minus } from "lucide-react";

function CellValue({ value }: { value: string }) {
  if (value === "Yes") {
    return (
      <span className="inline-flex items-center gap-1 text-brand-teal">
        <Check className="h-4 w-4" /> Yes
      </span>
    );
  }
  if (value === "No") {
    return (
      <span className="inline-flex items-center gap-1 text-brand-muted">
        <Minus className="h-4 w-4" /> No
      </span>
    );
  }
  if (value === "Partial") {
    return <span className="text-brand-warning">Partial</span>;
  }
  if (value === "N/A") {
    return <span className="text-brand-muted">N/A</span>;
  }
  return <span className="text-brand-body">{value}</span>;
}

export function ComparisonSection() {
  return (
    <SectionShell background="surface">
      <Reveal>
        <TwoToneHeadline muted="Why AnuVaani" emphasis="wins for rural India." />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="section-stack overflow-x-auto rounded-card border border-gray-200 bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-brand-muted">
                <th className="p-4 font-semibold">Requirement</th>
                <th className="border-l-4 border-brand-teal bg-brand-teal/5 p-4 font-semibold text-brand-charcoal">
                  AnuVaani
                </th>
                <th className="p-4 font-semibold">Picovoice</th>
                <th className="p-4 font-semibold">Google Assistant</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-gray-50 transition-colors hover:bg-gray-50/80">
                  <td className="p-4 font-medium text-brand-charcoal">{row.feature}</td>
                  <td className="border-l-4 border-brand-teal bg-brand-teal/5 p-4">
                    <CellValue value={row.edge} />
                  </td>
                  <td className="p-4 text-brand-body">
                    <CellValue value={row.picovoice} />
                  </td>
                  <td className="p-4 text-brand-body">
                    <CellValue value={row.google} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </SectionShell>
  );
}
