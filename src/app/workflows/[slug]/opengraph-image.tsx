import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import {
  WORKFLOW_PUBLIC_SLUGS,
  getPublicWorkflow,
  WORKFLOW_CATEGORY_META,
} from "@/lib/workflows-public";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek n8n workflow";

export function generateStaticParams() {
  return WORKFLOW_PUBLIC_SLUGS.map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const w = getPublicWorkflow(params.slug);
  if (!w) {
    return ogImage({
      eyebrow: "n8n Workflow",
      title: "Muditek workflow archive",
      subtitle: "Automations that do the work, not headcount.",
    });
  }
  const cat = WORKFLOW_CATEGORY_META[w.category];
  return ogImage({
    eyebrow: `${cat.label} · n8n Workflow`,
    accent: cat.accent,
    title: w.title,
    subtitle: w.outcome,
  });
}
