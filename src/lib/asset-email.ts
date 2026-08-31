import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "@/lib/newsletter";
import { htmlToPlainText } from "@/lib/newsletter-html";
import { sendFreeWelcomeEmail } from "@/lib/email-templates";

/**
 * Email-gated asset delivery. A visitor gives an email on a public skill or
 * playbook page; we subscribe them (source `asset:<slug>`), enroll the welcome
 * sequence, and email them a signed download/read link. The signed token lets
 * the download route serve non-free skill packages without a session.
 */

function assetSecret(): string {
  return (
    process.env.ASSET_LINK_SECRET ||
    process.env.CRON_SECRET ||
    "muditek-asset-link"
  );
}

export function assetDownloadToken(slug: string, email: string): string {
  return createHmac("sha256", assetSecret())
    .update(`${slug.trim().toLowerCase()}|${email.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyAssetDownloadToken(
  slug: string,
  email: string,
  token: string,
): boolean {
  if (!token || token.length !== 32) return false;
  return assetDownloadToken(slug, email) === token;
}

export interface AssetEmailInput {
  email: string;
  slug: string;
  title: string;
  kind: "skill" | "playbook";
  /** Absolute or site-relative URL the email links to. */
  linkPath: string;
  baseUrl?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function subscribeAndSendAsset({
  email,
  slug,
  title,
  kind,
  linkPath,
  baseUrl,
}: AssetEmailInput): Promise<void> {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedBaseUrl = (
    baseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://muditek.com"
  ).replace(/\/$/, "");

  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics)
    VALUES (
      ${normalizedEmail},
      ${`asset:${slug}`.slice(0, 50)},
      ARRAY['ai-agents','gtm-systems','solo-operator']
    )
    ON CONFLICT (email) DO NOTHING
  `;
  await sql`
    UPDATE newsletter_subscribers
    SET status = 'active', unsub_at = NULL
    WHERE email = ${normalizedEmail}
  `;

  const subscriberRows = await sql`
    SELECT unsub_token FROM newsletter_subscribers
    WHERE lower(email) = ${normalizedEmail} LIMIT 1
  `;
  const unsubToken = subscriberRows[0]?.unsub_token as string | undefined;
  const unsubscribeUrl = unsubToken
    ? `${normalizedBaseUrl}/api/newsletter/unsubscribe/${unsubToken}`
    : `${normalizedBaseUrl}/newsletter`;

  const link = linkPath.startsWith("http")
    ? linkPath
    : `${normalizedBaseUrl}${linkPath}`;

  const noun = kind === "skill" ? "skill package" : "playbook";
  const subject = `Your ${noun}: ${title}`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111;">
      <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#1a1a1a;">Here is the ${noun} you asked for.</p>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.65;"><a href="${escapeHtml(link)}" style="color:#111;text-decoration:underline;">${escapeHtml(title)}</a></p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#1a1a1a;">This link is yours. It keeps working, so you can come back to it whenever you need it.</p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:#1a1a1a;">If you hit a problem running it, reply to this email and tell me what happened. I read every reply.</p>
      <p style="margin:32px 0 0;font-size:15px;color:#444;line-height:1.6;">Ghiles</p>
      <hr style="border:none;border-top:1px solid #eee;margin:28px 0 18px;" />
      <p style="margin:0;font-size:12px;color:#777;line-height:1.6;">
        You received this because you asked for a Muditek resource by email.
        <a href="${escapeHtml(unsubscribeUrl)}" style="color:#555;">Unsubscribe</a>
      </p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to: normalizedEmail,
    subject,
    html,
    text: htmlToPlainText(html),
    tags: [{ name: "asset_delivery", value: slug.slice(0, 50) }],
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) throw new Error(`Asset email failed: ${error.message}`);

  try {
    await sql`
      INSERT INTO email_log (email, type, subject, resend_email_id)
      VALUES (${normalizedEmail}, ${`asset-delivery:${slug}`.slice(0, 80)}, ${subject}, NULL)
    `;
  } catch {
    /* logging never blocks delivery */
  }

  // Enroll the welcome sequence (no-op if already enrolled).
  try {
    await sendFreeWelcomeEmail(normalizedEmail, null, normalizedBaseUrl);
  } catch {
    /* enrollment failure never blocks asset delivery */
  }
}
