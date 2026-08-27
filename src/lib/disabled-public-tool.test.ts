import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { disabledPublicToolResponse } from "./disabled-public-tool";

const REMOVED_HANDLER_SLUGS = [
  "apollo-lead-finder",
  "google-maps-company-finder",
  "google-maps-leads",
  "linkedin-serper-leads",
  "open-meteo-forecast",
  "serp-autocomplete-search",
  "serp-flight-search",
  "serp-hotel-search",
  "serp-news-search",
  "tavily-web-search",
  "website-text-contact-extractor",
  "website-url-scraper",
] as const;

describe("disabled provider-backed public tools", () => {
  it("returns 410 without calling a provider", async () => {
    const response = disabledPublicToolResponse();
    expect(response.status).toBe(410);
    await expect(response.json()).resolves.toEqual({
      error: "This provider-backed public tool has been removed.",
    });
  });

  it("makes every legacy handler return the shared 410 response directly", () => {
    for (const slug of REMOVED_HANDLER_SLUGS) {
      const source = readFileSync(join(process.cwd(), "src/app/api/portal/tools", slug, "route.ts"), "utf8");
      expect(source).toContain("disabledPublicToolResponse as POST");
      expect(source).not.toMatch(/APIFY|SERPAPI|TAVILY|APOLLO|fetch\s*\(/i);
    }
  });
});
