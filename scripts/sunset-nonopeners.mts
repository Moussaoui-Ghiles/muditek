// Post-campaign sunset: HOT subscribers who were SENT any reactivation issue
// but never OPENED any of them get status='dormant' (reversible; excluded from
// future active sends). Honors the promise in Email 3.
//   npx tsx scripts/sunset-nonopeners.mts          # DRY RUN: counts only
//   npx tsx scripts/sunset-nonopeners.mts --apply  # set status='dormant'
import { loadEnv } from "./_campaign-env.mts";
loadEnv();
const { getDb } = await import("@/lib/db");
const sql = getDb();
const APPLY = process.argv.includes("--apply");

const issueRows = await sql`SELECT id FROM newsletter_issues WHERE slug LIKE 'reactivation-%'`;
const ids = issueRows.map((r: { id: string }) => r.id);
if (ids.length === 0) { console.log("No reactivation issues found."); process.exit(0); }

// Sent at least one reactivation issue, opened none of them, still active, HOT.
const targets = await sql`
  SELECT s.id, s.email
  FROM newsletter_subscribers s
  WHERE s.status = 'active' AND s.segment = 'HOT'
    AND EXISTS (
      SELECT 1 FROM newsletter_events e
      WHERE e.subscriber_id = s.id AND e.event = 'sent' AND e.issue_id = ANY(${ids})
    )
    AND NOT EXISTS (
      SELECT 1 FROM newsletter_events e
      WHERE e.subscriber_id = s.id AND e.event = 'opened' AND e.issue_id = ANY(${ids})
    )
`;

console.log(`Reactivation issues: ${ids.length}`);
console.log(`HOT, sent >=1 issue, opened none, still active: ${targets.length}`);

if (!APPLY) {
  console.log("\nDRY RUN. Nothing changed. Re-run with --apply to set these to status='dormant'.");
  process.exit(0);
}

const ids2 = targets.map((t: { id: string }) => t.id);
const res = await sql`
  UPDATE newsletter_subscribers SET status = 'dormant'
  WHERE id = ANY(${ids2}) AND status = 'active'
  RETURNING id
`;
console.log(`\nApplied. ${res.length} subscribers set to status='dormant'.`);
