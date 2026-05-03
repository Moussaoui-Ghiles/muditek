import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "B2B Agents Newsletter — Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "Newsletter",
    title: "B2B Agents — AI automation systems weekly.",
    subtitle:
      "Join 5,000+ operators. Real implementations: prompts, n8n workflows, agentic SDR systems. Free, every week.",
  });
}
