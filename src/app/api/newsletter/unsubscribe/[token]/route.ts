import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function unsub(token: string) {
  if (!UUID_PATTERN.test(token)) return false;
  const sql = getDb();
  const rows = await sql`
    UPDATE newsletter_subscribers
    SET status = 'unsub', unsub_at = NOW()
    WHERE unsub_token = ${token}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!(await unsub(token))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!(await unsub(token))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.redirect(
    new URL(`/preferences/${token}?unsubscribed=1`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
}
