import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { PLAYBOOK_SLUGS, getPlaybook, CATEGORY_META } from "@/lib/playbooks";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek playbook";

export function generateStaticParams() {
  return PLAYBOOK_SLUGS.map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const p = getPlaybook(params.slug);
  if (!p) {
    return ogImage({
      eyebrow: "Playbook",
      title: "Muditek playbook",
      subtitle: "Agents that replace real work, not headcount.",
    });
  }
  const cat = CATEGORY_META[p.category];
  return ogImage({
    eyebrow: cat.label,
    accent: cat.accent,
    title: p.title,
    subtitle: p.outcome,
  });
}
