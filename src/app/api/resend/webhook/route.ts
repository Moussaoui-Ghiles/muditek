import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Webhook } from "svix";

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });

  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: any;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, headers);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const type: string = event.type ?? "";
  const data = event.data ?? {};
  const eventId: string | undefined = data.email_id ?? event.id;
  const to: string | undefined = Array.isArray(data.to) ? data.to[0] : data.to;
  const broadcastId: string | undefined = data.broadcast_id;

  const sql = getDb();

  const issueRows = broadcastId
    ? await sql`SELECT id FROM newsletter_issues WHERE resend_broadcast_id = ${broadcastId} LIMIT 1`
    : [];
  const issueId: string | null = issueRows[0]?.id ?? null;

  const subRows = to
    ? await sql`SELECT id FROM newsletter_subscribers WHERE email = ${to.toLowerCase()} LIMIT 1`
    : [];
  const subscriberId: string | null = subRows[0]?.id ?? null;

  const eventType = type.replace(/^email\./, "").replace(/^contact\./, "");

  try {
    await sql`
      INSERT INTO newsletter_events (subscriber_id, issue_id, email, event, resend_email_id, event_id, metadata)
      VALUES (${subscriberId}, ${issueId}, ${to ?? null}, ${eventType}, ${data.email_id ?? null}, ${eventId ?? null}, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (event_id) DO NOTHING
    `;

    if (eventType === "bounced" || eventType === "complained") {
      if (to) {
        await sql`
          UPDATE newsletter_subscribers
          SET status = ${eventType === "bounced" ? "bounced" : "complained"}
          WHERE email = ${to.toLowerCase()}
        `;
      }
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
