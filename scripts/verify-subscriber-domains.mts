/**
 * Free list hygiene pass. No third-party service, no cost.
 *
 * Resolves MX (with A/AAAA fallback) for every unique domain in a segment and
 * flags addresses whose domain cannot receive mail at all. Dead domains are the
 * largest single source of hard bounces on a list that has aged.
 *
 * Also flags syntax failures, known disposable providers, and role accounts.
 * Role accounts are reported only, never suppressed automatically.
 *
 *   npx tsx scripts/verify-subscriber-domains.mts COLD           # report only
 *   npx tsx scripts/verify-subscriber-domains.mts COLD --apply   # suppress dead domains
 */
import fs from "node:fs";
import dns from "node:dns/promises";
import { neon } from "@neondatabase/serverless";

const env = fs.readFileSync(
  "/Users/ghilesmoussaoui/Desktop/BizOps/muditek/website/muditek-web/.env.local",
  "utf8",
);
const dbUrl = env.match(/^DATABASE_URL="?([^"\n]+)"?/m);
if (!dbUrl) throw new Error("DATABASE_URL not found");
const sql = neon(dbUrl[1]);

const segment = process.argv[2] ?? "COLD";
const apply = process.argv.includes("--apply");

const SYNTAX = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "throwawaymail.com", "yopmail.com", "trashmail.com", "getnada.com",
  "temp-mail.org", "sharklasers.com", "maildrop.cc", "dispostable.com",
]);
const ROLE = new Set([
  "info", "admin", "support", "sales", "contact", "hello", "office",
  "noreply", "no-reply", "postmaster", "webmaster", "billing", "help",
]);

type Row = { id: string; email: string };

const rows = (await sql`
  SELECT id, email FROM newsletter_subscribers
  WHERE status = 'active' AND segment = ${segment}
  ORDER BY email
`) as Row[];

const domains = [...new Set(rows.map((r) => r.email.split("@")[1] ?? ""))];
console.log(`${segment}: ${rows.length} addresses across ${domains.length} domains`);

const deliverable = new Map<string, boolean>();
const CONCURRENCY = 24;

const resolveDomain = async (domain: string): Promise<boolean> => {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0 && mx.some((m) => m.exchange && m.exchange !== ".")) return true;
  } catch {
    // fall through to address records
  }
  for (const fn of [dns.resolve4, dns.resolve6]) {
    try {
      const recs = await fn(domain);
      if (recs.length > 0) return true;
    } catch {
      // keep trying
    }
  }
  return false;
};

for (let i = 0; i < domains.length; i += CONCURRENCY) {
  const slice = domains.slice(i, i + CONCURRENCY);
  const results = await Promise.all(slice.map((d) => resolveDomain(d)));
  slice.forEach((d, idx) => deliverable.set(d, results[idx]));
  process.stdout.write(`\r  resolved ${Math.min(i + CONCURRENCY, domains.length)}/${domains.length}`);
}
process.stdout.write("\n");

const badSyntax: Row[] = [];
const deadDomain: Row[] = [];
const disposable: Row[] = [];
const roleAccount: Row[] = [];
const ok: Row[] = [];

for (const row of rows) {
  const email = row.email.trim().toLowerCase();
  const [local, domain] = email.split("@");
  if (!SYNTAX.test(email)) { badSyntax.push(row); continue; }
  if (DISPOSABLE.has(domain)) { disposable.push(row); continue; }
  if (!deliverable.get(domain)) { deadDomain.push(row); continue; }
  if (ROLE.has(local)) roleAccount.push(row);
  ok.push(row);
}

const deadDomains = domains.filter((d) => !deliverable.get(d));

console.log("");
console.log(`  bad syntax        ${badSyntax.length}`);
console.log(`  dead domain       ${deadDomain.length}  (${deadDomains.length} domains)`);
console.log(`  disposable        ${disposable.length}`);
console.log(`  deliverable       ${ok.length}   of which role accounts: ${roleAccount.length}`);
if (deadDomains.length > 0) {
  console.log(`  worst dead domains: ${deadDomains.slice(0, 15).join(", ")}`);
}

const suppress = [...badSyntax, ...deadDomain, ...disposable];
if (!apply) {
  console.log("");
  console.log(`Report only. Pass --apply to set status='invalid' on ${suppress.length} addresses.`);
} else if (suppress.length > 0) {
  const ids = suppress.map((r) => r.id);
  await sql`
    UPDATE newsletter_subscribers
    SET status = 'invalid'
    WHERE id = ANY(${ids}::uuid[])
  `;
  console.log("");
  console.log(`Applied: ${ids.length} addresses set to status='invalid'.`);
}
