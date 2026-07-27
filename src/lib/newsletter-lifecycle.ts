import { Resend } from "resend";
import { getDb } from "@/lib/db";
import {
  NEWSLETTER_FROM,
  NEWSLETTER_REPLY_TO,
  htmlToPlainText,
  wrapIssueHtml,
} from "@/lib/newsletter";
import { NEWSLETTER_LIFECYCLE } from "@/lib/newsletter-programs";
import {
  assertNewsletterSendingEnabled,
  newsletterPostalAddress,
  NEWSLETTER_MONTHLY_LIMIT,
} from "@/lib/newsletter-sending";
import { isRetryableResendError } from "@/lib/newsletter-campaign-policy";

const MAX_ATTEMPTS = 3;

let lifecycleSchemaPromise: Promise<void> | null = null;

async function applyNewsletterLifecycleSchema() {
  const sql = getDb();
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_confirmed_at TIMESTAMP
  `;
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_source TEXT
  `;
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_text_version TEXT
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_lifecycle_deliveries (
      subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
      step INTEGER NOT NULL,
      subject TEXT NOT NULL,
      preview_text TEXT NOT NULL,
      html TEXT NOT NULL,
      scheduled_at TIMESTAMP NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      batch_key TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      resend_email_id TEXT,
      last_error TEXT,
      locked_until TIMESTAMP,
      sent_at TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (subscriber_id, step)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS newsletter_lifecycle_due_idx
    ON newsletter_lifecycle_deliveries (status, scheduled_at)
  `;
  await sql`
    ALTER TABLE newsletter_lifecycle_deliveries
    ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP
  `;
}

export function ensureNewsletterLifecycleSchema(): Promise<void> {
  if (!lifecycleSchemaPromise) {
    lifecycleSchemaPromise = applyNewsletterLifecycleSchema().catch((error) => {
      lifecycleSchemaPromise = null;
      throw error;
    });
  }
  return lifecycleSchemaPromise;
}

export async function enrollNewsletterLifecycle(subscriberId: string) {
  await ensureNewsletterLifecycleSchema();
  const sql = getDb();
  for (const item of NEWSLETTER_LIFECYCLE) {
    await sql`
      INSERT INTO newsletter_lifecycle_deliveries
        (subscriber_id, step, subject, preview_text, html, scheduled_at)
      VALUES
        (
          ${subscriberId},
          ${item.step},
          ${item.subject},
          ${item.previewText},
          ${item.html},
          NOW() + (${item.delayDays} * INTERVAL '1 day')
      )
      ON CONFLICT (subscriber_id, step) DO UPDATE
      SET subject = EXCLUDED.subject,
          preview_text = EXCLUDED.preview_text,
          html = EXCLUDED.html,
          scheduled_at = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN EXCLUDED.scheduled_at
            ELSE newsletter_lifecycle_deliveries.scheduled_at
          END,
          status = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN 'queued'
            ELSE newsletter_lifecycle_deliveries.status
          END,
          batch_key = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN NULL
            ELSE newsletter_lifecycle_deliveries.batch_key
          END,
          attempts = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN 0
            ELSE newsletter_lifecycle_deliveries.attempts
          END,
          last_error = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN NULL
            ELSE newsletter_lifecycle_deliveries.last_error
          END,
          locked_until = CASE
            WHEN newsletter_lifecycle_deliveries.status = 'suppressed'
              THEN NULL
            ELSE newsletter_lifecycle_deliveries.locked_until
          END,
          updated_at = NOW()
    `;
  }
}

async function monthlyUsage() {
  const sql = getDb();
  const rows = await sql`
    SELECT
      (
        SELECT COUNT(*)::int
        FROM newsletter_events
        WHERE event = 'sent'
          AND event_id LIKE 'local-sent:%'
          AND ts >= date_trunc('month', NOW())
      ) +
      (
        SELECT COUNT(*)::int
        FROM email_log
        WHERE sent_at >= date_trunc('month', NOW())
      ) AS used
  `;
  return Number(rows[0]?.used ?? 0);
}

export async function processNewsletterLifecycle(
  baseUrl: string,
  requestedSubscriberId?: string,
) {
  assertNewsletterSendingEnabled();
  const postalAddress = newsletterPostalAddress();
  await ensureNewsletterLifecycleSchema();
  const sql = getDb();
  const subscriberId = requestedSubscriberId ?? null;
  await sql`
    UPDATE newsletter_lifecycle_deliveries d
    SET status = 'suppressed',
        last_error = 'Subscriber is inactive or has not confirmed consent',
        locked_until = NULL,
        updated_at = NOW()
    FROM newsletter_subscribers s
    WHERE d.subscriber_id = s.id
      AND d.status = 'queued'
      AND (s.status <> 'active' OR s.consent_confirmed_at IS NULL)
  `;
  await sql`
    UPDATE newsletter_lifecycle_deliveries
    SET status = 'failed',
        last_error = COALESCE(last_error, 'Retry limit reached'),
        locked_until = NULL,
        updated_at = NOW()
    WHERE status = 'processing' AND attempts >= ${MAX_ATTEMPTS}
  `;
  const retries = await sql`
    WITH retry_batch AS (
      SELECT batch_key
      FROM newsletter_lifecycle_deliveries
      WHERE status = 'processing'
        AND batch_key IS NOT NULL
        AND attempts < ${MAX_ATTEMPTS}
        AND (locked_until IS NULL OR locked_until < NOW())
        AND (${subscriberId}::text IS NULL OR subscriber_id::text = ${subscriberId})
      ORDER BY updated_at
      LIMIT 1
    )
    UPDATE newsletter_lifecycle_deliveries d
    SET attempts = attempts + 1,
        locked_until = NOW() + INTERVAL '5 minutes',
        updated_at = NOW()
    FROM retry_batch
    WHERE d.status = 'processing' AND d.batch_key = retry_batch.batch_key
    RETURNING d.subscriber_id, d.step, d.subject, d.preview_text, d.html,
              d.attempts, d.batch_key
  `;
  const newBatchKey = `newsletter-lifecycle-${crypto.randomUUID()}`;
  const deliveries = retries.length > 0
    ? retries
    : await sql`
        WITH chosen AS (
          SELECT d.subscriber_id, d.step
          FROM newsletter_lifecycle_deliveries d
          JOIN newsletter_subscribers s ON s.id = d.subscriber_id
          WHERE d.status = 'queued'
            AND d.scheduled_at <= NOW()
            AND s.status = 'active'
            AND s.consent_confirmed_at IS NOT NULL
            AND (${subscriberId}::text IS NULL OR d.subscriber_id::text = ${subscriberId})
            AND NOT EXISTS (
              SELECT 1
              FROM newsletter_lifecycle_deliveries earlier
              WHERE earlier.subscriber_id = d.subscriber_id
                AND earlier.step < d.step
                AND earlier.status <> 'sent'
            )
          ORDER BY d.scheduled_at, d.subscriber_id, d.step
          FOR UPDATE OF d SKIP LOCKED
          LIMIT 100
        )
        UPDATE newsletter_lifecycle_deliveries d
        SET status = 'processing',
            batch_key = ${newBatchKey},
            attempts = attempts + 1,
            locked_until = NOW() + INTERVAL '5 minutes',
            updated_at = NOW()
        FROM chosen
        WHERE d.subscriber_id = chosen.subscriber_id AND d.step = chosen.step
        RETURNING d.subscriber_id, d.step, d.subject, d.preview_text, d.html,
                  d.attempts, d.batch_key
      `;
  if (deliveries.length === 0) return { processed: 0, sent: 0 };
  const batchKey = String(deliveries[0].batch_key);

  const used = await monthlyUsage();
  if (used + deliveries.length > NEWSLETTER_MONTHLY_LIMIT) {
    await sql`
      UPDATE newsletter_lifecycle_deliveries
      SET status = 'queued',
          batch_key = NULL,
          locked_until = NULL,
          last_error = 'Monthly email limit reached',
          updated_at = NOW()
      WHERE batch_key = ${batchKey}
    `;
    return { processed: 0, sent: 0, paused: true, error: "Monthly email limit reached" };
  }

  const subscribers = await sql`
    SELECT DISTINCT s.id, lower(s.email) AS email, s.unsub_token::text
    FROM newsletter_subscribers s
    JOIN newsletter_lifecycle_deliveries d ON d.subscriber_id = s.id
    WHERE d.batch_key = ${batchKey}
  `;
  const subscriberById = new Map(
    subscribers.map((subscriber) => [String(subscriber.id), subscriber]),
  );
  const emails = deliveries.map((delivery) => {
    const subscriber = subscriberById.get(String(delivery.subscriber_id));
    if (!subscriber) throw new Error("Lifecycle subscriber disappeared after claim");
    const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${subscriber.unsub_token}`;
    const prefsUrl = `${baseUrl}/preferences/${subscriber.unsub_token}`;
    const html = wrapIssueHtml(String(delivery.html), {
      unsubUrl,
      prefsUrl,
      previewText: String(delivery.preview_text),
      postalAddress,
    });
    const text = `${htmlToPlainText(String(delivery.html))}\n\n--\nMuditek · Ghiles Moussaoui\n${postalAddress ? `${postalAddress}\n` : ""}You are receiving this because you subscribed to Muditek.\nManage preferences: ${prefsUrl}\nUnsubscribe: ${unsubUrl}`;
    return {
      from: NEWSLETTER_FROM,
      replyTo: NEWSLETTER_REPLY_TO,
      to: String(subscriber.email),
      subject: String(delivery.subject),
      html,
      text,
      tags: [
        { name: "newsletter_subscriber_id", value: String(delivery.subscriber_id) },
        { name: "newsletter_lifecycle_step", value: String(delivery.step) },
      ],
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>, <mailto:unsubscribe@muditek.com?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-ID": "Muditek Newsletter <newsletter.muditek.com>",
        "Precedence": "bulk",
      },
    };
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  let result;
  try {
    result = await resend.batch.send(emails, { idempotencyKey: batchKey });
  } catch (error) {
    await sql`
      UPDATE newsletter_lifecycle_deliveries
      SET last_error = ${error instanceof Error ? error.message : "Resend request failed"},
          locked_until = NULL,
          updated_at = NOW()
      WHERE batch_key = ${batchKey}
    `;
    throw error;
  }
  if (result.error) {
    const retryable =
      isRetryableResendError(result.error.name) &&
      deliveries.every((delivery) => Number(delivery.attempts) < MAX_ATTEMPTS);
    await sql`
      UPDATE newsletter_lifecycle_deliveries
      SET status = ${retryable ? "processing" : "failed"},
          locked_until = NULL,
          last_error = ${`${result.error.name}: ${result.error.message}`},
          updated_at = NOW()
      WHERE batch_key = ${batchKey}
    `;
    throw new Error(result.error.message);
  }

  const items = result.data?.data ?? [];
  const accepted = deliveries.map((delivery, index) => ({
    subscriber_id: delivery.subscriber_id,
    step: Number(delivery.step),
    resend_email_id: items[index]?.id ?? null,
  }));
  await sql`
    WITH accepted AS (
      SELECT subscriber_id, step, resend_email_id
      FROM jsonb_to_recordset(${JSON.stringify(accepted)}::jsonb)
        AS item(subscriber_id UUID, step INTEGER, resend_email_id TEXT)
    ),
    updated AS (
      UPDATE newsletter_lifecycle_deliveries d
      SET status = 'sent',
          resend_email_id = accepted.resend_email_id,
          sent_at = NOW(),
          locked_until = NULL,
          last_error = NULL,
          updated_at = NOW()
      FROM accepted
      WHERE d.subscriber_id = accepted.subscriber_id
        AND d.step = accepted.step
        AND d.batch_key = ${batchKey}
      RETURNING d.subscriber_id, d.step, d.subject, d.resend_email_id
    )
    INSERT INTO email_log (email, type, subject, resend_email_id)
    SELECT
      s.email,
      'newsletter-lifecycle-' || updated.step::text,
      updated.subject,
      updated.resend_email_id
    FROM updated
    JOIN newsletter_subscribers s ON s.id = updated.subscriber_id
  `;
  return { processed: deliveries.length, sent: deliveries.length };
}
