import { marked } from "marked";

export type ArticleHeading = {
  id: string;
  label: string;
};

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function headingId(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

export function cleanLibraryMarkdown(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^#\s+[^\n]+\n+/, "")
    .trim();
}

export function renderLibraryMarkdown(markdown: string): {
  html: string;
  headings: ArticleHeading[];
} {
  const rendered = marked.parse(cleanLibraryMarkdown(markdown), {
    async: false,
    gfm: true,
  }) as string;
  const headings: ArticleHeading[] = [];
  const seen = new Map<string, number>();

  const html = rendered.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, contents: string) => {
    const label = plainText(contents);
    const base = headingId(label);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ id, label });
    return `<h2 id="${id}">${contents}</h2>`;
  });

  return { html, headings };
}
