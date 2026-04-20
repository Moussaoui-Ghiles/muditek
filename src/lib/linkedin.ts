/**
 * Extract the LinkedIn activity ID from a post URL.
 * Used to generate the embed iframe URL.
 *
 * Example:
 *   Input:  https://www.linkedin.com/posts/ghiles-moussaoui-b36218250_269month-3-channels-157-booked-calls-activity-7439399851269808128-MFsW/
 *   Output: 7439399851269808128
 */
export function extractActivityId(postUrl: string): string | null {
  // Match "activity-DIGITS" in the URL
  const match = postUrl.match(/activity[- ](\d{15,25})/);
  return match?.[1] ?? null;
}

/**
 * Build the LinkedIn embed iframe URL from an activity ID.
 */
export function getEmbedUrl(activityId: string): string {
  return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;
}
