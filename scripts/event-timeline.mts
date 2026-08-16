import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";

const sql = getDb();

const range = await sql`
  SELECT event, MIN(ts) AS first_ts, MAX(ts) AS last_ts, COUNT(*)::int AS n
  FROM newsletter_events
  GROUP BY event
  ORDER BY first_ts
`;
console.log("Event time ranges:");
for (const r of range) console.log(`  ${r.event}: first=${r.first_ts.toISOString()} last=${r.last_ts.toISOString()} n=${r.n}`);

const lastSent = await sql`
  SELECT ts, email FROM newsletter_events
  WHERE event = 'sent'
  ORDER BY ts DESC LIMIT 5
`;
console.log("\nMost recent sent events:");
for (const r of lastSent) console.log(`  ${r.ts.toISOString()} → ${r.email}`);

process.exit(0);
