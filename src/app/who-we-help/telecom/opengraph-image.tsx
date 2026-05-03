import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";
import { INDUSTRIES } from "@/lib/industries";

const ind = INDUSTRIES["telecom"];

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `Muditek for ${ind.label}`;

export default function Image() {
  return ogImage({
    eyebrow: ind.shortLabel,
    accent: ind.accent,
    title: `AI systems for ${ind.label} in 2026.`,
    subtitle: ind.oneLiner,
  });
}
