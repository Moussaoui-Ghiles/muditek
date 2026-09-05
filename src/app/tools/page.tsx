import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { NewsletterInline } from "@/components/newsletter-inline";
import { MudikitCta } from "@/components/mudikit-cta";
import { LibraryHeader, LibraryList } from "@/components/library/library-list";
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
        <LibraryHeader
          back={{ href: "/library", label: "Library" }}
          kicker="Tools"
          title="Run the numbers yourself."
          lead="Browser calculators that use only the values you enter. Nothing is presented as a projection."
        />
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 py-16 md:py-20">
            <LibraryList items={PUBLIC_TOOLS} />
          </div>
        </section>
        <MudikitCta
          variant="inline"
          headline="More tools live in the portal."
          body="Lead workbenches, scrapers, and research tools run inside a free portal account."
          ctaLabel="Open portal tools"
          href="/portal/tools"
          secondaryLabel="Create a portal account"
          secondaryHref="/sign-up"
        />
        <NewsletterInline source="tools" />
      </main>
      <Footer />
    </div>
  );
}
