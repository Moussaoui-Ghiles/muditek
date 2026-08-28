import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek — Case Studies";

export default function Image() {
  return ogImage({
    eyebrow: "Case Studies",
    title: "AI systems in production. Owned by clients.",
    subtitle:
      "Five real-pattern case studies across PE, B2B SaaS, agencies, telecom, and fintech. Anonymized; results documented.",
  });
}
