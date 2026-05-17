import { auth } from "@clerk/nextjs/server";
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

function wrapTitle(title: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 24 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length === 3) break;
  }

  if (current && lines.length < 4) lines.push(current);
  return lines.slice(0, 4);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return new NextResponse("Sign in required.", { status: 401 });
  }

  const { slug } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT title, category
    FROM content_items
    WHERE slug = ${slug}
    LIMIT 1
  `;

  let item = rows[0] as { title?: string; category?: string } | undefined;
  if (!item?.title) {
    const skill = getPortalSkill(slug);
    if (skill) item = { title: skill.name, category: "skill" };
  }

  if (!item?.title) {
    return new NextResponse("Cover not found.", { status: 404 });
  }

  const label = escapeXml(categoryLabel(item.category || "Resource"));
  const titleLines = wrapTitle(item.title).map(escapeXml);
  const lineSvg = titleLines
    .map((line, index) => `<text x="64" y="${198 + index * 52}" class="title">${line}</text>`)
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="760" viewBox="0 0 1200 760" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="760" fill="#0A0A0C"/>
  <rect x="1" y="1" width="1198" height="758" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  <circle cx="1020" cy="90" r="380" fill="rgba(245,158,11,0.12)"/>
  <circle cx="64" cy="718" r="300" fill="rgba(16,185,129,0.10)"/>
  <path d="M64 96H320" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
  <text x="64" y="148" class="label">${label}</text>
  ${lineSvg}
  <path d="M64 626H250" stroke="rgba(245,158,11,0.78)" stroke-width="4"/>
  <text x="64" y="674" class="footer">MUDITEK PORTAL</text>
  <style>
    .label { fill: rgba(255,255,255,0.55); font: 700 28px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 8px; text-transform: uppercase; }
    .title { fill: #F5F5F7; font: 900 46px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: -1.5px; }
    .footer { fill: rgba(255,255,255,0.44); font: 800 22px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 7px; }
  </style>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
