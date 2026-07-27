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
import {
  newsletterContentHash,
  validateNewsletterDraft,
  type NewsletterCampaignType,
} from "@/lib/newsletter-preflight";
import {
  assertNewsletterSendingEnabled,
  NEWSLETTER_MONTHLY_LIMIT,
  newsletterPostalAddress,
  newsletterSendingEnabled,
} from "@/lib/newsletter-sending";

const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 5;
// One batch per minute gives delivery webhooks time to update the safety circuit
// breaker before another 100 recipients are released.
const DEFAULT_BATCHES_PER_RUN = 1;
const VALID_EMAIL_PATTERN = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$";

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
  preview_text: string | null;
  audience_filter: string | null;
  campaign_type: NewsletterCampaignType;
};

let campaignSchemaPromise: Promise<void> | null = null;

async function applyNewsletterCampaignSchema() {
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
      content_hash TEXT,
      audience_signature TEXT,
      approved_at TIMESTAMP,
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
  await sql`
    ALTER TABLE newsletter_subscribers
    ADD COLUMN IF NOT EXISTS consent_text_version TEXT
  `;
  await sql`
    ALTER TABLE newsletter_issues
    ADD COLUMN IF NOT EXISTS preview_text TEXT
  `;
  await sql`
    ALTER TABLE newsletter_issues
    ADD COLUMN IF NOT EXISTS campaign_type TEXT NOT NULL DEFAULT 'editorial'
  `;
  await sql`
    ALTER TABLE newsletter_issues
    ADD COLUMN IF NOT EXISTS test_sent_at TIMESTAMP
  `;
  await sql`
    ALTER TABLE newsletter_issues
    ADD COLUMN IF NOT EXISTS test_sent_to TEXT
  `;
  await sql`
    ALTER TABLE newsletter_issues
    ADD COLUMN IF NOT EXISTS test_content_hash TEXT
  `;
  await sql`
    ALTER TABLE newsletter_campaign_runs
    ADD COLUMN IF NOT EXISTS content_hash TEXT
  `;
  await sql`
    ALTER TABLE newsletter_campaign_runs
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP
  `;
  await sql`
    ALTER TABLE newsletter_campaign_runs
    ADD COLUMN IF NOT EXISTS audience_signature TEXT
  `;
}

export function ensureNewsletterCampaignSchema(): Promise<void> {
  if (!campaignSchemaPromise) {
    campaignSchemaPromise = applyNewsletterCampaignSchema().catch((error) => {
      campaignSchemaPromise = null;
      throw error;
    });
  }
  return campaignSchemaPromise;
}

async function campaignAudienceSnapshot(
  issueId: string,
  audienceFilter: string | null,
) {
  const sql = getDb();
  if (audienceFilter === "OUTBOUND_INTEREST") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND EXISTS (
          SELECT 1
          FROM portal_usage_events p
          WHERE lower(p.email) = lower(s.email)
            AND (
              p.resource_slug ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
              OR p.path ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
            )
        )
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  if (audienceFilter === "PORTAL_ACTIVE_30D") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND EXISTS (
          SELECT 1
          FROM portal_usage_events p
          WHERE lower(p.email) = lower(s.email)
            AND p.created_at >= NOW() - INTERVAL '30 days'
        )
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  if (audienceFilter === "RECENT_90D") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND s.subscribed_at >= NOW() - INTERVAL '90 days'
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  if (audienceFilter === "HOT" || audienceFilter === "WARM" || audienceFilter === "COLD") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND s.segment = ${audienceFilter}
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  if (audienceFilter === "ENGAGED") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND s.segment IN ('HOT', 'WARM')
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  if (audienceFilter === "UNSEGMENTED") {
    const rows = await sql`
      SELECT COUNT(*)::int AS count,
             md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
      FROM newsletter_subscribers s
      WHERE s.status = 'active'
        AND s.email ~* ${VALID_EMAIL_PATTERN}
        AND s.segment IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM newsletter_events e
          WHERE e.issue_id = ${issueId}
            AND e.subscriber_id = s.id
            AND e.event = 'sent'
        )
    `;
    return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
  }
  const rows = await sql`
    SELECT COUNT(*)::int AS count,
           md5(COALESCE(string_agg(s.id::text, ',' ORDER BY s.id), '')) AS signature
    FROM newsletter_subscribers s
    WHERE s.status = 'active'
      AND s.email ~* ${VALID_EMAIL_PATTERN}
      AND NOT EXISTS (
        SELECT 1 FROM newsletter_events e
        WHERE e.issue_id = ${issueId}
          AND e.subscriber_id = s.id
          AND e.event = 'sent'
      )
  `;
  return { count: Number(rows[0]?.count ?? 0), signature: String(rows[0]?.signature ?? "") };
}

async function currentMonthlyUsage() {
  const sql = getDb();
  const rows = await sql`
    SELECT
      (
        SELECT COUNT(*)::int
        FROM newsletter_campaign_deliveries
        WHERE status = 'sent'
          AND sent_at >= date_trunc('month', NOW())
      ) +
      (
        SELECT COUNT(*)::int
        FROM email_log
        WHERE sent_at >= date_trunc('month', NOW())
      ) AS used
  `;
  return Number(rows[0]?.used ?? 0);
}

export async function getNewsletterCampaignPreflight(issueId: string) {
  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, html, preview_text, audience_filter, campaign_type,
           test_sent_at, test_sent_to, test_content_hash
    FROM newsletter_issues
    WHERE id = ${issueId}
    LIMIT 1
  `;
  if (rows.length === 0) throw new Error("Issue not found");
  const issue = rows[0] as Issue & {
    test_sent_at: string | null;
    test_sent_to: string | null;
    test_content_hash: string | null;
  };
  const contentHash = newsletterContentHash({
    subject: issue.subject,
    previewText: issue.preview_text,
    html: issue.html,
    audienceFilter: issue.audience_filter,
    campaignType: issue.campaign_type,
  });
  const validation = validateNewsletterDraft({
    subject: issue.subject,
    previewText: issue.preview_text,
    html: issue.html,
    audienceFilter: issue.audience_filter,
    campaignType: issue.campaign_type,
  });
  const [audience, monthlyUsed] = await Promise.all([
    campaignAudienceSnapshot(issueId, issue.audience_filter),
    currentMonthlyUsage(),
  ]);
  const audienceCount = audience.count;
  const freshTest = Boolean(
    issue.test_sent_at && issue.test_content_hash && issue.test_content_hash === contentHash,
  );
  const errors = [...validation.errors];
  if (!freshTest) {
    errors.push({
      code: "test_required",
      message: "Send a fresh test after the latest content or audience change.",
    });
  }
  if (audienceCount === 0) {
    errors.push({ code: "audience_empty", message: "The selected audience is empty." });
  }
  if (monthlyUsed + audienceCount > NEWSLETTER_MONTHLY_LIMIT) {
    errors.push({
      code: "monthly_limit",
      message: `This campaign would exceed the ${NEWSLETTER_MONTHLY_LIMIT.toLocaleString()} monthly email limit.`,
    });
  }
  if (!newsletterSendingEnabled()) {
    errors.push({
      code: "sending_disabled",
      message: "Production sending is disabled by NEWSLETTER_EMAILS_ENABLED.",
    });
  }
  return {
    ...validation,
    errors,
    audienceCount,
    audienceSignature: audience.signature,
    monthlyUsed,
    monthlyLimit: NEWSLETTER_MONTHLY_LIMIT,
    monthlyRemaining: Math.max(0, NEWSLETTER_MONTHLY_LIMIT - monthlyUsed),
    expectedConfirmation: `LAUNCH ${audienceCount}`,
    contentHash,
    freshTest,
    testSentAt: issue.test_sent_at,
    testSentTo: issue.test_sent_to,
    sendingEnabled: newsletterSendingEnabled(),
  };
}

export async function controlNewsletterCampaign(
  issueId: string,
  action: CampaignAction,
  options: { confirmation?: string } = {},
) {
  await ensureNewsletterCampaignSchema();
  const sql = getDb();

  if (action === "start") {
    assertNewsletterSendingEnabled();
    const issues = await sql`
      SELECT id, subject, html, preview_text, audience_filter, campaign_type, status
      FROM newsletter_issues
      WHERE id = ${issueId}
      LIMIT 1
    `;
    if (issues.length === 0) throw new Error("Issue not found");
    const issue = issues[0];
    if (!process.env.RESEND_API_KEY) throw new Error("Resend API key is not configured");

    const preflight = await getNewsletterCampaignPreflight(issueId);
    if (preflight.errors.length > 0) {
      throw new Error(preflight.errors.map((finding) => finding.message).join(" "));
    }
    if (options.confirmation !== preflight.expectedConfirmation) {
      throw new Error(`Type ${preflight.expectedConfirmation} to approve this exact audience.`);
    }

    const existing = await sql`
      SELECT status FROM newsletter_campaign_runs WHERE issue_id = ${issueId} LIMIT 1
    `;
    if (existing.length > 0) {
      throw new Error("Campaign already exists. Resume or retry it instead.");
    }

    if (issue.audience_filter === "OUTBOUND_INTEREST") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND EXISTS (
            SELECT 1
            FROM portal_usage_events p
            WHERE lower(p.email) = lower(s.email)
              AND (
                p.resource_slug ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
                OR p.path ~* '(outbound|cold-email|lead-gen|lead-finder|agentic-sdr|revenue-leak)'
              )
          )
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else if (issue.audience_filter === "PORTAL_ACTIVE_30D") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND EXISTS (
            SELECT 1
            FROM portal_usage_events p
            WHERE lower(p.email) = lower(s.email)
              AND p.created_at >= NOW() - INTERVAL '30 days'
          )
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else if (issue.audience_filter === "RECENT_90D") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND s.subscribed_at >= NOW() - INTERVAL '90 days'
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else if (issue.audience_filter === "HOT" || issue.audience_filter === "WARM" || issue.audience_filter === "COLD") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND s.segment = ${issue.audience_filter}
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else if (issue.audience_filter === "ENGAGED") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND s.segment IN ('HOT', 'WARM')
          AND NOT EXISTS (
            SELECT 1 FROM newsletter_events e
            WHERE e.issue_id = ${issueId}
              AND e.subscriber_id = s.id
              AND e.event = 'sent'
          )
        ON CONFLICT (issue_id, subscriber_id) DO NOTHING
      `;
    } else if (issue.audience_filter === "UNSEGMENTED") {
      await sql`
        INSERT INTO newsletter_campaign_deliveries
          (issue_id, subscriber_id, email, unsub_token)
        SELECT ${issueId}, s.id, lower(s.email), s.unsub_token
        FROM newsletter_subscribers s
        WHERE s.status = 'active'
          AND s.email ~* ${VALID_EMAIL_PATTERN}
          AND s.segment IS NULL
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
          AND s.email ~* ${VALID_EMAIL_PATTERN}
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
      SELECT
        COUNT(*)::int AS total,
        md5(COALESCE(string_agg(subscriber_id::text, ',' ORDER BY subscriber_id), '')) AS signature
      FROM newsletter_campaign_deliveries
      WHERE issue_id = ${issueId}
    `;
    const total = Number(counts[0]?.total ?? 0);
    if (total === 0) throw new Error("No active subscribers for this audience");
    if (
      total !== preflight.audienceCount ||
      String(counts[0]?.signature ?? "") !== preflight.audienceSignature
    ) {
      await sql`DELETE FROM newsletter_campaign_deliveries WHERE issue_id = ${issueId}`;
      throw new Error("Audience changed during approval. Review the new count and approve again.");
    }

    await sql`
      INSERT INTO newsletter_campaign_runs
        (issue_id, status, total, content_hash, audience_signature, approved_at)
      VALUES (
        ${issueId},
        'queued',
        ${total},
        ${preflight.contentHash},
        ${preflight.audienceSignature},
        NOW()
      )
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

  await sql`
    UPDATE newsletter_campaign_deliveries
    SET status = 'failed',
        last_error = COALESCE(last_error, 'Retry limit reached'),
        updated_at = NOW()
    WHERE issue_id = ${issueId}
      AND status = 'processing'
      AND attempts >= ${MAX_ATTEMPTS}
  `;
  const retry = await sql`
    WITH retry_batch AS (
      SELECT batch_key
      FROM newsletter_campaign_deliveries
      WHERE issue_id = ${issueId}
        AND status = 'processing'
        AND batch_key IS NOT NULL
        AND attempts < ${MAX_ATTEMPTS}
      ORDER BY claimed_at
      LIMIT 1
    )
    UPDATE newsletter_campaign_deliveries d
    SET attempts = attempts + 1, claimed_at = NOW(), updated_at = NOW()
    FROM retry_batch
    WHERE d.issue_id = ${issueId}
      AND d.status = 'processing'
      AND d.batch_key = retry_batch.batch_key
    RETURNING d.subscriber_id, d.email, d.unsub_token::text, d.batch_key, d.attempts
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
  assertNewsletterSendingEnabled();
  const postalAddress = newsletterPostalAddress();
  const sql = getDb();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const emails = deliveries.map((delivery) => {
    const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${delivery.unsub_token}`;
    const prefsUrl = `${baseUrl}/preferences/${delivery.unsub_token}`;
    const confirmUrl = `${baseUrl}/newsletter/confirm/${issue.id}/${delivery.unsub_token}`;
    const html = wrapIssueHtml(issue.html, {
      unsubUrl,
      prefsUrl,
      confirmUrl,
      previewText: issue.preview_text,
      postalAddress,
    });
    const text = `${htmlToPlainText(issue.html)}\n\n--\nMuditek · Ghiles Moussaoui\n${postalAddress ? `${postalAddress}\n` : ""}You are receiving this because you subscribed to Muditek.\nManage preferences: ${prefsUrl}\nUnsubscribe: ${unsubUrl}`;
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
          last_error = ${message},
          claimed_at = NOW(),
          updated_at = NOW()
      WHERE issue_id = ${issue.id} AND batch_key = ${batchKey}
    `;
    throw new Error(message);
  }

  const items = result.data?.data ?? [];
  const accepted = deliveries.map((delivery, index) => ({
    subscriber_id: delivery.subscriber_id,
    resend_email_id: items[index]?.id ?? null,
  }));
  await sql`
    WITH accepted AS (
      SELECT subscriber_id, resend_email_id
      FROM jsonb_to_recordset(${JSON.stringify(accepted)}::jsonb)
        AS item(subscriber_id UUID, resend_email_id TEXT)
    ),
    updated AS (
      UPDATE newsletter_campaign_deliveries d
      SET status = 'sent',
          resend_email_id = accepted.resend_email_id,
          sent_at = NOW(),
          last_error = NULL,
          updated_at = NOW()
      FROM accepted
      WHERE d.issue_id = ${issue.id}
        AND d.subscriber_id = accepted.subscriber_id
        AND d.batch_key = ${batchKey}
      RETURNING d.subscriber_id, d.email, d.resend_email_id
    )
    INSERT INTO newsletter_events
      (subscriber_id, issue_id, email, event, resend_email_id, event_id)
    SELECT
      updated.subscriber_id,
      ${issue.id},
      updated.email,
      'sent',
      updated.resend_email_id,
      'local-sent:' || ${issue.id} || ':' || updated.subscriber_id::text
    FROM updated
    ON CONFLICT (event_id) DO NOTHING
  `;
}

async function processClaimedCampaign(issueId: string, baseUrl: string, maxBatches: number) {
  const sql = getDb();
  const issues = await sql`
    SELECT id, subject, html, preview_text, audience_filter, campaign_type
    FROM newsletter_issues
    WHERE id = ${issueId}
    LIMIT 1
  `;
  if (issues.length === 0) throw new Error("Issue not found");
  const issue = issues[0] as Issue;
  const runRows = await sql`
    SELECT content_hash FROM newsletter_campaign_runs WHERE issue_id = ${issueId} LIMIT 1
  `;
  const currentHash = newsletterContentHash({
    subject: issue.subject,
    previewText: issue.preview_text,
    html: issue.html,
    audienceFilter: issue.audience_filter,
    campaignType: issue.campaign_type,
  });
  if (!runRows[0]?.content_hash || runRows[0].content_hash !== currentHash) {
    throw new Error("Campaign content changed after approval. Start a new campaign.");
  }

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
    const monthlyUsed = await currentMonthlyUsage();
    if (monthlyUsed + deliveries.length > NEWSLETTER_MONTHLY_LIMIT) {
      throw new Error(
        `Automatically paused: monthly usage would exceed ${NEWSLETTER_MONTHLY_LIMIT.toLocaleString()} emails.`,
      );
    }

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
  assertNewsletterSendingEnabled();
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
  await ensureNewsletterCampaignSchema();
  const sql = getDb();
  const issues = await sql`
    SELECT id
    FROM newsletter_issues
    WHERE status = 'sent'
      AND sent_at < NOW() - INTERVAL '7 days'
      AND (
        campaign_type = 'reactivation'
        OR slug = 'reactivation-3-keep-sending'
      )
      AND NOT (COALESCE(stats, '{}'::jsonb) ? 'sunset_completed_at')
    ORDER BY sent_at
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
  await sql`
    UPDATE newsletter_issues
    SET stats = COALESCE(stats, '{}'::jsonb) ||
          jsonb_build_object('sunset_completed_at', NOW()::text),
        updated_at = NOW()
    WHERE id = ${issueId}
  `;
  return { dormant: Number(rows[0]?.count ?? 0) };
}
