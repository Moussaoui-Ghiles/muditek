import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "About",
    title: "We diagnose where companies lose money to manual ops.",
    subtitle:
      "Then we build the AI systems that fix it. 35+ systems deployed. $3M+ in revenue generated and saved.",
  });
}
