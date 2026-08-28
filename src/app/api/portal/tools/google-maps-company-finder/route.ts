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

function normalize(item: UnknownRecord) {
  const website = text(item.website) || text(item.link);
  return {
    title: text(item.title) || text(item.name) || text(item.company_name),
    website,
    snippet: text(item.snippet) || text(item.description) || "",
    address: text(item.address) || text(item.addresses) || text(item.formatted_address) || "",
    phone: text(item.phone) || text(item.telephone) || "",
    rating: numberValue(item.rating) ?? numberValue(item.average_rating),
    reviews: numberValue(item.reviews) ?? numberValue(item.reviewsCount) ?? numberValue(item.number_of_reviews),
    type: text(item.type) || text(item.type_of_business),
  };
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const apiKey = process.env.SERPAPI_API_KEY || process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "This workbench needs SerpAPI connected before it can run live map search.",
        setupRequired: true,
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const location = typeof body?.location === "string" ? body.location.trim() : "";
  const max = Math.min(Math.max(Number(body?.max) || 10, 1), 20);

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const url = "https://google.serper.dev/search";
  const payload: UnknownRecord = {
    q: query,
    num: max,
  };
  if (location) payload.location = location;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `SerpAPI request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const data = await response.json();
  const localResults = toArray(data.local_results);
  const organicResults = toArray(data.organic);
  const items = localResults.length > 0 ? localResults : organicResults;
  const results = items
    .slice(0, max)
    .map(normalize)
    .filter((lead) => lead.title || lead.website);

  return NextResponse.json({
    query,
    location,
    provider: "google-serper-dev",
    source: localResults.length > 0 ? "local_results" : "organic",
    results,
  });
}
