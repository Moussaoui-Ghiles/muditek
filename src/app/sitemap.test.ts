import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PUBLIC_LIBRARY_PATHS } from "../lib/public-library";

describe("marketing sitemap", () => {
  it("does not publish routes that have no page", () => {
    const source = readFileSync(join(process.cwd(), "src/app/sitemap.ts"), "utf8");
    expect(source).not.toContain('path: "/ai-act"');
  });

  it("publishes the cold email and Google Maps resources", () => {
    expect(PUBLIC_LIBRARY_PATHS).toEqual(expect.arrayContaining([
      "/playbooks",
      "/skills",
      "/tools",
      "/playbooks/10000-cold-email-system",
      "/playbooks/google-maps-outbound",
      "/playbooks/loop-design-playbook",
      "/tools/cold-email-capacity-calculator",
      "/skills/google-maps-owner-email-finder",
      "/skills/list-builder",
    ]));
  });
});
