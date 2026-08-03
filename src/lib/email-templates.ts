import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { NEWSLETTER_FROM, NEWSLETTER_REPLY_TO } from "@/lib/newsletter";
import { htmlToPlainText } from "@/lib/newsletter-html";
import {
  WELCOME_SEQUENCE,
  WELCOME_SEQUENCE_ENROLLMENT_TYPE,
  welcomeSequenceIdempotencyKey,
} from "@/lib/sequences";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function logEmail(
  email: string,
  type: string,
  subject: string,
  resendEmailId: string | null,
  required = false,
): Promise<void> {
  try {
    const sql = getDb();
    await sql`
      INSERT INTO email_log (email, type, subject, resend_email_id)
      VALUES (${email}, ${type}, ${subject}, ${resendEmailId})
    `;
  } catch (error) {
    if (required) throw error;
    /* logging failures never block non-sequence sends */
  }
}

/**
 * Welcome email sent to newsletter-only signups (free account, no Stripe).
 */
export async function sendFreeWelcomeEmail(
  to: string,
  name: string | null,
  baseUrl: string
): Promise<boolean> {
  const sql = getDb();
  const normalizedEmail = to.trim().toLowerCase();
  const subscriberRows = await sql`
    SELECT unsub_token
    FROM newsletter_subscribers
    WHERE lower(email) = ${normalizedEmail}
      AND status = 'active'
    LIMIT 1
  `;
  const subscriber = subscriberRows[0];
  if (!subscriber?.unsub_token) {
    throw new Error("Welcome email requires an active newsletter subscriber");
  }

  const existingEnrollment = await sql`
    SELECT 1
    FROM email_log
    WHERE lower(email) = ${normalizedEmail}
      AND type = ${WELCOME_SEQUENCE_ENROLLMENT_TYPE}
    LIMIT 1
  `;
  if (existingEnrollment.length > 0) return false;

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const unsubscribeUrl = `${normalizedBaseUrl}/api/newsletter/unsubscribe/${subscriber.unsub_token}`;
  const preferencesUrl = `${normalizedBaseUrl}/preferences/${subscriber.unsub_token}`;
  const step = WELCOME_SEQUENCE[0];
  const html = step.buildHtml(name || "there", {
    baseUrl: normalizedBaseUrl,
    preferencesUrl,
    unsubscribeUrl,
  });

  const { data, error } = await getResend().emails.send(
    {
      from: NEWSLETTER_FROM,
      replyTo: NEWSLETTER_REPLY_TO,
      to: normalizedEmail,
      subject: step.subject,
      html,
      text: htmlToPlainText(html),
      tags: [{ name: "welcome_sequence_step", value: "1" }],
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-ID": "Muditek Newsletter <newsletter.muditek.com>",
      },
    },
    { idempotencyKey: welcomeSequenceIdempotencyKey(normalizedEmail) },
  );

  if (error) throw new Error(`Welcome email failed: ${error.message}`);
  await logEmail(
    normalizedEmail,
    WELCOME_SEQUENCE_ENROLLMENT_TYPE,
    step.subject,
    data?.id ?? null,
    true,
  );
  return true;
}

/**
 * Admin-only preview of Email 1. It never enrolls the recipient in the live
 * sequence and therefore cannot cause later automated sends.
 */
export async function sendWelcomeSequencePreviewEmail(
  to: string,
  name: string | null,
  baseUrl: string,
): Promise<void> {
  const step = WELCOME_SEQUENCE[0];
  const html = step.buildHtml(name || "there", { baseUrl });
  const { error } = await getResend().emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject: `[TEST] ${step.subject}`,
    html,
    text: htmlToPlainText(html),
    tags: [{ name: "welcome_sequence_preview", value: "true" }],
  });

  if (error) throw new Error(`Welcome preview failed: ${error.message}`);
}

/**
 * Welcome email sent after successful Stripe checkout.
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  baseUrl: string
): Promise<void> {
  const portalUrl = `${baseUrl}/portal`;
  const safeName = escapeHtml(name);
  const subject = "Your MudiKit is ready";

  const { data, error } = await getResend().emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">Welcome, ${safeName}</h2>
        <p style="margin: 0 0 8px; font-size: 16px; color: #444; line-height: 1.6;">
          Your MudiKit subscription is active. Everything you need is in your portal.
        </p>
        <p style="margin: 0 0 24px; font-size: 16px; color: #444; line-height: 1.6;">
          Paid skills and resource drops appear in the portal when they ship. You'll get an email each time.
        </p>
        <a href="${escapeHtml(portalUrl)}"
           style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Log In to Your Portal
        </a>
        <p style="margin: 24px 0 0; font-size: 14px; color: #666; line-height: 1.5;">
          Log in with the same email you used to subscribe. Your content is waiting.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="margin: 0; font-size: 13px; color: #999;">
          Manage your subscription anytime from inside the portal.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(`Welcome email failed: ${error.message}`);
  await logEmail(to, "welcome", subject, data?.id ?? null);
}

/**
 * Send a nurture sequence email.
 */
export async function sendSequenceEmail(
  to: string,
  subject: string,
  bodyHtml: string,
  step?: number,
  unsubscribeUrl?: string,
): Promise<void> {
  const { data, error } = await getResend().emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject,
    html: bodyHtml,
    text: htmlToPlainText(bodyHtml),
    tags: step ? [{ name: "welcome_sequence_step", value: String(step) }] : undefined,
    headers: unsubscribeUrl
      ? {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "List-ID": "Muditek Newsletter <newsletter.muditek.com>",
        }
      : undefined,
  });

  if (error) throw new Error(`Sequence email failed: ${error.message}`);
  await logEmail(
    to,
    step ? `welcome-sequence-v1-e${step}` : "nurture",
    subject,
    data?.id ?? null,
  );
}

/**
 * Send drop notification to a subscriber.
 */
export async function sendDropNotification(
  to: string,
  name: string,
  dropTitle: string,
  _unused: string,
  baseUrl: string
): Promise<void> {
  const portalUrl = `${baseUrl}/portal`;
  const safeName = escapeHtml(name);
  const safeTitle = escapeHtml(dropTitle);
  const subject = `New drop: ${dropTitle}`;

  const { data, error } = await getResend().emails.send({
    from: NEWSLETTER_FROM,
    replyTo: NEWSLETTER_REPLY_TO,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">New content just dropped</h2>
        <p style="margin: 0 0 8px; font-size: 16px; color: #444; line-height: 1.6;">
          Hey ${safeName}, <strong>${safeTitle}</strong> is now available in your portal.
        </p>
        <p style="margin: 0 0 24px; font-size: 16px; color: #444; line-height: 1.6;">
          Log in and grab it.
        </p>
        <a href="${escapeHtml(portalUrl)}"
           style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Open Portal
        </a>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="margin: 0; font-size: 13px; color: #999;">
          You're receiving this because you're subscribed to MudiKit.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(`Drop notification failed: ${error.message}`);
  await logEmail(to, "drop", subject, data?.id ?? null);
}
