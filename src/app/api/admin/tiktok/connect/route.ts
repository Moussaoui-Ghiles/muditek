import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { buildTikTokAuthorizeUrl } from "@/lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function callbackUrl(request: Request) {
  return (
    process.env.TIKTOK_REDIRECT_URI ||
    new URL("/api/admin/tiktok/callback", request.url).toString()
  );
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle")?.trim().replace(/^@/, "") || "";
  const state = crypto.randomUUID();
  const redirectUri = callbackUrl(request);
  const authUrl = buildTikTokAuthorizeUrl(state, redirectUri);
  const response = NextResponse.redirect(authUrl);

  response.cookies.set("tiktok_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });
  response.cookies.set("tiktok_oauth_handle", handle, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}
