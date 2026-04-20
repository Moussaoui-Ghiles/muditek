import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const VALID_TOPICS = new Set(["ai-agents", "gtm-systems", "solo-operator"]);

function coerceTopics(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((v) => (typeof v === "string" ? v.toLowerCase().trim() : ""))
    .filter((v) => VALID_TOPICS.has(v));
}

export async function POST(request: Request) {
  try {
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

    const existing = await sql`
      SELECT id, status FROM newsletter_subscribers WHERE email = ${email}
    `;

    if (existing.length > 0) {
      await sql`
        UPDATE newsletter_subscribers
        SET status = 'active', topics = ${finalTopics}, unsub_at = NULL
        WHERE email = ${email}
      `;
      return NextResponse.json({ ok: true, resubscribed: true });
    }

    await sql`
      INSERT INTO newsletter_subscribers (email, source, topics)
      VALUES (${email}, ${source}, ${finalTopics})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe error", err);
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
