import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import {
  ensureFreshTikTokAccount,
  sendTikTokPhotoDraft,
  uploadTikTokSlide,
  type TikTokAccount,
} from "@/lib/tiktok";
import { ensureTikTokSchema } from "@/lib/tiktok-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MAX_INPUT_BYTES = 30 * 1024 * 1024;

async function requireTikTokPosterAccess(request: Request) {
  const apiKey = process.env.TIKTOK_POSTER_API_KEY?.trim();
  const authHeader = request.headers.get("authorization");
  if (apiKey && authHeader === `Bearer ${apiKey}`) {
    return { authorized: true as const, method: "api-key" as const };
  }

  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin;
  return { authorized: true as const, method: "clerk" as const, email: admin.email };
}

function formString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formNumber(form: FormData, key: string) {
  const value = Number(formString(form, key));
  return Number.isFinite(value) ? value : null;
}

function getSlideFiles(form: FormData) {
  const values = [...form.getAll("slides"), ...form.getAll("slides[]")];
  return values.filter((value): value is File => {
    if (typeof File !== "undefined") return value instanceof File;
    return value instanceof Blob && "name" in value;
  });
}

async function loadAccount({
  sql,
  accountId,
  accountHandle,
}: {
  sql: ReturnType<typeof getDb>;
  accountId: number | null;
  accountHandle: string;
}) {
  if (accountId) {
    const rows = await sql`
      SELECT *
      FROM tiktok_accounts
      WHERE id = ${accountId}
      LIMIT 1
    `;
    return rows[0] as TikTokAccount | undefined;
  }

  if (accountHandle) {
    const handle = accountHandle.replace(/^@/, "").toLowerCase();
    const rows = await sql`
      SELECT *
      FROM tiktok_accounts
      WHERE lower(handle) = ${handle}
      LIMIT 1
    `;
    return rows[0] as TikTokAccount | undefined;
  }

  const rows = await sql`
    SELECT *
    FROM tiktok_accounts
    ORDER BY created_at ASC
    LIMIT 2
  `;
  if (rows.length === 1) return rows[0] as TikTokAccount;
  if (rows.length > 1) {
    throw new Error("Multiple TikTok accounts are connected. Send accountId or account handle.");
  }
  return undefined;
}

export async function POST(request: Request) {
  const access = await requireTikTokPosterAccess(request);
  if (!access.authorized) return access.response;

  const sql = getDb();
  await ensureTikTokSchema(sql);

  const form = await request.formData();
  const files = getSlideFiles(form);
  const title = formString(form, "title");
  const caption = formString(form, "caption");
  const sourceLabel = formString(form, "sourceLabel") || formString(form, "source_label");
  const accountHandle = formString(form, "account") || formString(form, "accountHandle");
  const accountId = formNumber(form, "accountId") || formNumber(form, "account_id");
  const coverIndex = formNumber(form, "coverIndex") ?? 0;

  if (files.length === 0) {
    return NextResponse.json({ error: "At least one slide file is required." }, { status: 400 });
  }
  if (files.length > 35) {
    return NextResponse.json({ error: "TikTok accepts at most 35 photos." }, { status: 400 });
  }
  for (const file of files) {
    if (file.size > MAX_INPUT_BYTES) {
      return NextResponse.json(
        { error: `${file.name || "slide"} is too large before conversion.` },
        { status: 413 },
      );
    }
  }

  let loadedAccount: TikTokAccount | undefined;
  try {
    loadedAccount = await loadAccount({ sql, accountId, accountHandle });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TikTok account selection failed." },
      { status: 400 },
    );
  }
  if (!loadedAccount) {
    return NextResponse.json(
      { error: "TikTok account not found. Connect an account in /admin/tiktok first." },
      { status: 404 },
    );
  }

  const attemptRows = await sql`
    INSERT INTO tiktok_post_attempts (
      account_id,
      account_handle,
      source_label,
      title,
      caption,
      image_count,
      status
    )
    VALUES (
      ${loadedAccount.id},
      ${loadedAccount.handle},
      ${sourceLabel || null},
      ${title || null},
      ${caption || null},
      ${files.length},
      'created'
    )
    RETURNING id
  `;
  const attemptId = String(attemptRows[0].id);

  try {
    const account = await ensureFreshTikTokAccount(sql, loadedAccount);
    await sql`
      UPDATE tiktok_post_attempts
      SET status = 'uploading', updated_at = NOW()
      WHERE id = ${attemptId}
    `;

    const blobUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(await files[i].arrayBuffer());
      const url = await uploadTikTokSlide({ attemptId, index: i, input: buffer });
      blobUrls.push(url);
    }

    await sql`
      UPDATE tiktok_post_attempts
      SET blob_urls = ${JSON.stringify(blobUrls)}::jsonb,
          status = 'processing_download',
          updated_at = NOW()
      WHERE id = ${attemptId}
    `;

    const result = await sendTikTokPhotoDraft({
      accessToken: account.access_token,
      title: title || sourceLabel || null,
      caption: caption || null,
      photoUrls: blobUrls,
      coverIndex,
    });

    await sql`
      UPDATE tiktok_post_attempts
      SET publish_id = ${result.publishId},
          status = ${result.status.status},
          fail_reason = ${result.status.fail_reason ?? null},
          request_payload = ${JSON.stringify(result.requestPayload)}::jsonb,
          updated_at = NOW()
      WHERE id = ${attemptId}
    `;

    return NextResponse.json({
      attemptId,
      account: {
        id: loadedAccount.id,
        handle: loadedAccount.handle,
      },
      publishId: result.publishId,
      status: result.status,
      imageCount: blobUrls.length,
    }, { status: result.status.status === "FAILED" ? 502 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TikTok draft failed.";
    await sql`
      UPDATE tiktok_post_attempts
      SET status = 'failed',
          error_message = ${message},
          updated_at = NOW()
      WHERE id = ${attemptId}
    `;
    return NextResponse.json({ error: message, attemptId }, { status: 500 });
  }
}
