import { problemStats } from "@/lib/data/deployments";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";
import { TwoToneHeadline } from "@/components/shared/TwoToneHeadline";

export function ProblemSection() {
  return (
    <SectionShell id="problem" background="white">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <TwoToneHeadline muted="Why cloud-only voice" emphasis="fails at the edge." />
          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-brand-body">
            Voice-controlled IoT is spreading into ground systems, labs, and automation rigs. Sending
            every audio frame to the cloud is too costly, too slow, and too invasive. The edge should
            handle wake-up; the cloud should handle transcription.
          </p>
        </Reveal>

        <div className="space-y-0 overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
          {problemStats.map((item, i) => (
            <Reveal key={item.value} delay={i * 0.1}>
              <div className="group flex items-start gap-4 border-t border-gray-100 p-5 transition-all first:border-t-0 hover:translate-x-1 hover:border-l-4 hover:border-l-brand-teal hover:pl-4">
                <span className="text-2xl font-bold text-brand-teal md:text-3xl">{item.value}</span>
                <p className="pt-1 text-base text-brand-body">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
