import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "MudiKit — Muditek";

export default function Image() {
  return ogImage({
    eyebrow: "MudiKit",
    accent: "primary",
    title: "Ship AI systems your team will actually use.",
    subtitle:
      "Production-grade Claude Code skills, prompts, and operator playbooks. Pay once, own forever.",
  });
}
