import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { resourceShareHref } from "@/lib/content-item";
import { getContentItemBySlug } from "@/lib/content-library";

const BASE_URL = "https://muditek.com";

export const dynamic = "force-dynamic";

function publicPreviewImage(thumbnailUrl: string | null): string | null {
  if (!thumbnailUrl) return null;
  if (thumbnailUrl.startsWith("/playbooks/")) return null;
  if (thumbnailUrl.startsWith("/api/portal/")) return null;
  return thumbnailUrl;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);
  if (!item || !item.is_free) return {};
  const image = publicPreviewImage(item.thumbnail_url);

  return {
    title: `${item.title} | Muditek`,
    description: item.description ?? "Muditek resource.",
    robots: { index: false, follow: false },
    openGraph: {
      title: item.title,
      description: item.description ?? "Muditek resource.",
      url: `${BASE_URL}${resourceShareHref(item)}`,
      type: "article",
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `${BASE_URL}${resourceShareHref(item)}`,
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

  redirect(resourceShareHref(item));
}
