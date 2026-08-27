import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EmailCapture } from "@/components/email-capture";
import { FaqBlock } from "@/components/faq-block";
import { getDb } from "@/lib/db";
import { extractNewsletterThumbnailFromHtml } from "@/lib/newsletter-portal";

const NEWSLETTER_FAQ = [
  {
    q: "What does the Muditek newsletter cover?",
    a: "Practical AI systems, outbound operations, and implementation breakdowns. Issues can include prompts, workflows, research methods, lead-generation systems, and controlled agent setups.",
  },
  {
    q: "When is it sent?",
    a: "When a complete issue is ready. There is no filler schedule.",
  },
  {
    q: "Does a portal account subscribe me?",
    a: "No. Newsletter consent is separate, optional, and unchecked when you create an account.",
  },
  {
    q: "Who reads it?",
    a: "Operators, builders, and founders who want practical material they can inspect and adapt.",
  },
];

export const metadata: Metadata = {
  title: "Muditek Newsletter | Outbound and AI Systems",
  description:
    "Read and subscribe to the Muditek newsletter for practical AI systems, outbound operations, and implementation breakdowns.",
  alternates: { canonical: "https://muditek.com/newsletter" },
  openGraph: {
    title: "Muditek Newsletter",
    description:
      "Practical AI systems, outbound operations, and implementation breakdowns.",
    url: "https://muditek.com/newsletter",
    type: "website",
  },
};

export const revalidate = 300;

interface Issue {
  slug: string;
  subject: string;
  sent_at: string | null;
  html: string | null;
  stats: {
    preview?: string | null;
    tldr?: string | null;
    thumbnail_url?: string | null;
    image?: string | null;
    hero_image?: string | null;
  } | null;
}

async function getIssues(): Promise<Issue[]> {
  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT slug, subject, sent_at, html, stats
      FROM newsletter_issues
      WHERE status = 'sent'
        AND slug IS NOT NULL
        AND html IS NOT NULL
        AND length(trim(html)) > 0
        AND (
          stats->>'portal_article' = 'true'
          OR stats->>'portalArticle' = 'true'
        )
      ORDER BY sent_at DESC
      LIMIT 30
    `) as Issue[];
    return rows;
  } catch {
    return [];
  }
}

function issueImage(issue: Issue): string | null {
  return (
    issue.stats?.thumbnail_url?.trim() ||
    issue.stats?.hero_image?.trim() ||
    issue.stats?.image?.trim() ||
    extractNewsletterThumbnailFromHtml(issue.html) ||
    `/api/portal/newsletter-covers/${encodeURIComponent(issue.slug)}`
  );
}

function NewsletterCardCover({ issue, index }: { issue: Issue; index: number }) {
  const image = issueImage(issue);
  if (image) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.08] bg-card">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-background/10 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.08] bg-[#101014]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(245,158,11,0.24),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.01))]" />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_1px,transparent_1px_13px)]" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
          <span>Article</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div>
          <p className="line-clamp-2 text-[18px] font-black leading-[1.05] tracking-[-0.02em] text-foreground">
            {issue.subject}
          </p>
          <div className="mt-4 h-px w-12 bg-primary/70" />
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NewsletterPage() {
  const issues = await getIssues();

  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />
      <main id="main-content" className="w-full">

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[900px] w-full px-6 md:px-12 relative z-10 text-center">
          <ScrollReveal>
            <p className="mb-8 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
              <span className="w-8 h-[1px] bg-primary/50" />
              Muditek Newsletter
              <span className="w-8 h-[1px] bg-primary/50" />
            </p>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] text-foreground mb-8 text-balance">
              Practical outbound and AI systems, <span className="text-primary italic font-medium">explained clearly.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed mb-4">
              Each issue breaks down one problem, the method, and the implementation details. The public library remains available without subscribing.
            </p>
            <p className="text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed mb-12">Subscription is explicit. You can unsubscribe at any time. A portal account does not subscribe or reactivate you.</p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="max-w-md mx-auto">
              <EmailCapture
                source="newsletter-hero"
                buttonText="Subscribe"
                successMessage="You're in. Check your inbox."
                accentColor="primary"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="py-32 md:py-40 w-full flex justify-center relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <p className="mb-6 flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] text-primary">
              <span className="w-8 h-[1px] bg-primary/50" />
              Selected Articles
            </p>
            <h2 className="mb-16 text-4xl font-black leading-[0.9] tracking-[-0.03em] text-foreground md:text-5xl">
              Article-style issues live <span className="text-primary italic font-medium">here.</span>
            </h2>
          </ScrollReveal>

          {issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue, i) => (
                <ScrollReveal key={issue.slug} delay={i * 40}>
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-white/[0.08] bg-card/[0.2] backdrop-blur-md transition-[background-color,border-color,transform] duration-700 hover:bg-card/[0.5] card-lift"
                  >
                    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-colors duration-[1.2s] group-hover:via-primary/70" />
                    <NewsletterCardCover issue={issue} index={i} />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-sm font-mono text-foreground/50 tracking-wider mb-3">
                        {formatDate(issue.sent_at)}
                      </div>
                      <h4 className="text-base font-bold text-foreground/90 group-hover:text-foreground transition-colors leading-snug mb-3">
                        {issue.subject}
                      </h4>
                      {issue.stats?.preview && (
                        <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 mb-4">
                          {issue.stats.preview}
                        </p>
                      )}
                      <div className="mt-auto pt-4 text-sm font-black uppercase tracking-[0.15em] text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                        Read
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-20 border border-white/[0.08] bg-card/[0.2] rounded-[4px]">
                <h4 className="text-lg font-black text-foreground/80 mb-4">No public articles selected yet</h4>
                <p className="text-base text-foreground/60 mb-8 max-w-md mx-auto">
                  Subscribe above to get new editions. Selected article-style issues will appear here after publishing.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* FAQ */}
      <FaqBlock items={NEWSLETTER_FAQ} accentColor="primary" />

      <section className="w-full border-y border-white/[0.06] py-20">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7 px-6 text-center md:px-12">
          <h2 className="text-3xl font-black tracking-[-0.03em] md:text-5xl">The full library is public.</h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-foreground/65">Read skills and playbooks or use the browser-only tools without joining the newsletter.</p>
          <Link href="/library" className="mx-auto inline-flex min-h-12 items-center justify-center rounded-[2px] border border-white/15 px-6 text-xs font-black uppercase tracking-[0.17em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open the library</Link>
        </div>
      </section>

      <section className="relative flex w-full justify-center border-t border-white/[0.04] bg-card/[0.15] py-24 mesh-subtle">
        <div className="w-full max-w-[800px] px-6 text-center">
          <ScrollReveal>
            <h2 className="mb-8 text-balance text-3xl font-black leading-[1.05] tracking-[-0.03em] md:text-5xl">
              Read first. Subscribe only if it is useful.
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-foreground/70">
              The library contains the complete public skills, playbooks, and browser tools.
            </p>
            <Link href="/library" className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-white/15 px-6 text-xs font-black uppercase tracking-[0.17em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Open the library</Link>
          </ScrollReveal>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
