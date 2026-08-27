import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const VALID_TOPICS = new Set(["ai-agents", "gtm-systems", "solo-operator"]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalidToken(token: string) {
  return !UUID_PATTERN.test(token);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (invalidToken(token)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const sql = getDb();
  const rows = await sql`
    SELECT email, status, topics FROM newsletter_subscribers
    WHERE unsub_token = ${token}
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (invalidToken(token)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const sql = getDb();

  if (body.action === "unsub") {
    const rows = await sql`
      UPDATE newsletter_subscribers
      SET status = 'unsub', unsub_at = NOW()
      WHERE unsub_token = ${token}
      RETURNING id
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, action: "unsub" });
  }

  if (body.action === "resubscribe") {
    const rows = await sql`
      UPDATE newsletter_subscribers
      SET status = 'active', unsub_at = NULL
      WHERE unsub_token = ${token}
      RETURNING id, topics
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, action: "resubscribe", topics: rows[0].topics ?? [] });
  }

  const topics: string[] = Array.isArray(body.topics) ? body.topics : [];
  const cleanTopics = topics.filter((t) => VALID_TOPICS.has(t));
  if (cleanTopics.length === 0) {
    return NextResponse.json({ error: "At least 1 topic required" }, { status: 400 });
  }
  const rows = await sql`
    UPDATE newsletter_subscribers
    SET topics = ${cleanTopics}
    WHERE unsub_token = ${token}
    RETURNING id
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, topics: cleanTopics });
}
