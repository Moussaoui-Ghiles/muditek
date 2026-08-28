import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type UnknownRecord = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
}

function normalizeNews(item: UnknownRecord) {
  return {
    title: text(item.title),
    link: text(item.link),
    snippet: text(item.snippet) || text(item.summary) || text(item.text) || text(item.highlight) || "",
    source: text(item.source) || text(item.sourceName) || text(item.publisher) || "",
    date: text(item.date) || text(item.dateTime) || text(item.publishedDate) || text(item.publicationDate) || "",
    rank: numberValue(item.position) ?? null,
  };
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const apiKey = process.env.SERPAPI_API_KEY || process.env.SERP_API_KEY || process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "This workbench needs SerpAPI connected before it can run news search.",
        setupRequired: true,
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const max = Math.min(Math.max(Number(body?.max) || 10, 1), 20);

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_news_light");
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(max));
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `SerpAPI request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const data = await response.json();
  const rawResults = toArray(data.news_results).length
    ? toArray(data.news_results)
    : toArray(data.news);
  const results = rawResults.map(normalizeNews).filter((entry) => entry.title || entry.link).slice(0, max);

  return NextResponse.json({
    query,
    max,
    provider: "serpapi-google-news-light",
    results,
  });
}
