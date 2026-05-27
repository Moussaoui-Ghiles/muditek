import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { countArchive, listArchive, type ArchiveFormat, type ArchiveQuery, type UseCaseId } from "@/lib/workflow-archive";

export const dynamic = "force-dynamic";

const VALID_USE_CASES = new Set([
  "ai", "lead-gen", "sales", "marketing", "content", "comms", "data", "storage", "ecommerce",
]);

export async function GET(req: Request) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return NextResponse.json({ items: [], total: 0 }, { status: 401 });

  const u = new URL(req.url);
  const formatsParam = u.searchParams.getAll("format").filter((f) => f === "n8n" || f === "make") as ArchiveFormat[];
  const useCases = u.searchParams.getAll("use_case").filter((u) => VALID_USE_CASES.has(u)) as UseCaseId[];
  const query: ArchiveQuery = {
    formats: formatsParam.length ? formatsParam : undefined,
    use_cases: useCases.length ? useCases : undefined,
    search: u.searchParams.get("q"),
    limit: Number(u.searchParams.get("limit") ?? 200),
    offset: Number(u.searchParams.get("offset") ?? 0),
  };

  const [items, total] = await Promise.all([
    listArchive(query),
    countArchive(query),
  ]);
  return NextResponse.json({ items, total });
}
