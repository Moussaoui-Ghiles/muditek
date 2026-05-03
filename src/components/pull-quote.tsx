interface PullQuoteProps {
  quote: string;
  source: string;
  year: string | number;
  className?: string;
}

export function PullQuote({ quote, source, year, className = "" }: PullQuoteProps) {
  return (
    <figure
      className={`my-12 max-w-2xl border-l-2 border-primary/40 pl-6 md:pl-8 ${className}`}
    >
      <blockquote className="text-2xl md:text-3xl font-light italic tracking-[-0.01em] leading-[1.25] text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 text-sm font-mono uppercase tracking-[0.2em] text-foreground/50">
        — {source}, {year}
      </figcaption>
    </figure>
  );
}
