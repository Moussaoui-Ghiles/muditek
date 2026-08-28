import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PUBLIC_TOOLS } from "@/lib/public-library";

export const metadata: Metadata = {
  title: "Muditek Tools | Browser-Based Business Calculators",
  description: "Browser tools for cold email capacity and revenue operations planning.",
  alternates: { canonical: "https://muditek.com/tools" },
};

export default function ToolsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1100px] px-6 md:px-12">
            <Link href="/library" className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← Library</Link>
            <p className="mt-10 text-sm font-black uppercase tracking-[0.2em] text-primary">Browser tools</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">Run the numbers yourself.</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/70">The tools use the assumptions you enter. They do not present projections as results.</p>
          </div>
        </header>
        <section className="py-14 md:py-20">
          <div className="mx-auto grid w-full max-w-[1100px] gap-5 px-6 md:grid-cols-2 md:px-12">
            {PUBLIC_TOOLS.map((item) => (
              <Link key={item.slug} href={`/tools/${item.slug}`} className="group rounded-xl border border-white/[0.08] bg-card/30 p-7 hover:border-primary/50">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">{item.topic}</p>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] group-hover:text-primary">{item.title}</h2>
                <p className="mt-5 text-base leading-7 text-foreground/65">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
