import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { PullQuote } from "@/components/pull-quote";
import {
  CASE_STUDIES,
  CASE_STUDY_SLUGS,
  getCaseStudy,
} from "@/lib/case-studies";
import { INDUSTRIES, type IndustryAccent } from "@/lib/industries";

const ACCENT_TEXT: Record<IndustryAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};

const ACCENT_RULE: Record<IndustryAccent, string> = {
  primary: "bg-primary/50",
  emerald: "bg-emerald-400/50",
  sky: "bg-sky-400/50",
  neutral: "bg-foreground/30",
};

const ACCENT_GLOW: Record<IndustryAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};

const ACCENT_BTN: Record<IndustryAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
  neutral: "bg-foreground text-background",
};

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return { title: "Case study — Muditek" };
  const url = `https://muditek.com/case-studies/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      type: "article",
      publishedTime: c.date,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  const config = INDUSTRIES[c.industry];
  const url = `https://muditek.com/case-studies/${c.slug}`;
  const accentText = ACCENT_TEXT[c.accent];
  const accentRule = ACCENT_RULE[c.accent];
  const accentGlow = ACCENT_GLOW[c.accent];
  const accentBtn = ACCENT_BTN[c.accent];

  const otherCases = CASE_STUDIES.filter((x) => x.slug !== c.slug).slice(0, 3);
  const LAST_UPDATED = "2026-05-04";

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.headline,
            description: c.metaDescription,
            author: {
              "@type": "Person",
              "@id": "https://muditek.com/#ghiles",
              name: "Ghiles Moussaoui",
              url: "https://muditek.com/about",
            },
            publisher: { "@id": "https://muditek.com/#organization" },
            datePublished: c.date,
            dateModified: LAST_UPDATED,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
            isPartOf: { "@id": "https://muditek.com/#website" },
            image: `${url}/opengraph-image`,
            inLanguage: "en",
            articleSection: "Case Study",
            about: {
              "@type": "Thing",
              name: c.industryLabel,
            },
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
                name: "Case Studies",
                item: "https://muditek.com/case-studies",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: c.headline,
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
              href="/case-studies"
              className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground/70 mb-8 inline-block transition-colors"
            >
              ← Case Studies
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {c.industryLabel} · {new Date(c.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.05] text-foreground mb-8 text-balance">
              {c.headline}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed">
              {c.subhead}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={220}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
              {c.topMetrics.map((m) => (
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
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Problem
            </h2>
          </ScrollReveal>
          <div className="space-y-6 text-base md:text-lg text-foreground/75 font-light leading-relaxed">
            {c.problem.map((p, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <p>{p}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Approach
            </h2>
          </ScrollReveal>
          <div className="space-y-6 text-base md:text-lg text-foreground/75 font-light leading-relaxed">
            {c.approach.map((p, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <p>{p}</p>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="border border-white/[0.06] bg-card/[0.2] px-5 py-4 rounded-[4px]">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55 mb-1">
                  Build timeline
                </p>
                <p className="text-foreground/85 font-medium">
                  {c.buildTimeline}
                </p>
              </div>
              <div className="border border-white/[0.06] bg-card/[0.2] px-5 py-4 rounded-[4px]">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-foreground/55 mb-1">
                  Ownership
                </p>
                <p className="text-foreground/85 font-medium">{c.ownership}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* RESULTS TABLE */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[1000px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Results
            </h2>
            <h3 className="text-2xl md:text-4xl font-black tracking-[-0.02em] leading-[1.05] text-foreground mb-12 max-w-2xl">
              Before and after, by the numbers.
            </h3>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl">
            <div className="grid grid-cols-3 px-6 py-5 border-b border-white/[0.05] text-xs font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>Metric</div>
              <div>Before</div>
              <div className={accentText}>After</div>
            </div>
            {c.results.map((row, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <div
                  className={`grid grid-cols-3 px-6 py-6 items-start text-sm ${
                    i < c.results.length - 1
                      ? "border-b border-white/[0.02]"
                      : ""
                  }`}
                >
                  <div className="font-bold tracking-[0.05em] uppercase text-foreground/60 text-xs">
                    {row.metric}
                  </div>
                  <div className="text-foreground/55 pr-4 font-light">
                    {row.before}
                  </div>
                  <div className="text-foreground/85 font-medium">
                    {row.after}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <PullQuote
            quote={c.quote}
            source={c.quoteAttribution}
            year={new Date(c.date).getFullYear()}
          />
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-foreground/40 mt-4">
            Quote anonymized at client request — illustrative of operator perspective.
          </p>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-foreground/60 mb-8">
              More case studies
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherCases.map((o) => (
              <Link
                key={o.slug}
                href={`/case-studies/${o.slug}`}
                className="border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${ACCENT_TEXT[o.accent]}`}
                >
                  {o.industryLabel}
                </p>
                <h3 className="text-base font-bold text-foreground mb-2 leading-tight">
                  {o.headline}
                </h3>
                <p className="text-sm text-foreground/55 font-light leading-relaxed">
                  {o.subhead.slice(0, 110)}…
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NewsletterInline tags={[`source:case-study`, `case:${c.slug}`]} />

      {/* CTA */}
      <section className="py-24 md:py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.04]">
        <div className="max-w-[900px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] mb-8 text-balance">
              Want a system like this for{" "}
              <span className={`${accentText} italic font-medium`}>your firm?</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Start with a 30-minute diagnostic call. We&apos;ll tell you whether the pattern fits and what your build would look like.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href={c.primaryServicePath}
                className={`btn-press inline-flex items-center gap-3 px-10 py-5 ${accentBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
              >
                {c.primaryServiceLabel}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href={`/who-we-help/${config.slug}`}
                className="px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors"
              >
                Read the {config.shortLabel} brief
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
