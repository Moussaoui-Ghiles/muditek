import { describe, expect, it } from "vitest";
import {
  LIBRARY_MANIFEST,
  getLibraryItem,
  getPublishedLibraryItems,
  resolveLibraryPath,
} from "./library-manifest";

const CORE_SKILLS = [
  "buyer-signal-list-research",
  "cold-offer-review",
  "google-maps-owner-email-finder",
  "outbound-funnel-economics",
];

const ACCOUNT_SKILLS = [
  "audience-content-os",
  "content-clarity-review",
  "google-maps-list-builder",
  "icp-prompt-builder",
  "lead-magnets",
  "linkedin-content-writer",
  "list-builder",
  "list-expander",
  "list-quality-scorecard",
  "x-content-writer",
];

const APPROVED_PLAYBOOKS = [
  "10000-cold-email-system",
  "agentic-sdr-setup-guide",
  "ai-data-agent-guide",
  "ai-marketing-team-playbook",
  "chatgpt-work-self-improving-outbound",
  "claude-code-lead-gen-guide",
  "coding-agent-seo-playbook",
  "cold-email-claude-code-blueprint",
  "geo-playbook",
  "google-maps-outbound",
  "hermes-outbound-gtm-agent",
  "judgment-moat",
  "local-ai-build-guide",
  "loop-design-playbook",
  "mudiagent-operator-guide",
  "outbound-failure-diagnostic",
  "slack-outbound-agent-playbook",
];

describe("library publication manifest", () => {
  it("publishes only the approved core and account skill sets", () => {
    const skills = getPublishedLibraryItems("skill");

    expect(skills.filter((item) => item.access === "public").map((item) => item.slug).sort()).toEqual(CORE_SKILLS);
    expect(skills.filter((item) => item.access === "account").map((item) => item.slug).sort()).toEqual(ACCOUNT_SKILLS);
  });

  it("publishes the five browser-side tools and no provider-backed tools", () => {
    expect(getPublishedLibraryItems("tool").map((item) => item.slug).sort()).toEqual([
      "appointment-setting-quote-calculator",
      "cold-email-capacity-calculator",
      "csv-list-quality-auditor",
      "outbound-brief-builder",
      "outbound-funnel-economics-calculator",
    ]);
  });

  it("publishes exactly the approved playbooks", () => {
    expect(getPublishedLibraryItems("playbook").map((item) => item.slug).sort()).toEqual(APPROVED_PLAYBOOKS);
  });

  it("publishes exactly 14 skills, 17 playbooks, and five tools", () => {
    expect(getPublishedLibraryItems("skill")).toHaveLength(14);
    expect(getPublishedLibraryItems("playbook")).toHaveLength(17);
    expect(getPublishedLibraryItems("tool")).toHaveLength(5);
    expect(getPublishedLibraryItems()).toHaveLength(36);
  });

  it("keeps archived and redirected assets out of publication", () => {
    expect(getPublishedLibraryItems().some((item) => item.status !== "published")).toBe(false);
    expect(getLibraryItem("playbook", "openclaw-outbound")?.status).toBe("redirected");
    expect(getLibraryItem("playbook", "reddit-client-acquisition-hermes")?.status).toBe("removed");
    expect(resolveLibraryPath("/playbooks/reddit-client-acquisition-hermes")).toEqual({ status: "gone" });
    expect(resolveLibraryPath("/playbooks/openclaw-outbound")).toEqual({
      status: "redirect",
      target: "/playbooks/google-maps-outbound",
    });
    expect(resolveLibraryPath("/tools/revenue-leak-calculator")).toEqual({ status: "gone" });
  });

  it("keeps every canonical path unique and every relation resolvable", () => {
    const paths = LIBRARY_MANIFEST.map((item) => `/${item.kind}s/${item.slug}`);
    expect(new Set(paths).size).toBe(paths.length);

    for (const item of LIBRARY_MANIFEST.filter((candidate) => candidate.status === "published")) {
      expect(item.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.source.length).toBeGreaterThan(0);
      expect(item.commercialTarget).toBe(item.lane === "outbound" ? "/appointment-setting" : "/ai-implementation");
      expect(item.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(item.answer.length).toBeGreaterThan(40);
      expect(item.inputs.length).toBeGreaterThan(0);
      expect(item.outputs.length).toBeGreaterThan(0);
      expect(item.outputs).not.toEqual(item.inputs);
      expect(item.prerequisites.length).toBeGreaterThan(0);
      expect(item.examplePath.length).toBeGreaterThan(0);
      expect(item.sourceLinks.length).toBeGreaterThan(0);
      expect(item.sourceLinks.every((link) => link.label.length > 0 && link.href.startsWith("/"))).toBe(true);

      if (item.kind === "skill") {
        expect(item.validationCommand).toContain("validate-library-skill.mjs");
        expect(item.bundleFiles.length).toBeGreaterThan(1);
      }

      for (const relatedPath of item.relatedAssets) {
        expect(resolveLibraryPath(relatedPath).status).toBe("published");
      }
    }
  });
});
