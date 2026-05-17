export type NewsletterStats = Record<string, unknown> | null | undefined;

export function normalizeNewsletterStats(stats: NewsletterStats): Record<string, unknown> {
  if (!stats || typeof stats !== "object" || Array.isArray(stats)) return {};
  return stats;
}

export function readBooleanFlag(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return null;
}

export function isPortalNewsletterArticle(stats: NewsletterStats): boolean {
  const normalized = normalizeNewsletterStats(stats);
  const explicit =
    readBooleanFlag(normalized.portal_article) ??
    readBooleanFlag(normalized.portalArticle);

  if (explicit !== null) return explicit;
  return String(normalized.source ?? "").toLowerCase() === "beehiiv";
}

export function setPortalNewsletterArticle(
  stats: NewsletterStats,
  portalArticle: boolean,
): Record<string, unknown> {
  return {
    ...normalizeNewsletterStats(stats),
    portal_article: portalArticle,
  };
}
