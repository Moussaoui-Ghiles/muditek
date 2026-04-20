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
    const result = await sendIssue(id, baseUrl);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Send failed" }, { status: 500 });
  }
}
