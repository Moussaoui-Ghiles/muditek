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
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.035em] text-foreground sm:text-6xl md:text-8xl">
              Practical assets for outbound and AI implementation.
            </h1>
            <p className="mt-8 max-w-[68ch] text-lg leading-8 text-foreground/75">
              Read the method, inspect the files, run the tool, or download the skill. Public assets work without an account. Advanced skill bundles use a free account so versions and downloads stay connected.
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
          description="Offer review, buyer-signal research, list quality, funnel economics, and implementation playbooks. These assets lead only to the appointment-setting offer."
        />
        <LibraryCollection
          items={ai}
          heading="AI implementation"
          description="Local AI, agent loops, content systems, data agents, SEO, and GEO. These assets describe applications of the implementation capability, not separate offers or client proof."
        />
      </main>

      <Footer />
    </div>
  );
}
