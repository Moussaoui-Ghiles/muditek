#!/usr/bin/env node

import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;
const ROLE_PATTERN = /\b(owner|co-owner|business owner|proprietor|founder|co-founder|president|chief executive officer|ceo|managing director|principal)\b/i;
const RELEVANT_PATH = /\b(about|team|story|our-story|who-we-are|leadership|founder|owner|company|contact)\b/i;
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PLACEHOLDER_EMAILS = new Set([
  "admin@example.com",
  "email@example.com",
  "hello@example.com",
  "john@email.com",
  "name@email.com",
  "test@test.com",
  "user@domain.com",
  "you@email.com",
]);
const NON_CONTACT_EMAIL_DOMAIN_SUFFIXES = ["sentry.io", "wixpress.com"];

function arg(name, fallback = "") {
  const prefix = `${name}=`;
  const value = process.argv.find((entry) => entry.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function clampInteger(value, fallback, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function normalizedHeader(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function getColumn(row, headers, aliases) {
  const index = headers.findIndex((header) => aliases.includes(header));
  return index >= 0 ? (row[index] ?? "").trim() : "";
}

export function readCompanies(text) {
  const rows = parseCsv(text);
  const headers = (rows.shift() ?? []).map(normalizedHeader);
  const nameIndex = headers.findIndex((header) => ["company_name", "name", "title", "business_name"].includes(header));
  const websiteIndex = headers.findIndex((header) => ["website", "url", "company_url", "domain"].includes(header));
  if (nameIndex < 0 || websiteIndex < 0) {
    throw new Error("Input CSV needs company_name and website columns.");
  }

  return rows.map((row, index) => ({
    rowNumber: index + 2,
    companyName: getColumn(row, headers, ["company_name", "name", "title", "business_name"]),
    website: getColumn(row, headers, ["website", "url", "company_url", "domain"]),
  }));
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function plainText(html) {
  return decodeEntities(html)
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|svg|template)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/section|\/article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function titleFromHtml(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? plainText(match[1]).slice(0, 200) : "";
}

function normalizeHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
}

export function isUnsafeIp(address) {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split(".").map(Number);
    return a === 0
      || a === 10
      || a === 127
      || (a === 100 && b >= 64 && b <= 127)
      || (a === 169 && b === 254)
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 0 && (c === 0 || c === 2))
      || (a === 192 && b === 168)
      || (a === 198 && (b === 18 || b === 19))
      || (a === 198 && b === 51 && c === 100)
      || (a === 203 && b === 0 && c === 113)
      || a >= 224;
  }

  if (isIP(address) === 6) {
    const normalized = address.toLowerCase();
    return normalized === "::"
      || normalized === "::1"
      || normalized.startsWith("fc")
      || normalized.startsWith("fd")
      || /^(fe8|fe9|fea|feb)/.test(normalized)
      || normalized.startsWith("ff")
      || normalized.startsWith("2001:db8")
      || normalized.startsWith("64:ff9b:")
      || normalized.includes(":ffff:");
  }

  return true;
}

export function normalizeWebsite(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Missing website.");
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:/i.test(trimmed)) {
    throw new Error("Website must use HTTP or HTTPS.");
  }
  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Website must use HTTP or HTTPS.");
  if (url.username || url.password) throw new Error("Website credentials are not allowed.");
  if (["localhost", "localhost.localdomain"].includes(url.hostname.toLowerCase()) || url.hostname.toLowerCase().endsWith(".local")) {
    throw new Error("Local websites are not allowed.");
  }
  url.hash = "";
  return url;
}

async function assertPublicHost(url) {
  if (isIP(url.hostname) && isUnsafeIp(url.hostname)) throw new Error("Private or local network targets are not allowed.");
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some((entry) => isUnsafeIp(entry.address))) {
    throw new Error("Private or unresolved network targets are not allowed.");
  }
}

async function fetchHtml(initialUrl) {
  let current = normalizeWebsite(initialUrl.toString());
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicHost(current);
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "MuditekEvidenceCollector/1.0 (+https://muditek.com/library)",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`Redirect ${response.status} has no location.`);
      current = normalizeWebsite(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
    }
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_RESPONSE_BYTES) throw new Error("Page is larger than 2 MB.");
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_RESPONSE_BYTES) throw new Error("Page is larger than 2 MB.");
    return { html: buffer.toString("utf8"), url: current.toString() };
  }
  throw new Error("Too many redirects.");
}

function extractLinks(html, baseUrl, allowedHost) {
  const links = [];
  const pattern = /<a\b[^>]*?href\s*=\s*(["'])(.*?)\1/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      const candidate = new URL(decodeEntities(match[2]), baseUrl);
      candidate.hash = "";
      if (!["http:", "https:"].includes(candidate.protocol)) continue;
      if (normalizeHost(candidate.hostname) !== allowedHost) continue;
      if (!RELEVANT_PATH.test(`${candidate.pathname} ${candidate.search}`)) continue;
      links.push(candidate.toString());
    } catch {
      // Ignore malformed links from the source page.
    }
  }
  return [...new Set(links)];
}

function extractMailtoAddresses(html) {
  const addresses = [];
  const pattern = /<a\b[^>]*?href\s*=\s*(["'])mailto:([^"']+)\1/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      addresses.push(decodeURIComponent(decodeEntities(match[2]).split("?")[0]));
    } catch {
      // Ignore malformed mailto links.
    }
  }
  return addresses;
}

function extractEmails(text) {
  const candidates = decodeEntities(text).match(EMAIL_PATTERN) ?? [];
  return [...new Set(candidates.map((email) => email.toLowerCase()))]
    .filter((email) => !PLACEHOLDER_EMAILS.has(email))
    .filter((email) => {
      const domain = email.split("@")[1] ?? "";
      return !NON_CONTACT_EMAIL_DOMAIN_SUFFIXES.some((suffix) => domain === suffix || domain.endsWith(`.${suffix}`));
    })
    .filter((email) => !/^(no-?reply|donotreply)@/i.test(email))
    .filter((email) => !email.includes("%"))
    .filter((email) => !/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(email));
}

function extractRoleSnippets(text) {
  const compact = text.replace(/\s+/g, " ");
  const snippets = [];
  for (const match of compact.matchAll(new RegExp(ROLE_PATTERN.source, "gi"))) {
    let start = Math.max(0, (match.index ?? 0) - 180);
    let end = Math.min(compact.length, (match.index ?? 0) + 260);
    if (start > 0) start = compact.indexOf(" ", start) + 1;
    if (end < compact.length) end = compact.lastIndexOf(" ", end);
    const snippet = compact.slice(start, end).trim();
    if (snippet.length >= 20) snippets.push(snippet);
  }
  return [...new Set(snippets)].slice(0, 24);
}

export function parsePageEvidence(html, url) {
  const text = plainText(html);
  return {
    url,
    title: titleFromHtml(html),
    roleSnippets: extractRoleSnippets(text),
    emails: extractEmails(`${text}\n${extractMailtoAddresses(html).join("\n")}`),
  };
}

function evidenceFileName(companyName, website) {
  const slug = companyName.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "company";
  const hash = createHash("sha256").update(`${companyName}\n${website}`).digest("hex").slice(0, 10);
  return `${slug}-${hash}.json`;
}

async function collectCompany(company, evidenceDir, maxPages) {
  const evidenceFile = evidenceFileName(company.companyName, company.website);
  const base = {
    company_name: company.companyName,
    website: company.website,
    input_row: company.rowNumber,
    collected_at: new Date().toISOString(),
    evidence_file: `evidence/${evidenceFile}`,
  };

  if (!company.companyName || !company.website) {
    return { ...base, status: "failed", error: "Missing company name or website.", pages: [] };
  }

  try {
    const homepage = await fetchHtml(normalizeWebsite(company.website));
    const homepageUrl = new URL(homepage.url);
    const allowedHost = normalizeHost(homepageUrl.hostname);
    const pageUrls = [homepage.url, ...extractLinks(homepage.html, homepage.url, allowedHost)].slice(0, maxPages);
    const pages = [parsePageEvidence(homepage.html, homepage.url)];

    for (const pageUrl of pageUrls.slice(1)) {
      try {
        const page = await fetchHtml(new URL(pageUrl));
        if (normalizeHost(new URL(page.url).hostname) !== allowedHost) continue;
        pages.push(parsePageEvidence(page.html, page.url));
      } catch (error) {
        pages.push({
          url: pageUrl,
          title: "",
          roleSnippets: [],
          emails: [],
          error: error instanceof Error ? error.message : "Page collection failed.",
        });
      }
    }

    const result = { ...base, website: homepage.url, status: "collected", error: "", pages };
    await writeFile(resolve(evidenceDir, evidenceFile), `${JSON.stringify(result, null, 2)}\n`, "utf8");
    return result;
  } catch (error) {
    const result = {
      ...base,
      status: "failed",
      error: error instanceof Error ? error.message : "Website collection failed.",
      pages: [],
    };
    await writeFile(resolve(evidenceDir, evidenceFile), `${JSON.stringify(result, null, 2)}\n`, "utf8");
    return result;
  }
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  return results;
}

async function main() {
  const input = arg("--input");
  const outputDir = resolve(arg("--output-dir", "run"));
  const maxPages = clampInteger(arg("--max-pages", "20"), 20, 1, 20);
  const concurrency = clampInteger(arg("--concurrency", "3"), 3, 1, 8);
  if (!input) throw new Error("Use --input=companies.csv and optionally --output-dir=run.");

  const companies = readCompanies(await readFile(resolve(input), "utf8"));
  if (companies.length === 0) throw new Error("Input CSV has no company rows.");
  await mkdir(outputDir, { recursive: true });
  const evidenceDir = resolve(outputDir, "evidence");
  await mkdir(evidenceDir, { recursive: true });

  const results = await runPool(companies, concurrency, (company) => collectCompany(company, evidenceDir, maxPages));
  const indexRows = [["company_name", "website", "evidence_file", "pages_collected", "public_emails", "collection_status", "error"]];
  for (const result of results) {
    const emails = [...new Set(result.pages.flatMap((page) => page.emails ?? []))].join(" | ");
    indexRows.push([
      result.company_name,
      result.website,
      result.evidence_file,
      String(result.pages.length),
      emails,
      result.status,
      result.error,
    ]);
  }
  await writeFile(resolve(outputDir, "evidence-index.csv"), `${indexRows.map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");

  const collected = results.filter((result) => result.status === "collected").length;
  process.stdout.write(`${JSON.stringify({ input: basename(input), companies: companies.length, collected, failed: companies.length - collected, outputDir }, null, 2)}\n`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
