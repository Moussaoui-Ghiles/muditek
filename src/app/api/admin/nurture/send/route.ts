import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  return NextResponse.json(
    {
      error:
        "Manual nurture sends are disabled. Nurture is controlled by the scheduled sequence and NURTURE_SEQUENCE_ENABLED.",
    },
    { status: 410 },
  );
}
