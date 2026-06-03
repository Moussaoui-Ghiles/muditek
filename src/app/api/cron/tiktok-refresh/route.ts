import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { refreshTikTokToken } from "@/lib/tiktok";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  await ensureTikTokSchema(sql);

  const accounts = await sql`
    SELECT id, handle, refresh_token
    FROM tiktok_accounts
    WHERE access_expires < NOW() + INTERVAL '6 hours'
      AND refresh_expires > NOW() + INTERVAL '1 day'
    ORDER BY access_expires ASC
  `;

  let refreshed = 0;
  const errors: Array<{ id: number; handle: string; error: string }> = [];

  for (const account of accounts) {
    try {
      const token = await refreshTikTokToken(String(account.refresh_token));
      await sql`
        UPDATE tiktok_accounts
        SET access_token = ${token.access_token},
            refresh_token = ${token.refresh_token},
            access_expires = ${new Date(Date.now() + Number(token.expires_in ?? 0) * 1000).toISOString()},
            refresh_expires = ${new Date(Date.now() + Number(token.refresh_expires_in ?? 0) * 1000).toISOString()},
            scope = ${token.scope ?? null},
            updated_at = NOW()
        WHERE id = ${account.id}
      `;
      refreshed++;
    } catch (err) {
      errors.push({
        id: Number(account.id),
        handle: String(account.handle),
        error: err instanceof Error ? err.message : "Refresh failed",
      });
    }
  }

  return NextResponse.json({
    checked: accounts.length,
    refreshed,
    errors,
  });
}
