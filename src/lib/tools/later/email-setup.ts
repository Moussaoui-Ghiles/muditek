import { makeDmarcRecord } from "../dns";

export type MailPlatform = "google-workspace" | "microsoft-365";

export const MAIL_PLATFORM_CONFIG = {
  "google-workspace": {
    name: "Google Workspace",
    spf: "v=spf1 include:_spf.google.com ~all",
    sourceUrl: "https://support.google.com/a/answer/10685027",
    dmarcSourceUrl: "https://support.google.com/a/answer/2466580",
  },
  "microsoft-365": {
    name: "Microsoft 365",
    spf: "v=spf1 include:spf.protection.outlook.com -all",
    sourceUrl: "https://learn.microsoft.com/en-us/defender-office-365/email-authentication-spf-configure",
    dmarcSourceUrl: "https://learn.microsoft.com/en-us/defender-office-365/email-authentication-dmarc-configure",
  },
} as const;

export function buildEmailAuthenticationSetup(platform: MailPlatform, policy: "none" | "quarantine" | "reject", reportEmail: string) {
  const config = MAIL_PLATFORM_CONFIG[platform];
  return {
    ...config,
    dmarc: makeDmarcRecord({ policy, percentage: 100, aggregateEmail: reportEmail.trim() || undefined }),
    checklist: [
      "Inventory every service that sends mail for the domain.",
      "Keep one SPF record. Merge approved senders instead of publishing a second SPF record.",
      `Enable DKIM in ${config.name} and publish the exact provider-supplied DNS record.`,
      "Publish DMARC at _dmarc on the domain.",
      "Review authentication reports before increasing enforcement.",
    ],
  };
}
