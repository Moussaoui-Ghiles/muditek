import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EmailCapture } from "@/components/email-capture";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Muditek Newsletter | AI Automation Systems & Revenue Operations",
  description:
    "AI automation systems, workflows, and revenue operations, delivered to your inbox. 4,000+ subscribers. Free.",
};

interface Issue {
  id: string;
  subject: string;
  slug: string;
  sent_at: string;
}

async function getIssues(): Promise<Issue[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, subject, slug, sent_at
      FROM newsletter_issues
      WHERE status = 'sent' AND slug IS NOT NULL
      ORDER BY sent_at DESC
      LIMIT 60
    `;
    return rows as Issue[];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
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
            <div className="flex items-center justify-center gap-4 mb-8">
              <Image src="/icon.svg" alt="Muditek" width={32} height={32} />
              <h2 className="text-sm font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3">
                Newsletter
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-8 text-balance">
              Muditek <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">Signals</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto mb-10">
              Every edition ships a system you can deploy. Last one: an autonomous outbound system that books 153 calls for $1,200/month. Full architecture, code, and walkthrough.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="max-w-md mx-auto">
              <EmailCapture
                source="newsletter-hero"
                buttonText="Subscribe Free"
                successMessage="Check your inbox."
                accentColor="primary"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-8 w-full flex justify-center border-t border-b border-white/[0.06] bg-card/[0.15]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-mono uppercase tracking-wider text-foreground/60">
          <span>4,000+ subscribers</span>
          <span className="hidden md:inline text-foreground/20">|</span>
          <span>Operators, founders, PE ops</span>
          <span className="hidden md:inline text-foreground/20">|</span>
          <span>Free forever</span>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-32 md:py-40 w-full flex justify-center relative">
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
                <ScrollReveal key={issue.id} delay={i * 40}>
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="group flex flex-col h-full border border-white/[0.08] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md rounded-[4px] transition-all duration-700 card-lift overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />

                    <div className="p-8 flex flex-col flex-1">
                      <div className="text-xs font-mono uppercase tracking-widest text-foreground/40 mb-3">
                        {formatDate(issue.sent_at)}
                      </div>
                      <h4 className="text-xl font-black tracking-tight leading-tight text-foreground mb-3 group-hover:text-primary transition-colors flex-1">
                        {issue.subject}
                      </h4>
                      <div className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/80 group-hover:text-primary transition-colors">
                        Read edition
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform">
                          <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-20 border border-white/[0.08] bg-card/[0.2] rounded-[4px]">
                <h4 className="text-lg font-black text-foreground/80 mb-4">Next edition shipping soon</h4>
                <p className="text-base text-foreground/60 mb-8 max-w-md mx-auto">
                  Subscribe to get the next system — full build, architecture, and code — the moment it ships.
                </p>
                <div className="max-w-md mx-auto">
                  <EmailCapture
                    source="newsletter-empty"
                    buttonText="Subscribe Free"
                    successMessage="Check your inbox."
                    accentColor="primary"
                  />
                </div>
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
                successMessage="Check your inbox."
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
