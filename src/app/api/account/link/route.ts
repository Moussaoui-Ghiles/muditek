import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { ensurePortalMembershipsSchema } from "@/lib/portal-memberships-schema";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const sql = getDb();
  await ensurePortalMembershipsSchema(sql);

  await sql`
    INSERT INTO portal_memberships (email, role)
    VALUES (${email}, 'free')
    ON CONFLICT (email, role) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}
