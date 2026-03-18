import Link from "next/link";

interface SectionCTAProps {
  headline: string;
  body?: string;
  ctaText: string;
  ctaHref: string;
  variant?: "primary" | "glass";
}

export function SectionCTA({
  headline,
  body,
  ctaText,
  ctaHref,
  variant = "primary",
}: SectionCTAProps) {
  return (
    <section id="contact" className="relative py-24 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="w-10 h-0.5 bg-primary/30 mx-auto mb-10" aria-hidden="true" />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] text-foreground mb-5 text-balance">
          {headline}
        </h2>
        {body && (
          <p className="text-lg text-hero-sub font-normal max-w-lg mx-auto mb-10">
            {body}
          </p>
        )}
        <Link
          href={ctaHref}
          className={
            variant === "primary"
              ? "inline-block px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors"
              : "liquid-glass inline-block px-8 py-3.5 rounded-full text-foreground text-base font-normal hover:bg-white/5 transition-colors"
          }
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
