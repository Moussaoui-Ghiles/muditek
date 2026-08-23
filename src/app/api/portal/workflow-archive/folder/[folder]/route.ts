import { NextResponse } from "next/server";
import JSZip from "jszip";
import { requireAdmin } from "@/lib/admin-auth";
import { getWorkflowsInFolder } from "@/lib/workflow-archive";

export const dynamic = "force-dynamic";

function safeFileName(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._\- ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100) || "workflow";
}

export async function GET(request: Request, { params }: { params: Promise<{ folder: string }> }) {
  const { folder } = await params;
  const admin = await requireAdmin(request);
  if (!admin.authorized) return admin.response;

  const decoded = decodeURIComponent(folder).trim();
  if (!decoded) return NextResponse.json({ error: "folder required" }, { status: 400 });

  const items = await getWorkflowsInFolder(decoded);
  if (!items.length) return NextResponse.json({ error: "not found" }, { status: 404 });

  const zip = new JSZip();
  const used = new Set<string>();
  for (const it of items) {
    const base = safeFileName(it.title || it.slug);
    let name = `${base}.json`;
    let i = 2;
    while (used.has(name)) {
      name = `${base} (${i}).json`;
      i += 1;
    }
    used.add(name);
    zip.file(name, JSON.stringify(it.raw_json, null, 2));
  }

  const buf = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
  const filename = safeFileName(decoded) + ".zip";

  // Cast to satisfy NextResponse body type for binary payload.
  return new NextResponse(buf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=300",
      "Content-Length": String(buf.byteLength),
    },
  });
}
