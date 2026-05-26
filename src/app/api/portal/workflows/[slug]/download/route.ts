import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { ensureWorkflowsSchema } from "@/lib/workflows-schema";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "auth required" }, { status: 401 });
  }

  const sql = getDb();
  await ensureWorkflowsSchema(sql);
  const rows = (await sql`SELECT raw_json, format FROM workflows WHERE slug = ${slug} LIMIT 1`) as Array<{
    raw_json: unknown;
    format: string;
  }>;
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = JSON.stringify(rows[0].raw_json, null, 2);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.json"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
