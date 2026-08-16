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

function normalizeHotel(item: UnknownRecord) {
  const extractedPrice = numberValue(item.price)
    || numberValue(item.minPrice)
    || numberValue((item.rate_per_night as UnknownRecord)?.min)
    || numberValue((item.price_breakdown as UnknownRecord)?.total);
  const extractedCurrency = text(item.currency || item.price_currency || item.currency_code);
  const extractedRating = numberValue(item.rating) || numberValue((item.overview as UnknownRecord)?.rating);
  const reviewsRaw = text(item.reviews) || text((item.reviews_score as UnknownRecord)?.reviews);
  return {
    name: text(item.name || item.hotel_name || text(item.title)),
    address: text(item.address || item.location),
    price: extractedPrice,
    currency: extractedCurrency || "EUR",
    rating: extractedRating,
    reviews: numberValue(reviewsRaw),
    link: text(item.link || item.hotel_link || item.booking_link || item.url),
    image: text(item.image || item.photo || item.image_url),
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
      { error: "This workbench needs SerpAPI connected before it can run live hotel lookup.", setupRequired: true },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const location = text(body?.location);
  const checkInDate = text(body?.checkInDate || body?.checkIn || body?.checkIn_date);
  const checkOutDate = text(body?.checkOutDate || body?.checkOut || body?.checkOut_date);
  const adults = Math.min(Math.max(Number(body?.adults) || 2, 1), 8);
  const currency = text(body?.currency || "EUR") || "EUR";

  if (!location || !checkInDate || !checkOutDate) {
    return NextResponse.json({ error: "Location, check-in date, and check-out date are required." }, { status: 400 });
  }

  const query = new URL("https://serpapi.com/search");
  query.searchParams.set("engine", "google_hotels");
  query.searchParams.set("q", location);
  query.searchParams.set("check_in_date", checkInDate);
  query.searchParams.set("check_out_date", checkOutDate);
  query.searchParams.set("adults", String(adults));
  query.searchParams.set("currency", currency);
  query.searchParams.set("api_key", apiKey);

  const response = await fetch(query, {
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
  const rawResults = toArray(data.properties).length ? toArray(data.properties) : toArray(data.results);
  const results = rawResults.map(normalizeHotel).filter((item) => item.name || item.address || item.link);

  return NextResponse.json({
    search: { location, checkInDate, checkOutDate, adults, currency },
    provider: "serpapi-google-hotels",
    results,
  });
}

