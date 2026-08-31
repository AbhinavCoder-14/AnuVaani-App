import { caseStudies } from "@/lib/data/deployments";
import { Reveal } from "@/components/shared/Reveal";
import { SectionShell } from "@/components/shared/SectionShell";

export function CaseStudiesSection() {
  return (
    <SectionShell background="surface">
      <Reveal>
        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          <span className="text-brand-charcoal">Deployed.</span>{" "}
          <span className="text-brand-faint">Measured.</span>{" "}
          <span className="text-brand-charcoal">Proven.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {caseStudies.map((study, i) => (
          <Reveal key={study.title} delay={i * 0.1} className={i === 2 ? "md:col-span-2 md:max-w-xl md:justify-self-center" : ""}>
            <article className="card-surface overflow-hidden">
              <div
                className="flex h-48 items-end bg-gradient-to-br from-brand-teal/20 via-brand-surface to-brand-mint/10 p-6 md:h-56"
                role="img"
                aria-label={study.imageLabel}
              >
                <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">
                  {study.imageLabel}
                </p>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
                  {study.title}
                </p>
                <p className="mt-1 text-sm text-brand-muted">{study.location}</p>
                <p className="mt-4 text-base italic leading-relaxed text-brand-body">
                  &ldquo;{study.quote}&rdquo;
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span>
                    <strong className="text-brand-teal">{study.activations}</strong> activations
                  </span>
                  <span className="text-brand-muted">·</span>
                  <span>
                    <strong className="text-brand-teal">{study.far}</strong> FAR
                  </span>
                  <span className="text-brand-muted">·</span>
                  <span>{study.duration}</span>
                </div>
                <p className="mt-3 text-sm text-brand-muted">Keyword: {study.language}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
