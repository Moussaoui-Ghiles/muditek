import { describe, expect, it } from "vitest";
import { cleanLibraryMarkdown, renderLibraryMarkdown } from "./library-markdown";

describe("public library Markdown", () => {
  it("removes frontmatter and the duplicate top-level heading", () => {
    expect(cleanLibraryMarkdown("---\ntitle: Test\n---\n# Test\n\nBody")).toBe("Body");
  });

  it("adds stable anchors to section headings", () => {
    const rendered = renderLibraryMarkdown("# Test\n\n## Recovery plan\n\nA\n\n## Recovery plan\n\nB");
    expect(rendered.headings).toEqual([
      { id: "recovery-plan", label: "Recovery plan" },
      { id: "recovery-plan-2", label: "Recovery plan" },
    ]);
    expect(rendered.html).toContain('id="recovery-plan"');
    expect(rendered.html).toContain('id="recovery-plan-2"');
  });
});
