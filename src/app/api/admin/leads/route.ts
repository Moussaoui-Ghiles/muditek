import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  await ensureResourceLeadSchema(sql);
  await ensureContentItemsSchema(sql);

  const leads = await sql`
    WITH campaign_leads AS (
      SELECT
        s.id,
        'campaign'::text AS source_type,
        s.name,
        lower(s.email) AS email,
        s.comment,
        s.verified,
        s.delivered,
        s.created_at,
        s.campaign_id,
        c.title AS campaign_title,
        c.keyword AS campaign_keyword,
        c.is_active AS campaign_active,
        NULL::text AS resource_slug,
        NULL::text AS resource_title,
        COALESCE(c.title, 'Campaign') AS source_label,
        (SELECT MAX(step) FROM sequence_sends ss WHERE lower(ss.email) = lower(s.email)) AS nurture_step,
        EXISTS (
          SELECT 1 FROM subscribers sub
          WHERE lower(sub.email) = lower(s.email) AND sub.status = 'active'
        ) AS is_subscriber
      FROM submissions s
      LEFT JOIN campaigns c ON c.id = s.campaign_id
    ),
    resource_unlocks AS (
      SELECT
        rl.id,
        'resource'::text AS source_type,
        COALESCE(rl.name, split_part(rl.email, '@', 1)) AS name,
        lower(rl.email) AS email,
        NULL::text AS comment,
        true AS verified,
        true AS delivered,
        rl.created_at,
        NULL::uuid AS campaign_id,
        NULL::text AS campaign_title,
        NULL::text AS campaign_keyword,
        NULL::boolean AS campaign_active,
        rl.resource_slug,
        ci.title AS resource_title,
        COALESCE(ci.title, rl.resource_slug) AS source_label,
        (SELECT MAX(step) FROM sequence_sends ss WHERE lower(ss.email) = lower(rl.email)) AS nurture_step,
        EXISTS (
          SELECT 1 FROM subscribers sub
          WHERE lower(sub.email) = lower(rl.email) AND sub.status = 'active'
        ) AS is_subscriber
      FROM resource_leads rl
      LEFT JOIN content_items ci ON ci.slug = rl.resource_slug
    )
    SELECT * FROM campaign_leads
    UNION ALL
    SELECT * FROM resource_unlocks
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const campaigns = await sql`
    SELECT id, title FROM campaigns ORDER BY created_at DESC
  `;

  return NextResponse.json({ leads, campaigns });
}
