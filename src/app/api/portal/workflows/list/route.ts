import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listWorkflows, type WorkflowQuery } from "@/lib/workflow-loader";
import type { WorkflowFormat } from "@/lib/workflow-parse";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return NextResponse.json({ items: [] }, { status: 401 });

  const u = new URL(req.url);
  const query: WorkflowQuery = {
    limit: Number(u.searchParams.get("limit") ?? 60),
    offset: Number(u.searchParams.get("offset") ?? 0),
    format: (u.searchParams.get("format") as WorkflowFormat | "all" | null) || "all",
    app: u.searchParams.get("app"),
    search: u.searchParams.get("q"),
    sort: (u.searchParams.get("sort") as WorkflowQuery["sort"]) || "newest",
    named_only: u.searchParams.get("named") === "1",
  };

  const items = await listWorkflows(query);
  return NextResponse.json({ items });
}
