// Renders the 3 reactivation emails EXACTLY as recipients will see them
// (wrapIssueHtml + email styling) to local HTML files for visual review.
// Read-only, writes only to scripts/preview/. Never sends.
//   npx tsx scripts/preview-reactivation.mts
import { loadEnv, BASE_URL } from "./_campaign-env.mts";
import { mkdirSync, writeFileSync } from "fs";
loadEnv();
const { getDb } = await import("@/lib/db");
const { wrapIssueHtml } = await import("@/lib/newsletter");
const sql = getDb();

const issues = await sql`SELECT slug, subject, html FROM newsletter_issues WHERE slug LIKE 'reactivation-%' ORDER BY slug`;
mkdirSync("scripts/preview", { recursive: true });

const demoUnsub = `${BASE_URL}/api/newsletter/unsubscribe/PREVIEW-TOKEN`;
const demoPrefs = `${BASE_URL}/preferences/PREVIEW-TOKEN`;

for (const it of issues) {
  const wrapped = wrapIssueHtml(it.html ?? "", { unsubUrl: demoUnsub, prefsUrl: demoPrefs });
  const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${it.subject}</title></head><body style="margin:0;background:#f4f4f5;"><div style="max-width:480px;margin:0 auto;"><div style="padding:8px 12px;font:12px -apple-system,sans-serif;color:#666;">Subject: <b>${it.subject}</b></div>${wrapped}</div></body></html>`;
  const path = `scripts/preview/${it.slug}.html`;
  writeFileSync(path, page);
  console.log("wrote", path);
}
console.log("\nOpen these in a browser to see exactly what recipients get.");
