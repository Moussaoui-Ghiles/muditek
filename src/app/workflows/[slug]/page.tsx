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
  PUBLIC_WORKFLOWS,
  WORKFLOW_PUBLIC_SLUGS,
  getPublicWorkflow,
  WORKFLOW_CATEGORY_META,
  type WorkflowAccent,
} from "@/lib/workflows-public";

const ACCENT_TEXT: Record<WorkflowAccent, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};
const ACCENT_RULE: Record<WorkflowAccent, string> = {
  primary: "bg-primary/50",
  emerald: "bg-emerald-400/50",
  sky: "bg-sky-400/50",
  neutral: "bg-foreground/30",
};
const ACCENT_GLOW: Record<WorkflowAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};
const ACCENT_BTN: Record<WorkflowAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
  neutral: "bg-foreground text-background",
};
const ACCENT_DOT: Record<WorkflowAccent, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald-400",
  sky: "bg-sky-400",
  neutral: "bg-foreground",
};

function nodeSteps(flow: string): string[] {
  return flow
    .split(/\s*(?:->|;)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function generateStaticParams() {
  return WORKFLOW_PUBLIC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getPublicWorkflow(slug);
  if (!w) return { title: "n8n Workflow | Muditek" };
  const url = `https://muditek.com/workflows/${w.slug}`;
  return {
    title: w.metaTitle,
    description: w.metaDescription,
    keywords: w.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: w.metaTitle,
      description: w.metaDescription,
      url,
      type: "article",
      publishedTime: w.date,
    },
  };
}

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const w = getPublicWorkflow(slug);
  if (!w) notFound();

  const cat = WORKFLOW_CATEGORY_META[w.category];
  const accentText = ACCENT_TEXT[cat.accent];
  const accentRule = ACCENT_RULE[cat.accent];
  const accentGlow = ACCENT_GLOW[cat.accent];
  const accentBtn = ACCENT_BTN[cat.accent];
  const accentDot = ACCENT_DOT[cat.accent];
  const url = `https://muditek.com/workflows/${w.slug}`;
  const portalHref = `/portal/workflow-archive/${w.slug}`;
  const paragraphs = w.excerpt.split(/\n\n+/).filter(Boolean);
  const steps = nodeSteps(w.nodeFlow);

  const related = PUBLIC_WORKFLOWS.filter(
    (x) => x.slug !== w.slug && x.category === w.category,
  ).slice(0, 3);
  const filler = PUBLIC_WORKFLOWS.filter(
    (x) => x.slug !== w.slug && x.category !== w.category,
  );
  while (related.length < 3 && filler.length) related.push(filler.shift()!);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: w.title,
            description: w.whatItDoes,
            keywords: w.keywords.join(", "),
            inLanguage: "en",
            url,
            image: `${url}/opengraph-image`,
            datePublished: w.date,
            dateModified: w.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            isPartOf: { "@id": "https://muditek.com/#website" },
            author: {
              "@type": "Person",
              "@id": "https://muditek.com/#ghiles",
              name: "Ghiles Moussaoui",
              url: "https://muditek.com/about",
            },
            publisher: { "@id": "https://muditek.com/#organization" },
            tool: w.apps.map((a) => ({ "@type": "HowToTool", name: a })),
            step: w.setupSteps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: `Step ${i + 1}`,
              text: s,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://muditek.com" },
              { "@type": "ListItem", position: 2, name: "Workflows", item: "https://muditek.com/workflows" },
              { "@type": "ListItem", position: 3, name: w.title, item: url },
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
              href="/workflows"
              className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground/70 mb-8 inline-block transition-colors"
            >
              ← n8n Workflows
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <Image src="/icon.svg" alt="Muditek" width={28} height={28} />
              <h2
                className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {cat.label} · n8n Workflow
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.03em] leading-[1.08] text-foreground mb-8 text-balance">
              {w.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-2xl">
              {w.outcome}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={220}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/45">
              <span className="border border-white/[0.08] px-3 py-1.5 rounded-[3px]">
                {w.nodeCount} nodes
              </span>
              <span className="border border-white/[0.08] px-3 py-1.5 rounded-[3px]">
                {w.integrations} integrations
              </span>
              <span className="border border-white/[0.08] px-3 py-1.5 rounded-[3px]">
                n8n / JSON
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={portalHref}
                className={`btn-press inline-flex items-center gap-3 px-8 py-4 ${accentBtn} text-sm font-black uppercase tracking-[0.18em] rounded-[2px] hover:scale-[1.02] transition-transform`}
              >
                Download this workflow free
                <span aria-hidden>→</span>
              </Link>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-3">
                Free account. No card. Import-ready JSON.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-14 md:py-20 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              What it does
            </h2>
            <p className="text-lg md:text-xl text-foreground/85 font-light leading-relaxed">
              {w.whatItDoes}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* NODE GRAPH */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[860px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              The node graph
            </h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.1] text-foreground mb-10 max-w-2xl">
              Every step in the automation, trigger to output.
            </h3>
          </ScrollReveal>
          <ol className="relative border-l border-white/[0.08] ml-2">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 25}>
                <li className="relative pl-7 pb-5 last:pb-0">
                  <span
                    className={`absolute -left-[5px] top-[7px] w-2.5 h-2.5 rounded-full ${accentDot}`}
                  />
                  <p className="text-sm md:text-[15px] text-foreground/80 font-light leading-relaxed">
                    {step}
                  </p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* APPS */}
      <section className="py-14 md:py-20 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[860px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Apps it connects
            </h2>
          </ScrollReveal>
          <div className="flex flex-wrap gap-2.5">
            {w.apps.map((a) => (
              <ScrollReveal key={a}>
                <span className="text-sm font-medium text-foreground/80 border border-white/[0.08] bg-card/[0.3] px-4 py-2 rounded-[4px]">
                  {a}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (excerpt / info-gain) */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              How it works
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

      {/* SETUP */}
      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.04] bg-card/[0.15]">
        <div className="max-w-[860px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              What you need to run it
            </h2>
            <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] leading-[1.1] text-foreground mb-10 max-w-2xl">
              Setup, step by step.
            </h3>
          </ScrollReveal>
          <div className="space-y-3">
            {w.setupSteps.map((item, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <div className="flex items-start gap-4 border border-white/[0.06] bg-card/[0.2] px-5 py-4 rounded-[4px]">
                  <span
                    className={`text-sm font-black ${accentText} shrink-0 w-6`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm md:text-[15px] text-foreground/80 font-light leading-relaxed">
                    {item}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-14 md:py-20 w-full flex justify-center border-t border-white/[0.04]">
        <div className="max-w-[800px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-xs font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Who it&apos;s for
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              {w.whoItsFor}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* GATE CTA */}
      <section className="py-24 md:py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.04]">
        <div className="max-w-[820px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.0] mb-6 text-balance">
              Get the importable JSON,{" "}
              <span className={`${accentText} italic font-medium`}>free.</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-8 leading-relaxed">
              Create a free Muditek account to download this workflow and the rest
              of the archive: hundreds of n8n and Make automations, operator AI
              skills, and agent playbooks.
            </p>
            <Link
              href={portalHref}
              className={`btn-press inline-flex items-center gap-3 px-10 py-5 ${accentBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
            >
              Download it free
              <span aria-hidden>→</span>
            </Link>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-foreground/40 mt-4">
              Free account. No card. Import-ready JSON.
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
                More workflows
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((o) => {
                const oc = WORKFLOW_CATEGORY_META[o.category];
                return (
                  <Link
                    key={o.slug}
                    href={`/workflows/${o.slug}`}
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
                      {o.outcome.slice(0, 100)}…
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <NewsletterInline tags={[`source:workflow`, `workflow:${w.slug}`]} />

      <Footer />
    </div>
  );
}
