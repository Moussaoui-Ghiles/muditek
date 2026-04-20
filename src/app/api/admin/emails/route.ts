import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type EmailType = "all" | "deliveries" | "nurture" | "welcome" | "drop";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const url = new URL(request.url);
  const type = (url.searchParams.get("type") || "all") as EmailType;

  const sql = getDb();

  const queries: Promise<{ email: string; type: string; subject: string | null; resend_email_id: string | null; sent_at: string }[]>[] = [];

  if (type === "all" || type === "deliveries") {
    queries.push(sql`
      SELECT
        d.email,
        'lead-magnet' AS type,
        c.title AS subject,
        d.resend_email_id,
        d.sent_at
      FROM deliveries d
      LEFT JOIN campaigns c ON c.id = d.campaign_id
    ` as unknown as Promise<{ email: string; type: string; subject: string | null; resend_email_id: string | null; sent_at: string }[]>);
  }

  if (type === "all" || type === "nurture") {
    queries.push(sql`
      SELECT
        email,
        'nurture-step-' || step AS type,
        'Nurture step ' || step AS subject,
        NULL AS resend_email_id,
        sent_at
      FROM sequence_sends
    ` as unknown as Promise<{ email: string; type: string; subject: string | null; resend_email_id: string | null; sent_at: string }[]>);
  }

  if (type === "all" || type === "welcome" || type === "drop") {
    const typeFilter = type === "all" ? null : type;
    queries.push(
      (typeFilter
        ? sql`
            SELECT email, type, subject, resend_email_id, sent_at
            FROM email_log
            WHERE type = ${typeFilter}
          `
        : sql`
            SELECT email, type, subject, resend_email_id, sent_at
            FROM email_log
          `) as unknown as Promise<{ email: string; type: string; subject: string | null; resend_email_id: string | null; sent_at: string }[]>
    );
  }

  const results = await Promise.all(queries);
  const combined = results.flat();

  combined.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

  return NextResponse.json({ emails: combined.slice(0, 500) });
}
