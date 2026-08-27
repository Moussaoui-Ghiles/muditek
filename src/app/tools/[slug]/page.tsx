import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AcquisitionPageView } from "@/components/acquisition-tracking";
import { JsonLd } from "@/components/json-ld";
import { CommercialNextStep } from "@/components/library/library-collection";
import { CsvListQualityAuditor, OutboundBriefBuilder, OutboundFunnelCalculator } from "@/components/library/public-tools";
import { formatLibraryDate, getLibraryItem, getPublishedLibraryItems } from "@/lib/library-manifest";

const TOOL_COMPONENTS = {
  "outbound-funnel-economics-calculator": OutboundFunnelCalculator,
  "csv-list-quality-auditor": CsvListQualityAuditor,
  "outbound-brief-builder": OutboundBriefBuilder,
} as const;

export function generateStaticParams() {
  return getPublishedLibraryItems("tool")
    .filter((item) => item.slug in TOOL_COMPONENTS)
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItem("tool", slug);
  if (!item || item.status !== "published") return { title: "Tool not found | Muditek" };
  const url = `https://muditek.com/tools/${item.slug}`;
  return { title: `${item.title} | Muditek`, description: item.summary, alternates: { canonical: url } };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLibraryItem("tool", slug);
  if (!item) notFound();
  if (item.status === "redirected" && item.redirectTarget) permanentRedirect(item.redirectTarget);
  if (item.status !== "published") notFound();
  const Tool = TOOL_COMPONENTS[item.slug as keyof typeof TOOL_COMPONENTS];
  if (!Tool) notFound();
  const url = `https://muditek.com/tools/${item.slug}`;
  const methodSource = item.relatedAssets[0];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <Navbar />
      <AcquisitionPageView asset={item.slug} lane={item.lane} event="library_item_viewed" placement="tool-page" />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: item.title,
        description: item.summary,
        url,
        dateModified: item.updatedAt,
        author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" },
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      }} />
      <main id="main-content">
        <header className="border-b border-white/[0.06] pb-12 pt-32 md:pb-16 md:pt-40">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
            <Link href="/tools" className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← All tools</Link>
            <p className="mt-9 text-xs font-black uppercase tracking-[0.2em] text-primary">Runs on this device</p>
            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-5xl md:text-6xl">{item.title}</h1>
            <p className="mt-7 max-w-[70ch] text-lg leading-8 text-foreground/75">{item.summary}</p>
            <p className="mt-5 max-w-[74ch] text-sm leading-6 text-foreground/60">Your inputs stay in your browser. Muditek records only that the tool was completed, not the values, file contents, or result.</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-foreground/55">
              <span>By Ghiles Moussaoui</span><span aria-hidden="true">•</span><span>Updated {formatLibraryDate(item.updatedAt)}</span>
              {methodSource ? <><span aria-hidden="true">•</span><Link href={methodSource} className="text-primary hover:underline">Method source</Link></> : null}
            </div>
          </div>
        </header>
        <section className="py-10 md:py-16">
          <div className="mx-auto w-full max-w-[1180px] px-6 md:px-12"><Tool /></div>
        </section>
        <CommercialNextStep item={item} />
      </main>
      <Footer />
    </div>
  );
}
