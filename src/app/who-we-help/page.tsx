import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { INDUSTRIES, INDUSTRY_SLUGS } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Who We Help | AI Systems by Industry in 2026 | Muditek",
  description:
    "Muditek AI systems for 5 industries in 2026: private equity, B2B SaaS, agencies, telecom, fintech. Diagnose the waste, build the fix.",
  alternates: { canonical: "https://muditek.com/who-we-help" },
  openGraph: {
    title: "Who We Help | AI Systems by Industry in 2026 | Muditek",
    description:
      "Industry-specific AI systems: private equity, B2B SaaS, agencies, telecom, fintech. Diagnose the waste, build the fix.",
    url: "https://muditek.com/who-we-help",
    type: "website",
  },
};

const ACCENT_BAR: Record<string, string> = {
  primary: "bg-primary/40",
  emerald: "bg-emerald-400/40",
  sky: "bg-sky-400/40",
  neutral: "bg-foreground/30",
};

const ACCENT_TEXT: Record<string, string> = {
  primary: "text-primary",
  emerald: "text-emerald-400",
  sky: "text-sky-400",
  neutral: "text-foreground",
};

export default function WhoWeHelpIndexPage() {
  const industries = INDUSTRY_SLUGS.map((s) => INDUSTRIES[s]);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground flex flex-col items-center">
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://muditek.com/who-we-help",
            name: "Who We Help — AI Systems by Industry",
            description:
              "Index of Muditek industry pages: private equity, B2B SaaS, agencies, telecom, and fintech.",
            url: "https://muditek.com/who-we-help",
            isPartOf: { "@id": "https://muditek.com/#website" },
            datePublished: "2026-05-03",
            dateModified: "2026-05-04",
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Industries Muditek serves",
            numberOfItems: industries.length,
            itemListElement: industries.map((ind, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://muditek.com/who-we-help/${ind.slug}`,
              name: ind.label,
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
              Muditek / Who We Help
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-12 text-balance max-w-4xl">
              Five industries. One method:{" "}
              <span className="text-primary italic font-medium">
                diagnose the waste, build the fix.
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl">
              Every Muditek engagement starts with a diagnostic that quantifies
              waste in euros. Then we build the AI systems that close the gap.
              The pattern is the same; the implementation is industry-specific.
              Pick the industry below to see what we ship for firms like yours
              in 2026.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 md:py-28 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industries.map((ind, i) => (
              <ScrollReveal key={ind.slug} delay={i * 80}>
                <Link
                  href={`/who-we-help/${ind.slug}`}
                  className="group relative block border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] backdrop-blur-md p-10 rounded-[4px] transition-all duration-500 card-lift h-full"
                >
                  <div
                    className={`absolute top-0 left-0 h-[2px] w-12 ${ACCENT_BAR[ind.accent]} group-hover:w-24 transition-all duration-500`}
                  />
                  <p
                    className={`text-xs font-black tracking-[0.25em] uppercase mb-4 ${ACCENT_TEXT[ind.accent]}`}
                  >
                    {ind.shortLabel}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-foreground mb-4 leading-[1.1]">
                    {ind.label}
                  </h3>
                  <p className="text-base text-foreground/65 font-light leading-relaxed mb-6">
                    {ind.oneLiner}
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.18em] ${ACCENT_TEXT[ind.accent]}`}
                  >
                    Read industry brief
                    <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <NewsletterInline tags={["source:who-we-help"]} />

      <section className="py-32 w-full flex items-center justify-center bg-background border-t border-white/[0.02]">
        <div className="max-w-[900px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] mb-8 text-balance">
              Don&apos;t see your industry? <span className="text-primary italic font-medium">Book a call.</span>
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-xl mx-auto mb-10 leading-relaxed">
              Most engagements start with a 30-minute diagnostic call. We&apos;ll tell you whether your industry is something we can help with — and if it is, what the diagnostic would find.
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
