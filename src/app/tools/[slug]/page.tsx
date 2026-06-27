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
  PUBLIC_TOOLS,
  PUBLIC_TOOL_SLUGS,
  getPublicTool,
  TOOL_CATEGORY_META,
  type ToolAccent,
} from "@/lib/tools-public";

const ACCENT_TEXT: Record<ToolAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
};
const ACCENT_RULE: Record<ToolAccent, string> = {
  primary: "bg-primary/50",
  emerald: "bg-emerald-400/50",
  sky: "bg-sky-400/50",
};
const ACCENT_GLOW: Record<ToolAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
};
const ACCENT_BTN: Record<ToolAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
};
const ACCENT_DOT: Record<ToolAccent, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald-400",
  sky: "bg-sky-400",
};

export function generateStaticParams() {
  return PUBLIC_TOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getPublicTool(slug);
  if (!t) return { title: "Lead Tool | Muditek" };
  const url = `https://muditek.com/tools/${t.slug}`;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getPublicTool(slug);
  if (!t) notFound();

  const cat = TOOL_CATEGORY_META[t.category];
  const accentText = ACCENT_TEXT[cat.accent];
  const accentRule = ACCENT_RULE[cat.accent];
  const accentGlow = ACCENT_GLOW[cat.accent];
  const accentBtn = ACCENT_BTN[cat.accent];
  const accentDot = ACCENT_DOT[cat.accent];
  const url = `https://muditek.com/tools/${t.slug}`;
  const portalHref = `/portal/tools/${t.toolSlug}`;
  const paragraphs = t.excerpt.split(/\n\n+/).filter(Boolean);

  const related = PUBLIC_TOOLS.filter((x) => x.slug !== t.slug)
    .sort((a, b) =>
      a.category === t.category ? -1 : b.category === t.category ? 1 : 0,
    )
    .slice(0, 3);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: t.title,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: t.metaDescription,
            url,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free with a Muditek account",
            },
            publisher: { "@id": "https://muditek.com/#organization" },
            isPartOf: { "@id": "https://muditek.com/#website" },
            image: `${url}/opengraph-image`,
            inLanguage: "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Tools", item: "https://muditek.com/tools" },
              { "@type": "ListItem", position: 3, name: t.title, item: url },
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
              href="/tools"
              className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground/70 mb-8 inline-block transition-colors"
            >
              ← Free Tools
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {cat.label} · Free Tool
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.05] text-foreground mb-8 text-balance">
              {t.hook}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              {t.outcome}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={280}>
            <div className="mt-10">
              <Link
                href={portalHref}
                className={`btn-press inline-flex items-center gap-3 px-8 py-4 ${accentBtn} text-sm font-black uppercase tracking-[0.18em] rounded-[2px] hover:scale-[1.02] transition-transform`}
              >
                Run it free
                <span aria-hidden>→</span>
              </Link>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-3">
                Free account. No card. Runs in your browser.
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
              {t.whoItsFor}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT YOU ENTER + HOW IT WORKS */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[900px] w-full px-6 md:px-12 grid md:grid-cols-2 gap-12">
          <div>
            <ScrollReveal>
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                What you enter
              </h2>
            </ScrollReveal>
            <div className="space-y-3">
              {t.inputs.map((inp, i) => (
                <ScrollReveal key={i} delay={i * 40}>
                  <div className="border border-white/[0.06] bg-card/[0.2] px-5 py-4 rounded-[4px]">
                    <p className="text-sm font-bold text-foreground mb-1">
                      {inp.label}
                    </p>
                    <p className="text-sm text-foreground/55 font-light">
                      e.g. {inp.example}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <div>
            <ScrollReveal>
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                How it works
              </h2>
            </ScrollReveal>
            <ol className="space-y-3">
              {t.steps.map((step, i) => (
                <ScrollReveal key={i} delay={i * 40}>
                  <li className="flex items-start gap-3">
                    <span
                      className={`mt-[2px] shrink-0 w-6 h-6 rounded-full ${accentDot} text-background text-xs font-black flex items-center justify-center`}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground/80 font-light leading-relaxed">
                      {step}
                    </p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* EXAMPLE OUTPUT */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[1000px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-3 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Example output
            </h2>
            <p className="text-sm text-foreground/45 font-light mb-8">
              Illustrative example of the columns the tool returns. Your real
              results come from a live run inside your account.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="overflow-x-auto border border-white/[0.06] rounded-[6px] bg-background/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {t.sample.columns.map((c) => (
                      <th
                        key={c}
                        className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-foreground/50 whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.sample.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-white/[0.04] last:border-0"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-4 py-3 text-sm text-foreground/75 font-light whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              How the tool works
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

      {/* GATE CTA */}
      <section className="py-24 md:py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.04]">
        <div className="max-w-[820px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.0] mb-6 text-balance">
              Run {t.title},{" "}
              <span className={`${accentText} italic font-medium`}>free.</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Create a free Muditek account to run {t.title} and the rest of the
              toolkit: lead finders, the workflow archive, operator AI skills,
              and agent playbooks.
            </p>
            <Link
              href={portalHref}
              className={`btn-press inline-flex items-center gap-3 px-10 py-5 ${accentBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
            >
              Run it free
              <span aria-hidden>→</span>
            </Link>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-4">
              Free account. No card. Runs in your browser.
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
                More free tools
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((o) => {
                const oc = TOOL_CATEGORY_META[o.category];
                return (
                  <Link
                    key={o.slug}
                    href={`/tools/${o.slug}`}
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

      <NewsletterInline tags={[`source:tool`, `tool:${t.slug}`]} />

      <Footer />
    </div>
  );
}
