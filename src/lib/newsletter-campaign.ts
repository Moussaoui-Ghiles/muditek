import { getDb } from "@/lib/db";
import {
  NEWSLETTER_FROM,
  NEWSLETTER_REPLY_TO,
  htmlToPlainText,
  wrapIssueHtml,
} from "@/lib/newsletter";
import { Resend } from "resend";
import {
  campaignSafetyStopReason,
  isRetryableResendError,
} from "@/lib/newsletter-campaign-policy";

const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 5;
// One batch per minute gives delivery webhooks time to update the safety circuit
// breaker before another 100 recipients are released.
const DEFAULT_BATCHES_PER_RUN = 1;

type CampaignAction = "start" | "pause" | "resume" | "cancel" | "retry";

type Delivery = {
  subscriber_id: string;
  email: string;
  unsub_token: string;
  batch_key: string;
  attempts: number;
};

type Issue = {
  id: string;
  subject: string;
  html: string;
  audience_filter: string | null;
};

export async function ensureNewsletterCampaignSchema() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_campaign_runs (
      issue_id UUID PRIMARY KEY REFERENCES newsletter_issues(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'queued',
      total INTEGER NOT NULL DEFAULT 0,
      sent INTEGER NOT NULL DEFAULT 0,
      failed INTEGER NOT NULL DEFAULT 0,
      suppressed INTEGER NOT NULL DEFAULT 0,
      batches INTEGER NOT NULL DEFAULT 0,
      last_error TEXT,
      locked_until TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      started_at TIMESTAMP,
      completed_at TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_campaign_deliveries (
      issue_id UUID NOT NULL REFERENCES newsletter_issues(id) ON DELETE CASCADE,
      subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      unsub_token UUID NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued',
      batch_key TEXT,
      attempts INTEGER NOT NULL DEFAULT 0,
      resend_email_id TEXT,
      last_error TEXT,
      claimed_at TIMESTAMP,
      sent_at TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (issue_id, subscriber_id)
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS newsletter_campaign_runs_status_idx
    ON newsletter_campaign_runs (status, locked_until)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS newsletter_campaign_deliveries_status_idx
    ON newsletter_campaign_deliveries (issue_id, status)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS newsletter_campaign_deliveries_batch_idx
    ON newsletter_campaign_deliveries (issue_id, batch_key)
  `;
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_confirmed_at TIMESTAMP
  `;
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_source TEXT
  `;
}

export async function controlNewsletterCampaign(issueId: string, action: CampaignAction) {
  await ensureNewsletterCampaignSchema();
  const sql = getDb();

  if (action === "start") {
    const issues = await sql`
      SELECT id, subject, html, audience_filter, status
      FROM newsletter_issues
      WHERE id = ${issueId}
      LIMIT 1
    `;
    if (issues.length === 0) throw new Error("Issue not found");
    const issue = issues[0];
    const bodyHtml = String(issue.html ?? "").trim();
    if (!String(issue.subject ?? "").trim()) throw new Error("Subject is required");
    if (!bodyHtml || bodyHtml === "<p></p>") throw new Error("Issue has no body");
    if (!process.env.RESEND_API_KEY) throw new Error("Resend API key is not configured");

    const existing = await sql`
      SELECT status FROM newsletter_campaign_runs WHERE issue_id = ${issueId} LIMIT 1
    `;
    if (existing.length > 0) {
      throw new Error("Campaign already exists. Resume or retry it instead.");
    }

    if (issue.audience_filter === "HOT" || issue.audience_filter === "WARM" || issue.audience_filter === "COLD") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.segment = ${issue.audience_filter}
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    }

    const counts = await sql`
      SELECT COUNT(*)::int AS total
      FROM newsletter_campaign_deliveries
      WHERE issue_id = ${issueId}
    `;
    const total = Number(counts[0]?.total ?? 0);
    if (total === 0) throw new Error("No active subscribers for this audience");

    await sql`
      INSERT INTO newsletter_campaign_runs (issue_id, status, total)
      VALUES (${issueId}, 'queued', ${total})
    `;
    await sql`
      UPDATE newsletter_issues
      SET status = 'queued',
          stats = COALESCE(stats, '{}'::jsonb) ||
            ${JSON.stringify({ campaign_state: "queued", remaining: total, sent: 0, failed: 0 })}::jsonb,
          updated_at = NOW()
      WHERE id = ${issueId}
    `;
    return getNewsletterCampaign(issueId);
  }

  const runs = await sql`
    SELECT status FROM newsletter_campaign_runs WHERE issue_id = ${issueId} LIMIT 1
  `;
  if (runs.length === 0) throw new Error("Campaign has not been started");

  if (action === "pause") {
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'paused', locked_until = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId} AND status IN ('queued', 'running')
    `;
    await sql`
      UPDATE newsletter_issues
      SET status = 'paused', updated_at = NOW()
      WHERE id = ${issueId} AND status IN ('queued', 'sending')
    `;
  } else if (action === "resume") {
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'queued', last_error = NULL, locked_until = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId} AND status IN ('paused', 'failed')
    `;
    await sql`
      UPDATE newsletter_issues SET status = 'queued', updated_at = NOW() WHERE id = ${issueId}
    `;
  } else if (action === "retry") {
    await sql`
      UPDATE newsletter_campaign_deliveries
      SET status = 'queued', batch_key = NULL, attempts = 0, last_error = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId} AND status = 'failed'
    `;
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'queued', failed = 0, last_error = NULL, locked_until = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId}
    `;
    await sql`
      UPDATE newsletter_issues SET status = 'queued', updated_at = NOW() WHERE id = ${issueId}
    `;
  } else if (action === "cancel") {
    await sql`
      UPDATE newsletter_campaign_deliveries
      SET status = 'suppressed', last_error = 'Campaign cancelled', updated_at = NOW()
      WHERE issue_id = ${issueId} AND status IN ('queued', 'processing')
    `;
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'cancelled', locked_until = NULL, completed_at = NOW(), updated_at = NOW()
      WHERE issue_id = ${issueId}
    `;
    await sql`
      UPDATE newsletter_issues SET status = 'cancelled', updated_at = NOW() WHERE id = ${issueId}
    `;
  }

  await refreshCampaignCounts(issueId);
  return getNewsletterCampaign(issueId);
}

export async function getNewsletterCampaign(issueId: string) {
  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const rows = await sql`
    SELECT issue_id, status, total, sent, failed, suppressed, batches, last_error,
           created_at, started_at, completed_at, updated_at
    FROM newsletter_campaign_runs
    WHERE issue_id = ${issueId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function refreshCampaignCounts(issueId: string) {
  const sql = getDb();
  const counts = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'sent')::int AS sent,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
      COUNT(*) FILTER (WHERE status = 'suppressed')::int AS suppressed,
      COUNT(*) FILTER (WHERE status IN ('queued', 'processing'))::int AS remaining
    FROM newsletter_campaign_deliveries
    WHERE issue_id = ${issueId}
  `;
  const c = counts[0];
  const total = Number(c?.total ?? 0);
  const sent = Number(c?.sent ?? 0);
  const failed = Number(c?.failed ?? 0);
  const suppressed = Number(c?.suppressed ?? 0);
  const remaining = Number(c?.remaining ?? 0);

  await sql`
    UPDATE newsletter_campaign_runs
    SET total = ${total}, sent = ${sent}, failed = ${failed}, suppressed = ${suppressed}, updated_at = NOW()
    WHERE issue_id = ${issueId}
  `;
  await sql`
    UPDATE newsletter_issues
    SET stats = COALESCE(stats, '{}'::jsonb) ||
      ${JSON.stringify({ sent, failed, suppressed, remaining })}::jsonb,
      updated_at = NOW()
    WHERE id = ${issueId}
  `;
  return { total, sent, failed, suppressed, remaining };
}

async function safetyStopReason(issueId: string): Promise<string | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'sent')::int AS sent,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'delivered')::int AS delivered,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'bounced')::int AS bounced,
      COUNT(DISTINCT subscriber_id) FILTER (WHERE event = 'complained')::int AS complained
    FROM newsletter_events
    WHERE issue_id = ${issueId}
  `;
  const sent = Number(rows[0]?.sent ?? 0);
  const delivered = Number(rows[0]?.delivered ?? 0);
  const bounced = Number(rows[0]?.bounced ?? 0);
  const complained = Number(rows[0]?.complained ?? 0);
  return campaignSafetyStopReason({ sent, delivered, bounced, complained });
}

async function claimCampaign(requestedIssueId?: string) {
  const sql = getDb();
  const requested = requestedIssueId ?? null;
  const rows = await sql`
    UPDATE newsletter_campaign_runs
    SET status = 'running',
        locked_until = NOW() + (${LOCK_MINUTES} * INTERVAL '1 minute'),
        started_at = COALESCE(started_at, NOW()),
        updated_at = NOW()
    WHERE issue_id = (
      SELECT issue_id
      FROM newsletter_campaign_runs
      WHERE status IN ('queued', 'running')
        AND (locked_until IS NULL OR locked_until < NOW())
        AND (${requested}::text IS NULL OR issue_id::text = ${requested})
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING issue_id
  `;
  return rows[0]?.issue_id ? String(rows[0].issue_id) : null;
}

async function suppressInactive(issueId: string) {
  const sql = getDb();
  await sql`
    UPDATE newsletter_campaign_deliveries d
    SET status = 'suppressed', last_error = 'Subscriber is no longer active', updated_at = NOW()
    FROM newsletter_subscribers s
    WHERE d.issue_id = ${issueId}
      AND d.subscriber_id = s.id
      AND d.status = 'queued'
      AND s.status <> 'active'
  `;
}

async function claimDeliveryBatch(issueId: string): Promise<Delivery[]> {
  const sql = getDb();

  const retry = await sql`
    SELECT subscriber_id, email, unsub_token::text, batch_key, attempts
    FROM newsletter_campaign_deliveries
    WHERE issue_id = ${issueId}
      AND status = 'processing'
      AND batch_key IS NOT NULL
    ORDER BY subscriber_id
    LIMIT ${BATCH_SIZE}
  `;
  if (retry.length > 0) return retry as Delivery[];

  const batchKey = `newsletter-${issueId}-${crypto.randomUUID()}`;
  const rows = await sql`
    WITH chosen AS (
      SELECT subscriber_id
      FROM newsletter_campaign_deliveries
      WHERE issue_id = ${issueId}
        AND status = 'queued'
        AND batch_key IS NULL
      ORDER BY subscriber_id
      FOR UPDATE SKIP LOCKED
      LIMIT ${BATCH_SIZE}
    )
    UPDATE newsletter_campaign_deliveries d
    SET status = 'processing',
        batch_key = ${batchKey},
        attempts = attempts + 1,
        claimed_at = NOW(),
        updated_at = NOW()
    FROM chosen
    WHERE d.issue_id = ${issueId}
      AND d.subscriber_id = chosen.subscriber_id
    RETURNING d.subscriber_id, d.email, d.unsub_token::text, d.batch_key, d.attempts
  `;
  return rows as Delivery[];
}

async function sendDeliveryBatch(issue: Issue, deliveries: Delivery[], baseUrl: string) {
  const sql = getDb();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emails = deliveries.map((delivery) => {
    const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${delivery.unsub_token}`;
    const prefsUrl = `${baseUrl}/preferences/${delivery.unsub_token}`;
    const confirmUrl = `${baseUrl}/newsletter/confirm/${issue.id}/${delivery.unsub_token}`;
    const html = wrapIssueHtml(issue.html, { unsubUrl, prefsUrl, confirmUrl });
    const text = `${htmlToPlainText(issue.html)}\n\n--\nMuditek · Ghiles Moussaoui\nManage preferences: ${prefsUrl}\nUnsubscribe: ${unsubUrl}`;
    return {
      from: NEWSLETTER_FROM,
      replyTo: NEWSLETTER_REPLY_TO,
      to: delivery.email,
      subject: issue.subject,
      html,
      text,
      tags: [
        { name: "newsletter_issue_id", value: issue.id },
        { name: "newsletter_subscriber_id", value: delivery.subscriber_id },
      ],
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>, <mailto:unsubscribe@muditek.com?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-ID": "Muditek Newsletter <newsletter.muditek.com>",
        "Precedence": "bulk",
        "X-Entity-Ref-ID": `${issue.id}-${delivery.subscriber_id}`,
      },
    };
  });

  const batchKey = deliveries[0].batch_key;
  const result = await resend.batch.send(emails, { idempotencyKey: batchKey });
  if (result.error) {
    const message = `${result.error.name}: ${result.error.message}`;
    const canRetry = isRetryableResendError(result.error.name) &&
      deliveries.every((delivery) => delivery.attempts < MAX_ATTEMPTS);
    await sql`
      UPDATE newsletter_campaign_deliveries
      SET status = ${canRetry ? "processing" : "failed"},
          attempts = attempts + 1,
          last_error = ${message},
          claimed_at = NOW(),
          updated_at = NOW()
      WHERE issue_id = ${issue.id} AND batch_key = ${batchKey}
    `;
    throw new Error(message);
  }

  const items = result.data?.data ?? [];
  for (let index = 0; index < deliveries.length; index += 1) {
    const delivery = deliveries[index];
    const emailId = items[index]?.id ?? null;
    await sql`
      UPDATE newsletter_campaign_deliveries
      SET status = 'sent', resend_email_id = ${emailId}, sent_at = NOW(), last_error = NULL, updated_at = NOW()
      WHERE issue_id = ${issue.id} AND subscriber_id = ${delivery.subscriber_id}
    `;
    await sql`
      INSERT INTO newsletter_events
        (subscriber_id, issue_id, email, event, resend_email_id, event_id)
      VALUES
        (${delivery.subscriber_id}, ${issue.id}, ${delivery.email}, 'sent', ${emailId},
         ${`local-sent:${issue.id}:${delivery.subscriber_id}`})
      ON CONFLICT (event_id) DO NOTHING
    `;
  }
}

async function processClaimedCampaign(issueId: string, baseUrl: string, maxBatches: number) {
  const sql = getDb();
  const issues = await sql`
    SELECT id, subject, html, audience_filter
    FROM newsletter_issues
    WHERE id = ${issueId}
    LIMIT 1
  `;
  if (issues.length === 0) throw new Error("Issue not found");
  const issue = issues[0] as Issue;

  await sql`UPDATE newsletter_issues SET status = 'sending', updated_at = NOW() WHERE id = ${issueId}`;

  for (let batch = 0; batch < maxBatches; batch += 1) {
    const statusRows = await sql`
      SELECT status FROM newsletter_campaign_runs WHERE issue_id = ${issueId} LIMIT 1
    `;
    if (statusRows[0]?.status !== "running") break;

    const stopReason = await safetyStopReason(issueId);
    if (stopReason) {
      await sql`
        UPDATE newsletter_campaign_runs
        SET status = 'paused', last_error = ${stopReason}, locked_until = NULL, updated_at = NOW()
        WHERE issue_id = ${issueId}
      `;
      await sql`
        UPDATE newsletter_issues SET status = 'paused', updated_at = NOW() WHERE id = ${issueId}
      `;
      return;
    }

    await suppressInactive(issueId);
    const deliveries = await claimDeliveryBatch(issueId);
    if (deliveries.length === 0) break;

    try {
      await sendDeliveryBatch(issue, deliveries, baseUrl);
      await sql`
        UPDATE newsletter_campaign_runs
        SET batches = batches + 1, last_error = NULL, updated_at = NOW()
        WHERE issue_id = ${issueId}
      `;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Batch send failed";
      await sql`
        UPDATE newsletter_campaign_runs
        SET last_error = ${message}, updated_at = NOW()
        WHERE issue_id = ${issueId}
      `;
      break;
    }
  }

  const counts = await refreshCampaignCounts(issueId);
  if (counts.remaining === 0) {
    const status = counts.failed > 0 ? "failed" : "completed";
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = ${status}, locked_until = NULL, completed_at = NOW(), updated_at = NOW()
      WHERE issue_id = ${issueId}
    `;
    await sql`
      UPDATE newsletter_issues
      SET status = ${counts.failed > 0 ? "failed" : "sent"},
          sent_at = CASE WHEN ${counts.failed} = 0 THEN NOW() ELSE sent_at END,
          updated_at = NOW()
      WHERE id = ${issueId}
    `;
  } else {
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'queued', locked_until = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId} AND status = 'running'
    `;
    await sql`
      UPDATE newsletter_issues
      SET status = 'queued', updated_at = NOW()
      WHERE id = ${issueId} AND status = 'sending'
    `;
  }
}

export async function processNewsletterCampaigns(
  baseUrl: string,
  requestedMaxBatches?: number,
  requestedIssueId?: string,
) {
  await ensureNewsletterCampaignSchema();
  const maxBatches = Math.max(
    1,
    Math.min(
      20,
      requestedMaxBatches ??
        Number(process.env.NEWSLETTER_BATCHES_PER_RUN || DEFAULT_BATCHES_PER_RUN),
    ),
  );
  const issueId = await claimCampaign(requestedIssueId);
  if (!issueId) return { processed: false, issueId: null };

  try {
    await processClaimedCampaign(issueId, baseUrl, maxBatches);
  } catch (error) {
    const sql = getDb();
    const message = error instanceof Error ? error.message : "Campaign worker failed";
    await sql`
      UPDATE newsletter_campaign_runs
      SET status = 'paused', last_error = ${message}, locked_until = NULL, updated_at = NOW()
      WHERE issue_id = ${issueId}
    `;
    await sql`
      UPDATE newsletter_issues SET status = 'paused', updated_at = NOW() WHERE id = ${issueId}
    `;
    return { processed: true, issueId, error: message };
  }

  return { processed: true, issueId, campaign: await getNewsletterCampaign(issueId) };
}

export async function sunsetExpiredReactivation() {
  const sql = getDb();
  const issues = await sql`
    SELECT id
    FROM newsletter_issues
    WHERE slug = 'reactivation-3-keep-sending'
      AND status = 'sent'
      AND sent_at < NOW() - INTERVAL '7 days'
    LIMIT 1
  `;
  if (issues.length === 0) return { dormant: 0 };
  const issueId = String(issues[0].id);
  const rows = await sql`
    WITH updated AS (
      UPDATE newsletter_subscribers s
      SET status = 'dormant'
      WHERE s.status = 'active'
        AND EXISTS (
          SELECT 1 FROM newsletter_events sent
          WHERE sent.issue_id = ${issueId}
            AND sent.subscriber_id = s.id
            AND sent.event = 'sent'
        )
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events confirmed
          WHERE confirmed.issue_id = ${issueId}
            AND confirmed.subscriber_id = s.id
            AND confirmed.event = 'confirmed'
        )
      RETURNING s.id
    )
    SELECT COUNT(*)::int AS count FROM updated
  `;
  return { dormant: Number(rows[0]?.count ?? 0) };
}
