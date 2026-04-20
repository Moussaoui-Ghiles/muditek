import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      post_url TEXT NOT NULL,
      resource_url TEXT NOT NULL,
      keyword TEXT NOT NULL DEFAULT '',
      post_activity_id TEXT,
      ttl_days INTEGER DEFAULT 7,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP,
      last_processed_at TIMESTAMP
    )
  `;

  await sql`
    ALTER TABLE campaigns
    ADD COLUMN IF NOT EXISTS keyword TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS post_activity_id TEXT,
    ADD COLUMN IF NOT EXISTS last_processed_at TIMESTAMP
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID REFERENCES campaigns(id),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      comment TEXT,
      verified BOOLEAN DEFAULT false,
      delivered BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(campaign_id, email)
    )
  `;

  await sql`
    ALTER TABLE submissions
    ADD COLUMN IF NOT EXISTS comment TEXT
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS commenters (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id UUID REFERENCES campaigns(id),
      linkedin_name TEXT NOT NULL,
      linkedin_url TEXT,
      headline TEXT,
      comment_text TEXT,
      scraped_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(campaign_id, linkedin_name)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS deliveries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      submission_id UUID REFERENCES submissions(id),
      campaign_id UUID REFERENCES campaigns(id),
      email TEXT NOT NULL,
      resend_email_id TEXT,
      sent_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(campaign_id, email)
    )
  `;

  await sql`
    ALTER TABLE deliveries
    ADD COLUMN IF NOT EXISTS resend_email_id TEXT
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      stripe_customer_id TEXT UNIQUE,
      stripe_subscription_id TEXT UNIQUE,
      clerk_user_id TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      current_period_end TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      cancelled_at TIMESTAMP
    )
  `;

  await sql`
    ALTER TABLE subscribers
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS clerk_user_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP,
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS content_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      download_url TEXT NOT NULL,
      file_type TEXT DEFAULT 'zip',
      is_new BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE content_items
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'zip',
    ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sequence_sends (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      step INTEGER NOT NULL,
      sent_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(email, step)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS drops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      download_url TEXT NOT NULL,
      notified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT,
      resend_email_id TEXT,
      sent_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS email_log_sent_at_idx ON email_log (sent_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS email_log_type_idx ON email_log (type)`;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'active',
      source TEXT,
      topics TEXT[] DEFAULT ARRAY['ai-agents','gtm-systems','solo-operator'],
      stripe_customer_id TEXT,
      segment TEXT,
      lifetime_open_rate NUMERIC,
      lifetime_click_count INTEGER DEFAULT 0,
      subscribed_at TIMESTAMP DEFAULT NOW(),
      unsub_token UUID DEFAULT gen_random_uuid(),
      unsub_at TIMESTAMP
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS newsletter_subs_status_idx ON newsletter_subscribers (status)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_subs_segment_idx ON newsletter_subscribers (segment)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_subs_token_idx ON newsletter_subscribers (unsub_token)`;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_issues (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      markdown_src TEXT,
      html TEXT,
      resend_broadcast_id TEXT,
      audience_filter TEXT,
      status TEXT DEFAULT 'draft',
      scheduled_at TIMESTAMP,
      sent_at TIMESTAMP,
      stats JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS newsletter_issues_status_idx ON newsletter_issues (status)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_issues_sent_idx ON newsletter_issues (sent_at DESC)`;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
      issue_id UUID REFERENCES newsletter_issues(id) ON DELETE SET NULL,
      email TEXT,
      event TEXT NOT NULL,
      resend_email_id TEXT,
      event_id TEXT UNIQUE,
      ts TIMESTAMP DEFAULT NOW(),
      metadata JSONB
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS newsletter_events_sub_idx ON newsletter_events (subscriber_id)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_events_issue_idx ON newsletter_events (issue_id)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_events_event_idx ON newsletter_events (event)`;
  await sql`CREATE INDEX IF NOT EXISTS newsletter_events_ts_idx ON newsletter_events (ts DESC)`;

  return NextResponse.json({ success: true, message: "Schema ready" });
}
