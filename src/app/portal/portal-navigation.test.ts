import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("member workspace navigation", () => {
  it("contains only the approved member sections", () => {
    const source = readFileSync(join(process.cwd(), "src/app/portal/page.tsx"), "utf8");

    expect(source).toContain('["Advanced Skills", "/portal/skills"]');
    expect(source).toContain('["Recent Activity", "/portal/activity"]');
    expect(source).toContain('["Downloads and Versions", "/portal/downloads"]');
    expect(source).toContain('["Newsletter Preferences", "/portal/newsletter"]');
    expect(source).toContain('["Account", "/portal/account"]');
    expect(source).not.toContain('["Tools", "/portal/tools"]');
    expect(source).not.toContain("workflow-archive");
  });
});
