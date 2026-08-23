import { buildIndexMarkdown } from "@/lib/publication-index";

export function GET() {
  return new Response(buildIndexMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
