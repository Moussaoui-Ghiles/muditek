import { JsonLd } from "@/components/json-ld";

export type TestimonialSource = "linkedin" | "email" | "newsletter";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  source: TestimonialSource;
  linkedinUrl?: string;
  year: number | string;
  rating?: number;
}

interface TestimonialBlockProps {
  items: TestimonialItem[];
  title?: string;
  emptyStateNote?: string;
  className?: string;
}

const SOURCE_LABEL: Record<TestimonialSource, string> = {
  linkedin: "LinkedIn DM",
  email: "Email",
  newsletter: "Newsletter reply",
};

export function TestimonialBlock({
  items,
  title = "What operators are saying",
  emptyStateNote = "We'll publish reader replies and client notes here once we've collected enough to share. No fake testimonials in the meantime.",
  className = "",
}: TestimonialBlockProps) {
  if (items.length === 0) {
    return (
      <section className={`py-24 md:py-32 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.1] ${className}`}>
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase text-foreground/50 mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-foreground/20" />
            Testimonials
          </h2>
          <div className="border border-dashed border-white/[0.08] bg-card/[0.15] rounded-[4px] p-10 md:p-14">
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-foreground/70 mb-4">
              Coming soon.
            </h3>
            <p className="text-base text-foreground/50 font-light leading-relaxed max-w-2xl">
              {emptyStateNote}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const ratedItems = items.filter((i) => typeof i.rating === "number");
  const includeAggregate = items.length >= 3 && ratedItems.length === items.length;

  const reviewSchemas = items.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: item.quote,
    author: {
      "@type": "Person",
      name: item.author,
      ...(item.linkedinUrl ? { url: item.linkedinUrl } : {}),
      jobTitle: item.role,
      worksFor: { "@type": "Organization", name: item.company },
    },
    datePublished: String(item.year),
    itemReviewed: { "@type": "Organization", name: "Muditek", url: "https://muditek.com" },
    ...(typeof item.rating === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: item.rating,
            bestRating: 5,
          },
        }
      : {}),
  }));

  const schemas: Array<Record<string, unknown>> = [...reviewSchemas];

  if (includeAggregate) {
    const ratingValue =
      ratedItems.reduce((sum, i) => sum + (i.rating ?? 0), 0) / ratedItems.length;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      itemReviewed: { "@type": "Organization", name: "Muditek", url: "https://muditek.com" },
      ratingValue: Number(ratingValue.toFixed(1)),
      bestRating: 5,
      reviewCount: ratedItems.length,
    });
  }

  return (
    <section className={`py-24 md:py-32 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.1] ${className}`}>
      <JsonLd data={schemas} />
      <div className="max-w-[1100px] w-full px-6 md:px-12">
        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-primary/50" />
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <figure
              key={`${item.author}-${i}`}
              className="border border-white/[0.05] bg-card/[0.2] backdrop-blur-md p-8 rounded-[4px] flex flex-col"
            >
              <blockquote className="text-base font-light italic text-foreground/85 leading-relaxed mb-6 flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="border-t border-white/[0.05] pt-4">
                <div className="text-sm font-bold text-foreground">{item.author}</div>
                <div className="text-xs text-foreground/60 font-light">
                  {item.role} · {item.company}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40">
                  <span>{SOURCE_LABEL[item.source]}</span>
                  <span>·</span>
                  <span>{item.year}</span>
                  {item.linkedinUrl && (
                    <>
                      <span>·</span>
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/70 hover:text-primary transition-colors"
                      >
                        Source
                      </a>
                    </>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
