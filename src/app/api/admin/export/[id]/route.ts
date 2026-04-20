import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const sql = getDb();

  const submissions = await sql`
    SELECT name, email, verified, delivered, created_at
    FROM submissions
    WHERE campaign_id = ${id}
    ORDER BY created_at DESC
  `;

  function escapeCsv(val: unknown): string {
    const str = String(val ?? "");
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const header = "name,email,verified,delivered,submitted_at";
  const rows = submissions.map(
    (s) =>
      `${escapeCsv(s.name)},${escapeCsv(s.email)},${s.verified},${s.delivered},${escapeCsv(s.created_at)}`
  );
  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="mudikit-export-${id}.csv"`,
    },
  });
}
