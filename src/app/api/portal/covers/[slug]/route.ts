import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { categoryLabel } from "@/lib/content-item";
import { getPortalSkill } from "@/lib/portal-skills";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.,;:]$/, "")}…`;
  }
  return lines.slice(0, maxLines);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT title, category, description, file_type
    FROM content_items
    WHERE slug = ${slug}
    LIMIT 1
  `;

  let item = rows[0] as
    | { title?: string; category?: string; description?: string; file_type?: string }
    | undefined;

  if (!item?.title) {
    const skill = getPortalSkill(slug);
    if (skill) item = { title: skill.name, category: "skill" };
  }

  if (!item?.title) {
    return new NextResponse("Cover not found.", { status: 404 });
  }

  const label = escapeXml(categoryLabel(item.category || "Resource"));
  const fileType = (item.file_type || "").trim().toUpperCase();
  const titleLines = wrapText(item.title, 22, 3).map(escapeXml);
  const titleSvg = titleLines
    .map((line, index) => `<text x="72" y="${260 + index * 64}" class="title">${line}</text>`)
    .join("");

  const descLines = item.description
    ? wrapText(item.description, 52, 2).map(escapeXml)
    : [];
  const descStartY = 260 + titleLines.length * 64 + 18;
  const descSvg = descLines
    .map((line, index) => `<text x="72" y="${descStartY + index * 38}" class="desc">${line}</text>`)
    .join("");

  const footer = fileType
    ? `MUDITEK PORTAL &#183; ${escapeXml(fileType)}`
    : "MUDITEK PORTAL";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="760" viewBox="0 0 1200 760" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="0.82" cy="0.12" r="0.7">
      <stop offset="0%" stop-color="rgba(245,158,11,0.20)"/>
      <stop offset="55%" stop-color="rgba(245,158,11,0.04)"/>
      <stop offset="100%" stop-color="rgba(245,158,11,0)"/>
    </radialGradient>
    <pattern id="hatch" width="22" height="22" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="22" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="760" fill="#0A0A0C"/>
  <rect width="1200" height="760" fill="url(#hatch)"/>
  <rect width="1200" height="760" fill="url(#glow)"/>
  <rect x="1.5" y="1.5" width="1197" height="757" rx="6" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
  <path d="M72 120H160" stroke="rgba(245,158,11,0.85)" stroke-width="4"/>
  <text x="184" y="128" class="label">${label}</text>
  ${titleSvg}
  ${descSvg}
  <text x="72" y="688" class="footer">${footer}</text>
  <style>
    .label { fill: rgba(255,255,255,0.62); font: 700 26px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 7px; }
    .title { fill: #F5F5F7; font: 900 54px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: -2px; }
    .desc { fill: rgba(255,255,255,0.55); font: 400 24px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: -0.2px; }
    .footer { fill: rgba(255,255,255,0.42); font: 800 20px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 6px; }
  </style>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
