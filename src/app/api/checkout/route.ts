import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { listShippedPortalSkills } from "@/lib/portal-skills";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = body.email as string | undefined;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    request.headers.get("origin") ||
    "https://muditek.com";

  const sql = getDb();
  const [paidShelf] = await sql`
    SELECT COUNT(*)::int AS count
    FROM content_items
    WHERE is_free = false
  `;
  const paidSkillCount = listShippedPortalSkills().filter((skill) => !skill.is_free).length;

  if ((paidShelf?.count ?? 0) + paidSkillCount === 0) {
    return NextResponse.json(
      { error: "MudiKit checkout is paused while the paid library is being loaded." },
      { status: 409 }
    );
  }

  const url = await createCheckoutSession(baseUrl, email);

  return NextResponse.json({ url });
}
