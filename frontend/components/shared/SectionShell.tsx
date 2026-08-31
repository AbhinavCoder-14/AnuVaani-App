import { forwardRef, type ReactNode } from "react";

interface SectionShellProps {
  id?: string;
  number?: string;
  background?: "white" | "surface";
  children: ReactNode;
  className?: string;
  overlay?: ReactNode;
}

export const SectionShell = forwardRef<HTMLElement, SectionShellProps>(function SectionShell(
  { id, number, background = "white", children, className = "", overlay },
  ref,
) {
  const bg = background === "surface" ? "bg-brand-surface" : "bg-white";

  return (
    <section ref={ref} id={id} className={`section-pad relative ${bg} ${className}`}>
      {overlay}
      <div className="page-container relative">
        {number && (
          <p className="mb-4 font-mono text-sm text-brand-faint">{number}</p>
        )}
        {children}
      </div>
    </section>
  );
});
