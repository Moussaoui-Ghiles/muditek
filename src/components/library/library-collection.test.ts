import { describe, expect, it } from "vitest";
import { getPublishedLibraryItems } from "../../lib/library-manifest";
import {
  buildLibraryHref,
  filterLibraryItems,
  resolveLibraryFilters,
} from "./library-collection";

describe("library acquisition filters", () => {
  const items = getPublishedLibraryItems();

  it("limits the AI implementation lane to AI assets", () => {
    const filters = resolveLibraryFilters({ lane: "ai-implementation" });
    const results = filterLibraryItems(items, filters);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.lane === "ai-implementation")).toBe(true);
    expect(results.some((item) => item.slug === "loop-design-playbook")).toBe(true);
    expect(results.some((item) => item.slug === "outbound-failure-diagnostic")).toBe(false);
  });

  it("combines task, access, and search filters", () => {
    const filters = resolveLibraryFilters({
      lane: "ai-implementation",
      task: "operate-content-system",
      access: "account",
      q: "review",
    });
    const results = filterLibraryItems(items, filters);

    expect(results.map((item) => item.slug)).toEqual([
      "audience-content-os",
      "content-clarity-review",
    ]);
    expect(results.every((item) => item.lane === "ai-implementation" && item.access === "account")).toBe(true);
  });

  it("keeps invalid query values from changing the catalog", () => {
    const filters = resolveLibraryFilters({
      lane: "wrong-lane",
      task: "wrong-task",
      access: "paid",
    });

    expect(filters).toEqual({ lane: "all", task: "all", access: "all", query: "" });
    expect(filterLibraryItems(items, filters)).toEqual(items);
  });

  it("builds a stable task path for AI implementation", () => {
    expect(buildLibraryHref({
      lane: "ai-implementation",
      task: "design-ai-workflow",
    })).toBe("/library?lane=ai-implementation&task=design-ai-workflow");
  });
});
