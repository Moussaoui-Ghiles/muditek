import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { newsletterSendingEnabled } from "@/lib/newsletter-sending";
import {
  enrollNewsletterLifecycle,
  ensureNewsletterLifecycleSchema,
  processNewsletterLifecycle,
} from "@/lib/newsletter-lifecycle";
import { NEWSLETTER_CONSENT_VERSION } from "@/lib/newsletter-consent";

const VALID_TOPICS = new Set(["ai-agents", "gtm-systems", "solo-operator"]);

function coerceTopics(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((v) => (typeof v === "string" ? v.toLowerCase().trim() : ""))
    .filter((v) => VALID_TOPICS.has(v));
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    let source = String(body.source ?? body.utm_source ?? "").trim();
    if (!source && Array.isArray(body.tags)) {
      const match = body.tags.find(
        (t: unknown) => typeof t === "string" && t.startsWith("source:"),
      );
      if (match) source = String(match).slice(7);
    }
    source = (source || "homepage").slice(0, 50);

    const fromTopics = coerceTopics(body.topics);
    const fromTags = coerceTopics(body.tags);
    const chosen = fromTopics.length > 0 ? fromTopics : fromTags;
    const finalTopics = chosen.length > 0 ? chosen : Array.from(VALID_TOPICS);

    const sql = getDb();
    await ensureNewsletterLifecycleSchema();

    const existing = await sql`
      SELECT id, status FROM newsletter_subscribers WHERE email = ${email}
    `;

    if (existing.length > 0) {
      const rows = await sql`
        UPDATE newsletter_subscribers
        SET status = 'active',
            topics = ${finalTopics},
            unsub_at = NULL,
            consent_confirmed_at = NOW(),
            consent_source = ${`form:${source}`},
            consent_text_version = ${NEWSLETTER_CONSENT_VERSION}
        WHERE email = ${email}
        RETURNING id
      `;
      await enrollNewsletterLifecycle(String(rows[0].id));
      if (newsletterSendingEnabled()) {
        try {
          await processNewsletterLifecycle(
            process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com",
            String(rows[0].id),
          );
        } catch (error) {
          console.error("subscribe: welcome queued after immediate send failed", error);
        }
      }
      return NextResponse.json({ ok: true, resubscribed: true });
    }

    const inserted = await sql`
      INSERT INTO newsletter_subscribers
        (
          email,
          source,
          topics,
          consent_confirmed_at,
          consent_source,
          consent_text_version
        )
      VALUES
        (
          ${email},
          ${source},
          ${finalTopics},
          NOW(),
          ${`form:${source}`},
          ${NEWSLETTER_CONSENT_VERSION}
        )
      RETURNING id
    `;
    await enrollNewsletterLifecycle(String(inserted[0].id));
    if (newsletterSendingEnabled()) {
      try {
        await processNewsletterLifecycle(
          process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com",
          String(inserted[0].id),
        );
      } catch (error) {
        console.error("subscribe: welcome queued after immediate send failed", error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe error", err);
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
