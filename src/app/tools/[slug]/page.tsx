import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AcquisitionPageView, TrackedBookingLink, TrackedSourceLink } from "@/components/acquisition-tracking";
import { JsonLd } from "@/components/json-ld";
import { CommercialNextStep } from "@/components/library/library-collection";
import { CsvListQualityAuditor, OutboundBriefBuilder, OutboundFunnelCalculator } from "@/components/library/public-tools";
import { CmsHealthcareStaffingExplorer, DkimChecker, DmarcChecker, DmarcGenerator, EmailAuthenticationChecker, PublicB2BSignalFinder, QualifiedMeetingSpecificationBuilder, SalesProspectingToolFinder, SpfChecker, SpfGenerator } from "@/components/tools/first-wave-tools";
import { ColdEmailInfrastructurePlanner, EmailHeaderAnalyzer, GoogleWorkspaceEmailAuthenticationSetup, MailProviderLookup, Microsoft365EmailAuthenticationSetup, OutboundFailureDiagnostic, OutboundMarketRunwayCalculator, SignalEvidenceGrader } from "@/components/tools/later-wave-tools";
import { getLibraryItem } from "@/lib/library-manifest";
import { getRenderableTool, getRenderableTools, getToolDefinition, type ToolComponentKey } from "@/lib/acquisition/tool-registry";

const TOOL_COMPONENTS: Record<ToolComponentKey, ComponentType> = {
  "outbound-funnel-economics-calculator": OutboundFunnelCalculator,
  "csv-list-quality-auditor": CsvListQualityAuditor,
  "outbound-brief-builder": OutboundBriefBuilder,
  "sales-prospecting-tool-finder": SalesProspectingToolFinder,
  "public-b2b-signal-finder": PublicB2BSignalFinder,
  "email-authentication-checker": EmailAuthenticationChecker,
  "dmarc-checker": DmarcChecker,
  "dkim-checker": DkimChecker,
  "dmarc-generator": DmarcGenerator,
  "spf-checker": SpfChecker,
  "spf-generator": SpfGenerator,
  "qualified-meeting-specification-builder": QualifiedMeetingSpecificationBuilder,
  "cms-healthcare-staffing-explorer": CmsHealthcareStaffingExplorer,
  "email-header-analyzer": EmailHeaderAnalyzer,
  "mail-provider-lookup": MailProviderLookup,
  "google-workspace-email-authentication-setup": GoogleWorkspaceEmailAuthenticationSetup,
  "microsoft-365-email-authentication-setup": Microsoft365EmailAuthenticationSetup,
  "cold-email-infrastructure-planner": ColdEmailInfrastructurePlanner,
  "outbound-market-runway-calculator": OutboundMarketRunwayCalculator,
  "signal-evidence-grader": SignalEvidenceGrader,
  "outbound-failure-diagnostic": OutboundFailureDiagnostic,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getRenderableTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolDefinition(slug);
  if (!tool) return { title: "Tool not found | Muditek" };
  return {
    title: `${tool.title} | Muditek`, description: tool.description,
    alternates: { canonical: `https://muditek.com${tool.canonicalPath}` },
    robots: tool.status === "published" ? undefined : { index: false, follow: false },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const libraryItem = getLibraryItem("tool", slug);
  if (libraryItem?.status === "redirected" && libraryItem.redirectTarget) permanentRedirect(libraryItem.redirectTarget);
  const tool = getRenderableTool(slug);
  if (!tool) notFound();
  const Tool = TOOL_COMPONENTS[tool.component];
  const url = `https://muditek.com${tool.canonicalPath}`;
  const methodIsExternal = tool.methodSource.startsWith("http");
  const technicalEmailTool = /(email|dmarc|dkim|spf|mail-provider)/.test(tool.slug);
  const signalTool = /(signal|prospecting|cms-healthcare)/.test(tool.slug);
  const related = technicalEmailTool
    ? [["Cold-email diagnosis", "/outbound/diagnose-cold-email-replies"], ["Cold-email agency checklist", "/appointment-setting/cold-email-outreach-agency"]]
    : signalTool
      ? [["Evaluate a buyer signal", "/outbound/evaluate-buyer-signals"], ["Public signals vs intent data", "/outbound/intent-data-vs-public-signals"]]
      : [["Track one outbound cohort", "/outbound/track-an-outbound-cohort"], ["Define a qualified meeting", "/templates/qualified-meeting-agreement"]];

  return <div className="min-h-[100dvh] bg-background text-foreground">
    <Navbar />
    <AcquisitionPageView asset={tool.slug} lane="outbound" event="organic_landing_viewed" placement="tool-page" pageFamily="tool" queryCluster={tool.primaryQuery} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: tool.title, description: tool.description, url, dateModified: tool.updatedAt, author: { "@type": "Person", name: "Ghiles Moussaoui", url: "https://muditek.com/about" }, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } }} />
    <main id="main-content">
      <header className="border-b border-white/[0.06] pb-14 pt-36 md:pb-20 md:pt-44"><div className="mx-auto w-full max-w-[1180px] px-6 md:px-12">
        <Link href="/tools" className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.18em] text-foreground/55 hover:text-primary">← All tools</Link>
        <p className="mt-9 text-xs font-black uppercase tracking-[0.2em] text-primary">Free outbound utility</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.035em] sm:text-6xl md:text-7xl">{tool.title}</h1>
        <p className="mt-7 max-w-[70ch] text-lg leading-8 text-foreground/75">{tool.description}</p>
        <p className="mt-5 max-w-[74ch] text-sm leading-6 text-foreground/55">{tool.privacy} Analytics records only the tool slug and start or completion event. It never records inputs or results.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-foreground/55"><span>By Ghiles Moussaoui</span><span aria-hidden="true">•</span><span>Updated {tool.updatedAt}</span><span aria-hidden="true">•</span>{methodIsExternal ? <TrackedSourceLink href={tool.methodSource} asset={tool.slug} placement="tool-method" className="inline-flex min-h-11 items-center text-primary hover:underline">Method source</TrackedSourceLink> : <Link href={tool.methodSource} className="inline-flex min-h-11 items-center text-primary hover:underline">Method source</Link>}</div>
      </div></header>
      <section className="py-10 md:py-16"><div className="mx-auto w-full max-w-[1180px] px-6 md:px-12"><Tool /></div></section>
      <nav aria-label="Related outbound resources" className="border-t border-white/[0.08] py-12"><div className="mx-auto w-full max-w-[1180px] px-6 md:px-12"><p className="font-bold">Use this tool with</p><div className="mt-5 flex flex-wrap gap-3">{related.map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center border border-white/20 px-4 text-sm font-semibold text-foreground/74 hover:border-primary hover:text-primary">{label}</Link>)}<Link href="/templates/outbound-pilot-plan" className="inline-flex min-h-11 items-center border border-white/20 px-4 text-sm font-semibold text-foreground/74 hover:border-primary hover:text-primary">Outbound pilot template</Link></div></div></nav>
      {libraryItem?.status === "published" ? <CommercialNextStep item={libraryItem} /> : <section className="border-t border-white/[0.08] py-16 md:py-20"><div className="mx-auto flex w-full max-w-[1180px] flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-12"><div><h2 className="text-3xl font-black tracking-[-0.025em]">Need the outbound work done?</h2><p className="mt-3 max-w-[60ch] text-sm leading-6 text-foreground/65">Muditek runs targeting, data, outreach, and follow-up. The delivery fee is charged for qualified meetings held.</p></div><TrackedBookingLink asset={tool.slug} lane="outbound" placement="tool-footer" className="inline-flex min-h-12 items-center bg-primary px-6 py-3 text-sm font-black text-background">Book a fit call</TrackedBookingLink></div></section>}
    </main>
    <Footer />
  </div>;
}
