interface SectionShellProps {
  id?: string;
  number?: string;
  background?: "white" | "surface";
  children: React.ReactNode;
  className?: string;
}

export function SectionShell({
  id,
  number,
  background = "white",
  children,
  className = "",
}: SectionShellProps) {
  const bg = background === "surface" ? "bg-brand-surface" : "bg-white";

  return (
    <section id={id} className={`section-pad ${bg} ${className}`}>
      <div className="page-container">
        {number && (
          <p className="mb-4 font-mono text-sm text-brand-faint">{number}</p>
        )}
        {children}
      </div>
    </section>
  );
}
