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

function objectFrom(value: unknown): UnknownRecord | null {
  if (typeof value === "object" && value !== null) return value as UnknownRecord;
  return null;
}

function normalizeFlightLeg(item: UnknownRecord) {
  const departureAirport = text((objectFrom(item.departure_airport)?.name || item.departure_airport));
  const arrivalAirport = text((objectFrom(item.arrival_airport)?.name || item.arrival_airport));
  const flight = text((item.flight_number || item.flight || item.flight_name));
  const airline = text((objectFrom(item.operating_airline)?.name || item.operating_airline || item.airline));
  return {
    departureAirport: departureAirport || "Unknown",
    arrivalAirport: arrivalAirport || "Unknown",
    departureTime: text(item.departure_time || item.departure),
    arrivalTime: text(item.arrival_time || item.arrival),
    duration: text(item.flight_duration || item.duration),
    flight: flight || "Flight",
    airline,
  };
}

function normalizeFlight(item: UnknownRecord) {
  const flights = toArray(item.flights);
  const title =
    text(item.type) ||
    (flights.length > 0
      ? `${text((objectFrom(flights[0])?.departure_airport as string))} -> ${text((objectFrom(flights.at(-1))?.arrival_airport as string))}`
      : "Flight option");
  const legs = flights.map(normalizeFlightLeg);
  return {
    title,
    price: numberValue(item.price) || numberValue(item.price_in_usd) || numberValue(item.price_formatted),
    currency: text(item.currency || item.price_currency || "EUR"),
    duration: text(item.total_duration || item.duration),
    totalStops: text(item.stops) || `${Math.max(legs.length - 1, 0)} stop${legs.length > 2 ? "s" : ""}`,
    legs: legs.length
      ? legs
      : [
          {
            departureAirport: text(item.departure) || text(item.origin) || "Unknown",
            arrivalAirport: text(item.arrival) || text(item.destination) || "Unknown",
            departureTime: text(item.departure_time),
            arrivalTime: text(item.arrival_time),
            duration: text(item.duration),
            flight: text(item.flight) || "Flight",
            airline: text(item.airline),
          },
        ],
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
      { error: "This workbench needs SerpAPI connected before it can run live flights.", setupRequired: true },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const origin = text(body?.origin);
  const destination = text(body?.destination);
  const outboundDate = text(body?.outboundDate || body?.outbound_date);
  const returnDate = text(body?.returnDate || body?.return_date);
  const adults = Math.min(Math.max(Number(body?.adults) || 1, 1), 9);
  const currency = text(body?.currency || "EUR") || "EUR";

  if (!origin || !destination || !outboundDate) {
    return NextResponse.json({ error: "Origin, destination, and outbound date are required." }, { status: 400 });
  }

  const query = new URL("https://serpapi.com/search");
  query.searchParams.set("engine", "google_flights");
  query.searchParams.set("departure_id", origin);
  query.searchParams.set("arrival_id", destination);
  query.searchParams.set("outbound_date", outboundDate);
  query.searchParams.set("currency", currency);
  query.searchParams.set("adults", String(adults));
  if (returnDate) query.searchParams.set("return_date", returnDate);
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
  const rawResults = toArray(data.best_flights).length ? toArray(data.best_flights) : toArray(data.flights);
  const normalized = rawResults.map(normalizeFlight);

  return NextResponse.json({
    query: { origin, destination, outboundDate, returnDate, adults, currency },
    provider: "serpapi-google-flights",
    results: normalized,
    source: toArray(data.best_flights).length ? "best_flights" : "flights",
  });
}
