import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcquisitionContentPage } from "@/components/acquisition/content-page";
import { getAcquisitionPage, getRenderableAcquisitionPage, getRenderableAcquisitionPages } from "@/lib/acquisition/content-registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRenderableAcquisitionPages(["template"]).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getAcquisitionPage("template", slug);
  if (!page) return { title: "Template not found | Muditek", robots: { index: false, follow: false } };
  const isPublished = page.status === "published";
  return {
    title: `${page.title} | Muditek`,
    description: page.description,
    alternates: { canonical: `https://muditek.com${page.canonicalPath}` },
    robots: { index: isPublished, follow: isPublished },
    openGraph: { title: page.title, description: page.description, url: page.canonicalPath, type: "article" },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getRenderableAcquisitionPage("template", slug);
  if (!page) notFound();
  return <AcquisitionContentPage page={page} />;
}
