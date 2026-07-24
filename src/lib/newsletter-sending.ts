export const NEWSLETTER_MONTHLY_LIMIT = Math.max(
  1,
  Number(process.env.NEWSLETTER_MONTHLY_LIMIT || 50_000),
);

export function newsletterSendingEnabled(): boolean {
  return process.env.NEWSLETTER_EMAILS_ENABLED === "true";
}

export function newsletterTestSendingEnabled(): boolean {
  return (
    newsletterSendingEnabled() ||
    process.env.NEWSLETTER_TEST_EMAILS_ENABLED === "true"
  );
}

export function assertNewsletterSendingEnabled(): void {
  if (!newsletterSendingEnabled()) {
    throw new Error(
      "Newsletter sending is disabled. Set NEWSLETTER_EMAILS_ENABLED=true only after preflight approval.",
    );
  }
}

export function newsletterPostalAddress(): string {
  return (process.env.NEWSLETTER_POSTAL_ADDRESS || "").trim();
}

export function assertNewsletterPostalAddress(): string {
  const address = newsletterPostalAddress();
  if (!address) {
    throw new Error(
      "NEWSLETTER_POSTAL_ADDRESS is required for the marketing email footer.",
    );
  }
  return address;
}
