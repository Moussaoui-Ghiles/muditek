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
  "image/svg+xml",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const name = (file as File).name || "upload";
  const mime = file.type || "application/octet-stream";

  if (!ALLOWED_MIME.has(mime)) {
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

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image hosting not configured. Add BLOB_READ_WRITE_TOKEN to Vercel env (Storage → Blob → Connect).",
      },
      { status: 501 },
    );
  }

  const ext = (name.split(".").pop() || "bin").toLowerCase();
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `newsletter/${stamp}-${rand}.${ext}`;

  try {
    const blob = await put(path, file, {
      access: "public",
      contentType: mime,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
