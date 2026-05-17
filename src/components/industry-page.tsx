import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { JsonLd } from "@/components/json-ld";
import { NewsletterInline } from "@/components/newsletter-inline";
import { FaqBlock, type FaqItem } from "@/components/faq-block";
import { StatStrip } from "@/components/stat-strip";
import { MudikitCta } from "@/components/mudikit-cta";
import {
  INDUSTRIES,
  type IndustryConfig,
  type IndustryAccent,
} from "@/lib/industries";

interface ProblemBlock {
  num: string;
  title: string;
  body: string;
  euroPain: string;
}

interface SolutionBlock {
  num: string;
  title: string;
  body: string;
  via: string;
}

interface CaseStudySummary {
  headline: string;
  paragraph: string;
  resultRows: { before: string; after: string }[];
  topMetrics: { value: string; label: string }[];
  caseStudySlug: string;
}

export interface IndustryPageData {
  slug: string;
  config: IndustryConfig;
  heroEyebrow: string;
  heroHeadline: React.ReactNode;
  heroSubhead: string;
  heroSecondaryParagraph: string;
  stats: [
    { value: string; label: string },
    { value: string; label: string },
    { value: string; label: string },
  ];
  problems: [ProblemBlock, ProblemBlock, ProblemBlock];
  solutions: [SolutionBlock, SolutionBlock, SolutionBlock];
  caseStudy: CaseStudySummary;
  faqs: FaqItem[];
  serviceSchemaName: string;
  serviceSchemaDescription: string;
  datePublished: string;
  dateModified: string;
}

const BOOKING_URL =
  "https://outlook.office.com/bookwithme/user/c7d501f4b3b2442aabcac4e16e71734f@muditek.com/meetingtype/82MUNP6L_UOdnaSDy-xFTQ2?anonymous&ep=mlink";

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

const ACCENT_BG_GLOW: Record<IndustryAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};

const ACCENT_BORDER: Record<IndustryAccent, string> = {
  primary: "border-primary/[0.15]",
  emerald: "border-emerald-400/[0.15]",
  sky: "border-sky-400/[0.15]",
  neutral: "border-foreground/[0.08]",
};

const ACCENT_TINT_BG: Record<IndustryAccent, string> = {
  primary: "bg-primary/[0.03]",
  emerald: "bg-emerald-400/[0.03]",
  sky: "bg-sky-400/[0.03]",
  neutral: "bg-foreground/[0.02]",
};

const ACCENT_HEX_HERO_BTN: Record<IndustryAccent, string> = {
  primary: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-background",
  sky: "bg-sky-500 text-background",
  neutral: "bg-foreground text-background",
};

export function IndustryPage({ data }: { data: IndustryPageData }) {
  const { config } = data;
  const accentText = ACCENT_TEXT[config.accent];
  const accentRule = ACCENT_RULE[config.accent];
  const accentGlow = ACCENT_BG_GLOW[config.accent];
  const accentBorder = ACCENT_BORDER[config.accent];
  const accentTint = ACCENT_TINT_BG[config.accent];
  const heroBtn = ACCENT_HEX_HERO_BTN[config.accent];
  const url = `https://muditek.com/who-we-help/${config.slug}`;
  const related = config.relatedIndustries.map((s) => INDUSTRIES[s]);

  return (
    <div
      className={`bg-background min-h-[100dvh] text-foreground flex flex-col items-center selection:${accentText.replace("text", "bg")}/20`}
    >
      <Navbar />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": url,
            name: data.heroEyebrow,
            description: config.metaDescription,
            url,
            isPartOf: { "@id": "https://muditek.com/#website" },
            datePublished: data.datePublished,
            dateModified: data.dateModified,
            inLanguage: "en",
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: data.serviceSchemaName,
            provider: { "@id": "https://muditek.com/#organization" },
            description: data.serviceSchemaDescription,
            url,
            areaServed: "Worldwide",
            serviceType: "AI systems and operational infrastructure",
            audience: {
              "@type": "BusinessAudience",
              name: config.label,
            },
          },
        ]}
      />

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 w-full flex justify-center relative overflow-hidden">
        <div
          className={`absolute top-1/4 right-1/3 w-[500px] h-[500px] ${accentGlow} rounded-full blur-[120px] pointer-events-none`}
        />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2
                className={`text-sm font-black tracking-[0.3em] uppercase ${accentText} flex items-center gap-3`}
              >
                <span className={`w-8 h-[1px] ${accentRule}`} />
                {data.heroEyebrow}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-[-0.04em] leading-[0.95] text-foreground mb-10 text-balance max-w-5xl">
              {data.heroHeadline}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <StatStrip
              accentColor={config.accent}
              className="mb-10 max-w-3xl"
              stats={data.stats}
            />
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed max-w-3xl mb-6">
              {data.heroSubhead}
            </p>
            <p className="text-base text-foreground/55 font-light leading-relaxed max-w-3xl mb-12">
              {data.heroSecondaryParagraph}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link
                href={config.primaryServicePath}
                className={`group relative inline-flex items-center px-10 py-5 ${heroBtn} font-black text-sm uppercase tracking-[0.2em] overflow-hidden rounded-[2px] hover:scale-[1.02] transition-transform duration-300 btn-press`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {config.primaryServiceLabel}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="/newsletter"
                className="px-8 py-5 border border-white/[0.1] text-foreground text-sm font-bold uppercase tracking-[0.2em] rounded-[2px] hover:bg-white/[0.02] transition-colors btn-press"
              >
                Read the Newsletter
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.18]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-sm font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Three problems we keep finding
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] text-foreground mb-16 max-w-3xl">
              Where {config.shortLabel.toLowerCase()} firms{" "}
              <span className={`${accentText} italic font-medium`}>
                bleed money in 2026.
              </span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.problems.map((p, i) => (
              <ScrollReveal key={p.num} delay={i * 80}>
                <div className="border border-white/[0.06] bg-card/[0.25] p-10 rounded-[4px] h-full flex flex-col">
                  <span className="text-5xl font-black text-foreground/[0.06] block mb-6">
                    {p.num}
                  </span>
                  <h4 className="text-xl font-black tracking-[0.02em] text-foreground mb-4">
                    {p.title}
                  </h4>
                  <p className="text-base text-foreground/65 font-light leading-relaxed mb-6 flex-1">
                    {p.body}
                  </p>
                  <p
                    className={`text-xs font-mono uppercase tracking-[0.2em] ${accentText}`}
                  >
                    {p.euroPain}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2
              className={`text-sm font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              What we ship for {config.shortLabel}
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] text-foreground mb-16 max-w-3xl">
              Three systems that fix{" "}
              <span className={`${accentText} italic font-medium`}>each leak.</span>
            </h3>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.solutions.map((s, i) => (
              <ScrollReveal key={s.num} delay={i * 80}>
                <div
                  className={`border ${accentBorder} ${accentTint} p-10 rounded-[4px] h-full flex flex-col`}
                >
                  <span
                    className={`text-5xl font-black ${accentText} opacity-30 block mb-6`}
                  >
                    {s.num}
                  </span>
                  <h4 className="text-xl font-black tracking-[0.02em] text-foreground mb-4">
                    {s.title}
                  </h4>
                  <p className="text-base text-foreground/65 font-light leading-relaxed mb-6 flex-1">
                    {s.body}
                  </p>
                  <p
                    className={`text-xs font-mono uppercase tracking-[0.2em] ${accentText}`}
                  >
                    {s.via}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterInline
        tags={[`source:${config.newsletterTag}`]}
        accentColor={config.accent === "neutral" ? "primary" : config.accent}
      />

      {/* CASE STUDY REFERENCE */}
      <section
        id="case-study"
        className="py-24 md:py-32 w-full flex justify-center border-t border-white/[0.02] relative"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2
              className={`text-sm font-black tracking-[0.3em] uppercase ${accentText} mb-6 flex items-center gap-3`}
            >
              <span className={`w-8 h-[1px] ${accentRule}`} />
              Case Study
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] text-foreground mb-6 max-w-3xl">
              {data.caseStudy.headline}
            </h3>
            <p className="text-base text-foreground/70 font-light leading-relaxed max-w-3xl mb-12">
              {data.caseStudy.paragraph}
            </p>
          </ScrollReveal>

          <div className="border border-white/[0.05] bg-card/[0.3] backdrop-blur-md rounded-[4px] shadow-2xl mb-10">
            <div className="grid grid-cols-2 px-8 py-6 border-b border-white/[0.05] text-sm font-black uppercase tracking-[0.15em] text-foreground/60 bg-white/[0.01]">
              <div>Before</div>
              <div className={accentText}>After</div>
            </div>
            {data.caseStudy.resultRows.map((row, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div
                  className={`grid grid-cols-2 px-8 py-6 items-center stat-row cursor-default ${
                    i < data.caseStudy.resultRows.length - 1
                      ? "border-b border-white/[0.02]"
                      : ""
                  }`}
                >
                  <div className="text-sm text-foreground/60 pr-6 font-light">
                    {row.before}
                  </div>
                  <div className="text-sm text-foreground/85 font-medium">
                    {row.after}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {data.caseStudy.topMetrics.map((m) => (
                <div
                  key={m.label}
                  className="border border-white/[0.05] bg-card/[0.2] p-6 text-center rounded-[4px]"
                >
                  <span className="text-2xl md:text-3xl font-black text-foreground block mb-1 tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-[11px] font-mono text-foreground/60 tracking-wider uppercase">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <Link
              href={`/case-studies/${data.caseStudy.caseStudySlug}`}
              className={`inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] ${accentText} hover:opacity-80 transition-opacity`}
            >
              Read the full case study
              <span aria-hidden>→</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <FaqBlock items={data.faqs} accentColor={config.accent} />

      {/* OPTIONAL MUDIKIT CTA */}
      {config.showMudikit ? (
        <MudikitCta
          headline={`Ship a ${config.shortLabel.toLowerCase()} system this weekend with MudiKit · $47/mo`}
          body="The same library I run my own business on: 64 Claude Code skills, implementation playbooks, the vault template, and outreach operating files. New drops every month."
        />
      ) : null}

      {/* RELATED LINKS */}
      <section className="py-20 md:py-28 w-full flex justify-center border-t border-white/[0.02] bg-card/[0.15]">
        <div className="max-w-[1100px] w-full px-6 md:px-12">
          <ScrollReveal>
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-foreground/60 mb-8">
              Related
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/who-we-help"
              className="border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/50 mb-2">
                Index
              </p>
              <h3 className="text-base font-bold text-foreground mb-1">
                All industries
              </h3>
              <p className="text-sm text-foreground/55 font-light">
                Browse the 5 industry briefs.
              </p>
            </Link>
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/who-we-help/${r.slug}`}
                className="border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${ACCENT_TEXT[r.accent]}`}
                >
                  {r.shortLabel}
                </p>
                <h3 className="text-base font-bold text-foreground mb-1">
                  {r.label}
                </h3>
                <p className="text-sm text-foreground/55 font-light">
                  {r.oneLiner.slice(0, 90)}…
                </p>
              </Link>
            ))}
            <Link
              href="/newsletter"
              className="border border-white/[0.06] bg-card/[0.2] hover:bg-card/[0.4] p-6 rounded-[4px] transition-colors"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/50 mb-2">
                Newsletter
              </p>
              <h3 className="text-base font-bold text-foreground mb-1">
                B2B Agents weekly
              </h3>
              <p className="text-sm text-foreground/55 font-light">
                Real implementations, every week.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 md:py-40 w-full flex items-center justify-center bg-background relative overflow-hidden">
        <div className="max-w-[1000px] w-full px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[0.95] mb-8 text-balance">
              Find what your{" "}
              <span className={`${accentText} italic font-medium`}>
                {config.shortLabel.toLowerCase()}
              </span>{" "}
              firm is losing to manual operations.
            </h2>
            <p className="text-base text-foreground/65 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              30-minute call. No pitch. We&apos;ll tell you whether the diagnostic would find waste worth fixing, and what the next step looks like.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-press group relative inline-flex items-center justify-center px-12 py-5 ${heroBtn} text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform`}
            >
              <span className="flex items-center gap-3">
                Book a Call
                <span aria-hidden>→</span>
              </span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
