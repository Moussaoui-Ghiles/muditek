export type HeaderVerdict = {
  source: "authentication-results" | "arc-authentication-results" | "received-spf";
  receiver: string | null;
  mechanism: "spf" | "dkim" | "dmarc" | "received-spf";
  verdict: string;
  raw: string;
};

const VERDICT = /\b(spf|dkim|dmarc)\s*=\s*([a-z0-9_-]+)/gi;

export function parseMessageHeaders(input: string): HeaderVerdict[] {
  const headerBlock = input.replace(/\r\n/g, "\n").split("\n\n", 1)[0] ?? "";
  const unfolded = headerBlock.replace(/\n[ \t]+/g, " ");
  const results: HeaderVerdict[] = [];

  for (const line of unfolded.split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (name === "received-spf") {
      const verdict = value.match(/^([a-z0-9_-]+)/i)?.[1]?.toLowerCase();
      if (verdict) results.push({ source: "received-spf", receiver: null, mechanism: "received-spf", verdict, raw: value });
      continue;
    }
    if (name !== "authentication-results" && name !== "arc-authentication-results") continue;
    const receiver = value.split(";", 1)[0]?.trim() || null;
    for (const match of value.matchAll(VERDICT)) {
      results.push({
        source: name,
        receiver,
        mechanism: match[1].toLowerCase() as "spf" | "dkim" | "dmarc",
        verdict: match[2].toLowerCase(),
        raw: value,
      });
    }
  }
  return results;
}
