import { readFileSync, writeFileSync } from "node:fs";

const value = (name) => process.argv.find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
const input = value("--input");
const output = value("--output") || "scorecard.json";
if (!input) throw new Error("Use --input=leads.csv and optionally --output=scorecard.json");

function parse(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i += 1; } else quoted = !quoted; }
    else if (c === "," && !quoted) { row.push(field); field = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) { if (c === "\r" && text[i + 1] === "\n") i += 1; row.push(field); if (row.some((v) => v.trim())) rows.push(row); row = []; field = ""; }
    else field += c;
  }
  row.push(field); if (row.some((v) => v.trim())) rows.push(row); return rows;
}

const rows = parse(readFileSync(input, "utf8"));
const headers = (rows.shift() ?? []).map((v) => v.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"));
const aliases = { email: ["email", "email_address"], title: ["title", "job_title"], domain: ["domain", "company_domain", "website"], verification: ["verification", "verification_status", "email_status"], icp: ["icp", "icp_fit", "icp_qualified"] };
const columns = Object.fromEntries(Object.entries(aliases).map(([key, names]) => [key, headers.findIndex((header) => names.includes(header))]));
if (Object.values(columns).some((index) => index < 0)) throw new Error("CSV needs email, title, domain, verification, and ICP columns");
const seen = new Set();
const counts = { rows: rows.length, duplicates: 0, missingTitles: 0, invalidDomains: 0, unverified: 0, missingIcp: 0, rejectedIcp: 0 };
const flaggedRows = [];
const verified = new Set(["verified", "valid", "deliverable"]);
const accepted = new Set(["yes", "true", "fit", "qualified", "match"]);
const rejected = new Set(["no", "false", "not_fit", "unqualified", "rejected", "disqualified"]);
const norm = (v) => String(v ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
const domainOk = (v) => { try { const host = new URL(/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`).hostname; return host.includes("."); } catch { return false; } };

rows.forEach((row, index) => {
  const line = index + 2;
  const email = norm(row[columns.email]);
  const title = String(row[columns.title] ?? "").trim();
  const verification = norm(row[columns.verification]);
  const icp = norm(row[columns.icp]);
  const issues = [];
  if (email && seen.has(email)) { counts.duplicates += 1; issues.push("duplicate"); } else if (email) seen.add(email);
  if (!title) { counts.missingTitles += 1; issues.push("missing_title"); }
  if (!domainOk(String(row[columns.domain] ?? ""))) { counts.invalidDomains += 1; issues.push("invalid_domain"); }
  if (!verified.has(verification)) { counts.unverified += 1; issues.push("unverified"); }
  if (rejected.has(icp)) { counts.rejectedIcp += 1; issues.push("rejected_icp"); }
  else if (!accepted.has(icp)) { counts.missingIcp += 1; issues.push("missing_icp"); }
  if (issues.length) flaggedRows.push({ row: line, issues });
});

writeFileSync(output, JSON.stringify({ counts, flaggedRows }, null, 2) + "\n");
console.log(JSON.stringify({ output, ...counts }));
