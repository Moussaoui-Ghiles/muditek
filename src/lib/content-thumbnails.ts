import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

type ThumbnailItem = {
  slug: string;
  thumbnail_url: string | null;
};

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractHtmlThumbnail(slug: string): string | null {
  try {
    const html = readFileSync(join(process.cwd(), "content/playbooks", `${slug}.html`), "utf-8");
    const image = Array.from(html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi))
      .map((match) => decodeHtmlAttribute(match[1]?.trim() ?? ""))
      .find((src) => /^https?:\/\//i.test(src));

    return image ?? null;
  } catch {
    return null;
  }
}

export function withDerivedThumbnail<T extends ThumbnailItem>(item: T): T {
  const publicCover = join(process.cwd(), "public/playbooks", item.slug, "cover.svg");
  if (existsSync(publicCover)) {
    return {
      ...item,
      thumbnail_url: `/playbooks/${item.slug}/cover.svg`,
    };
  }

  if (item.thumbnail_url) return item;

  const htmlAsset = join(process.cwd(), "content/playbooks", `${item.slug}.html`);
  if (existsSync(htmlAsset)) {
    return {
      ...item,
      thumbnail_url: `/api/portal/covers/${encodeURIComponent(item.slug)}?v=2`,
    };
  }

  const dir = join(process.cwd(), "content/downloads/playbooks", item.slug);
  const preferred = ["page-1.jpg", "page-01.jpg", "page-001.jpg"];
  const preferredFile = preferred.find((file) => existsSync(join(dir, file)));
  if (preferredFile) {
    return {
      ...item,
      thumbnail_url: `/api/portal/resources/${encodeURIComponent(item.slug)}/page/${encodeURIComponent(preferredFile)}`,
    };
  }

  try {
    const firstPage = readdirSync(dir)
      .filter((file) => /^page-\d+\.jpe?g$/i.test(file))
      .sort((a, b) => {
        const aNum = Number.parseInt(a.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        const bNum = Number.parseInt(b.replace(/^page-/, "").replace(/\.jpe?g$/i, ""), 10);
        return aNum - bNum;
      })[0];

    if (!firstPage) {
      const htmlThumbnail = extractHtmlThumbnail(item.slug);
      if (htmlThumbnail) {
        return {
          ...item,
          thumbnail_url: htmlThumbnail,
        };
      }

      return {
        ...item,
        thumbnail_url: `/api/portal/covers/${encodeURIComponent(item.slug)}?v=2`,
      };
    }

    return {
      ...item,
      thumbnail_url: `/api/portal/resources/${encodeURIComponent(item.slug)}/page/${encodeURIComponent(firstPage)}`,
    };
  } catch {
    const htmlThumbnail = extractHtmlThumbnail(item.slug);
    if (htmlThumbnail) {
      return {
        ...item,
        thumbnail_url: htmlThumbnail,
      };
    }

    return {
      ...item,
      thumbnail_url: `/api/portal/covers/${encodeURIComponent(item.slug)}?v=2`,
    };
  }
}

export function withDerivedThumbnails<T extends ThumbnailItem>(items: T[]): T[] {
  return items.map((item) => withDerivedThumbnail(item));
}
