import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO, wrapIssueHtml } from "@/lib/newsletter";
import { Resend } from "resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const body = await request.json();
  const to: string = String(body.to ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, html FROM newsletter_issues WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const issue = rows[0];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const html = wrapIssueHtml(issue.html ?? "", {
    unsubUrl: `${baseUrl}/api/newsletter/unsubscribe/TEST`,
    prefsUrl: `${baseUrl}/preferences/TEST`,
    webUrl: `${baseUrl}/newsletter/${issue.slug}`,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject: `[TEST] ${issue.subject}`,
    html,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, email_id: data?.id });
}
