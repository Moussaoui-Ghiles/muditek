import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  return NextResponse.json(
    {
      error:
        "Manual welcome-sequence sends are disabled. The sequence is controlled by the scheduled cron and WELCOME_SEQUENCE_ENABLED.",
    },
    { status: 410 },
  );
}
