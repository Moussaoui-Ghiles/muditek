import { getDb } from "@/lib/db";

export async function unsubscribeNewsletterByToken(token: string): Promise<boolean> {
  const sql = getDb();
  const subscribers = await sql`
    UPDATE newsletter_subscribers
    SET status = 'unsub',
        unsub_at = COALESCE(unsub_at, NOW())
    WHERE unsub_token = ${token}
    RETURNING id
  `;
  if (subscribers.length === 0) return false;

  const subscriberId = subscribers[0].id;
  await Promise.all([
    sql`
      UPDATE newsletter_lifecycle_deliveries
      SET status = 'suppressed',
          batch_key = NULL,
          locked_until = NULL,
          last_error = 'Subscriber unsubscribed',
          updated_at = NOW()
      WHERE subscriber_id = ${subscriberId}
        AND status = 'queued'
    `,
    sql`
      UPDATE newsletter_campaign_deliveries
      SET status = 'suppressed',
          batch_key = NULL,
          last_error = 'Subscriber unsubscribed',
          updated_at = NOW()
      WHERE subscriber_id = ${subscriberId}
        AND status = 'queued'
    `,
  ]);
  return true;
}
