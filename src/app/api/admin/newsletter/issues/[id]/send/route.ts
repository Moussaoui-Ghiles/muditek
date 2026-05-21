import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { sendIssue } from "@/lib/newsletter";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

  try {
    let limit: number | undefined;
    try {
      const body = await request.json();
      if (body?.limit !== undefined) {
        limit = Number(body.limit);
      }
    } catch {}
    if (limit !== undefined && (!Number.isFinite(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json({ error: "limit must be between 1 and 100" }, { status: 400 });
    }

    const result = await sendIssue(id, baseUrl, { limit });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Send failed" }, { status: 500 });
  }
}
