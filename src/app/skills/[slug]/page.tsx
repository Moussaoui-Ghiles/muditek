import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import {
  PUBLIC_SKILLS,
  PUBLIC_SKILL_SLUGS,
  getPublicSkill,
  SKILL_CATEGORY_META,
  type SkillAccent,
} from "@/lib/skills-public";

const ACCENT_TEXT: Record<SkillAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};
const ACCENT_RULE: Record<SkillAccent, string> = {
  primary: "bg-primary/50",
  emerald: "bg-emerald-400/50",
  sky: "bg-sky-400/50",
  neutral: "bg-foreground/30",
};
const ACCENT_GLOW: Record<SkillAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};
const ACCENT_BTN: Record<SkillAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
  neutral: "bg-foreground text-background",
};

export function generateStaticParams() {
  return PUBLIC_SKILL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getPublicSkill(slug);
  if (!s) return { title: "AI Skill — Muditek" };
  const url = `https://muditek.com/skills/${s.slug}`;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      url,
      type: "article",
      publishedTime: s.date,
    },
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getPublicSkill(slug);
  if (!s) notFound();

  const cat = SKILL_CATEGORY_META[s.category];
  const accentText = ACCENT_TEXT[cat.accent];
  const accentRule = ACCENT_RULE[cat.accent];
  const accentGlow = ACCENT_GLOW[cat.accent];
  const accentBtn = ACCENT_BTN[cat.accent];
  const url = `https://muditek.com/skills/${s.slug}`;
  const portalHref = `/portal/skills/${s.slug}`;
  const paragraphs = s.excerpt.split(/\n\n+/).filter(Boolean);

  const related = PUBLIC_SKILLS.filter((x) => x.slug !== s.slug)
    .sort((a, b) =>
      a.category === s.category ? -1 : b.category === s.category ? 1 : 0,
    )
    .slice(0, 3);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: s.hook,
            description: s.metaDescription,
            keywords: s.keywords.join(", "),
            author: {
              "@type": "Person",
              "@id": "https://muditek.com/#ghiles",
              name: "Ghiles Moussaoui",
              url: "https://muditek.com/about",
            },
            publisher: { "@id": "https://muditek.com/#organization" },
            datePublished: s.date,
            dateModified: s.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
            isPartOf: { "@id": "https://muditek.com/#website" },
            image: `${url}/opengraph-image`,
            inLanguage: "en",
            articleSection: cat.label,
            about: { "@type": "Thing", name: cat.label },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Skills", item: "https://muditek.com/skills" },
              { "@type": "ListItem", position: 3, name: s.title, item: url },
            ],
          },
        ]}
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 w-full flex justify-center relative overflow-hidden">
        <div
          className={`absolute top-1/4 right-1/3 w-[500px] h-[500px] ${accentGlow} rounded-full blur-[120px] pointer-events-none`}
        />
        <div className="max-w-[900px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <Link
              href="/skills"
              className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground/70 mb-8 inline-block transition-colors"
            >
              ← AI Skills
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {cat.label} · AI Skill
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.05] text-foreground mb-8 text-balance">
              {s.hook}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              {s.outcome}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <div className="mt-10">
              <Link
                href={portalHref}
                className={`btn-press inline-flex items-center gap-3 px-8 py-4 ${accentBtn} text-sm font-black uppercase tracking-[0.18em] rounded-[2px] hover:scale-[1.02] transition-transform`}
              >
                Get this skill free
                <span aria-hidden>→</span>
              </Link>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-3">
                Free account. No card. Instant access.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-14 md:py-20 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Who it&apos;s for
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              {s.whoItsFor}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* EXCERPT (info-gain) */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              How the skill works
            </h2>
          </ScrollReveal>
          <div className="space-y-6 text-base md:text-lg text-foreground/80 font-light leading-relaxed">
            {paragraphs.map((para, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <p>{para}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[860px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              What the skill does
            </h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.1] text-foreground mb-10 max-w-2xl">
              Everything it runs for you.
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {s.whatsInside.map((item, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <div className="flex items-start gap-3 border border-white/[0.06] bg-card/[0.2] px-5 py-4 rounded-[4px] h-full">
                  <span
                    className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${accentText.replace("text-", "bg-")}`}
                  />
                  <p className="text-sm text-foreground/80 font-light leading-relaxed">
                    {item}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GATE CTA */}
      <section className="py-24 md:py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.04]">
        <div className="max-w-[820px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.0] mb-6 text-balance">
              Get the full skill,{" "}
              <span className={`${accentText} italic font-medium`}>free.</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Create a free Muditek account to install {s.title} and the rest of
              the library: dozens of operator AI skills, agent playbooks, and the
              workflow archive.
            </p>
            <Link
              href={portalHref}
              className={`btn-press inline-flex items-center gap-3 px-10 py-5 ${accentBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
            >
              Get it free
              <span aria-hidden>→</span>
            </Link>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-4">
              Free account. No card. Instant access.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
          <div className="max-w-[1100px] w-full px-6 md:px-12">
            <ScrollReveal>
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-foreground/60 mb-8">
                More AI skills
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((o) => {
                const oc = SKILL_CATEGORY_META[o.category];
                return (
                  <Link
                    key={o.slug}
                    href={`/skills/${o.slug}`}
                    className="border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${ACCENT_TEXT[oc.accent]}`}
                    >
                      {oc.label}
                    </p>
                    <h3 className="text-base font-bold text-foreground mb-2 leading-tight">
                      {o.title}
                    </h3>
                    <p className="text-sm text-foreground/55 font-light leading-relaxed">
                      {o.metaDescription.slice(0, 110)}…
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <NewsletterInline tags={[`source:skill`, `skill:${s.slug}`]} />

      <Footer />
    </div>
  );
}
