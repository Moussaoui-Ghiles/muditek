import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EmailCapture } from "@/components/email-capture";
import { FaqBlock } from "@/components/faq-block";
import { MudikitCta } from "@/components/mudikit-cta";
import { IssueCover } from "@/components/issue-cover";
import { getDb } from "@/lib/db";

const NEWSLETTER_FAQ = [
  {
    q: "What does the newsletter cover?",
    a: "One working system per issue. The outbound engine, the lead research, the agents that run the marketing and the operations. What was built, how it runs, what broke and what got fixed. Written by the person running it.",
  },
  {
    q: "How often does it send?",
    a: "When a system is worth writing up. One email, one system, one breakdown. Sometimes a deep dive, sometimes a short playbook.",
  },
  {
    q: "Will issues move behind a paywall later?",
    a: "No. The newsletter is the front door. Client work lives separately. Selected article-style issues stay readable here.",
  },
  {
    q: "Who reads it?",
    a: "Founders, agency owners, and B2B operators who already use AI and want it to run real work. Most subscribers run their own operations or sales teams.",
  },
];

export const metadata: Metadata = {
  title: "Newsletter | One Working System per Issue | Muditek",
  description:
    "One working system per issue: outbound engines, lead research, AI agents running marketing and operations. Written by the person who runs them. Unsubscribe anytime.",
  alternates: { canonical: "https://muditek.com/newsletter" },
  openGraph: {
    title: "Newsletter | Muditek",
    description:
      "One working system per issue: outbound engines, lead research, AI agents running marketing and operations.",
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

/**
 * Only a cover that was set on purpose. Images pulled out of the issue HTML
 * were sponsor banners and old logos, so the typographic tile replaces them.
 */
function issueImage(issue: Issue): string | null {
  return (
    issue.stats?.thumbnail_url?.trim() ||
    issue.stats?.hero_image?.trim() ||
    issue.stats?.image?.trim() ||
    null
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function NewsletterPage() {
  const issues = await getIssues();

  return (
    <div className="bg-background min-h-[100dvh] text-foreground selection:bg-primary/20 flex flex-col items-center">
      <Navbar />

      {/* HERO */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-36 md:pt-48 pb-20 md:pb-28 grid gap-12 lg:grid-cols-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <ScrollReveal>
              <p className="text-base font-bold text-primary mb-8">The newsletter</p>
              <h1 className="text-5xl sm:text-6xl lg:text-[84px] font-black tracking-[-0.04em] leading-[0.92] text-foreground text-balance mb-8 max-w-[12ch]">
                One working system <span className="text-primary">per issue.</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-xl md:text-2xl text-foreground/85 leading-[1.5] max-w-[52ch]">
                The outbound engine, the owner lists no database has, the agents running the marketing. The full build, written by the person who runs it. Reply to any issue and it gets read.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={200} className="lg:col-span-5">
            <EmailCapture source="newsletter-hero" buttonText="Subscribe" />
            <p className="mt-4 text-sm text-foreground/60">Unsubscribe in one click, in every email.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <ScrollReveal>
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance max-w-[20ch] mb-14">
              Selected issues, readable here.
            </h2>
          </ScrollReveal>

          {issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {issues.map((issue, i) => {
                const image = issueImage(issue);
                return (
                  <ScrollReveal key={issue.slug} delay={(i % 3) * 60}>
                    <Link href={`/newsletter/${issue.slug}`} className="group flex flex-col h-full">
                      <IssueCover src={image} title={issue.subject} />
                      <p className="mt-5 text-sm text-foreground/60">{formatDate(issue.sent_at)}</p>
                      <h3 className="mt-2 text-xl font-black tracking-[-0.02em] leading-tight text-foreground group-hover:text-primary transition-colors">
                        {issue.subject}
                      </h3>
                      {issue.stats?.preview && (
                        <p className="mt-3 text-[17px] text-foreground/80 leading-[1.65] line-clamp-2">{issue.stats.preview}</p>
                      )}
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <ScrollReveal>
              <div className="border-t border-b border-white/[0.08] py-16">
                <h3 className="text-2xl font-black text-foreground mb-3">No public issues selected yet.</h3>
                <p className="text-base text-foreground/70 max-w-[50ch]">Subscribe above to get new editions. Selected article-style issues will appear here after publishing.</p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <FaqBlock items={NEWSLETTER_FAQ} />

      <MudikitCta
        headline="Want the files behind each issue?"
        body="Every system in the newsletter has a skill or a resource behind it. The library holds them. Free with a portal account."
      />

      {/* BOTTOM CTA */}
      <section className="w-full border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-7">
            <span className="rule" aria-hidden />
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.035em] leading-[0.95] text-foreground text-balance mb-5">
              Every system I build gets shared here first.
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-[1.6] max-w-[52ch]">One email, one system, one breakdown. Unsubscribe in one click, in every email.</p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="lg:col-span-5 lg:pt-14">
            <EmailCapture source="newsletter-footer" buttonText="Subscribe" />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
