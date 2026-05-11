export function safeRedirectUrl(value: string | string[] | null | undefined): string {
  const redirectUrl = Array.isArray(value) ? value[0] : value;
  if (!redirectUrl) return "/portal";
  if (!redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) return "/portal";
  return redirectUrl;
}
