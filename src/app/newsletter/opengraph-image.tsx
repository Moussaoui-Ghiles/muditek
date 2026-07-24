import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek Newsletter";

export default function Image() {
  return ogImage({
    eyebrow: "Newsletter",
    title: "Make one workflow AI-executable each week.",
    subtitle:
      "The inputs, instructions, source material, AI steps, and human checks behind real business work.",
  });
}
