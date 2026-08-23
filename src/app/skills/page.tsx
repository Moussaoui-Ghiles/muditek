import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryCollection } from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Skills | Downloadable Agent Workflows",
  description: "Public core skills and free-account bundles for outbound, content systems, and agent work.",
  alternates: { canonical: "https://muditek.com/skills" },
};

export default function SkillsPage() {
  const items = getPublishedLibraryItems("skill");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="skills" lane="outbound" event="library_item_viewed" placement="skills-index" />
      <main id="main-content">
        <section className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Skills</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">Files your agent can use.</h1>
          <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/75">Core skills and their complete bundles are public. Advanced pages explain the problem, inputs, outputs, prerequisites, version, and file manifest. A free account unlocks the tested bundle download.</p>
        </section>
        <LibraryCollection items={items.filter((item) => item.access === "public")} heading="Public core" description="Read and download these complete bundles without an account." />
        <LibraryCollection items={items.filter((item) => item.access === "account")} heading="Advanced bundles" description="Inspect the public page first. Create a free account only when you need the complete versioned bundle." />
      </main>
      <Footer />
    </div>
  );
}
