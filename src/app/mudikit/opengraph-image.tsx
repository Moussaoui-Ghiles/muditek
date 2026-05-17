import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "MudiKit - $47/mo";

export default function Image() {
  return ogImage({
    eyebrow: "MudiKit · $47/mo",
    title: "The kit I run my business with.",
    subtitle:
      "Claude Code skills. Playbooks. Vault template. Outreach files. New drops every week.",
  });
}
