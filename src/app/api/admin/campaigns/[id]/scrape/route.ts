import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { scrapePostCommenters } from "@/lib/apify";
import { fuzzyMatchName, keywordInComment } from "@/lib/match";
import { requireAdmin } from "@/lib/admin-auth";

export const maxDuration = 300;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  const campaigns = await sql`
    SELECT id, post_url, keyword FROM campaigns WHERE id = ${id}
  `;

  if (campaigns.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const campaign = campaigns[0];

  if (!campaign.post_url) {
    return NextResponse.json(
      { error: "Campaign has no post URL" },
      { status: 400 }
    );
  }

  // 1. Scrape commenters from LinkedIn
  const commenters = await scrapePostCommenters(campaign.post_url);

  let scraped = 0;
  for (const c of commenters) {
    await sql`
      INSERT INTO commenters (campaign_id, linkedin_name, linkedin_url, headline, comment_text)
      VALUES (${id}, ${c.name}, ${c.linkedinUrl}, ${c.headline}, ${c.commentText})
      ON CONFLICT (campaign_id, linkedin_name) DO UPDATE
      SET linkedin_url = ${c.linkedinUrl}, headline = ${c.headline},
          comment_text = ${c.commentText}, scraped_at = NOW()
    `;
    scraped++;
  }

  // 2. Verify unverified submissions against scraped commenters
  const validCommenters = commenters.filter((c) =>
    keywordInComment(c.commentText, campaign.keyword)
  );
  const validNames = validCommenters.map((c) => c.name);

  const unverified = await sql`
    SELECT id, name FROM submissions
    WHERE campaign_id = ${id} AND verified = false
  `;

  let verified = 0;
  for (const sub of unverified) {
    const match = fuzzyMatchName(sub.name, validNames);
    if (match) {
      await sql`
        UPDATE submissions SET verified = true WHERE id = ${sub.id}
      `;
      verified++;
    }
  }

  // 3. Update last_processed_at
  await sql`
    UPDATE campaigns SET last_processed_at = NOW() WHERE id = ${id}
  `;

  return NextResponse.json({ scraped, verified, validCommenters: validNames.length });
}
