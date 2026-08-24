import { describe, expect, it } from "vitest";
import { ACQUISITION_PAGES } from "./content-registry";
import { PROVIDER_PROFILES } from "./provider-profiles";
import { TOOL_REGISTRY } from "./tool-registry";
import { getPublishedLibraryItems } from "../library-manifest";
import { libraryCanonicalPath } from "../publication-index";

const STATIC_PATHS = new Set([
  "/",
  "/appointment-setting",
  "/appointment-setting-pricing",
  "/appointment-setting/ma",
  "/appointment-setting/healthcare-staffing",
  "/appointment-setting/freight",
  "/ai-implementation",
  "/library",
  "/outbound",
  "/templates",
  "/tools",
  "/tools/appointment-setting-quote-calculator",
]);

describe("organic acquisition system", () => {
  it("owns one title, description, canonical, and query per acquisition surface", () => {
    const rows = [
      ...ACQUISITION_PAGES.map((page) => ({ ...page, path: page.canonicalPath })),
      ...PROVIDER_PROFILES.map((page) => ({ ...page, path: page.canonicalPath })),
      ...TOOL_REGISTRY.map((page) => ({ ...page, path: page.canonicalPath })),
    ];

    for (const key of ["title", "description", "path", "primaryQuery"] as const) {
      const values = rows.map((row) => row[key].trim().toLowerCase());
      expect(new Set(values).size, `duplicate ${key}`).toBe(values.length);
    }
  });

  it("resolves every related acquisition path", () => {
    const known = new Set([
      ...STATIC_PATHS,
      ...ACQUISITION_PAGES.map((page) => page.canonicalPath),
      ...PROVIDER_PROFILES.map((page) => page.canonicalPath),
      ...TOOL_REGISTRY.map((page) => page.canonicalPath),
      ...getPublishedLibraryItems().map(libraryCanonicalPath),
    ]);

    const broken = ACQUISITION_PAGES.flatMap((page) =>
      page.relatedPaths.filter((path) => !known.has(path)).map((path) => `${page.canonicalPath} -> ${path}`),
    );
    expect(broken).toEqual([]);
  });

  it("marks every reviewed acquisition surface as published", () => {
    expect(ACQUISITION_PAGES.every((page) => page.status === "published")).toBe(true);
    expect(PROVIDER_PROFILES.every((page) => page.status === "published")).toBe(true);
    expect(TOOL_REGISTRY.every((tool) => tool.status === "published")).toBe(true);
  });
});
