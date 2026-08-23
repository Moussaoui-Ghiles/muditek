import { describe, expect, it } from "vitest";
import sitemap, { getManifestSitemapEntries } from "./sitemap";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";

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
});
