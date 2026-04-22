import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const { rows } = body as { rows: { name: string; email: string }[] };

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided" }, { status: 400 });
  }

  const sql = getDb();

  // Create a migration campaign if it doesn't exist
  const campaigns = await sql`
    SELECT id FROM campaigns WHERE title = 'csv-import'
  `;

  let campaignId: string;

  if (campaigns.length > 0) {
    campaignId = campaigns[0].id;
  } else {
    const result = await sql`
      INSERT INTO campaigns (title, post_url, resource_url, keyword, is_active, ttl_days)
      VALUES ('csv-import', 'https://import', 'https://import', 'import', false, 9999)
      RETURNING id
    `;
    campaignId = result[0].id;
  }

  let imported = 0;
  let skipped = 0;
  const seenEmails = new Set<string>();

  for (const row of rows) {
    const email = row.email?.trim()?.toLowerCase();
    const name = row.name?.trim();

    if (!email || !email.includes("@") || seenEmails.has(email)) {
      skipped++;
      continue;
    }

    seenEmails.add(email);

    try {
      const result = await sql`
        INSERT INTO submissions (campaign_id, name, email, verified, delivered)
        VALUES (${campaignId}, ${name || "Subscriber"}, ${email}, true, true)
        ON CONFLICT (campaign_id, email) DO NOTHING
        RETURNING id
      `;

      if (result.length === 0) {
        skipped++;
        continue;
      }

      imported++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ imported, skipped, total: rows.length });
}
