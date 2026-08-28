import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractText(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function extractEmails(value: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?!\.[a-zA-Z]{2,}\b)/g;
  return unique((value.match(emailRegex) || []).map((entry) => entry.toLowerCase()));
}

function extractPhones(value: string): string[] {
  const phoneRegex = /\+?\d[\d\s().-]{7,}\d/g;
  const matches = value.match(phoneRegex) || [];
  const normalized = matches
    .map((phone) => phone.replace(/\s+/g, " ").trim())
    .filter((phone) => phone.replace(/[^0-9]/g, "").length >= 8);
  return unique(normalized);
}

function extractTitle(sourceHtml: string): string {
  const match = sourceHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? text(match[1]).replace(/\s+/g, " ") : "";
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";

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

  const html = await response.text();
  const cleanText = extractText(html);
  const preview = cleanText.slice(0, 3200);
  const title = extractTitle(html);
  const emails = extractEmails(cleanText);
  const phones = extractPhones(cleanText);

  return NextResponse.json({
    sourceUrl: rawUrl,
    pageTitle: title || undefined,
    text: cleanText,
    preview,
    contacts: {
      emails,
      phones,
    },
  });
}
