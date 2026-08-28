import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { CASE_STUDY_SLUGS, getCaseStudy } from "@/lib/case-studies";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek case study";

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const c = getCaseStudy(params.slug);
  if (!c) {
    return ogImage({
      eyebrow: "Case Study",
      title: "Muditek case study",
      subtitle: "AI systems in production, owned by clients.",
    });
  }
  return ogImage({
    eyebrow: c.ogEyebrow,
    accent: c.accent,
    title: c.headline,
    subtitle: c.subhead,
  });
}
