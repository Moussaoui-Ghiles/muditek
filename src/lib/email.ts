import { Resend } from "resend";

const FROM = "Ghiles <resources@mail.ghiless.com>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Send a single resource email. Returns the Resend email ID for tracking.
 */
export async function sendResourceEmail(
  to: string,
  resourceTitle: string,
  resourceUrl: string
): Promise<string> {
  const { data, error } = await getResend().emails.send({
    from: FROM,
    to,
    subject: `${resourceTitle} — Here's your resource`,
    html: buildEmailHtml(resourceTitle, resourceUrl),
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
  if (!data?.id) throw new Error("Resend returned no email ID");

  return data.id;
}

/**
 * Send resource emails in batch (up to 100). Returns array of Resend email IDs.
 */
export async function sendResourceEmailBatch(
  recipients: { to: string; resourceTitle: string; resourceUrl: string }[]
): Promise<{ id: string; to: string }[]> {
  if (recipients.length === 0) return [];

  const resend = getResend();
  const results: { id: string; to: string }[] = [];

  // Resend batch limit is 100
  const chunks = [];
  for (let i = 0; i < recipients.length; i += 100) {
    chunks.push(recipients.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    const { data, error } = await resend.batch.send(
      chunk.map((r) => ({
        from: FROM,
        to: r.to,
        subject: `${r.resourceTitle} — Here's your resource`,
        html: buildEmailHtml(r.resourceTitle, r.resourceUrl),
      }))
    );

    if (error) throw new Error(`Resend batch error: ${error.message}`);

    if (data?.data) {
      for (let i = 0; i < data.data.length; i++) {
        results.push({ id: data.data[i].id, to: chunk[i].to });
      }
    }
  }

  return results;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(resourceTitle: string, resourceUrl: string): string {
  const safeTitle = escapeHtml(resourceTitle);
  const safeUrl = escapeHtml(resourceUrl);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <h2 style="margin: 0 0 16px; font-size: 22px; color: #111;">Here's your resource</h2>
      <p style="margin: 0 0 24px; font-size: 16px; color: #444; line-height: 1.5;">
        Thanks for engaging with the post. Your copy of <strong>${safeTitle}</strong> is ready.
      </p>
      <a href="${safeUrl}"
         style="display: inline-block; padding: 12px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 500;">
        Download Resource
      </a>
      <p style="margin: 32px 0 0; font-size: 13px; color: #999;">
        You're receiving this because you submitted your email on a MudiKit page.
      </p>
    </div>
  `;
}
