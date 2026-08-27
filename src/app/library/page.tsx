import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryCollection } from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Library | Outbound and AI Implementation",
  description: "Public skills, playbooks, and browser-side tools for outbound and practical AI implementation.",
  alternates: { canonical: "https://muditek.com/library" },
};

export default function LibraryPage() {
  const items = getPublishedLibraryItems();
  const outbound = items.filter((item) => item.lane === "outbound");
  const ai = items.filter((item) => item.lane === "ai-implementation");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="library" lane="outbound" event="library_item_viewed" placement="library-index" />

      <main id="main-content">
        <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-24 h-96 w-96 rounded-full bg-primary/[0.06] blur-[120px]" />
          <div className="relative mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Muditek Library</p>
            <h1 className="mt-6 max-w-5xl break-words text-[42px] font-black leading-[0.94] tracking-[-0.035em] text-foreground [overflow-wrap:anywhere] sm:text-6xl md:text-8xl">
              Diagnose outbound. Build better AI workflows.
            </h1>
            <p className="mt-8 max-w-[68ch] text-lg leading-8 text-foreground/75">
              Read a complete method, use a private browser tool, or download the working files. Everything is public except the complete files for advanced skills, which need a free account.
            </p>
            <nav aria-label="Library sections" className="mt-10 flex flex-wrap gap-3">
              <Link href="/skills" className="border border-white/[0.14] px-5 py-3 text-sm font-bold text-foreground hover:border-primary/60 hover:text-primary">Browse skills</Link>
              <Link href="/playbooks" className="border border-white/[0.14] px-5 py-3 text-sm font-bold text-foreground hover:border-primary/60 hover:text-primary">Read playbooks</Link>
              <Link href="/tools" className="border border-white/[0.14] px-5 py-3 text-sm font-bold text-foreground hover:border-primary/60 hover:text-primary">Use tools</Link>
            </nav>
          </div>
        </section>

        <LibraryCollection
          items={outbound}
          heading="Outbound"
          description="Review offers, find buyer signals, check list quality, model funnel economics, and improve outbound execution."
        />
        <LibraryCollection
          items={ai}
          heading="AI implementation"
          description="Build local AI, agent loops, content systems, data workflows, SEO, and GEO with explicit controls."
        />
      </main>

      <Footer />
    </div>
  );
}
