import { describe, expect, it } from "vitest";
import sitemap, { getManifestSitemapEntries, getRegistrySitemapEntries } from "./sitemap";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";
import { getPublishedAcquisitionPages } from "../lib/acquisition/content-registry";
import { getPublishedProviderProfiles } from "../lib/acquisition/provider-profiles";
import { getPublishedTools } from "../lib/acquisition/tool-registry";

describe("sitemap publication control", () => {
  it("includes every and only the manifest-approved library asset", () => {
    const libraryUrls = getManifestSitemapEntries().map((entry) => entry.url).sort();
    const expected = getPublishedLibraryItems()
      .map((item) => `https://muditek.com${libraryCanonicalPath(item)}`)
      .sort();

    expect(libraryUrls).toEqual(expected);
  });

  it("excludes account, archived, obsolete, and provider-backed routes", () => {
    const urls = sitemap().map((entry) => entry.url).join("\n");

    expect(urls).not.toMatch(/\/portal|\/case-studies|\/revenue-leak-audit|\/mudikit(?:\n|$)|\/who-we-help/);
    expect(urls).not.toMatch(/apollo|serp-|tavily|weather|workflow-archive/);
    expect(urls).not.toMatch(/\/newsletter\/.+/);
  });

  it("includes the three approved appointment-setting market pages", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://muditek.com/appointment-setting/ma");
    expect(urls).toContain("https://muditek.com/appointment-setting/healthcare-staffing");
    expect(urls).toContain("https://muditek.com/appointment-setting/freight");
  });

  it("includes every published registry page", () => {
    const urls = sitemap().map((entry) => entry.url);
    const expected = [
      ...getPublishedAcquisitionPages().map((page) => page.canonicalPath),
      ...getPublishedProviderProfiles().map((page) => page.canonicalPath),
      ...getPublishedTools().map((tool) => tool.canonicalPath),
    ];
    for (const path of expected) expect(urls).toContain(`https://muditek.com${path}`);

    expect(urls).toContain("https://muditek.com/outbound/define-outbound-icp");
    expect(urls).toContain("https://muditek.com/tools/dmarc-checker");
    expect(urls).toContain("https://muditek.com/appointment-setting/providers/belkins");
    expect(urls).toContain("https://muditek.com/outbound");
    expect(urls).toContain("https://muditek.com/templates");
    expect(urls).toContain("https://muditek.com/appointment-setting/providers");
  });

  it("has no duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(getRegistrySitemapEntries().every((entry) => !getManifestSitemapEntries().some((item) => item.url === entry.url))).toBe(true);
  });
});
