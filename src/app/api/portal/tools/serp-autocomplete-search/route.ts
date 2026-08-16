import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type UnknownRecord = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is UnknownRecord => typeof item === "object" && item !== null);
}

function toSuggestion(item: UnknownRecord) {
  return text(item.value) || text(item.text) || text(item.suggestion) || text(item.keyword);
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
        error: "This workbench needs SerpAPI connected before it can run autocomplete suggestions.",
        setupRequired: true,
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const query = text(body?.query || body?.q);
  const max = Math.min(Math.max(Number(body?.max) || 8, 1), 20);

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_autocomplete");
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, { method: "GET", headers: { accept: "application/json" } });
  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `SerpAPI request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const data = await response.json();
  const suggestionsRaw = toArray(data.suggestions);
  const suggestions = suggestionsRaw
    .map((item) => toSuggestion(item))
    .filter(Boolean)
    .slice(0, max);
  const suggestionsFromBody = Array.isArray(data.autocomplete) ? data.autocomplete : [];
  const extra = suggestionsFromBody.filter((item: unknown) => typeof item === "string") as string[];
  const unique = [...new Set([...suggestions, ...extra])].slice(0, max);

  return NextResponse.json({ query, max, provider: "serpapi-google-autocomplete", suggestions: unique });
}
