import { describe, expect, it } from "vitest";
import { getPublishedLibraryItems } from "./library-manifest";
import { buildIndexMarkdown, buildLlmsFullTxt, buildLlmsTxt, libraryCanonicalPath } from "./publication-index";

describe("machine-readable publication indexes", () => {
  it("includes every published canonical asset in the full indexes", () => {
    const full = buildLlmsFullTxt();
    const markdown = buildIndexMarkdown();

    for (const item of getPublishedLibraryItems()) {
      const url = `https://muditek.com${libraryCanonicalPath(item)}`;
      expect(full).toContain(url);
      expect(markdown).toContain(url);
    }
  });

  it("uses the current positioning without old proof or offer claims", () => {
    for (const output of [buildLlmsTxt(), buildLlmsFullTxt(), buildIndexMarkdown()]) {
      expect(output).toContain("Appointment setting is the current way to start");
      expect(output).not.toMatch(/35\+ systems|\$3M|5,000\+|three service offers|€50K guarantee/i);
      expect(output).not.toContain("/revenue-leak-audit");
      expect(output).not.toMatch(/muditek\.com\/mudiagent(?:\)|\s|$)/);
      expect(output).not.toMatch(/muditek\.com\/pe-ops(?:\)|\s|$)/);
    }
  });
});
