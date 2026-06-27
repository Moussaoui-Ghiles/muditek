import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import {
  PUBLIC_SKILL_SLUGS,
  getPublicSkill,
  SKILL_CATEGORY_META,
} from "@/lib/skills-public";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek AI skill";

export function generateStaticParams() {
  return PUBLIC_SKILL_SLUGS.map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const s = getPublicSkill(params.slug);
  if (!s) {
    return ogImage({
      eyebrow: "AI Skill",
      title: "Muditek AI skill",
      subtitle: "Skills that do the work, not headcount.",
    });
  }
  const cat = SKILL_CATEGORY_META[s.category];
  return ogImage({
    eyebrow: cat.label,
    accent: cat.accent,
    title: s.title,
    subtitle: s.outcome,
  });
}
