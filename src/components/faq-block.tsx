import { JsonLd } from "@/components/json-ld";

type Accent = "primary" | "emerald" | "sky" | "neutral";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqBlockProps {
  items: FaqItem[];
  accentColor?: Accent;
  title?: string;
  className?: string;
  id?: string;
}

const BORDER: Record<Accent, { left: string; hover: string }> = {
  primary: { left: "border-primary/20", hover: "hover:border-primary/50" },
  emerald: { left: "border-emerald-500/20", hover: "hover:border-emerald-500/50" },
  sky: { left: "border-sky-500/20", hover: "hover:border-sky-500/50" },
  neutral: { left: "border-white/[0.08]", hover: "hover:border-white/30" },
};

export function FaqBlock({
  items,
  accentColor = "neutral",
  title = "Common Questions",
  className = "",
  id,
}: FaqBlockProps) {
  if (!items || items.length === 0) return null;
  const b = BORDER[accentColor];

  return (
    <section
      id={id}
      className={`py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] ${className}`}
    >
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
      <div className="max-w-[900px] w-full px-6 md:px-12">
        <h2 className="text-sm font-black tracking-[0.3em] uppercase text-foreground/60 mb-12 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-foreground/20" />
          {title}
        </h2>
        {items.map((item, i) => (
          <div
            key={i}
            className={`py-8 pl-5 border-l-2 ${b.left} ${b.hover} hover:bg-white/[0.01] hover:pl-6 transition-all duration-300 ${
              i < items.length - 1 ? "border-b border-b-white/[0.03]" : ""
            }`}
          >
            <h3 className="text-base font-bold text-foreground/80 mb-3">
              &quot;{item.q}&quot;
            </h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-2xl">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
