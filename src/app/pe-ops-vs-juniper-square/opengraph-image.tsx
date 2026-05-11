import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek vs Juniper Square in 2026 — PE operations comparison";

export default function Image() {
  return ogImage({
    accent: "sky",
    eyebrow: "Comparison",
    title: "Muditek vs Juniper Square in 2026.",
    subtitle:
      "Own a custom PE ops platform for €40-80K one-time vs rent Juniper Square at $700K+/year. KYC, e-signatures, fee computation, full source.",
  });
}
