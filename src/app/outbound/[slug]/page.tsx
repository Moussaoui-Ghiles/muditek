import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcquisitionContentPage } from "@/components/acquisition/content-page";
import {
  getAcquisitionPage,
  getRenderableAcquisitionPage,
  getRenderableAcquisitionPages,
} from "@/lib/acquisition/content-registry";

const FAMILIES = ["operational-workflow", "definition-economics", "signal-method"] as const;

export const dynamicParams = false;

function findPage(slug: string, renderable: boolean) {
  for (const family of FAMILIES) {
    const page = renderable ? getRenderableAcquisitionPage(family, slug) : getAcquisitionPage(family, slug);
    if (page) return page;
  }
}

export function generateStaticParams() {
  return getRenderableAcquisitionPages([...FAMILIES]).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug, false);
  if (!page) return { title: "Outbound guide not found | Muditek", robots: { index: false, follow: false } };
  const isPublished = page.status === "published";
  return {
    title: `${page.title} | Muditek`,
    description: page.description,
    alternates: { canonical: `https://muditek.com${page.canonicalPath}` },
    robots: { index: isPublished, follow: isPublished },
    openGraph: { title: page.title, description: page.description, url: page.canonicalPath, type: "article" },
  };
}

export default async function OutboundContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage(slug, true);
  if (!page) notFound();
  return <AcquisitionContentPage page={page} />;
}
