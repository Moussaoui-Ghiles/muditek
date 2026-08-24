import { NextRequest, NextResponse } from "next/server";
import {
  cleanTxtRecord,
  countSpfDnsMechanisms,
  extractSpfDependencies,
  normalizeDomain,
  normalizeSelector,
  type DnsAnswer,
  type DnsCheckType,
  type DnsRecordResult,
  type SpfResult,
} from "../../../../lib/tools/dns";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set<DnsCheckType>(["auth", "mx", "txt", "spf", "dmarc", "dkim"]);
const CLOUDFLARE_DOH = "https://cloudflare-dns.com/dns-query";

async function queryDns(name: string, type: "MX" | "TXT", signal: AbortSignal): Promise<DnsRecordResult> {
  const url = new URL(CLOUDFLARE_DOH);
  url.searchParams.set("name", name);
  url.searchParams.set("type", type);
  try {
    const response = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal,
      next: { revalidate: 3600 },
    });
    if (!response.ok) return { query: name, records: [], found: false, error: `DNS provider returned HTTP ${response.status}.` };
    const payload = await response.json() as { Status?: number; Answer?: DnsAnswer[] };
    if (payload.Status !== 0 && payload.Status !== 3) return { query: name, records: [], found: false, error: `DNS provider returned status ${payload.Status ?? "unknown"}.` };
    const expectedType = type === "MX" ? 15 : 16;
    const records = (payload.Answer ?? []).filter((answer) => answer.type === expectedType).map((answer) => type === "TXT" ? cleanTxtRecord(answer.data) : answer.data);
    return { query: name, records, found: records.length > 0 };
  } catch (error) {
    return { query: name, records: [], found: false, error: error instanceof Error && error.name === "AbortError" ? "DNS request timed out." : "DNS request failed." };
  }
}

async function inspectSpf(domain: string, signal: AbortSignal): Promise<SpfResult> {
  const checkedDomains: string[] = [];
  const cycles: string[] = [];
  const visited = new Set<string>();
  let lookupCount = 0;
  let root: DnsRecordResult = { query: domain, records: [], found: false };

  async function walk(current: string, depth: number, path: Set<string>): Promise<void> {
    if (depth > 10 || lookupCount > 20) return;
    if (path.has(current)) {
      cycles.push(current);
      return;
    }
    if (visited.has(current)) return;
    visited.add(current);
    checkedDomains.push(current);
    const txt = await queryDns(current, "TXT", signal);
    const spfRecords = txt.records.filter((record) => /^v=spf1(?:\s|$)/i.test(record));
    if (current === domain) root = { ...txt, records: spfRecords, found: spfRecords.length > 0 };
    const nextPath = new Set(path).add(current);
    for (const record of spfRecords) {
      lookupCount += countSpfDnsMechanisms(record);
      for (const dependency of extractSpfDependencies(record)) await walk(dependency, depth + 1, nextPath);
    }
  }

  await walk(domain, 0, new Set());
  return { ...root, lookupCount, lookupLimitExceeded: lookupCount > 10, checkedDomains, cycles };
}

export async function GET(request: NextRequest) {
  const domain = normalizeDomain(request.nextUrl.searchParams.get("domain") ?? "");
  const type = request.nextUrl.searchParams.get("type") as DnsCheckType | null;
  const rawSelector = request.nextUrl.searchParams.get("selector") ?? "";
  if (!domain) return NextResponse.json({ error: "Enter a valid domain such as example.com." }, { status: 400 });
  if (!type || !ALLOWED_TYPES.has(type)) return NextResponse.json({ error: "Unsupported DNS check type." }, { status: 400 });
  const selector = rawSelector ? normalizeSelector(rawSelector) : null;
  if (type === "dkim" && !selector) return NextResponse.json({ error: "Enter the DKIM selector supplied by the sending provider." }, { status: 400 });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    let result: unknown;
    if (type === "mx") result = await queryDns(domain, "MX", controller.signal);
    else if (type === "txt") result = await queryDns(domain, "TXT", controller.signal);
    else if (type === "spf") result = await inspectSpf(domain, controller.signal);
    else if (type === "dmarc") result = await queryDns(`_dmarc.${domain}`, "TXT", controller.signal);
    else if (type === "dkim") result = await queryDns(`${selector}._domainkey.${domain}`, "TXT", controller.signal);
    else {
      const [mx, spf, dmarc, dkim] = await Promise.all([
        queryDns(domain, "MX", controller.signal),
        inspectSpf(domain, controller.signal),
        queryDns(`_dmarc.${domain}`, "TXT", controller.signal),
        selector ? queryDns(`${selector}._domainkey.${domain}`, "TXT", controller.signal) : Promise.resolve(null),
      ]);
      result = { domain, mx, spf, dmarc, dkim, dkimNote: selector ? undefined : "DKIM was not checked because no selector was supplied." };
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
  } finally {
    clearTimeout(timeout);
  }
}
