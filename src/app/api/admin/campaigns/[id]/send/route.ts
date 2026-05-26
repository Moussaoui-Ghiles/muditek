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
        "Legacy campaign delivery is archived. Send people to portal resource links instead.",
    },
    { status: 410 }
  );
}
