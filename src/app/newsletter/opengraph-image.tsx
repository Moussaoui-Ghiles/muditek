import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Newsletter | Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "Newsletter",
    title: "the newsletter: AI automation systems weekly.",
    subtitle:
      "One working system per issue: outbound engines, lead research, AI agents running operations.",
  });
}
