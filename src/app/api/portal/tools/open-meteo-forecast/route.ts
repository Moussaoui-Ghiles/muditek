import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type UnknownRecord = Record<string, unknown>;

type GeoLocation = {
  name: string;
  country: string;
  admin1: string;
  latitude: number;
  longitude: number;
};

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

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toAnyArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeLocation(result: UnknownRecord | null | undefined): GeoLocation | null {
  if (!result) return null;
  const name = text(result.name);
  if (!name) return null;

  const latitude = numberValue(result.latitude || result.lat);
  const longitude = numberValue(result.longitude || result.lon);
  if (latitude === null || longitude === null) return null;

  return {
    name,
    country: text(result.country_code || result.country || result.countryCode || result.country_name),
    admin1: text(result.admin1 || result.region),
    latitude,
    longitude,
  };
}

function safeLimit(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(parsed, 16));
}

function windUnitFromTemperature(units: string): string {
  return units === "fahrenheit" ? "mph" : "kmh";
}

export async function POST(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const location = text(body?.location || body?.query || body?.q);
  const units = text(body?.units || body?.unit || "celsius");
  const days = safeLimit(body?.days || body?.forecastDays || body?.forecast_days, 7);

  if (!location) {
    return NextResponse.json({ error: "Location is required." }, { status: 400 });
  }

  if (units !== "celsius" && units !== "fahrenheit") {
    return NextResponse.json({ error: "Units must be celsius or fahrenheit." }, { status: 400 });
  }

  const geocodeUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodeUrl.searchParams.set("name", location);
  geocodeUrl.searchParams.set("count", "1");
  geocodeUrl.searchParams.set("language", "en");
  geocodeUrl.searchParams.set("format", "json");

  const geocodeResponse = await fetch(geocodeUrl, { method: "GET", headers: { accept: "application/json" } });
  if (!geocodeResponse.ok) {
    const error = await geocodeResponse.text();
    return NextResponse.json(
      { error: `Open-Meteo geocoding request failed: ${geocodeResponse.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const geocode = await geocodeResponse.json();
  const locationRecord = normalizeLocation(toArray(geocode.results)[0]);
  if (!locationRecord) {
    return NextResponse.json({ error: `No matching location found for "${location}".` }, { status: 404 });
  }

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("latitude", String(locationRecord.latitude));
  forecastUrl.searchParams.set("longitude", String(locationRecord.longitude));
  forecastUrl.searchParams.set("current_weather", "true");
  forecastUrl.searchParams.set("daily", "temperature_2m_min,temperature_2m_max,precipitation_sum");
  forecastUrl.searchParams.set("forecast_days", String(days));
  forecastUrl.searchParams.set("timezone", "auto");
  forecastUrl.searchParams.set("temperature_unit", units === "fahrenheit" ? "fahrenheit" : "celsius");
  forecastUrl.searchParams.set("windspeed_unit", windUnitFromTemperature(units));

  const forecastResponse = await fetch(forecastUrl, { method: "GET", headers: { accept: "application/json" } });
  if (!forecastResponse.ok) {
    const error = await forecastResponse.text();
    return NextResponse.json(
      { error: `Open-Meteo forecast request failed: ${forecastResponse.status}`, detail: error.slice(0, 500) },
      { status: 502 },
    );
  }

  const forecastData = await forecastResponse.json();
  const current = forecastData.current_weather;
  const daily = forecastData.daily || {};

  const forecast = toStringArray(daily.time).map((item, index) => {
    const min = numberValue(toAnyArray(daily.temperature_2m_min)[index]);
    const max = numberValue(toAnyArray(daily.temperature_2m_max)[index]);
    const precipitation = numberValue(toAnyArray(daily.precipitation_sum)[index]);
    return {
      date: item,
      minTemp: min ?? 0,
      maxTemp: max ?? 0,
      precipitation: precipitation ?? 0,
    };
  });

  const normalizedCurrent =
    current &&
    typeof current === "object" &&
    current !== null
      ? {
          time: text(current.time),
          temp: numberValue(current.temperature) ?? 0,
          windSpeed: numberValue(current.windspeed) ?? 0,
          windDirection: numberValue(current.winddirection) ?? 0,
          weatherCode: numberValue(current.weathercode) ?? 0,
        }
      : null;

  return NextResponse.json({
    location: {
      name: locationRecord.name,
      country: locationRecord.country,
      region: locationRecord.admin1,
      coordinates: {
        latitude: locationRecord.latitude,
        longitude: locationRecord.longitude,
      },
    },
    units: units === "fahrenheit" ? "°F, mph" : "°C, km/h",
    provider: "open-meteo",
    current: normalizedCurrent,
    forecast,
  });
}
