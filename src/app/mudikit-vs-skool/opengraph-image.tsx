import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "MudiKit vs Skool in 2026 — Muditek comparison";

export default function Image() {
  return ogImage({
    accent: "primary",
    eyebrow: "Comparison",
    title: "MudiKit vs Skool in 2026.",
    subtitle:
      "$47/mo Claude Code skills library you install and run vs hosted community platform with courses, threads, and gamification.",
  });
}
