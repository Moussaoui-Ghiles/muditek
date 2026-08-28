import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("marketing sitemap", () => {
  it("does not publish routes that have no page", () => {
    const source = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
    expect(source).not.toContain('path: "/ai-act"');
  });

  it("publishes the cold email and Google Maps resources", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/public-library.ts"), "utf8");
    expect(source).toContain('"/playbooks/10000-cold-email-system"');
    expect(source).toContain('"/playbooks/google-maps-outbound"');
    expect(source).toContain('"/tools/cold-email-capacity-calculator"');
    expect(source).toContain('"/skills/google-maps-owner-email-finder"');
  });
});
