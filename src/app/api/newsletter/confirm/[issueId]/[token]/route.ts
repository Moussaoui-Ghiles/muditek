import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ensureNewsletterCampaignSchema } from "@/lib/newsletter-campaign";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ issueId: string; token: string }> },
) {
  const { issueId, token } = await params;
  if (!UUID_PATTERN.test(issueId) || !UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Invalid confirmation link" }, { status: 404 });
  }
  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const subscribers = await sql`
    UPDATE newsletter_subscribers
    SET status = 'active',
        consent_confirmed_at = NOW(),
        consent_source = ${`newsletter:${issueId}`}
    WHERE unsub_token = ${token}
    RETURNING id, email
  `;
  if (subscribers.length === 0) {
    return NextResponse.json({ error: "Invalid confirmation link" }, { status: 404 });
  }

  const subscriber = subscribers[0];
  await sql`
    INSERT INTO newsletter_events
      (subscriber_id, issue_id, email, event, event_id, metadata)
    VALUES
      (${subscriber.id}, ${issueId}, ${subscriber.email}, 'confirmed',
       ${`confirmed:${issueId}:${subscriber.id}`},
       ${JSON.stringify({ source: "newsletter_repermission" })}::jsonb)
    ON CONFLICT (event_id) DO NOTHING
  `;

  return NextResponse.redirect(
    new URL("/portal?newsletter=confirmed", request.url),
    { status: 303 },
  );
}
