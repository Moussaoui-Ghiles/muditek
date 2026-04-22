import { NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email-templates";
import { ensureClerkUserByEmail } from "@/lib/clerk-admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook verification failed: ${err}` },
      { status: 400 }
    );
  }

  const sql = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const email = session.customer_details?.email || session.customer_email;
      const name = session.customer_details?.name || null;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!email) break;

      let clerkUserId: string | null = null;
      try {
        clerkUserId = await ensureClerkUserByEmail(email, name);
      } catch (err) {
        console.error("stripe webhook: failed to ensure Clerk user", err);
      }

      await sql`
        INSERT INTO subscribers (email, name, stripe_customer_id, stripe_subscription_id, status, clerk_user_id)
        VALUES (${email}, ${name}, ${customerId}, ${subscriptionId}, 'active', ${clerkUserId})
        ON CONFLICT (email) DO UPDATE
        SET stripe_customer_id = ${customerId},
            stripe_subscription_id = ${subscriptionId},
            status = 'active',
            name = COALESCE(${name}, subscribers.name),
            clerk_user_id = COALESCE(${clerkUserId}, subscribers.clerk_user_id),
            cancelled_at = NULL
      `;

      if (clerkUserId) {
        await sql`
          UPDATE newsletter_subscribers
          SET clerk_user_id = ${clerkUserId}
          WHERE email = ${email} AND clerk_user_id IS NULL
        `;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://muditek.com";
      await sendWelcomeEmail(email, name || "there", baseUrl);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const periodEnd = (subscription as unknown as Record<string, unknown>).current_period_end as number | undefined;

      const status = subscription.status === "active"
        ? "active"
        : subscription.status === "past_due"
          ? "past_due"
          : "cancelled";

      if (periodEnd) {
        await sql`
          UPDATE subscribers
          SET status = ${status}, current_period_end = to_timestamp(${periodEnd})
          WHERE stripe_customer_id = ${customerId}
        `;
      } else {
        await sql`
          UPDATE subscribers
          SET status = ${status}
          WHERE stripe_customer_id = ${customerId}
        `;
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await sql`
        UPDATE subscribers
        SET status = 'cancelled', cancelled_at = NOW()
        WHERE stripe_customer_id = ${customerId}
      `;

      break;
    }
  }

  return NextResponse.json({ received: true });
}
