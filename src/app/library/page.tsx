import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PUBLIC_PLAYBOOKS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Public Library | Muditek",
  description: "Practical Muditek guides, browser tools, and downloadable workflows for B2B operators.",
  alternates: { canonical: "https://muditek.com/library" },
};

const TOOLS = [
  {
    href: "/tools/cold-email-capacity-calculator",
    type: "Browser tool",
    title: "Cold Email Capacity Calculator",
    description: "Model mailboxes, domains, contact supply, funnel assumptions, and your entered costs.",
  },
  {
    href: "/skills/google-maps-owner-email-finder",
    type: "Downloadable package",
    title: "Google Maps Owner and Email Finder",
    description: "Find explicit owner evidence and public website emails without paid APIs or guessed data.",
  },
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
            <p className="mt-8 max-w-[65ch] text-lg leading-8 text-foreground/70">Complete guides, browser tools, and working packages you can use.</p>
          </div>
        </header>
        <section className="py-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1100px] gap-5 px-6 md:grid-cols-2 md:px-12">
            {PUBLIC_PLAYBOOKS.map((playbook) => (
              <Link key={playbook.slug} href={`/playbooks/${playbook.slug}`} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 transition-colors hover:border-primary/50">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Guide</p>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{playbook.title}</h2>
                <p className="mt-5 text-base leading-7 text-foreground/65">{playbook.summary}</p>
              </Link>
            ))}
            {TOOLS.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 transition-colors hover:border-primary/50">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{item.type}</p>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{item.title}</h2>
                <p className="mt-5 text-base leading-7 text-foreground/65">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
