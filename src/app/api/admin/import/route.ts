import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const body = await request.json();
  const { rows } = body as { rows: { name: string; email: string }[] };

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided" }, { status: 400 });
  }

  const sql = getDb();

  let imported = 0;
  let skipped = 0;
  const seenEmails = new Set<string>();

  for (const row of rows) {
    const email = row.email?.trim()?.toLowerCase();
    const name = row.name?.trim();

    if (!email || !email.includes("@") || seenEmails.has(email)) {
      skipped++;
      continue;
    }

    seenEmails.add(email);

    try {
      const result = await sql`
        INSERT INTO newsletter_subscribers (email, source, status)
        VALUES (${email}, 'csv-import', 'active')
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;

      if (result.length === 0) {
        skipped++;
        continue;
      }

      imported++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ imported, skipped, total: rows.length });
}
