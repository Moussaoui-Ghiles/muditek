import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import type { AcquisitionFamily, AcquisitionPageDefinition } from "@/lib/acquisition/content-registry";

const LABELS: Record<AcquisitionFamily, string> = {
  "commercial-decision": "Buyer decision guides",
  "operational-workflow": "Operating workflows",
  "definition-economics": "Definitions and economics",
  template: "Templates and checklists",
  "signal-method": "Signal methods",
};

export function AcquisitionContentHub({ title, description, pages, asset }: { title: string; description: string; pages: AcquisitionPageDefinition[]; asset: string }) {
  const groups = Object.entries(Object.groupBy(pages, (page) => page.family)) as [AcquisitionFamily, AcquisitionPageDefinition[]][];
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset={asset} lane="outbound" event="library_item_viewed" placement="acquisition-hub" />
      <main id="main-content">
        <header className="border-b border-white/[0.07] pb-16 pt-36 md:pb-24 md:pt-48">
          <div className="mx-auto w-full max-w-[1120px] px-6 md:px-12">
            <p className="text-sm font-bold text-primary">Muditek field library</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl md:text-7xl">{title}</h1>
            <p className="mt-7 max-w-[68ch] text-lg leading-8 text-foreground/70">{description}</p>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1120px] px-6 py-16 md:px-12 md:py-24">
          {groups.map(([family, items]) => (
            <section key={family} className="mb-20 last:mb-0">
              <h2 className="text-3xl font-black tracking-[-0.03em]">{LABELS[family]}</h2>
              <div className="mt-7 grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
                {items.map((page) => (
                  <Link key={page.canonicalPath} href={page.canonicalPath} className="group min-h-44 bg-background p-6 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary">
                    <p className="text-sm font-bold text-primary">{page.uniqueValue}</p>
                    <h3 className="mt-3 text-xl font-black tracking-[-0.02em] group-hover:text-primary">{page.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-foreground/62">{page.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
