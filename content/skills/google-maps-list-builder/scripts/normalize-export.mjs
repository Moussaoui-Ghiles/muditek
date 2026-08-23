import { readFileSync, writeFileSync } from "node:fs";

function arg(name) {
  const value = process.argv.find((item) => item.startsWith(`${name}=`));
  return value ? value.slice(name.length + 1) : "";
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1; } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(field); field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); if (row.some((value) => value.trim())) rows.push(row); row = []; field = "";
    } else field += c;
  }
  row.push(field); if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function host(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try { return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`).hostname.replace(/^www\./, "").toLowerCase(); }
  catch { return ""; }
}

const input = arg("--input");
const output = arg("--output") || "companies.csv";
if (!input) throw new Error("Use --input=raw.csv and optionally --output=companies.csv");
const rows = parseCsv(readFileSync(input, "utf8"));
const headers = (rows.shift() ?? []).map((value) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"));
const get = (row, ...names) => row[headers.findIndex((header) => names.includes(header))] ?? "";
const seen = new Set();
const normalized = [];

for (const row of rows) {
  const placeId = get(row, "place_id", "google_place_id").trim();
  const website = get(row, "website", "url").trim();
  const domain = host(get(row, "company_domain", "domain") || website);
  const address = get(row, "address", "full_address").trim();
  const key = placeId ? `place:${placeId}` : `site:${domain}|${address.toLowerCase()}`;
  if (seen.has(key)) continue;
  seen.add(key);
  normalized.push([
    placeId,
    get(row, "company_name", "name", "title").trim(),
    domain,
    website,
    get(row, "category", "type").trim(),
    address,
    get(row, "city").trim(),
    get(row, "region", "state").trim(),
    get(row, "country").trim(),
    get(row, "phone").trim(),
    get(row, "source_url", "maps_url").trim(),
    get(row, "observed_at", "source_date").trim(),
    "",
    "",
  ]);
}

const outputHeaders = ["place_id", "company_name", "company_domain", "website", "category", "address", "city", "region", "country", "phone", "source_url", "observed_at", "fit_status", "fit_reason"];
writeFileSync(output, [outputHeaders, ...normalized].map((row) => row.map(csv).join(",")).join("\n") + "\n");
console.log(JSON.stringify({ rawRows: rows.length, normalizedRows: normalized.length, duplicatesRemoved: rows.length - normalized.length, output }));
