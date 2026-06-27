import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import {
  PUBLIC_TOOLS,
  TOOL_CATEGORY_META,
  type ToolCategory,
  type ToolAccent,
} from "@/lib/tools-public";

const ACCENT_TEXT: Record<ToolAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
};

const TITLE = "Free Lead Generation Tools | Muditek";
const DESCRIPTION =
  "Free tools to find leads and size your pipeline: a Google Maps local business lead finder, a LinkedIn decision-maker finder, and a revenue leak calculator. No card.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://muditek.com/tools" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://muditek.com/tools",
    type: "website",
  },
};

const CATEGORY_ORDER: ToolCategory[] = ["local-leads", "linkedin-leads"];

export default function ToolsIndexPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: TOOL_CATEGORY_META[cat],
    items: PUBLIC_TOOLS.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Muditek Free Tools",
            description: DESCRIPTION,
            url: "https://muditek.com/tools",
            isPartOf: { "@id": "https://muditek.com/#website" },
            inLanguage: "en",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: PUBLIC_TOOLS.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://muditek.com/tools/${t.slug}`,
                name: t.title,
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "https://muditek.com/tools" },
            ],
          },
        ]}
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-16 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-emerald-400/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1000px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-emerald-400 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-emerald-400/50" />
                Free Tools
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.03] text-foreground mb-8 text-balance max-w-3xl">
              Free tools to find leads and size your pipeline.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              Real working tools, not lead magnets. Find local businesses on
              Google Maps, find decision-makers on LinkedIn, and size your
              revenue leak. Open a free account to run them.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* GROUPS */}
      {grouped.map((g) => (
        <section
          key={g.cat}
          className="py-10 md:py-14 w-full flex justify-center border-t border-white/[0.04]"
        >
          <div className="max-w-[1100px] w-full px-6 md:px-12">
            <ScrollReveal>
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${ACCENT_TEXT[g.meta.accent]} mb-8 flex items-center gap-3`}
              >
                <span className="w-8 h-[1px] bg-foreground/20" />
                {g.meta.label}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.items.map((t) => (
                <ScrollReveal key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="group flex flex-col h-full border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
                  >
                    <h3 className="text-lg font-black tracking-[-0.01em] text-foreground mb-3 leading-snug">
                      {t.title}
                    </h3>
                    <p className="text-sm text-foreground/60 font-light leading-relaxed flex-1">
                      {t.metaDescription.slice(0, 130)}
                      {t.metaDescription.length > 130 ? "…" : ""}
                    </p>
                    <span
                      className={`mt-5 text-[11px] font-black uppercase tracking-[0.2em] ${ACCENT_TEXT[g.meta.accent]} inline-flex items-center gap-2`}
                    >
                      Open the tool
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* DIAGNOSTIC */}
      <section className="py-10 md:py-14 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-foreground/20" />
              Diagnostic
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ScrollReveal>
              <Link
                href="/tools/revenue-leak-calculator"
                className="group flex flex-col h-full border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
              >
                <h3 className="text-lg font-black tracking-[-0.01em] text-foreground mb-3 leading-snug">
                  Revenue Leak Calculator
                </h3>
                <p className="text-sm text-foreground/60 font-light leading-relaxed flex-1">
                  Estimate annual pipeline leakage across slow response, low
                  close rate, churn, and wasted spend, with the formula behind
                  each number.
                </p>
                <span className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-primary inline-flex items-center gap-2">
                  Open the tool
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <NewsletterInline tags={["source:tools-index"]} />

      <Footer />
    </div>
  );
}
