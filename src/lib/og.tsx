import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

type Accent = "neutral" | "primary" | "emerald" | "sky";

const ACCENTS: Record<Accent, { bar: string; tag: string; tagText: string }> = {
  neutral: { bar: "#e8e8ec", tag: "rgba(232,232,236,0.10)", tagText: "#e8e8ec" },
  primary: { bar: "#e8e8ec", tag: "rgba(232,232,236,0.10)", tagText: "#e8e8ec" },
  emerald: { bar: "#34d399", tag: "rgba(52,211,153,0.12)", tagText: "#6ee7b7" },
  sky: { bar: "#7dd3fc", tag: "rgba(125,211,252,0.12)", tagText: "#bae6fd" },
};

export function ogImage(args: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  accent?: Accent;
}): ImageResponse {
  const accent = ACCENTS[args.accent ?? "neutral"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 20% 0%, #16181d 0%, #0a0a0c 55%, #060608 100%)",
          color: "#e8e8ec",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg,#C8D4E0 0%,#5A6D80 100%)",
              }}
            />
            <span>Muditek</span>
          </div>
          {args.eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "10px 18px",
                borderRadius: 999,
                background: accent.tag,
                color: accent.tagText,
              }}
            >
              {args.eyebrow}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 6,
              borderRadius: 999,
              background: accent.bar,
            }}
          />
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            {args.title}
          </div>
          {args.subtitle ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                lineHeight: 1.3,
                color: "#a0a0a6",
                maxWidth: 980,
              }}
            >
              {args.subtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#7a7a82",
            letterSpacing: 0.4,
          }}
        >
          <span>muditek.com</span>
          <span>AI systems that eliminate operational waste</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
