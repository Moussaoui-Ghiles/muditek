import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import {
  PUBLIC_WORKFLOWS,
  WORKFLOW_CATEGORY_META,
  type WorkflowCategory,
  type WorkflowAccent,
} from "@/lib/workflows-public";

const ACCENT_TEXT: Record<WorkflowAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};

const TITLE = "Free n8n Workflow Templates for Lead Gen, Sales & Marketing | Muditek";
const DESCRIPTION =
  "A curated library of 50 production n8n workflows for lead generation, cold outreach, sales, marketing, content, and SEO. Read how each one is wired, then download the JSON free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://muditek.com/workflows" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://muditek.com/workflows",
    type: "website",
  },
};

const CATEGORY_ORDER: WorkflowCategory[] = [
  "leadgen",
  "outreach",
  "sales",
  "marketing",
  "content",
  "seo",
  "ai-agent",
];

export default function WorkflowsIndexPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: WORKFLOW_CATEGORY_META[cat],
    items: PUBLIC_WORKFLOWS.filter((w) => w.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Muditek n8n Workflow Library",
            description: DESCRIPTION,
            url: "https://muditek.com/workflows",
            isPartOf: { "@id": "https://muditek.com/#website" },
            inLanguage: "en",
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: PUBLIC_WORKFLOWS.length,
              itemListElement: PUBLIC_WORKFLOWS.map((w, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://muditek.com/workflows/${w.slug}`,
                name: w.title,
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Workflows", item: "https://muditek.com/workflows" },
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
                n8n Workflows
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.03] text-foreground mb-8 text-balance max-w-3xl">
              Production n8n workflows that run your lead gen, sales, and marketing.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              Fifty real automations, each documented from its actual node graph:
              what it does, how it is wired, and what you need to run it. Read the
              breakdown here. Open a free account to download the importable JSON.
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
                <span className="text-foreground/30 normal-case tracking-normal font-mono text-[10px]">
                  {g.items.length}
                </span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.items.map((w) => (
                <ScrollReveal key={w.slug}>
                  <Link
                    href={`/workflows/${w.slug}`}
                    className="group flex flex-col h-full border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
                  >
                    <h3 className="text-base font-black tracking-[-0.01em] text-foreground mb-3 leading-snug">
                      {w.title}
                    </h3>
                    <p className="text-sm text-foreground/60 font-light leading-relaxed flex-1">
                      {w.outcome.slice(0, 120)}
                      {w.outcome.length > 120 ? "…" : ""}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {w.apps.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="text-[10px] font-mono uppercase tracking-[0.12em] text-foreground/45 border border-white/[0.06] px-2 py-1 rounded-[3px]"
                        >
                          {a}
                        </span>
                      ))}
                      {w.apps.length > 4 && (
                        <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-foreground/35 px-1 py-1">
                          +{w.apps.length - 4}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-5 text-[11px] font-black uppercase tracking-[0.2em] ${ACCENT_TEXT[g.meta.accent]} inline-flex items-center gap-2`}
                    >
                      See how it works
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

      <NewsletterInline tags={["source:workflows-index"]} />

      <Footer />
    </div>
  );
}
