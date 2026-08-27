import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryCollection } from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Skills | Downloadable Workflows",
  description: "Complete workflows and working files for outbound, content systems, and agent work.",
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
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">Download the workflow and working files.</h1>
          <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/75">Read what each skill does and what it needs before you download it. Core skills are fully public. Advanced skill files need a free account.</p>
        </section>
        <LibraryCollection items={items.filter((item) => item.access === "public")} heading="Public core" description="Read and download these complete bundles without an account." />
        <LibraryCollection items={items.filter((item) => item.access === "account")} heading="Advanced skills" description="Read the complete instructions first. Create a free account only when you need all supporting files." />
      </main>
      <Footer />
    </div>
  );
}
