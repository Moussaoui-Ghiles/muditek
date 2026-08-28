import { categoryLabel } from "@/lib/content-item";
import { getContentItemBySlug } from "@/lib/content-library";
import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek resource";
export const dynamic = "force-dynamic";

function trim(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentItemBySlug(slug);

  if (!item || !item.is_free) {
    return ogImage({
      accent: "primary",
      eyebrow: "Resource",
      title: "Muditek Resource",
      subtitle: "Portal playbooks, guides, and tools for B2B operators.",
    });
  }

  return ogImage({
    accent: "primary",
    eyebrow: categoryLabel(item.category),
    title: trim(item.title, 100),
    subtitle: trim(item.description ?? "Muditek portal resource.", 180),
  });
}
