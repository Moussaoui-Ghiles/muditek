import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek — AI Systems That Eliminate Operational Waste";

export default function Image() {
  return ogImage({
    eyebrow: "Muditek",
    title: "AI systems that eliminate operational waste.",
    subtitle:
      "On-prem AI for telecom. Revenue recovery for B2B SaaS. Operational infrastructure for investment firms.",
  });
}
