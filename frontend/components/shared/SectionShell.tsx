import { forwardRef, type ReactNode } from "react";

interface SectionShellProps {
  id?: string;
  number?: string;
  background?: "white" | "surface";
  children: ReactNode;
  className?: string;
}

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell(
  { id, number, background = "white", children, className = "" },
  ref,
) {
  const bg = background === "surface" ? "bg-brand-surface" : "bg-white";

  return (
    <section ref={ref} id={id} className={`section-pad ${bg} ${className}`}>
      <div className="page-container">
        {number && (
          <p className="mb-4 font-mono text-sm text-brand-faint">{number}</p>
        )}
        {children}
      </div>
    </section>
  );
});
