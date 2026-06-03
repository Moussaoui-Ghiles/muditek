import { put } from "@vercel/blob";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import sharp from "sharp";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

type Sql = NeonQueryFunction<false, false>;

const TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";
const TIKTOK_CONTENT_INIT_URL =
  "https://open.tiktokapis.com/v2/post/publish/content/init/";
const TIKTOK_STATUS_URL =
  "https://open.tiktokapis.com/v2/post/publish/status/fetch/";

const DEFAULT_SCOPES = "user.info.basic,video.upload";
const MAX_PHOTOS = 35;
const MAX_PHOTO_BYTES = 20 * 1024 * 1024;

export type TikTokAccount = {
  id: number;
  handle: string;
  display_name: string | null;
  avatar_url: string | null;
  open_id: string;
  access_token: string;
  refresh_token: string;
  access_expires: string | Date;
  refresh_expires: string | Date;
  scope: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type TikTokTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  open_id?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  log_id?: string;
};

type TikTokUserInfoResponse = {
  data?: {
    user?: {
      open_id?: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
  error?: {
    code?: string;
    message?: string;
    log_id?: string;
  };
};

type TikTokInitResponse = {
  data?: {
    publish_id?: string;
  };
  error?: {
    code?: string;
    message?: string;
    log_id?: string;
  };
};

export type TikTokStatus = {
  status: string;
  fail_reason?: string | null;
  downloaded_bytes?: number | null;
  uploaded_bytes?: number | null;
};

type TikTokStatusResponse = {
  data?: TikTokStatus;
  error?: {
    code?: string;
    message?: string;
    log_id?: string;
  };
};

export type TikTokPostResult = {
  publishId: string;
  status: TikTokStatus;
  requestPayload: Record<string, unknown>;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function expiresAt(seconds: number | undefined): Date {
  return new Date(Date.now() + Math.max(0, seconds ?? 0) * 1000);
}

function normalizeHandle(value: string | null | undefined): string {
  const cleaned = (value || "").trim().replace(/^@/, "");
  return cleaned || "connected-account";
}

function limitText(value: string, max: number): string {
  return Array.from(value).slice(0, max).join("");
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`TikTok returned non-JSON response: ${text.slice(0, 300)}`);
  }
}

function assertTikTokOk(
  response: Response,
  body:
    | TikTokInitResponse
    | TikTokStatusResponse
    | TikTokUserInfoResponse
    | TikTokTokenResponse,
  label: string,
) {
  const error =
    "error" in body && body.error && typeof body.error === "object"
      ? body.error
      : null;
  const code =
    error && "code" in error
      ? String(error.code || "")
      : "error" in body && typeof body.error === "string"
        ? body.error
        : "";
  const message =
    error && "message" in error
      ? String(error.message || "")
      : "error_description" in body
        ? String(body.error_description || "")
        : "";

  if (!response.ok || (code && code !== "ok")) {
    throw new Error(`${label} failed: ${code || response.status} ${message}`.trim());
  }
}

export function buildTikTokAuthorizeUrl(state: string, redirectUri: string) {
  const clientKey = requiredEnv("TIKTOK_CLIENT_KEY");
  const scopes = process.env.TIKTOK_SCOPES?.trim() || DEFAULT_SCOPES;
  const url = new URL(TIKTOK_AUTH_URL);
  url.searchParams.set("client_key", clientKey);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  return url;
}

export async function exchangeTikTokCode(code: string, redirectUri: string) {
  const body = new URLSearchParams({
    client_key: requiredEnv("TIKTOK_CLIENT_KEY"),
    client_secret: requiredEnv("TIKTOK_CLIENT_SECRET"),
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body,
  });
  const data = await readJson<TikTokTokenResponse>(response);
  assertTikTokOk(response, data, "TikTok token exchange");

  if (!data.access_token || !data.refresh_token || !data.open_id) {
    throw new Error("TikTok token exchange response is missing tokens.");
  }

  return data;
}

export async function refreshTikTokToken(refreshToken: string) {
  const body = new URLSearchParams({
    client_key: requiredEnv("TIKTOK_CLIENT_KEY"),
    client_secret: requiredEnv("TIKTOK_CLIENT_SECRET"),
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body,
  });
  const data = await readJson<TikTokTokenResponse>(response);
  assertTikTokOk(response, data, "TikTok token refresh");

  if (!data.access_token || !data.refresh_token || !data.open_id) {
    throw new Error("TikTok token refresh response is missing tokens.");
  }

  return data;
}

export async function fetchTikTokUserInfo(accessToken: string) {
  const url = new URL(TIKTOK_USER_INFO_URL);
  url.searchParams.set("fields", "open_id,avatar_url,display_name");
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await readJson<TikTokUserInfoResponse>(response);
  assertTikTokOk(response, data, "TikTok user info");
  return data.data?.user ?? null;
}

export async function upsertTikTokAccount(
  sql: Sql,
  token: TikTokTokenResponse,
  handleHint?: string | null,
) {
  await ensureTikTokSchema(sql);

  if (!token.access_token || !token.refresh_token || !token.open_id) {
    throw new Error("Cannot store an incomplete TikTok token bundle.");
  }

  const user = await fetchTikTokUserInfo(token.access_token).catch(() => null);
  const handle = normalizeHandle(handleHint || user?.display_name || token.open_id.slice(0, 8));
  const displayName = user?.display_name ?? handle;
  const avatarUrl = user?.avatar_url ?? null;
  const accessExpires = expiresAt(token.expires_in);
  const refreshExpires = expiresAt(token.refresh_expires_in);

  const rows = await sql`
    INSERT INTO tiktok_accounts (
      handle,
      display_name,
      avatar_url,
      open_id,
      access_token,
      refresh_token,
      access_expires,
      refresh_expires,
      scope
    )
    VALUES (
      ${handle},
      ${displayName},
      ${avatarUrl},
      ${token.open_id},
      ${token.access_token},
      ${token.refresh_token},
      ${accessExpires.toISOString()},
      ${refreshExpires.toISOString()},
      ${token.scope ?? null}
    )
    ON CONFLICT (open_id) DO UPDATE
    SET
      handle = EXCLUDED.handle,
      display_name = EXCLUDED.display_name,
      avatar_url = EXCLUDED.avatar_url,
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      access_expires = EXCLUDED.access_expires,
      refresh_expires = EXCLUDED.refresh_expires,
      scope = EXCLUDED.scope,
      updated_at = NOW()
    RETURNING id, handle, display_name, avatar_url, open_id, access_expires, refresh_expires, scope, created_at, updated_at
  `;

  return rows[0];
}

export async function ensureFreshTikTokAccount(sql: Sql, account: TikTokAccount) {
  const expires = new Date(account.access_expires).getTime();
  const needsRefresh = expires < Date.now() + 10 * 60 * 1000;
  if (!needsRefresh) return account;

  const refreshed = await refreshTikTokToken(account.refresh_token);
  const rows = await sql`
    UPDATE tiktok_accounts
    SET
      access_token = ${refreshed.access_token},
      refresh_token = ${refreshed.refresh_token},
      access_expires = ${expiresAt(refreshed.expires_in).toISOString()},
      refresh_expires = ${expiresAt(refreshed.refresh_expires_in).toISOString()},
      scope = ${refreshed.scope ?? account.scope},
      updated_at = NOW()
    WHERE id = ${account.id}
    RETURNING *
  `;

  return rows[0] as TikTokAccount;
}

export async function convertToTikTokJpeg(input: Buffer) {
  const qualities = [92, 85, 78, 70];
  let last: Buffer | null = null;

  for (const quality of qualities) {
    const output = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: 1080,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    last = output;
    if (output.length <= MAX_PHOTO_BYTES) return output;
  }

  throw new Error(
    `Converted slide is too large for TikTok (${Math.ceil((last?.length ?? 0) / 1024 / 1024)} MB).`,
  );
}

export async function uploadTikTokSlide({
  attemptId,
  index,
  input,
}: {
  attemptId: string;
  index: number;
  input: Buffer;
}) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  const jpeg = await convertToTikTokJpeg(input);
  const path = `tiktok/${attemptId}/slide-${String(index + 1).padStart(2, "0")}.jpg`;
  const blob = await put(path, jpeg, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
  });

  return blob.url;
}

async function fetchTikTokStatus(accessToken: string, publishId: string): Promise<TikTokStatus> {
  const response = await fetch(TIKTOK_STATUS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ publish_id: publishId }),
  });
  const data = await readJson<TikTokStatusResponse>(response);
  assertTikTokOk(response, data, "TikTok status fetch");
  return data.data ?? { status: "UNKNOWN" };
}

export async function sendTikTokPhotoDraft({
  accessToken,
  title,
  caption,
  photoUrls,
  coverIndex = 0,
}: {
  accessToken: string;
  title?: string | null;
  caption?: string | null;
  photoUrls: string[];
  coverIndex?: number;
}): Promise<TikTokPostResult> {
  if (photoUrls.length === 0) throw new Error("At least one slide is required.");
  if (photoUrls.length > MAX_PHOTOS) {
    throw new Error(`TikTok accepts at most ${MAX_PHOTOS} photos per carousel.`);
  }

  const requestPayload = {
    post_info: {
      ...(title ? { title: limitText(title, 90) } : {}),
      ...(caption ? { description: limitText(caption, 4000) } : {}),
    },
    source_info: {
      source: "PULL_FROM_URL",
      photo_cover_index: Math.max(0, Math.min(coverIndex, photoUrls.length - 1)),
      photo_images: photoUrls,
    },
    post_mode: "MEDIA_UPLOAD",
    media_type: "PHOTO",
  };

  const response = await fetch(TIKTOK_CONTENT_INIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(requestPayload),
  });
  const data = await readJson<TikTokInitResponse>(response);
  assertTikTokOk(response, data, "TikTok draft init");

  const publishId = data.data?.publish_id;
  if (!publishId) throw new Error("TikTok did not return a publish_id.");

  let status: TikTokStatus = { status: "PROCESSING_DOWNLOAD" };
  for (let i = 0; i < 12; i++) {
    await new Promise((resolve) => setTimeout(resolve, i === 0 ? 1200 : 3000));
    status = await fetchTikTokStatus(accessToken, publishId);
    if (
      status.status === "SEND_TO_USER_INBOX" ||
      status.status === "PUBLISH_COMPLETE" ||
      status.status === "FAILED"
    ) {
      break;
    }
  }

  return { publishId, status, requestPayload };
}
