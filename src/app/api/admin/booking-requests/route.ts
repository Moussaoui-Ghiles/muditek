import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listBookingRequests } from "@/lib/booking-requests";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const requests = await listBookingRequests(300);
  return NextResponse.json({ requests });
}
