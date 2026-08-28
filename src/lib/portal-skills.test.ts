import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { getLibraryItem } from "./library-manifest";
import {
  getPortalSkillArchiveFiles,
  getPortalSkillBundle,
  getSkillBundleValidationErrors,
  isSkillBundleAccountGateEligible,
  listShippedPortalSkills,
  validatePublishedSkillBundle,
} from "./portal-skills";

const EXPECTED_SKILL_SLUGS = [
  "cold-offer-review",
  "buyer-signal-list-research",
  "outbound-funnel-economics",
  "list-builder",
  "list-expander",
  "google-maps-list-builder",
  "google-maps-owner-email-finder",
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
  "google-maps-owner-email-finder",
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

  it("rejects a gated one-file bundle and missing declared files", () => {
    const item = getLibraryItem("skill", "list-builder");
    const bundle = getPortalSkillBundle("list-builder");
    expect(item).not.toBeNull();
    expect(bundle).not.toBeNull();
    if (!item || !bundle) return;

    const skillFile = bundle.files.find((file) => file.path === "SKILL.md");
    expect(skillFile).toBeDefined();
    if (!skillFile) return;

    const errors = getSkillBundleValidationErrors(
      { ...item, bundleFiles: ["SKILL.md", "examples/missing.md"], examplePath: "examples/missing.md" },
      { ...bundle, fileCount: 1, files: [skillFile] },
    );
    expect(errors).toContain("A declared bundle file is missing: examples/missing.md.");
    expect(errors).toContain("The declared example is missing: examples/missing.md.");
    expect(errors).toContain("An account-gated bundle must provide more than the public SKILL.md.");
  });

  for (const slug of EXPECTED_SKILL_SLUGS) {
    it(`packages a safe, self-contained ${slug} bundle`, () => {
      const bundle = getPortalSkillBundle(slug);
      expect(bundle).not.toBeNull();
      expect(bundle?.files[0]?.path).toBe("SKILL.md");
      const item = getLibraryItem("skill", slug);
      expect(item).not.toBeNull();
      expect(bundle?.files.some((file) => file.path === item?.examplePath)).toBe(true);
      expect(bundle?.files.map((file) => file.path).sort()).toEqual([...(item?.bundleFiles ?? [])].sort());
      expect(validatePublishedSkillBundle(slug)).toEqual({ valid: true, errors: [] });
      expect(isSkillBundleAccountGateEligible(slug)).toBe(!CORE_SKILLS.has(slug));

      const validationOutput = execFileSync(
        process.execPath,
        ["scripts/validate-library-skill.mjs", item?.source ?? "", item?.examplePath ?? ""],
        { cwd: process.cwd(), encoding: "utf8" },
      );
      expect(validationOutput).toContain(`Validated ${item?.source}`);

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
