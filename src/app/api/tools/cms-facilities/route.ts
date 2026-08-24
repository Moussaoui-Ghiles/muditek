import { NextRequest, NextResponse } from "next/server";
import { mapCmsFacility } from "../../../../lib/tools/cms";

export const runtime = "nodejs";

const CMS_ENDPOINT = "https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0";

export async function GET(request: NextRequest) {
  const state = (request.nextUrl.searchParams.get("state") ?? "").trim().toUpperCase();
  const name = (request.nextUrl.searchParams.get("name") ?? "").trim().slice(0, 80);
  const ownership = (request.nextUrl.searchParams.get("ownership") ?? "").trim().slice(0, 80);
  const minBedsRaw = request.nextUrl.searchParams.get("minBeds") ?? "0";
  const minBeds = Number(minBedsRaw);
  if (!/^[A-Z]{2}$/.test(state)) return NextResponse.json({ error: "Choose a two-letter US state code." }, { status: 400 });
  if (!Number.isFinite(minBeds) || minBeds < 0 || minBeds > 10000) return NextResponse.json({ error: "Minimum beds must be between 0 and 10,000." }, { status: 400 });

  const url = new URL(CMS_ENDPOINT);
  url.searchParams.set("limit", "2000");
  url.searchParams.set("offset", "0");
  url.searchParams.set("conditions[0][property]", "state");
  url.searchParams.set("conditions[0][value]", state);
  url.searchParams.set("conditions[0][operator]", "=");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, { signal: controller.signal, next: { revalidate: 86400 } });
    if (!response.ok) return NextResponse.json({ error: `CMS returned HTTP ${response.status}. Try again later.`, source: "CMS Provider Information" }, { status: 502 });
    const payload = await response.json() as { results?: Array<Record<string, unknown>>; count?: number };
    const facilities = (payload.results ?? [])
      .map(mapCmsFacility)
      .filter((facility): facility is NonNullable<typeof facility> => Boolean(facility))
      .filter((facility) => !name || facility.name.toLowerCase().includes(name.toLowerCase()))
      .filter((facility) => !ownership || facility.ownership.toLowerCase().includes(ownership.toLowerCase()))
      .filter((facility) => minBeds === 0 || (facility.beds != null && facility.beds >= minBeds))
      .slice(0, 20);
    const truncated = typeof payload.count === "number" && payload.count > 2000;
    return NextResponse.json({
      facilities,
      source: "https://data.cms.gov/provider-data/dataset/4pq5-n9py",
      note: truncated
        ? "CMS returned more than the 2,000-record safety limit. Narrow the facility name or ownership filter."
        : facilities.length === 0
          ? "No matching CMS record was found for these filters."
          : undefined,
    }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.name === "AbortError" ? "CMS did not respond within seven seconds. Try again later." : "CMS data is unavailable. Try again later.", source: "CMS Provider Information" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
