import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "@/lib/newsletter";
import { htmlToPlainText } from "@/lib/newsletter-html";
import { sendFreeWelcomeEmail } from "@/lib/email-templates";

/**
 * Lead magnet delivery. A visitor opts in on /get/<magnet>; we subscribe
 * them (source `magnet:<slug>`), send the magnet's own custom email, and
 * enroll the welcome sequence. Signed tokens let a skill package download
 * without a session.
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface MagnetDeliveryInput {
  email: string;
  slug: string;
  subject: string;
  /** Rendered HTML of the magnet's custom email body. */
  bodyHtml: string;
  baseUrl?: string;
}

/** Subscribe the email (idempotent), return the unsubscribe URL. */
export async function subscribeForMagnet(
  email: string,
  slug: string,
  baseUrl: string,
): Promise<{ unsubscribeUrl: string }> {
  const sql = getDb();
  const normalizedEmail = email.trim().toLowerCase();
  await sql`
    INSERT INTO newsletter_subscribers (email, source, topics)
    VALUES (
      ${normalizedEmail},
      ${`magnet:${slug}`.slice(0, 50)},
      ARRAY['ai-agents','gtm-systems','solo-operator']
    )
    ON CONFLICT (email) DO NOTHING
  `;
  await sql`
    UPDATE newsletter_subscribers
    SET status = 'active', unsub_at = NULL
    WHERE email = ${normalizedEmail}
  `;
  const rows = await sql`
    SELECT unsub_token FROM newsletter_subscribers
    WHERE lower(email) = ${normalizedEmail} LIMIT 1
  `;
  const token = rows[0]?.unsub_token as string | undefined;
  const base = baseUrl.replace(/\/$/, "");
  return {
    unsubscribeUrl: token
      ? `${base}/api/newsletter/unsubscribe/${token}`
      : `${base}/newsletter`,
  };
}

export async function sendMagnetEmail({
  email,
  slug,
  subject,
  bodyHtml,
  baseUrl,
}: MagnetDeliveryInput): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedBaseUrl = (
    baseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://muditek.com"
  ).replace(/\/$/, "");

  const { unsubscribeUrl } = await subscribeForMagnet(
    normalizedEmail,
    slug,
    normalizedBaseUrl,
  );

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#111;font-size:16px;line-height:1.65;">
      ${bodyHtml}
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
    tags: [{ name: "lead_magnet", value: slug.slice(0, 50) }],
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) throw new Error(`Magnet email failed: ${error.message}`);

  try {
    const sql = getDb();
    await sql`
      INSERT INTO email_log (email, type, subject, resend_email_id)
      VALUES (${normalizedEmail}, ${`magnet:${slug}`.slice(0, 80)}, ${subject}, NULL)
    `;
  } catch {
    /* logging never blocks delivery */
  }

  try {
    await sendFreeWelcomeEmail(normalizedEmail, null, normalizedBaseUrl);
  } catch {
    /* welcome enrollment failure never blocks delivery */
  }
}
