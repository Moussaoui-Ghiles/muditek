import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { createBillingPortalSession } from "@/lib/stripe";

export async function GET() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  const sql = getDb();

  const subscribers = await sql`
    SELECT stripe_customer_id FROM subscribers
    WHERE email = ${email} AND status = 'active'
  `;

  if (subscribers.length === 0 || !subscribers[0].stripe_customer_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 404 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://linkingin.vercel.app";

  const url = await createBillingPortalSession(
    subscribers[0].stripe_customer_id,
    `${baseUrl}/portal`
  );

  return NextResponse.redirect(url);
}
