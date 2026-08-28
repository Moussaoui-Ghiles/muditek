import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ScrapedLink = {
  url: string;
  title: string;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function normalizeUrl(value: string, baseUrl: string): string | null {
  try {
    const absolute = new URL(value, baseUrl);
    if (!["http:", "https:"].includes(absolute.protocol)) return null;
    return absolute.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function stripTitle(value: string): string {
  return text(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromTitle(value: string): string {
  return text(value).replace(/\s+/g, " ").trim();
}

function extractEmails(source: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?!\s*[\w])/g;
  const matches = source.match(emailRegex) || [];
  return unique(matches.map((email) => email.toLowerCase()));
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
  const maxLinks = Math.min(Math.max(Number(body?.maxUrls) || 100, 1), 500);

  if (!rawUrl) {
    return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
  }

  try {
    new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
  }

  const response = await fetch(rawUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; MuditekPortalTool/1.0; +https://muditek.com)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      {
        error: `Website fetch failed: ${response.status}`,
        detail: error.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return NextResponse.json({
      sourceUrl: rawUrl,
      totalFound: 0,
      urls: [],
      emails: [],
      warning: "The response was not an HTML page.",
    });
  }

  const html = await response.text();

  const linksRegex = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  const found: ScrapedLink[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(linksRegex)) {
    const href = text(match[2]);
    if (!href) continue;

    const absolute = normalizeUrl(href, rawUrl);
    if (!absolute || seen.has(absolute)) continue;

    const title = extractTextFromTitle(match[3] || absolute);
    seen.add(absolute);
    found.push({ url: absolute, title: title || absolute });
  }

  const results = found.slice(0, maxLinks).map((item) => ({
    url: item.url,
    title: text(stripTitle(item.title)),
  }));
  const emails = extractEmails(html);

  return NextResponse.json({
    sourceUrl: rawUrl,
    totalFound: results.length,
    results,
    emails,
  });
}
