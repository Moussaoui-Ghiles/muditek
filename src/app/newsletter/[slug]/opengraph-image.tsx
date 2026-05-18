import { neon } from "@neondatabase/serverless";
import { OG_SIZE, OG_CONTENT_TYPE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Muditek newsletter issue";

interface IssueRow {
  subject: string;
  stats: {
    tldr?: string | null;
    preview?: string | null;
    portal_article?: boolean | string;
    portalArticle?: boolean | string;
    source?: string;
  } | null;
}

async function getIssue(slug: string): Promise<IssueRow | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = (await sql`
      SELECT subject, stats
      FROM newsletter_issues
      WHERE slug = ${slug}
        AND status = 'sent'
        AND html IS NOT NULL
        AND length(trim(html)) > 0
        AND (
          stats->>'portal_article' = 'true'
          OR stats->>'portalArticle' = 'true'
        )
      LIMIT 1
    `) as IssueRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

function trim(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) {
    return ogImage({
      accent: "primary",
      eyebrow: "Newsletter",
      title: "Muditek B2B Agents Newsletter",
      subtitle:
        "Weekly playbooks for AI operators, B2B operators, and investment professionals. 5,000+ subscribers.",
    });
  }
  const tldr = issue.stats?.tldr ?? issue.stats?.preview ?? "";
  return ogImage({
    accent: "primary",
    eyebrow: "Newsletter",
    title: trim(issue.subject, 110),
    subtitle: tldr ? trim(tldr, 180) : "Muditek B2B Agents Newsletter. Read by 5,000+ operators.",
  });
}
