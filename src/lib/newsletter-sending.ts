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

// Optional by owner decision (2026-07-27). When unset the footer omits the
// postal line. Sending without it is not CAN-SPAM compliant.
export function newsletterPostalAddress(): string {
  return (process.env.NEWSLETTER_POSTAL_ADDRESS || "").trim();
}
