import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

const LEGACY_TOOL_DESTINATIONS: Record<string, string> = {
  "outbound-funnel-economics-calculator": "/skills/outbound-funnel-economics",
  "csv-list-quality-auditor": "/skills/list-builder",
  "outbound-brief-builder": "/skills/cold-offer-review",
  "appointment-setting-quote-calculator": "/tools/revenue-leak-calculator",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = LEGACY_TOOL_DESTINATIONS[slug];
  return destination
    ? { title: "Resource moved | Muditek", alternates: { canonical: `https://muditek.com${destination}` } }
    : { title: "Tool not found | Muditek" };
}

export default async function LegacyToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = LEGACY_TOOL_DESTINATIONS[slug];
  if (!destination) notFound();
  permanentRedirect(destination);
}
