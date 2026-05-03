import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "mudiAgent — Digital Employees for Telecom & Enterprise";

export default function Image() {
  return ogImage({
    eyebrow: "mudiAgent",
    accent: "primary",
    title: "Digital employees for telecom & enterprise.",
    subtitle:
      "On-premises AI that automates SLA reporting, knowledge search, follow-ups, and software operation. 40-hour guarantee.",
  });
}
