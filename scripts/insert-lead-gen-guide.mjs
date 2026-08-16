// One-off: insert claude-code-lead-gen-guide into content_items
import "dotenv/config";
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const envLocal = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
for (const line of envLocal.split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]+)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);

const slug = "claude-code-lead-gen-guide";
const title = "Run Your Entire Lead Gen and Outbound Motion with Claude Code";
const description =
  "Run the whole go-to-market motion from Claude Code: a context layer, a collapsed tool stack, lead sourcing, an enrichment waterfall, deterministic scoring and tiering, cold email with deliverability, an automated reply desk, signal-based outbound, and a weekly measurement loop.";

const existing = await sql`SELECT id FROM content_items WHERE slug = ${slug}`;
if (existing.length) {
  console.log("Already exists:", existing[0].id);
  process.exit(0);
}

const rows = await sql`
  INSERT INTO content_items
    (title, slug, description, category, topic, download_url, file_type, is_new, is_free, created_at, updated_at)
  VALUES
    (${title}, ${slug}, ${description}, 'playbook', 'lead-gen',
     ${"/portal/playbooks/" + slug}, 'html', true, true, NOW(), NOW())
  RETURNING id, slug
`;
console.log("Inserted:", rows[0]);
