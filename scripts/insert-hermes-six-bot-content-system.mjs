// One-off: upsert the Hermes six-bot content system into content_items.
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const envLocal = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
for (const line of envLocal.split("\n")) {
  const match = line.match(/^([A-Z_]+)="?([^"]+)"?$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");

const sql = neon(process.env.DATABASE_URL);
const slug = "hermes-six-bot-content-system";
const title = "How to Build a Six-Bot Content System With Hermes";
const description =
  "Build six specialist Hermes bots that find relevant ideas, verify research, choose an angle, create the main piece, rebuild it for each platform, and improve the next run.";

const rows = await sql`
  INSERT INTO content_items
    (title, slug, description, category, topic, download_url, file_type, is_new, is_free, created_at, updated_at)
  VALUES
    (${title}, ${slug}, ${description}, 'playbook', 'agentic-engineering',
     ${"/portal/playbooks/" + slug}, 'html', true, true, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    topic = EXCLUDED.topic,
    download_url = EXCLUDED.download_url,
    file_type = EXCLUDED.file_type,
    is_new = EXCLUDED.is_new,
    is_free = EXCLUDED.is_free,
    updated_at = NOW()
  RETURNING id, slug, title, file_type, updated_at
`;

console.log("Upserted:", rows[0]);
