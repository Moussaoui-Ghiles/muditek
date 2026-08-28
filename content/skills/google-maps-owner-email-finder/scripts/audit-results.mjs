#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseCsv } from "./collect-website-evidence.mjs";

const REQUIRED_HEADERS = [
  "company_name",
  "website",
  "owner_name",
  "owner_role",
  "owner_status",
  "evidence_url",
  "evidence_text",
  "public_email",
  "email_status",
  "email_source_url",
  "notes",
];
const OWNER_STATUSES = new Set(["explicit", "unknown"]);
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const OWNER_LANGUAGE = /\b(owner|co-owner|business owner|proprietor)\b/i;

function arg(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((entry) => entry.startsWith(prefix));
  return value ? value.slice(prefix.length) : "";
}

function validPublicUrl(value) {
  if (!value) return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function normalizedHost(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  } catch {
    return "";
  }
}

function matchesCompanyWebsite(citedUrl, website) {
  const citedHost = normalizedHost(citedUrl);
  const websiteHost = normalizedHost(website);
  return Boolean(citedHost && websiteHost && citedHost === websiteHost);
}

function normalizedUrl(value) {
  try {
    return new URL(value).toString();
  } catch {
    return "";
  }
}

export async function loadEmailEvidence(inputPath) {
  const evidence = new Map();
  const evidenceDir = resolve(dirname(inputPath), "evidence");
  let entries = [];
  try {
    entries = await readdir(evidenceDir, { withFileTypes: true });
  } catch {
    return evidence;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".json")) continue;
    try {
      const document = JSON.parse(await readFile(resolve(evidenceDir, entry.name), "utf8"));
      for (const page of Array.isArray(document.pages) ? document.pages : []) {
        const url = normalizedUrl(page?.url ?? "");
        if (!url) continue;
        const emails = new Set(
          (Array.isArray(page?.emails) ? page.emails : [])
            .map((email) => String(email).trim().toLowerCase())
            .filter(Boolean),
        );
        evidence.set(url, emails);
      }
    } catch {
      // Invalid evidence files cannot support a result row.
    }
  }

  return evidence;
}

export function auditRows(rows, emailEvidence = new Map()) {
  const issues = [];
  const header = rows[0] ?? [];
  const normalized = header.map((value) => value.trim());
  for (const required of REQUIRED_HEADERS) {
    if (!normalized.includes(required)) issues.push(`Header: missing ${required}`);
  }
  if (issues.length > 0) return issues;

  const index = Object.fromEntries(normalized.map((name, position) => [name, position]));
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    const value = (name) => (row[index[name]] ?? "").trim();
    const line = rowIndex + 1;
    const ownerStatus = value("owner_status");
    const ownerName = value("owner_name");
    const ownerRole = value("owner_role");
    const website = value("website");
    const evidenceUrl = value("evidence_url");
    const evidenceText = value("evidence_text");
    const email = value("public_email");
    const emailStatus = value("email_status");
    const emailSource = value("email_source_url");

    if (!value("company_name")) issues.push(`Row ${line}: missing company_name`);
    if (!validPublicUrl(website)) issues.push(`Row ${line}: invalid website`);
    if (!OWNER_STATUSES.has(ownerStatus)) issues.push(`Row ${line}: invalid owner_status`);

    if (ownerStatus === "unknown") {
      if (ownerName || ownerRole || evidenceUrl || evidenceText) issues.push(`Row ${line}: unknown owner must not contain an owner claim`);
    } else {
      if (!ownerName || !ownerRole) issues.push(`Row ${line}: owner claim needs name and role`);
      if (!validPublicUrl(evidenceUrl) || !evidenceText) issues.push(`Row ${line}: owner claim needs source URL and evidence text`);
      else if (!matchesCompanyWebsite(evidenceUrl, website)) issues.push(`Row ${line}: owner evidence URL must match the company website`);
      if (ownerStatus === "explicit" && !OWNER_LANGUAGE.test(evidenceText)) issues.push(`Row ${line}: explicit claim lacks owner or proprietor language`);
    }

    if (email) {
      if (!EMAIL_PATTERN.test(email)) issues.push(`Row ${line}: invalid public_email`);
      if (emailStatus !== "published_unverified") issues.push(`Row ${line}: public email must be published_unverified`);
      if (!validPublicUrl(emailSource)) issues.push(`Row ${line}: public email needs a source URL`);
      else if (!matchesCompanyWebsite(emailSource, website)) issues.push(`Row ${line}: email source URL must match the company website`);
      else {
        const publishedEmails = emailEvidence.get(normalizedUrl(emailSource));
        if (!publishedEmails?.has(email.toLowerCase())) {
          issues.push(`Row ${line}: public email does not appear in the saved source-page evidence`);
        }
      }
    } else if (emailStatus || emailSource) {
      issues.push(`Row ${line}: email status or source exists without an email`);
    }
  }
  return issues;
}

async function main() {
  const input = arg("--input");
  if (!input) throw new Error("Use --input=owners.csv.");
  const inputPath = resolve(input);
  const rows = parseCsv(await readFile(inputPath, "utf8"));
  if (rows.length < 2) throw new Error("Owners CSV has no result rows.");
  const issues = auditRows(rows, await loadEmailEvidence(inputPath));
  if (issues.length > 0) {
    process.stderr.write(`${issues.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Audit passed for ${rows.length - 1} owner rows.\n`);
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
