import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function safeResourceTarget(value: unknown): string {
  if (typeof value !== "string") return "/portal";
  const target = value.trim();
  if (!target) return "/portal";

  if (target.startsWith("/resources/")) {
    const slug = target.replace(/^\/resources\/?/, "").split(/[?#]/)[0];
    return slug ? `/portal/playbooks/${slug}` : "/portal/playbooks";
  }

  if (target.startsWith("/")) return target;

  try {
    const url = new URL(target);
    if (["muditek.com", "www.muditek.com"].includes(url.hostname)) {
      return safeResourceTarget(`${url.pathname}${url.search}`);
    }
  } catch {
    return "/portal";
  }

  return "/portal";
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return notFound();
  }

  const sql = getDb();
  const campaigns = await sql`
    SELECT resource_url
    FROM campaigns
    WHERE id = ${id}
  `;

  const campaign = campaigns[0];
  if (!campaign) return notFound();

  redirect(safeResourceTarget(campaign.resource_url));
}
