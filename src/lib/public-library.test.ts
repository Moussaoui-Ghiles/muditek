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
    expect(PUBLIC_LIBRARY_PATHS).toEqual(expect.arrayContaining([
      "/library",
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
    expect(new Set(PUBLIC_LIBRARY_PATHS).size).toBe(PUBLIC_LIBRARY_PATHS.length);
  });

  it("publishes the promised workflows and the restored public skills", () => {
    expect(PUBLIC_SKILLS.map((skill) => skill.slug)).toEqual(expect.arrayContaining([
      "cold-offer-review",
      "buyer-signal-list-research",
      "outbound-funnel-economics",
      "list-builder",
      "list-expander",
      "google-maps-owner-email-finder",
      "audience-content-os",
      "linkedin-content-writer",
      "x-content-writer",
      "newsletter",
      "tiktok-slideshow-machine",
      "lead-magnets",
    ]));

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
    expect(proxy).toContain('"/playbooks"');
    expect(proxy).toContain('"/playbooks/(.*)"');
    expect(proxy).toContain('"/skills"');
    expect(proxy).toContain('"/skills/(.*)"');
    expect(proxy).toContain('"/tools"');
    expect(proxy).toContain('"/tools/(.*)"');
    expect(proxy).toContain('"/api/library/playbooks/(.*)"');
    expect(proxy).toContain('"/api/portal/skills/(.*)/download"');
  });
});
