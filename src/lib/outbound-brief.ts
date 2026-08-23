export interface OutboundBriefInputs {
  name: string;
  decision: string;
  offer: string;
  companyFit: string;
  buyerRoles: string;
  geography: string;
  signals: string;
  exclusions: string;
  qualification: string;
  proof: string;
  channels: string;
  constraints: string;
}

export interface OutboundBriefData {
  schemaVersion: "1.0";
  name: string;
  decision: string;
  offer: string;
  companyFit: string;
  buyerRoles: string[];
  geography: string[];
  signals: string[];
  exclusions: string[];
  qualification: string;
  proof: string;
  channels: string[];
  constraints: string;
}

export interface OutboundBriefExport {
  data: OutboundBriefData;
  markdown: string;
  json: string;
}

function clean(value: string): string {
  return value.trim().replace(/\r\n?/g, "\n");
}

function lines(value: string): string[] {
  return clean(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bullets(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None supplied";
}

export function buildOutboundBrief(inputs: OutboundBriefInputs): OutboundBriefExport | null {
  const decision = clean(inputs.decision);
  const offer = clean(inputs.offer);
  const companyFit = clean(inputs.companyFit);
  if (!decision || !offer || !companyFit) return null;

  const data: OutboundBriefData = {
    schemaVersion: "1.0",
    name: clean(inputs.name) || "Untitled outbound brief",
    decision,
    offer,
    companyFit,
    buyerRoles: lines(inputs.buyerRoles),
    geography: lines(inputs.geography),
    signals: lines(inputs.signals),
    exclusions: lines(inputs.exclusions),
    qualification: clean(inputs.qualification),
    proof: clean(inputs.proof),
    channels: lines(inputs.channels),
    constraints: clean(inputs.constraints),
  };

  const markdown = [
    `# Outbound brief: ${data.name}`,
    "",
    "## Decision",
    "",
    data.decision,
    "",
    "## Offer",
    "",
    data.offer,
    "",
    "## Company fit",
    "",
    data.companyFit,
    "",
    "## Buyer roles",
    "",
    bullets(data.buyerRoles),
    "",
    "## Geography",
    "",
    bullets(data.geography),
    "",
    "## Buyer signals",
    "",
    bullets(data.signals),
    "",
    "## Exclusions",
    "",
    bullets(data.exclusions),
    "",
    "## Qualification",
    "",
    data.qualification || "Not supplied",
    "",
    "## Approved proof",
    "",
    data.proof || "Not supplied",
    "",
    "## Channels",
    "",
    bullets(data.channels),
    "",
    "## Constraints",
    "",
    data.constraints || "Not supplied",
    "",
  ].join("\n");

  return {
    data,
    markdown,
    json: JSON.stringify(data, null, 2),
  };
}
