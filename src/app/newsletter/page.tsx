import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "B2B Agents Newsletter — AI Automation Systems & Revenue Operations | Muditek",
  description: "AI automation systems, workflows, and revenue operations — delivered to your inbox. 5,300+ subscribers. 40% open rate. Join free.",
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
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/posts?status=confirmed&limit=20&direction=desc&order_by=publish_date`,
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

      {/* ══════ HERO ══════ */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 w-full flex justify-center relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[900px] w-full px-6 md:px-12 relative z-10 text-center">
          <ScrollReveal>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary/70 mb-8 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Newsletter
              <span className="w-8 h-[1px] bg-primary/50" />
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-[-0.04em] leading-[0.9] text-foreground mb-8 uppercase text-balance">
              B2B <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 opacity-90">Agents</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-base md:text-lg text-foreground/50 font-light leading-relaxed max-w-xl mx-auto mb-10">
              AI automation systems, workflows, and revenue operations — delivered to your inbox. No fluff. Every edition ships a system you can use.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <a
              href="https://b2bagents.beehiiv.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press group relative inline-flex items-center justify-center px-12 py-5 bg-foreground text-background text-[12px] font-black uppercase tracking-[0.2em] overflow-hidden rounded-[2px] transition-transform hover:scale-[1.02] duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                Subscribe Free
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <div className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-500 ease-in-out z-0" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="py-8 w-full flex justify-center border-t border-b border-white/[0.03] bg-card/[0.15]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-[10px] font-mono uppercase tracking-widest text-foreground/40">
          <span>5,300+ subscribers</span>
          <span className="hidden md:inline text-foreground/10">|</span>
          <span>40% open rate</span>
          <span className="hidden md:inline text-foreground/10">|</span>
          <span>Free forever</span>
        </div>
      </section>

      {/* ══════ ARTICLES GRID ══════ */}
      <section className="py-32 md:py-40 w-full flex justify-center relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1100px] w-full px-6 md:px-12 relative z-10">
          <ScrollReveal>
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary/70 mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/50" />
              Past Editions
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-[-0.03em] leading-[0.9] text-foreground mb-16 uppercase">
              Every edition ships a <span className="text-primary italic font-medium">system.</span>
            </h3>
          </ScrollReveal>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 60}>
                  <a
                    href={post.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full border border-white/[0.05] bg-card/[0.2] hover:bg-card/[0.5] backdrop-blur-md p-8 rounded-[4px] transition-all duration-700 card-lift overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-[1.2s]" />
                    <div className="text-[10px] font-mono text-foreground/30 tracking-wider mb-4">
                      {formatDate(post.publish_date || post.created)}
                    </div>
                    <h4 className="text-base font-bold text-foreground/80 group-hover:text-foreground transition-colors leading-snug mb-3">
                      {post.title}
                    </h4>
                    {post.subtitle && (
                      <p className="text-[12px] text-foreground/40 font-light leading-relaxed line-clamp-2">
                        {post.subtitle}
                      </p>
                    )}
                    <div className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 group-hover:text-primary transition-colors flex items-center gap-2">
                      Read
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-foreground/30 text-sm">
              Articles loading from beehiiv... Check that BEEHIIV_API_KEY is set in your environment.
            </div>
          )}
        </div>
      </section>

      {/* ══════ BOTTOM CTA ══════ */}
      <section className="py-32 w-full flex justify-center relative border-t border-white/[0.02] bg-card/[0.15] mesh-subtle">
        <div className="max-w-[800px] w-full px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05] mb-8 text-balance uppercase">
              Every system I build gets shared here <span className="text-primary italic font-medium">first.</span>
            </h2>
            <p className="text-base text-foreground/50 max-w-xl mx-auto leading-relaxed font-light mb-12">
              AI automation blueprints, n8n workflows, revenue operations systems, and the exact tools I use to run Muditek. Free. No pitch.
            </p>
            <a
              href="https://b2bagents.beehiiv.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press relative inline-flex items-center justify-center border border-primary hover:bg-primary hover:text-background text-primary px-12 py-5 text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 rounded-[2px] group"
            >
              <span className="relative z-10 flex items-center gap-3">
                Subscribe Free
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-1 transition-transform stroke-current"><path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
