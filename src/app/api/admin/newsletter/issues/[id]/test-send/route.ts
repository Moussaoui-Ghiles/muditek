import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO, wrapIssueHtml, htmlToPlainText } from "@/lib/newsletter";
import {
  ensureNewsletterCampaignSchema,
} from "@/lib/newsletter-campaign";
import {
  newsletterContentHash,
  validateNewsletterDraft,
} from "@/lib/newsletter-preflight";
import {
  newsletterPostalAddress,
  newsletterTestSendingEnabled,
} from "@/lib/newsletter-sending";
import { Resend } from "resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  if (!newsletterTestSendingEnabled()) {
    return NextResponse.json(
      {
        error:
          "Inbox testing is disabled. Set NEWSLETTER_TEST_EMAILS_ENABLED=true without enabling subscriber sends.",
      },
      { status: 409 },
    );
  }
  await ensureNewsletterCampaignSchema();
  const body = await request.json();
  const to: string = String(body.to ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, html, preview_text, audience_filter, campaign_type
    FROM newsletter_issues WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const issue = rows[0];
  const validation = validateNewsletterDraft({
    subject: issue.subject,
    previewText: issue.preview_text,
    html: issue.html ?? "",
    audienceFilter: issue.audience_filter,
    campaignType: issue.campaign_type,
  });
  if (validation.errors.length > 0) {
    return NextResponse.json(
      { error: validation.errors.map((finding) => finding.message).join(" ") },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

  // Use real token if recipient is a subscriber so footer links actually work
  const subRows = await sql`
    SELECT unsub_token FROM newsletter_subscribers WHERE email = ${to} LIMIT 1
  `;
  const token =
    subRows[0]?.unsub_token ?? "00000000-0000-0000-0000-000000000000";

  const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${token}`;
  const prefsUrl = `${baseUrl}/preferences/${token}`;
  const confirmUrl = `${baseUrl}/newsletter/confirm/${id}/${token}`;
  const html = wrapIssueHtml(issue.html ?? "", {
    unsubUrl,
    prefsUrl,
    confirmUrl,
    previewText: issue.preview_text,
    postalAddress: newsletterPostalAddress(),
  });
  const text = `${htmlToPlainText(issue.html ?? "")}\n\n--\nMuditek · Ghiles Moussaoui\n${newsletterPostalAddress() ? `${newsletterPostalAddress()}\n` : ""}You are receiving this because you subscribed to Muditek.\nManage preferences: ${prefsUrl}\nUnsubscribe: ${unsubUrl}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject: `[TEST] ${issue.subject}`,
    html,
    text,
    headers: {
      "List-Unsubscribe": `<${unsubUrl}>, <mailto:unsubscribe@muditek.com?subject=unsubscribe>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      "Precedence": "bulk",
      "X-Entity-Ref-ID": `${id}-test`,
    },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const contentHash = newsletterContentHash({
    subject: issue.subject,
    previewText: issue.preview_text,
    html: issue.html ?? "",
    audienceFilter: issue.audience_filter,
    campaignType: issue.campaign_type,
  });
  await sql`
    UPDATE newsletter_issues
    SET test_sent_at = NOW(),
        test_sent_to = ${to},
        test_content_hash = ${contentHash}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true, email_id: data?.id });
}
