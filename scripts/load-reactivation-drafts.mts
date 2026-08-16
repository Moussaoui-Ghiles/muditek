// Loads the 3 reactivation emails as drafts (status='draft', audience_filter='HOT').
// Idempotent: upserts by deterministic slug, so re-running updates instead of duplicating.
// Never sends. Run: npx tsx scripts/load-reactivation-drafts.mts
import { loadEnv, PORTAL_URL, SEGMENT, preheader } from "./_campaign-env.mts";
loadEnv();

const { getDb } = await import("@/lib/db");
const { renderIssueHtml } = await import("@/lib/newsletter");
const sql = getDb();

type Email = { slug: string; subject: string; preview: string; markdown: string };

const emails: Email[] = [
  {
    slug: "reactivation-1-one-place",
    subject: "i put it all in one place",
    preview: "the n8n stuff, the templates, all of it. behind one login now.",
    markdown: `hey, been a while.

i went quiet for a few months. not because i ran out of things to send you. because the way i was sending them was a mess. a fresh Drive link in every email, scattered across months, half of them dead or buried in your inbox by now.

so i stopped, and i rebuilt the whole thing.

every system i ever sent you. the n8n workflows, the lead gen, the content engines, the templates. all of it now sits in one place, behind one login, free. plus a lot i never sent.

no more digging through old emails for a link that probably doesn't even work anymore.

that is it for today. next email, i walk you through what is actually inside.

it lives here: [the portal →](${PORTAL_URL})

ghiles`,
  },
  {
    slug: "reactivation-2-whats-inside",
    subject: "1,847 workflows. pick one.",
    preview: "i cleaned 4,273 n8n and Make files into one searchable archive.",
    markdown: `hey,

you originally joined this list for practical automation. not another AI news roundup.

so here is the useful part of what i rebuilt:

i imported 4,273 n8n and Make workflow files, removed the duplicates, and turned the remaining 1,847 into a searchable archive.

search for what you need: lead generation, scraping, CRM, content, reporting. open the workflow, inspect the nodes, and download the actual JSON.

not a screenshot. not a fake template preview. the files.

[search the workflow archive →](https://muditek.com/portal/workflow-archive)

next email, i'll ask whether you actually want me to keep sending these practical builds. if not, i stop.

ghiles`,
  },
  {
    slug: "reactivation-3-keep-sending",
    subject: "should i keep sending these?",
    preview: "choose now: practical builds, or no more email.",
    markdown: `hey,

last check.

from here, this list has one job: one practical AI system per email. a workflow, playbook, or tool you can actually use.

no AI news roundup. no daily noise.

if you want that, confirm here:

[keep me on the list →]({{NEWSLETTER_CONFIRM_URL}})

if you do not click, i will mark you dormant after 7 days and stop emailing you. you can still use the portal. no hard feelings.

ghiles`,
  },
];

for (const e of emails) {
  const html = preheader(e.preview) + "\n" + renderIssueHtml(e.markdown);
  let rows = await sql`
    INSERT INTO newsletter_issues (subject, slug, markdown_src, html, audience_filter, status)
    VALUES (${e.subject}, ${e.slug}, ${e.markdown}, ${html}, ${SEGMENT}, 'draft')
    ON CONFLICT (slug) DO UPDATE SET
      subject = EXCLUDED.subject,
      markdown_src = EXCLUDED.markdown_src,
      html = EXCLUDED.html,
      audience_filter = EXCLUDED.audience_filter,
      updated_at = NOW()
    WHERE newsletter_issues.status = 'draft'
    RETURNING id, slug, subject, status, audience_filter
  `;
  if (rows.length === 0) {
    rows = await sql`
      SELECT id, slug, subject, status, audience_filter
      FROM newsletter_issues
      WHERE slug = ${e.slug}
      LIMIT 1
    `;
  }
  const r = rows[0];
  console.log(`${r.status === "sent" ? "[SENT-LOCKED] " : ""}${r.id}  ${r.audience_filter}  ${r.slug}  |  ${r.subject}`);
}
console.log("\n3 drafts ready (audience=HOT, status=draft). Nothing sent.");
