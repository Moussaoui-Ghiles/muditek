import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("marketing sitemap", () => {
  it("does not publish routes that have no page", () => {
    const source = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
    expect(source).not.toContain('path: "/ai-act"');
  });
});
