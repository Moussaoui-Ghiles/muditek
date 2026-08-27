function downloadFileName(header: string | null, href: string) {
  const encoded = header?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const quoted = header?.match(/filename="([^"]+)"/i)?.[1];
  const plain = header?.match(/filename=([^;]+)/i)?.[1]?.trim();
  const fromHeader = encoded ? decodeURIComponent(encoded) : quoted ?? plain;
  if (fromHeader) return fromHeader;
  const slug = href.match(/\/skills\/([^/]+)\/download/)?.[1] ?? "muditek-skill";
  return `${slug}.tar`;
}

export async function fetchSkillBundle(
  href: string,
  request: typeof fetch = fetch,
): Promise<{ blob: Blob; fileName: string } | null> {
  const response = await request(href, { credentials: "same-origin" });
  if (!response.ok) return null;
  const blob = await response.blob();
  if (blob.size === 0) return null;
  return {
    blob,
    fileName: downloadFileName(response.headers.get("content-disposition"), href),
  };
}

export async function completeSkillDownload(
  href: string,
  onSuccess: (payload: { blob: Blob; fileName: string }) => void | Promise<void>,
  request: typeof fetch = fetch,
): Promise<boolean> {
  const payload = await fetchSkillBundle(href, request);
  if (!payload) return false;
  await onSuccess(payload);
  return true;
}
