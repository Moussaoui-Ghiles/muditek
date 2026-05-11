import { getDb } from "@/lib/db";
import { containsInlineImages, htmlToPlainText, wrapIssueHtml } from "@/lib/newsletter-html";
import { Resend } from "resend";

export { containsInlineImages, htmlToPlainText, wrapIssueHtml } from "@/lib/newsletter-html";

export const NEWSLETTER_FROM =
  process.env.NEWSLETTER_FROM || "Ghiles <resources@mail.ghiless.com>";
export const NEWSLETTER_REPLY_TO =
  process.env.NEWSLETTER_REPLY_TO || "ghiles@ghiless.com";

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function ensureUniqueSlug(base: string): Promise<string> {
  const sql = getDb();
  let slug = slugify(base) || "issue";
  let n = 1;
  while (true) {
    const exist = await sql`SELECT 1 FROM newsletter_issues WHERE slug = ${slug} LIMIT 1`;
    if (exist.length === 0) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export function renderIssueHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push("<br/>");
      continue;
    }
    if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h1 style="font-size:26px;margin:32px 0 12px;color:#111;">${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2 style="font-size:20px;margin:24px 0 10px;color:#111;">${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3 style="font-size:17px;margin:20px 0 8px;color:#111;">${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push(`<ul style="margin:0 0 14px;padding-left:20px;color:#1a1a1a;line-height:1.7;font-size:16px;">`); inList = true; }
      out.push(`<li style="margin:0 0 6px;">${renderInline(line.slice(2))}</li>`);
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p style="margin:0 0 14px;font-size:16px;color:#1a1a1a;line-height:1.7;">${renderInline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function renderInline(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}" style="color:#111;text-decoration:underline;">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/_([^_]+)_/g, "<em>$1</em>");
  return s;
}

type ActiveSub = {
  id: string;
  email: string;
  unsub_token: string;
};

export async function listActiveSubscribers(audienceFilter?: string | null): Promise<ActiveSub[]> {
  const sql = getDb();
  if (audienceFilter === "HOT" || audienceFilter === "WARM" || audienceFilter === "COLD") {
    const rows = await sql`
      SELECT id, email, unsub_token FROM newsletter_subscribers
      WHERE status = 'active' AND segment = ${audienceFilter}
    `;
    return rows as ActiveSub[];
  }
  const rows = await sql`
    SELECT id, email, unsub_token FROM newsletter_subscribers
    WHERE status = 'active'
  `;
  return rows as ActiveSub[];
}

export async function sendIssue(issueId: string, baseUrl: string): Promise<{ sent: number; failed: number }> {
  const sql = getDb();
  const issueRows = await sql`
    SELECT id, subject, html, slug, audience_filter, status
    FROM newsletter_issues WHERE id = ${issueId} LIMIT 1
  `;
  if (issueRows.length === 0) throw new Error("Issue not found");
  const issue = issueRows[0];
  if (issue.status === "sent") throw new Error("Already sent");
  const bodyHtml = String(issue.html ?? "").trim();
  if (!bodyHtml || bodyHtml === "<p></p>") throw new Error("Issue has no body");
  if (containsInlineImages(bodyHtml)) {
    throw new Error("Issue contains inline images. Configure Vercel Blob or replace them with hosted image URLs before sending.");
  }

  const subs = await listActiveSubscribers(issue.audience_filter);
  if (subs.length === 0) throw new Error("No active subscribers for this audience");

  const resend = getResend();
  let sent = 0;
  let failed = 0;
  const chunkSize = 100;

  for (let i = 0; i < subs.length; i += chunkSize) {
    const chunk = subs.slice(i, i + chunkSize);
    const emails = chunk.map((s) => {
      const unsubUrl = `${baseUrl}/api/newsletter/unsubscribe/${s.unsub_token}`;
      const prefsUrl = `${baseUrl}/preferences/${s.unsub_token}`;
      const html = wrapIssueHtml(issue.html ?? "", { unsubUrl, prefsUrl });
      const text = `${htmlToPlainText(issue.html ?? "")}\n\n--\nMuditek · Ghiles Moussaoui\nManage preferences: ${prefsUrl}\nUnsubscribe: ${unsubUrl}`;
      return {
        from: NEWSLETTER_FROM,
        replyTo: NEWSLETTER_REPLY_TO,
        to: s.email,
        subject: issue.subject,
        html,
        text,
        tags: [
          { name: "newsletter_issue_id", value: issueId },
          { name: "newsletter_subscriber_id", value: s.id },
        ],
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>, <mailto:unsubscribe@muditek.com?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "List-ID": `Muditek Newsletter <newsletter.muditek.com>`,
          "Precedence": "bulk",
          "X-Entity-Ref-ID": `${issueId}-${s.id}`,
        },
      };
    });

    try {
      const result = await resend.batch.send(emails);
      const items: any[] = (result as any)?.data?.data ?? [];
      for (let k = 0; k < chunk.length; k++) {
        const sub = chunk[k];
        const emailId = items[k]?.id ?? null;
        sent += 1;
        try {
          await sql`
            INSERT INTO newsletter_events (subscriber_id, issue_id, email, event, resend_email_id)
            VALUES (${sub.id}, ${issueId}, ${sub.email}, 'sent', ${emailId})
          `;
        } catch {}
      }
    } catch {
      failed += chunk.length;
    }
  }

  await sql`
    UPDATE newsletter_issues
    SET status = 'sent', sent_at = NOW(), stats = ${JSON.stringify({ sent, failed })}::jsonb
    WHERE id = ${issueId}
  `;

  return { sent, failed };
}
