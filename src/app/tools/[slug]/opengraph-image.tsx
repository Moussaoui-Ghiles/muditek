import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import {
  PUBLIC_TOOL_SLUGS,
  getPublicTool,
  TOOL_CATEGORY_META,
} from "@/lib/tools-public";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek free lead tool";

export function generateStaticParams() {
  return PUBLIC_TOOL_SLUGS.map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const t = getPublicTool(params.slug);
  if (!t) {
    return ogImage({
      eyebrow: "Free Tool",
      title: "Muditek lead tools",
      subtitle: "Find leads, free. No card.",
    });
  }
  const cat = TOOL_CATEGORY_META[t.category];
  return ogImage({
    eyebrow: cat.label,
    accent: cat.accent,
    title: t.title,
    subtitle: t.outcome,
  });
}
