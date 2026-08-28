import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PUBLIC_PLAYBOOKS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Muditek Playbooks | Outbound and AI Systems",
  description: "Complete operating guides for outbound, local lead generation, and AI implementation.",
  alternates: { canonical: "https://muditek.com/playbooks" },
};

const GROUPS = [
  {
    title: "Outbound systems",
    description: "Lead research, cold email, and outbound agents.",
    items: PUBLIC_PLAYBOOKS.slice(0, 7),
  },
  {
    title: "AI implementation",
    description: "Local AI, agent loops, content systems, SEO, and human review.",
    items: PUBLIC_PLAYBOOKS.slice(7),
  },
];

export default function PlaybooksPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <Link href="/library" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← Library</Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">Playbooks</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">Complete operating guides.</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/70">Read the method before you buy software or automate the work.</p>
          </div>
        </header>
        {GROUPS.map((group) => (
          <section key={group.title} className="border-b border-white/[0.06] py-14 last:border-b-0 md:py-20">
            <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
              <h2 className="text-4xl font-black tracking-[-0.04em]">{group.title}</h2>
              <p className="mt-4 text-base leading-7 text-foreground/65">{group.description}</p>
              <div className="mt-9 grid gap-5 md:grid-cols-2">
                {group.items.map((item) => (
                  <Link key={item.slug} href={`/playbooks/${item.slug}`} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 hover:border-primary/50">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{item.topic}</p>
                    <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{item.title}</h3>
                    <p className="mt-5 text-base leading-7 text-foreground/65">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
