// One-off: insert local-ai-build-guide into content_items
import "dotenv/config";
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const envLocal = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
for (const line of envLocal.split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]+)"?$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);

const slug = "local-ai-build-guide";
const title = "The Local AI Build Guide";
const description = "Run open-weight models on hardware you control: which model to pick, what machine you need, which inference engine to run, the quantization that fits, how to benchmark it, and the command to start.";

const existing = await sql`SELECT id FROM content_items WHERE slug = ${slug}`;
if (existing.length) {
  console.log("Already exists:", existing[0].id);
  process.exit(0);
}

const rows = await sql`
  INSERT INTO content_items
    (title, slug, description, category, topic, download_url, file_type, is_new, is_free, created_at, updated_at)
  VALUES
    (${title}, ${slug}, ${description}, 'playbook', 'local-ai',
     ${'/portal/playbooks/' + slug}, 'html', true, true, NOW(), NOW())
  RETURNING id, slug
`;
console.log("Inserted:", rows[0]);
