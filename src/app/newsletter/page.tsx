import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import { EmailCapture } from "@/components/email-capture";

export const metadata: Metadata = {
  title: "B2B Agents Newsletter | AI Automation Systems & Revenue Operations | Muditek",
  description: "AI automation systems, workflows, and revenue operations, delivered to your inbox. 5,300+ subscribers. 40% open rate. Join free.",
};

const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUBLICATION_ID || "pub_2effd3a4-1768-4ed7-8c9b-ff764a036162";

interface BeehiivPost {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  web_url: string;
  thumbnail_url: string | null;
  created: number;
  publish_date: number;
  displayed_date: string | null;
  status: string;
}

async function getPosts(): Promise<BeehiivPost[]> {
  if (!BEEHIIV_API_KEY) {
    return [];
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/posts?status=confirmed&limit=30&direction=desc&order_by=publish_date`,
      {
        headers: { Authorization: `Bearer ${BEEHIIV_API_KEY}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NewsletterPage() {
  const posts = await getPosts();

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
            <div className="flex items-center justify-center gap-5 mb-8">
              <Image
                src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/user/profile_picture/80b30549-1dbe-4e9f-8701-6a15f0d95db3/thumb_WhatsApp_Image_2025-05-23_at_00.49.13_a69bd58a.jpg"
                alt="B2B Agents"
                width={80}
                height={80}
                className="rounded-full border-2 border-white/[0.1]"
                unoptimized
              />
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-8 text-balance">
              B2B <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">Agents</span>
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
                successMessage="You're in. Check your inbox."
                accentColor="primary"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-8 w-full flex justify-center border-t border-b border-white/[0.06] bg-card/[0.15]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-mono uppercase tracking-wider text-foreground/60">
          <span>5,300+ subscribers</span>
          <span className="hidden md:inline text-foreground/20">|</span>
          <span>40.7% open rate</span>
          <span className="hidden md:inline text-foreground/20">|</span>
          <span>Free forever</span>
        </div>
      </section>

      {/* ARTICLES GRID */}
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

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 40}>
                  <a
                    href={post.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col h-full border border-white/[0.08] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md rounded-[4px] transition-all duration-700 card-lift overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />

                    {/* Thumbnail */}
                    {post.thumbnail_url && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.thumbnail_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-sm font-mono text-foreground/50 tracking-wider mb-3">
                        {formatDate(post.publish_date || post.created)}
                      </div>
                      <h4 className="text-base font-bold text-foreground/90 group-hover:text-foreground transition-colors leading-snug mb-3">
                        {post.title}
                      </h4>
                      {post.subtitle && (
                        <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 mb-4">
                          {post.subtitle}
                        </p>
                      )}
                      <div className="mt-auto pt-4 text-sm font-black uppercase tracking-[0.15em] text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                        Read
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-20 border border-white/[0.08] bg-card/[0.2] rounded-[4px]">
                <h4 className="text-lg font-black text-foreground/80 mb-4">Read past editions on beehiiv</h4>
                <p className="text-base text-foreground/60 mb-8 max-w-md mx-auto">
                  Every edition ships a deployable system. Outbound machines, AI agents, revenue ops — full build, architecture, and code.
                </p>
                <a
                  href="https://b2bagents.beehiiv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] rounded-[2px] hover:scale-[1.02] transition-transform"
                >
                  Browse All Editions
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
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
