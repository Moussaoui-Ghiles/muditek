import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  return NextResponse.json(
    {
      error:
        "Manual lifecycle sends are disabled. Confirmed signups are processed by the durable newsletter lifecycle queue.",
    },
    { status: 410 },
  );
}
