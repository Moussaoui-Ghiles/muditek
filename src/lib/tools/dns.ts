export type DnsCheckType = "auth" | "mx" | "txt" | "spf" | "dmarc" | "dkim";

export type DnsAnswer = { name: string; type: number; data: string };

export type DnsRecordResult = {
  query: string;
  records: string[];
  found: boolean;
  error?: string;
};

export type SpfResult = DnsRecordResult & {
  lookupCount: number;
  lookupLimitExceeded: boolean;
  checkedDomains: string[];
  cycles: string[];
};

export function normalizeDomain(value: string): string | null {
  const normalized = value.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[\/?#]/)[0].replace(/\.$/, "");
  if (!normalized || normalized.length > 253 || !normalized.includes(".")) return null;
  const labels = normalized.split(".");
  if (labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return null;
  return normalized;
}

export function normalizeSelector(value: string): string | null {
  const selector = value.trim().toLowerCase();
  if (!selector || selector.length > 63 || !/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/i.test(selector)) return null;
  return selector;
}

export function cleanTxtRecord(value: string): string {
  return value.replace(/^"|"$/g, "").replace(/"\s+"/g, "");
}

export function extractSpfDependencies(record: string): string[] {
  const dependencies: string[] = [];
  for (const token of record.trim().split(/\s+/)) {
    const match = token.match(/^(?:[+?~-])?(?:include:|redirect=)([^\s/]+)$/i);
    if (match) dependencies.push(match[1].toLowerCase());
  }
  return dependencies;
}

export function countSpfDnsMechanisms(record: string): number {
  return record.trim().split(/\s+/).filter((token) => /^(?:[+?~-])?(?:a(?::|\/|$)|mx(?::|\/|$)|ptr(?::|$)|exists:|include:|redirect=)/i.test(token)).length;
}

function isSpfIncludeDomain(value: string): boolean {
  if (!value || value.length > 253 || !value.includes(".")) return false;
  return value.split(".").every((label) => /^_?[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label));
}

function isIpv4Mechanism(value: string): boolean {
  const [address, prefix] = value.split("/");
  if (prefix !== undefined && (!/^\d{1,2}$/.test(prefix) || Number(prefix) > 32)) return false;
  const octets = address.split(".");
  return octets.length === 4 && octets.every((octet) => /^\d{1,3}$/.test(octet) && Number(octet) <= 255);
}

function isIpv6Mechanism(value: string): boolean {
  const slash = value.lastIndexOf("/");
  const address = slash === -1 ? value : value.slice(0, slash);
  const prefix = slash === -1 ? undefined : value.slice(slash + 1);
  if (prefix !== undefined && (!/^\d{1,3}$/.test(prefix) || Number(prefix) > 128)) return false;
  try {
    return new URL(`http://[${address}]/`).hostname.length > 2;
  } catch {
    return false;
  }
}

export function makeSpfRecord(includes: string[], ip4: string[], ip6: string[], policy: "" | "-all" | "~all" | "?all"): string | null {
  if (!policy || includes.some((value) => !isSpfIncludeDomain(value)) || ip4.some((value) => !isIpv4Mechanism(value)) || ip6.some((value) => !isIpv6Mechanism(value))) return null;
  const tokens = [
    "v=spf1",
    ...includes.map((value) => `include:${value}`),
    ...ip4.map((value) => `ip4:${value}`),
    ...ip6.map((value) => `ip6:${value}`),
    policy,
  ];
  return tokens.join(" ");
}

export function makeDmarcRecord({
  policy,
  percentage,
  aggregateEmail,
  forensicEmail,
  subdomainPolicy,
}: {
  policy: "none" | "quarantine" | "reject";
  percentage: number;
  aggregateEmail?: string;
  forensicEmail?: string;
  subdomainPolicy?: "none" | "quarantine" | "reject";
}): string {
  const tags = ["v=DMARC1", `p=${policy}`, `pct=${Math.max(0, Math.min(100, Math.round(percentage)))}`];
  if (subdomainPolicy) tags.push(`sp=${subdomainPolicy}`);
  if (aggregateEmail?.trim()) tags.push(`rua=mailto:${aggregateEmail.trim()}`);
  if (forensicEmail?.trim()) tags.push(`ruf=mailto:${forensicEmail.trim()}`);
  return `${tags.join("; ")};`;
}
