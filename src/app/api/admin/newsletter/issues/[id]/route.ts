import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { renderIssueHtml } from "@/lib/newsletter";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, markdown_src, html, status, audience_filter, scheduled_at, sent_at, stats, created_at, updated_at, resend_broadcast_id
    FROM newsletter_issues WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const body = await request.json();

  const sql = getDb();
  const cur = await sql`SELECT status FROM newsletter_issues WHERE id = ${id} LIMIT 1`;
  if (cur.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cur[0].status === "sent") return NextResponse.json({ error: "Cannot edit sent issue" }, { status: 409 });

  const subject: string | undefined = body.subject;
  const markdown: string | undefined = body.markdown_src;
  const audienceFilter: string | null | undefined = body.audience_filter;

  const html = markdown !== undefined ? renderIssueHtml(markdown) : undefined;

  const rows = await sql`
    UPDATE newsletter_issues
    SET
      subject = COALESCE(${subject ?? null}, subject),
      markdown_src = COALESCE(${markdown ?? null}, markdown_src),
      html = COALESCE(${html ?? null}, html),
      audience_filter = ${audienceFilter !== undefined ? audienceFilter : null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, subject, slug, status, audience_filter
  `;
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();
  const cur = await sql`SELECT status FROM newsletter_issues WHERE id = ${id} LIMIT 1`;
  if (cur.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cur[0].status === "sent") return NextResponse.json({ error: "Cannot delete sent issue" }, { status: 409 });
  await sql`DELETE FROM newsletter_issues WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
