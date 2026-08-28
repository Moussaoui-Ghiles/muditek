import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getWorkflowJson } from "@/lib/workflow-archive";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return NextResponse.json({ error: "auth required" }, { status: 401 });
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
