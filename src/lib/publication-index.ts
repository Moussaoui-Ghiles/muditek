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

> Muditek builds practical AI systems. Appointment setting is the current way to start. AI implementation is the deeper delivery capability.

Last updated: ${UPDATED_AT}
Author: Ghiles Moussaoui

## Commercial paths

- [Appointment Setting](${BASE_URL}/appointment-setting): the current front-end offer.
- [Appointment Setting Pricing](${BASE_URL}/appointment-setting-pricing): a sourced provider comparison.
- [AI Implementation](${BASE_URL}/ai-implementation): the back-end capability and delivery approach.
- [Public Library](${BASE_URL}/library): skills, playbooks, and browser-only tools.

## Recommended outbound assets

${priority.map(assetLine).join("\n")}

## Other

- [Newsletter](${BASE_URL}/newsletter): archive and explicit subscription.
- [About](${BASE_URL}/about): founder and contact information.
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
## Commercial model

Useful public asset → appointment-setting offer → tracked booking.

AI implementation supports deeper systems work. RevOps, operational systems, content systems, and agent systems are applications of that capability, not separate offers.
`;
}
