// Backfill stats.tldr on existing newsletter_issues by parsing first <p> from html.
//
// Usage:
//   cd muditek-web
//   DATABASE_URL=... npx tsx scripts/backfill-tldrs.ts

import { neon } from "@neondatabase/serverless";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

function extractTldr(html: string | null): string | null {
  if (!html) return null;
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  for (const m of matches) {
    const text = m[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    if (text.length < 60) continue;
    if (/[{}]/.test(text)) continue;
    if (/^Ghiles Moussaoui\b/i.test(text)) continue;
    if (/^(hey|hi|hello)[,!\s]/i.test(text)) continue;
    return text.length > 220 ? text.slice(0, 217).trimEnd() + "…" : text;
  }
  return null;
}

async function main() {
  const sql = neon(DB_URL!);
  const rows = (await sql`
    SELECT id, slug, html, stats
    FROM newsletter_issues
    WHERE status = 'sent'
  `) as { id: string; slug: string; html: string | null; stats: Record<string, unknown> | null }[];

  let updated = 0;
  let skipped = 0;

  for (const r of rows) {
    const tldr = extractTldr(r.html);
    if (!tldr) {
      skipped++;
      continue;
    }
    const merged = { ...(r.stats || {}), tldr };
    await sql`
      UPDATE newsletter_issues
      SET stats = ${JSON.stringify(merged)}::jsonb,
          updated_at = NOW()
      WHERE id = ${r.id}
    `;
    updated++;
    console.log(`  + ${r.slug}: ${tldr.slice(0, 80)}…`);
  }

  console.log(`\nDone. updated=${updated} skipped=${skipped} total=${rows.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
