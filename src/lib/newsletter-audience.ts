export const NEWSLETTER_AUDIENCE_FILTERS = [
  "OUTBOUND_INTEREST",
  "PORTAL_ACTIVE_30D",
  "RECENT_90D",
  "ENGAGED",
  "UNSEGMENTED",
  "HOT",
  "WARM",
  "COLD",
] as const;

export type NewsletterAudienceFilter =
  (typeof NEWSLETTER_AUDIENCE_FILTERS)[number];

export function isNewsletterAudienceFilter(
  value: unknown,
): value is NewsletterAudienceFilter {
  return (
    typeof value === "string" &&
    NEWSLETTER_AUDIENCE_FILTERS.includes(value as NewsletterAudienceFilter)
  );
}
