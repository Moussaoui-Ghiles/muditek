// Batched send for one reactivation issue, reusing the app's sendIssue().
// DRY-RUN BY DEFAULT. Only sends real email when --send is passed.
//
//   npx tsx scripts/send-reactivation.mts <issueId>                 # dry run: shows recipients
//   npx tsx scripts/send-reactivation.mts <issueId> --send --max-batches 1   # CANARY: one batch of 100
//   npx tsx scripts/send-reactivation.mts <issueId> --send         # full segment, batches of 100
//
// Flags: --send  --max-batches N  --limit N(<=100)  --delay SECONDS(default 90)
import { loadEnv, BASE_URL } from "./_campaign-env.mts";
loadEnv();

const args = process.argv.slice(2);
const issueId = args.find((a) => !a.startsWith("--"));
const has = (f: string) => args.includes(f);
const val = (f: string, d: number) => {
  const i = args.indexOf(f);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : d;
};
if (!issueId) {
  console.error("Usage: npx tsx scripts/send-reactivation.mts <issueId> [--send] [--max-batches N] [--limit N] [--delay S]");
  process.exit(1);
}
const SEND = has("--send");
const limit = Math.max(1, Math.min(100, val("--limit", 100)));
const maxBatches = val("--max-batches", Infinity);
const delay = val("--delay", 90);

const { getDb } = await import("@/lib/db");
const { sendIssue, listActiveSubscribers } = await import("@/lib/newsletter");
const sql = getDb();

const rows = await sql`SELECT id, subject, slug, audience_filter, status, stats FROM newsletter_issues WHERE id = ${issueId} LIMIT 1`;
if (rows.length === 0) { console.error("Issue not found:", issueId); process.exit(1); }
const issue = rows[0];
const remaining = await listActiveSubscribers(issue.audience_filter, issueId);

console.log(`Issue:    ${issue.subject}  (${issue.slug})`);
console.log(`Audience: ${issue.audience_filter ?? "ALL"}   Status: ${issue.status}`);
console.log(`From:     ${process.env.NEWSLETTER_FROM || "Ghiles <resources@mail.ghiless.com>"}`);
console.log(`Pending recipients (active, not yet sent this issue): ${remaining.length}`);
console.log(`Plan: batches of ${limit}, ${maxBatches === Infinity ? "until done" : maxBatches + " batch(es) max"}, ${delay}s apart.`);

if (!SEND) {
  console.log(`\nDRY RUN. No email sent. First ${Math.min(limit, remaining.length)} recipients:`);
  for (const s of remaining.slice(0, Math.min(limit, 5))) console.log("  -", s.email);
  if (remaining.length > 5) console.log(`  ... and ${remaining.length - Math.min(limit, remaining.length)} more pending`);
  console.log("\nAdd --send to actually send. Add --max-batches 1 for a 100-recipient canary.");
  process.exit(0);
}

if (issue.status === "sent") { console.error("Issue already marked sent. Nothing to do."); process.exit(1); }

const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
let batch = 0, totalSent = 0, totalFailed = 0;
console.log(`\n*** LIVE SEND ***`);
while (batch < maxBatches) {
  const r = await sendIssue(issueId, BASE_URL, { limit });
  batch++; totalSent += r.sent; totalFailed += r.failed;
  console.log(`batch ${batch}: sent=${r.sent} failed=${r.failed} remaining=${r.remaining}  (cumulative sent=${totalSent} failed=${totalFailed})`);
  if (r.remaining === 0) { console.log("\nAll pending recipients sent. Issue marked 'sent'."); break; }
  if (batch >= maxBatches) { console.log(`\nStopped after ${batch} batch(es). ${r.remaining} still pending (resume by re-running).`); break; }
  await sleep(delay);
}
console.log(`Done. sent=${totalSent} failed=${totalFailed}`);
