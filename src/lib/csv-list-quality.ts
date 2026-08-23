export type CsvListIssueCode =
  | "duplicate"
  | "missing_title"
  | "invalid_domain"
  | "unverified"
  | "missing_icp"
  | "rejected_icp";

export interface CsvListQualityAudit {
  rowCount: number;
  duplicateRows: number;
  missingTitles: number;
  invalidDomains: number;
  unverifiedRows: number;
  missingIcpChecks: number;
  rejectedByIcp: number;
  passed: boolean;
  issues: Array<{ rowNumber: number; code: CsvListIssueCode }>;
}

export type CsvListQualityResult =
  | CsvListQualityAudit
  | { error: "The CSV needs email, title, domain, verification, and ICP columns." };

const HEADER_ALIASES = {
  email: ["email", "email_address", "work_email"],
  title: ["title", "job_title", "position", "role"],
  domain: ["domain", "company_domain", "company_website", "website"],
  verification: ["verification", "verification_status", "email_status", "email_verification"],
  icp: ["icp", "icp_fit", "icp_qualified", "icp_status", "qualified"],
} as const;

const VERIFIED_VALUES = new Set(["verified", "valid", "deliverable"]);
const ICP_ACCEPTED_VALUES = new Set(["yes", "true", "fit", "qualified", "strong", "match"]);
const ICP_REJECTED_VALUES = new Set(["no", "false", "not_fit", "unqualified", "weak", "reject", "rejected", "disqualified"]);

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeValue(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const next = csv[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += character;
  }

  row.push(field);
  if (row.some((value) => value.trim().length > 0)) rows.push(row);
  return rows;
}

function findColumn(headers: string[], aliases: readonly string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function isValidDomain(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    const hostname = url.hostname.toLowerCase();
    return hostname.includes(".") && !hostname.startsWith(".") && !hostname.endsWith(".");
  } catch {
    return false;
  }
}

export function auditCsvList(csv: string): CsvListQualityResult {
  const rows = parseCsv(csv);
  const headers = (rows[0] ?? []).map(normalizeHeader);
  const columns = {
    email: findColumn(headers, HEADER_ALIASES.email),
    title: findColumn(headers, HEADER_ALIASES.title),
    domain: findColumn(headers, HEADER_ALIASES.domain),
    verification: findColumn(headers, HEADER_ALIASES.verification),
    icp: findColumn(headers, HEADER_ALIASES.icp),
  };

  if (Object.values(columns).some((index) => index === -1)) {
    return { error: "The CSV needs email, title, domain, verification, and ICP columns." };
  }

  const records = rows.slice(1);
  const seenEmails = new Set<string>();
  const issues: CsvListQualityAudit["issues"] = [];
  let duplicateRows = 0;
  let missingTitles = 0;
  let invalidDomains = 0;
  let unverifiedRows = 0;
  let missingIcpChecks = 0;
  let rejectedByIcp = 0;

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    const email = (record[columns.email] ?? "").trim().toLowerCase();
    const title = (record[columns.title] ?? "").trim();
    const domain = record[columns.domain] ?? "";
    const verification = normalizeValue(record[columns.verification] ?? "");
    const icp = normalizeValue(record[columns.icp] ?? "");

    if (email && seenEmails.has(email)) {
      duplicateRows += 1;
      issues.push({ rowNumber, code: "duplicate" });
    } else if (email) {
      seenEmails.add(email);
    }

    if (!title) {
      missingTitles += 1;
      issues.push({ rowNumber, code: "missing_title" });
    }

    if (!isValidDomain(domain)) {
      invalidDomains += 1;
      issues.push({ rowNumber, code: "invalid_domain" });
    }

    if (!VERIFIED_VALUES.has(verification)) {
      unverifiedRows += 1;
      issues.push({ rowNumber, code: "unverified" });
    }

    if (ICP_REJECTED_VALUES.has(icp)) {
      rejectedByIcp += 1;
      issues.push({ rowNumber, code: "rejected_icp" });
    } else if (!ICP_ACCEPTED_VALUES.has(icp)) {
      missingIcpChecks += 1;
      issues.push({ rowNumber, code: "missing_icp" });
    }
  }

  return {
    rowCount: records.length,
    duplicateRows,
    missingTitles,
    invalidDomains,
    unverifiedRows,
    missingIcpChecks,
    rejectedByIcp,
    passed: issues.length === 0,
    issues,
  };
}
