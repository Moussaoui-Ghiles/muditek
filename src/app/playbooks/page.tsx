import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryCollection } from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Playbooks | Outbound and AI Systems",
  description: "Curated public playbooks for outbound operations and practical AI implementation.",
  alternates: { canonical: "https://muditek.com/playbooks" },
};

export default function PlaybooksPage() {
  const items = getPublishedLibraryItems("playbook");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="playbooks" lane="outbound" event="library_item_viewed" placement="playbooks-index" />
      <main id="main-content">
        <section className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Playbooks</p>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">The method, in full.</h1>
          <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/75">No excerpt gate. Each published playbook is readable without an account and links only to the commercial capability that can implement it.</p>
        </section>
        <LibraryCollection items={items.filter((item) => item.lane === "outbound")} heading="Outbound" description="Diagnosis, research, list building, cold email, and agent-assisted SDR operations." />
        <LibraryCollection items={items.filter((item) => item.lane === "ai-implementation")} heading="AI implementation" description="Local AI, data agents, content systems, coding agents, GEO, and judgment-aware loops." />
      </main>
      <Footer />
    </div>
  );
}
