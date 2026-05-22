import { Resend } from "resend";
import { getDb } from "@/lib/db";

const FROM = "Ghiles <resources@mail.ghiless.com>";

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
  resendEmailId: string | null
): Promise<void> {
  try {
    const sql = getDb();
    await sql`
      INSERT INTO email_log (email, type, subject, resend_email_id)
      VALUES (${email}, ${type}, ${subject}, ${resendEmailId})
    `;
  } catch {
    /* logging failures never block sends */
  }
}

/**
 * Welcome email sent to newsletter-only signups (free account, no Stripe).
 */
export async function sendFreeWelcomeEmail(
  to: string,
  name: string | null,
  baseUrl: string
): Promise<void> {
  const portalUrl = `${baseUrl}/portal`;
  const safeName = escapeHtml(name || "there");
  const subject = "Welcome to Muditek. Start with the lead machine.";

  const { data, error } = await getResend().emails.send({
    from: FROM,
    to,
    subject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">You're in, ${safeName}.</h2>
        <p style="margin: 0 0 14px; font-size: 16px; color: #444; line-height: 1.6;">
          Quick orientation. Muditek isn't a tips newsletter. The portal is a stack of systems I've actually deployed, with the architecture and the steps to run them yourself.
        </p>
        <p style="margin: 0 0 8px; font-size: 16px; color: #444; line-height: 1.6;">
          A few worth opening first:
        </p>
        <ul style="margin: 0 0 20px; padding-left: 20px; font-size: 16px; color: #444; line-height: 1.7;">
          <li><strong>Google Maps Outbound:</strong> 2,000 leads a day for $10/month.</li>
          <li><strong>OpenClaw Outbound:</strong> 300K cold emails a month, 153 calls booked, $1,200 total cost.</li>
          <li><strong>The Chief of Staff Blueprint:</strong> 7 text files that replaced a $75K/year EA.</li>
        </ul>
        <p style="margin: 0 0 24px; font-size: 16px; color: #444; line-height: 1.6;">
          That's three of fifteen. Playbooks, setup guides, live lead tools, and the full newsletter archive are all in there under one login.
        </p>
        <a href="${escapeHtml(portalUrl)}"
           style="display: inline-block; padding: 14px 28px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">
          Open your portal
        </a>
        <p style="margin: 24px 0 0; font-size: 16px; color: #444; line-height: 1.6;">
          Pick one system and get it running this week. Reply if you get stuck. I read every email.
        </p>
        <p style="margin: 24px 0 0; font-size: 14px; color: #666; line-height: 1.5;">
          - Ghiles
        </p>
        <p style="margin: 16px 0 0; font-size: 14px; color: #666; line-height: 1.5;">
          Unsubscribe any time from the footer of any email.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(`Welcome email failed: ${error.message}`);
  await logEmail(to, "free-welcome", subject, data?.id ?? null);
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
    from: FROM,
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
  step?: number
): Promise<void> {
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to,
    subject,
    html: bodyHtml,
  });

  if (error) throw new Error(`Sequence email failed: ${error.message}`);
  await logEmail(to, step ? `nurture-step-${step}` : "nurture", subject, data?.id ?? null);
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
    from: FROM,
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
