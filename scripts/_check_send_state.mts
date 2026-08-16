import { loadEnv } from "./_load-env.mts";
loadEnv();
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const issueId = "4634edd2-0ce7-47d4-aefa-9ba3b747024e";

const totalSentRows = await sql`SELECT COUNT(*)::int AS n FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent'`;
const totalSentUnique = await sql`SELECT COUNT(DISTINCT email)::int AS n FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent'`;
const last24 = await sql`SELECT COUNT(*)::int AS n FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent' AND ts >= NOW() - INTERVAL '24 hours'`;
const last24Uniq = await sql`SELECT COUNT(DISTINCT email)::int AS n FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent' AND ts >= NOW() - INTERVAL '24 hours'`;
const daily = await sql`SELECT (ts AT TIME ZONE 'UTC')::date AS day, COUNT(*)::int AS rows, COUNT(DISTINCT email)::int AS uniq FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent' GROUP BY 1 ORDER BY 1 DESC LIMIT 10`;
const lastTs = await sql`SELECT MAX(ts) AS ts FROM newsletter_events WHERE issue_id = ${issueId} AND event = 'sent'`;
const hotTotal = await sql`SELECT COUNT(*)::int AS n FROM newsletter_subscribers WHERE status='active' AND segment='HOT'`;
const remaining = await sql`SELECT COUNT(*)::int AS n FROM newsletter_subscribers s WHERE s.status = 'active' AND s.segment = 'HOT' AND NOT EXISTS (SELECT 1 FROM newsletter_events e WHERE e.issue_id = ${issueId} AND e.event = 'sent' AND e.email = s.email)`;

console.log("now (UTC):", new Date().toISOString());
console.log("HOT subs total:", hotTotal[0].n);
console.log("E1 sent rows:", totalSentRows[0].n, "| unique emails:", totalSentUnique[0].n);
console.log("Remaining HOT not sent:", remaining[0].n);
console.log("Last 24h sent rows:", last24[0].n, "| unique:", last24Uniq[0].n);
console.log("Last 'sent' event:", lastTs[0].ts);
console.log("\nDaily (UTC) rows / unique:");
for (const r of daily) console.log(" ", r.day, "→ rows:", r.rows, "  unique:", r.uniq);
