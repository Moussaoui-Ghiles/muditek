import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PUBLIC_LIBRARY_PATHS, PUBLIC_PLAYBOOKS } from "./public-library";

describe("public cold email and Google Maps library", () => {
  it("ships every declared playbook source", () => {
    for (const playbook of PUBLIC_PLAYBOOKS) {
      const source = join(process.cwd(), playbook.source);
      expect(existsSync(source), playbook.source).toBe(true);
      expect(readFileSync(source, "utf8").length).toBeGreaterThan(1_000);
    }
  });

  it("declares the four public resource URLs", () => {
    expect(PUBLIC_LIBRARY_PATHS).toEqual([
      "/library",
      "/playbooks/10000-cold-email-system",
      "/playbooks/google-maps-outbound",
      "/tools/cold-email-capacity-calculator",
      "/skills/google-maps-owner-email-finder",
    ]);
  });

  it("keeps the public routes outside the sign-in gate", () => {
    const proxy = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf8");
    for (const path of PUBLIC_LIBRARY_PATHS) {
      expect(proxy, path).toContain(`"${path}"`);
    }
    expect(proxy).toContain('"/api/portal/skills/google-maps-owner-email-finder/download"');
  });
});
