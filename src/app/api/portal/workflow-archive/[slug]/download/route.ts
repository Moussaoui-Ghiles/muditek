import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getWorkflowJson } from "@/lib/workflow-archive";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;
  const json = await getWorkflowJson(slug);
  if (json == null) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = JSON.stringify(json, null, 2);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.json"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
