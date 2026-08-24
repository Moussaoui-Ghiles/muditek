import { describe, expect, it } from "vitest";
import { TOOL_REGISTRY, getPublishedTools, validateToolRegistry } from "./tool-registry";

describe("tool registry", () => {
  it("has unique slugs, queries, matching canonicals, and method sources", () => {
    expect(validateToolRegistry()).toEqual([]);
  });

  it("publishes every reviewed tool", () => {
    expect(getPublishedTools()).toHaveLength(TOOL_REGISTRY.length);
    expect(TOOL_REGISTRY.every((tool) => tool.status === "published")).toBe(true);
  });
});
