import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

afterEach(() => vi.unstubAllGlobals());

describe("CMS facility endpoint", () => {
  it("validates bounded public filters", async () => {
    expect((await GET(new NextRequest("http://localhost/api/tools/cms-facilities?state=California"))).status).toBe(400);
    expect((await GET(new NextRequest("http://localhost/api/tools/cms-facilities?state=CA&minBeds=10001"))).status).toBe(400);
  });

  it("maps official fields, preserves missing values, and limits returned rows", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ results: [
      { cms_certification_number_ccn: "001", provider_name: "ALPHA HOME", citytown: "Oakland", state: "CA", number_of_certified_beds: "75", ownership_type: "Non profit", overall_rating: "", staffing_rating: "4", total_nursing_staff_turnover: "30" },
      { cms_certification_number_ccn: "003", provider_name: "ALPHA UNKNOWN BEDS", citytown: "Sacramento", state: "CA", number_of_certified_beds: "" },
      { cms_certification_number_ccn: "002", provider_name: "BETA HOME", citytown: "Fresno", state: "CA", number_of_certified_beds: "20" },
    ] }), { status: 200 })));
    const response = await GET(new NextRequest("http://localhost/api/tools/cms-facilities?state=CA&name=alpha&minBeds=50"));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.facilities).toHaveLength(1);
    expect(payload.facilities[0]).toMatchObject({ ccn: "001", overallRating: null, staffingRating: 4, nurseTurnover: 30 });
  });

  it("reports upstream failure without fabricating data", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 503 })));
    const response = await GET(new NextRequest("http://localhost/api/tools/cms-facilities?state=CA"));
    const payload = await response.json();
    expect(response.status).toBe(502);
    expect(payload.error).toContain("CMS returned HTTP 503");
    expect(payload).not.toHaveProperty("facilities");
  });
});
