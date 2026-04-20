import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { ensureUniqueSlug, renderIssueHtml } from "@/lib/newsletter";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const sql = getDb();
  const rows = await sql`
    SELECT id, subject, slug, status, audience_filter, scheduled_at, sent_at, stats, created_at, updated_at
    FROM newsletter_issues
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return NextResponse.json({ issues: rows });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const subject: string = String(body.subject ?? "").trim();
  if (!subject) return NextResponse.json({ error: "Subject required" }, { status: 400 });

  const markdown: string = String(body.markdown_src ?? "");
  const audienceFilter: string | null = body.audience_filter ?? null;
  const slug = await ensureUniqueSlug(subject);
  const html = renderIssueHtml(markdown);

  const sql = getDb();
  const rows = await sql`
    INSERT INTO newsletter_issues (subject, slug, markdown_src, html, audience_filter)
    VALUES (${subject}, ${slug}, ${markdown}, ${html}, ${audienceFilter})
    RETURNING id, subject, slug, status
  `;
  return NextResponse.json(rows[0]);
}
