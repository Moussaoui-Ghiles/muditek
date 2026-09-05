import { JsonLd } from "@/components/json-ld";

type Accent = "primary" | "emerald" | "sky" | "neutral";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqBlockProps {
  items: FaqItem[];
  /** Legacy prop. The block has one style now. */
  accentColor?: Accent;
  title?: string;
  className?: string;
  id?: string;
}

export function FaqBlock({ items, title = "Questions people ask first", className = "", id }: FaqBlockProps) {
  if (!items || items.length === 0) return null;

  return (
    <section id={id} className={`w-full border-t border-white/[0.08] ${className}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <span className="rule" aria-hidden />
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance lg:sticky lg:top-32">
            {title}
          </h2>
        </div>
        <div className="lg:col-span-8 border-b border-white/[0.08]">
          {items.map((item, i) => (
            <details key={i} className="faq" name="faq">
              <summary>
                <span>{item.q}</span>
                <span className="faq-plus" aria-hidden />
              </summary>
              <p className="faq-body">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
