import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { resourceDetailHref } from "@/lib/content-item";
import { getContentItemBySlug } from "@/lib/content-library";

const BASE_URL = "https://muditek.com";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);
  if (!item || !item.is_free) return {};

  return {
    title: `${item.title} | Muditek`,
    description: item.description ?? "Free Muditek resource.",
    robots: { index: false, follow: false },
    openGraph: {
      title: item.title,
      description: item.description ?? "Free Muditek resource.",
      url: `${BASE_URL}/resources/${slug}`,
      type: "article",
      images: item.thumbnail_url ? [item.thumbnail_url] : undefined,
    },
    alternates: {
      canonical: `${BASE_URL}${resourceDetailHref(item)}`,
    },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);
  if (!item || !item.is_free) notFound();

  redirect(resourceDetailHref(item));
}
