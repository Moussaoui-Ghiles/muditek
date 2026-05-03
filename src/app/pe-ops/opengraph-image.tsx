import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Operational Infrastructure for Investment Firms — Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "PE Operations",
    accent: "sky",
    title: "Operational infrastructure for investment firms.",
    subtitle:
      "Investor onboarding in 3-5 days. KYC automated. You own the platform — alternative to Juniper Square.",
  });
}
