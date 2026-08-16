import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";
const sql = getDb();
const ID = "ad3ab3a6-6f92-493d-a9ba-b947a2649850";

const rows = await sql`SELECT ts, event, event_id FROM newsletter_events WHERE resend_email_id = ${ID} ORDER BY ts`;
console.log(`Events for ${ID}:`);
for (const r of rows) console.log(`  ${r.ts.toISOString()}  ${r.event}  event_id=${r.event_id}`);
console.log(`Total: ${rows.length}`);

const totals = await sql`SELECT event, COUNT(*)::int AS n FROM newsletter_events GROUP BY 1 ORDER BY 2 DESC`;
console.log("\nALL events ever:");
for (const r of totals) console.log(`  ${r.event}: ${r.n}`);

process.exit(0);
