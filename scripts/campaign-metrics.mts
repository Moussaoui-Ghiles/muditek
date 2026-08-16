import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";

const sql = getDb();

const totals = await sql`
  SELECT event, COUNT(DISTINCT COALESCE(resend_email_id, event_id, id::text))::int AS n
  FROM newsletter_events GROUP BY 1 ORDER BY 2 DESC
`;
console.log("ALL events ever:");
for (const r of totals) console.log(`  ${r.event}: ${r.n}`);

const last24 = await sql`
  SELECT event, COUNT(DISTINCT COALESCE(resend_email_id, event_id, id::text))::int AS n
  FROM newsletter_events WHERE ts > NOW() - INTERVAL '24 hours' GROUP BY 1 ORDER BY 2 DESC
`;
console.log("\nLast 24h:");
for (const r of last24) console.log(`  ${r.event}: ${r.n}`);

const last7 = await sql`
  SELECT event, COUNT(DISTINCT COALESCE(resend_email_id, event_id, id::text))::int AS n
  FROM newsletter_events WHERE ts > NOW() - INTERVAL '7 days' GROUP BY 1 ORDER BY 2 DESC
`;
console.log("\nLast 7d:");
for (const r of last7) console.log(`  ${r.event}: ${r.n}`);

const byIssue = await sql`
  SELECT i.subject, e.event,
    COUNT(DISTINCT COALESCE(e.resend_email_id, e.event_id, e.id::text))::int AS n
  FROM newsletter_events e
  LEFT JOIN newsletter_issues i ON i.id = e.issue_id
  WHERE e.ts > NOW() - INTERVAL '7 days'
  GROUP BY i.subject, e.event
  ORDER BY i.subject, e.event
`;
console.log("\nLast 7d by issue:");
for (const r of byIssue) console.log(`  [${r.subject ?? "(no issue)"}] ${r.event}: ${r.n}`);

process.exit(0);
