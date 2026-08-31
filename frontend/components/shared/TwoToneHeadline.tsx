interface TwoToneHeadlineProps {
  muted: string;
  emphasis: string;
  className?: string;
  serif?: boolean;
}

export function TwoToneHeadline({ muted, emphasis, className = "", serif = false }: TwoToneHeadlineProps) {
  const Tag = serif ? "h2" : "h2";
  const fontClass = serif ? "font-display" : "font-sans";

  return (
    <Tag className={`${fontClass} text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl ${className}`}>
      <span className="block text-brand-faint">{muted}</span>
      <span className="block text-brand-charcoal">{emphasis}</span>
    </Tag>
  );
}
