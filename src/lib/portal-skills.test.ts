import { describe, expect, it } from "vitest";
import {
  getPortalSkillArchiveFiles,
  getPortalSkillBundle,
  listShippedPortalSkills,
} from "./portal-skills";

const EXPECTED_SKILLS = [
  {
    slug: "cold-offer-review",
    title: "Cold Offer Review",
    files: [
      "SKILL.md",
      "agents/openai.yaml",
      "references/audit-criteria.md",
      "references/intake.md",
      "references/output-schema.md",
    ],
  },
  {
    slug: "buyer-signal-list-research",
    title: "Buyer Signal List Research",
    files: [
      "SKILL.md",
      "agents/openai.yaml",
      "references/evidence-model.md",
      "references/examples.md",
      "references/intake-schema.md",
      "references/output-contract.md",
      "references/signal-rubric.md",
    ],
  },
] as const;

describe("shipped outbound skill bundles", () => {
  const listedSkills = listShippedPortalSkills();

  for (const expected of EXPECTED_SKILLS) {
    it(`lists and packages ${expected.slug}`, () => {
      const listed = listedSkills.find((skill) => skill.slug === expected.slug);
      expect(listed).toMatchObject({
        title: expected.title,
        category: "skill",
        file_type: "md",
        is_free: true,
        download_url: `/api/portal/skills/${expected.slug}/download`,
      });

      const bundle = getPortalSkillBundle(expected.slug);
      expect(bundle).not.toBeNull();
      expect(bundle?.name).toBe(expected.title);
      expect(bundle?.files.map((file) => file.path)).toEqual(expected.files);
      expect(bundle?.fileCount).toBe(expected.files.length);

      const archive = getPortalSkillArchiveFiles(expected.slug);
      expect(archive.map((file) => file.path).sort()).toEqual(
        expected.files.map((file) => `${expected.slug}/${file}`).sort(),
      );
      expect(archive.every((file) => file.data.byteLength > 0)).toBe(true);
    });
  }
});
