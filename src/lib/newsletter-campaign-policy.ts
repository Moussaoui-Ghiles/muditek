export const NEWSLETTER_SAFETY_DEFAULTS = {
  bounceStopRate: 0.035,
  complaintStopRate: 0.0005,
  minimumSample: 100,
} as const;

export type NewsletterSafetyMetrics = {
  sent: number;
  delivered: number;
  bounced: number;
  complained: number;
};

export function campaignRemaining(
  total: number,
  sent: number,
  failed: number,
  suppressed: number,
) {
  return Math.max(0, total - sent - failed - suppressed);
}

export function campaignSafetyStopReason(
  metrics: NewsletterSafetyMetrics,
  config = NEWSLETTER_SAFETY_DEFAULTS,
): string | null {
  const outcomes = metrics.delivered + metrics.bounced;
  if (outcomes < config.minimumSample) return null;

  const bounceRate = metrics.bounced / outcomes;
  const complaintRate = metrics.sent > 0 ? metrics.complained / metrics.sent : 0;
  if (bounceRate >= config.bounceStopRate) {
    return `Automatically paused: bounce rate ${(bounceRate * 100).toFixed(2)}% reached the ${(config.bounceStopRate * 100).toFixed(1)}% safety limit.`;
  }
  if (complaintRate >= config.complaintStopRate) {
    return `Automatically paused: complaint rate ${(complaintRate * 100).toFixed(3)}% reached the ${(config.complaintStopRate * 100).toFixed(2)}% safety limit.`;
  }
  return null;
}

export function isRetryableResendError(name: string | undefined) {
  return [
    "rate_limit_exceeded",
    "internal_server_error",
    "application_error",
    "concurrent_idempotent_requests",
  ].includes(name ?? "");
}
