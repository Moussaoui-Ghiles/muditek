import { getPublishedLibraryItems, type LibraryItem } from "./library-manifest";

const BASE_URL = "https://muditek.com";
const UPDATED_AT = "2026-08-23";

export function libraryCanonicalPath(item: LibraryItem): string {
  return `/${item.kind}s/${item.slug}`;
}

function assetLine(item: LibraryItem): string {
  return `- [${item.title}](${BASE_URL}${libraryCanonicalPath(item)}): ${item.summary}`;
}

export function buildLlmsTxt(): string {
  const items = getPublishedLibraryItems();
  const priority = items.filter((item) =>
    [
      "outbound-failure-diagnostic",
      "cold-offer-review",
      "buyer-signal-list-research",
      "outbound-funnel-economics",
      "appointment-setting-quote-calculator",
      "outbound-funnel-economics-calculator",
    ].includes(item.slug),
  );

  return `# Muditek

> Muditek runs B2B appointment setting and builds AI into defined operating workflows. The public library explains the methods and provides browser-only tools.

Last updated: ${UPDATED_AT}
Author: Ghiles Moussaoui

## Commercial paths

- [Appointment Setting](${BASE_URL}/appointment-setting): targeting, research, outreach, qualification, and booking with held-meeting billing rules.
- [Appointment Setting Pricing](${BASE_URL}/appointment-setting-pricing): a sourced provider comparison.
- [AI Implementation](${BASE_URL}/ai-implementation): scope, build, and operate AI inside a defined workflow.
- [Public Library](${BASE_URL}/library): skills, playbooks, and browser-only tools.

## Recommended outbound assets

${priority.map(assetLine).join("\n")}

## Other

- [Newsletter](${BASE_URL}/newsletter): archive and explicit subscription.
- [About](${BASE_URL}/about): founder and contact information.
- [Data and Privacy](${BASE_URL}/privacy): what the site, account, newsletter, tools, and booking path record.
- [Full machine-readable index](${BASE_URL}/llms-full.txt)
`;
}

export function buildLlmsFullTxt(): string {
  const groups = [
    ["Outbound skills", getPublishedLibraryItems("skill").filter((item) => item.lane === "outbound")],
    ["AI implementation skills", getPublishedLibraryItems("skill").filter((item) => item.lane === "ai-implementation")],
    ["Outbound playbooks", getPublishedLibraryItems("playbook").filter((item) => item.lane === "outbound")],
    ["AI implementation playbooks", getPublishedLibraryItems("playbook").filter((item) => item.lane === "ai-implementation")],
    ["Browser-only tools", getPublishedLibraryItems("tool")],
  ] as const;

  return `${buildLlmsTxt()}
## Complete published library

${groups
  .map(([title, items]) => `### ${title}\n\n${items.map(assetLine).join("\n")}`)
  .join("\n\n")}

## Access and privacy

Public pages and browser tools work without an account. Core skill bundles download without an account. Advanced skill bundles require a free account. Newsletter consent is separate and optional. Browser tools do not send their inputs to Muditek or to an AI provider.
`;
}

export function buildIndexMarkdown(): string {
  return `${buildLlmsFullTxt()}
## Relevant service paths

Outbound assets link to appointment setting. AI, content, data, and agent-system assets link to AI implementation.

Revenue operations, operational systems, content systems, and agent systems are examples of AI implementation work. They are not presented as separate service offers or client results.
`;
}
