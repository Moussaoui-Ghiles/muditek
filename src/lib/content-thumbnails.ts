import { existsSync } from "fs";
import { join } from "path";

type ThumbnailItem = {
  slug: string;
  thumbnail_url: string | null;
};

export function withDerivedThumbnail<T extends ThumbnailItem>(item: T): T {
  if (item.thumbnail_url) return item;

  const firstPagePath = join(process.cwd(), "public/playbooks", item.slug, "page-1.jpg");
  if (!existsSync(firstPagePath)) return item;

  return {
    ...item,
    thumbnail_url: `/playbooks/${item.slug}/page-1.jpg`,
  };
}

export function withDerivedThumbnails<T extends ThumbnailItem>(items: T[]): T[] {
  return items.map((item) => withDerivedThumbnail(item));
}
