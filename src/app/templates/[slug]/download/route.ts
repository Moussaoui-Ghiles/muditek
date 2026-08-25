import { notFound } from "next/navigation";
import {
  getRenderableAcquisitionPage,
  getRenderableAcquisitionPages,
  readAcquisitionMarkdown,
} from "../../../../lib/acquisition/content-registry";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getRenderableAcquisitionPages(["template"]).map((page) => ({ slug: page.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getRenderableAcquisitionPage("template", slug);
  if (!page) notFound();
  return new Response(readAcquisitionMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${page.slug}.md"`,
      "Cache-Control": page.status === "published" ? "public, max-age=3600" : "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
