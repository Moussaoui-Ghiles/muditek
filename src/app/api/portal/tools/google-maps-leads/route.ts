import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ApifyPlace = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normalizePlace(item: ApifyPlace) {
  const emails = Array.isArray(item.emails)
    ? item.emails.filter((email): email is string => typeof email === "string")
    : [];

  return {
    name: text(item.title) || text(item.name) || text(item.placeName),
    website: text(item.website) || text(item.url),
    phone: text(item.phone) || text(item.phoneUnformatted),
    address: text(item.address) || text(item.street) || text(item.neighborhood),
    category: text(item.categoryName) || text(item.category),
    rating: numberValue(item.totalScore) ?? numberValue(item.rating),
    reviews: numberValue(item.reviewsCount) ?? numberValue(item.reviews),
    emails,
  };
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: "This workbench needs Apify connected before it can run live searches.",
        setupRequired: true,
      },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const keyword = typeof body?.keyword === "string" ? body.keyword.trim() : "";
  const location = typeof body?.location === "string" ? body.location.trim() : "";
  const max = Math.min(Math.max(Number(body?.max) || 10, 1), 25);

  if (!keyword || !location) {
    return NextResponse.json({ error: "Keyword and location are required." }, { status: 400 });
  }

  const actor = process.env.APIFY_GOOGLE_MAPS_ACTOR_ID || "compass/crawler-google-places";
  const actorPath = actor.replace("/", "~");
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorPath)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=180`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      searchStringsArray: [keyword],
      locationQuery: location,
      maxCrawledPlacesPerSearch: max,
      language: "en",
      scrapePlaceDetailPage: true,
      scrapeTableReservationProvider: false,
      skipClosedPlaces: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Apify request failed: ${response.status}`, detail: error.slice(0, 500) },
      { status: 502 }
    );
  }

  const items = await response.json();
  const results = Array.isArray(items) ? items.map(normalizePlace).filter((item) => item.name) : [];
  return NextResponse.json({ results });
}
