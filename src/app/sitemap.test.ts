import { describe, expect, it } from "vitest";
import sitemap, { getManifestSitemapEntries } from "./sitemap";
import { getPublishedLibraryItems } from "../lib/library-manifest";
import { libraryCanonicalPath } from "../lib/publication-index";

describe("sitemap publication control", () => {
  it("contains exactly 11 public pages and 33 published assets", () => {
    expect(getManifestSitemapEntries()).toHaveLength(33);
    expect(sitemap()).toHaveLength(44);
  });

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

  it("preserves unchanged dates while dating materially changed public pages", () => {
    const entries = new Map(sitemap().map((entry) => [entry.url, entry.lastModified]));

    expect(entries.get("https://muditek.com")).toEqual(new Date("2026-08-28T00:00:00.000Z"));
    expect(entries.get("https://muditek.com/about")).toEqual(new Date("2026-08-23T00:00:00.000Z"));
  });
});
