import { readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { NextResponse } from "next/server";
import { getPublicPlaybook } from "@/lib/public-library";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".pdf": "application/pdf",
  ".md": "text/markdown; charset=utf-8",
};

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const playbook = getPublicPlaybook(slug);
  if (!playbook) return NextResponse.json({ error: "Playbook not found." }, { status: 404 });

  const root = process.cwd();
  const target = join(/* turbopackIgnore: true */ root, playbook.source);
  const rel = relative(root, target);
  if (!rel || rel.startsWith("..") || rel.includes("..\\")) {
    return NextResponse.json({ error: "Invalid source path." }, { status: 400 });
  }

  try {
    const extension = extname(target).toLowerCase();
    const contentType = CONTENT_TYPES[extension];
    if (!contentType) return NextResponse.json({ error: "Unsupported playbook format." }, { status: 415 });

    const headers: Record<string, string> = {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${playbook.slug}${extension}"`,
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    };
    if (extension === ".html") {
      headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; font-src data: https:; media-src https: data:; frame-ancestors 'self'";
    }

    return new NextResponse(new Uint8Array(readFileSync(target)), { headers });
  } catch {
    return NextResponse.json({ error: "Playbook source is unavailable." }, { status: 404 });
  }
}
