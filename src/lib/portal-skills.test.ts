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
  {
    slug: "outbound-funnel-economics",
    title: "Outbound Funnel Economics",
    files: [
      "SKILL.md",
      "agents/openai.yaml",
      "references/intake-and-data-contract.md",
      "references/interpretation-and-audit.md",
      "references/metric-specification.md",
      "references/source-boundaries.md",
      "references/worked-examples.md",
      "scripts/calculate.py",
      "scripts/test_calculate.py",
    ],
  },
  {
    slug: "list-builder",
    title: "List Builder",
    files: [
      "SKILL.md",
      "prompts/_TEMPLATE.md",
      "references/registry-schema.sql",
      "RUNBOOK.md",
      "scripts/classify-batch.ts",
      "scripts/contacts-merge.ts",
      "scripts/contacts.ts",
      "scripts/enrich-domains.ts",
      "scripts/fleet.ts",
      "scripts/getleads-client.ts",
      "scripts/make-judge.ts",
      "scripts/multi-lane-classify.ts",
      "scripts/push-sheet.py",
      "scripts/registry.ts",
      "scripts/reject-audit.ts",
      "scripts/run-lane.ts",
      "scripts/snowball.ts",
      "scripts/solo-teampage.ts",
    ],
  },
  {
    slug: "list-expander",
    title: "List Expander",
    files: [
      "SKILL.md",
      "scripts/contact-count.ts",
      "scripts/fingerprint.ts",
      "scripts/lib.ts",
      "scripts/lookalikes.ts",
      "scripts/mine-filters.ts",
      "scripts/pull.ts",
      "scripts/report.ts",
      "scripts/score-batch.ts",
      "scripts/verify-website.ts",
    ],
  },
  {
    slug: "google-maps-owner-email-finder",
    title: "Google Maps Owner Email Finder",
    files: [
      "SKILL.md",
      ".gitignore",
      "examples/example.md",
      "LICENSE",
      "README.md",
      "references/review-rules.md",
      "scripts/audit-results.mjs",
      "scripts/collect-website-evidence.mjs",
      "templates/businesses-input.csv",
      "templates/owners-output.csv",
    ],
  },
  {
    slug: "audience-content-os",
    title: "Audience Content OS",
    files: [
      "SKILL.md",
      "agents/openai.yaml",
      "references/claim-map.md",
      "references/source-doctrine.md",
      "references/source-examples.md",
    ],
  },
  {
    slug: "linkedin-content-writer",
    title: "LinkedIn Content Writer",
    files: [
      "SKILL.md",
      "references/halbert-headlines.md",
      "references/linkedin-winners.md",
    ],
  },
  {
    slug: "x-content-writer",
    title: "X Content Writer",
    files: [
      "SKILL.md",
      "references/format-guide.md",
      "references/hook-review.md",
      "references/source-fidelity.md",
    ],
  },
  {
    slug: "newsletter",
    title: "Newsletter",
    files: [
      "SKILL.md",
      "references/language.md",
      "references/structure.md",
    ],
  },
  {
    slug: "tiktok-slideshow-machine",
    title: "TikTok Slideshow Machine",
    files: [
      "SKILL.md",
      "assets/slides-template.html",
      "prompts/caption-generator.md",
      "prompts/hook-generator.md",
      "prompts/negative-constraints.md",
      "prompts/reverse-engineer.md",
      "references/codewithboi-anchor.md",
      "references/posting-checklist.md",
      "references/recurring-mistakes.md",
      "references/render-pipeline.md",
      "scripts/download-logo.sh",
      "scripts/render.mjs",
      "templates/asset-tag.template.json",
      "templates/format-schema.template.json",
    ],
  },
  {
    slug: "lead-magnets",
    title: "Lead Magnets",
    files: [
      "SKILL.md",
      "references/source-framework.md",
    ],
  },
] as const;

describe("shipped portal skill bundles", () => {
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
