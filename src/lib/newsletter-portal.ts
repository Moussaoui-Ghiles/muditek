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

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function isUtilityNewsletterImage(src: string): boolean {
  const value = src.toLowerCase();
  return (
    value.startsWith("data:") ||
    value.includes("/user/profile_picture/") ||
    value.includes("/advertiser/logo/") ||
    value.includes("tracking") ||
    value.includes("pixel") ||
    value.includes("spacer") ||
    value.includes("1x1")
  );
}

function imageScore(src: string): number {
  const value = src.toLowerCase();
  let score = 0;
  if (value.includes("/uploads/asset/file/")) score += 50;
  if (value.includes("thumbnail")) score += 20;
  if (value.includes("hero")) score += 16;
  if (value.includes("chatgpt_image")) score += 10;
  if (/\.(png|jpe?g|webp)(?:\?|$)/.test(value)) score += 6;
  return score;
}

export function extractNewsletterThumbnailFromHtml(html: string | null | undefined): string | null {
  if (!html) return null;

  const images = Array.from(html.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi))
    .map((match) => decodeHtmlAttribute(match[1]?.trim() ?? ""))
    .filter(Boolean)
    .filter((src) => /^https?:\/\//i.test(src))
    .filter((src) => !isUtilityNewsletterImage(src));

  if (images.length === 0) return null;

  return images
    .map((src, index) => ({ src, score: imageScore(src), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.src ?? null;
}
