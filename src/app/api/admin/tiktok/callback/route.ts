import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { exchangeTikTokCode, upsertTikTokAccount } from "@/lib/tiktok";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function callbackUrl(request: Request) {
  return (
    process.env.TIKTOK_REDIRECT_URI ||
    new URL("/api/admin/tiktok/callback", request.url).toString()
  );
}

function redirectToAdmin(request: Request, params: Record<string, string>) {
  const url = new URL("/admin/tiktok", request.url);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("tiktok_oauth_state="))
    ?.split("=")[1];
  const handleHint = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("tiktok_oauth_handle="))
    ?.split("=")[1];

  if (error) {
    return redirectToAdmin(request, { error });
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToAdmin(request, { error: "invalid_oauth_state" });
  }

  try {
    const token = await exchangeTikTokCode(code, callbackUrl(request));
    const account = await upsertTikTokAccount(
      getDb(),
      token,
      handleHint ? decodeURIComponent(handleHint) : null,
    );
    const response = redirectToAdmin(request, {
      connected: String(account.id),
    });
    response.cookies.delete("tiktok_oauth_state");
    response.cookies.delete("tiktok_oauth_handle");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "connect_failed";
    return redirectToAdmin(request, { error: message.slice(0, 120) });
  }
}
