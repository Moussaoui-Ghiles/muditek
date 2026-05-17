export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  download_url: string;
  file_type: string;
  thumbnail_url: string | null;
  is_new: boolean;
  is_free: boolean;
  created_at: Date | string;
  updated_at?: Date | string | null;
}

export function categoryLabel(category: string): string {
  const value = category.trim().toLowerCase();
  if (value === "tool") return "Scorecard";
  if (value === "automation") return "Automation";
  if (value === "template") return "Template";

  return category
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatContentDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
}

export type PortalAssetKind = "skills" | "playbooks" | "tools";

export const PLAYBOOK_RESOURCE_CATEGORIES = [
  "playbook",
  "guide",
  "tool",
  "automation",
  "template",
] as const;

export function isPlaybookResourceCategory(category: string): boolean {
  const value = (category ?? "").trim().toLowerCase();
  return PLAYBOOK_RESOURCE_CATEGORIES.includes(
    value as (typeof PLAYBOOK_RESOURCE_CATEGORIES)[number]
  );
}

export function categoryPortalPath(category: string): PortalAssetKind {
  const value = (category ?? "").trim().toLowerCase();
  if (value === "skill") return "skills";
  return "playbooks";
}

export function resourceDetailHref(item: Pick<ContentItem, "slug" | "category">): string {
  return `/portal/${categoryPortalPath(item.category)}/${encodeURIComponent(item.slug)}`;
}

export function resourceShareHref(item: Pick<ContentItem, "slug">): string {
  return `/r/${item.slug}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
