import { existsSync, readdirSync } from "fs";
import { join } from "path";

type ThumbnailItem = {
  slug: string;
  thumbnail_url: string | null;
};

export function withDerivedThumbnail<T extends ThumbnailItem>(item: T): T {
  if (item.thumbnail_url) return item;

  const dir = join(process.cwd(), "content/downloads/playbooks", item.slug);
  const preferred = ["page-1.jpg", "page-01.jpg", "page-001.jpg"];
  const preferredFile = preferred.find((file) => existsSync(join(dir, file)));
  if (preferredFile) {
    return {
      ...item,
      thumbnail_url: `/api/portal/resources/${item.slug}/page/${preferredFile}`,
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
      return {
        ...item,
        thumbnail_url: `/api/portal/covers/${item.slug}`,
      };
    }

    return {
      ...item,
      thumbnail_url: `/api/portal/resources/${item.slug}/page/${firstPage}`,
    };
  } catch {
    return {
      ...item,
      thumbnail_url: `/api/portal/covers/${item.slug}`,
    };
  }
}

export function withDerivedThumbnails<T extends ThumbnailItem>(items: T[]): T[] {
  return items.map((item) => withDerivedThumbnail(item));
}
