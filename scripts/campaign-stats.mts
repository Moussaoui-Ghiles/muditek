// Read-only campaign monitoring. Counts events per reactivation issue.
//   npx tsx scripts/campaign-stats.mts            # all reactivation-* issues
//   npx tsx scripts/campaign-stats.mts <issueId>  # one issue
import { loadEnv } from "./_campaign-env.mts";
loadEnv();
const { getDb } = await import("@/lib/db");
const sql = getDb();

const arg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const issues = arg
  ? await sql`SELECT id, subject, slug, status, stats FROM newsletter_issues WHERE id = ${arg}`
  : await sql`SELECT id, subject, slug, status, stats FROM newsletter_issues WHERE slug LIKE 'reactivation-%' ORDER BY slug`;

if (issues.length === 0) { console.log("No matching issues."); process.exit(0); }

for (const it of issues) {
  const ev = await sql`
    SELECT event, COUNT(*)::int AS n, COUNT(DISTINCT subscriber_id)::int AS uniq
    FROM newsletter_events WHERE issue_id = ${it.id} GROUP BY event ORDER BY event
  `;
  const m: Record<string, { n: number; uniq: number }> = {};
  for (const r of ev) m[r.event] = { n: r.n, uniq: r.uniq };
  const sent = m.sent?.uniq ?? 0;
  const pct = (x: number) => (sent ? ((x / sent) * 100).toFixed(1) + "%" : "-");
  console.log(`\n=== ${it.subject}  (${it.slug}) [${it.status}] ===`);
  console.log(`  sent:        ${sent}`);
  console.log(`  delivered:   ${m.delivered?.n ?? 0}   (${pct(m.delivered?.n ?? 0)})`);
  console.log(`  opened:      ${m.opened?.uniq ?? 0} unique   (${pct(m.opened?.uniq ?? 0)} open rate)`);
  console.log(`  clicked:     ${m.clicked?.uniq ?? 0} unique   (${pct(m.clicked?.uniq ?? 0)})`);
  console.log(`  bounced:     ${m.bounced?.n ?? 0}   (${pct(m.bounced?.n ?? 0)})`);
  console.log(`  complained:  ${m.complained?.n ?? 0}   (${pct(m.complained?.n ?? 0)})`);
  console.log(`  unsubscribed:${m.unsubscribed?.n ?? 0}   (${pct(m.unsubscribed?.n ?? 0)})`);
  const otherKeys = Object.keys(m).filter((k) => !["sent","delivered","opened","clicked","bounced","complained","unsubscribed"].includes(k));
  for (const k of otherKeys) console.log(`  ${k}: ${m[k].n}`);
  const bounceRate = sent ? (m.bounced?.n ?? 0) / sent : 0;
  if (bounceRate > 0.03) console.log(`  ⚠ BOUNCE RATE ${(bounceRate*100).toFixed(1)}% > 3% — HALT, do not continue.`);
  if ((m.complained?.n ?? 0) > 0) console.log(`  ⚠ ${m.complained?.n} spam complaint(s) — review before continuing.`);
}
console.log("");
