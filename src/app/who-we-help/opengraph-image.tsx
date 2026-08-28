import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek — Who We Help";

export default function Image() {
  return ogImage({
    eyebrow: "Who We Help",
    title: "Five industries. One method: diagnose, build, own.",
    subtitle:
      "AI systems for private equity, B2B SaaS, agencies, telecom, and fintech. Diagnose the waste in euros, then ship the systems that fix it.",
  });
}
