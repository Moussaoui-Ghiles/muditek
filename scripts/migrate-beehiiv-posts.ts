// Migrate past beehiiv posts into newsletter_issues.
//
// Usage:
//   cd muditek-web
//   BEEHIIV_API_KEY=... BEEHIIV_PUBLICATION_ID=... DATABASE_URL=... npx tsx scripts/migrate-beehiiv-posts.ts
//
// Idempotent: uses slug UNIQUE constraint. Re-runs skip existing rows.

import { neon } from "@neondatabase/serverless";

const API_KEY = process.env.BEEHIIV_API_KEY;
const PUB_ID = process.env.BEEHIIV_PUBLICATION_ID;
const DB_URL = process.env.DATABASE_URL;

if (!API_KEY || !PUB_ID || !DB_URL) {
  console.error("Missing BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID, or DATABASE_URL");
  process.exit(1);
}

interface BeehiivPost {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  status: string;
  publish_date: number | null;
  created: number;
  content?: {
    free?: { web?: string; email?: string };
    premium?: { web?: string; email?: string };
  };
}

async function fetchAll(): Promise<BeehiivPost[]> {
  const out: BeehiivPost[] = [];
  let page = 1;
  while (true) {
    const url = new URL(`https://api.beehiiv.com/v2/publications/${PUB_ID}/posts`);
    url.searchParams.set("expand[]", "free_web_content");
    url.searchParams.set("status", "confirmed");
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("order_by", "publish_date");
    url.searchParams.set("direction", "asc");

    const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
    if (!res.ok) {
      throw new Error(`beehiiv ${res.status}: ${await res.text()}`);
    }
    const body = await res.json();
    const rows: BeehiivPost[] = body.data ?? [];
    out.push(...rows);
    const totalPages: number = body?.total_pages ?? 1;
    if (page >= totalPages) break;
    page++;
  }
  return out;
}

async function main() {
  const sql = neon(DB_URL!);
  const posts = await fetchAll();
  console.log(`Fetched ${posts.length} posts from beehiiv.`);

  let inserted = 0;
  let skipped = 0;

  for (const p of posts) {
    const html = p.content?.free?.web ?? p.content?.free?.email ?? null;
    const sentAt = p.publish_date ? new Date(p.publish_date * 1000) : new Date(p.created * 1000);

    const result = await sql`
      INSERT INTO newsletter_issues (subject, slug, html, status, sent_at, stats)
      VALUES (
        ${p.title},
        ${p.slug},
        ${html},
        'sent',
        ${sentAt.toISOString()},
        ${JSON.stringify({ source: "beehiiv", beehiiv_id: p.id, preview: p.subtitle })}::jsonb
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `;

    if (result.length > 0) {
      inserted++;
      console.log(`  + ${p.slug}`);
    } else {
      skipped++;
    }
  }

  console.log(`\nDone. inserted=${inserted} skipped=${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
