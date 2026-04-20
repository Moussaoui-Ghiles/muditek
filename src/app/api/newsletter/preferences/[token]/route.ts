import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const VALID_TOPICS = new Set(["ai-agents", "gtm-systems", "solo-operator"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
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
  const body = await request.json();
  const sql = getDb();

  if (body.action === "unsub") {
    await sql`
      UPDATE newsletter_subscribers
      SET status = 'unsub', unsub_at = NOW()
      WHERE unsub_token = ${token}
    `;
    return NextResponse.json({ ok: true, action: "unsub" });
  }

  const topics: string[] = Array.isArray(body.topics) ? body.topics : [];
  const cleanTopics = topics.filter((t) => VALID_TOPICS.has(t));
  if (cleanTopics.length === 0) {
    return NextResponse.json({ error: "At least 1 topic required" }, { status: 400 });
  }
  await sql`
    UPDATE newsletter_subscribers
    SET topics = ${cleanTopics}
    WHERE unsub_token = ${token}
  `;
  return NextResponse.json({ ok: true, topics: cleanTopics });
}
