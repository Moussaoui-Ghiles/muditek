import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek — Done-for-you B2B appointment setting";

export default function Image() {
  return ogImage({
    eyebrow: "Appointment setting for sales-led B2B teams",
    title: "Done-for-you outbound. Built around qualified meetings held.",
    subtitle: "Muditek runs targeting, list building, infrastructure, outreach, qualification, booking, and attendance follow-up.",
  });
}
