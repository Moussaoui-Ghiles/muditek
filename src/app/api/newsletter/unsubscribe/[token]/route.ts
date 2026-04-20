import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

async function unsub(token: string) {
  const sql = getDb();
  await sql`
    UPDATE newsletter_subscribers
    SET status = 'unsub', unsub_at = NOW()
    WHERE unsub_token = ${token}
  `;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  await unsub(token);
  return NextResponse.json({ ok: true });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  await unsub(token);
  return NextResponse.redirect(
    new URL(`/preferences/${token}?unsubscribed=1`, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
}
