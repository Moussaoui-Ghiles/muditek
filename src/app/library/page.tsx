import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PUBLIC_PLAYBOOKS, PUBLIC_SKILLS, PUBLIC_TOOLS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Public Library | Muditek",
  description: "Practical Muditek guides, browser tools, and downloadable workflows for B2B operators.",
  alternates: { canonical: "https://muditek.com/library" },
};

const COLLECTIONS = [
  {
    href: "/playbooks",
    title: "Playbooks",
    count: PUBLIC_PLAYBOOKS.length,
    description: "Complete guides for outbound and AI systems.",
  },
  {
    href: "/skills",
    title: "Skills",
    count: PUBLIC_SKILLS.length,
    description: "Downloadable instructions and working files.",
  },
  {
    href: "/tools",
    title: "Tools",
    count: PUBLIC_TOOLS.length,
    description: "Browser calculators that use only the values you enter.",
  },
];

const FEATURED = [
  PUBLIC_PLAYBOOKS[0],
  PUBLIC_PLAYBOOKS[1],
  PUBLIC_TOOLS[0],
  PUBLIC_SKILLS.find((item) => item.slug === "google-maps-owner-email-finder")!,
];

export default function PublicLibraryPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Muditek public library</p>
            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">Systems you can use.</h1>
            <p className="mt-8 max-w-[65ch] text-lg leading-8 text-foreground/70">One public library. Choose a guide, a downloadable workflow, or a browser tool.</p>
          </div>
        </header>
        <section className="py-14 md:py-20">
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <div className="grid gap-5 md:grid-cols-3">
              {COLLECTIONS.map((collection) => (
                <Link key={collection.href} href={collection.href} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 transition-colors hover:border-primary/50">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{collection.count} public resources</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{collection.title}</h2>
                  <p className="mt-5 text-base leading-7 text-foreground/65">{collection.description}</p>
                  <p className="mt-7 text-sm font-bold text-foreground/55 group-hover:text-primary">Browse {collection.title.toLowerCase()} →</p>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Start here</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">Featured resources</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {FEATURED.map((item) => {
                const href = `/${item.kind === "playbook" ? "playbooks" : item.kind === "skill" ? "skills" : "tools"}/${item.slug}`;
                return (
                  <Link key={`${item.kind}-${item.slug}`} href={href} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 transition-colors hover:border-primary/50">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{item.kind}</p>
                    <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{item.title}</h3>
                    <p className="mt-5 text-base leading-7 text-foreground/65">{item.summary}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <section className="border-t border-white/[0.06] py-14 md:py-20">
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Public and account libraries</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] md:text-5xl">Clear split. Same resource types.</h2>
            <p className="mt-5 max-w-[65ch] text-base leading-7 text-foreground/65">
              Everything on this page is public. Your account library at <Link href="/portal" className="font-bold text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary">/portal</Link> contains account resources and saved access.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
