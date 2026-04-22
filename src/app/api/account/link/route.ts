import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { sendFreeWelcomeEmail } from "@/lib/email-templates";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const sql = getDb();
  const existing = await sql`
    SELECT id, clerk_user_id FROM newsletter_subscribers WHERE email = ${email}
  `;

  let isNew = false;
  if (existing.length === 0) {
    await sql`
      INSERT INTO newsletter_subscribers (email, source, topics, clerk_user_id)
      VALUES (${email}, 'sign-up', ARRAY['ai-agents','gtm-systems','solo-operator'], ${userId})
    `;
    isNew = true;
  } else {
    await sql`
      UPDATE newsletter_subscribers
      SET clerk_user_id = ${userId}, status = 'active', unsub_at = NULL
      WHERE email = ${email} AND (clerk_user_id IS NULL OR clerk_user_id = ${userId})
    `;
  }

  if (isNew) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
    try {
      await sendFreeWelcomeEmail(email, user?.firstName || null, baseUrl);
    } catch (err) {
      console.error("account/link: welcome email failed", err);
    }
  }

  return NextResponse.json({ ok: true, new: isNew });
}
