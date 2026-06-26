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
  PLAYBOOKS,
  PLAYBOOK_SLUGS,
  getPlaybook,
  CATEGORY_META,
  type PlaybookAccent,
} from "@/lib/playbooks";

const ACCENT_TEXT: Record<PlaybookAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};
const ACCENT_RULE: Record<PlaybookAccent, string> = {
  primary: "bg-primary/50",
  emerald: "bg-emerald-400/50",
  sky: "bg-sky-400/50",
  neutral: "bg-foreground/30",
};
const ACCENT_GLOW: Record<PlaybookAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};
const ACCENT_BTN: Record<PlaybookAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
  neutral: "bg-foreground text-background",
};

export function generateStaticParams() {
  return PLAYBOOK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlaybook(slug);
  if (!p) return { title: "Playbook — Muditek" };
  const url = `https://muditek.com/playbooks/${p.slug}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url,
      type: "article",
      publishedTime: p.date,
    },
  };
}

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPlaybook(slug);
  if (!p) notFound();

  const cat = CATEGORY_META[p.category];
  const accentText = ACCENT_TEXT[cat.accent];
  const accentRule = ACCENT_RULE[cat.accent];
  const accentGlow = ACCENT_GLOW[cat.accent];
  const accentBtn = ACCENT_BTN[cat.accent];
  const url = `https://muditek.com/playbooks/${p.slug}`;
  const portalHref = `/portal/playbooks/${p.slug}`;
  const paragraphs = p.excerpt.split(/\n\n+/).filter(Boolean);

  const related = PLAYBOOKS.filter((x) => x.slug !== p.slug)
    .sort((a, b) =>
      a.category === p.category ? -1 : b.category === p.category ? 1 : 0,
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
            headline: p.hook,
            description: p.metaDescription,
            keywords: p.keywords.join(", "),
            author: {
              "@type": "Person",
              "@id": "https://muditek.com/#ghiles",
              name: "Ghiles Moussaoui",
              url: "https://muditek.com/about",
            },
            publisher: { "@id": "https://muditek.com/#organization" },
            datePublished: p.date,
            dateModified: p.date,
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
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://muditek.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Playbooks",
                item: "https://muditek.com/playbooks",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: p.title,
                item: url,
              },
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
              href="/playbooks"
              className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground/70 mb-8 inline-block transition-colors"
            >
              ← Playbooks
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {cat.label} ·{" "}
                {new Date(p.date).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.05] text-foreground mb-8 text-balance">
              {p.hook}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              {p.outcome}
            </p>
          </ScrollReveal>

          {p.topMetrics && p.topMetrics.length > 0 && (
            <ScrollReveal delay={220}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
                {p.topMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="border border-white/[0.06] bg-card/[0.25] px-4 py-4 rounded-[4px]"
                  >
                    <span
                      className={`text-xl md:text-2xl font-black block tracking-tight ${accentText}`}
                    >
                      {m.value}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 leading-tight">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal delay={280}>
            <div className="mt-10">
              <Link
                href={portalHref}
                className={`btn-press inline-flex items-center gap-3 px-8 py-4 ${accentBtn} text-sm font-black uppercase tracking-[0.18em] rounded-[2px] hover:scale-[1.02] transition-transform`}
              >
                Read the full playbook free
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
              {p.whoItsFor}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* PREVIEW / EXCERPT (the info-gain) */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              The short version
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
              What&apos;s in the full playbook
            </h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.1] text-foreground mb-10 max-w-2xl">
              Everything you get when you open it.
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {p.whatsInside.map((item, i) => (
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
              Get the full playbook,{" "}
              <span className={`${accentText} italic font-medium`}>free.</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Create a free Muditek account to read the complete{" "}
              {p.title.replace(/\.$/, "")} and the rest of the library:
              agent playbooks, the workflow archive, and tools you can run today.
            </p>
            <Link
              href={portalHref}
              className={`btn-press inline-flex items-center gap-3 px-10 py-5 ${accentBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
            >
              {p.format === "pdf" ? "Get the guide free" : "Read it free"}
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
                More playbooks
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((o) => {
                const oc = CATEGORY_META[o.category];
                return (
                  <Link
                    key={o.slug}
                    href={`/playbooks/${o.slug}`}
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

      <NewsletterInline tags={[`source:playbook`, `playbook:${p.slug}`]} />

      <Footer />
    </div>
  );
}
