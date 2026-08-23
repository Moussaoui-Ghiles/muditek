import { describe, expect, it } from "vitest";
import {
  getPortalSkillArchiveFiles,
  getPortalSkillBundle,
  listShippedPortalSkills,
} from "./portal-skills";

const EXPECTED_SKILL_SLUGS = [
  "cold-offer-review",
  "buyer-signal-list-research",
  "outbound-funnel-economics",
  "list-builder",
  "list-expander",
  "google-maps-list-builder",
  "list-quality-scorecard",
  "icp-prompt-builder",
  "audience-content-os",
  "linkedin-content-writer",
  "x-content-writer",
  "content-clarity-review",
  "lead-magnets",
] as const;

const CORE_SKILLS = new Set([
  "cold-offer-review",
  "buyer-signal-list-research",
  "outbound-funnel-economics",
]);

const UNSAFE_PATH = /(^|\/)(?:\.env|\.DS_Store|__pycache__|node_modules)(?:\/|$)|\.pyc$/i;
const PRIVATE_TEXT = /\/Users\/|\.codex\/|\.agents\/|\bBizOps\b|\bGhiles\b|\[\[(?:library|marketing)\/|`marketing\/|Vault source:|\$(?:offer-creation|cold-email)|apify-(?:lead-generation|ultimate-scraper)|phantombuster/i;

describe("published skill bundles", () => {
  it("lists only the manifest-approved skill set", () => {
    const skills = listShippedPortalSkills();
    expect(skills.map((skill) => skill.slug).sort()).toEqual([...EXPECTED_SKILL_SLUGS].sort());

    for (const skill of skills) {
      expect(skill).toMatchObject({
        category: "skill",
        file_type: "md",
        is_free: CORE_SKILLS.has(skill.slug),
        download_url: `/api/portal/skills/${skill.slug}/download`,
      });
    }
  });

  for (const slug of EXPECTED_SKILL_SLUGS) {
    it(`packages a safe, self-contained ${slug} bundle`, () => {
      const bundle = getPortalSkillBundle(slug);
      expect(bundle).not.toBeNull();
      expect(bundle?.files[0]?.path).toBe("SKILL.md");
      expect(bundle?.files.some((file) => /example|test/i.test(file.path))).toBe(true);

      const archive = getPortalSkillArchiveFiles(slug);
      expect(archive.length).toBe(bundle?.fileCount);
      expect(archive.every((file) => file.data.byteLength > 0)).toBe(true);
      expect(archive.some((file) => UNSAFE_PATH.test(file.path))).toBe(false);

      const text = archive
        .filter((file) => !/\.(?:png|jpe?g|gif|webp|pdf|pyc)$/i.test(file.path))
        .map((file) => file.data.toString("utf8"))
        .join("\n");
      expect(text).not.toMatch(PRIVATE_TEXT);
    });
  }
});
