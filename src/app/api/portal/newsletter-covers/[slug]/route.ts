import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

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
    if (next.length > 26 && current) {
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

function formatDate(value: Date | string | null): string {
  if (!value) return "MUDITEK";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "MUDITEK";
  return date
    .toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sql = getDb();
  const rows = (await sql`
    SELECT subject, sent_at
    FROM newsletter_issues
    WHERE slug = ${slug}
      AND status = 'sent'
      AND html IS NOT NULL
      AND length(trim(html)) > 0
      AND (
        stats->>'portal_article' = 'true'
        OR stats->>'portalArticle' = 'true'
      )
    LIMIT 1
  `) as Array<{ subject: string; sent_at: Date | string | null }>;

  const issue = rows[0];
  if (!issue) {
    return new NextResponse("Cover not found.", { status: 404 });
  }

  const titleLines = wrapTitle(issue.subject).map(escapeXml);
  const titleSvg = titleLines
    .map((line, index) => `<text x="64" y="${220 + index * 56}" class="title">${line}</text>`)
    .join("");
  const date = escapeXml(formatDate(issue.sent_at));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="900" viewBox="0 0 1200 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="900" fill="#0A0A0C"/>
  <rect x="1" y="1" width="1198" height="898" stroke="#2A2A30" stroke-width="2"/>
  <rect x="820" y="0" width="380" height="900" fill="#111115"/>
  <rect x="846" y="64" width="290" height="772" stroke="#2B2B31" stroke-width="2"/>
  <rect x="64" y="104" width="246" height="4" fill="#F59E0B"/>
  <path d="M900 166H1076M900 218H1040M900 270H1098M900 322H1012" stroke="#3A3A42" stroke-width="18"/>
  <path d="M900 690H1100M900 742H1048" stroke="#F59E0B" stroke-opacity="0.5" stroke-width="18"/>
  <text x="64" y="166" class="label">NEWSLETTER ARTICLE</text>
  ${titleSvg}
  <path d="M64 750H245" stroke="#3A3A42" stroke-width="2"/>
  <text x="64" y="806" class="footer">${date}</text>
  <text x="64" y="850" class="brand">MUDITEK PORTAL</text>
  <style>
    .label { fill: #9CA3AF; font: 800 28px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 8px; }
    .title { fill: #F5F5F7; font: 900 52px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; letter-spacing: 0; }
    .footer { fill: #A1A1AA; font: 800 24px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 7px; }
    .brand { fill: #71717A; font: 800 18px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 7px; }
  </style>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
