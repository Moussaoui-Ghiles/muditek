import TikTokContent from "./tiktok-content";
import { getDb } from "@/lib/db";
import {
  serializeTikTokPosterApiKey,
  type TikTokPosterApiKeyRow,
} from "@/lib/tiktok-api-keys";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function dateString(value: unknown): string | null {
  if (!value) return null;
  return new Date(value as string | Date).toISOString();
}

function searchValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminTikTokPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const sql = getDb();
  let accounts: Array<Record<string, unknown>> = [];
  let attempts: Array<Record<string, unknown>> = [];
  let apiKeys: Array<Record<string, unknown>> = [];
  let databaseError: string | null = null;

  try {
    await ensureTikTokSchema(sql);
    accounts = await sql`
      SELECT
        id,
        handle,
        display_name,
        avatar_url,
        open_id,
        access_expires,
        refresh_expires,
        scope,
        updated_at
      FROM tiktok_accounts
      ORDER BY updated_at DESC
    `;
    attempts = await sql`
      SELECT
        p.id,
        p.account_id,
        COALESCE(a.handle, p.account_handle) AS account_handle,
        p.source_label,
        p.title,
        p.caption,
        p.image_count,
        p.blob_urls,
        p.publish_id,
        p.status,
        p.fail_reason,
        p.error_message,
        p.created_at,
        p.updated_at
      FROM tiktok_post_attempts p
      LEFT JOIN tiktok_accounts a ON a.id = p.account_id
      ORDER BY p.created_at DESC
      LIMIT 40
    `;
    apiKeys = await sql`
      SELECT
        id,
        name,
        key_prefix,
        created_by,
        last_used_at,
        revoked_at,
        created_at,
        updated_at
      FROM tiktok_poster_api_keys
      ORDER BY created_at DESC
      LIMIT 50
    `;
  } catch (err) {
    databaseError = err instanceof Error ? err.message : "TikTok data could not load.";
  }

  return (
    <main className="min-h-[calc(100dvh-3rem)] overflow-x-hidden bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Acquisition
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              TikTok draft sender.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Connect owned TikTok accounts, upload slideshow drafts, then finish sound, native text, and publishing inside TikTok.
            </p>
          </div>
        </header>

        <TikTokContent
          accounts={accounts.map((account) => ({
            id: Number(account.id),
            handle: String(account.handle),
            displayName: account.display_name ? String(account.display_name) : null,
            avatarUrl: account.avatar_url ? String(account.avatar_url) : null,
            openId: String(account.open_id),
            accessExpires: dateString(account.access_expires),
            refreshExpires: dateString(account.refresh_expires),
            scope: account.scope ? String(account.scope) : null,
            updatedAt: dateString(account.updated_at),
          }))}
          attempts={attempts.map((attempt) => ({
            id: String(attempt.id),
            accountId: attempt.account_id ? Number(attempt.account_id) : null,
            accountHandle: attempt.account_handle ? String(attempt.account_handle) : null,
            sourceLabel: attempt.source_label ? String(attempt.source_label) : null,
            title: attempt.title ? String(attempt.title) : null,
            caption: attempt.caption ? String(attempt.caption) : null,
            imageCount: Number(attempt.image_count ?? 0),
            blobUrls: Array.isArray(attempt.blob_urls) ? attempt.blob_urls.map(String) : [],
            publishId: attempt.publish_id ? String(attempt.publish_id) : null,
            status: String(attempt.status),
            failReason: attempt.fail_reason ? String(attempt.fail_reason) : null,
            errorMessage: attempt.error_message ? String(attempt.error_message) : null,
            createdAt: dateString(attempt.created_at),
            updatedAt: dateString(attempt.updated_at),
          }))}
          apiKeys={apiKeys.map((apiKey) =>
            serializeTikTokPosterApiKey(apiKey as TikTokPosterApiKeyRow),
          )}
          env={{
            clientKey: Boolean(process.env.TIKTOK_CLIENT_KEY),
            clientSecret: Boolean(process.env.TIKTOK_CLIENT_SECRET),
            redirectUri: process.env.TIKTOK_REDIRECT_URI || "derived from request",
            posterApiKey: Boolean(process.env.TIKTOK_POSTER_API_KEY),
            blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
          }}
          baseUrl={process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com"}
          databaseError={databaseError}
          notice={{
            connected: searchValue(params, "connected") || null,
            error: searchValue(params, "error") || null,
          }}
        />
      </div>
    </main>
  );
}
