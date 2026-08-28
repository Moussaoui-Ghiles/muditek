import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PUBLIC_LIBRARY_PATHS,
  PUBLIC_PLAYBOOKS,
  PUBLIC_SKILLS,
} from "./public-library";
import { listShippedPortalSkills } from "./portal-skills";

describe("public cold email and Google Maps library", () => {
  it("ships every declared playbook source", () => {
    for (const playbook of PUBLIC_PLAYBOOKS) {
      const source = join(process.cwd(), playbook.source);
      expect(existsSync(source), playbook.source).toBe(true);
      expect(readFileSync(source, "utf8").length).toBeGreaterThan(1_000);
    }
  });

  it("declares the public resource URLs", () => {
    expect(PUBLIC_LIBRARY_PATHS).toEqual([
      "/library",
      "/playbooks/10000-cold-email-system",
      "/playbooks/google-maps-outbound",
      "/tools/cold-email-capacity-calculator",
      "/skills/google-maps-owner-email-finder",
      "/skills/audience-content-os",
      "/skills/linkedin-content-writer",
      "/skills/x-content-writer",
      "/skills/newsletter",
      "/skills/tiktok-slideshow-machine",
      "/skills/lead-magnets",
    ]);
  });

  it("publishes all six promised content skills", () => {
    expect(PUBLIC_SKILLS.map((skill) => skill.slug)).toEqual([
      "audience-content-os",
      "linkedin-content-writer",
      "x-content-writer",
      "newsletter",
      "tiktok-slideshow-machine",
      "lead-magnets",
    ]);

    for (const skill of PUBLIC_SKILLS) {
      expect(skill.title.length).toBeGreaterThan(3);
      expect(skill.summary.length).toBeGreaterThan(40);
      expect(skill.topic.length).toBeGreaterThan(3);
    }
  });

  it("lists every public content skill in the portal catalog", () => {
    const portalSlugs = new Set(listShippedPortalSkills().map((skill) => skill.slug));
    for (const skill of PUBLIC_SKILLS) {
      expect(portalSlugs.has(skill.slug), skill.slug).toBe(true);
    }
  });

  it("keeps the public routes outside the sign-in gate", () => {
    const proxy = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf8");
    expect(proxy).toContain('"/library"');
    expect(proxy).toContain('"/playbooks/10000-cold-email-system"');
    expect(proxy).toContain('"/playbooks/google-maps-outbound"');
    expect(proxy).toContain('"/skills/(.*)"');
    expect(proxy).toContain('"/api/portal/skills/google-maps-owner-email-finder/download"');
    for (const skill of PUBLIC_SKILLS) {
      expect(proxy).toContain(`"/api/portal/skills/${skill.slug}/download"`);
    }
    expect(proxy).not.toContain('"/api/portal/skills/(.*)/download"');
  });
});
