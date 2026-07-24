import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureNewsletterCampaignSchema } from "@/lib/newsletter-campaign";
import {
  NEWSLETTER_LIFECYCLE,
  NEWSLETTER_REACTIVATION_DRAFTS,
} from "@/lib/newsletter-programs";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;
  return NextResponse.json({
    lifecycle: NEWSLETTER_LIFECYCLE,
    reactivation: NEWSLETTER_REACTIVATION_DRAFTS,
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const drafts = [];
  for (const draft of NEWSLETTER_REACTIVATION_DRAFTS) {
    const rows = await sql`
      INSERT INTO newsletter_issues
        (
          subject,
          slug,
          html,
          preview_text,
          campaign_type,
          audience_filter,
          status,
          stats
        )
      VALUES
        (
          ${draft.subject},
          ${draft.slug},
          ${draft.html},
          ${draft.previewText},
          ${draft.campaignType},
          ${draft.audienceFilter},
          'draft',
          '{"source":"system-program","portal_article":false}'::jsonb
        )
      ON CONFLICT (slug) DO UPDATE
      SET subject = EXCLUDED.subject,
          html = EXCLUDED.html,
          preview_text = EXCLUDED.preview_text,
          campaign_type = EXCLUDED.campaign_type,
          audience_filter = EXCLUDED.audience_filter,
          test_sent_at = NULL,
          test_sent_to = NULL,
          test_content_hash = NULL,
          updated_at = NOW()
      WHERE newsletter_issues.status = 'draft'
        AND NOT EXISTS (
          SELECT 1
          FROM newsletter_events e
          WHERE e.issue_id = newsletter_issues.id AND e.event = 'sent'
        )
      RETURNING id, subject, slug, status, campaign_type, audience_filter
    `;
    if (rows[0]) drafts.push(rows[0]);
  }
  return NextResponse.json({ drafts, sent: 0 });
}
