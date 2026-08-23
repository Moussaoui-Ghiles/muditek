export const NEWSLETTER_CONSENT_STORAGE_KEY = "muditek_newsletter_signup_consent";

export type NewsletterStatus = "active" | "unsubscribed" | null;

export function newsletterActionForAccountCreation(
  consented: boolean,
  currentStatus: NewsletterStatus,
): "none" | "subscribe" {
  if (currentStatus === "unsubscribed") return "none";
  return consented ? "subscribe" : "none";
}
