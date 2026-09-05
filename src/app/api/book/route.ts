import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendFreeWelcomeEmail } from "@/lib/email-templates";
import { notifyBookingRequest, parseBookingRequest, saveBookingRequest } from "@/lib/booking-requests";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

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

async function subscribeToNewsletter(email: string) {
  const sql = getDb();
  const inserted = await sql`
    INSERT INTO newsletter_subscribers (email, source, topics)
    VALUES (${email}, ${"book"}, ARRAY['ai-agents','gtm-systems','solo-operator'])
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  await sql`UPDATE newsletter_subscribers SET status = 'active', unsub_at = NULL WHERE email = ${email}`;
  if (inserted.length > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
    await sendFreeWelcomeEmail(email, null, baseUrl);
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Could not read the form." }, { status: 400 });
  }
  // Honeypot: real people never see this field.
  if (typeof body.company_fax === "string" && body.company_fax.trim()) {
    return NextResponse.json({ ok: true });
  }

  const parsed = parseBookingRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error, field: parsed.field }, { status: 400 });
  }

  try {
    const { id, fit } = await saveBookingRequest(parsed.input);

    try {
      await notifyBookingRequest(parsed.input, fit);
    } catch (error) {
      console.error("book: notification email failed", error);
    }

    if (parsed.input.newsletter) {
      try {
        await subscribeToNewsletter(parsed.input.email);
      } catch (error) {
        console.error("book: newsletter subscribe failed", error);
      }
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("book: save failed", error);
    return NextResponse.json({ error: "Could not save your answers. Email biz@ghiless.com instead." }, { status: 500 });
  }
}
