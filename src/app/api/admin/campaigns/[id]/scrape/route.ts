import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;
  await params;

  return NextResponse.json(
    {
      error:
        "Legacy LinkedIn comment scraping is archived. Resource acquisition now happens through portal links.",
    },
    { status: 410 }
  );
}
