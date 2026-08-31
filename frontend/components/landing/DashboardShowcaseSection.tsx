import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import Link from "next/link";

export function DashboardShowcaseSection() {
  return (
    <SectionShell id="intelligence" background="white">
      <Reveal>
        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          <span className="text-brand-charcoal">Evaluation fleet.</span>{" "}
          <span className="text-brand-faint">Live metrics.</span>
        </h2>
        <p className="mt-4 max-w-xl text-base text-brand-body">
          Real-time telemetry from physical test benches across the evaluation fleet. RAM, CPU,
          latency, and false-activation data for ISRO PS 26172 compliance review.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="relative mt-12">
          <DashboardPreview />
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="mt-10 text-center">
          <Link href="/dashboard" className="btn-primary">
            Open Full Dashboard
          </Link>
        </div>
      </Reveal>
    </SectionShell>
  );
}
