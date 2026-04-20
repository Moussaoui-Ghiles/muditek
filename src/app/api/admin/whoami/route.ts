import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminEmailAllowlist } from "@/lib/admin-auth";

export async function GET() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    null;
  const allowlist = getAdminEmailAllowlist();
  return NextResponse.json({
    userId: userId ?? null,
    email,
    allowlist,
    allowlisted: email ? allowlist.includes(email.toLowerCase()) : false,
  });
}
