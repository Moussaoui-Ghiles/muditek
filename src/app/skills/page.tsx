import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import {
  PUBLIC_SKILLS,
  SKILL_CATEGORY_META,
  type SkillCategory,
  type SkillAccent,
} from "@/lib/skills-public";

const ACCENT_TEXT: Record<SkillAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};

const TITLE = "AI Skills for Marketing, Sales & SEO | Muditek";
const DESCRIPTION =
  "A library of operator AI skills you install into Claude to run real marketing, sales, SEO, content, and CRO work as autonomous agents. No added headcount. Free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://muditek.com/skills" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://muditek.com/skills",
    type: "website",
  },
};

const CATEGORY_ORDER: SkillCategory[] = [
  "outreach",
  "copywriting",
  "content",
  "seo",
  "ads",
  "cro",
  "sales",
  "strategy",
];

export default function SkillsIndexPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: SKILL_CATEGORY_META[cat],
    items: PUBLIC_SKILLS.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Muditek AI Skills",
            description: DESCRIPTION,
            url: "https://muditek.com/skills",
            isPartOf: { "@id": "https://muditek.com/#website" },
            inLanguage: "en",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: PUBLIC_SKILLS.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://muditek.com/skills/${s.slug}`,
                name: s.title,
              })),
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Skills", item: "https://muditek.com/skills" },
            ],
          },
        ]}
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-16 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1000px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50" />
                AI Skills
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.03] text-foreground mb-8 text-balance max-w-3xl">
              AI skills that do the marketing, sales, and SEO work for you.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              Install a skill into Claude and it runs the task end to end:
              cold email, ad copy, SEO audits, CRO, pricing, and more. Read how
              each one works here. Open a free account to install them.
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
              {g.items.map((s) => (
                <ScrollReveal key={s.slug}>
                  <Link
                    href={`/skills/${s.slug}`}
                    className="group flex flex-col h-full border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
                  >
                    <h3 className="text-lg font-black tracking-[-0.01em] text-foreground mb-3 leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-sm text-foreground/60 font-light leading-relaxed flex-1">
                      {s.metaDescription.slice(0, 130)}
                      {s.metaDescription.length > 130 ? "…" : ""}
                    </p>
                    <span
                      className={`mt-5 text-[11px] font-black uppercase tracking-[0.2em] ${ACCENT_TEXT[g.meta.accent]} inline-flex items-center gap-2`}
                    >
                      Read how it works
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

      <NewsletterInline tags={["source:skills-index"]} />

      <Footer />
    </div>
  );
}
