import { getDb } from "@/lib/db";

export { containsInlineImages, htmlToPlainText, wrapIssueHtml } from "@/lib/newsletter-html";

export const NEWSLETTER_FROM =
  process.env.NEWSLETTER_FROM ||
  "Ghiles from Muditek <newsletter@mail.ghiless.com>";
export const NEWSLETTER_REPLY_TO =
  process.env.NEWSLETTER_REPLY_TO || "biz@ghiless.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function ensureUniqueSlug(base: string): Promise<string> {
  const sql = getDb();
  let slug = slugify(base) || "issue";
  let n = 1;
  while (true) {
    const exist = await sql`SELECT 1 FROM newsletter_issues WHERE slug = ${slug} LIMIT 1`;
    if (exist.length === 0) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export function renderIssueHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push("<br/>");
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h1 style="font-size:26px;margin:32px 0 12px;color:#111;">${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2 style="font-size:20px;margin:24px 0 10px;color:#111;">${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3 style="font-size:17px;margin:20px 0 8px;color:#111;">${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push(`<ul style="margin:0 0 14px;padding-left:20px;color:#1a1a1a;line-height:1.7;font-size:16px;">`); inList = true; }
      out.push(`<li style="margin:0 0 6px;">${renderInline(line.slice(2))}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p style="margin:0 0 14px;font-size:16px;color:#1a1a1a;line-height:1.7;">${renderInline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function renderInline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}" style="color:#111;text-decoration:underline;">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/_([^_]+)_/g, "<em>$1</em>");
  return s;
}
