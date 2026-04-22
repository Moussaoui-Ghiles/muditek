import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EmailCapture } from "@/components/email-capture";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "B2B Agents Newsletter | AI Automation Systems & Revenue Operations | Muditek",
  description:
    "AI automation systems, workflows, and revenue operations, delivered to your inbox. Join free.",
};

export const revalidate = 300;

interface Issue {
  slug: string;
  subject: string;
  sent_at: string | null;
  stats: { preview?: string | null } | null;
}

async function getIssues(): Promise<Issue[]> {
  try {
    const sql = getDb();
    const rows = (await sql`
      SELECT slug, subject, sent_at, stats
      FROM newsletter_issues
      WHERE status = 'sent' AND slug IS NOT NULL
      ORDER BY sent_at DESC
      LIMIT 30
    `) as Issue[];
    return rows;
  } catch {
    return [];
  }
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

      {/* HERO */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[900px] w-full px-6 md:px-12 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-8 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              B2B Agents Newsletter
              <span className="w-8 h-[1px] bg-primary/50" />
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.95] text-foreground mb-8 text-balance">
              Every edition ships a <span className="text-primary italic font-medium">deployable system.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed mb-12">
              Outbound machines, AI agents, revenue ops. Full build, architecture, and code. No fluff. No theory.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="max-w-md mx-auto">
              <EmailCapture
                source="newsletter-hero"
                buttonText="Subscribe Free"
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
            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Past Editions
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16">
              Every edition ships a <span className="text-primary italic font-medium">system.</span>
            </h3>
          </ScrollReveal>

          {issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue, i) => (
                <ScrollReveal key={issue.slug} delay={i * 40}>
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="group flex flex-col h-full border border-white/[0.08] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md rounded-[4px] transition-all duration-700 card-lift overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
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
                <h4 className="text-lg font-black text-foreground/80 mb-4">Archive rebuilding</h4>
                <p className="text-base text-foreground/60 mb-8 max-w-md mx-auto">
                  Past editions are being reindexed. Subscribe above to get the next one.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-32 w-full flex justify-center relative border-t border-white/[0.04] bg-card/[0.15] mesh-subtle">
        <div className="max-w-[800px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance">
              Every system I build gets shared here <span className="text-primary italic font-medium">first.</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-xl mx-auto leading-relaxed mb-12">
              153 booked calls for $1,200. Proposals in 12 minutes. 2,000 leads/day for $10. You get the full build — every week, free.
            </p>
            <div className="max-w-md mx-auto">
              <EmailCapture
                source="newsletter-footer"
                buttonText="Subscribe Free"
                successMessage="You're in. Check your inbox."
                accentColor="primary"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
