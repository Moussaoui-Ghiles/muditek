import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type AuthorizedAdminResult = {
  authorized: true;
  method: "clerk";
  email: string;
  userId: string;
};

type UnauthorizedAdminResult = {
  authorized: false;
  reason: "unauthorized" | "forbidden";
  response?: NextResponse;
};

export type AdminResult = AuthorizedAdminResult | UnauthorizedAdminResult;

export function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminAccess(_request?: Request): Promise<AdminResult> {
  const allowlist = getAdminEmailAllowlist();
  if (allowlist.length === 0) {
    return { authorized: false, reason: "unauthorized" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { authorized: false, reason: "unauthorized" };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return { authorized: false, reason: "unauthorized" };
  }

  if (!allowlist.includes(email.toLowerCase())) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true, method: "clerk", email, userId };
}

export async function requireAdmin(request?: Request): Promise<
  AuthorizedAdminResult | { authorized: false; response: NextResponse }
> {
  const access = await getAdminAccess(request);

  if (access.authorized) {
    return access;
  }

  const status = access.reason === "forbidden" ? 403 : 401;
  const error = status === 403 ? "Forbidden" : "Unauthorized";

  return {
    authorized: false,
    response: NextResponse.json({ error }, { status }),
  };
}
