"use client";

import { languageInsight, languagePerformance } from "@/lib/data/deployments";

const toneClass = {
  pass: "border-t-brand-teal",
  watch: "border-t-brand-warning",
  fail: "border-t-brand-critical",
};

export function LanguageComparison() {
  return (
    <section className="dash-card p-6">
      <h2 className="text-sm font-semibold text-brand-charcoal">Keyword Performance by Training Set</h2>
      <p className="mt-1 text-sm text-brand-muted">
        TPR and FAR across custom keywords evaluated on physical hardware.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {languagePerformance.map((lang) => (
          <article key={lang.language} className={`rounded-xl border border-[#E5E7EB] border-t-4 bg-white p-4 ${toneClass[lang.tone]}`}>
            <p className="text-sm font-semibold text-brand-charcoal">{lang.language}</p>
            <p className="mt-4 text-3xl font-bold tracking-tight text-brand-charcoal">{lang.tpr}%</p>
            <p className="text-xs text-brand-muted">TPR</p>
            <p className="mt-3 text-lg font-semibold text-brand-charcoal">{lang.far}%</p>
            <p className="text-xs text-brand-muted">FAR</p>
            <p className="mt-4 font-mono text-xs text-brand-body">{lang.keyword}</p>
            <p className="mt-1 text-xs text-brand-muted">
              {lang.devices} {lang.devices === 1 ? "device" : "devices"}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-brand-surface p-4 text-sm leading-relaxed text-brand-body">
        {languageInsight}
      </p>
    </section>
  );
}
