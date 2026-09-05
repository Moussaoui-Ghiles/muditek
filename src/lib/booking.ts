export const BOOKING_URL = "https://calendly.com/biz-ghiless/30min";

/** Every "Book a call" on the marketing site lands here first: the qualifying form, then Calendly. */
export const BOOK_PATH = "/book";

/**
 * Calendly URL for the step after the form. Name and email are prefilled so the
 * prospect types nothing twice. Colors match the site so the embed does not
 * look like a white box dropped into a navy page.
 */
export function calendlyUrl(input: { name?: string; email?: string; embed?: boolean } = {}): string {
  const url = new URL(BOOKING_URL);
  if (input.name) url.searchParams.set("name", input.name);
  if (input.email) url.searchParams.set("email", input.email);
  if (input.embed) {
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "0b1219");
    url.searchParams.set("text_color", "e4e9ee");
    url.searchParams.set("primary_color", "f59e0b");
  }
  return url.toString();
}
