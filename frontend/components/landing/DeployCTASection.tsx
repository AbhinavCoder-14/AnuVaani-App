import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { Radio } from "lucide-react";
import Link from "next/link";

export function DeployCTASection() {
  return (
    <SectionShell id="deploy" background="white">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-white">
            <Radio className="h-6 w-6" />
          </div>
          <h2 className="font-display text-4xl text-brand-charcoal md:text-5xl">Deploy Now</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-brand-muted">
            Open-source voice infrastructure for rural India. Three steps. No experience necessary.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-primary">
              Get Deployment Package
            </Link>
            <Link href="https://github.com" className="btn-ghost">
              View Documentation
            </Link>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
