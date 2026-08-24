export type MailProviderMatch = { provider: string; sourceUrl: string; matchedHost: string };

export const MX_PROVIDER_RULES = [
  { provider: "Google Workspace", suffixes: ["aspmx.l.google.com", ".googlemail.com"], sourceUrl: "https://support.google.com/a/answer/174125" },
  { provider: "Microsoft 365", suffixes: [".mail.protection.outlook.com"], sourceUrl: "https://learn.microsoft.com/en-us/microsoft-365/admin/setup/domains-faq" },
  { provider: "Fastmail", suffixes: [".messagingengine.com"], sourceUrl: "https://www.fastmail.help/hc/en-us/articles/1500000280261" },
  { provider: "Proton Mail", suffixes: ["mail.protonmail.ch", "mailsec.protonmail.ch"], sourceUrl: "https://proton.me/support/mail" },
  { provider: "Zoho Mail", suffixes: ["mx.zoho.com", "mx2.zoho.com", "mx3.zoho.com", ".zoho.eu", ".zoho.in"], sourceUrl: "https://www.zoho.com/mail/help/adminconsole/dns-configuration.html" },
] as const;

export function extractMxHost(record: string): string {
  return record.trim().replace(/^\d+\s+/, "").replace(/\.$/, "").toLowerCase();
}

export function identifyMailProvider(records: string[]): MailProviderMatch | null {
  for (const record of records) {
    const host = extractMxHost(record);
    for (const rule of MX_PROVIDER_RULES) {
      if (rule.suffixes.some((suffix) => suffix.startsWith(".") ? host.endsWith(suffix) : host === suffix || host.endsWith(`.${suffix}`))) {
        return { provider: rule.provider, sourceUrl: rule.sourceUrl, matchedHost: host };
      }
    }
  }
  return null;
}
