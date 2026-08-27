import { describe, expect, it } from "vitest";
import { cleanLibraryMarkdown, renderLibraryMarkdown } from "./library-markdown";

describe("library markdown", () => {
  it("removes frontmatter and the repeated document title", () => {
    expect(cleanLibraryMarkdown("---\ntitle: Test\n---\n\n# Test\n\nBody")).toBe("Body");
  });

  it("adds stable unique ids and returns a table of contents", () => {
    const result = renderLibraryMarkdown("# Test\n\n## First step\n\nA\n\n## First step\n\nB");

    expect(result.headings).toEqual([
      { id: "first-step", label: "First step" },
      { id: "first-step-2", label: "First step" },
    ]);
    expect(result.html).toContain('<h2 id="first-step">First step</h2>');
    expect(result.html).not.toContain("<h1>");
  });
});
