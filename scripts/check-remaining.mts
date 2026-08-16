import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";

const sql = getDb();

const issues = await sql`
  SELECT id, subject, status, audience_filter
  FROM newsletter_issues
  WHERE subject IN ('i put it all in one place', 'hey, here''s what''s actually inside', 'should i keep sending you these?')
  ORDER BY created_at
`;
console.log("Reactivation issues:");
for (const r of issues) console.log(`  ${r.id}  status=${r.status}  filter=${r.audience_filter}  "${r.subject}"`);

for (const issue of issues) {
  const counts = await sql`
    SELECT event, COUNT(*)::int AS n FROM newsletter_events
    WHERE issue_id = ${issue.id} GROUP BY event ORDER BY event
  `;
  console.log(`\n[${issue.subject}]`);
  for (const c of counts) console.log(`  ${c.event}: ${c.n}`);
}

const hotActive = await sql`
  SELECT COUNT(*)::int AS n FROM newsletter_subscribers
  WHERE status = 'active' AND segment = 'HOT'
`;
console.log(`\nHOT active subscribers: ${hotActive[0].n}`);

const email1Id = issues.find((i: any) => i.subject === "i put it all in one place")?.id;
if (email1Id) {
  const sentForE1 = await sql`
    SELECT COUNT(DISTINCT email)::int AS n FROM newsletter_events
    WHERE issue_id = ${email1Id} AND event = 'sent'
  `;
  console.log(`Unique recipients sent for Email 1: ${sentForE1[0].n}`);

  const remaining = await sql`
    SELECT COUNT(*)::int AS n FROM newsletter_subscribers s
    WHERE s.status = 'active' AND s.segment = 'HOT'
    AND NOT EXISTS (
      SELECT 1 FROM newsletter_events e
      WHERE e.issue_id = ${email1Id} AND e.event = 'sent' AND LOWER(e.email) = LOWER(s.email)
    )
  `;
  console.log(`HOT active still to send Email 1: ${remaining[0].n}`);
}

process.exit(0);
