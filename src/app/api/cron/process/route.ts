import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { scrapePostCommenters } from "@/lib/apify";
import { sendResourceEmailBatch } from "@/lib/email";
import { fuzzyMatchName, keywordInComment } from "@/lib/match";

export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const summary: Record<string, unknown>[] = [];

  async function deliverSubmissions(
    campaignId: string,
    resourceTitle: string,
    resourceUrl: string,
    submissions: { id: string; email: string }[]
  ) {
    if (submissions.length === 0) {
      return { sent: 0, error: null as string | null };
    }

    try {
      const results = await sendResourceEmailBatch(
        submissions.map((submission) => ({
          to: submission.email,
          resourceTitle,
          resourceUrl,
        }))
      );

      let sent = 0;

      for (const result of results) {
        const submission = submissions.find((item) => item.email === result.to);
        if (!submission) continue;

        await sql`
          INSERT INTO deliveries (submission_id, campaign_id, email, resend_email_id)
          VALUES (${submission.id}, ${campaignId}, ${submission.email}, ${result.id})
          ON CONFLICT (campaign_id, email) DO NOTHING
        `;

        await sql`
          UPDATE submissions SET delivered = true WHERE id = ${submission.id}
        `;

        sent++;
      }

      return { sent, error: null as string | null };
    } catch (error) {
      return { sent: 0, error: String(error) };
    }
  }

  // Deactivate expired campaigns
  await sql`
    UPDATE campaigns SET is_active = false
    WHERE is_active = true AND expires_at IS NOT NULL AND expires_at < NOW()
  `;

  // Get all active campaigns with a post URL
  const campaigns = await sql`
    SELECT id, title, post_url, resource_url, keyword
    FROM campaigns
    WHERE is_active = true
      AND post_url IS NOT NULL
      AND (expires_at IS NULL OR expires_at > NOW())
  `;

  for (const campaign of campaigns) {
    const campaignSummary: Record<string, unknown> = {
      id: campaign.id,
      title: campaign.title,
    };

    try {
      // 1. Scrape commenters
      const commenters = await scrapePostCommenters(campaign.post_url);
      campaignSummary.commentersScraped = commenters.length;

      // 2. Store commenters
      for (const c of commenters) {
        await sql`
          INSERT INTO commenters (campaign_id, linkedin_name, linkedin_url, headline, comment_text)
          VALUES (${campaign.id}, ${c.name}, ${c.linkedinUrl}, ${c.headline}, ${c.commentText})
          ON CONFLICT (campaign_id, linkedin_name) DO UPDATE
          SET linkedin_url = ${c.linkedinUrl}, headline = ${c.headline},
              comment_text = ${c.commentText}, scraped_at = NOW()
        `;
      }

      // 3. Filter commenters who used the keyword
      const validCommenters = commenters.filter((c) =>
        keywordInComment(c.commentText, campaign.keyword)
      );
      const validNames = validCommenters.map((c) => c.name);

      // 4. Get undelivered submissions
      const submissions = await sql`
        SELECT id, name, email FROM submissions
        WHERE campaign_id = ${campaign.id}
          AND delivered = false
      `;

      let matched = 0;

      // 5. Verify matching submissions
      const toSend: { id: string; email: string }[] = [];

      for (const sub of submissions) {
        const match = fuzzyMatchName(sub.name, validNames);

        if (match) {
          await sql`
            UPDATE submissions SET verified = true WHERE id = ${sub.id}
          `;

          const existing = await sql`
            SELECT id FROM deliveries
            WHERE campaign_id = ${campaign.id} AND email = ${sub.email}
          `;

          if (existing.length === 0) {
            toSend.push({ id: sub.id, email: sub.email });
          }

          matched++;
        }
      }

      // 6. Batch send emails
      const deliveryResult = await deliverSubmissions(
        campaign.id,
        campaign.title,
        campaign.resource_url,
        toSend
      );

      if (deliveryResult.error) {
        campaignSummary.emailError = deliveryResult.error;
      }

      // Update last_processed_at
      await sql`
        UPDATE campaigns SET last_processed_at = NOW() WHERE id = ${campaign.id}
      `;

      campaignSummary.validCommenters = validNames.length;
      campaignSummary.submissionsChecked = submissions.length;
      campaignSummary.matched = matched;
      campaignSummary.emailsSent = deliveryResult.sent;
      campaignSummary.deliveryMode = "verified-commenters";
    } catch (err) {
      campaignSummary.error = String(err);
    }

    summary.push(campaignSummary);
  }

  // After expiry, send any remaining submissions even if comment verification never matched.
  const expiredCampaigns = await sql`
    SELECT id, title, resource_url
    FROM campaigns
    WHERE expires_at IS NOT NULL
      AND expires_at <= NOW()
      AND EXISTS (
        SELECT 1
        FROM submissions s
        WHERE s.campaign_id = campaigns.id
          AND s.delivered = false
          AND NOT EXISTS (
            SELECT 1
            FROM deliveries d
            WHERE d.campaign_id = campaigns.id AND d.email = s.email
          )
      )
    ORDER BY expires_at DESC
  `;

  for (const campaign of expiredCampaigns) {
    const pending = (await sql`
      SELECT s.id, s.email
      FROM submissions s
      WHERE s.campaign_id = ${campaign.id}
        AND s.delivered = false
        AND NOT EXISTS (
          SELECT 1
          FROM deliveries d
          WHERE d.campaign_id = ${campaign.id} AND d.email = s.email
        )
    `) as { id: string; email: string }[];

    const deliveryResult = await deliverSubmissions(
      campaign.id,
      campaign.title,
      campaign.resource_url,
      pending
    );

    await sql`
      UPDATE campaigns SET last_processed_at = NOW() WHERE id = ${campaign.id}
    `;

    summary.push({
      id: campaign.id,
      title: campaign.title,
      fallbackPending: pending.length,
      fallbackSent: deliveryResult.sent,
      deliveryMode: "expired-campaign-fallback",
      ...(deliveryResult.error ? { emailError: deliveryResult.error } : {}),
    });
  }

  return NextResponse.json({
    processed: campaigns.length,
    expiredFallbacks: expiredCampaigns.length,
    summary,
  });
}
