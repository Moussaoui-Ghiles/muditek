import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

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

function normalizeResult(item: UnknownRecord) {
  return {
    title: text(item.title || item.name),
    url: text(item.url),
    snippet: text(item.content || item.snippet || item.description),
    score: numberValue(item.score),
    publishedDate: text(item.published_date || item.publishedDate || item.published_at || item.date),
  };
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const apiKey = process.env.TAVILY_API_KEY || process.env.TAVILY_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "This workbench needs a Tavily key before it can run research.", setupRequired: true },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const query = text(body?.query);
  const maxResults = Math.min(Math.max(Number(body?.maxResults || body?.max) || 5, 1), 10);

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: maxResults,
      include_answer: true,
      include_raw_content: false,
      include_images: false,
      include_image_descriptions: false,
      include_favicon: false,
      chunks_per_source: 3,
      auto_parameters: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Tavily request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const data = await response.json();
  const answer = text(data.answer);
  const results = toArray(data.results).map(normalizeResult).filter((item) => item.title || item.url);

  return NextResponse.json({
    query,
    maxResults,
    answer,
    provider: "tavily",
    results,
  });
}

