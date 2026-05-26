import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/html",
]);
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const INLINE_FALLBACK_MAX_BYTES = 750 * 1024;

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const form = await request.formData();
  const file = form.get("file");
  const purpose = String(form.get("purpose") || "newsletter");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const name = (file as File).name || "upload";
  const mime = file.type || "application/octet-stream";

  const isHtmlByName = name.toLowerCase().endsWith(".html") || name.toLowerCase().endsWith(".htm");
  const normalizedMime = isHtmlByName && mime === "application/octet-stream" ? "text/html" : mime;

  if (!ALLOWED_MIME.has(normalizedMime)) {
    return NextResponse.json(
      { error: `Unsupported type: ${mime}` },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 413 },
    );
  }

  const isImage = normalizedMime.startsWith("image/");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (!isImage) {
      return NextResponse.json(
        {
          error:
            "File uploads need BLOB_READ_WRITE_TOKEN. Connect Vercel Blob before uploading PDF or HTML resources.",
        },
        { status: 503 },
      );
    }
    if (file.size > INLINE_FALLBACK_MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            "Image hosting is not configured and this file is too large to inline. Add BLOB_READ_WRITE_TOKEN in Vercel Blob, or upload an image under 750 KB.",
        },
        { status: 413 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    return NextResponse.json({
      url: `data:${normalizedMime};base64,${bytes.toString("base64")}`,
      storage: "inline",
      warning:
        "BLOB_READ_WRITE_TOKEN is missing. Image was inlined; connect Vercel Blob for production image hosting.",
    });
  }

  const ext = (name.split(".").pop() || "bin").toLowerCase();
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const folder =
    purpose === "content-asset"
      ? "resources"
      : purpose === "content-thumbnail"
        ? "content"
        : "newsletter";
  const path = `${folder}/${stamp}-${rand}.${ext}`;

  try {
    const blob = await put(path, file, {
      access: "public",
      contentType: normalizedMime,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
