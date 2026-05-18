import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureContentItemsSchema } from "@/lib/content-items-schema";
import { ensureResourceLeadSchema } from "@/lib/resource-leads";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  await ensureResourceLeadSchema(sql);
  await ensureContentItemsSchema(sql);

  const submissions = await sql`
    SELECT
      'campaign'::text AS source_type,
      s.*,
      c.title AS campaign_title,
      c.keyword AS campaign_keyword,
      c.post_url AS campaign_post_url,
      c.resource_url AS campaign_resource_url,
      NULL::text AS resource_slug,
      NULL::text AS resource_title,
      NULL::text AS resource_category,
      NULL::text AS resource_source,
      NULL::timestamp AS last_seen_at
    FROM submissions s
    LEFT JOIN campaigns c ON c.id = s.campaign_id
    WHERE s.id = ${id}
  `;

  let lead = submissions[0];

  if (!lead) {
    const resourceLeads = await sql`
      SELECT
        'resource'::text AS source_type,
        rl.id,
        COALESCE(rl.name, split_part(rl.email, '@', 1)) AS name,
        lower(rl.email) AS email,
        NULL::text AS comment,
        true AS verified,
        true AS delivered,
        rl.created_at,
        NULL::uuid AS campaign_id,
        NULL::text AS campaign_title,
        NULL::text AS campaign_keyword,
        NULL::text AS campaign_post_url,
        NULL::text AS campaign_resource_url,
        rl.resource_slug,
        ci.title AS resource_title,
        ci.category AS resource_category,
        rl.source AS resource_source,
        rl.last_seen_at
      FROM resource_leads rl
      LEFT JOIN content_items ci ON ci.slug = rl.resource_slug
      WHERE rl.id = ${id}
      LIMIT 1
    `;

    lead = resourceLeads[0];
  }

  if (!lead) {
    const portalLeads = await sql`
      SELECT
        'portal'::text AS source_type,
        ns.id,
        split_part(ns.email, '@', 1) AS name,
        lower(ns.email) AS email,
        NULL::text AS comment,
        true AS verified,
        true AS delivered,
        ns.subscribed_at AS created_at,
        NULL::uuid AS campaign_id,
        NULL::text AS campaign_title,
        NULL::text AS campaign_keyword,
        NULL::text AS campaign_post_url,
        NULL::text AS campaign_resource_url,
        NULL::text AS resource_slug,
        NULL::text AS resource_title,
        NULL::text AS resource_category,
        ns.source AS resource_source,
        NULL::timestamp AS last_seen_at
      FROM newsletter_subscribers ns
      WHERE ns.id = ${id}
        AND ns.status = 'active'
        AND ns.source IN ('portal', 'portal-signup')
      LIMIT 1
    `;

    lead = portalLeads[0];
  }

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [deliveries, sends, subscriber] = await Promise.all([
    lead.source_type === "campaign"
      ? sql`SELECT id, sent_at, resend_email_id FROM deliveries WHERE submission_id = ${id} ORDER BY sent_at DESC`
      : Promise.resolve([]),
    sql`SELECT step, sent_at FROM sequence_sends WHERE lower(email) = ${String(lead.email).toLowerCase()} ORDER BY step ASC`,
    sql`SELECT id, status, stripe_customer_id, created_at FROM subscribers WHERE lower(email) = ${String(lead.email).toLowerCase()}`,
  ]);

  return NextResponse.json({
    submission: lead,
    deliveries,
    sequenceSends: sends,
    subscriber: subscriber[0] || null,
  });
}
