import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "mudiAgent vs ChatGPT Enterprise in 2026 — Muditek comparison";

export default function Image() {
  return ogImage({
    accent: "primary",
    eyebrow: "Comparison",
    title: "mudiAgent vs ChatGPT Enterprise in 2026.",
    subtitle:
      "On-premises digital employee with workflow automation vs cloud chatbox. Data sovereignty, no per-user fees, scheduled autonomous operation.",
  });
}
