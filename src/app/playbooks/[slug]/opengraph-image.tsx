import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { getLibraryItem, getPublishedLibraryItems } from "@/lib/library-manifest";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek playbook";

export function generateStaticParams() {
  return getPublishedLibraryItems("playbook").map((item) => ({ slug: item.slug }));
}

function titleFontSize(title: string): number {
  if (title.length > 70) return 52;
  if (title.length > 50) return 62;
  return 76;
}

function trim(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getLibraryItem("playbook", slug);

  if (!item || item.status !== "published") {
    return ogImage({
      eyebrow: "Playbook",
      title: "Muditek playbook",
      subtitle: "Complete operating methods for outbound and practical AI implementation.",
    });
  }

  return ogImage({
    eyebrow: "Playbook",
    title: item.title,
    titleFontSize: titleFontSize(item.title),
    subtitle: trim(item.summary, 180),
  });
}
