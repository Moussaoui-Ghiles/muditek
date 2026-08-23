import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryCollection } from "@/components/library/library-collection";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { getPublishedLibraryItems } from "@/lib/library-manifest";

export const metadata: Metadata = {
  title: "Muditek Tools | Private Browser-Side Outbound Utilities",
  description: "Run quote, funnel, CSV quality, and brief-building tools without sending inputs to Muditek or a provider.",
  alternates: { canonical: "https://muditek.com/tools" },
};

export default function ToolsPage() {
  const items = getPublishedLibraryItems("tool");

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset="tools" lane="outbound" event="library_item_viewed" placement="tools-index" />
      <main id="main-content">
        <section className="mx-auto w-full max-w-[1180px] px-6 pb-16 pt-36 md:px-12 md:pb-24 md:pt-48">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Browser-side tools</p>
          <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">Your inputs stay on this device.</h1>
          <p className="mt-7 max-w-[70ch] text-lg leading-8 text-foreground/75">These tools run in the browser. They do not call a model, enrichment provider, search API, or Muditek server. Analytics records only the tool name and completion event.</p>
        </section>
        <LibraryCollection items={items} heading="Available now" description="Four focused tools for buying, measurement, list review, and outbound planning." />
      </main>
      <Footer />
    </div>
  );
}
