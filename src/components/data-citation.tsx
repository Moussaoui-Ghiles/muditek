interface DataCitationProps {
  claim: string;
  source: string;
  n: number;
  className?: string;
}

export function DataCitation({ claim, source, n, className = "" }: DataCitationProps) {
  const tooltip = `Source: ${source}, n=${n.toLocaleString()}`;
  return (
    <span
      className={`relative group cursor-help underline decoration-dotted decoration-foreground/30 underline-offset-[3px] hover:decoration-primary/60 transition-colors ${className}`}
      title={tooltip}
    >
      {claim}
      <sup className="text-[0.65em] font-mono text-primary/70 ml-0.5">¹</sup>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-max max-w-[280px] px-3 py-2 text-xs font-mono tracking-wider text-foreground/90 bg-card border border-white/[0.1] rounded-[2px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        Source: {source} · n={n.toLocaleString()}
      </span>
    </span>
  );
}
