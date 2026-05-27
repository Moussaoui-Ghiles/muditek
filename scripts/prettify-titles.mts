import { loadEnv } from "./_load-env.mts";
loadEnv();
import { getDb } from "../src/lib/db";

const sql = getDb();

function prettifyTitle(t: string | null | undefined): string | null {
  if (!t) return null;
  const trimmed = t.trim();
  if (!trimmed) return null;
  // expand underscores → spaces (kebab dashes preserved)
  const noUnderscore = trimmed.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
  // titlecase if all lowercase blob (covers kebab-case)
  const allLower = noUnderscore === noUnderscore.toLowerCase();
  if (allLower) {
    return noUnderscore.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return noUnderscore;
}

const apply = process.argv.includes("--apply");
const rows = (await sql`SELECT id, display_title FROM workflows WHERE display_title IS NOT NULL`) as Array<{ id: string; display_title: string }>;
let changed = 0;
let preview = 0;
for (const r of rows) {
  const better = prettifyTitle(r.display_title);
  if (better && better !== r.display_title) {
    if (apply) {
      await sql`UPDATE workflows SET display_title = ${better} WHERE id = ${r.id}`;
    } else if (preview < 12) {
      console.log(`  "${r.display_title}" -> "${better}"`);
      preview++;
    }
    changed++;
  }
}
console.log(`\n${apply ? "updated" : "would update"} ${changed} of ${rows.length}`);
process.exit(0);
