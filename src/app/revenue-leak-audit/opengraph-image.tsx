import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Revenue Leak Audit — Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "Revenue Leak Audit",
    accent: "emerald",
    title: "Find where your B2B SaaS pipeline loses money.",
    subtitle:
      "Diagnose €80–180K/year in pipeline leaks, in euros, with formulas. Fixed by AI systems. €50K guarantee.",
  });
}
