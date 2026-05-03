import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | AI Systems in Production in 2026 | Muditek",
  description:
    "Real-pattern Muditek case studies in 2026: PE onboarding, B2B SaaS revenue leak, agency content engine, telecom NOC automation, fintech compliance ops. Anonymized, owned by clients.",
  alternates: { canonical: "https://muditek.com/case-studies" },
  openGraph: {
    title: "Case Studies | AI Systems in Production in 2026 | Muditek",
    description:
      "Five real-pattern case studies of AI systems Muditek built and clients now own.",
    url: "https://muditek.com/case-studies",
    type: "website",
  },
};

const ACCENT_TEXT: Record<string, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};

const ACCENT_BAR: Record<string, string> = {
  primary: "bg-primary/40",
  emerald: "bg-emerald-400/40",
  sky: "bg-sky-400/40",
  neutral: "bg-foreground/30",
};

export default function CaseStudiesIndexPage() {
  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://muditek.com/case-studies",
            name: "Muditek Case Studies",
            description:
              "Real-pattern case studies of AI systems Muditek has built across PE, B2B SaaS, agencies, telecom, and fintech.",
            url: "https://muditek.com/case-studies",
            isPartOf: { "@id": "https://muditek.com/#website" },
            datePublished: "2026-05-03",
            dateModified: "2026-05-03",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Muditek case studies",
            numberOfItems: CASE_STUDIES.length,
            itemListElement: CASE_STUDIES.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://muditek.com/case-studies/${c.slug}`,
              name: c.headline,
            })),
          },
        ]}
      />

      <section className="pt-32 md:pt-44 pb-20 md:pb-28 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Muditek / Case Studies
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance max-w-4xl">
              AI systems in production.{" "}
              <span className="text-primary italic font-medium">Owned by clients.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl">
              Five real-pattern case studies across the industries we serve. Client names anonymized; results, integrations, and timelines documented from real engagements and the diagnostic methodology we run on every project. Each system is owned by the client — source, database, infrastructure.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CASE_STUDIES.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 80}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  className="group relative block border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] backdrop-blur-md p-10 rounded-[4px] transition-all duration-500 card-lift h-full"
                >
                  <div
                    className={`absolute top-0 left-0 h-[2px] w-12 ${ACCENT_BAR[c.accent]} group-hover:w-24 transition-all duration-500`}
                  />
                  <p
                    className={`text-xs font-black tracking-[0.25em] uppercase mb-4 ${ACCENT_TEXT[c.accent]}`}
                  >
                    {c.industryLabel}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black tracking-[-0.01em] text-foreground mb-4 leading-tight">
                    {c.headline}
                  </h3>
                  <p className="text-sm text-foreground/65 font-light leading-relaxed mb-6">
                    {c.subhead}
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {c.topMetrics.slice(0, 4).map((m) => (
                      <div
                        key={m.label}
                        className="border border-white/[0.05] bg-card/[0.2] px-3 py-2 rounded-[3px]"
                      >
                        <span
                          className={`text-base font-black block ${ACCENT_TEXT[c.accent]}`}
                        >
                          {m.value}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-foreground/55 leading-tight">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] ${ACCENT_TEXT[c.accent]}`}
                  >
                    Read full case study
                    <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <NewsletterInline tags={["source:case-studies-index"]} />

      <section className="py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.02]">
        <div className="max-w-[900px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] mb-8 text-balance">
              Want a system like one of these for{" "}
              <span className="text-primary italic font-medium">your firm?</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-10 leading-relaxed">
              Each case starts the same way — a 30-minute diagnostic call. We&apos;ll tell you whether the pattern fits and what your version of the build would look like.
            </p>
            <a
              href="https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform"
            >
              Book a Call
              <span aria-hidden>→</span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
