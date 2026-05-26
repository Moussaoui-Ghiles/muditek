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
    WITH resource_unlocks AS (
      SELECT
        rl.id,
        'resource'::text AS source_type,
        COALESCE(rl.name, split_part(rl.email, '@', 1)) AS name,
        lower(rl.email) AS email,
        rl.created_at,
        rl.last_seen_at,
        rl.resource_slug,
        ci.title AS resource_title,
        ci.category AS resource_category,
        COALESCE(ci.title, rl.resource_slug) AS source_label,
        ns.status AS newsletter_status,
        ns.segment AS newsletter_segment,
        EXISTS (
          SELECT 1 FROM portal_memberships pm
          WHERE lower(pm.email) = lower(rl.email) AND pm.status = 'active'
        ) AS has_portal_account
      FROM resource_leads rl
      LEFT JOIN content_items ci ON ci.slug = rl.resource_slug
      LEFT JOIN newsletter_subscribers ns ON lower(ns.email) = lower(rl.email)
    ),
    portal_signups AS (
      SELECT
        ns.id,
        'portal'::text AS source_type,
        split_part(ns.email, '@', 1) AS name,
        lower(ns.email) AS email,
        ns.subscribed_at AS created_at,
        NULL::timestamp AS last_seen_at,
        NULL::text AS resource_slug,
        NULL::text AS resource_title,
        NULL::text AS resource_category,
        'Portal signup'::text AS source_label,
        ns.status AS newsletter_status,
        ns.segment AS newsletter_segment,
        EXISTS (
          SELECT 1 FROM portal_memberships pm
          WHERE lower(pm.email) = lower(ns.email) AND pm.status = 'active'
        ) AS has_portal_account
      FROM newsletter_subscribers ns
      WHERE ns.status = 'active'
        AND ns.source IN ('portal', 'portal-signup', 'sign-up')
    )
    SELECT * FROM resource_unlocks
    UNION ALL
    SELECT * FROM portal_signups
    ORDER BY created_at DESC
    LIMIT 500
  `;

  return NextResponse.json({ leads });
}
